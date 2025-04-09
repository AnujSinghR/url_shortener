# URL Shortener Application

A modern URL shortening service built with React and Firebase, featuring user authentication, custom aliases, analytics tracking, and QR code generation.

## Features

- **URL Shortening**: Create shortened URLs instantly
- **Custom Aliases**: Set memorable custom aliases for your URLs
- **Analytics Dashboard**: Track clicks, devices, and browser statistics
- **QR Code Generation**: Automatically generate QR codes for shortened URLs
- **Link Expiration**: Set optional expiration dates for URLs
- **User Authentication**: Secure user accounts and URL management

## Tech Stack

- React.js for the frontend
- Firebase Authentication for user management
- Firebase Firestore for data storage
- TailwindCSS for styling
- Chart.js for analytics visualization
- React Router for navigation

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication (Email/Password) and Firestore
   - Create a `.env` file in the project root with your Firebase config:
     ```env
     REACT_APP_FIREBASE_API_KEY=your_api_key
     REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
     REACT_APP_FIREBASE_PROJECT_ID=your_project_id
     REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     REACT_APP_FIREBASE_APP_ID=your_app_id
     ```

4. Start the development server:
   ```bash
   npm start
   ```

## Usage

1. **User Registration/Login**:
   - Create an account or log in to access the dashboard
   - Manage your shortened URLs from a central location

2. **Creating Short URLs**:
   - Enter the long URL you want to shorten
   - Optionally set a custom alias
   - Set an expiration date if needed
   - Click "Create Short URL"

3. **Analytics**:
   - View click statistics in the dashboard
   - Track user devices and browsers
   - Monitor click trends over time
   - Access QR codes for each shortened URL

## Development

- Run tests: `npm test`
- Build for production: `npm run build`
- Format code: `npm run format`

## License

MIT License
