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

	if (configuration.of_now === false) {
		if (!configuration.else) throw new Error("[ERROR : TIME_CONVERTER] The 'else' parameter in the getTime() function configuration must be equal to a valid Date number");

		return moment(configuration.else).format(format);
	} else return moment(Date.now()).format(format);
};

const defineStateColor = (state: LoggerStatusType): string => {
	let coloredState: string = "";
    
    switch (state) {
		case LoggerStatus.INFO:
			coloredState = dim(greenBright(state));
            break;

        case LoggerStatus.DEBUG:
			coloredState = green(state);
            break;

        case LoggerStatus.WARN:
			coloredState = dim(yellowBright(state));
            break;

        case LoggerStatus.ERROR:
			coloredState = redBright(state);
            break;

        case LoggerStatus.FATAL:
			coloredState = red(state);
            break;
	}

    return coloredState;
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

    debug: (...message: any[]) => {
        process.stdout.write(`${loggerPrefix(LoggerStatus.DEBUG)} ${stripIndents(message.join(" "))}`);
    },

    warn: (...message: any[]) => {
        process.stdout.write(`${loggerPrefix(LoggerStatus.WARN)} ${stripIndents(message.join(" "))}`);
    },

    error: (...message: any[]) => {
        process.stdout.write(`${loggerPrefix(LoggerStatus.ERROR)} ${stripIndents(message.join(" "))}`);
    },

    fatal: (...message: any[]) => {
        process.stdout.write(`${loggerPrefix(LoggerStatus.FATAL)} ${stripIndents(message.join(" "))}`);
        
        process.exit(1);
    }
};
