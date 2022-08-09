import express, { Express } from "express";
import bodyParser from "body-parser";
import routes from "./src/routes";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API for a worldbuilding wiki",
    version: "0.0.1",
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
    contact: {
      name: "Patric Plattner",
      url: "https://github.com/Y4shin/wiki-app/",
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/**/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

const port = process.env.PORT || 3001;

const app: Express = express();

app.use(bodyParser.json());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/", routes);

app.listen(port, () => console.log(`Listening on port ${port}`));
