const Service = require("./Service");
const CourseVenueEntity = require("../../entities/CourseVenue");
const VenueEntity = require("../../entities/Venue");

let instance;

class CourseVenueService extends Service {


    constructor () {

        if (instance) return instance;


        super(CourseVenueEntity);


        instance = this

    }

    getCourseVenues = async (courseId) => {
        return await CourseVenueEntity.findAll({
            where: {
                CourseId: courseId
            },
            include: [ VenueEntity ]
        })
    }
}

module.exports = CourseVenueService;