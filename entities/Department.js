const DatabaseEngine = require("../utils/DatabaseEngine");
const { Model, DataTypes} = require("sequelize");
const Institution = require("./Institution");

const db = new DatabaseEngine();

class Department extends Model {};

Department.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: db.getConnectionManager()
    }
)

Institution.hasMany(Department, {
    foreignKey: {
        allowNull: false
    }
})
Department.belongsTo(Institution)

module.exports = Department;