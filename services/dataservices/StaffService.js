const Service = require("./Service");
const StaffEntity = require("../../entities/Staff");
const Helper = require("../../utils/Helper");
const UserEntity = require("../../entities/User");
const DepartmentEntity = require("../../entities/Department");
const InstitutionEntity = require("../../entities/Institution");
const { Sequelize } = require("sequelize");

let instance;

class StaffService extends Service {

    #helper;

    constructor () {

        if (instance) return instance;


        super(StaffEntity);
        this.#helper = new Helper();


        instance = this

    }

    getProfileByUserId = async (userId) => {
        return await StaffEntity.findOne({
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
                    model: InstitutionEntity,
                    attributes: [ "name" ]
                }
            ]
        })
    }

    getProfileByDepartment = async (query) => {
        let response;
        response = await StaffEntity.findAndCountAll({
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

    getProfileByStaffId = async (staffId) => {
        return await StaffEntity.findOne({
            where: {
                StaffId: staffId
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
                    model: InstitutionEntity,
                    attributes: [ "name" ]
                }
            ]
        })
    }

    getProfilesUsingSearchQuery = async (query, payload) => {
        let response;
        response = await StaffEntity.findAndCountAll({
            where: {
                payload
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

    getStaffByInstitutionId = async (institutionId, query) => {
        let response;
        response = await StaffEntity.findAndCountAll({
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

    getStaffcount = async (institutionId) => {
        return StaffEntity.count({
            where: {
                InstitutionId: institutionId
            }
        })
    }

    search = async (key) => {
        return await StaffEntity.findAll({
            where: {
                [Sequelize.Op.or]: [
                    { '$User.emailAddress$': { [Sequelize.Op.like]: `%${key}%` } },
                    { '$Department.name$': { [Sequelize.Op.like]: `%${key}%` } },
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
                    model: InstitutionEntity,
                    attributes: [ "name" ]
                }
            ]
        });
    }
}

module.exports = StaffService;