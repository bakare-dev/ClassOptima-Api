const jwt = require("jsonwebtoken");
const { security, infrastructure } = require("../config/main.settings");
const CacheService = require("../services/CacheService");
const { v4: uuidv4 } = require("uuid");
const dayjs = require("dayjs");
const Logger = require("../utils/Logger");

let instance;

class Authenticator {
    #key;
    #cacheService;
    #logger;

    constructor() {

        if (instance) return instance;

        this.#key = security.jwtSecret;
        this.#cacheService = new CacheService();
        this.#logger = new Logger().getLogger();

        instance = this;
    }

    authenticateJWT = async (req, res, next) => {
        const authHeader = req.get("Authorization");

        if (!authHeader) {
            req.isAuth = false;
            return next();
        }

        let token = authHeader.split(' ')[1];

        if (!token) {
            req.isAuth = false;
            return next();
        }

        const key = this.#generateTokenCacheKey(token);

        const isRovoked = await this.#cacheService.get(key);

        if (isRovoked) {
            req.isAuth = false;
            return next();
        }

        let decodedToken;

        try {
            decodedToken = jwt.verify(token, this.#key);
        } catch (err) {
            req.isAuth = false;
            return next();
        }

        if (!decodedToken) {
            req.isAuth = false;
            this.#logger.error("unable to decode")
            return next();
        }

        const storedToken = await this.#cacheService.get(`userauth: ${decodedToken.userId}`);

        if (!storedToken) {
            req.isAuth = false;
            return next();   
        }

        req.isAuth = true;
        req.userId = storedToken.userId;
        req.type = storedToken.type;
        return next();
    };

    generateTokens = (userId, type, callback) => {
        const id = uuidv4();

        this.#cacheService.set(`userauth: ${id}`, { userId: userId, type: type }, 3600);


        let token = jwt.sign({ userId: id }, security.jwtSecret, {
            expiresIn: '1h'
        });

        let tokenExpire = new Date().getTime() + ( 1 * 60 * 60000);

        token = {
            token,
            expiresIn: dayjs(new Date(tokenExpire)).format(infrastructure.dateFormat)
        }

        callback(token);
    };

    invalidateToken = async (req, res, next) => {
        const authHeader = req.get("Authorization");

        if (!authHeader) {
            req.isAuth = false;
            return next();
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            req.isAuth = false;
            return next();
        }
        
        const key = this.#generateTokenCacheKey(token);

        const storedToken = await this.#cacheService.get(key);

        if (storedToken) {
            req.isAuth = true;
            return next();
        }

        let refreshTokenExpire = new Date().getTime() + 7 * 24 * 60 * 60000;

        await this.#cacheService.set(key, { token: token }, refreshTokenExpire);

        req.isAuth = true;
        return next();
    }

    #generateTokenCacheKey = (token) => {
        return "usertk: " + token;
    };
}

module.exports = Authenticator;
