const DatabaseEngine = require("../utils/DatabaseEngine");
const { Model, DataTypes} = require("sequelize");
const Staff = require("./Staff");
const Department = require("./Department");
const Level = require("./Level");

const db = new DatabaseEngine();

class StaffAdmin extends Model {};

StaffAdmin.init(
    {
        
    },
    {
        sequelize: db.getConnectionManager()
    }
)

Staff.hasOne(StaffAdmin, {
    foreignKey: {
        allowNull: false
    }
})

StaffAdmin.belongsTo(Staff)

Department.hasMany(StaffAdmin, {
    foreignKey: {
        allowNull: false
    }
})
StaffAdmin.belongsTo(Department)

Level.hasMany(StaffAdmin, {
    foreignKey: {
        allowNull: false
    }
})
StaffAdmin.belongsTo(Level)

module.exports = StaffAdmin;