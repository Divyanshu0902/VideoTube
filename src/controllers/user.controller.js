import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler( async (req,res) => {

    // ***IMPLEMENTATION STEPS***:----

    // 1. get userDetails from the frontend
    // 2. validations and checks -1.NotEmpty 2.RightFormat 
    // 3. Check : Not Already Existing
    // 4. Check for - images, avatar
    // 5. Upload them to cloudinary and check if avatar uploaded

    // 6. Create userObject - create entry in DB
    // 7. Check for user creation
    // 8. Remove password and refreshToken fields from response
    // 9. return res

    //---------------------------------------------------------------------------------------------------------



    // ## STEP 1 & 2:  get userDetails from the frontend and validate for empty fields :

    const {fullName, email, username, password} = req.body
    if(
        [fullName, email, username, password].some( field => field?.trim() === "")
        // **complete explanation of above line at the end of the file
    ){
        throw new ApiError(400, "All fields are required!") 
    }



    // ## STEP 3: Checking if the username used for the new registratin already exists in DB :

    const existingUser = User.findOne(
        // the code inside the { } of findOne() is DB-Query for MongoDB
        {
            $or: [{ username }, { email }]
        }
    )

    if(existingUser){
        throw new ApiError.status(409, "User with this email or Usernae aleady exists.")
    }



    // ## STEP 4: Checking whether the necessary file has been uploaded by user/client : 

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImagaeLocalPath = req.files?.coverImage[0]?.path;
    // the files field is added in the request object by the multer middleware 
    // ..running before this controller as defined in the userRouter
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }



    // ## STEP 5: Uploading the locally recieved file on Cloudinary servers: 

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImagaeLocalPath)

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }



    // ## STEP 6: Creating User object and making entry in DB : 
    
    const user = await User.create(
        {
            fullName,
            avatar: avatar.url,                 
            // avatar availability is already checked so no edge case

            coverImage: coverImage?.url || "",  
            /* coverImage may not be available(coz it's not mandatory hence also not checked)
               so this edge case need to be handled by using "Optional Chaining" (Defensive Programming)
               otherwise the code might break and server might stop working.*/
            
            email,
            password,
            username: username.toLowerCase()
        }
    )



    // ## STEP 7: Checking user creation in DB (by trying to retrieve it, using the _id created by DB) 
    // ## STEP 8: Removing password from the retrieved object before sending it in the response :---

    const createdUser = User.findById(user._id).select("-password -refreshToken")
    // for every element created in MongoDB, the MongoDB created an _id for it.
    // we're checking whether user is created or not by checking this _id
    // in .select() , all fields are selected by default.
    // the fields written with - sign before them insie the string are removed when specified like that.
    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    

    // ## STEP 9: Sending properly structured response

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User created succesfully")
    )

} )

export { registerUser }

