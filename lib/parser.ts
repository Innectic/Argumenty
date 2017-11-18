
import { ParsedArgument, ArgumentType, Argument, ParsedArguments } from "./types";
import { TransformerHandler } from "./transformer";

/**
 * Parse command line arguments
 */
export class ArgumentParser {

	private transformer: TransformerHandler;

	constructor() {
		this.transformer = new TransformerHandler();
	}

	public parse(args: Argument[]): ParsedArguments {
		let parsed: ParsedArguments = {};

		// We loop by index here, so we can peek forward
		const length = process.argv.length;

		for (let i = 1; i < length; i++) {
			let argument = process.argv[i];
			if (!argument.startsWith("-")) {
				continue; // TODO: Should we show some sort of an error here?
			}

			const long = argument.substr(0, 2) === "--";
			argument = argument.substr(long ? 2 : 1);

			// @Speed: holy cow this is slow
			const filtered = args.filter(arg => (arg.long === argument && long) || (arg.short === argument && !long));
			if (filtered.length === 0 || filtered.length > 1) {
				// Invalid argument
				console.error(`Argument '${argument}' is invalid!`); // TODO: Show help here
				continue;
			}
			// Since we have this argument, lets use it.
			const filterArgument = filtered[0];
			const displayName = long ? filterArgument.long : filterArgument.short;

			// Check the types of the argument, see if we need to pull something else
			switch (filterArgument.type) {
				case "flag": {
					// Flags just need to exist, no value needed!
					// Example: -v / --verbose
					parsed[filterArgument.long] = {
						name: filterArgument.long,
						value: true, // We just say it's true, since it's there
						transformer: filterArgument.transformer
					};
					continue;
				}
				case "boolean": {
					// If we want a boolean, it MUST be true or false.
					// So, lets verify we have another arg, and it's what we want

					// Make sure there's something next
					if (!process.argv[i + 1]) {
						console.error(`Argument '${displayName}' must have a following boolean (true / false) value!`);
						continue;
					}

					// Check the value
					const next = process.argv[i + 1];
					if (next !== "true" && next !== "false") {
						console.error(`Value for argument '${displayName}' must be true or false!`);
						continue;
					}
					parsed[filterArgument.long] = {
						name: filterArgument.long,
						value: next === "true" ? true : false,
						transformer: filterArgument.transformer
					};
					// Make sure to account for the arg we just took!
					i++;
					continue;
				}
				case "number": {
					// If we want a number, just need to make sure the next arg
					// is a number.
					if (!process.argv[i + 1]) {
						console.error(`Argument '${displayName}' must have a following number!`);
						continue;
					}
					const next = process.argv[i + 1];
					if (!+next) {
						console.error(`Argument ${displayName} requires a following number!`);
						continue;
					}
					parsed[filterArgument.long] = {
						name: filterArgument.long,
						value: +next,
						transformer: filterArgument.transformer
					};
					// Make sure to account for the arg we just took!
					i++;
					continue;
				}
				case "remaining": {

				}
				case "string": {
					// Make sure we have something to use
					if (!process.argv[i + 1]) {
						console.error(`Argument '${displayName}' requires a string value!`);
						continue;
					}
					const next = process.argv[i + 1];
					// If we start with ", then we need to pull until we find the next one
					if (next.startsWith("\"")) {
						let value = "";
						for (let j = i; j < length; j++) {
							const current = process.argv[j];
							if (current.endsWith("\"")) {
								// Then this is the end
								i += j;

								parsed[filterArgument.long] = {
									name: filterArgument.long,
									value: value.trim(),
									transformer: filterArgument.transformer
								}
								break;
							}
							// Not the end, append
							value += current + " ";
							continue;
						}
					} else {
						// Otherwise, lets just take the next one
						parsed[filterArgument.long] = {
							name: filterArgument.long,
							value: next,
							transformer: filterArgument.transformer
						}
						// Account for the arg we just took
						i++;
						continue;
					}
				}
			}
		}
		// Transform all arguments
		for (let key in parsed) {
			parsed[key] = this.transformer.transformArgument(parsed[key]);
		}
		return parsed;
	}
}
