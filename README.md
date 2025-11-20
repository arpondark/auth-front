# FullStackAuth Frontend

A beautiful, dark-mode enabled authentication frontend built with React, TypeScript, Tailwind CSS, and Framer Motion.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create or update `.env` file:

```env
VITE_API_URL=http://localhost:8080/api/v1
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 4. Build for Production

```bash
npm run build
```

## 📋 Prerequisites

- Node.js 18+
- Backend API running on `http://localhost:8080` (or update `.env`)

## 🔧 Environment Variables

### Frontend (.env)

```env
VITE_API_URL=http://localhost:8080/api/v1
```

This is where the frontend sends API requests (login, register, etc.)

### Backend (application.properties)

```properties
app.url=http://localhost:5173
```

This is where email links redirect users (verification, password reset)

**Important:** The backend `app.url` should point to your **frontend** URL!

## ✨ Features

- ✅ User Registration with Email Verification
- ✅ Login with JWT Authentication
- ✅ Password Reset Flow
- ✅ Protected Routes (Dashboard)
- ✅ Profile Management
- ✅ Dark Mode Toggle
- ✅ Smooth Animations
- ✅ Responsive Design
- ✅ Toast Notifications
- ✅ Form Validation

## 📁 Project Structure

```
src/
├── components/ui/     # Reusable UI components
├── pages/            # Page components
├── lib/              # Utility functions
├── api.ts            # API client
├── config.ts         # Environment config
└── App.tsx           # Routes
```

## 🎨 Tech Stack

- **React 19** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Routing
- **React Hot Toast** - Notifications

## 📖 API Integration

The frontend connects to the backend API defined in `VITE_API_URL`. All API functions are in `src/api.ts`:

- `login(email, password)` - User login
- `register(name, email, password)` - User registration
- `verifyEmail(token)` - Email verification
- `resendVerification(email)` - Resend verification email
- `requestPasswordReset(email)` - Request password reset
- `resetPassword(token, newPassword)` - Reset password
- `getProfile()` - Get user profile
- `updateProfile(data)` - Update user profile

## 🧪 Testing

1. **Register**: Go to `/register` and create an account
2. **Verify**: Check backend logs for verification token, visit `/api/auth/verify?token=<TOKEN>`
3. **Login**: Go to `/login` and sign in
4. **Dashboard**: View and edit your profile
5. **Reset Password**: Use "Forgot password?" link

## 🌐 Production Deployment

1. Update `.env` with production backend URL:

   ```env
   VITE_API_URL=https://api.yourdomain.com/api/v1
   ```

2. Build the app:

   ```bash
   npm run build
   ```

3. Deploy the `dist/` folder to:

   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - Any static hosting service

4. Update backend `app.url` to your frontend URL

## 📝 License

This project is part of the FullStackAuth system.

---

**Created with ❤️ using React + Tailwind CSS**
