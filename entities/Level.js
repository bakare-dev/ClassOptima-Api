const DatabaseEngine = require("../utils/DatabaseEngine");
const { Model, DataTypes} = require("sequelize");
const Institution = require("./Institution");

const db = new DatabaseEngine();

class Level extends Model {};

Level.init(
    {
        level: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: db.getConnectionManager()
    }
)

Institution.hasMany(Level, {
    foreignKey: {
        allowNull: false
    }
})
Level.belongsTo(Institution)

module.exports = Level;