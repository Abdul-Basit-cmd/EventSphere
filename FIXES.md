# API Route Verification & Fixes

This document records the verification and corrections made to the React frontend API modules to align with the backend routes mounted under `/api/v1/`.

## Base Configuration Note
The central Axios instance (`client/src/api/axios.js`) sets:
- `baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'`
- `withCredentials: true`
- In-memory bearer token interceptor

All API client paths are defined relative to `/api/v1/`.

---

## Changes & Verification by File

### 1. `client/src/api/notificationApi.js`
- **Issue**:
  - In `streamNotifications`, the URL previously used:
    ```javascript
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
    return `${baseURL}/notifications/stream`;
    ```
    If `VITE_API_URL` was configured as the server origin without prefix (e.g., `http://localhost:5000`), the `/api/v1` route prefix was dropped, producing an incorrect endpoint `http://localhost:5000/notifications/stream`.
- **Change**:
  - Updated `streamNotifications` to explicitly return:
    ```javascript
    return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/notifications/stream`;
    ```
  - Standardized exported functions `getMyNotifications`, `markNotificationRead`, and `markAllRead` as primary named exports (targeting `/notifications`, `/notifications/:id/read`, and `/notifications/read-all`), while keeping backwards-compatible aliases (`fetchNotifications`, `markNotificationAsRead`, `markAllNotificationsAsRead`).

### 2. `client/src/api/expoApi.js`
- **Verification & Addition**:
  - Endpoints confirmed:
    - `fetchExpos` → `GET /expos`
    - `fetchExpoById` → `GET /expos/:id`
  - Added explicit alias exports `getExpos = fetchExpos` and `getExpoById = fetchExpoById` to support exhibitor browsing route signatures directly.

### 3. `client/src/api/exhibitorPortalApi.js`
- **Status**: Verified correct — all routes match backend expectations.
  - `getMyProfile` → `GET /exhibitors/me`
  - `createProfile` → `POST /exhibitors/me`
  - `updateProfile` → `PATCH /exhibitors/me`
  - `submitProfile` → `PATCH /exhibitors/me/submit`
  - `getMyBooths` → `GET /exhibitors/me/booths`
  - `getNeighbors` → `GET /exhibitors/me/neighbors`
  - `getDashboard` → `GET /exhibitors/me/dashboard` (with 404 fallback logic preserved)

### 4. `client/src/api/boothBrowseApi.js`
- **Status**: Verified correct — all routes match backend expectations.
  - `getExpoBooths` → `GET /expos/:expoId/booths`
  - `reserveBooth` → `POST /expos/:expoId/booths/:id/reserve`

### 5. `client/src/api/directoryApi.js`
- **Status**: Verified correct — all routes match backend expectations.
  - `getDirectory` → `GET /exhibitors/directory` (with query parameters passed in Axios `params` object)

### 6. `client/src/api/inquiryPortalApi.js`
- **Status**: Verified correct — all routes match backend expectations.
  - `sendInquiry` → `POST /inquiries`
  - `getMyInquiries` → `GET /inquiries/me`

---

## Exhibitor Portal Updates: 404 Graceful Handling & Profile State Guards

### 1. Fix 1: 404 Graceful Handling in `MyBoothsPage` & `NeighborsPage`
- **Problem**: When an exhibitor user accessed `MyBoothsPage` or `NeighborsPage` before creating an exhibitor profile, the backend returned HTTP 404 (`"Exhibitor profile not found"`), causing error toasts or broken UI states.
- **Solution**:
  - `client/src/pages/exhibitor/MyBoothsPage.jsx`: Catches HTTP 404 silently without showing an error toast. Renders an `EmptyState` informing the user that an exhibitor profile is required, with an action button navigating to `/exhibitor/profile`. Any non-404 error displays a toast as before.
  - `client/src/pages/exhibitor/NeighborsPage.jsx`: Catches HTTP 404 silently without showing an error toast. Renders an `EmptyState` explaining that neighbors appear after booth assignments in an expo. Any non-404 error displays a toast as before.

### 2. Fix 2: Profile State Guards (`useExhibitorStatus` & `ExhibitorGuard`)
- **Hook** (`client/src/hooks/useExhibitorStatus.js`):
  - Calls `getDashboard()` from `exhibitorPortalApi`.
  - Returns `onboardingComplete`, `approvalStatus`, and derived booleans:
    - `isSubmitted`: `onboardingComplete || approvalStatus === 'pending' || approvalStatus === 'approved'`
    - `isApproved`: `approvalStatus === 'approved'`
    - `isPending`: `approvalStatus === 'pending'`
    - `isRejected`: `approvalStatus === 'rejected'`
    - `isLoading`: status loading flag
  - Reuses short in-flight promises to deduplicate concurrent requests.
- **Guard Component** (`client/src/components/ExhibitorGuard.jsx`):
  - Accepts `requiresSubmitted` and `requiresApproval` props alongside `children`.
  - Shows `LoadingSpinner` while loading.
  - When access conditions are not met, displays an informative blocked card detailing the reason (profile incomplete, pending review, or rejected) and guides the user on the next action to take.
  - When conditions are met, renders `children`.
- **Page & Route Integration**:
  - `BrowseExposPage`: Wrapped with `<ExhibitorGuard requiresSubmitted>`
  - `ExhibitorDirectoryPage`: Wrapped with `<ExhibitorGuard requiresSubmitted>`
  - `BrowseBoothsPage`: Wrapped with `<ExhibitorGuard requiresSubmitted requiresApproval>`
  - `MyBoothsPage`: Wrapped with `<ExhibitorGuard requiresSubmitted requiresApproval>`
  - `NeighborsPage`: Wrapped with `<ExhibitorGuard requiresSubmitted requiresApproval>`
  - `App.jsx`: Updated routes for the above 5 pages to be wrapped with `ExhibitorGuard`.
  - `ExhibitorDashboardPage`: Remains unwrapped; displays three inline status banners using `useExhibitorStatus` (Profile Incomplete, Application Under Review, Application Requires Revisions). Shows no banner when approved.

### 3. First-Time Profile Submission "Profile not found" Fix
- **Problem**: When a new exhibitor filled in the profile form for the first time and clicked "Submit for Review" without clicking "Save Draft" first, `submitProfile` (`PATCH /exhibitors/me/submit`) was called. The backend queried `findOne({ userId })` and returned HTTP 404 (`"Profile not found"`), failing the submission.
- **Solution**:
  - `client/src/pages/exhibitor/ExhibitorProfilePage.jsx`: In `handleSubmitForReview`, checks if `!profile` and automatically invokes `createProfile(payload)` first before dispatching `submitProfile(payload)`.
  - `server/src/controllers/exhibitorProfile.controller.js`: In `submitProfile`, if `!profile`, automatically creates and submits the profile in a single atomic transaction with `onboardingComplete: true`, `approvalStatus: "pending"`, `submittedAt: new Date()`, and dispatches admin notifications.

