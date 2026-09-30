# YouTube Backend Control Flow (Optimized Balanced Layout)

> **Tip:** Open Markdown Preview (`Ctrl + Shift + V`) to view this diagram. The layout is balanced horizontally and vertically to prevent top/bottom clipping when zooming in VS Code.

```mermaid
flowchart TD
    subgraph S1 ["1. Server Bootstrapping & App Pipeline"]
        direction TB
        A["package.json (npm run dev)"] --> B["src/index.js (dotenv & DB)"]
        B --> C["connectDB() (src/db/index.js)"]
        C -->|"Connect"| DB[("MongoDB (videotube)")]
        C -->|"On Success"| D["app.listen(PORT)"]
        D --> E["src/app.js (Express App)"]
        E --> F1["cors()"]
        F1 --> F2["express.json() & express.urlencoded()"]
        F2 --> F3["express.static('public') & cookieParser()"]
    end

    subgraph S2 ["2. Routing & File Processing"]
        direction TB
        F3 --> G["app.use('/api/v1/users', userRouter)"]
        G --> H["POST /register (src/routes/user.routes.js)"]
        H --> I["Multer Middleware (multer.middleware.js)"]
        I -->|"Save to ./public/temp"| J["registerUser Controller (user.controller.js)"]
        J --> K["asyncHandler Wrapper (asyncHandler.js)"]
        J --> L["uploadOnCloudinary (cloudinary.js)"]
        L -->|"Upload & Delete temp"| CLOUD[("Cloudinary CDN")]
    end

    subgraph S3 ["3. Model, Persistence & Response"]
        direction TB
        J --> M["User Model (src/models/user.model.js)"]
        M -->|"pre('save') hook"| N["bcrypt.hash() (Password Hash)"]
        M -->|"generate Tokens"| O["jsonwebtoken (JWT Access/Refresh)"]
        M -->|"Save Document"| DB
        J --> P["ApiResponse (200/201 JSON)"]
        K -->|"On Failure"| Q["ApiError (Error JSON)"]
        P --> R["Client Response"]
        Q --> R
    end

    S1 --> S2 --> S3
```
