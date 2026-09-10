# Cognitive Care Platform

A web-based cognitive care platform designed to support dementia patients through **cognitive games, progress tracking, reminders, and caregiver monitoring**.

## 1. Project Information

* **Project Title:** Cognitive Care Platform
* **Category:** Software

## 2. Problem Statement

Dementia patients may face difficulties with memory, attention, cognitive skills, and maintaining regular daily routines. Caregivers also need a simple way to monitor cognitive activity and keep track of important reminders.

The project aims to provide a user-friendly digital platform that combines **cognitive games, progress analysis, reminders, and caregiver support** in one system.

## 3. Proposed Solution

The Cognitive Care Platform provides a web-based interface for patients and caregivers.

Patients can interact with cognitive games designed to provide engaging mental activities. After completing a game, relevant game results can be processed and displayed through the web dashboard.

The platform also provides features such as:

* Cognitive game interaction
* Game performance analysis
* Progress tracking
* Medication/reminder management
* Memory/photo gallery
* Separate patient and caregiver experiences
* Dementia-friendly user interface

The system is designed with a focus on **simplicity, readability, predictability, and low cognitive load** for patients.

## 4. Key Features

### Patient Side

* Patient login
* Dementia-friendly dashboard
* Cognitive games
* Game result and performance analysis
* Progress tracking
* Reminders
* Medication-related reminders
* Memory/photo gallery
* Simple navigation and large, readable UI elements

### Caregiver Side

* Caregiver dashboard
* Patient-related information
* Monitoring of patient progress
* Reminder management
* Viewing cognitive game performance
* Access to relevant patient information

### Cognitive Game System

* Web-based Godot cognitive games
* Game results generated after gameplay
* Communication between the game and the main platform
* Game performance data used for analysis

## 5. Technology Stack

* **Frontend:** React
* **Backend:** Python, Flask
* **Database:** MongoDB
* **Game Engine:** Godot


## 6. Architecture

The main application is built around a **React frontend and Flask backend**, with MongoDB used for data storage.

Godot is maintained as an independent game application and can be integrated into the React application when required.

```text
                         COGNITIVE CARE PLATFORM
                                  |
                 +----------------+----------------+
                 |                                 |
                 v                                 v
           React Frontend                    Godot Game
                 |                         (Independent)
                 |                                 |
                 v                                 |
           Flask Backend <-------------------------+
                 |
        +--------+--------+
        |                 |
        v                 v
     MongoDB          AI / Analysis (in future)
        |                 |
        +--------+--------+
                 |
                 v
          Progress / Results
                 |
                 v
        Patient / Caregiver
            Dashboard
```

### Game Communication Flow

```text
Patient
   |
   v
React Application
   |
   v
Godot Cognitive Game
   |
   v
Game Completion
   |
   v
Game Results
   |
   v
Flask API
   |
   v
Database / Analysis
   |
   v
React Dashboard
   |
   v
Performance & Progress
```

## 7. Repository Structure

```text
COGNITIVE-CARE-PLATFORM/
│
├── README.md
├── SUBMISSION_GUIDE.md
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── database/
│   │   └── ...
│   ├── requirements.txt
│   └── ...
│
├── frontend/
│   └── ...
│
├── docs/
│   └── ...
│
├── assets/
│   └── screenshots/
│
├── submission/
│   ├── PRESENTATION.md
│   └── DEMO.md
│
├── .gitignore
└── LICENSE
```

### What goes where?

| Item                     | Location              |
| ------------------------ | --------------------- |
| Backend source code      | `backend/`            |
| React frontend           | `frontend/`           |
| Screenshots              | `assets/screenshots/` |
| Technical documentation  | `docs/`               |
| Final presentation       | `submission/`         |
| Demo video link          | `submission/DEMO.md`  |
| Project overview         | `README.md`           |

The Godot game is maintained separately and integrated with the main application through the defined communication flow.

## 8. Final Presentation

The final SIH presentation can be kept inside the repository under:

```text
submission/PRESENTATION.md
```


## 9. Demo Video

A demo video can be added to:

```text
submission/DEMO.md
```

## 10. Screenshots / Prototype

Important screenshots of the application can be stored in:

```text
assets/screenshots/
```

Recommended screenshots include:

* Patient dashboard
* Caregiver dashboard
* Cognitive game
* Game analysis/results
* Reminder interface
* Memory/photo gallery
* Login interface

## 11. Installation

Clone the repository:

```bash
git clone <YOUR_REPOSITORY_URL>
cd <YOUR_PROJECT_FOLDER>
```

### Backend

Create and activate a Python virtual environment:

```bash
python -m venv venv
```

Windows:

```bash
venv\Scripts\activate
```

Install backend dependencies:

```bash
pip install -r backend/requirements.txt
```

### Frontend

Go to the frontend directory and install dependencies:

```bash
cd frontend
npm install
```

## 12. Run

### Backend

Run the Flask backend using the project's configured Flask entry point.

### Frontend

From the frontend directory:

```bash
npm run dev
```

The React application communicates with the Flask backend through APIs.

## 13. Future Scope

Possible future improvements include:

* More cognitive games
* Adaptive difficulty based on patient performance
* Improved AI-based cognitive analysis
* More detailed caregiver analytics
* Personalized cognitive activity recommendations
* Voice guidance for patients
* Additional accessibility features
* Long-term cognitive progress tracking
* Ai Analysis 
* Better integration between game performance and patient progress

