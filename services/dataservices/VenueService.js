const Service = require("./Service");
const VenueEntity = require("../../entities/Venue");

let instance;

class VenueService extends Service {


    constructor () {

        if (instance) return instance;


        super(VenueEntity);


        instance = this

    }

    search = async (key) => {
        return await VenueEntity.findAll({
            where: {
                venue: { [Sequelize.Op.like]: `%${key}%` }
            }
        });
    }

    getVenueCount = async (institutionId) => {
        return VenueEntity.count({
            where: {
                InstitutionId: institutionId
            }
        })
    }
}

module.exports = VenueService;