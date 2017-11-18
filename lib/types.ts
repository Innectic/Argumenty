
export type ArgumentType = "string" | "number" | "boolean" | "remaining" | "flag"; // XXX: Maybe replace remaining with all?

export type Transformer = (arg: ParsedArgument) => TransformerResponse;

export interface TransformerResponse {
	valid: boolean;
	value: any;
}

/**
 * A parsed argument from the command line.
 */
export interface ParsedArgument {
	name: string;
	value: any;
	transformer?: Transformer;
}

/**
 * An argument the user is expecting
 */
export interface Argument {
	short: string;
	long: string;
	type: ArgumentType;
	required?: boolean; 
	transformer?: Transformer;
}

export interface ParsedArguments {
	[name: string]: ParsedArgument
}
