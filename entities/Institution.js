const DatabaseEngine = require("../utils/DatabaseEngine");
const { Model, DataTypes} = require("sequelize");
const User = require("./User");

const db = new DatabaseEngine();

class Institution extends Model {};

Institution.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        emailRegex: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        yearOfReg: {
            type: DataTypes.DATE,
            allowNull: false
        },
        countryOfReg: {
            type: DataTypes.STRING,
            allowNull: false
        },
        businessEmail: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        registrationNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        approved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
    {
        sequelize: db.getConnectionManager()
    }
)

module.exports = Institution;