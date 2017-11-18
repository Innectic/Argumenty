# Argumenty

Argumenty makes command line argument parsing in Node / Typescript easy.

## How to use Argumenty

### Basic setup

```typescript

import { Argumenty } from "argumenty";

const argumenty = new Argumenty({ short: "s", long: "stuff", type: "string" }); // Arguments can be added through the constructor
// They can also be added after the fact.
argumenty.add({ short: "t", long: "thing", type: "flag" });

// Then just parse
argumenty.parse();
// And now we can get parsed things!
console.log(argumenty.get("stuff"), argumenty.get("thing"));
```

### Transformers

Transformers allow the changing of an argument's value.

If you wanted to get the contents of a file instead of storing a file name, you could do so like this:

```typescript
import { Argumenty, TransformerResponse, ParsedArgument } from "argumenty";

const fs = require("fs");

function getFileContents(arg: ParsedArgument): TransformerResponse {
	// Check if the file exists
	if (!fs.existsSync(arg.value)) {
		return { valid: false, value: null };
	}
	// Since it does, read the contents
	return {
		value: true,
		value: fs.readFileSync(arg.value).toString()
	};
}

const argumenty = new Argumenty();
argumenty.add({ short: "f", long: "file", type: "string", transformer: getFileContents });

argumenty.parse();
// This will have the contents of the file
console.log(argumenty.get("file"));
```