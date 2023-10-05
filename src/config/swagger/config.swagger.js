import swaggerJSDoc from "swagger-jsdoc"
import __dirname from "../../utils.js"

const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Backend Ecommerce',
      description: 'API de supermercado'
    }
  },
  apis: [`${__dirname}/docs/**/*.yaml`] 
}

const specs = swaggerJSDoc(swaggerOptions);

export default specs;