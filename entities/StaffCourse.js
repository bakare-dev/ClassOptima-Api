const DatabaseEngine = require("../utils/DatabaseEngine");
const { Model, DataTypes} = require("sequelize");
const Course = require("./Course");
const Staff = require("./Staff");

const db = new DatabaseEngine();

class StaffCourse extends Model {};

StaffCourse.init(
    {
        
    },
    {
        sequelize: db.getConnectionManager()
    }
)

Course.hasMany(StaffCourse, {
    foreignKey: {
        allowNull: false
    }
})
StaffCourse.belongsTo(Course);

Staff.hasMany(StaffCourse, {
    foreignKey: {
        allowNull: false
    }
})
StaffCourse.belongsTo(Staff)

module.exports = StaffCourse;