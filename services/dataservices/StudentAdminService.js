const Service = require("./Service");
const StudentAdminEntity = require("../../entities/StudentAdmin");
const Student = require("../../entities/Student");

let instance;

class StudentAdminService extends Service {


    constructor () {

        if (instance) return instance;


        super(StudentAdminEntity);


        instance = this

    }

    getProfileByStudentId = async (studentId) => {
        return await StudentAdminEntity.findOne({
            where: {
                StudentId: studentId
            }
        })
    }

    getStudentCount = async (institutionId) => {
        return StudentAdminEntity.count({
            include: [
                {
                    model: Student,
                    where: {
                        InstitutionId: institutionId
                    }
                }
            ]
        })
    }
}

module.exports = StudentAdminService;