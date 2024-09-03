const Service = require("./Service");
const StaffAdminEntity = require("../../entities/StaffAdmin");
const Institution = require("../../entities/Institution");
const Staff = require("../../entities/Staff");

let instance;

class StaffAdminService extends Service {


    constructor () {

        if (instance) return instance;


        super(StaffAdminEntity);


        instance = this

    }

    getProfileByStaffId = async (staffId) => {
        return await StaffAdminEntity.findOne({
            where: {
                StaffId: staffId
            }
        })
    }

    getStaffCount = async (institutionId) => {
        return StaffAdminEntity.count({
            include: [
                {
                    model: Staff,
                    where: {
                        InstitutionId: institutionId
                    }
                }
            ]
        })
    }
}

module.exports = StaffAdminService;