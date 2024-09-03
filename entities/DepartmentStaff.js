const DatabaseEngine = require("../utils/DatabaseEngine");
const { Model, DataTypes} = require("sequelize");
const Staff = require("./Staff");
const Department = require("./Department");

const db = new DatabaseEngine();

class DepartmentStaff extends Model {};

DepartmentStaff.init(
    {
        
    },
    {
        sequelize: db.getConnectionManager()
    }
)

Staff.hasMany(DepartmentStaff, {
    foreignKey: {
        allowNull: false
    }
})
DepartmentStaff.belongsTo(Staff);

Department.hasMany(DepartmentStaff, {
    foreignKey: {
        allowNull: false
    }
})
DepartmentStaff.belongsTo(Department)

module.exports = DepartmentStaff;