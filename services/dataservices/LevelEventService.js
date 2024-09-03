const Service = require("./Service");
const LevelEventEntity = require("../../entities/LevelEvent");

let instance;

class LevelEventService extends Service {


    constructor () {

        if (instance) return instance;


        super(LevelEventEntity);


        instance = this

    }

    getLevelsByEventId = async (eventId) => {
        return await LevelEventEntity.findAll({
            where: {
                EventId: eventId
            }
        })
    }
}

module.exports = LevelEventService;