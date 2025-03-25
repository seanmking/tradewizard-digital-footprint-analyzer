/**
 * Logger utility for consistent logging throughout the application
 */

import winston from 'winston';

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ level, message, timestamp }: {
    level: string;
    message: string;
    timestamp: string;
  }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
  })
);

// Create logger instance
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports: [
    // Console logger
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      )
    }),
    // File logger for errors
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    // File logger for all logs
    new winston.transports.File({
      filename: 'logs/combined.log',
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: 'logs/exceptions.log',
    }),
  ],
});

// Add stream interface for Morgan
export const stream = {
  write: (message: string): void => {
    logger.info(message.trim());
  },
}; 