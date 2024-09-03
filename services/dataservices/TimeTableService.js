const Service = require("./Service");
const TimeTableEntity = require("../../entities/TimeTable");

let instance;

class TimeTableService extends Service {


    constructor () {

        if (instance) return instance;


        super(TimeTableEntity);


        instance = this

    }
}

module.exports = TimeTableService;