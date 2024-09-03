const validate = require('validate.js');
const SearchService = require('../services/SearchService');
const Logger = require('../utils/Logger');
const Authenticator = require('../utils/Authenticator');
const SearchConstraint = require('../constraints/SearchConstraint');


let instance;


class SearchController {

    #service;
    #constraint;
    #logger;
    #authenticator;


    constructor() {

        if (instance) return instance;

        this.#service = new SearchService();
        this.#logger = new Logger().getLogger();
        this.#authenticator = new Authenticator();
        this.#constraint = new SearchConstraint();

        instance = this;

    }


    search = async (req, res) => {
        try {

            const validation = validate(req.query, this.#constraint.search());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }
            

            this.#service.search(req.query.key, req.query.service, resp => {
                res.status(resp.status).json(resp)
            })
        } catch (err) {
            this.#logger.error(err);
            res.status(500).json({message: "Internal server Error"});
        }
    }

}


module.exports = SearchController;