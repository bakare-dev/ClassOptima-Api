const DatabaseEngine = require("../utils/DatabaseEngine");
const { Model, DataTypes} = require("sequelize");
const Student = require("./Student");
const Department = require("./Department");
const Level = require("./Level");

const db = new DatabaseEngine();

class StudentAdmin extends Model {};

StudentAdmin.init(
    {
        
    },
    {
        sequelize: db.getConnectionManager()
    }
)

Student.hasOne(StudentAdmin, {
    foreignKey: {
        allowNull: false
    }
})

StudentAdmin.belongsTo(Student)

Department.hasMany(StudentAdmin, {
    foreignKey: {
        allowNull: false
    }
})
StudentAdmin.belongsTo(Department)

Level.hasMany(StudentAdmin, {
    foreignKey: {
        allowNull: false
    }
})
StudentAdmin.belongsTo(Level)

module.exports = StudentAdmin;