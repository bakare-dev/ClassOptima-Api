const Server = require("./server/Server");
const config = require("./config/main.settings");
const Logger = require("./utils/Logger");
const ValidateJSInit = require("./utils/ValidateJSInit");
const DatabaseEngine = require("./utils/DatabaseEngine")

const logger = new Logger().getLogger();


main = async () => {
    try{
        let validateJSInit = new ValidateJSInit();
        validateJSInit.setup();

        let server = new Server(config.server.port);
        server.start();

        // const db = new DatabaseEngine();

        // db.connect( async () => {
        //     let serverEngine = new Server(config.server.port);
        //     serverEngine.start();
        // });
    }catch(err){
        logger.error(err);
        process.exit(1);
    }
}

main();


