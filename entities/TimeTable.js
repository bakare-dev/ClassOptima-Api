const DatabaseEngine = require("../utils/DatabaseEngine");
const { Model, DataTypes} = require("sequelize");
const Level = require("./Level");
const Department = require("./Department");

const db = new DatabaseEngine();

class TimeTable extends Model {};

TimeTable.init(
    {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        filePath: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.INTEGER, // 0-bydepartmentandlevel, 1-bycourses, 2-all
            allowNull: false, 
        }
    },
    {
        sequelize: db.getConnectionManager()
    }
)


Level.hasMany(TimeTable);
TimeTable.belongsTo(Level);

Department.hasMany(TimeTable);
TimeTable.belongsTo(Department);

module.exports = TimeTable;