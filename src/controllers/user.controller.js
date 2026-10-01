import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"

const registerUser = asyncHandler( async (req,res) => {
    // get userDetails from the frontend
    // validations and checks -1.NotEmpty 2.RightFormat 
    // Check : Not Already Existing
    // Check for - images, avatar
    // Upload them to cloudinary and check if avatar uploaded

    // create userObject - create entry in DB
    // remov password and refreshToken fields from response
    // check for user creation
    // return res

    const {fullName, email, username, password} = req.body
    if(
        [fullName, email, username, password].some( field => field?.trim() === "")
        // **complete explanation of above line at the end of the file
    ){
        throw new ApiError(400, "All fields are required!") 
    }
    
} )

export { registerUser }


/*



*/