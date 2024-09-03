const http = require("http");
const https = require("https");
const Logger = require("./Logger");


let instance;
class HttpClient {


    #logger;

    constructor() {

        if (instance) return instance;
        this.#logger = new Logger().getLogger();

        instance = this;
    }


    request = async (clientOptions, data, secure, callback) => {

        let encodedData = JSON.stringify(data)

        let httpClient = secure ? https : http;

        let options = {
            method: "GET",
            hostname: 'localhost',
            path: '/',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': encodedData?.length
            }
        }



        options = { ...options, ...clientOptions };

        



        let req = httpClient.request(options, res => {




            let rawData = [];
            let responseBody;

            res.setEncoding('utf-8');

            res.on("data", chunk => {
                rawData.push(chunk)
            });

            res.on("error", (error) => {
                this.#logger.error(error);
            })

            res.on('end', () => {

                try {
                    if(rawData.length > 0)
                    {
                        responseBody = JSON.parse(rawData);
                    }else{
                        responseBody = {};
                    }
                   
                    callback({ status: res.statusCode, message: res.statusMessage, data: responseBody });
                } catch (e) {
                    this.#logger.error(`not a valid json response ${e}`);
                }


            });

        })

        req.on('error', e => {
            callback({ status: 500, message: e.message });
        })

        req.write(JSON.stringify(data));
    }


}

module.exports = HttpClient;