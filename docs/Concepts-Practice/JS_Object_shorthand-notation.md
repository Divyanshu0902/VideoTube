# JavaScript Object Shorthand Notation — Summary

Object shorthand notation allows you to omit `: variableName` when the object property name and the variable name are the same.

## 1. Shorthand Syntax

Instead of:

```js
const username = "divyanshu";

const user = {
    username: username
};
```

You can write:

```js
const username = "divyanshu";

const user = {
    username
};
```

These are equivalent.

## 2. Mixing Shorthand and Normal Syntax

A JavaScript object can contain both styles:

```js
const username = "divyanshu";
const email = "divyanshu@gmail.com";
const hashedPassword = "abc123";

const user = {
    username,                  // shorthand
    email,                     // shorthand
    password: hashedPassword,  // normal syntax
    role: "user",              // normal syntax
    isVerified: false          // normal syntax
};
```

### Why is the syntax mixed?

Because different properties have different situations.

### Shorthand

Use shorthand when the variable name and property name are identical:

```js
const username = "divyanshu";

const user = {
    username
};
```

Equivalent to:

```js
const user = {
    username: username
};
```

### Normal `key: value` Syntax

Use normal syntax when the property name and variable name are different:

```js
const username = "divyanshu";

const user = {
    displayName: username
};
```

Here:

- Property name → `displayName`
- Value → `username`

Shorthand cannot be used because their names are different.

Normal syntax is also used when assigning literal values:

```js
const user = {
    role: "user",
    isVerified: false
};
```

There is no variable to shorten here.

## Key Takeaway

```js
const username = "divyanshu";
const email = "divyanshu@gmail.com";
const passwordHash = "abc123";

const user = {
    username,                 // variable and property have same name
    email,                    // variable and property have same name
    password: passwordHash,   // different names → normal syntax
    role: "user",             // literal value → normal syntax
    isVerified: false         // literal value → normal syntax
};
```

Think of it this way:

- `username` → property `username` gets variable `username`
- `password: passwordHash` → property `password` gets variable `passwordHash`
- `role: "user"` → property `role` gets the literal value `"user"`

**Mixed syntax is completely normal. It simply reflects whether the property name matches the variable name or not.**
