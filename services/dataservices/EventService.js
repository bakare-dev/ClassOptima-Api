const Service = require("./Service");
const EventEntity = require("../../entities/Event");

let instance;

class EventService extends Service {


    constructor () {

        if (instance) return instance;


        super(EventEntity);


        instance = this

    }

    getEventsByInstitution = async (institutionId) => {
        return await EventEntity.findAndCountAll({
            where: {
                InstitutionId: institutionId
            },
        })
    }
}

module.exports = EventService;