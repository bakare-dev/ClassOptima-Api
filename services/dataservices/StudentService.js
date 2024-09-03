const Service = require("./Service");
const StudentEntity = require("../../entities/Student");
const UserEntity = require("../../entities/User");
const DepartmentEntity = require("../../entities/Department");
const LevelEntity = require("../../entities/Level");
const InstitutionEntity = require("../../entities/Institution");
const Helper = require("../../utils/Helper");
const { Sequelize } = require("sequelize");

let instance;

class StudentService extends Service {

    #helper;

    constructor () {

        if (instance) return instance;


        super(StudentEntity);

        this.#helper = new Helper();


        instance = this

    }

    getProfileByDepartment = async (query) => {
        let response;
        response = await StudentEntity.findAndCountAll({
            where: {
                DepartmentId: query.departmentId
            },
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

    getProfileByUserId = async (userId) => {
        return await StudentEntity.findOne({
            where: {
                UserId: userId
            },
            include: [
                {
                    model: UserEntity,
                    attributes: [ "emailAddress" ]
                },
                {
                    model: DepartmentEntity,
                    attributes: [ "name" ]
                },
                {
                    model: LevelEntity,
                    attributes: [ "level" ]
                },
                {
                    model: InstitutionEntity,
                    attributes: [ "name" ]
                }
            ]
        })
    }
    
    getStudents = async (departmentId) => {
        return await StudentEntity.findAndCountAll({
            where: {
                DepartmentId: departmentId
            },
            include: [
                {
                    model: UserEntity,
                    attributes: [ "emailAddress" ]
                },
            ],
        });
    }

    getStudentsByInstitutionId = async (institutionId, query) => {
        let response;
        response = await StudentEntity.findAndCountAll({
            where: {
                InstitutionId: institutionId
            },
            include: [
                {
                    model: UserEntity,
                    attributes: [ "emailAddress" ]
                },
                {
                    model: DepartmentEntity,
                    attributes: [ "name" ]
                },
                {
                    model: LevelEntity,
                    attributes: [ "level" ]
                },
                InstitutionEntity,
            ],
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

    getAllStudentByDepartment = async (departmentId) => {
        return StudentEntity.findAll({
            where: {
                DepartmentId: departmentId
            },
            include: [
                {
                    model: UserEntity,
                    attributes: [ "emailAddress" ]
                },
            ]
        })
    }

    getStudentCount = async (institutionId) => {
        return StudentEntity.count({
            where: {
                InstitutionId: institutionId
            }
        })
    }

    search = async (key) => {
        return await StudentEntity.findAll({
            where: {
                [Sequelize.Op.or]: [
                    { '$User.emailAddress$': { [Sequelize.Op.like]: `%${key}%` } },
                    { '$Department.name$': { [Sequelize.Op.like]: `%${key}%` } },
                    { '$Level.level$': { [Sequelize.Op.like]: `%${key}%` } },
                    { '$Institution.name$': { [Sequelize.Op.like]: `%${key}%` } },
                    { fullName: { [Sequelize.Op.like]: `%${key}%` } }
                ]
            },
            include: [
                {
                    model: UserEntity,
                    attributes: [ "emailAddress" ]
                },
                {
                    model: DepartmentEntity,
                    attributes: [ "name" ]
                },
                {
                    model: LevelEntity,
                    attributes: [ "level" ]
                },
                {
                    model: InstitutionEntity,
                    attributes: [ "name" ]
                }
            ]
        });
    }
 }

module.exports = StudentService;