const DatabaseEngine = require("../utils/DatabaseEngine");
const { Model, DataTypes} = require("sequelize");
const Event = require("./Event");
const Department = require("./Department");

const db = new DatabaseEngine();

class DepartmentEvent extends Model {};

DepartmentEvent.init(
    {
        
    },
    {
        sequelize: db.getConnectionManager()
    }
)

Event.hasMany(DepartmentEvent, {
    foreignKey: {
        allowNull: false
    }
})
DepartmentEvent.belongsTo(Event);

Department.hasMany(DepartmentEvent, {
    foreignKey: {
        allowNull: false
    }
})
DepartmentEvent.belongsTo(Department)

module.exports = DepartmentEvent;