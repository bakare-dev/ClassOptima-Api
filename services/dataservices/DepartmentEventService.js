const Service = require("./Service");
const DepartmentEventEntity = require("../../entities/DepartmentEvent");
const DepartmentEntity = require("../../entities/Department");
const EventEntity = require("../../entities/Event");

let instance;

class DepartmentEventService extends Service {


    constructor () {

        if (instance) return instance;


        super(DepartmentEventEntity);


        instance = this

    }

    getDepartmentEvents = async (eventId) => {
        return DepartmentEventEntity.findAll({
            where: {
                EventId: eventId
            },
            include: [ DepartmentEntity ]
        })
    }
}

module.exports = DepartmentEventService;