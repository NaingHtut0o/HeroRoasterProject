import pino from "pino";

const isDev = process.env.NODE_ENV !== "production";

const targets = [];

// Console Output Formatted & colorized
if(isDev)
{
    targets.push({
        target: "pino-pretty",
        options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
        },
    });
}

// File Output
targets.push({
    target: "pino-roll",
    options: {
        file: "./logs/app",
        frequency: "daily",
        size: "10m",
        mkdir: true,
        dateFormat: "yyyy-MM-dd",
        extension: ".log",
    },
});

export const logger = pino(
    pino.transport({
        targets,
    })
);