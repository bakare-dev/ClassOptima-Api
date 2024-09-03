const Service = require("./Service");
const LevelEntity = require("../../entities/Level");
const { Sequelize } = require("sequelize");

let instance;

class LevelService extends Service {


    constructor () {

        if (instance) return instance;


        super(LevelEntity);


        instance = this

    }

    search = async (key) => {
        return await LevelEntity.findAll({
            where: {
                level: { [Sequelize.Op.like]: `%${key}%` }
            }
        });
    }

    getLevelsByInstitutionId = async (institutionId) => {
        return await LevelEntity.findAll({
            where: {
                InstitutionId: institutionId
            }
        })
    }
}

module.exports = LevelService;