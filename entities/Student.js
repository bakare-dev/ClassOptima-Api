const DatabaseEngine = require("../utils/DatabaseEngine");
const { Model, DataTypes} = require("sequelize");
const User = require("./User");
const Department = require("./Department");
const Level = require("./Level");
const Institution = require("./Institution");

const db = new DatabaseEngine();

class Student extends Model {};

Student.init(
    {
        fullName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: db.getConnectionManager()
    }
)

User.hasOne(Student, {
    foreignKey: {
        allowNull: false
    }
})

Student.belongsTo(User)

Department.hasMany(Student, {
    foreignKey: {
        allowNull: false
    }
})
Student.belongsTo(Department)

Level.hasMany(Student, {
    foreignKey: {
        allowNull: false
    }
})
Student.belongsTo(Level)

Institution.hasMany(Student, {
    foreignKey: {
        allowNull: false,
    }
})
Student.belongsTo(Institution)

module.exports = Student;