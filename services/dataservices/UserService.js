const Service = require("./Service");
const UserEntity = require("../../entities/User");
const { Sequelize } = require("sequelize");

let instance;

class UserService extends Service {


    constructor () {

        if (instance) return instance;


        super(UserEntity);


        instance = this

    }

    findByEmail = async (email) => {
        return await UserEntity.findOne({
            where: {
                emailAddress: email
            }
        })
    }

    search = async (key) => {
        return await UserEntity.findAll({
            where: {
                emailAddress: { [Sequelize.Op.like]: `%${key}%` }
            }
        });
    }
}

module.exports = UserService;