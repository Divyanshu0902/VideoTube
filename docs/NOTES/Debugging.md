## 1. Bug in user.model.js

[video-time](https://youtu.be/_u-WgSN5ymU?list=PLu71SKxNbfoBGh_8p_NS-ZAh6v7HhYqHW&t=674)

### buggy-code :
```js
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})
```
### bug-detail : 
```bash 
TypeError: next is not a function
    at model.<anonymous> (file:///D:/Downloads/New%20folder/VideoTube/src/models/user.model.js:58:5)
```

### description : 
The Problem

You are using a newer version of Mongoose (v8 / v9).

In modern Mongoose, when you declare a middleware hook with an async function, Mongoose automatically handles completion through the returned Promise and does not pass a next callback function.

Because next is undefined, calling next() throws: TypeError: next is not a function.

The Solution

When using async / await, simply remove next from both the function arguments and function body. Mongoose will automatically proceed once the async function resolves:

```javascript
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});
```
What changed?
* Removed next from async function()
* Replaced return next(); with return;
* Removed next(); at the end

## 2. Bug in user.controller.js

### Buggy code

```javascript
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
```

### Bug-details :

```bash
TypeError: Converting circular structure to JSON
    --> starting at object with constructor 'MongoClient'
    |     property 's' -> object with constructor 'Object'
    |     property 'sessionPool' -> object with constructor 'ServerSessionPool'
    --- property 'client' closes the circle
    at JSON.stringify (<anonymous>)
    at stringify (D:\Downloads\New folder\VideoTube\node_modules\express\lib\response.js:1034:12)
    at ServerResponse.json (D:\Downloads\New folder\VideoTube\node_modules\express\lib\response.js:245:14)
    at file:///D:/Downloads/New%20folder/VideoTube/src/controllers/user.controller.js:113:28
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
```

### Diagnosis :

The await keyword is missing before User.findById(...).

Without await:

createdUser is not the user document; it is an unresolved Mongoose Query object.
A Mongoose Query object internally contains references to the entire database client (MongoClient), which is full of circular references.
When Express calls res.status(201).json(...), it attempts to run JSON.stringify() on that Query object, triggering: TypeError: Converting circular structure to JSON ... starting at object with constructor 'MongoClient'

### Solution

Add await before User.findById(...):

```javascript
const createdUser = await User.findById(user._id).select("-password -refreshToken");
```