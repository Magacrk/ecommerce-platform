"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
// Define log levels
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};
// Define log level based on environment
const level = () => {
    const env = process.env.NODE_ENV || 'development';
    const isDevelopment = env === 'development';
    return isDevelopment ? 'debug' : 'info';
};
// Define colors for each log level
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue',
};
// Add colors to winston
winston_1.default.addColors(colors);
// Define the format for logs
const format = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }), winston_1.default.format.colorize({ all: true }), winston_1.default.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`));
// Define transports
const transports = [
    // Console transport
    new winston_1.default.transports.Console(),
    // File transport for errors
    new winston_1.default.transports.File({
        filename: 'logs/error.log',
        level: 'error',
    }),
    // File transport for all logs
    new winston_1.default.transports.File({ filename: 'logs/all.log' }),
];
// Create the logger
const logger = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL || level(),
    levels,
    format,
    transports,
});
exports.default = logger;
//# sourceMappingURL=logger.js.map