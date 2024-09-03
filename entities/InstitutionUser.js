const DatabaseEngine = require("../utils/DatabaseEngine");
const { Model, DataTypes} = require("sequelize");
const User = require("./User");
const Institution = require("./Institution");

const db = new DatabaseEngine();

class InstitutionUser extends Model {};

InstitutionUser.init(
    {
        
    },
    {
        sequelize: db.getConnectionManager()
    }
)

User.hasOne(InstitutionUser, {
    foreignKey: {
        allowNull: false
    }
})
InstitutionUser.belongsTo(User);

Institution.hasOne(InstitutionUser, {
    foreignKey: {
        allowNull: false
    }
})
InstitutionUser.belongsTo(Institution)

module.exports = InstitutionUser;