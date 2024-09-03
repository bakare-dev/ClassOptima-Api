const DatabaseEngine = require("../utils/DatabaseEngine");
const { Model, DataTypes} = require("sequelize");
const Course = require("./Course");
const Venue = require("./Venue");

const db = new DatabaseEngine();

class CourseVenue extends Model {};

CourseVenue.init(
    {
        
    },
    {
        sequelize: db.getConnectionManager()
    }
)

Course.hasMany(CourseVenue, {
    foreignKey: {
        allowNull: false
    }
})
CourseVenue.belongsTo(Course);

Venue.hasMany(CourseVenue, {
    foreignKey: {
        allowNull: false
    }
})
CourseVenue.belongsTo(Venue)

module.exports = CourseVenue;