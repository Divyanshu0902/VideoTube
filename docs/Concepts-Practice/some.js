const roles1 = ["user", "editor", "admin"]
const roles2 = ["user", "editor", "maintainer"]

const isAdmin1 = roles1.some(role => role === "admin")
const isAdmin2 = roles2.some(role => role === "admin")

console.log(isAdmin1) // true
console.log(isAdmin2) // false

/*

.some()
.some() is an array method that checks whether at least one element satisfies a condition.
It returns a boolean:
true

or
false

Example
const numbers = [1, 3, 5, 8, 9];

const result = numbers.some(num => num % 2 === 0);

console.log(result);
// true

Why?
1 → even? ❌
3 → even? ❌
5 → even? ❌
8 → even? ✅

As soon as it finds 8, .some() returns true.
Basic syntax
array.some(callback)

For example:
const ages = [15, 17, 21, 16];

const hasAdult = ages.some(age => age >= 18);

console.log(hasAdult);
// true

Think:
"Does at least ONE element satisfy this condition?"

.some() vs .every()
This distinction is important:
.some() → at least one
const nums = [2, 4, 7, 8];

nums.some(n => n % 2 === 0);
// true

Because some numbers are even.
.every() → all
nums.every(n => n % 2 === 0);
// false

Because 7 is not even.
So:
Method	Meaning
.some()	At least one?
.every()	All?
.find()	Which element is the first match?
.filter()	Give me all matching elements


A realistic backend example
Suppose you're checking whether a user already has an admin role:
const roles = ["user", "editor", "admin"];

const isAdmin = roles.some(role => role === "admin");

console.log(isAdmin);
// true

Or checking permissions:
const permissions = ["read", "write"];

const canDelete = permissions.some(permission => permission === "delete");

console.log(canDelete);
// false

 */