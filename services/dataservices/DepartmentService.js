const Service = require("./Service");
const DepartmentEntity = require("../../entities/Department");
const Helper = require("../../utils/Helper");
const { Sequelize } = require("sequelize");

let instance;

class DepartmentService extends Service {

    #helper;


    constructor () {

        if (instance) return instance;


        super(DepartmentEntity);

        this.#helper = new Helper();


        instance = this

    }

    getDepartmentByInstitutionId = async (query) => {
        let response;
        response = await DepartmentEntity.findAndCountAll({
            where: {
                InstitutionId: query.institutionId
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

    getAllDepartmentByInstitutionId = async (query) => {
        return await DepartmentEntity.findAll({
            where: {
                InstitutionId: query.institutionId
            },
        });
    }

    search = async (key) => {
        return await DepartmentEntity.findAll({
            where: {
                name: { [Sequelize.Op.like]: `%${key}%` }
            }
        });
    }
}

module.exports = DepartmentService;