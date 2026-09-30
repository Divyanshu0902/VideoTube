# YouTube Backend Architecture & End-to-End Control Flow Guide

This document provides a comprehensive technical overview and step-by-step breakdown of the execution flow in this backend application, tracing execution from the initial bootstrap command to final HTTP response generation.

---

## 1. High-Level Architecture Flowchart

```mermaid
flowchart TD
    subgraph Bootstrapping ["1. Application Bootstrapping"]
        A["package.json ('npm run dev')"] --> B["src/index.js"]
        B --> C["dotenv.config()"]
        B --> D["connectDB() (src/db/index.js)"]
        D -->|Connect to MongoDB| DB[("MongoDB ('videotube')")]
        D -->|On Success| E["app.listen(PORT)"]
    end

    subgraph AppPipeline ["2. App & Middleware Pipeline"]
        E --> F["src/app.js (Express App)"]
        F --> G1["CORS Middleware"]
        G1 --> G2["express.json() & urlencoded()"]
        G2 --> G3["express.static('public')"]
        G3 --> G4["cookieParser()"]
    end

    subgraph Routing ["3. Route Dispatching"]
        G4 --> H["app.use('/api/v1/users', userRouter)"]
        H --> I["src/routes/user.routes.js"]
        I -->|POST /register| J["Multer Middleware (src/middlewares/multer.middleware.js)"]
    end

    subgraph ControllerLogic ["4. Controller & Business Logic"]
        J -->|File saved to ./public/temp| K["registerUser (src/controllers/user.controller.js)"]
        K --> L["asyncHandler Wrapper (src/utils/asyncHandler.js)"]
        K --> M["uploadOnCloudinary (src/utils/cloudinary.js)"]
        M -->|Upload & Remove temp file| CLOUD[("Cloudinary CDN")]
        K --> N["User Model (src/models/user.model.js)"]
    end

    subgraph DatabaseLayer ["5. Model & Database Layer"]
        N -->|pre('save') hook| O["bcrypt.hash()"]
        N -->|generateAccessToken / RefreshToken| P["jsonwebtoken (JWT)"]
        N -->|Save document| DB
    end

    subgraph ResponseFlow ["6. Response Delivery"]
        K --> Q["ApiResponse (src/utils/ApiResponse.js)"]
        L -->|On Error| R["ApiError (src/utils/ApiError.js)"]
        Q --> S["Client (HTTP 200/201 JSON)"]
        R --> S
    end
```

---

## 2. Phase-by-Phase Control Flow Breakdown

### Phase 1: Bootstrapping & Startup

1. **Nodemon Entry**:
   Running `npm run dev` executes:
   ```bash
   nodemon -r dotenv/config --experimental-json-modules src/index.js
   ```
   This automatically preloads environment variables from the `.env` file before executing any JavaScript modules.

2. **[src/index.js](file:///d:/Downloads/New%20folder/YT-backend/src/index.js)**:
   - Imports [`connectDB`](file:///d:/Downloads/New%20folder/YT-backend/src/db/index.js) and configured Express [`app`](file:///d:/Downloads/New%20folder/YT-backend/src/app.js).
   - Initializes environment variables via `dotenv.config({ path: "./env" })`.
   - Executes `connectDB()` asynchronously.

3. **[src/db/index.js](file:///d:/Downloads/New%20folder/YT-backend/src/db/index.js)**:
   - Connects to MongoDB via `mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)` using the database name constant [`DB_NAME = "videotube"`](file:///d:/Downloads/New%20folder/YT-backend/src/constants.js).
   - Logs host details upon connection.

4. **Port Binding**:
   - Once MongoDB resolves successfully, the Promise `.then()` callback registers an error event handler `app.on("error")` and starts listening on the configured port (`process.env.PORT` or `8000`).

---

### Phase 2: Express App Configuration & Middlewares

In **[src/app.js](file:///d:/Downloads/New%20folder/YT-backend/src/app.js)**, Express is instantiated and configured with top-level middlewares:

| Middleware | Purpose |
| :--- | :--- |
| `cors(...)` | Handles Cross-Origin Resource Sharing based on `process.env.CORS_ORIGIN`. |
| `express.json({ limit: "16kb" })` | Parses incoming JSON request payloads into `req.body`. |
| `express.urlencoded({ extended: true, limit: "16kb" })` | Parses URL-encoded form submissions into `req.body`. |
| `express.static("public")` | Serves public static files (e.g. assets, temporary files). |
| `cookieParser()` | Parses cookie headers from client requests into `req.cookies`. |

---

### Phase 3: Route Dispatching

- **Mounting Routes**:
  In [src/app.js](file:///d:/Downloads/New%20folder/YT-backend/src/app.js#L20), all user-related endpoints are registered under `/api/v1/users`:
  ```javascript
  app.use("/api/v1/users", userRouter);
  ```
- **Router Mapping**:
  In **[src/routes/user.routes.js](file:///d:/Downloads/New%20folder/YT-backend/src/routes/user.routes.js)**, specific paths and HTTP verbs map to controller methods:
  ```javascript
  router.route("/register").post(registerUser);
  ```

---

### Phase 4: Middleware & File Upload Flow

1. **Multer Storage ([src/middlewares/multer.middleware.js](file:///d:/Downloads/New%20folder/YT-backend/src/middlewares/multer.middleware.js))**:
   - Intercepts multipart form uploads (such as avatars, cover photos, or video files).
   - Stores raw files temporarily in `./public/temp` with disk storage naming.
2. **Cloudinary Upload Utility ([src/utils/cloudinary.js](file:///d:/Downloads/New%20folder/YT-backend/src/utils/cloudinary.js))**:
   - `uploadOnCloudinary(localFilePath)` pushes the saved local file to Cloudinary CDN.
   - Once uploaded, it retrieves the public asset URL.
   - Cleans up and deletes the local temporary file from `./public/temp` via `fs.unlinkSync(localFilePath)` (even if upload fails).

---

### Phase 5: Controllers & Async Utility Wrappers

1. **Async Controller Wrapper ([src/utils/asyncHandler.js](file:///d:/Downloads/New%20folder/YT-backend/src/utils/asyncHandler.js))**:
   - Higher-Order Function that wraps asynchronous route handlers:
     ```javascript
     const asyncHandler = (requestHandler) => {
         return (req, res, next) => {
             Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
         };
     };
     ```
   - Eliminates repetitive `try-catch` blocks by automatically passing rejected promises to Express's global error handler.
2. **Controller Logic ([src/controllers/user.controller.js](file:///d:/Downloads/New%20folder/YT-backend/src/controllers/user.controller.js))**:
   - Extracts data from `req.body` and `req.files`.
   - Performs validations and queries database models.
   - Dispatches Cloudinary uploads and handles database mutations.

---

### Phase 6: Model & Persistence Layer

1. **User Model ([src/models/user.model.js](file:///d:/Downloads/New%20folder/YT-backend/src/models/user.model.js))**:
   - **Fields**: `username`, `email`, `fullName`, `avatar`, `coverImage`, `watchHistory`, `password`, `refreshToken`.
   - **`pre("save")` Middleware Hook**: Hashes passwords using `bcrypt.hash(password, 10)` prior to saving to MongoDB.
   - **Schema Methods**:
     - `isPasswordCorrect(password)`: Compares candidate passwords using `bcrypt.compare`.
     - `generateAccessToken()`: Generates short-lived JWTs containing user id, email, username, fullName.
     - `generateRefreshToken()`: Generates long-lived JWTs containing user id.
2. **Video Model ([src/models/video.model.js](file:///d:/Downloads/New%20folder/YT-backend/src/models/video.model.js))**:
   - **Fields**: `videoFile`, `thumbnail`, `title`, `description`, `duration`, `views`, `isPublished`, `owner`.
   - **Plugins**: `mongooseAggregatePaginate` for advanced paginated aggregation queries.

---

### Phase 7: Standardized Responses & Error Handling

- **Success Response ([src/utils/ApiResponse.js](file:///d:/Downloads/New%20folder/YT-backend/src/utils/ApiResponse.js))**:
  Standardized JSON format returned on successful requests:
  ```json
  {
    "statusCode": 200,
    "data": { ... },
    "message": "Success",
    "success": true
  }
  ```
- **Error Response ([src/utils/ApiError.js](file:///d:/Downloads/New%20folder/YT-backend/src/utils/ApiError.js))**:
  Custom error subclass capturing HTTP status codes, operational errors, and stack traces.

---

## 3. Step-by-Step Request Lifecycle Example: `POST /api/v1/users/register`

```
1. Client -> POST http://localhost:8000/api/v1/users/register (Multipart Form Data)
   │
2. Express Server -> CORS, json(), urlencoded(), static(), cookieParser()
   │
3. Express Router -> Maps '/api/v1/users' -> '/register'
   │
4. Multer Middleware -> Extracts image files (avatar, coverImage) to './public/temp'
   │
5. Controller (registerUser) -> Invoked via asyncHandler
   │
6. Validation -> Checks required text fields and uploaded files
   │
7. Cloudinary -> uploadOnCloudinary(tempFilePath) -> Cloudinary CDN -> Returns URL -> Removes temp file
   │
8. Database Mutation -> User.create()
   │
9. Mongoose Pre-save Hook -> Hashes password with bcrypt
   │
10. Database Persist -> Saves document to MongoDB database 'videotube'
    │
11. Controller -> Returns ApiResponse (201 Created)
    │
12. Client <- Receives clean JSON response
```
