const Service = require("./Service");
const DepartmentStaffEntity = require("../../entities/DepartmentStaff");
const Helper = require("../../utils/Helper");
const StaffEntity = require("../../entities/Staff");

let instance;

class DepartmentStaffService extends Service {

    #helper;


    constructor () {

        if (instance) return instance;


        super(DepartmentStaffEntity);

        this.#helper = new Helper();


        instance = this

    }

    getDepartmentStaffByInstitutionId = async (query) => {
        let response;
        response = await DepartmentStaffEntity.findAndCountAll({
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

    getDepartmentStaffs = async (departmentId) => {
        return await DepartmentStaffEntity.findAndCountAll({
            where: {
                DepartmentId: departmentId
            },
            include: [ StaffEntity ]
        })
    }
}

module.exports = DepartmentStaffService;