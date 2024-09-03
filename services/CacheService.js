const redis = require("redis");
const { infrastructure } = require("../config/main.settings")
const { promisify } = require("util");
const Logger = require("../utils/Logger");
const RedisHelper = require("../utils/Redis");

let instance;

class CacheService {
    #client;
    #logger;

    constructor() {
        
        if (instance) return instance;

        this.#client = new RedisHelper().getClient();

        this.#logger = new Logger().getLogger();

        instance = this;
    }

    set = async (key, payload, ex) => {
        try {
            await this.#client.setEx(key, ex, JSON.stringify(payload));
        } catch (error) {
            this.#logger.error("Error setting cache:", error)
            throw new Error("Error caching");
        }
    }

    get = async (key) => {
        try {
            const data = await this.#client.get(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            this.#logger.error("Error getting from cache:", error)
            throw new Error("Error getting from cache")
        }
    }

    del = async (key) => {
        try {
            await this.#client.del(key);
        } catch (error) {
            this.#logger.error("Error deleting from cache:", error)
            throw new Error("Error deleting from cache");
        }
    }
}

module.exports = CacheService;
