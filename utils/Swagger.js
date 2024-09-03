const swaggerJSDoc = require('swagger-jsdoc');

let instance;

class Swagger {

    #swaggerDefinition;
    #options

    constructor() {
        if (instance) return instance;

        this.#swaggerDefinition = {
            info: {
              title: 'Time Table Scheduler API',
              version: '1.0.0',
              description: 'Time Table Scheduler API',
            },
            basePath: '/',
        };

        this.#options = {
            swaggerDefinition: this.#swaggerDefinition,
            apis: ['./server/routes/*.js'],
        };
    
        instance = this;
    }
    

    getSwaggerSpec = () => swaggerJSDoc(this.#options);
}

module.exports = Swagger;
