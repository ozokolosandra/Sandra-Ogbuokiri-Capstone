# Project Title

## VibesRadar

## Overview


- VibesRadar is a mood journal app that helps users track their moods/feelings and provides uplifting messages to improve their state of mind. It also offers mood tracking over time, which can be useful for personal reflection or for therapists monitoring their patients' progress.

### Problem Space

- Primary Users;
  - Want to communicate their feelings.
  - Want to track their moods over time.
  - Seek tips to improve their emotional state.
- Therapists:
  - Need a safe space to track their patients' moods.
  - Want to analyze mood trends for better therapy outcomes.

### User Profile

- #### Users who are

  - looking for a ways to commuincate their feeling
  - looking to keep their feelings in check by tracking it
  - Get tips on how to feel better
  - Therapists looking for a safe space to track their patients feelings

### Features

- As a user, I want to be able to create an account so that I can access all the cool fetaures of VibesRadar.
- As a user, I want to be able to log in using my already created credentials, so that I can access the application.
- As a user, I want to be able to log my daily mood
- As a user, I want to receive a tip when I submit my mood daily
- As a user, I wnat to be able to go back and edit my profile .
- As a user, I want to view a report of my entry over time
- As a user, I want to be able to download the report of mood summary over time.

## Implementation

### Tech Stack

- React
- JavaScript
- MySQL
- Nodejs


  - Client libraries:
    - react
    - react-router
    - axios
    - Email-Validator
    - react chart js 2
    - bootstrap
  - Server libraries:
    - knex
    - express
    - bcrypt for password hashing
  

### APIs

 - Hugging Face API

### Sitemap


- Register
- Login
- Home
- Report
- Profile
- History

### Mockups

Provide visuals of your app's screens. You can use pictures of hand-drawn sketches, or wireframing tools like Figma.

![Register Page](client/src/assets/mockups/Register%20Page.png)


![Login Page](client/src/assets/mockups/Login%20Page.png)

![Report Page](client/src/assets/mockups/Reports%20Page.png)

![Home Page](client/src/assets/mockups/Home%20Page.png)

### Data

Describe your data and the relationships between the data points. You can show this visually using diagrams, or write it out.

![Users ](client/src/assets/mockups/image-1.png)

![Mood](client/src/assets/mockups/image-2.png)

![Uplifitng messages](client/src/assets/mockups/image-3.png)

![Reports](client/src/assets/mockups/image-4.png)

### Endpoints

Authentication:

- POST /register: Register a new user.

    - Response body {
      "message": "User registered successfully!",
      "user_id": 1

      }

- GET /login: Log in an existing user.

  - Response {

    "message": "Login successful!",

    "token": "jwt_token_here"

  }

- GET /history – Retrieves all the latest mood entry and uplifting message for the logged-in user.

  - Response {
          "username": "john_doe",
          "mood_category": "Happy",
          "upliftingMessage": "Keep shining! You're doing amazing!"

          }

- POST /mood – Saves the user's mood entry and returns an uplifting message.


    - Response {

    "message": "Mood logged successfully!",

    "mood": "Sad",

    "upliftingMessage": "You're not alone. Take a deep breath and take one step at a time."

    }

- GET /report Fetches all past mood entries for the logged-in user.
- - {

  "user": "john_doe",

  "moodHistory": [

  {

      "date": "2025-03-01",

      "mood": "Happy",

      "mood_text": "Had a great day!"

  },

  {

      "date": "2025-03-02",

      "mood": "Sad",

      "mood_text": "Feeling down today."

  }

  



## Roadmap



**Backend Setup**

Day 1-2

- Initialize **Node.js & Express**
- Set up **database schema** (users, mood entries)
- Create **mood logging API** (`POST /mood`)

  **Frontend Setup**

- Initialize **React App**
- Set up **React Router** (Register, Login, Home, Reports)
- Build **basic Home Page UI**

---

**Backend: Implement reports functionality**

Day 3-5

- Create **GET `/report`** to fetch past mood entries and also download report.

- **Update `POST /mood`** to allow users to select a **specific date** instead of only logging today's date

  **Frontend: Build the Reports Page & Calendar Feature**

- Display **past mood entries** in a table/list
- Add **calendar component** where users can **select a date** and log their mood for that day
- Implement a **Download Report** button

  **Test calendar functionality**

- Ensure moods are being **logged for the correct date**

---

**Backend: Integrate Sentiment Analysis**

Day 5-8

- Use `Hugging face Transformer for entiment classification` 
- Modify **`POST /mood`** to analyze mood text and categorize sentiment
- Store sentiment score in the database
- Show **mood category** (Happy, Sad, Frustrated, etc.)
- Display **uplifting message based on mood**

---

**Improve Overall UI/UX**

Day 9

- Enhance **Home & Reports page design**
- Make calendar & mood logging more **user-friendly**

  **Test Core Functionality**

- Ensure users can **log moods & view history**
- Fix any **bugs in sentiment analysis**

---

Test **all features**



---

Future Implementations 🌱

- Ability to have tags such as work , relationship and have user chooser between any or all of this in order to track down which of these affects their vibes  heavily.
- Forgot password functionality in the Login Page
- Additional Page for psychologists to register and view reports of their patients.
- Embed google calendars to remind users to log their mood journal for the day.
- Deploy as a mobile App
- Add Google OAuth Login
- Add a streak based rewarding functionality
- Add functionality that can read vibes from live camera or photo uploads
- add ability for user to use emojis and or texts to describe how they are feeling
- Add emojis to the uplifing messages retrieved from the databse;
- AI Recommendations - Use advanced models for mood suggestion

