Image Tree Application
A full-stack application that allows users to search and navigate through an image tree structure. The backend is built with Express and TypeScript, utilizing a SQLite database, while the frontend is developed with React.

Table of Contents
Features
Prerequisites
Setup Instructions
Clone the Repository
Backend Setup
Frontend Setup
Running the Application
Start the Backend
Start the Frontend
Scripts
Troubleshooting
License
Features
Search Functionality: Real-time search with suggestions.
Tree Navigation: Seamlessly navigate through hierarchical image nodes.
Optimized Backend: Efficient handling of large datasets with pagination and optimized SQL queries.
Responsive UI: User-friendly interface with responsive design for various devices.
Prerequisites
Ensure you have the following installed on your local machine:

Node.js (v14 or later)
npm (comes with Node.js)
Git
SQLite3 (optional, for database inspection)
Setup Instructions
Clone the Repository
bash
Kopírovať kód
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
Backend Setup
Navigate to the Backend Directory:

cd backend
Install Dependencies:

npm install
Initialize the Database:

npm run init-db
Note: This script will create the necessary tables and seed initial data into the SQLite database.

Frontend Setup
Navigate to the Frontend Directory:

cd ../frontend
Install Dependencies:

npm install
Running the Application
Start the Backend
Navigate to the Backend Directory:

cd backend
Start the Server:

npm start
The backend server will start and listen on the port specified in your configuration (default: 3000).
Start the Frontend
Navigate to the Frontend Directory:

cd ../frontend
Start the Development Server:

npm start
The frontend application will start and typically be accessible at http://localhost:5173.
