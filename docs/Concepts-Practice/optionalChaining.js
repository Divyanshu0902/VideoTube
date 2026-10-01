const user = null

// console.log(user.name) // TypeError: Cannot read properties of null (reading 'name')

console.log(user?.name) // undefined


/*
Very common real-world use
Suppose you're getting data from an API:
const response = {
    user: {
        profile: {
            name: "Divyanshu"
        }
    }
};

You could write:
const name = response.user.profile.name;

But if you're not sure whether every level exists:
const name = response?.user?.profile?.name;

This prevents crashes when API data is incomplete.



1. Optional chaining — ?.
It lets you safely access a property when an object might be null or undefined.
Without optional chaining:
const user = null;

console.log(user.name);
// ❌ TypeError: Cannot read properties of null

With ?.:
const user = null;

console.log(user?.name);
// undefined

Instead of throwing an error, JavaScript stops and returns undefined.
Nested properties
const user = {
    profile: {
        name: "Divyanshu"
    }
};

console.log(user?.profile?.name);
// "Divyanshu"

If profile doesn't exist:
const user = {};

console.log(user?.profile?.name);
// undefined

Without ?.profile, you'd get an error when trying to access .name.



?. vs ? :
Don't confuse optional chaining with the ternary operator.
Optional chaining
user?.name

Means roughly:
"Get name if user exists; otherwise give me undefined."

Ternary operator
const result = age >= 18 ? "Adult" : "Minor";

Means:
"If the condition is true, return the first value; otherwise return the second."

The ternary syntax is:
condition ? valueIfTrue : valueIfFalse

One more useful combination: ?. + ??
You'll encounter this a lot in backend/frontend code:
const name = user?.profile?.name ?? "Unknown";

Meaning:
Does user exist?
       ↓
Does profile exist?
       ↓
Does name exist?
       ↓
Yes → use name
No  → use "Unknown"

So remember:
?.   → safely access something
??   → provide a fallback when value is null/undefined
? :  → if/else expression

 */