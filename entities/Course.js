const DatabaseEngine = require("../utils/DatabaseEngine");
const { Model, DataTypes} = require("sequelize");
const Institution = require("./Institution");
const Department = require("./Department");
const Venue = require("./Venue");
const Level = require("./Level");

const db = new DatabaseEngine();

class Course extends Model {};

Course.init(
    {
        courseCode: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        courseName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        unit: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        requirementStatus: {
            type: DataTypes.STRING,
            allowNull: false
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        sequelize: db.getConnectionManager()
    }
)

Institution.hasMany(Course, {
    foreignKey: {
        allowNull: false
    }
})
Course.belongsTo(Institution)

Department.hasMany(Course, {
    foreignKey: {
        allowNull: false
    }
})
Course.belongsTo(Department)

Venue.hasMany(Course, {
    foreignKey: {
        allowNull: false
    }
})
Course.belongsTo(Venue)

Level.hasMany(Course, {
    foreignKey: {
        allowNull: false
    }
})
Course.belongsTo(Level)

module.exports = Course;