const Service = require("./Service");
const StaffCourseEntity = require("../../entities/StaffCourse");

let instance;

class StaffCourseService extends Service {


    constructor () {

        if (instance) return instance;


        super(StaffCourseEntity);


        instance = this

    }

    getStaffCourseCount = async (staffId) => {
        return StaffCourseEntity.count({
            where: {
                StaffId: staffId
            }
        })
    }

    getStaffCourses = async (staffId) => {
        return StaffCourseEntity.findAndCountAll({
            where: {
                StaffId: staffId
            }
        })
    }
}

module.exports = StaffCourseService;