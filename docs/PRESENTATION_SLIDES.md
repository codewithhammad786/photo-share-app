# PhotoStack - Presentation Slides Content

---

## SLIDE 0: Title Slide

### **PhotoStack**
#### A Cloud-Native, Scalable Photo Sharing Platform

**Leveraging Azure Cloud Services for Enterprise-Grade Image Management**

---

**Student Name:** [Your Name]  
**Student Number:** [Your Student Number]  
**Module:** Cloud Computing  
**Date:** January 2026

---

## SLIDE 1: Problem Statement

### The Challenge of Modern Photo Sharing

**Traditional Photo Sharing Limitations:**

| Problem | Impact |
|---------|--------|
| 🖥️ **Single Server Architecture** | Single point of failure, limited capacity |
| 📈 **Traffic Spikes** | System crashes during viral content |
| 💾 **Local Storage** | Expensive, limited, no redundancy |
| 🔒 **Security Concerns** | Difficult to implement enterprise-grade security |
| 🌍 **Global Access** | High latency for geographically distributed users |

**Real-World Example:**
> Instagram processes 500+ million daily active users, 100+ million photos uploaded daily. Traditional architecture cannot handle this scale.

**Key Questions:**
- How do we handle millions of concurrent users?
- How do we store petabytes of images cost-effectively?
- How do we ensure 99.9% uptime?
- How do we add intelligent features (AI) without infrastructure burden?

---

## SLIDE 2: Scalability Challenges Identified

### Technical Scalability Issues

```
┌─────────────────────────────────────────────────────────────┐
│                 SCALABILITY BOTTLENECKS                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. COMPUTE SCALING                                          │
│     └─→ Web servers cannot handle traffic spikes             │
│     └─→ Manual scaling is slow and expensive                 │
│                                                              │
│  2. STORAGE SCALING                                          │
│     └─→ Local disk has finite capacity                       │
│     └─→ No built-in redundancy or backup                     │
│                                                              │
│  3. DATABASE SCALING                                         │
│     └─→ Single database becomes bottleneck                   │
│     └─→ Read/write contention issues                         │
│                                                              │
│  4. PROCESSING SCALING                                       │
│     └─→ Image processing blocks main thread                  │
│     └─→ AI analysis requires GPU resources                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Identified Requirements:**
- ✅ Horizontal scaling capability
- ✅ Distributed storage with CDN
- ✅ Managed database with auto-scaling
- ✅ Serverless compute for processing
- ✅ Automated deployment pipeline

---

## SLIDE 3: Solution Architecture Overview

### PhotoStack Cloud-Native Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        PHOTOSTACK ARCHITECTURE                           │
└─────────────────────────────────────────────────────────────────────────┘

     USERS                    AZURE CLOUD                    DATA STORES
    ┌─────┐            ┌─────────────────────┐           ┌─────────────┐
    │ 🌐  │───HTTPS───▶│   APP SERVICE       │──────────▶│ MongoDB     │
    │     │            │   (Node.js + React) │           │ Atlas       │
    └─────┘            └──────────┬──────────┘           └─────────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    ▼             ▼             ▼
              ┌──────────┐ ┌──────────┐ ┌──────────────┐
              │  BLOB    │ │COGNITIVE │ │ APPLICATION  │
              │ STORAGE  │ │ SERVICES │ │  INSIGHTS    │
              │ (Photos) │ │   (AI)   │ │ (Monitoring) │
              └──────────┘ └──────────┘ └──────────────┘
```

**Technology Stack:**
| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React + Vite | Modern, responsive SPA |
| Backend | Node.js + Express | RESTful API server |
| Database | MongoDB Atlas | Scalable NoSQL database |
| Storage | Azure Blob Storage | Unlimited image storage |
| AI | Azure Cognitive Services | Intelligent image analysis |
| Hosting | Azure App Service | Managed web hosting |
| CI/CD | GitHub Actions | Automated deployment |

---

## SLIDE 4: Frontend Architecture

### React Single Page Application

**Component Structure:**
```
App
├── AuthContext (State Management)
├── Navbar (Navigation)
└── Routes
    ├── Home (Photo Feed)
    ├── Explore (Gallery Grid)
    ├── PhotoDetail (Single Photo View)
    ├── Upload (Photo Upload + AI Toggle)
    ├── Profile (User Profile)
    ├── Dashboard (Creator Analytics)
    ├── Login / Signup (Authentication)
    └── Components
        ├── PhotoCard
        ├── PhotoGrid
        └── StarRating
```

**Key Features:**
- 🎨 **Responsive Design** - Works on mobile, tablet, desktop
- ⚡ **Fast Loading** - Vite build with code splitting
- 🔐 **JWT Authentication** - Secure token-based auth
- 🔄 **Real-time Updates** - Dynamic content loading
- 📱 **Progressive Web App Ready** - Can be installed on devices

**User Roles:**
| Role | Capabilities |
|------|-------------|
| **Consumer** | View, rate, comment on photos |
| **Creator** | All above + Upload, edit, delete photos |

---

## SLIDE 5: Backend Architecture

### Node.js RESTful API

**API Structure:**
```
/api
├── /photos
│   ├── GET    /           → List all photos (paginated)
│   ├── GET    /:id        → Get single photo
│   ├── POST   /           → Upload photo (+ AI analysis)
│   ├── PUT    /:id        → Update photo
│   ├── DELETE /:id        → Delete photo
│   └── GET    /trending   → Get popular photos
│
├── /users
│   ├── GET    /me         → Get current user
│   ├── PUT    /me         → Update profile
│   ├── GET    /me/stats   → Get user statistics
│   └── POST   /register   → Create account
│
├── /photos/:id/comments
│   ├── GET    /           → Get comments
│   └── POST   /           → Add comment
│
└── /photos/:id/ratings
    ├── GET    /           → Get ratings
    └── POST   /           → Add/update rating
```

**Middleware Pipeline:**
```
Request → CORS → Auth → Validation → Controller → Response
                  ↓
            Error Handler
```

---

## SLIDE 6: Database & Storage Design

### MongoDB Atlas Schema

```
┌─────────────────┐     ┌─────────────────┐
│     USERS       │     │     PHOTOS      │
├─────────────────┤     ├─────────────────┤
│ _id             │◀────│ creatorId       │
│ odId (unique)   │ 1:N │ title           │
│ email           │     │ caption         │
│ displayName     │     │ blobUrl ────────┼──▶ Azure Blob
│ role            │     │ aiTags[]        │
│ photoCount      │     │ aiDescription   │
└─────────────────┘     │ dominantColors[]│
                        │ viewCount       │
        │               └────────┬────────┘
        │                        │
        │               ┌────────┴────────┐
        │               │                 │
        ▼               ▼                 ▼
┌─────────────────┐  ┌─────────────┐  ┌─────────────┐
│    COMMENTS     │  │   RATINGS   │  │
├─────────────────┤  ├─────────────┤
│ photoId         │  │ photoId     │
│ userId          │  │ userId      │
│ content         │  │ value (1-5) │
│ sentiment       │  └─────────────┘
└─────────────────┘
```

### Azure Blob Storage
- **Container:** `photos`
- **Structure:** `{userId}/{timestamp}_{filename}`
- **Access:** Secure URLs with SAS tokens
- **CDN:** Global content delivery

---

## SLIDE 7: Advanced Feature 1 - AI Image Analysis

### Azure Cognitive Services Integration

**Automatic Image Analysis on Upload:**

```
┌──────────┐     ┌──────────────┐     ┌─────────────────┐
│  Photo   │────▶│ Azure Blob   │────▶│   Cognitive     │
│  Upload  │     │   Storage    │     │   Services      │
└──────────┘     └──────────────┘     └────────┬────────┘
                                               │
                                               ▼
                                    ┌─────────────────────┐
                                    │   AI ANALYSIS       │
                                    ├─────────────────────┤
                                    │ • Auto-generated    │
                                    │   tags              │
                                    │ • Natural language  │
                                    │   description       │
                                    │ • Dominant color    │
                                    │   extraction        │
                                    │ • Adult content     │
                                    │   detection         │
                                    └─────────────────────┘
```

**User Control:**
- Toggle switch to enable/disable AI analysis
- AI tags displayed on photo detail page
- Color palette visualization
- Content moderation for safety

**Benefits:**
- 🔍 Improved searchability
- 🏷️ Automatic categorization
- 🛡️ Content safety
- 📊 Rich metadata

---

## SLIDE 8: Advanced Feature 2 - CI/CD Pipeline

### Automated Deployment with GitHub Actions

```
┌─────────────────────────────────────────────────────────────────┐
│                    CI/CD PIPELINE                                │
└─────────────────────────────────────────────────────────────────┘

  Developer          GitHub              GitHub Actions         Azure
  ┌──────┐          ┌──────┐            ┌──────────────┐      ┌──────┐
  │ Push │─────────▶│ Repo │───trigger──▶│    BUILD     │      │      │
  │ Code │          │      │            │              │      │      │
  └──────┘          └──────┘            │ • Checkout   │      │      │
                                        │ • Install    │      │      │
                                        │ • Build React│      │      │
                                        │ • Copy to    │      │      │
                                        │   Backend    │      │      │
                                        └──────┬───────┘      │      │
                                               │              │      │
                                               ▼              │      │
                                        ┌──────────────┐      │      │
                                        │    DEPLOY    │─────▶│ Live │
                                        │              │      │ App  │
                                        │ • Download   │      │      │
                                        │   artifact   │      │      │
                                        │ • Deploy to  │      │      │
                                        │   Azure      │      │      │
                                        └──────────────┘      └──────┘

                         ⏱️ Total Time: ~3 minutes
```

**Pipeline Features:**
| Feature | Benefit |
|---------|---------|
| Automatic triggers | Deploy on every push to main |
| Build optimization | Frontend bundled with backend |
| Zero-downtime deployment | Users never see interruption |
| Rollback capability | Quick recovery from issues |

---

## SLIDE 9: Solution Limitations

### Current Constraints

| Limitation | Description | Impact |
|------------|-------------|--------|
| **Free Tier Limits** | Azure F1 tier has CPU/memory constraints | May slow under heavy load |
| **Cold Starts** | App Service sleeps after inactivity | First request after idle is slow |
| **Single Region** | Deployed to one Azure region | Higher latency for distant users |
| **No Real-time** | HTTP polling, no WebSocket | Comments don't appear instantly |
| **Mock Auth** | Simplified authentication | Not production-ready security |

**Technical Debt:**
```
┌─────────────────────────────────────────────────────┐
│ CURRENT STATE          │  IDEAL STATE              │
├─────────────────────────────────────────────────────┤
│ Mock JWT tokens        │  Azure AD B2C             │
│ Single App Service     │  Container Apps + AKS     │
│ No caching             │  Redis Cache              │
│ Sync image processing  │  Azure Functions          │
│ No CDN                 │  Azure CDN                │
└─────────────────────────────────────────────────────┘
```

---

## SLIDE 10: Scalability Assessment

### How PhotoStack Can Scale

**Horizontal Scaling Options:**

```
CURRENT (Single Instance)          SCALED (Multiple Instances)
┌─────────────────────┐           ┌─────────────────────────────┐
│                     │           │      LOAD BALANCER          │
│   App Service (1)   │           └──────────┬──────────────────┘
│                     │                      │
└─────────────────────┘           ┌──────────┼──────────┐
                                  │          │          │
                                  ▼          ▼          ▼
                              ┌──────┐  ┌──────┐  ┌──────┐
                              │ App  │  │ App  │  │ App  │
                              │  1   │  │  2   │  │  N   │
                              └──────┘  └──────┘  └──────┘
```

**Scaling Capabilities:**

| Component | Current | Scalable To |
|-----------|---------|-------------|
| **App Service** | 1 instance (F1) | 30+ instances (Premium) |
| **Blob Storage** | Standard | Premium + CDN (global) |
| **MongoDB Atlas** | M0 (512MB) | M60+ (TB scale) |
| **Cognitive Services** | F0 (20 calls/min) | S1 (unlimited) |

**Auto-Scale Triggers:**
- CPU utilization > 70%
- Memory usage > 80%
- Request queue length > 100
- Schedule-based (peak hours)

**Estimated Capacity:**
- Current: ~100 concurrent users
- Scaled: 100,000+ concurrent users

---

## SLIDE 11: Demo Video Outline

### 5-Minute Demonstration Plan

**Video Structure:**

| Time | Section | Content |
|------|---------|---------|
| 0:00 - 0:30 | **Introduction** | App overview, URL, architecture |
| 0:30 - 1:30 | **User Features** | Browse photos, view details, ratings |
| 1:30 - 2:30 | **Creator Features** | Login, upload with AI toggle, see AI tags |
| 2:30 - 3:30 | **Azure Portal** | Show App Service, Blob Storage, Cognitive Services |
| 3:30 - 4:30 | **CI/CD Demo** | Push code, show GitHub Actions, see deployment |
| 4:30 - 5:00 | **Summary** | Key features, scalability potential |

**Demo Checklist:**
- [ ] Show live URL: `https://photostack-xxx.azurewebsites.net`
- [ ] Browse photo gallery
- [ ] View photo with AI tags and colors
- [ ] Login as creator
- [ ] Upload photo with AI enabled
- [ ] Show AI-generated tags appear
- [ ] Show Azure Portal resources
- [ ] Trigger deployment via git push
- [ ] Show GitHub Actions running
- [ ] Show successful deployment

**Recording Tips:**
- Use screen recording software (OBS, Camtasia)
- Prepare data beforehand (photos to upload)
- Have Azure Portal tabs ready
- Practice the flow 2-3 times

---

## SLIDE 12: Conclusion

### Project Summary

**What Was Achieved:**

✅ **Cloud-Native Architecture**
- Fully deployed on Azure cloud platform
- Leverages managed services for reliability

✅ **Scalable Design**
- Stateless application design
- Horizontally scalable components
- Managed database with auto-scaling

✅ **Modern Development Practices**
- CI/CD pipeline with GitHub Actions
- Infrastructure as configuration
- Environment-based deployment

✅ **Intelligent Features**
- AI-powered image analysis
- Automatic tagging and description
- Content moderation

**Key Learnings:**
1. Cloud services abstract infrastructure complexity
2. Managed services reduce operational burden
3. CI/CD enables rapid, reliable deployment
4. AI services can be integrated without ML expertise

**Future Enhancements:**
- Azure AD B2C for enterprise authentication
- Azure Functions for background processing
- Multi-region deployment for global reach
- Real-time features with SignalR

---

## SLIDE 13: References

### Technical References

**Microsoft Azure Documentation:**
1. Azure App Service Documentation. Microsoft (2026). Available at: https://docs.microsoft.com/azure/app-service/
2. Azure Blob Storage Documentation. Microsoft (2026). Available at: https://docs.microsoft.com/azure/storage/blobs/
3. Azure Cognitive Services - Computer Vision. Microsoft (2026). Available at: https://docs.microsoft.com/azure/cognitive-services/computer-vision/
4. GitHub Actions for Azure. Microsoft (2026). Available at: https://docs.microsoft.com/azure/developer/github/

**Development Frameworks:**
5. React Documentation. Meta (2026). Available at: https://react.dev/
6. Express.js Documentation. OpenJS Foundation (2026). Available at: https://expressjs.com/
7. MongoDB Atlas Documentation. MongoDB Inc (2026). Available at: https://docs.atlas.mongodb.com/
8. Vite Documentation. Evan You (2026). Available at: https://vitejs.dev/

**Cloud Architecture:**
9. Microsoft Azure Architecture Center. Microsoft (2026). Available at: https://docs.microsoft.com/azure/architecture/
10. The Twelve-Factor App. Heroku (2017). Available at: https://12factor.net/

**Academic References:**
11. Armbrust, M. et al. (2010) 'A View of Cloud Computing', Communications of the ACM, 53(4), pp. 50-58.
12. Newman, S. (2021) Building Microservices. 2nd edn. O'Reilly Media.

---

## ADDITIONAL NOTES

### Presentation Tips:

1. **Time Management:**
   - Aim for 10-12 minutes total
   - Don't rush through technical slides
   - Leave time for questions

2. **Visual Aids:**
   - Convert ASCII diagrams to professional images
   - Use consistent color scheme
   - Include screenshots of the app

3. **Speaking Points:**
   - Explain WHY each technology was chosen
   - Highlight scalability at each layer
   - Connect back to problem statement

4. **Demo Preparation:**
   - Test the live URL before presentation
   - Have backup screenshots if internet fails
   - Prepare sample photos for upload demo

---

*Presentation content for PhotoStack Cloud-Native Photo Sharing Platform*
*Module: Cloud Computing - January 2026*
