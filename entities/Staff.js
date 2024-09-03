const DatabaseEngine = require("../utils/DatabaseEngine");
const { Model, DataTypes} = require("sequelize");
const User = require("./User");
const Institution = require("./Institution");
const Department = require("./Department");

const db = new DatabaseEngine();

class Staff extends Model {};

Staff.init(
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

User.hasOne(Staff, {
    foreignKey: {
        allowNull: false
    }
})

Staff.belongsTo(User)

Institution.hasMany(Staff, {
    foreignKey: {
        allowNull: false
    }
})
Staff.belongsTo(Institution)

Department.hasMany(Staff, {
    foreignKey: {
        allowNull: false
    }
})
Staff.belongsTo(Department)

module.exports = Staff;