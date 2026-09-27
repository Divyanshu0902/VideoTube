# Video 8: 

1. `app.get(someFunction()) ` is used to assign any configuration/middleware to the app. <br>
2. request data can come in several ways - in url, in body, in json, form inside body etc. <br>
    so , we need to do settings in our app 
3. **Higher Order Function** : a JS funciton that can do either of the two : 1.take another function as its input or 
return another function as its output. It has been used in project for creating the *asyncHandler.js* utility fn. <br>

# Video 9: 
1. When we are using mongoose-aggregate-paginate-v2   "pre" hook for encrypting password using bcrypt package, we have to give a callback fn as a parameter. Now don't write that callback using arrow fn <() => {}> , because this particular callback needs the reference to "this" which is not available to arrow fn style callbacks but it IS available to normal function callbacks. <br>

2. also since encryption is a lengthy process, always make sure to also write async before that callback.<br> 
3. and also don't forget to put "next" as the parameter of this callback since this is essentially a mongoDB middleware.<br>
