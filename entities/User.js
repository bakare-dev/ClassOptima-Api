const DatabaseEngine = require("../utils/DatabaseEngine");
const { Model, DataTypes} = require("sequelize");

const db = new DatabaseEngine();

class User extends Model {};

User.init(
    {
        emailAddress: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.INTEGER, // 0-Super Admin, 1-Institution Super-Admin, 3-Institution Staff, 4-Institution Student
            allowNull: false, 
        },
        activated: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },
    {
        sequelize: db.getConnectionManager()
    }
)

module.exports = User;