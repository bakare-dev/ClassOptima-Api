const Service = require("./Service");
const EventVenueEntity = require("../../entities/EventVenue");
const Venue = require("../../entities/Venue");

let instance;

class EventVenueService extends Service {


    constructor () {

        if (instance) return instance;


        super(EventVenueEntity);


        instance = this

    }

    getVenueByEventId = async (eventId) => {
        return await EventVenueEntity.findOne({
            where: {
                EventId: eventId
            },
            include: [ Venue ]
        })
    }
}

module.exports = EventVenueService;