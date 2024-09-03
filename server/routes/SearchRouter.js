let express = require("express");
let SearchController = require("../../controllers/SearchController");
const Authenticator = require("../../utils/Authenticator");


let instance;
class SearchRouter {

    #router;
    #controller;
    #authenticator;


    constructor() {

        if (instance) return instance;

        this.#router = express.Router();
        this.#controller = new SearchController();
        this.#authenticator = new Authenticator();
        this.#configure();


        instance = this;

    }

    #configure = () => {
        //Search routes

        /**
         * Search for entities based on the provided key and service.
         * @param {object} req - The request object.
         * @param {string} req.body.key - The search key.
         * @param {string} req.body.service - The service type to search for (e.g., student, staff, institution).
         * @param {object} res - The response object.
         * @returns {object} The response containing the status, message, and search result data.
         * @swagger
         * /api/v1/search/:
         *   get:
         *     summary: Search for entities.
         *     description: Search for entities based on the provided key and service.
         *     tags:
         *      - Search
         *     parameters:
         *       - in: query
         *         name: key
         *         required: true
         *         schema:
         *           type: string
         *         description: The search key.
         *       - in: query
         *         name: service
         *         required: true
         *         schema:
         *           type: string
         *         description: The service type to search for (e.g., student, staff, institution).
         *     responses:
         *       200:
         *         description: Search successful.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 200
         *                   description: The HTTP status code.
         *                 data:
         *                   type: object
         *                   description: The search result data.
         *       422:
         *         description: Validation error. Indicates that the request parameters did not pass validation.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 422
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: validation error
         *                   description: The error message.
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 500
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Internal Server Error
         *                   description: The error message.
         */
        this.#router.get("/", this.#controller.search);

    }

    getRouter = () => {
        return this.#router;
    }
}


module.exports = SearchRouter;