const Service = require("./Service");
const InstitutionUserEntity = require("../../entities/InstitutionUser");
const InstitutionEntity = require("../../entities/Institution");
const Helper = require("../../utils/Helper");
const UserEntity = require("../../entities/User");

let instance;

class InstitutionUserService extends Service {

    #helper;


    constructor () {

        if (instance) return instance;


        super(InstitutionUserEntity);

        this.#helper = new Helper();

        instance = this

    }

    getInstitutionByUserId = async (userId) => {
        return await InstitutionUserEntity.findOne({
            where: {
                UserId: userId
            },
            include: [
                {
                    model: InstitutionEntity,
                },
            ]
        })
    }

    getInstitutionByInstitutionId = async (institutionId) => {
        return await InstitutionUserEntity.findOne({
            where: {
                InstitutionId: institutionId
            },
            include: [
                {
                    model: InstitutionEntity,
                },
            ]
        })
    }

    deleteByInstitutionId = async (institutionId) => {
        return await InstitutionUserEntity.destroy({
            where: {
                InstitutionId: institutionId
            },
        })
    }

    getApprovedInsitution = async (query) => {
        let response;
        response = await InstitutionUserEntity.findAll({
            order: [["createdAt", "DESC"]],
            include: [ InstitutionEntity ],
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
}

module.exports = InstitutionUserService;