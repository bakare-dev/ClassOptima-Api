const Service = require("./Service");
const CourseEntity = require("../../entities/Course");
const Helper = require("../../utils/Helper");
const VenueEntity = require("../../entities/Venue");
const DepartmentEntity = require("../../entities/Department");
const LevelEntity = require("../../entities/Level");
const { Sequelize } = require("sequelize");

let instance;

class CourseService extends Service {

    #helper;


    constructor () {

        if (instance) return instance;


        super(CourseEntity);

        this.#helper = new Helper();


        instance = this

    }

    getCoursesByDepartmentAndLevel = async (query) => {
        let response;
        response = await CourseEntity.findAndCountAll({
            where: {
                LevelId: query.levelId,
                DepartmentId: query.departmentId
            },
            include: [ VenueEntity ],
            order: [["createdAt", "DESC"]],
            ...this.#helper.paginate(query.page, query.size),
        });

        if (query.page && query.page != "undefined") {
            response.currentPage = query.page;
        } else {
            response.currentPage = "0";
        }

        if (query.size && query.size != "undefined") {
            response.currentSize = query.size;
        } else {
            response.currentSize = "50";
        }

        return response;
    }

    getCoursesById = async (query) => {
        let response;
        response = await CourseEntity.findAndCountAll({
            where: {
                id: query.courseId,
            },
            include: [ VenueEntity ],
            order: [["createdAt", "DESC"]],
            ...this.#helper.paginate(query.page, query.size),
        });

        if (query.page && query.page != "undefined") {
            response.currentPage = query.page;
        } else {
            response.currentPage = "0";
        }

        if (query.size && query.size != "undefined") {
            response.currentSize = query.size;
        } else {
            response.currentSize = "50";
        }

        return response;
    }

    getCoursesByDepartment = async (query) => {
        let response;
        response = await CourseEntity.findAndCountAll({
            where: {
                DepartmentId: query.departmentId
            },
            include: [ VenueEntity ],
            order: [["createdAt", "DESC"]],
            ...this.#helper.paginate(query.page, query.size),
        });

        if (query.page && query.page != "undefined") {
            response.currentPage = query.page;
        } else {
            response.currentPage = "0";
        }

        if (query.size && query.size != "undefined") {
            response.currentSize = query.size;
        } else {
            response.currentSize = "50";
        }

        return response;
    }

    getAllCoursesByDepartment = async (departmentId) => {
        return await CourseEntity.findAll({
            where: {
                DepartmentId: departmentId
            },
            include: [ VenueEntity, DepartmentEntity, LevelEntity ],
        });
    }

    getCourseById = async (courseId) => {
        return await CourseEntity.findOne({
            where: {
                id: courseId
            },
            include: [VenueEntity]
        })
    }

    search = async (key) => {
        return await CourseEntity.findAll({
            where: {
                [Sequelize.Op.or]: [
                    { courseCode: { [Sequelize.Op.like]: `%${key}%` } },
                    { courseName: { [Sequelize.Op.like]: `%${key}%` } },
                    { requirementStatus: { [Sequelize.Op.like]: `%${key}%` } },
                    { duration: { [Sequelize.Op.like]: `%${key}%` } }
                ]
            }
        });
    }
}

module.exports = CourseService;