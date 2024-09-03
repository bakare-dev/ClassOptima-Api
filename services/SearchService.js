const Logger = require("../utils/Logger");
const CacheService = require("./CacheService");
const DepartmentService = require("./dataservices/DepartmentService");
const InstitutionService = require("./dataservices/InstitutionService");
const LevelService = require("./dataservices/LevelService");
const StaffService = require("./dataservices/StaffService");
const StudentService = require("./dataservices/StudentService");
const UserService = require("./dataservices/UserService");
const CourseService = require("./dataservices/CourseService");
const VenueService = require("./dataservices/VenueService");

let instance;

class SearchService {

    #logger;
    #cacheService;
    #studentService;
    #staffService;
    #institutionService;
    #courseService;
    #userService;
    #departmentService;
    #levelService;
    #venueService;

    constructor () {
        if (instance) return instance;

        this.#logger = new Logger().getLogger();
        this.#cacheService = new CacheService();
        this.#studentService = new StudentService();
        this.#staffService = new StaffService();
        this.#institutionService = new InstitutionService();
        this.#courseService = new CourseService();
        this.#userService = new UserService();
        this.#departmentService = new DepartmentService();
        this.#levelService = new LevelService();
        this.#venueService = new VenueService();

        instance = this;
    }

    // Return list of user search, schools search, course search, venue search, department search, level search
    search = async (key, service, callback) => {
        try {
            let result;

            const cachedResult = await this.#cacheService.get(key);
            if (cachedResult && cachedResult.length > 0) {
                callback({ status: 200, data: { result: cachedResult } });
                return; 
            }

            switch (service) {
                case 'student':
                    result = await this.#studentService.search(key);
                    break;
                case 'staff':
                    result = await this.#staffService.search(key);
                    break;
                case 'institution':
                    result = await this.#institutionService.search(key);
                    break;
                case 'course':
                    result = await this.#courseService.search(key);
                    break;
                case 'user':
                    result = await this.#userService.search(key);
                    break;
                case 'department':
                    result = await this.#departmentService.search(key);
                    break;
                case 'venue':
                    result = await this.#venueService.search(key);
                    break;
                case 'level':
                    result = await this.#levelService.search(key);
                    break;
                default:
                    throw new Error('Invalid service type');
            }

            if (result && result.length > 0) {
                await this.#cacheService.set(key, result, 30 * 24 * 60 * 60 * 1000 );
            }

            callback({ status: 200, data: { result } });
        } catch (err) {
            this.#logger.error(err);
            callback({ status: 500, message: "Internal Server Error" });
        }
    }
}

module.exports = SearchService;
