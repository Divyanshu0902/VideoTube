# Understanding the Validation Code

``` js
if (
    [fullName, email, username, password]
        .some(field => field?.trim() === "")
) {
    throw new ApiError(400, "All fields are required!");
}
```

This code checks whether **at least one of the required fields is empty
or contains only whitespace**.

`[fullName, email, username, password]` creates an array containing all
four fields.

For example:

``` js
[
    "Divyanshu Kumar",
    "divyanshu@gmail.com",
    "divyanshu",
    ""
]
```

Then `.some()` is called on this array:

``` js
.some(field => field?.trim() === "")
```

`.some()` checks whether **at least one element of the array satisfies
the given condition**.

The `field` parameter represents each array element one at a time:

``` text
field = "Divyanshu Kumar"
field = "divyanshu@gmail.com"
field = "divyanshu"
field = ""
```

The condition being tested for each field is:

``` js
field?.trim() === ""
```

`trim()` removes whitespace from the beginning and end of a string.

For example:

``` js
"   hello   ".trim()
// "hello"
```

And:

``` js
"     ".trim()
// ""
```

The `?.` is **optional chaining**. It means that if `field` is `null` or
`undefined`, JavaScript will not throw an error when trying to call
`trim()`.

``` js
undefined?.trim()
// undefined
```

Instead of:

``` js
undefined.trim()
// TypeError
```

Now consider:

``` js
field?.trim() === ""
```

It asks:

> "After removing whitespace from this field, is the result an empty
> string?"

For example:

``` js
"hello".trim() === ""
// false
```

``` js
"   hello   ".trim() === ""
// false
```

``` js
"".trim() === ""
// true
```

``` js
"     ".trim() === ""
// true
```

So, if the fields are:

``` js
[
    "Divyanshu",
    "test@gmail.com",
    "divyanshu",
    ""
]
```

`.some()` effectively performs:

``` text
"Divyanshu"      → false
"test@gmail.com" → false
"divyanshu"      → false
""               → true
```

Since `.some()` found at least one `true` result, it returns:

``` js
true
```

Therefore:

``` js
if (true) {
    throw new ApiError(400, "All fields are required!");
}
```

The error is thrown.

If all fields contain valid text:

``` js
[
    "Divyanshu",
    "test@gmail.com",
    "divyanshu",
    "abc123"
]
```

then every condition is `false`:

``` text
false
false
false
false
```

Therefore `.some()` returns:

``` js
false
```

and the `if` block does not execute.

So the entire code:

``` js
if (
    [fullName, email, username, password]
        .some(field => field?.trim() === "")
) {
    throw new ApiError(400, "All fields are required!");
}
```

can be understood in plain English as:

> **"Put all four fields into an array. Check whether at least one
> field, after removing its surrounding whitespace, is an empty string.
> If at least one is empty, throw a 400 error."**

## Important Subtlety

There is a small weakness in this exact version.

If:

``` js
email = undefined;
```

then:

``` js
email?.trim()
// undefined
```

and:

``` js
undefined === ""
// false
```

So `undefined` would **not** be caught by this particular condition.

For required string fields, this is generally more robust:

``` js
if (
    [fullName, email, username, password]
        .some(field => !field?.trim())
) {
    throw new ApiError(400, "All fields are required!");
}
```

Here:

``` text
undefined  → field?.trim() → undefined → !undefined → true
null       → field?.trim() → undefined → !undefined → true
""         → field?.trim() → ""        → !""        → true
"   "      → field?.trim() → ""        → !""        → true
"hello"    → field?.trim() → "hello"   → !"hello"   → false
```

Therefore:

``` js
.some(field => !field?.trim())
```

means:

> **"Does at least one field not contain any meaningful text?"**
