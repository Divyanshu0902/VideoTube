## 2. Text / ASCII Architecture & Request Pipeline Diagram

```
[ Client Request: POST /api/v1/users/register ]
                      │
                      ▼
 ┌────────────────────────────────────────────────────────┐
 │ 1. Express Pipeline (src/app.js)                       │
 │    ├── cors()                                          │
 │    ├── express.json({ limit: "16kb" })                 │
 │    ├── express.urlencoded({ limit: "16kb" })           │
 │    ├── express.static("public")                        │
 │    └── cookieParser()                                  │
 └────────────────────┬───────────────────────────────────┘
                      │
                      ▼
 ┌────────────────────────────────────────────────────────┐
 │ 2. Router Layer (src/routes/user.routes.js)            │
 │    └── Matches: POST /register                         │
 └────────────────────┬───────────────────────────────────┘
                      │
                      ▼
 ┌────────────────────────────────────────────────────────┐
 │ 3. Multer Middleware (src/middlewares/multer.middleware.js)
 │    └── Extracts uploaded images -> saves to ./public/temp
 └────────────────────┬───────────────────────────────────┘
                      │
                      ▼
 ┌────────────────────────────────────────────────────────┐
 │ 4. Controller Layer (src/controllers/user.controller.js)
 │    ├── Wrapped in asyncHandler (src/utils/asyncHandler.js)
 │    ├── Calls uploadOnCloudinary() (src/utils/cloudinary.js)
 │    │     ├── Uploads image to Cloudinary CDN           │
 │    │     └── Removes local temp file via fs.unlinkSync │
 │    └── Calls User.create(...)                          │
 └────────────────────┬───────────────────────────────────┘
                      │
                      ▼
 ┌────────────────────────────────────────────────────────┐
 │ 5. Mongoose User Model (src/models/user.model.js)      │
 │    ├── pre("save") hook triggers -> hashes password    │
 │    │   using bcrypt.hash()                             │
 │    └── Persists document into MongoDB database         │
 └────────────────────┬───────────────────────────────────┘
                      │
                      ▼
 ┌────────────────────────────────────────────────────────┐
 │ 6. Response Layer                                      │
 │    ├── Success: ApiResponse (201 Created JSON)         │
 │    └── Failure: ApiError (Error JSON + Stack Trace)    │
 └────────────────────────────────────────────────────────┘
```

---

## 3. Request vs. Response Summary Table

| Stage | File / Module | Responsibility |
| :--- | :--- | :--- |
| **1. Init** | `src/index.js` & `src/db/index.js` | Connects to MongoDB, starts HTTP server. |
| **2. App Middleware** | `src/app.js` | Parses JSON, form body, cookies, CORS, static files. |
| **3. Routing** | `src/routes/user.routes.js` | Matches `/api/v1/users/register`. |
| **4. File Upload** | `src/middlewares/multer.middleware.js` | Saves files temporarily to disk (`./public/temp`). |
| **5. Controller** | `src/controllers/user.controller.js` | Executes validation and business logic. |
| **6. Cloud Storage** | `src/utils/cloudinary.js` | Uploads to Cloudinary, removes local temp file. |
| **7. Data Layer** | `src/models/user.model.js` | Hashes password (`bcrypt`), saves user, generates JWT. |
| **8. Response** | `src/utils/ApiResponse.js` / `ApiError.js` | Formats and sends standard JSON response. |

