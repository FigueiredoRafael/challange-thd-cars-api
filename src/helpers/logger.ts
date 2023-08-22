import { createLogger, format, transports } from "winston";

export const logger = createLogger({
  level: "info",
  format: format.combine(format.timestamp(), format.json()),

  transports: [
    new transports.Console({
      format: format.printf(({ level, message, timestamp }) => {
        return `[${timestamp}] ${level}: ${message}`;
      }),
    }),
    new transports.File({ filename: "error.log", level: "error" }),
    new transports.File({ filename: "combined.log" }),
  ],
});
