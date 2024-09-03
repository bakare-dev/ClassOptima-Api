"use strict";
const express = require("express");
const swaggerUi = require('swagger-ui-express');
const Logger = require("../utils/Logger");
const UserRouter = require("./routes/UserRouter");
const CoreRouter = require("./routes/CoreRouter");
const SearchRouter = require("./routes/SearchRouter");
const Swagger = require("../utils/Swagger");
const RedisHelper = require("../utils/Redis");
const path = require("path");


let instance;
class Server {

    #app;
    #port;
    #logger;
    #swaggerspec;
    #redis;

    constructor(port) {

        if (instance) return instance;

        this.#port = port;
        this.#swaggerspec = new Swagger().getSwaggerSpec();
        this.#configure();
        this.#buildRoutes();
        this.#logger = new Logger().getLogger();
        this.#redis = new RedisHelper();

        instance = this;

    }

    #configure = () => {

        this.#app = express();
        this.#app.use(express.json());

        this.#app.use('/timetables', express.static(path.join(__dirname, '../timetables')))

        this.#app.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS,PUT');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, source, auth_mode');
            res.setHeader('Access-Control-Allow-Credentials', 'true');

            if (req.method === "OPTIONS") {
                return res.sendStatus(200);
            }
            next();
        });
    }

    #buildRoutes = () => {

        this.#app.get("/", (req, res) => {
            const message = {
                info: "You have reached tts-server",
                baseUrl: "/api/v1/",
                health: "/api/v1/health",
                docs: "/swagger",
            }
            res.json(message);
        });


        this.#app.use('/swagger', swaggerUi.serve, swaggerUi.setup(this.#swaggerspec));

        this.#app.get("/api/v1/health", async (req, res) => {
            const healthInfo = {
                appMemUsage: (process.memoryUsage().heapUsed / (1024 ** 3)).toFixed(2),
            };

            res.status(200).json(healthInfo);
        });

        this.#app.use("/api/v1/user", new UserRouter().getRouter());

        this.#app.use("/api/v1/core", new CoreRouter().getRouter());

        this.#app.use("/api/v1/search", new SearchRouter().getRouter())
    }

    start = () => {
        this.#app.listen(this.#port, async () => {
            await this.#redis.connect();
            this.#logger.info(`tts-server now listening on port ${this.#port}`);
        })
    }

    getServerApp = () => {
        return this.#app;
    }
}

module.exports = Server;  
