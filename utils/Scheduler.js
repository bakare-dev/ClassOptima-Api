const XLSX = require('xlsx');
const ExcelJS = require('exceljs');
const axios = require("axios");
const Logger = require('./Logger');
const path = require('path');
const fs = require('fs');
const LevelEventService = require('../services/dataservices/LevelEventService');
const DepartmentEventService = require('../services/dataservices/DepartmentEventService');
const EventVenueService = require('../services/dataservices/EventVenueService');
const { infrastructure } = require('../config/main.settings');

let instance;

class Scheduler {

    #logger;
    #levelEventService;
    #departmentEventService;
    #eventVenueService;

    constructor () {
        
        if (instance) return instance;

        this.#logger = new Logger().getLogger();
        this.#levelEventService = new LevelEventService();
        this.#departmentEventService = new DepartmentEventService();
        this.#eventVenueService = new EventVenueService();


        instance = this;

    }
    
    generateClassTimetable = async (courses, events, department, institution) => {
        try {
            let timetable = {
                Monday: [],
                Tuesday: [],
                Wednesday: [],
                Thursday: [],
                Friday: []
            };
        
            const fileName = `${department.name}-${institution.name}-timetable.json`;
            const jsonFilePath = path.join(__dirname, '../timetables', fileName);
            
            
            if (fs.existsSync(jsonFilePath)) { 
                fs.unlinkSync(jsonFilePath);
            }
    
            let levels;
            let departments;
        
            await Promise.all(events.rows.map(async event => {
                const eventvenue = await this.#eventVenueService.getVenueByEventId(event.id);
                const venue = eventvenue.Venue.venue;
                const recurring = event.recurring;
    
                const levelsEvent = await this.#levelEventService.getLevelsByEventId(event.id);
                levels = levelsEvent.map(item => item.DepartmentId);
    
                const departmentsEvent = await this.#departmentEventService.getDepartmentEvents(event.id)
                departments = departmentsEvent.map(item => item.DepartmentId);
    
                if (recurring) {
                    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
                    days.forEach(day => {
                        if (event.day === day || event.day === "Everyday") {
                            timetable[day].push({
                                event: event.name,
                                venue,
                                startFrom: event.startFrom,
                                endsAt: event.endsAt,
                                departments: departmentsEvent.map(item => item.Department.name),
                                departmentIds: departmentsEvent.map(item => item.DepartmentId),
                                levelIds: levelsEvent.map(item => item.LevelId),
                                levels: levelsEvent.map(item => item.Level.level),
                                day: event.day
                            });
                        }
                    });
                } else {
                    timetable[event.day].push({
                        event: event.name,
                        venue,
                        startFrom: event.startFrom,
                        endsAt: event.endsAt,
                        departments: departmentsEvent.map(item => item.Department.name),
                        departmentIds: departmentsEvent.map(item => item.DepartmentId),
                        levelIds: levelsEvent.map(item => item.LevelId),
                        levels: levelsEvent.map(item => item.Level.level),
                        day: event.day
                    });
                }
            }));

            for (const course of courses) {
                const duration = course.duration;
                const venue = course.Venue.venue;
                const levelId = course.LevelId;
                const departmentId = course.DepartmentId;
    
                if (levels.includes(levelId) || departments.includes(departmentId)) {
                    const availableSlots = this.#findAvailableSlots(timetable, duration, departmentId, venue, levelId);
                    if (availableSlots.length > 0) {
                        const slot = availableSlots[0];
                        timetable[slot.day].push({
                            courseId: course.id,
                            courseCode: course.courseCode,
                            courseName: course.courseName,
                            unit: course.unit,
                            venue,
                            level: course.Level.level,
                            startFrom: slot.startFrom,
                            endsAt: slot.endsAt,
                        });
                    }
                } else {
                    const availableSlots = this.#findAvailableSlots(timetable, duration, departmentId, venue, levelId);
                    if (availableSlots.length > 0) {
                        const slot = availableSlots[0];
                        timetable[slot.day].push({
                            courseId: course.id,
                            courseCode: course.courseCode,
                            courseName: course.courseName,
                            unit: course.unit,
                            venue,
                            level: course.Level.level,
                            startFrom: slot.startFrom,
                            endsAt: slot.endsAt,
                        });
                    }
                }
            }

            Object.keys(timetable).forEach(day => {
                timetable[day].forEach(event => {
                    delete event.day;
                    delete event.levelIds;
                    delete event.departmentIds
                });
            });

            fs.writeFileSync(jsonFilePath, JSON.stringify(timetable, null, 2));
        
            return timetable;
        } catch (err) {
            this.#logger.error(err)
            throw new Error("Error occurred genereating timetable")
        }
    }

    generateExamTimetable = async (courses, events, department, institution, startDate, endDate) => {
        try {
            const fileName = `${department.name}-${institution.name}-examination-timetable.json`;
            const jsonFilePath = path.join(__dirname, '../timetables', fileName);

            const timetable = {};
            const daysOfWeek = [1, 2, 3, 4, 5];
            let days = [];
    
            for (let date = new Date(startDate); date <= new Date(endDate); date.setDate(date.getDate() + 1)) {
                const dayOfWeek = date.getDay();
    
                if (daysOfWeek.includes(dayOfWeek)) {
                    const formattedDate = date.toISOString().split('T')[0];
                    days.push(formattedDate)
    
                    if (!timetable[formattedDate]) {
                        timetable[formattedDate] = [];
                    }
    
                    for (const course of courses) {
                        let courseAlreadyScheduled = false;

                        for (const scheduledDate in timetable) {
                            if (timetable[scheduledDate].some(scheduledCourse => scheduledCourse.courseExamId === course.id)) {
                                courseAlreadyScheduled = true;
                                break;
                            }
                        }

                        if (courseAlreadyScheduled) {
                            continue;
                        }

                        const availableSlots = await this.#findExamAvailableSlots(timetable, course.duration, course.Venue.venue, formattedDate);

                        if (availableSlots.length > 0) {
                            const slot = availableSlots[0];
                            timetable[formattedDate].push({
                                courseExamId: course.id,
                                courseId: course.Course.id,
                                courseCode: course.Course.courseCode,
                                courseName: course.Course.courseName,
                                unit: course.Course.unit,
                                venue: course.Venue.venue,
                                level: course.Level.level,
                                startFrom: slot.startFrom,
                                endsAt: slot.endsAt,
                                day: formattedDate
                            });
                        }
                    }
                }
            }

            fs.writeFileSync(jsonFilePath, JSON.stringify(timetable, null, 2));
    
            return timetable;
        } catch (err) {
            this.#logger.error(err);
            throw new Error("Error occurred generating examination timetable");
        }
    }
    
    #findExamAvailableSlots = (timetable, duration, venue, day) => {
        const events = timetable[day] || [];
        return this.#findExamFreeSlots(events, duration, venue);
    }
    
    #findExamFreeSlots = (events, duration, venue) => {
        const freeSlots = [];
        let nextStart = "08:00:00";
        const minutesNeeded = 60 * duration;
    
        events.sort((a, b) => a.startFrom.localeCompare(b.startFrom));
    
        for (let i = 0; i < events.length; i++) {
            const currentEvent = events[i];
            const currentStart = currentEvent.startFrom;
            const currentEnd = currentEvent.endsAt;
    
            const gap = this.#getMinutesBetweenTimes(nextStart, currentStart);
    
            if (gap >= minutesNeeded) {
                const nextEndAt = this.#addMinutesToTime(nextStart, minutesNeeded);
                freeSlots.push({ startFrom: nextStart, endsAt: nextEndAt, venue });
            }
    
            nextStart = currentEnd;
        }
    
        const remainingGap = this.#getMinutesBetweenTimes(nextStart, "18:00:00");
        if (remainingGap >= minutesNeeded) {
            const nextEndAt = this.#addMinutesToTime(nextStart, minutesNeeded);
            freeSlots.push({ startFrom: nextStart, endsAt: nextEndAt, venue });
        }
    
        return freeSlots;
    };  
    
    #findAvailableSlots = (timetable, duration, departmentId, venue, levelId) => {
        const availableSlots = [];
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    
        days.forEach(day => {
            let slots = this.#findFreeSlots(timetable[day], duration, venue);

            if (!slots.day) {
                slots[0].day = day
            }

            slots = this.#filterByDepartment(slots, departmentId);

            slots = this.#filterByLevel(slots, levelId);
           
            if (slots.length > 0) {
                availableSlots.push(...slots);
            }
        });
    
        return availableSlots;
    }

    #filterByLevel = (slots, levelId) => {
        return slots.filter(slot => !slot.levels || slot.levelIds.includes(levelId));
    }
    
    #findFreeSlots = (events, duration, venue) => {
        const freeSlots = [];
        let nextStart = "08:00:00";
        const minutesNeeded = 60 * duration;
    
        if (events.length == 0) {
            const nextEndAt = this.#addMinutesToTime(nextStart, minutesNeeded);
            freeSlots.push({
                startFrom: nextStart,
                endsAt: nextEndAt,
                levelIds: [],
                departmentIds: [],
            });
            return freeSlots;
        }
    
        events.sort((a, b) => {
            return a.startFrom.localeCompare(b.startFrom);
        });
    
        let previousEnd = "08:00:00";
        for (let i = 0; i < events.length; i++) {
            const currentEvent = events[i];
            const currentStart = currentEvent.startFrom;
            const currentEnd = currentEvent.endsAt;
    
            const gap = this.#getMinutesBetweenTimes(previousEnd, currentStart);
    
            if (gap >= minutesNeeded) {
                const nextEndAt = this.#addMinutesToTime(currentStart, minutesNeeded);
                freeSlots.push({
                    startFrom: currentStart,
                    endsAt: nextEndAt,
                    day: currentEvent.day,
                    levelIds: currentEvent.levelIds,
                    departmentIds: currentEvent.departmentIds,
                });
            }
    
            previousEnd = currentEnd;
        }
    
        const lastEventEnd = events[events.length - 1].endsAt;
        const lastEventDay = events[events.length - 1].day;
        const remainingGap = this.#getMinutesBetweenTimes(lastEventEnd, "18:00:00");
        if (remainingGap >= minutesNeeded) {
            const nextEndAt = this.#addMinutesToTime(lastEventEnd, minutesNeeded);
            freeSlots.push({
                startFrom: lastEventEnd,
                endsAt: nextEndAt,
                day: lastEventDay,
                levelIds: [],
                departmentIds: [],
            });
        }
    
        return freeSlots;
    };

    #getMinutesBetweenTimes = (time1, time2) => {
        const [hours1, minutes1] = time1.split(':').map(Number);
        const [hours2, minutes2] = time2.split(':').map(Number);
    
        const totalMinutes1 = hours1 * 60 + minutes1;
        const totalMinutes2 = hours2 * 60 + minutes2;
    
        const difference = Math.abs(totalMinutes1 - totalMinutes2);
    
        return difference;
    };

    #addMinutesToTime = (time, minutesToAdd) => {
        const [hours, minutes, seconds] = time.split(':').map(Number);
    
        let totalMinutes = hours * 60 + minutes + minutesToAdd;
    
        const newHours = Math.floor(totalMinutes / 60) % 24;
        const newMinutes = totalMinutes % 60;
    
        const formattedHours = String(newHours).padStart(2, '0');
        const formattedMinutes = String(newMinutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');
    
        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }  
    
    #filterByDepartment = (slots, departmentId) => {
        return slots.filter(slot => !slot.departments || slot.departmentIds.includes(departmentId));
    }

    generateExcelTimetable = async (timetable, department, institution) => {  
        try {
            const wb = XLSX.utils.book_new();
            const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

            const fileName = `${department}-${institution}-timetable.xlsx`;
            const tempFilePath = path.join(__dirname, '../timetables', fileName);

            if (fs.existsSync(tempFilePath)) {
                fs.unlinkSync(tempFilePath)
            }
    
            const colorScheme = {
                Monday: 'FFFF00', 
                Tuesday: 'FFA07A',
                Wednesday: '00FF00',
                Thursday: '00CED1',
                Friday: 'FF6347',
            };
    
            daysOfWeek.forEach(day => {
                if (timetable.hasOwnProperty(day) && timetable[day].length > 0) {
                    const wsData = timetable[day].map(entry => {
                        return {
                            'Event': entry.event || entry.courseName,
                            'Venue': entry.venue,
                            'Starts From': entry.startFrom,
                            'Ends At': entry.endsAt,
                            'Departments': entry.departments ? entry.departments.join(', ') : '',
                            'Levels': entry.levels ? entry.levels.join(', ') : '',
                        };
                    });
    
                    const ws = XLSX.utils.json_to_sheet(wsData);
                    ws['!cols'] = [{ width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }];
    
                    const color = colorScheme[day];
                    ws['A1'].s = { patternType: 'solid', fgColor: { rgb: color } };
                    
                    XLSX.utils.book_append_sheet(wb, ws, day);
                }
            });
    
            const excelBuffer = XLSX.write(wb, { type: 'buffer' }); 
            fs.writeFileSync(tempFilePath, excelBuffer);
    
            return { url: `${infrastructure.serverbaseUrl.production}/timetables/${fileName}` };
        } catch (error) {
            console.log(error);
            throw new Error("Error generating Excel timetable:", error);
        }
    }

    generateExamExcelTimetable = async (department, institution, tempFileJson) => {  
        try {
            const fileName = `${department}-${institution}-examination-timetable.xlsx`;
            const tempFilePath = path.join(__dirname, '../timetables', fileName);
            const workbook = new ExcelJS.Workbook();

            const examsByDate = tempFileJson;

            for (const [date, exams] of Object.entries(examsByDate)) {
                const worksheet = workbook.addWorksheet(date);

                worksheet.addRow(['Course Code', 'Course Name', 'Unit', 'Venue', 'Level', 'Start Time', 'End Time']);

                exams.forEach(exam => {
                    worksheet.addRow([
                        exam.courseCode,
                        exam.courseName,
                        exam.unit,
                        exam.venue,
                        exam.level,
                        exam.startFrom,
                        exam.endsAt
                    ]);
                });

                worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
                    if (rowNumber === 1) {
                        row.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'FFFF00' }
                        };
                    } else {
                        row.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: rowNumber % 2 === 0 ? 'FFFFFF' : 'ECECEC' }
                        };
                    }
                });
            }

            await workbook.xlsx.writeFile(tempFilePath);
    
            return { url: `${infrastructure.serverbaseUrl.production}/timetables/${fileName}` };
        } catch (error) {
            console.log(error);
            throw new Error("Error generating Excel timetable:", error);
        }
    }

    deleteTimetable = async (key) => {
        return await fs.unlinkSync(key);
    }

    getTimeTableJSON = async (fileUrl) => {
        try {
            const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
            const workbook = XLSX.read(response.data, { type: 'buffer' });
    
            const data = {};
    
            workbook.SheetNames.forEach(sheetName => {
                const worksheet = workbook.Sheets[sheetName];
                const sheetData = XLSX.utils.sheet_to_json(worksheet);
                data[sheetName] = sheetData;
            });
    
            return data;
        } catch (error) {
            this.#logger.error("Error fetching or parsing the Excel file:", error);
            throw new Error("Error fetching or parsing the Excel file")
        }
    }

    combineTimetables = (...timetables) => {
        const combinedTimetable = {};
    
        timetables.forEach(timetable => {
            Object.keys(timetable).forEach(day => {
                if (!combinedTimetable[day]) {
                    combinedTimetable[day] = [];
                }
                combinedTimetable[day] = this.#combineEvents(combinedTimetable[day], timetable[day]);
            });
        });
    
        return combinedTimetable;
    };
    
    #combineEvents = (existingEvents, newEvents) => {
        const mergedEvents = [];
    
        newEvents.forEach(newEvent => {
            const existingEventIndex = existingEvents.findIndex(event => event.event === newEvent.event && event.venue === newEvent.venue);
            if (existingEventIndex === -1) {
                mergedEvents.push(newEvent);
            }
        });
    
        return existingEvents.concat(mergedEvents);
    };
}

module.exports = Scheduler;