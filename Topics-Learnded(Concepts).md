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


# Video 10:
1. When we are using Cloudinary service to upload file on it via the multer package,
in production practice, the file is temporarily stored on local servers before uploading it to cloudinary,
so that in case there is a cloudinary upload failure, the reattempt can be easily done using the file 
that is already present on the local server. <br>
2. when we delete a file using the "fs" module of node.js, it's an Operating System concept that
that so called deleted file is not actually deleted, rather just its path is "unlinked" and therefore,
node.js "fs" module also provides this functionality under the name of "unlink".<br>
3. when we are storing the file temporarily on server, before uploading it on cloudinary(inside multer.middleware.js), the file can be renamed with random character suffixed against its original name to avoid confusion among multiple files with same name.

# Video 11: 
## HTTP
1. screenshots dekho


# Video 12: 
