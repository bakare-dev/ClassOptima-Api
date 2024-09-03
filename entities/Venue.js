const DatabaseEngine = require("../utils/DatabaseEngine");
const { Model, DataTypes} = require("sequelize");
const Institution = require("./Institution");

const db = new DatabaseEngine();

class Venue extends Model {};

Venue.init(
    {
        venue: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize: db.getConnectionManager()
    }
)


Institution.hasMany(Venue, {
    foreignKey: {
        allowNull: false,
        defaultValue: 1
    }
})

Venue.belongsTo(Institution);

module.exports = Venue;