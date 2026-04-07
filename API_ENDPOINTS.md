# 80road API Endpoints Usage Status

Below is the status of the API endpoints from the `80road.postman_collection.json` file. The endpoints are organized by whether they are currently implemented and used in the codebase (`80road-next`) or not yet implemented.

## ✅ Used Endpoints

These endpoints have corresponding API calls via `ofetch` (`apiClient`) in the Next.js app.

### Authentication
- `POST /auth/login` (Auth > login)
- `POST /auth/resend-otp` (Auth > resend-otp)
- `POST /auth/verify-otp` (Auth > verify-otp)

### General / Locations
- `GET /countries` (general > countries filter > countries)
- `GET /countries/:countryId/states` (general > countries filter > states)
- `GET /states/:stateId/cities` (general > countries filter > cities)

### Home
- `GET /home` (Home > home)
- `GET /home/categories-appear-in-filter` (Home > categories-appear-in-filter)
- `POST /home/filter-history` (Home > filter-history)

### Profile & Account
- `GET /profile` (Profile > profile)
- `POST /profile` (Profile > update-profile)

### Blogs
- `GET /blogs` (Blogs > index)
- `GET /blog/:id` (Blogs > show)

### Ads & Explore
- `POST /ad/:id/toggle-like` (Explore > like toggle)

---

## ❌ Not Used Yet

These endpoints are documented in the Postman collection but currently do not have matching service calls in the Next.js application codebase.

### General
- `GET /settings` (general > settings)

### Authentication
- `POST /auth/logout` (Auth > logout)

### Home
- `GET /home/ads-by-history` (Home > ads-by-history)

### Companies
- `GET /company/:companyId` (Companies > user & company profile > profile)
- `GET /company/:companyId/ads` (Companies > user & company profile > company ads)
- `GET /companies/departments` (Companies > companies-departments)
- `GET /companies/departments/:id` (Companies > companies pending!)

### Explore & Ads
- `GET /building-types` (Explore > Building types)
- `GET /explore` (Explore > explore)
- `GET /ad/:id` (Explore > show ad)
- `GET /categories` (Create Ad > categories)

### Profile Details
- `GET /profile/my-ads` (Profile > my-ads)
- `GET /profile/my-favorites` (Profile > my-favorites)

### Informational Pages
- `GET /pages/terms-conditions` (pages > terms-conditions)
- `GET /pages/privacy-policy` (pages > privacy-policy)
- `GET /pages/faqs` (pages > FAQs)

### Notifications
- `GET /notifications` (Notifications > notifications)
- `GET /notifications/unread` (Notifications > notifications unread)
- `DELETE /notifications/:id` (Notifications > delete)
- `DELETE /notifications/` (Notifications > delete all)
