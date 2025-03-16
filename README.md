# Pratishruti-Backend

## Overview
This is the backend system for **Pratishruti**, the annual college fest, designed to handle **CRUD operations** for the **Admin Dashboard**. It provides a structured and efficient way to manage festival-related data, including events, logs, and admin accounts.

## Tech Stack
- **Node.js** – JavaScript runtime environment  
- **Express.js** – Backend framework for building REST APIs  
- **MongoDB** – NoSQL database for structured data storage  
- **Mongoose** – ODM (Object Data Modeling) library for MongoDB  
- **Multer** – Middleware for handling multipart form data (file uploads)  
- **Imgur API** – Cloud-based image hosting and retrieval   
- **dotenv** – Environment variables for API keys and database credentials  
- **Render** – Used for deployment  

## Deployment
The backend is deployed on **Render** and can be accessed at: [Pratishruti Backend](https://pratishruti-backend.onrender.com/)

## Key Features

### 1. Admin Sign-In & Authentication
- Created a **secure sign-in feature** for the **Admin Dashboard** using username and password.  

### 2. CRUD Operations for Admin Dashboard
- Allows authorized admins to **create, read, update, and delete** event details, logs, and admin accounts.  
- Ensures **secure access** to sensitive operations with authentication and role-based permissions.

### 3. Image Handling and Storage
- Handles **file uploads** using `multer`, supporting **multipart form data**.  
- The uploaded image is **read using `fs.readFileSync()`**, converted into **Base-64 format**, and then **uploaded to Imgur via API**.  
- The API response provides an **image URL**, which is stored in the MongoDB database for future reference.

### 4. Database Structure
- **Admins Collection** – Stores admin user details, hashed passwords, and authentication tokens.  
- **Events Collection** – Maintains structured event data for easy management.  
- **Logs Collection** – Records all admin actions for monitoring and security.

### 5. Middleware & Security Enhancements
- Implemented **request validation** and **error handling** for API robustness.  
- Used **environment variables** (`dotenv`) to securely store API keys and database credentials.  

### 6. API Endpoints
The backend exposes **RESTful API endpoints** to interact with the database and perform CRUD operations efficiently.

---

💡 **Contributions & Issues**  
Feel free to raise an **issue** or **pull request** if you find any bugs or want to improve functionality.

🚀 **Happy Coding!**

⚠ **Disclaimer:** When using the **Imgur API**, ensure that you comply with [Imgur's API Terms of Service](https://apidocs.imgur.com/) to avoid any violations or restrictions.

