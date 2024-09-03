"use strict";
const config = require("../config/main.settings");
const { Sequelize } = require("sequelize");
const Logger = require("./Logger");

let instance;

class DatabaseEngine {
  #connectionManager;
  #logger;

  constructor() {
    if (instance) return instance;

    this.#connectionManager = new Sequelize(
      config.database.development.database,
      config.database.development.username,
      config.database.development.password,
      {
        host: config.database.development.host,
        dialect: config.database.development.dialect,
        logging: false,
      }
    );

    this.#logger = new Logger().getLogger();

    instance = this;
  }

  connect = async (cb) => {
    try {
      await this.#connectionManager.authenticate();
      await this.#synchronize();
      cb();
    } catch (e) {
      this.#logger.error(e);
    }
  };

  disconnect = async (cb) => {
    try {
      await this.#connectionManager.close();
      cb();
    } catch (e) {
      this.#logger.error(e);
    }
  };

  #synchronize = async () => {
    try {
      const db = {};

      this.#connectionManager.db = db;

      db.course = require("../entities/Course");
      db.institution = require("../entities/Institution");
      db.department = require("../entities/Department");
      db.level = require("../entities/Level");
      db.staff = require("../entities/Staff");
      db.staffadmin = require("../entities/StaffAdmin");
      db.student = require("../entities/Student");
      db.studentadmin = require("../entities/StudentAdmin");
      db.timetable = require("../entities/TimeTable");
      db.user = require("../entities/User");
      db.courseVenue = require("../entities/CourseVenue");
      db.venue = require("../entities/Venue");
      db.departmentEvent = require("../entities/DepartmentEvent");
      db.event = require("../entities/Event");
      db.eventVenue = require("../entities/EventVenue");
      db.institutionUser = require("../entities/InstitutionUser");
      db.staffCourse = require("../entities/StaffCourse");
      db.departmentStaff = require("../entities/DepartmentStaff");
      db.levelEvents = require("../entities/LevelEvent");
      db.courseExam = require("../entities/CourseExam")

      await this.#connectionManager.sync({ alter: true });
    } catch (e) {
      this.#logger.error(e);
    }
  };

  getConnectionManager = () => this.#connectionManager;
}

module.exports = DatabaseEngine;
