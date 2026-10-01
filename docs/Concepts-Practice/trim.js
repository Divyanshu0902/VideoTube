/*

1. .trim()
.trim() removes whitespace from the beginning and end of a string.
let name = "   Divyanshu   ";

console.log(name.trim());
// "Divyanshu"

It removes spaces, tabs, and line breaks at the edges.
let str = "   hello world   ";

console.log(str.trim());
// "hello world"

Important: it doesn't modify the original string
Strings are immutable in JS.
let str = "   hello   ";

str.trim();

console.log(str);
// "   hello   "

You need to assign the result:
str = str.trim();

console.log(str);
// "hello"

Common use
Very common when handling form input:
const username = input.value.trim();

if (username === "") {
    console.log("Username is required");
}

Without .trim(), someone entering only "     " would technically pass a simple empty-string check.

*/

const originalString = "    Hello World!    "

console.log("Original String: ", originalString);
const trimmedString = originalString.trim()
console.log("Trimmed String: ", trimmedString)
