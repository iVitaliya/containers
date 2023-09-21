import { stripIndents } from "common-tags";
import chalk from "chalk";
import moment from "moment";
import { LoggerStatusType, LoggerTimeConfig, LoggerStatus } from "../typedefs/Logger";

const {
    green, greenBright, yellowBright, 
    red, white, redBright, whiteBright, 
    gray, dim, blackBright
} = chalk;

export const getTime = (configuration: LoggerTimeConfig): string => {
	// Format: <Month In Name> the <Day>th in <Year> @ <Time> <AM/PM>
	const format = "MMMM [the] Do [in] YYYY [@] h:mm:ss A";

	if (configuration.of_now === true) return moment(Date.now()).format(format);
	else if (configuration.of_now === false) {
		if (!configuration.else) throw new Error("[ERROR : TIME_CONVERTER] The 'else' parameter in the getTime() function configuration must be equal to a valid Date number");

		return moment(configuration.else).format(format);
	}
};

const defineStateColor = (state: LoggerStatusType): string => {
	switch (state) {
		case LoggerStatus.INFO:
			return dim(greenBright(state));

        case LoggerStatus.DEBUG:
			return green(state);

        case LoggerStatus.WARN:
			return dim(yellowBright(state));

        case LoggerStatus.ERROR:
			return redBright(state);

        case LoggerStatus.FATAL:
			return red(state);
	}
};

const loggerPrefix = (state: LoggerStatusType): string => {
    const str = [
        `${blackBright("[")}${whiteBright(getTime({ of_now: true }))}${blackBright("]")}`,
        `${gray("|")}${green("Containers")}${gray("|")}`,
        `${gray("(")}${defineStateColor(state)}${gray(")")}`,
        white(">")
    ].join(" ");
    
    return str;
};

export const Logger = {
    log: (state: LoggerStatus, ...message: any[]) => {
        process.stdout.write(`${loggerPrefix(state)} ${stripIndents(message.join(" "))}`);      
    },
    
    info: (...message: any[]) => {
        process.stdout.write(`${loggerPrefix(LoggerStatus.INFO)} ${stripIndents(message.join(" "))}`);
    },

    debug: () => {
        process.stdout.write(`${loggerPrefix(state)} ${stripIndents(message.join(" "))}`);
    },

    warn: () => {
        process.stdout.write(`${loggerPrefix(state)} ${stripIndents(message.join(" "))}`);
    },

    error: () => {
        process.stdout.write(`${loggerPrefix(state)} ${stripIndents(message.join(" "))}`);
    },

    fatal: () => {
        process.stdout.write(`${loggerPrefix(state)} ${stripIndents(message.join(" "))}`);
    }
};
