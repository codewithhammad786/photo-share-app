# PhotoStack - Architecture & Design Diagrams

## 1. System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              PHOTOSTACK ARCHITECTURE                                 │
└─────────────────────────────────────────────────────────────────────────────────────┘

                                    ┌─────────────┐
                                    │   USERS     │
                                    │  (Browser)  │
                                    └──────┬──────┘
                                           │
                                           │ HTTPS
                                           ▼
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                                   AZURE CLOUD                                        │
│  ┌────────────────────────────────────────────────────────────────────────────────┐  │
│  │                         AZURE APP SERVICE                                       │  │
│  │                    (photostack.azurewebsites.net)                              │  │
│  │  ┌─────────────────────────────┐  ┌─────────────────────────────────────────┐  │  │
│  │  │      REACT FRONTEND         │  │         NODE.JS BACKEND                 │  │  │
│  │  │                             │  │                                         │  │  │
│  │  │  • Home Page                │  │  • Express.js REST API                  │  │  │
│  │  │  • Photo Gallery            │  │  • JWT Authentication                   │  │  │
│  │  │  • Upload Page              │  │  • Photo CRUD Operations                │  │  │
│  │  │  • User Profile             │  │  • Comments & Ratings                   │  │  │
│  │  │  • Dashboard                │  │  • User Management                      │  │  │
│  │  │                             │  │                                         │  │  │
│  │  │  (Static files in /public)  │  │  (server.js - Port 8080)               │  │  │
│  │  └─────────────────────────────┘  └──────────────┬──────────────────────────┘  │  │
│  └──────────────────────────────────────────────────┼─────────────────────────────┘  │
│                                                     │                                │
│         ┌───────────────────────────────────────────┼───────────────────────┐        │
│         │                                           │                       │        │
│         ▼                                           ▼                       ▼        │
│  ┌──────────────────┐                 ┌──────────────────┐      ┌──────────────────┐ │
│  │  AZURE BLOB      │                 │ AZURE COGNITIVE  │      │  MONGODB ATLAS   │ │
│  │  STORAGE         │                 │ SERVICES         │      │  (Database)      │ │
│  │                  │                 │                  │      │                  │ │
│  │ • Photo Storage  │                 │ • Computer Vision│      │ • Users          │ │
│  │ • CDN Delivery   │                 │ • Image Analysis │      │ • Photos         │ │
│  │ • Secure URLs    │                 │ • Auto Tagging   │      │ • Comments       │ │
│  │                  │                 │ • Color Detection│      │ • Ratings        │ │
│  │ Container:photos │                 │ • Adult Content  │      │                  │ │
│  └──────────────────┘                 └──────────────────┘      └──────────────────┘ │
│                                                                                      │
│  ┌──────────────────┐                 ┌──────────────────┐                           │
│  │ APPLICATION      │                 │ GITHUB ACTIONS   │                           │
│  │ INSIGHTS         │                 │ (CI/CD)          │                           │
│  │                  │                 │                  │                           │
│  │ • Monitoring     │                 │ • Auto Build     │                           │
│  │ • Analytics      │                 │ • Auto Deploy    │                           │
│  │ • Error Tracking │                 │ • Testing        │                           │
│  └──────────────────┘                 └──────────────────┘                           │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              PHOTO UPLOAD FLOW                                       │
└─────────────────────────────────────────────────────────────────────────────────────┘

  ┌────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌────────┐
  │ User   │────▶│ React       │────▶│ Express     │────▶│ Azure Blob  │────▶│ Storage│
  │ Upload │     │ Frontend    │     │ API         │     │ Service     │     │ Account│
  └────────┘     └─────────────┘     └──────┬──────┘     └─────────────┘     └────────┘
                                           │
                                           │ If AI Enabled
                                           ▼
                                    ┌─────────────┐
                                    │ Cognitive   │
                                    │ Services    │
                                    │             │
                                    │ • Tags      │
                                    │ • Colors    │
                                    │ • Description│
                                    └──────┬──────┘
                                           │
                                           ▼
                                    ┌─────────────┐
                                    │ MongoDB     │
                                    │             │
                                    │ Save Photo  │
                                    │ Metadata    │
                                    └─────────────┘


┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              PHOTO VIEW FLOW                                         │
└─────────────────────────────────────────────────────────────────────────────────────┘

  ┌────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
  │ User   │────▶│ React       │────▶│ Express     │────▶│ MongoDB     │
  │ Request│     │ Frontend    │     │ API         │     │ (Metadata)  │
  └────────┘     └─────────────┘     └─────────────┘     └──────┬──────┘
       ▲                                                        │
       │              ┌─────────────┐                           │
       │              │ Azure Blob  │◀──────────────────────────┘
       └──────────────│ Storage     │     (blobUrl in response)
         Image URL    │ (CDN)       │
                      └─────────────┘
```

---

## 3. Database Schema (ERD)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                         MONGODB DATABASE SCHEMA                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────┐         ┌─────────────────────────┐
│         USERS           │         │         PHOTOS          │
├─────────────────────────┤         ├─────────────────────────┤
│ _id: ObjectId (PK)      │         │ _id: ObjectId (PK)      │
│ odId: String (Unique)   │◀────────│ creatorId: String (FK)  │
│ email: String (Unique)  │    1:N  │ title: String           │
│ displayName: String     │         │ caption: String         │
│ role: Enum              │         │ location: String        │
│   - 'creator'           │         │ people: [String]        │
│   - 'consumer'          │         │ blobUrl: String         │
│ bio: String             │         │ blobName: String        │
│ avatarUrl: String       │         │ mimeType: String        │
│ photoCount: Number      │         │ fileSize: Number        │
│ createdAt: Date         │         │ viewCount: Number       │
│ updatedAt: Date         │         │ aiTags: [String]        │
└─────────────────────────┘         │ aiDescription: String   │
                                    │ dominantColors: [String]│
                                    │ isAdultContent: Boolean │
          │                         │ createdAt: Date         │
          │                         │ updatedAt: Date         │
          │                         └───────────┬─────────────┘
          │                                     │
          │         ┌───────────────────────────┴───────────────────────────┐
          │         │                                                       │
          │         ▼                                                       ▼
          │  ┌─────────────────────────┐                 ┌─────────────────────────┐
          │  │       COMMENTS          │                 │        RATINGS          │
          │  ├─────────────────────────┤                 ├─────────────────────────┤
          │  │ _id: ObjectId (PK)      │                 │ _id: ObjectId (PK)      │
          │  │ photoId: ObjectId (FK)  │                 │ photoId: ObjectId (FK)  │
          └──│ userId: String (FK)     │                 │ userId: String (FK)     │
             │ userDisplayName: String │                 │ value: Number (1-5)     │
             │ content: String         │                 │ createdAt: Date         │
             │ sentiment: Enum         │                 │ updatedAt: Date         │
             │   - 'positive'          │                 └─────────────────────────┘
             │   - 'neutral'           │
             │   - 'negative'          │                 Unique Index: 
             │   - 'unknown'           │                 { photoId, userId }
             │ createdAt: Date         │
             │ updatedAt: Date         │
             └─────────────────────────┘

RELATIONSHIPS:
─────────────
• User (1) ──── (N) Photos      : A creator can have many photos
• Photo (1) ─── (N) Comments    : A photo can have many comments
• Photo (1) ─── (N) Ratings     : A photo can have many ratings
• User (1) ──── (N) Comments    : A user can make many comments
• User (1) ──── (1) Rating/Photo: A user can rate each photo once
```

---

## 4. CI/CD Pipeline Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                         GITHUB ACTIONS CI/CD PIPELINE                                │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────┐
│ Developer   │
│ Push Code   │
└──────┬──────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                              GITHUB REPOSITORY                                       │
│                           (kiranaziz22/PhotoStack)                                   │
└──────────────────────────────────────────────────────────────────────────────────────┘
       │
       │ Trigger: push to main branch
       ▼
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                           GITHUB ACTIONS WORKFLOW                                    │
│                         (.github/workflows/main_photostack.yml)                      │
│                                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │                              BUILD JOB                                          │ │
│  │                                                                                 │ │
│  │   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │ │
│  │   │ 1. Checkout  │───▶│ 2. Setup     │───▶│ 3. Install   │───▶│ 4. Build     │  │ │
│  │   │    Code      │    │    Node.js   │    │    Frontend  │    │    Frontend  │  │ │
│  │   └──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘  │ │
│  │                                                                      │          │ │
│  │   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐          │          │ │
│  │   │ 7. Upload    │◀───│ 6. Install   │◀───│ 5. Copy dist │◀─────────┘          │ │
│  │   │    Artifact  │    │    Backend   │    │    to public │                     │ │
│  │   └──────────────┘    └──────────────┘    └──────────────┘                     │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                         │                                            │
│                                         ▼                                            │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │                              DEPLOY JOB                                         │ │
│  │                                                                                 │ │
│  │   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                     │ │
│  │   │ 1. Download  │───▶│ 2. Deploy to │───▶│ 3. Verify    │                     │ │
│  │   │    Artifact  │    │    Azure     │    │    Deployment│                     │ │
│  │   └──────────────┘    └──────────────┘    └──────────────┘                     │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────────────┘
       │
       │ Deploy via Publish Profile
       ▼
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                              AZURE APP SERVICE                                       │
│                        (photostack.azurewebsites.net)                               │
│                                                                                      │
│                              ✅ LIVE APPLICATION                                     │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. User Journey / Use Case Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              USER ROLES & CAPABILITIES                               │
└─────────────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────────┐
                              │   PHOTOSTACK    │
                              │   APPLICATION   │
                              └────────┬────────┘
                                       │
              ┌────────────────────────┴────────────────────────┐
              │                                                  │
              ▼                                                  ▼
    ┌─────────────────┐                              ┌─────────────────┐
    │    CONSUMER     │                              │    CREATOR      │
    │     (User)      │                              │     (User)      │
    └────────┬────────┘                              └────────┬────────┘
             │                                                │
             │ Can:                                           │ Can (all Consumer +):
             │                                                │
             ├──▶ 👁️ View Photos                              ├──▶ 📤 Upload Photos
             ├──▶ 🔍 Search Photos                            ├──▶ ✏️ Edit Own Photos
             ├──▶ ⭐ Rate Photos                              ├──▶ 🗑️ Delete Own Photos
             ├──▶ 💬 Comment on Photos                        ├──▶ 🤖 Enable/Disable AI
             ├──▶ 👤 View Profile                             ├──▶ 📊 View Dashboard
             └──▶ ✏️ Edit Profile                             └──▶ 📈 View Statistics


┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              USER FLOW DIAGRAM                                       │
└─────────────────────────────────────────────────────────────────────────────────────┘

                                    ┌─────────┐
                                    │  START  │
                                    └────┬────┘
                                         │
                                         ▼
                                ┌────────────────┐
                                │  Landing Page  │
                                │   (Home)       │
                                └───────┬────────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    │                   │                   │
                    ▼                   ▼                   ▼
           ┌────────────────┐  ┌────────────────┐  ┌────────────────┐
           │    Browse      │  │    Login/      │  │    Explore     │
           │    Photos      │  │    Signup      │  │    Gallery     │
           └───────┬────────┘  └───────┬────────┘  └───────┬────────┘
                   │                   │                   │
                   │                   ▼                   │
                   │          ┌────────────────┐          │
                   │          │  Authenticated │          │
                   │          │     User       │          │
                   │          └───────┬────────┘          │
                   │                  │                   │
                   └──────────────────┼───────────────────┘
                                      │
           ┌──────────────────────────┼──────────────────────────┐
           │                          │                          │
           ▼                          ▼                          ▼
    ┌────────────────┐        ┌────────────────┐        ┌────────────────┐
    │  View Photo    │        │    Upload      │        │   Dashboard    │
    │   Details      │        │    Photo       │        │   (Creators)   │
    └───────┬────────┘        └───────┬────────┘        └────────────────┘
            │                         │
     ┌──────┴──────┐                  │
     │             │                  │
     ▼             ▼                  ▼
┌─────────┐  ┌─────────┐      ┌────────────────┐
│  Rate   │  │ Comment │      │  AI Analysis   │
│  Photo  │  │         │      │  (Optional)    │
└─────────┘  └─────────┘      └────────────────┘
```

---

## 6. API Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              REST API ENDPOINTS                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘

                            BASE URL: /api
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
        ▼                        ▼                        ▼
   ┌─────────┐              ┌─────────┐              ┌─────────┐
   │ /photos │              │ /users  │              │ /health │
   └────┬────┘              └────┬────┘              └─────────┘
        │                        │
        │                        │
┌───────┴───────────────┐  ┌────┴────────────────────┐
│                       │  │                          │
│ GET    /              │  │ GET    /me               │
│ GET    /:id           │  │ PUT    /me               │
│ POST   /              │  │ GET    /me/stats         │
│ PUT    /:id           │  │ GET    /creators         │
│ DELETE /:id           │  │ GET    /:id              │
│ GET    /search        │  │ POST   /register         │
│ GET    /trending      │  │                          │
│ GET    /creator/:id   │  └──────────────────────────┘
│                       │
│ /:photoId/comments    │
│   GET  /              │
│   POST /              │
│                       │
│ /:photoId/ratings     │
│   GET  /              │
│   GET  /me            │
│   POST /              │
│   DELETE /            │
└───────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              AUTHENTICATION FLOW                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘

  ┌────────┐                ┌─────────────┐               ┌─────────────┐
  │ Client │                │   Backend   │               │  Database   │
  └───┬────┘                └──────┬──────┘               └──────┬──────┘
      │                            │                             │
      │  1. Login Request          │                             │
      │  (email, password)         │                             │
      │ ──────────────────────────▶│                             │
      │                            │                             │
      │                            │  2. Validate/Create User    │
      │                            │ ────────────────────────────▶
      │                            │                             │
      │                            │  3. User Data               │
      │                            │ ◀────────────────────────────
      │                            │                             │
      │  4. JWT Token              │                             │
      │ ◀──────────────────────────│                             │
      │                            │                             │
      │  5. API Request            │                             │
      │  (Authorization: Bearer)   │                             │
      │ ──────────────────────────▶│                             │
      │                            │                             │
      │                            │  6. Validate Token          │
      │                            │  7. Extract User Info       │
      │                            │                             │
      │  8. Response               │                             │
      │ ◀──────────────────────────│                             │
      │                            │                             │
```

---

## 7. Component Architecture (Frontend)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                         REACT COMPONENT HIERARCHY                                    │
└─────────────────────────────────────────────────────────────────────────────────────┘

                                    ┌─────────────┐
                                    │    App      │
                                    │  (Router)   │
                                    └──────┬──────┘
                                           │
                    ┌──────────────────────┼──────────────────────┐
                    │                      │                      │
                    ▼                      ▼                      ▼
            ┌───────────────┐      ┌───────────────┐      ┌───────────────┐
            │  AuthContext  │      │    Navbar     │      │    Routes     │
            │  (Provider)   │      │  (Component)  │      │               │
            └───────────────┘      └───────────────┘      └───────┬───────┘
                                                                  │
        ┌─────────────────────┬─────────────────────┬─────────────┼─────────────┐
        │                     │                     │             │             │
        ▼                     ▼                     ▼             ▼             ▼
 ┌─────────────┐      ┌─────────────┐      ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
 │    Home     │      │   Explore   │      │   Upload    │ │   Profile   │ │  Dashboard  │
 │    Page     │      │    Page     │      │    Page     │ │    Page     │ │    Page     │
 └──────┬──────┘      └──────┬──────┘      └─────────────┘ └─────────────┘ └─────────────┘
        │                    │
        │                    │
        ▼                    ▼
 ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
 │  PhotoGrid  │      │  PhotoCard  │      │ PhotoDetail │
 │ (Component) │─────▶│ (Component) │      │   (Page)    │
 └─────────────┘      └─────────────┘      └──────┬──────┘
                                                  │
                              ┌───────────────────┼───────────────────┐
                              │                   │                   │
                              ▼                   ▼                   ▼
                       ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
                       │ StarRating  │     │  Comments   │     │  AI Tags    │
                       │ (Component) │     │   Section   │     │   Display   │
                       └─────────────┘     └─────────────┘     └─────────────┘


┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              PROJECT FILE STRUCTURE                                  │
└─────────────────────────────────────────────────────────────────────────────────────┘

PhotoStack/
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📁 components/          # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── PhotoCard.jsx
│   │   │   ├── PhotoGrid.jsx
│   │   │   └── StarRating.jsx
│   │   ├── 📁 pages/               # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Explore.jsx
│   │   │   ├── PhotoDetail.jsx
│   │   │   ├── Upload.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── 📁 context/             # React Context
│   │   │   └── AuthContext.jsx
│   │   ├── 📁 services/            # API services
│   │   │   └── api.js
│   │   ├── 📁 config/              # Configuration
│   │   │   └── index.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── 📁 backend/
│   ├── 📁 config/                  # Configuration
│   │   ├── index.js
│   │   └── db.js
│   ├── 📁 controller/              # Route handlers
│   │   ├── photoController.js
│   │   ├── userController.js
│   │   ├── commentController.js
│   │   └── ratingController.js
│   ├── 📁 models/                  # MongoDB models
│   │   ├── User.js
│   │   ├── Photo.js
│   │   ├── Comment.js
│   │   └── Rating.js
│   ├── 📁 routes/                  # Express routes
│   │   ├── photoRoutes.js
│   │   ├── userRoutes.js
│   │   ├── commentRoutes.js
│   │   └── ratingRoutes.js
│   ├── 📁 middleware/              # Express middleware
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── 📁 services/                # External services
│   │   ├── blobService.js
│   │   └── cognitiveService.js
│   ├── server.js
│   └── package.json
│
├── 📁 .github/
│   └── 📁 workflows/
│       └── main_photostack.yml     # CI/CD pipeline
│
└── 📁 docs/
    └── ARCHITECTURE_DIAGRAMS.md    # This file
```

---

## 8. Azure Services Integration

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                         AZURE SERVICES OVERVIEW                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                      │
│   ┌─────────────────────┐      ┌─────────────────────┐      ┌─────────────────────┐ │
│   │   APP SERVICE       │      │   BLOB STORAGE      │      │ COGNITIVE SERVICES  │ │
│   │                     │      │                     │      │                     │ │
│   │ • Web hosting       │      │ • Photo storage     │      │ • Computer Vision   │ │
│   │ • Node.js runtime   │      │ • CDN delivery      │      │ • Image analysis    │ │
│   │ • Auto-scaling      │      │ • Secure access     │      │ • Tag generation    │ │
│   │ • SSL/TLS           │      │ • Redundancy        │      │ • Color detection   │ │
│   │                     │      │                     │      │ • Content moderation│ │
│   │ Tier: F1 (Free)     │      │ Tier: Standard      │      │ Tier: F0 (Free)     │ │
│   └─────────────────────┘      └─────────────────────┘      └─────────────────────┘ │
│                                                                                      │
│   ┌─────────────────────┐      ┌─────────────────────┐                              │
│   │ APPLICATION INSIGHTS│      │   MONGODB ATLAS     │                              │
│   │                     │      │   (External)        │                              │
│   │ • Performance       │      │                     │                              │
│   │ • Error tracking    │      │ • Database hosting  │                              │
│   │ • User analytics    │      │ • Auto-scaling      │                              │
│   │ • Live metrics      │      │ • Backups           │                              │
│   │                     │      │                     │                              │
│   │ Tier: Free          │      │ Tier: M0 (Free)     │                              │
│   └─────────────────────┘      └─────────────────────┘                              │
│                                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘

COST SUMMARY (Monthly):
══════════════════════
• App Service (F1):        £0.00
• Blob Storage:            ~£0.50 (based on usage)
• Cognitive Services (F0): £0.00 (20 calls/min limit)
• Application Insights:    £0.00 (5GB/month free)
• MongoDB Atlas (M0):      £0.00

TOTAL ESTIMATED COST:     ~£0.50/month
```

---

## 9. Security Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              SECURITY MEASURES                                       │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────────┐
│                              TRANSPORT LAYER                                         │
│                                                                                      │
│   • HTTPS enforced on all endpoints                                                 │
│   • TLS 1.2+ encryption                                                             │
│   • Azure-managed SSL certificates                                                   │
└──────────────────────────────────────────────────────────────────────────────────────┘
                                         │
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                              APPLICATION LAYER                                       │
│                                                                                      │
│   ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐                 │
│   │  CORS Policy    │    │   JWT Auth      │    │  Input Valid.   │                 │
│   │                 │    │                 │    │                 │                 │
│   │ • Restrict      │    │ • Token-based   │    │ • Zod schemas   │                 │
│   │   origins       │    │ • Expiration    │    │ • Sanitization  │                 │
│   │ • Whitelist     │    │ • Claims verify │    │ • File type     │                 │
│   │   methods       │    │                 │    │   validation    │                 │
│   └─────────────────┘    └─────────────────┘    └─────────────────┘                 │
│                                                                                      │
│   ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐                 │
│   │  Rate Limiting  │    │  Error Handling │    │  Content Safety │                 │
│   │                 │    │                 │    │                 │                 │
│   │ • 100 req/15min │    │ • No stack      │    │ • Adult content │                 │
│   │ • Per IP        │    │   traces in     │    │   detection     │                 │
│   │                 │    │   production    │    │ • AI moderation │                 │
│   └─────────────────┘    └─────────────────┘    └─────────────────┘                 │
└──────────────────────────────────────────────────────────────────────────────────────┘
                                         │
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                              DATA LAYER                                              │
│                                                                                      │
│   • MongoDB Atlas with encryption at rest                                           │
│   • Azure Blob Storage with private endpoints                                        │
│   • Environment variables for secrets (never in code)                               │
│   • Connection strings stored in Azure App Settings                                  │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

---

## How to Use These Diagrams

### For Your Report:
1. **Copy the ASCII diagrams** directly into your documentation
2. **Convert to images** using tools like:
   - [ASCIIFlow](https://asciiflow.com/) - Edit ASCII art
   - [draw.io](https://draw.io) - Create professional diagrams
   - [Mermaid Live Editor](https://mermaid.live) - Convert to images
   - [Excalidraw](https://excalidraw.com/) - Hand-drawn style

### Recommended Diagrams for Coursework:
1. **System Architecture** - Shows cloud-native understanding
2. **Database Schema** - Shows data modeling skills
3. **CI/CD Pipeline** - Shows DevOps knowledge
4. **Data Flow** - Shows system understanding
5. **Security Architecture** - Shows security awareness

---

*Generated for PhotoStack Cloud-Native Photo Sharing Platform*
*January 2026*
