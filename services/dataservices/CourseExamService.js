const Service = require("./Service");
const CourseExamEntity = require("../../entities/CourseExam");
const VenueEntity = require("../../entities/Venue");
const Department = require("../../entities/Department");
const Level = require("../../entities/Level");
const Course = require("../../entities/Course");

let instance;

class CourseExamService extends Service {


    constructor () {

        if (instance) return instance;


        super(CourseExamEntity);


        instance = this

    }

    getCoursesByDepartment = async (departmentId) => {
        return CourseExamEntity.findAll({
            where: {
                DepartmentId: departmentId
            },
            include: [ Department, VenueEntity, Level, Course ]
        })
    }
}

module.exports = CourseExamService;