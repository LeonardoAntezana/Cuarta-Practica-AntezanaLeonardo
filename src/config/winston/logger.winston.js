import { environment } from "../config.command.js";
import { createLogger, transports, format } from "winston";

let logger;

const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    debug: 4,
  },
  colors: {
    fatal: "red",
    error: "cyan",
    warning: "yellow",
    info: "blue",
    debug: "white",
  }
}

switch (environment) {
  case "production":
    logger = createLogger({
      levels: customLevels.levels,
      transports: [
        new transports.Console({ 
          level: "info",
          format: format.combine(format.colorize({ colors: customLevels.colors }), format.simple())
        }),
        new transports.File({ filename: "./errors.log", level: "error", format: format.simple() }),
      ],
    })
    break;
  case "development":
  default:
    logger = createLogger({
      levels: customLevels.levels,
      transports: [
        new transports.Console({ 
          level: "debug",
          format: format.combine(format.colorize({ colors: customLevels.colors }), format.simple())
        }),
      ],
    })
    break;
}
export const addLogger = (req, res, next) => {
  req.logger = logger;
  next();
}