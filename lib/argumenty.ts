
import { Argument, ArgumentType, ParsedArguments, Transformer } from "./types";

import { ArgumentParser } from "./parser";

export class Argumenty {

	private arguments: Argument[];
	private parser: ArgumentParser;

	private parsed: ParsedArguments;

	constructor(...args: Argument[]) {
		this.arguments = args;

		this.parser = new ArgumentParser();
	}

	public add(arg: Argument): Argumenty {
		this.arguments.push(arg);
		return this;
	}

	public addArg(short: string, long: string, type: ArgumentType, required?: boolean, transformer?: Transformer): Argumenty {
		this.arguments.push({ short, long, type, required, transformer });
		return this;
	}

	public parse() {
		this.parsed = this.parser.parse(this.arguments);
	}

	public get(key: string) {
		const arg = this.parsed[key];
		return !!arg ? arg.value : null;
	}
}
