const DatabaseEngine = require("../utils/DatabaseEngine");
const { Model, DataTypes} = require("sequelize");
const Event = require("./Event");
const Level = require("./Level");

const db = new DatabaseEngine();

class LevelEvent extends Model {};

LevelEvent.init(
    {
        
    },
    {
        sequelize: db.getConnectionManager()
    }
)

Event.hasMany(LevelEvent, {
    foreignKey: {
        allowNull: false
    }
})
LevelEvent.belongsTo(Event);

Level.hasMany(LevelEvent, {
    foreignKey: {
        allowNull: false
    }
})
LevelEvent.belongsTo(Level)

module.exports = LevelEvent;