const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    swagger: '2.0',
    swaggerDefinition: {
        info: {
            title: 'BingoTel API',
            version: '1.0.0',
            description: 'express API with swagger docs',
        },
        produces: [
            "application/json"
        ],
        consumes: [
            "application/json"
        ],
        basepath: '/api'
    },
    // apis: ['./app/controllers/api/**/*.js'],
    apis: ['./docs/**/*.yaml'],
}

const specs = swaggerJsdoc(options);

module.exports = (app) => {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs))
};