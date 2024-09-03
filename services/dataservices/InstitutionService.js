const Service = require("./Service");
const InstitutionEntity = require("../../entities/Institution");
const { Sequelize } = require("sequelize");
const Helper = require("../../utils/Helper");

let instance;

class InstitutionService extends Service {


    #helper;


    constructor () {

        if (instance) return instance;


        super(InstitutionEntity);

        this.#helper = new Helper();


        instance = this

    }

    getInstitutionByRegex = async (regex) => {
        return await InstitutionEntity.findOne({
            where: {
                emailRegex: regex
            }
        })
    }

    getNewInsitution = async (query) => {
        let response;
        response = await InstitutionEntity.findAll({
            where: {
                approved: false
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

    search = async (key) => {
        return await InstitutionEntity.findAll({
            where: {
                [Sequelize.Op.or]: [
                    { name: { [Sequelize.Op.like]: `%${key}%` } },
                    { emailRegex: { [Sequelize.Op.like]: `%${key}%` } },
                    { yearOfReg: { [Sequelize.Op.like]: `%${key}%` } },
                    { countryOfReg: { [Sequelize.Op.like]: `%${key}%` } },
                    { businessEmail: { [Sequelize.Op.like]: `%${key}%` } },
                    { registrationNumber: { [Sequelize.Op.like]: `%${key}%` } }
                ]
            }
        });
    }
}

module.exports = InstitutionService;