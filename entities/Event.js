const DatabaseEngine = require("../utils/DatabaseEngine");
const { Model, DataTypes} = require("sequelize");
const Department = require("./Department");
const Institution = require("./Institution");

const db = new DatabaseEngine();

class Event extends Model {};

Event.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        startFrom: {
            type: DataTypes.TIME,
            allowNull: false
        },
        endsAt: {
            type: DataTypes.TIME,
            allowNull: false
        },
        date: {
            type: DataTypes.STRING,
        },
        day: {
            type: DataTypes.STRING,
            defaultValue: "Everyday"
        },
        requirementStatus: {
            type: DataTypes.INTEGER,  // 0-Compulsory, 1-Optional
            allowNull: false
        },
        recurring: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },
    {
        sequelize: db.getConnectionManager()
    }
)

Institution.hasMany(Event, {
    foreignKey: {
        allowNull: false
    }
})
Event.belongsTo(Institution);

module.exports = Event;