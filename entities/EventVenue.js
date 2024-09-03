const DatabaseEngine = require("../utils/DatabaseEngine");
const { Model, DataTypes} = require("sequelize");
const Event = require("./Event");
const Venue = require("./Venue");

const db = new DatabaseEngine();

class EventVenue extends Model {};

EventVenue.init(
    {
        
    },
    {
        sequelize: db.getConnectionManager()
    }
)

Event.hasMany(EventVenue, {
    foreignKey: {
        allowNull: false
    }
})
EventVenue.belongsTo(Event);

Venue.hasMany(EventVenue, {
    foreignKey: {
        allowNull: false
    }
})
EventVenue.belongsTo(Venue)

module.exports = EventVenue;