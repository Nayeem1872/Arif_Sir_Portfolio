# API Integration Guide

## Overview

This project integrates with a backend API for authentication. The API endpoints are configured to work with `http://localhost:8000/api`.

## Features Implemented

### 1. Authentication System

- **Signup**: Creates new user accounts with username, email, and password
- **Signin**: Authenticates existing users
- **Token Management**: Handles JWT tokens in localStorage and cookies
- **Protected Routes**: Automatically redirects unauthenticated users

### 2. API Client Configuration

- Base URL: `http://localhost:8000/api`
- Automatic token injection in request headers
- Response interceptor for handling 401 errors
- Error handling with user-friendly messages

### 3. Components Updated

- `AuthForm`: Now integrates with real API endpoints
- `DashboardHeader`: Shows user info and logout functionality
- `ProtectedRoute`: Wraps dashboard to ensure authentication
- `DashboardLayout`: Uses protected route wrapper

### 4. Error Handling

- Validation errors from API are displayed to users
- Network errors show generic error messages
- Automatic token cleanup on authentication failures

## Usage

### Starting the Backend

Make sure your backend API is running on `http://localhost:8000` before testing the authentication.

### Testing Authentication

1. Navigate to `/signin`
2. Try signing up with a new account
3. Test signin with existing credentials
4. Verify protected routes redirect to signin when not authenticated
5. Test logout functionality from dashboard header

### API Endpoints Used

- `POST /auth/signup` - User registration
- `POST /auth/login` - User authentication

## Files Created/Modified

- `lib/api/client.ts` - Axios client configuration
- `lib/api/auth.ts` - Authentication API functions and token management
- `hooks/use-auth.ts` - Custom hook for authentication logic
- `components/auth/protected-route.tsx` - Route protection component
- `middleware.ts` - Next.js middleware for route protection
- `features/auth/components/auth-form.tsx` - Updated with API integration
- `features/dashboard/components/header.tsx` - Added user info and logout
- `app/(dashboard)/layout.tsx` - Added protected route wrapper

## Environment Variables

If you need to change the API base URL, update the `API_BASE_URL` constant in `lib/api/client.ts`.
