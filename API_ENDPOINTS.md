# 80road API Endpoints Usage Status

Below is the status of the API endpoints from the `80road.postman_collection.json` file. The endpoints are organized by whether they are currently implemented and used in the codebase (`80road-next`) or not yet implemented.

## ✅ Used Endpoints

These endpoints have corresponding API calls via `ofetch` (`apiClient`) or the `api` helper in the Next.js app.

### Authentication
- `POST /auth/login` (Auth > login)
- `POST /auth/resend-otp` (Auth > resend-otp)
- `POST /auth/verify-otp` (Auth > verify-otp)
- `POST /auth/logout` (Auth > logout)

### General / Locations
- `GET /countries` (general > countries filter > countries)
- `GET /countries/:countryId/states` (general > countries filter > states)
- `GET /states/:stateId/cities` (general > countries filter > cities)

### Home
- `GET /home` (Home > home)
- `GET /home/categories-appear-in-filter` (Home > categories-appear-in-filter)
- `GET /home/ads-by-history` (Home > ads-by-history) - Includes fallback to `/explore`
- `POST /home/filter-history` (Home > filter-history)

### Profile & Account
- `GET /profile` (Profile > profile)
- `POST /profile` (Profile > update-profile)
- `GET /profile/:id` (Used to fetch specific profile/office details)
- `GET /profile/my-ads` (Profile > my-ads)
- `GET /profile/my-favorites` (Profile > my-favorites)

### Blogs
- `GET /blogs` (Blogs > index)
- `GET /blog/:id` (Blogs > show)

### Ads & Explore
- `GET /explore` (Explore > explore)
- `GET /ad/:id` (Explore > show ad)
- `POST /ad/:id/toggle-like` (Explore > like toggle)

### Informational Pages
- `GET /pages/terms-conditions` (pages > terms-conditions)
- `GET /pages/privacy-policy` (pages > privacy-policy)
- `GET /pages/faqs` (pages > FAQs)

### Companies / Offices
- `GET /companies/departments` (Companies > companies-departments)
- `GET /companies/departments/:id` (Used to filter offices by category)
- `GET /company/:id/ads` (Companies > user & company profile > company ads)

---

## ❌ Not Used Yet

These endpoints are documented in the Postman collection but currently do not have matching service calls in the Next.js application codebase.

### General
- `GET /settings` (general > settings)

### Explore & Ads
- `GET /building-types` (Explore > Building types)
- `GET /categories` (Create Ad > categories)

### Notifications
- `GET /notifications` (Notifications > notifications)
- `GET /notifications/unread` (Notifications > notifications unread)
- `DELETE /notifications/:id` (Notifications > delete)
- `DELETE /notifications/` (Notifications > delete all)
