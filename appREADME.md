# Direction

**Direction** is a modern web app designed to simplify clinic workflow for doctors and receptionists. It streamlines patient management, from queue handling to consultation tracking, making your clinic operations efficient and organized.

---

## Features

### For Receptionists
- Add new patients with details: name, phone, age, gender, address, notes, and optional bill.
- Automatically generate date-based incremental tokens for patients.
- View patient queue in real-time.
- Edit patient details anytime.
- Mark patients as completed.
- Search and filter patients by name, phone, or status.
- Expand patient cards to see full details without leaving the page.

### For Doctors
- View waiting and completed patients in separate sections.
- Click on a patient to see full details.
- Write and save prescriptions.
- View patient history (past prescriptions, notes, symptoms).
- Smooth UI with modern card layouts and animations.

---

## Technologies Used
- **Frontend:** React, Tailwind CSS, Framer Motion
- **Backend:** Firebase (Authentication & Firestore)
- **Routing:** React Router DOM


---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Aditi0128/clinic-management-app.git
cd clinic-management-app
Install dependencies:

bash
Copy code
npm install
Set up Firebase:

Create a Firebase project.

Enable Authentication and Firestore.

Replace your Firebase config in src/lib/firebase.js.

Start the development server:

bash
Copy code
npm start
The app should now be running at http://localhost:3000.

Folder Structure
bash
Copy code

DIRECTIONAPP
└── Direction
    ├── node_modules
    ├── public
    └── src
        ├── assets
        ├── components
        │   ├── Modal.jsx
        │   └── Navbar.jsx
        ├── lib
        │   └── utils
        │       ├── firestoreHelpers.js
        │       ├── Logger.js
        │       └── firebase.js
        ├── pages
        │   ├── Doctor.jsx
        │   ├── land.jsx
        │   ├── Login.jsx
        │   └── Receptionist.jsx
        ├── styles
        │   ├── index.css
        │   └── App.css
        ├── App.js
        └── main.jsx
.gitignore
clinic.gif
eslint.config.js
index.html
medical-cross.gif
package-lock.json
package.json
postcss.config.js
tailwindcss.config.js
vite.conig.js
README.md

Usage
Open the app and choose your role: Receptionist or Doctor.

Receptionist can add patients, manage queue, and mark completion.

Doctor can view patient details, write prescriptions, and track patient history.

License
This project is open-source and free to use.
