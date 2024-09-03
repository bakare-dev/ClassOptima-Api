const Logger = require("../utils/Logger");
const NotificationService = require("./NotificationService");
const CourseService = require("./dataservices/CourseService");
const InstitutionService = require("./dataservices/InstitutionService");
const StaffAdminService = require("./dataservices/StaffAdminService");
const StaffService = require("./dataservices/StaffService");
const StudentAdminService = require("./dataservices/StudentAdminService");
const StudentService = require("./dataservices/StudentService");
const StaffCourseService = require("./dataservices/StaffCourseService");
const LevelService = require("./dataservices/LevelService");
const DepartmentService = require("./dataservices/DepartmentService");
const DepartmentStaffService = require("./dataservices/DepartmentStaffService");
const EventService = require("./dataservices/EventService");
const DepartmenEventService = require("./dataservices/DepartmentEventService");
const EventVenueService = require("./dataservices/EventVenueService");
const Scheduler = require("../utils/Scheduler");
const { infrastructure } = require("../config/main.settings");
const path = require('path');
const fs = require('fs');
const UserService = require("./dataservices/UserService");
const VenueService = require("./dataservices/VenueService");
const LevelEventService = require("./dataservices/LevelEventService");
const CourseExamService = require("./dataservices/CourseExamService");


let instance;

class CoreService {

    #logger;
    #notificationService;
    #institutionService;
    #studentService;
    #studentAdminService;
    #staffService;
    #staffAdminService;
    #courseService;
    #staffCourseService;
    #levelService;
    #departmentService;
    #departmentStaffService;
    #eventService;
    #departmentEventService;
    #eventVenueService;
    #scheduler;
    #userService;
    #venueService;
    #levelEventService;
    #examCourseService;

    constructor () {
        
        if (instance) return instance;


        this.#logger = new Logger().getLogger();
        this.#notificationService = new NotificationService();
        this.#institutionService = new InstitutionService();
        this.#studentAdminService = new StudentAdminService();
        this.#studentService = new StudentService();
        this.#staffAdminService = new StaffAdminService();
        this.#staffService = new StaffService();
        this.#courseService = new CourseService();
        this.#staffCourseService = new StaffCourseService();
        this.#levelService = new LevelService();
        this.#departmentService = new DepartmentService();
        this.#departmentStaffService = new DepartmentStaffService();
        this.#eventService = new EventService();
        this.#departmentEventService = new DepartmenEventService();
        this.#eventVenueService = new EventVenueService();
        this.#scheduler = new Scheduler();
        this.#userService = new UserService();
        this.#venueService = new VenueService();
        this.#levelEventService = new LevelEventService();
        this.#examCourseService = new CourseExamService();

        


        instance = this;

    }

    getLevelsByInstitutionId = async (institutionId, callback) => {
        try {
            const institution = await this.#institutionService.findById(institutionId)

            if (!institution) {
                return callback({status: 404, message: "Institution not found"});
            }

            const levels = await this.#levelService.getLevelsByInstitutionId(institution.id);

            callback({status: 200, data: { levels }})
        } catch (err) {
            this.#logger.error(err);
            callback({status: 500, message: "Internal server Error"})
        }
    }

    getStaffByDepartmentId = async (query, callback) => {
        try {
            const staff = await this.#staffService.findById(query.staffId);

            if (!staff) {
                return callback({status: 404, message: "Staff not Found"})
            }

            const department = await this.#departmentService.findById(staff.DepartmentId);

            if (!department) {
                return callback({status: 404, message: "Department not found"});
            }

            const staffs = await this.#staffService.getProfileByDepartment({
                departmentId: department.id,
                page: query.page,
                size: query.size
            });

            callback({status: 200, data: { staffs }})
        } catch (err) {
            console.log(err)
            this.#logger.error(err);
            callback({status: 500, message: "Internal server Error"})
        }
    }

    getStudentByDepartmentId = async (query, callback) => {
        try {
            const staff = await this.#staffService.findById(query.staffId);

            if (!staff) {
                return callback({status: 404, message: "Staff not Found"})
            }

            const department = await this.#departmentService.findById(staff.DepartmentId);

            if (!department) {
                return callback({status: 404, message: "Department not found"});
            }

            const students = await this.#studentService.getProfileByDepartment({
                departmentId: department.id,
                page: query.page,
                size: query.size
            });

            callback({status: 200, data: { students }})
        } catch (err) {
            this.#logger.error(err);
            callback({status: 500, message: "Internal server Error"})
        }
    }
    
    deleteLevel = async (levelId, callback) => {
        try {
            const level = await this.#levelService.findById(levelId)

            if (!level) {
                return callback({status: 404, message: "Level not found"});
            }

            const deleted = await this.#levelService.delete(level.id);

            if (deleted != 1) {
                return callback({status: 400, message: "An error occurred"})
            }

            callback({status: 200, message: "Level Deleted"})
        } catch (err) {
            this.#logger.error(err);
            callback({status: 500, message: "Internal server Error"})
        }
    }

    addLevel = async (payload, callback) => {
        try {
            const institution = await this.#institutionService.findById(payload.InstitutionId)

            if (!institution) {
                return callback({status: 404, message: "Institution not found"});
            }

            const level = await this.#levelService.create(payload);

            if (!level.id) {
                return callback({status: 400, message: "An error occurred"})
            }

            callback({status: 201, message: "Level Added"})
        } catch (err) {
            this.#logger.error(err);
            callback({status: 500, message: "Internal server Error"})
        }
    }

    getDepartmentsByInstitutionId = async (institutionId, callback) => {
        try {
            const institution = await this.#institutionService.findById(institutionId)

            if (!institution) {
                return callback({status: 404, message: "Institution not found"});
            }

            const departments = await this.#departmentService.getAllDepartmentByInstitutionId({institutionId: institution.id});

            callback({status: 200, data: { departments }})
        } catch (err) {
            this.#logger.error(err);
            callback({status: 500, message: "Internal server Error"})
        }
    }

    getInstitutionStudents = async (query, callback) => {
        try {
            const institution = await this.#institutionService.findById(query.institutionId);


            if (!institution) {
                return callback({status: 404, message: "Institution not found"});
            }

            let students;

            students = await this.#studentService.getStudentsByInstitutionId(institution.id, query);

            if (students.count == 0) {
                return callback({status: 404, message: "No student found", data: { students: [] }});
            }

            let studentsArray = [];

            for ( const student of students.rows ) {

                const studentId = student.id;

                const isAdmin = await this.#studentAdminService.getProfileByStudentId(studentId);

                studentsArray.push({
                    email: student.User.emailAddress,
                    name: student.fullName,
                    level: student.Level.level,
                    department: student.Department.department,
                    priviledge: isAdmin ? true : false
                });
            }

            students = studentsArray;

            callback({status: 200, message: "Students found", data: { students }});
        } catch (err) {
            this.#logger.error(err)
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    getStaffAdminDashboard = async (staffId, callback) => {
        try {
            const staff = await this.#staffService.findById(staffId);

            if (!staff) {
                return callback({status: 404, message: "Staff not found"});
            }

            this.getInstitutionDashboard(staff.InstitutionId, resp => {
                callback(resp);
            })
        } catch (err) {
            this.#logger.error(err)
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    getInstitutionDashboard = async (institutionId, callback) => {
        try {
            const institution = await this.#institutionService.findById(institutionId);


            if (!institution) {
                return callback({status: 404, message: "Institution not found"});
            }

            const students = await new Promise((resolve, reject) => {
                this.getInstitutionStudents({page: 0, size: 10, institutionId: institution.id}, resp => resolve(resp.data.students));
            })

            const staffs = await new Promise((resolve, reject) => {
                this.getInstitutionStaffs({page: 0, size: 10, institutionId: institution.id}, resp => resolve(resp.data.staffs));
            })

            const totalStudents = await this.#studentService.getStudentCount(institution.id);

            const totalStaffs = await this.#staffService.getStaffcount(institution.id);

            let assignRolesCount = 0;

            const [totalStudentAssignedRoles, totalStaffAssignedRoles] = await Promise.all([
                this.#studentAdminService.getStudentCount(institution.id),
                this.#staffAdminService.getStaffCount(institution.id)
            ]);

            assignRolesCount = totalStudentAssignedRoles + totalStaffAssignedRoles;


            const classrooms = await this.#venueService.getVenueCount(institution.id);


            callback({status: 200, data: { totalStaffs, staffs, students, totalStudents, assignRolesCount, classrooms}})
        } catch (err) {
            this.#logger.error(err)
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    getInstitutionStaffs = async (query, callback) => {
        try {
            // return email, name, course taken(no), department, priviledge(true/false)
            const institution = await this.#institutionService.findById(query.institutionId);


            if (!institution) {
                return callback({status: 404, message: "Institution not found"});
            }

            let staffs;

            staffs = await this.#staffService.getStaffByInstitutionId(institution.id, query);


            if (staffs.count == 0) {
                return callback({status: 404, message: "No student found", data: { students: [] }});
            }

            let staffsArray = [];

            for ( const staff of staffs.rows ) {

                const staffId = staff.id;

                const isAdmin = await this.#staffAdminService.getProfileByStaffId(staffId);

                const courseCount = await this.#staffCourseService.getStaffCourseCount(staffId);

                staffsArray.push({
                    email: staff.User.emailAddress,
                    name: staff.fullName,
                    department: staff.Department.department,
                    priviledge: isAdmin ? true : false,
                    courseCount
                });
            }

            staffs = staffsArray;

            return callback({status: 200, message: "Staff found", data: { staffs }});
        } catch (err) {
            this.#logger.error(err)
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    getInstitutionPriviledgeUsers = async (query, callback) => {
        try {
            // return roles, assignedto, student/faculty, department, priviledge(true/false)

            const institution = await this.#institutionService.findById(query.institutionId)

            if (!institution) {
                return callback({status: 404, message: "Institution not found"});
            }

            const size = parseInt(query.size / 2);

            let staffs;

            staffs = await this.#staffService.getStaffByInstitutionId(institution.id, { size, page: query.page });

            let students;

            students = await this.#studentService.getStudentsByInstitutionId(institution.id, { size, page: query.page });

            let users = [];

            for ( const staff of staffs.rows ) {
                users.push({
                    role: "staff.User.emailAddress",
                    assignedto: staff.User.emailAddress,
                    department: staff.Department.department,
                    type: "Staff",
                });
            }

            for ( const student of students.rows ) {
                users.push({
                    assignedto: student.User.emailAddress,
                    role: "student.fullName",
                    department: student.Department.department,
                    type: "Student",
                });
            }
        } catch (err) {
            this.#logger.error(err)
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    getCoursesByDepartmentAndLevel = async (query, callback) => {
        try {
            // return course code, course name, units, venue, requirementStatus, duration

            const level = await this.#levelService.findById(query.levelId);

            if (!level) {
                return callback({ status: 404, message: "Level Not Found"});
            }

            const department = await this.#departmentService.findById(query.departmentId);

            if (!department) {
                return callback({ status: 404, message: "Department Not Found"});
            }

            const courses = await this.#courseService.getCoursesByDepartmentAndLevel({
                levelId: level.id,
                departmentId: department.id,
                page: query.page,
                size: query.size
            })

            let coursesArray = [];

            for ( const course of courses.rows ) {
                coursesArray.push({
                    courseId: course.id,
                    courseCode: course.courseCode,
                    courseName: course.courseName,
                    units: course.unit,
                    requirementStatus: course.requirementStatus,
                    duration: course.duration,
                    venue: course.Venue.venue
                })
            }

            callback({ status: 200, data: { courses: coursesArray } })
        } catch (err) {
            this.#logger.error(err)
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    getCoursesByDepartment = async (query, callback) => {
        try {
            // return course code, course name, units, venue, requirementStatus, duration

            const department = await this.#departmentService.findById(query.departmentId);

            if (!department) {
                return callback({ status: 404, message: "Department Not Found"});
            }

            const courses = await this.#courseService.getCoursesByDepartment({
                departmentId: department.id,
                page: query.page,
                size: query.size
            })

            let coursesArray = [];

            for ( const course of courses.rows ) {
                coursesArray.push({
                    courseId: course.id,
                    courseCode: course.courseCode,
                    courseName: course.courseName,
                    units: course.unit,
                    requirementStatus: course.requirementStatus,
                    duration: course.duration,
                    venue: course.Venue.venue
                })
            }

            callback({ status: 200, data: { courses: coursesArray } })
        } catch (err) {
            this.#logger.error(err)
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    getStaffCourses = async (query, callback) => {
        try {
            // return course code, course name, units, venue, requirementStatus, duration

            const staff = await this.#staffService.findById(query.staffId);

            if (!staff) {
                return callback({ status: 404, message: "Staff not Found" });
            }

            const staffCourses = await this.#staffCourseService.getStaffCourses(staff.id);

            let courses = [];

            for ( const staffCourse of staffCourses.rows ) {
                const course = await this.#courseService.getCourseById(staffCourse.CourseId);

                courses.push({
                    courseId: course.id,
                    courseCode: course.courseCode,
                    courseName: course.courseName,
                    units: course.unit,
                    requirementStatus: course.requirementStatus,
                    duration: course.duration,
                    venue: course.Venue.venue
                })
            }

            callback({status: 200, data: { courses }})
        } catch (err) {
            this.#logger.error(err)
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    getCourse = async (courseId, callback) => {
        try {
            const course = await this.#courseService.getCourseById(courseId);

            if (!course) {
                return callback({status: 404, message: "Course not Found"});
            }

            callback({status: 200, data: {course}});
        } catch (err) {
            this.#logger.error(err)
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    createCourse = async (payload, callback) => {
        try {
            const course = await this.#courseService.create(payload);

            if (!course.id) {
                return callback({status: course.status, message: course.error});
            }

            callback({status: 201, message: "Course Created Successfully"})
        } catch (err) {
            this.#logger.error(err)
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    addStaffCourses = async (staffId, coursesA, callback) => {
        try {
            let coursesPayload = []
            for ( const courseId of coursesA ) {
                coursesPayload.push({
                    CourseId: courseId,
                    StaffId: staffId
                })
            }

            const courses = await this.#staffCourseService.insertBulk(coursesPayload);

            if (courses.length == 0) {
                return callback({status: 400, message: "Error Occurred adding Courses"})
            }

            callback({status: 201, message: "Courses Added Successfully"});
        } catch (err) {
            this.#logger.error(err)
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    editCourse = async (courseId, payload, callback) => {
        try {
            const course = await this.#courseService.findById(courseId);

            if (!course) {
                return callback({status: 404, message: "Course not Found"});
            }

            const updateCourse = await this.#courseService.update(course.id, payload);

            if (updateCourse[0] != 1) {
                return callback({status: 400, message: "Error occurred update course"})
            }

            callback({status: 200, message: "Course Updated Successfully"});
        } catch (err) {
            this.#logger.error(err)
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    deleteCourse = async (courseId, callback) => {
        try {
            const course = await this.#courseService.findById(courseId);

            if (!course) {
                return callback({status: 404, message: "Course not Found"});
            }

            const deletedCourse = await this.#courseService.delete(course.id);

            if (deletedCourse != 1) {
                return callback({status: 400, message: "Error occurred deleting Course"});
            }

            callback({status: 200, message: "Course deleted Successfully"});
        } catch (err) {
            this.#logger.error(err)
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    getDepartments = async (query, callback) => {
        try {
            const departments = await this.#departmentService.getDepartmentByInstitutionId(query);
            const departmentsArray = [];

            for (const department of departments.rows) {
                const staffs = await this.#departmentStaffService.getDepartmentStaffs(department.id);

                const detail = {
                    departmentId: department.id,
                    name: department.name,
                    assigned: staffs.length > 0,
                    staffs: []
                };

                if (detail.assigned) {
                    for (const staff of staffs.rows) {
                        const staffdetail = await this.#staffService.getProfileByStaffId(staff.id);
                        detail.staffs.push({
                            name: staffdetail.fullName,
                            emailAddress: staffdetail.User.emailAddress
                        });
                    }
                }

                departmentsArray.push(detail);
            }

            callback({ status: 200, data: { departments: departmentsArray } });
        } catch (err) {
            this.#logger.error(err)
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    createDepartment = async (payload, callback) => {
        try {
            const department = await this.#departmentService.create(payload);

            if (!department.id) {
                return callback({status: 400, message: "Error adding Course"});
            }

            const venues = payload.venues.map(venue => ({ venue, InstitutionId: department.InstitutionId }))

            await this.#venueService.insertBulk(venues);

            callback({status: 201, message: "Department Added Successfully "})
        } catch (err) {
            this.#logger.error(err)
            callback({status: 500, message: "Internal Server Error"});
        }
    } 

    deleteDepartment = async (departmentId, callback) => {
        try {
            const department = await this.#departmentService.findById(departmentId);

            if (!department) {
                return callback({status: 404, message: "Department not Found"});
            }

            const deleted = await this.#departmentService.delete(department.id);

            if (deleted != 1) {
                return callback({status: 400, message: "Error deleting Course"});
            }

            callback({status: 200, message: "Department Deleted"})
        } catch (err) {
            this.#logger.error(err)
            callback({status: 500, message: "Internal Server Error"});
        }
    } 

    updateDepartment = async (departmentId, payload, callback) => {
        try {
            const department = await this.#departmentService.findById(departmentId);

            if (!department) {
                return callback({status: 404, message: "Department not Found"});
            }

            const updated = await this.#departmentService.update(department.id, payload);

            if (updated[0] != 1) {
                return callback({status: 400, message: "Error Updating Course"});
            }

            callback({status: 200, message: "Department Updated"})
        } catch (err) {
            this.#logger.error(err)
            callback({status: 500, message: "Internal Server Error"});
        }
    } 

    getEvents = async (institutionId, callback) => {
        try {
            // return name, time(recurring/static), departments, venues allocated, requirement status

            const institution = await this.#institutionService.findById(institutionId);

            if (!institution) {
                return callback({ status: 404, message: "Institution not found" });
            }

            const events = await this.#eventService.getEventsByInstitution(institution.id);
            const eventsArray = [];

            for (const event of events.rows) {
                const detail = {
                    name: event.name,
                    requirementStatus: event.requirementStatus,
                    departments: []
                };

                if (event.recurring) {
                    detail.time = await this.#formatEvent({
                        recurring: true,
                        startFrom: event.startFrom,
                        endsAt: event.endsAt,
                        day: event.day
                    });
                } else {
                    detail.time = await this.#formatEvent({
                        recurring: true,
                        startFrom: event.startFrom,
                        endsAt: event.endsAt,
                        date: event.date
                    });
                }

                const departmentEvents = await this.#departmentEventService.getDepartmentEvents(event.id);

                if (departmentEvents.length > 0) {
                    for (const departmentEvent of departmentEvents) {
                        const department = await this.#departmentService.findById(departmentEvent.DepartmentId);
                        detail.departments.push(department);
                    }
                } else {
                    detail.departments = "All";
                }

                const venue = await this.#eventVenueService.getVenueByEventId(event.id);
                detail.venue = venue;

                eventsArray.push(detail);
            }

            callback({ status: 200, data: { events: eventsArray } });
        } catch (err) {
            this.#logger.error(err)
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    createEvent = async (payload, callback) => {
        try {
            const venue = await this.#venueService.findById(payload.venueId);

            if (!venue) {
                return callback({status: 404, message: "Venue not Found"})
            }

            const event = await this.#eventService.create(payload);

            if (!event.id) {
                return callback({status: 400, message: "Error Creating Event"});
            }

            const eventVenue = await this.#eventVenueService.create({
                EventId: event.id,
                VenueId: payload.venueId
            })

            if (!eventVenue.id) {
                this.#eventService.delete(event.id)
                return callback({status: 400, message: "Error Adding Event"});
            }

           
            if (payload.departments.length > 0) {
                const updatedDepartments = payload.departments.map(departmentId => ({ EventId: event.id, DepartmentId: departmentId }));
                await this.#departmentEventService.insertBulk(updatedDepartments);
            }
            
            if (payload.levels.length > 0) {
                const updatedLevels = payload.levels.map(levelId => ({ EventId: event.id, LevelId: levelId }));
                await this.#levelEventService.insertBulk(updatedLevels);
            }
           

            callback({status: 200, message: "Event Created Successfully"});
        } catch (err) {
            this.#logger.error(err)
            callback({status: 500, message: "Internal Server Error"});
        }
    } 

    deleteEvent = async (eventId, callback) => {
        try {
            const event = await this.#eventService.findById(eventId);

            if (!event) {
                return callback({status: 404, message: "Event not Found"});
            }

            const deleted = await this.#eventService.delete(event.id);

            if (deleted != 1) {
                return callback({status: 400, message: "Error deleting Event"});
            }

            callback({status: 200, message: "Event Deleted"})
        } catch (err) {
            this.#logger.error(err)
            callback({status: 500, message: "Internal Server Error"});
        }
    } 

    updateEvent = async (eventId, payload, callback) => {
        try {
            const event = await this.#eventService.findById(eventId);

            if (!event) {
                return callback({status: 404, message: "Event not Found"});
            }

            if (payload.venueId) {
                const eventVenue = await this.#eventVenueService.getVenueByEventId(event.id);


                await this.#eventVenueService.update(eventVenue.id, { VenueId: payload.venueId });
            }

            const updated = await this.#eventService.update(event.id, payload);

            if (updated[0] != 1) {
                return callback({status: 400, message: "Error Updating Event"});
            }

            callback({status: 200, message: "Event Updated"})
        } catch (err) {
            this.#logger.error(err)
            callback({status: 500, message: "Internal Server Error"});
        }
    } 

    generateNewDepartmentTable = async (staffId, callback) => {
        try {
            const staff = await this.#staffService.findById(staffId);

            if (!staff) {
                return callback({status: 404, message: "Staff not Found"});
            }

            const department = await this.#departmentService.findById(staff.DepartmentId);
    
            if (!department) {
                return callback({status: 404, message: "Department not Found"});
            }

            const institution = await this.#institutionService.findById(department.InstitutionId);

            if (!institution) {
                return callback({status: 404, message: "Institution not Found"});
            }
    
            const courses = await this.#courseService.getAllCoursesByDepartment(department.id);
            const events = await this.#eventService.getEventsByInstitution(department.InstitutionId);

            const timetable = await this.#scheduler.generateClassTimetable(courses, events, department, institution);

            const { url } = await this.#scheduler.generateExcelTimetable(timetable, department.name, institution.name);

            const students = await this.#studentService.getStudents(department.id);

            let timetableNotification = {
                recipients: students.rows.map(student => student.rows.User.emailAddress),
                data: {},
                attachment: [ url ]
            }

            await this.#notificationService.sendNewStudentTimeTable(timetableNotification, resp => {});

            callback({status: 201, message: "TimeTable Generated Successfully", data: { timetable, timetableUrl: url }});
        } catch (err) {
            this.#logger.error(err);
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    getDepartmentTimeTable = async (departmentId, callback) => {
        try {
            const department = await this.#departmentService.findById(departmentId);
    
            if (!department) {
                return callback({status: 404, message: "Department not Found"});
            }

            const institution = await this.#institutionService.findById(department.InstitutionId);

            if (!institution) {
                return callback({status: 404, message: "Institution not Found"});
            }

            const fileName = `${department.name}-${institution.name}-timetable.json`;
            const jsonFilePath = path.join(__dirname, '../timetables', fileName);

            const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
            const timetable = JSON.parse(jsonData);

            const { url } = await this.#scheduler.generateExcelTimetable(timetable, department.name, institution.name)

            callback({status: 200, data: { timetable, timetableUrl: url }});
        } catch (err) {
            this.#logger.error(err);
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    getStudentTimeTable = async (studentId, callback) => {
        try {
            const student = await this.#studentService.findById(studentId);

            if (!student) {
                return callback({status: 404, message: "Student not Found"});
            }

            const department = await this.#departmentService.findById(student.DepartmentId);
    
            if (!department) {
                return callback({status: 404, message: "Department not Found"});
            }

            const institution = await this.#institutionService.findById(department.InstitutionId);

            if (!institution) {
                return callback({status: 404, message: "Institution not Found"});
            }

            const fileName = `${department.name}-${institution.name}-timetable.json`;
            const jsonFilePath = path.join(__dirname, '../timetables', fileName);

            const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
            const timetable = JSON.parse(jsonData);

            const { url } = await this.#scheduler.generateExcelTimetable(timetable, department.name, institution.name)

            callback({status: 200, data: { timetable, timetableUrl: url }});
        } catch (err) {
            this.#logger.error(err);
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    getInstitutionTimeTable = async (institutionId, callback) => {
        try {
            const institution = await this.#institutionService.findById(institutionId);
    
            if (!institution) {
                return callback({ status: 404, message: "Institution not Found" });
            }
    
            const departments = await this.#departmentService.getAllDepartmentByInstitutionId({institutionId: institution.id});
    
            if (departments.length == 0) {
                return callback({ status: 404, message: "Department not Found" });
            }
    
            const allTimetables = {
                Monday: [],
                Tuesday: [],
                Wednesday: [],
                Thursday: [],
                Friday: []
            };
    
            const combineEntries = (entries) => {
                const courseCodesEncountered = new Set();
                const eventsEncountered = new Set();
                entries.forEach(entry => {
                    Object.keys(entry).forEach(day => {
                        entry[day].forEach(item => {
                            if (item.courseCode && !courseCodesEncountered.has(item.courseCode)) {
                                allTimetables[day].push(item);
                                courseCodesEncountered.add(item.courseCode);
                            }

                            if (item.event && !eventsEncountered.has(item.event)) {
                                allTimetables[day].push(item);
                                eventsEncountered.add(item.event);
                            }
                        });
                    });
                });
            };
    
            await Promise.all(departments.map(async department => {
                const fileName = `${department.name}-${institution.name}-timetable.json`;
                const jsonFilePath = path.join(__dirname, '../timetables', fileName);
    
                if (fs.existsSync(jsonFilePath)) {
                    const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
                    const timetable = JSON.parse(jsonData);
                    combineEntries([timetable]);
                }
            }));
    
            const { url } = await this.#scheduler.generateExcelTimetable(allTimetables, "all", institution.name);
    
            callback({ status: 200, data: {timetables: allTimetables, timetableUrl: url } });
    
        } catch (err) {
            this.#logger.error(err);
            callback({ status: 500, message: "Internal Server Error" });
        }
    }
    
    getStaffTimeTable = async (staffId, callback) => {
        try {
            const staff = await this.#staffService.findById(staffId);
    
            if (!staff) {
                return callback({ status: 404, message: "Staff not Found" });
            }
    
            const institution = await this.#institutionService.findById(staff.InstitutionId);
    
            const departments = await this.#departmentService.getAllDepartmentByInstitutionId({ institutionId: institution.id});
    
            if (departments.length === 0) {
                return callback({ status: 404, message: "Department not Found" });
            }
    
            const courses = await this.#staffCourseService.getStaffCourses(staff.id);
            const courseIds = courses.rows.map(course => course.CourseId);
    
            const courseCodesEncountered = new Set();
            const eventsEncountered = new Set();
            const allTimetables = {
                Monday: [],
                Tuesday: [],
                Wednesday: [],
                Thursday: [],
                Friday: []
            };
    
            await Promise.all(departments.map(async department => {
                const fileName = `${department.name}-${institution.name}-timetable.json`;
                const jsonFilePath = path.join(__dirname, '../timetables', fileName);
    
                if (fs.existsSync(jsonFilePath)) {
                    const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
                    const timetable = JSON.parse(jsonData);
                    Object.keys(timetable).forEach(day => {
                        timetable[day].forEach(entry => {
                            if (entry.courseId && courseIds.includes(entry.courseId) && !courseCodesEncountered.has(entry.courseCode)) {
                                allTimetables[day].push(entry);
                                courseCodesEncountered.add(entry.courseCode);
                            }

                            if (entry.event && !eventsEncountered.has(entry.event)) {
                                allTimetables[day].push(entry);
                                eventsEncountered.add(entry.event);
                            }
                        });
                    });
                }
            }));
    
            const { url } = await this.#scheduler.generateExcelTimetable(allTimetables, staff.fullName, institution.name);
    
            callback({ status: 200, data: { timetables: allTimetables, timetableUrl: url } });
    
        } catch (err) {
            this.#logger.error(err);
            callback({ status: 500, message: "Internal Server Error" });
        }
    }
    
    sendStaffTimeTable = async (staffId, callback) => {
        try {
            this.getStaffTimeTable(staffId, async resp => {
                if (resp.status != 200) {
                    return callback({status: resp.status, message: resp.message});
                } else {
                    const staff = await this.#staffService.findById(staffId);
    
                    if (!staff) {
                        return callback({ status: 404, message: "Staff not Found" });
                    }

                    const institution = await this.#institutionService.findById(staff.InstitutionId);

                    const timetable = resp.timetable;

                    const { url } = await this.#scheduler.generateExcelTimetable(timetable, staff.fullName, institution.name);

                    const user = await this.#userService.findById(staff.UserId);

                    let timetableNotification = {
                        recipients: [`${user.emailAddress}`],
                        data: {},
                        attachment: [ url ]
                    }
        
                    await this.#notificationService.sendStaffTimeTable(timetableNotification, resp => {});

                    callback({status: 200, message: "Timetable sent successfully"})
                }
            })
        } catch (err) {
            this.#logger.error(err);
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    sendStudentTimeTable = async (studentId, callback) => {
        try {
            const student = await this.#studentService.findById(studentId);

            if (!student) {
                return callback({status: 404, message: "Student not Found"});
            }

            const department = await this.#departmentService.findById(staff.DepartmentId);
    
            if (!department) {
                return callback({status: 404, message: "Department not Found"});
            }

            const institution = await this.#institutionService.findById(department.InstitutionId);

            if (!institution) {
                return callback({status: 404, message: "Institution not Found"});
            }

            const timetableUrl = 
                `https://${infrastructure.s3.bucket}.s3.amazonaws.com/${department.name}-${institution.name}-timetable.xlsx`

            const user = await this.#userService.findById(student.UserId);

            let userNotification = {
                recipients: [`${user.emailAddress}`],
                data: {},
                attachments: {timetableUrl}
            }

            await this.#notificationService.sendOldStudentTimeTable(userNotification, resp => {});
            
            callback({status: 200, message: `Timetable Sent to ${user.emailAddress}`});
        } catch (err) {
            this.#logger.error(err);
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    updateTimeTable = async (payload, callback) => {
        try {

            const staff = await this.#staffService.findById(payload.staffId);

            if (!staff) {
                return callback({ status: 404, message: "Staff not Found" });
            }

            const department = await this.#departmentService.findById(staff.DepartmentId);
    
            if (!department) {
                return callback({ status: 404, message: "Department not Found" });
            }
    
            const institution = await this.#institutionService.findById(department.InstitutionId);
    
            if (!institution) {
                return callback({ status: 404, message: "Institution not Found" });
            }

            let venue;

            if (payload.venueId) {
                venue = await this.#venueService.findById(payload.venueId);

                if (!venue) {
                    return callback({ status: 404, message: "Venue not Found" });
                }

                payload.venue = venue.venue;
            }
    
            const fileName = `${department.name}-${institution.name}-timetable.json`;
            const jsonFilePath = path.join(__dirname, '../timetables', fileName);
    
            const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
            let timetable = JSON.parse(jsonData);
    
            const courseId = payload.courseId;
    
            const updateEntry = (entries, courseId) => {
                Object.keys(entries).forEach(day => {
                    entries[day] = entries[day].filter(entry => {
                        if (entry.courseId === courseId) {
                            if (payload.day && payload.day !== day) {
                                timetable[payload.day].push(entry);
                                return false;
                            } else {
                                Object.assign(entry, payload);
                                return true;
                            }
                        }
                        return true;
                    });
                });
            };
    
            updateEntry(timetable, courseId);
    
            fs.writeFileSync(jsonFilePath, JSON.stringify(timetable, null, 2));

            const key = `${department.name}-${institution.name}-timetable.xlsx`

            await this.#scheduler.deleteTimetable(key);

            const { url } = await this.#scheduler.generateExcelTimetable(timetable, department.name, institution.name);

            const students = await this.#studentService.getStudents(department.id);

            let timetableNotification = {
                recipients: students.rows.map(student => student.rows.User.emailAddress),
                data: {},
                attachment: [ url ]
            }

            await this.#notificationService.sendUpdatedTimeTable(timetableNotification, resp => {});
    
            callback({ status: 200, message: "Timetable updated successfully", data: { timetable, timetableUrl: url } });
    
        } catch (err) {
            this.#logger.error(err);
            callback({ status: 500, message: "Internal Server Error" });
        }
    }    

    generateNewDepartmentExamTable = async (staffId, payload, callback) => {
        try {
            const staff = await this.#staffService.findById(staffId);

            if (!staff) {
                return callback({status: 404, message: "Staff not Found"});
            }

            const department = await this.#departmentService.findById(staff.DepartmentId);
    
            if (!department) {
                return callback({status: 404, message: "Department not Found"});
            }

            const institution = await this.#institutionService.findById(department.InstitutionId);

            if (!institution) {
                return callback({status: 404, message: "Institution not Found"});
            }
    
            const courses = await this.#examCourseService.getCoursesByDepartment(department.id);
            const events = await this.#eventService.getEventsByInstitution(department.InstitutionId);
            const startDate = payload.startsAt;
            const endDate = payload.endsAt

            const timetable = await this.#scheduler.generateExamTimetable(courses, events, department, institution, startDate, endDate);

            const { url } = await this.#scheduler.generateExamExcelTimetable(department.name, institution.name, timetable);

            const students = await this.#studentService.getStudents(department.id);

            let timetableNotification = {
                recipients: students.rows.map(student => student.rows.User.emailAddress),
                data: {},
                attachment: [ url ]
            }

            await this.#notificationService.sendNewStudentTimeTable(timetableNotification, resp => {});

            callback({status: 201, message: "TimeTable Generated Successfully", data: { timetable, timetableUrl: url }});
        } catch (err) {
            this.#logger.error(err);
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    getDepartmentExamTimetable = async (departmentId, callback) => {
        try {
            const department = await this.#departmentService.findById(departmentId);
    
            if (!department) {
                return callback({status: 404, message: "Department not Found"});
            }

            const institution = await this.#institutionService.findById(department.InstitutionId);

            if (!institution) {
                return callback({status: 404, message: "Institution not Found"});
            }

            const fileName = `${department.name}-${institution.name}-examination-timetable.json`;
            const jsonFilePath = path.join(__dirname, '../timetables', fileName);

            const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
            const timetable = JSON.parse(jsonData);

            const { url } = await this.#scheduler.generateExamExcelTimetable(department.name, institution.name, timetable);

            callback({status: 200, data: { timetable, timetableUrl: url }});
            
        } catch (err) {
            this.#logger.error(err);
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    getStudentExamTimetable = async (studentId, callback) => {
        try {
            const student = await this.#staffService.findById(studentId);

            if (!student) {
                return callback({status: 404, message: "Student not Found"});
            }

            const department = await this.#departmentService.findById(student.DepartmentId);
    
            if (!department) {
                return callback({status: 404, message: "Department not Found"});
            }

            const institution = await this.#institutionService.findById(department.InstitutionId);

            if (!institution) {
                return callback({status: 404, message: "Institution not Found"});
            }

            const fileName = `${department.name}-${institution.name}-examination-timetable.json`;
            const jsonFilePath = path.join(__dirname, '../timetables', fileName);

            const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
            const timetable = JSON.parse(jsonData);

            const { url } = await this.#scheduler.generateExamExcelTimetable(department.name, institution.name, timetable);

            callback({status: 200, data: { timetable, timetableUrl: url }});
            
        } catch (err) {
            this.#logger.error(err);
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    getStaffExamTimetable = async (staffId, callback) => {
        try {
            const staff = await this.#staffService.findById(staffId);

            if (!staff) {
                return callback({status: 404, message: "Staff not Found"})
            }

            this.getIntitutionExamTimetable(staff.InstitutionId, resp => {
                callback(resp);
            })
        } catch (err) {
            this.#logger.error(err);
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    getIntitutionExamTimetable = async (institutionId, callback) => {
        try {
            const institution = await this.#institutionService.findById(institutionId);
    
            if (!institution) {
                return callback({ status: 404, message: "Institution not Found" });
            }
    
            const departments = await this.#departmentService.getAllDepartmentByInstitutionId({ institutionId: institution.id });
    
            if (departments.length === 0) {
                return callback({ status: 404, message: "Department not Found" });
            }
    
            let combinedTimetable = {};
    
            for (const department of departments) {
                const fileName = `${department.name}-${institution.name}-examination-timetable.json`;
                const jsonFilePath = path.join(__dirname, '../timetables', fileName);

                if (fs.existsSync(jsonFilePath)) {
                    const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
                    const timetable = JSON.parse(jsonData);
        
                    for (const date in timetable) {
                        if (combinedTimetable[date]) {
                            combinedTimetable[date].push(...timetable[date]);
                        } else {
                            combinedTimetable[date] = [...timetable[date]];
                        }
                    }
                }
            }

            const { url } = await this.#scheduler.generateExamExcelTimetable("all", institution.name, combinedTimetable);
    
            callback({ status: 200, data: { timetable: combinedTimetable, timetableUrl: url } });
    
        } catch (err) {
            this.#logger.error(err);
            callback({ status: 500, message: "Internal Server Error" });
        }
    }   

    addExaminationCourse = async (payload, callback) => {
        try {
            const course = await this.#courseService.findById(payload.CourseId);
    
            if (!course) {
                return callback({status: 404, message: "Department not Found"});
            }

            const examCourse = await this.#examCourseService.create({
                duration: payload.duration,
                DepartmentId: course.DepartmentId,
                CourseId: course.id,
                LevelId: payload.LevelId,
                VenueId: payload.VenueId
            })

            if (!examCourse.id) {
                return callback({status: 400, message: "An error occurred"})
            }


            callback({status: 201, message: "Course Added"});
        } catch (err) {
            this.#logger.error(err);
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    removeExaminationCourse = async (courseId, callback) => {
        try {
            const examCourseDeleted = await this.#examCourseService.delete(courseId);

            if (examCourseDeleted != 1) {
                return callback({status: 400, message: "An error occurred"})
            }

            callback({status: 200, message: "Exam Deleted Successfully"});
        } catch (err) {
            this.#logger.error(err);
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    getDepartmentExamCourses = async (departmentId, callback) => {
        try {

            const department = await this.#departmentService.findById(departmentId);

            if (!department) {
                return callback({status: 404, message: "Staff not Found"});
            }
            
            const examCourses = await this.#examCourseService.getCoursesByDepartment(department.id);

            const courses = [];

            for ( const examCourse of examCourses ) {
                courses.push({
                    id: examCourse.id,
                    courseCode: examCourse.Course.courseCode,
                    courseName: examCourse.Course.courseName,
                    duration: examCourse.duration,
                    venue: examCourse.Venue.venue
                })
            }

            callback({status: 200, data: { courses }});
        } catch (err) {
            this.#logger.error(err);
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    updateExaminationCourse = async (courseId, payload, callback) => {
        try {
            const updatedCourse = await this.#examCourseService.update(courseId, payload);
    
            if (updatedCourse != 1) {
                return callback({status: 404, message: "Course not updated"});
            }

            callback({status: 200, message: "Course Updated"});
        } catch (err) {
            this.#logger.error(err);
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    #formatEvent = (event) => {
        const formatTime = (time) => {
            const [hours, minutes, seconds] = time.split(':');
            let suffix = 'AM';
            let formattedHours = parseInt(hours);
            
            if (formattedHours >= 12) {
                suffix = 'PM';
                formattedHours -= 12;
            }
            if (formattedHours === 0) {
                formattedHours = 12;
            }
            
            return `${formattedHours}:${minutes} ${suffix}`;
        };
    
        if (event.recurring) {
            const startTime = formatTime(event.startFrom);
            const endTime = formatTime(event.endsAt);
            const day = event.day;
            return `Every ${day}, ${startTime} - ${endTime}`;
        } else {
            const startTime = formatTime(event.startFrom);
            const endTime = formatTime(event.endsAt);
            const dateParts = event.date.split('-');
            const date = `${dateParts[1]} ${dateParts[2]} ${dateParts[0]}`;
            return `${date}, ${startTime} - ${endTime}`;
        }
    }
}

module.exports = CoreService;