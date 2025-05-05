# PR Party Invitation Deployment Guide

## Project Overview
This is a modern, mobile-friendly event invitation platform for Mrs. Tejinder Kaur Mundra's Permanent Residency celebration. It provides an intuitive and engaging guest experience with local data storage and admin management.

## Key Features
- React-based frontend with Tailwind CSS styling
- Mobile-first responsive design
- localStorage for data persistence (RSVP and memories)
- Memory viewing with inclusive prompt rather than password
- Admin dashboard (password: 98760)
- Gamified participation badges

## Deployment Instructions

### Option 1: Downloading from Replit
1. In the Replit interface, click on the three dots (...) in the Files panel
2. Select "Download as zip" option
3. Extract the zip file on your local machine

### Option 2: Manual Deployment

#### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

#### Steps
1. Clone or download all the project files to your local machine
2. Install dependencies:
   ```
   npm install
   ```
3. Build the application:
   ```
   npm run build
   ```
4. Start the server:
   ```
   npm start
   ```

### Deploying to Other Platforms

#### Netlify
1. Create a new site in Netlify
2. Connect to your GitHub repository (if using GitHub) or upload the build folder
3. Set build command: `npm run build`
4. Set publish directory: `dist`

#### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in your project directory
3. Follow the prompts

#### GitHub Pages
1. Add homepage to package.json: `"homepage": "https://yourusername.github.io/repository-name"`
2. Add deploy scripts to package.json:
   ```
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```
3. Install gh-pages: `npm install --save-dev gh-pages`
4. Deploy: `npm run deploy`

## Important Notes for Deployment
1. The application uses client-side storage (localStorage) for data persistence, so no database setup is required.
2. For proper functionality, ensure that the site is served over HTTPS.
3. The admin dashboard is protected with the password "98760".

## Customization
- Event details can be modified in the respective component files
- Styling and theme colors can be adjusted in the Tailwind configuration
- Badge types and designs can be modified in the RSVPForm component

## Support
For any issues with deployment or customization, please contact the original developer.
