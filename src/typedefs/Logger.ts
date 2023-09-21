export type LoggerStatusType = 
	| "INFO"
	| "DEBUG"
	| "WARN"
	| "ERROR"
	| "FATAL";

export interface LoggerTimeConfig {
	of_now: boolean;
	else?: number;
}

export enum LoggerStatus {
	INFO = "INFO",
	DEBUG = "DEBUG",
	WARN = "WARN",
	ERROR = "ERROR",
	FATAL = "FATAL"
}
