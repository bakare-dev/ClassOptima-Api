const DatabaseEngine = require("../utils/DatabaseEngine");
const { Model, DataTypes} = require("sequelize");
const Course = require("./Course");
const Venue = require("./Venue");
const Level = require("./Level");
const Department = require("./Department");

const db = new DatabaseEngine();

class CourseExam extends Model {};

CourseExam.init(
    {
        duration: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        sequelize: db.getConnectionManager()
    }
)

Course.hasMany(CourseExam, {
    foreignKey: {
        allowNull: false
    }
})
CourseExam.belongsTo(Course);

Venue.hasMany(CourseExam, {
    foreignKey: {
        allowNull: false
    }
})
CourseExam.belongsTo(Venue)

Level.hasMany(CourseExam, {
    foreignKey: {
        allowNull: false
    }
})
CourseExam.belongsTo(Level)

Department.hasMany(CourseExam, {
    foreignKey: {
        allowNull: false
    }
})
CourseExam.belongsTo(Department)

module.exports = CourseExam;