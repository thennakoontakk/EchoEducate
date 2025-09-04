# EchoEducate

EchoEducate is an educational platform for exams and question management. This application allows administrators to create and manage question papers, while students can take exams with features like voice input and paper selection.

## Project Structure

The project consists of two main parts:

- **Backend**: Node.js/Express API with MongoDB database
- **Frontend**: React application

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

## Installation and Setup

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with the following content:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
   Replace `your_mongodb_connection_string` with your MongoDB connection string and `your_jwt_secret_key` with a secure random string.

4. Start the backend server:
   ```
   npm start
   ```
   The server will run on http://localhost:5000 by default.

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm start
   ```
   The application will open in your default browser at http://localhost:3000.

## Features

### Admin Features

- User management
- Question creation and management
- Paper creation and management
- View student answers and results

### Student Features

- Take exams with paper selection
- Voice input for answers
- Navigation between questions
- Submit answers and track progress

## Default Login Credentials

### Admin
- Email: admin@example.com
- Password: admin123

### Student
- Email: student@example.com
- Password: student123

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

### Frontend
- React
- React Router
- CSS Modules
- Web Speech API (for voice recognition)

## License

This project is licensed under the MIT License.