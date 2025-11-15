# Project Blueprint: AI-Powered PDF & Image Tool Suite

## 1. Overview

This document outlines the development plan for a modern, full-featured PDF and image manipulation application. The goal is to create a beautiful, intuitive, and powerful tool that leverages a React frontend and a robust Firebase backend. The AI assistant will drive the development process, from UI design to backend integration.

## 2. Design & Style Guide

The application will adhere to the highest standards of modern web design, focusing on a clean, responsive, and engaging user experience.

*   **Aesthetics:** The UI will be visually balanced with clean spacing, vibrant colors, and polished styles.
*   **Typography:** We will use expressive fonts with clear hierarchies (e.g., for hero text, headlines, and body content) to enhance readability.
*   **Iconography:** Icons will be colorful and meaningful, enhancing user understanding and navigation, as implemented in the main navigation dropdown.
*   **Interactivity:** All interactive elements (buttons, menus, etc.) will provide clear visual feedback, including hover effects and subtle animations, to create a "glow" and a tactile feel.
*   **Component Library:** The project currently uses `rsuite`. We will continue to leverage this library and may introduce others like `MUI` or `Shadcn/ui` if specific needs arise.

## 3. Implemented Features

*   **Responsive Header:** A fully responsive navigation bar.
*   **Interactive Tool Menu:** A hover-triggered dropdown menu for "ALL PDF TOOLS" and "ALL IMAGE TOOLS" that features:
    *   Dynamic, content-based width with horizontal scrolling for smaller screens.
    *   Vibrantly colored icons for each tool, matching the provided design.
    *   Hover highlighting, click animations, and persistent highlighting for the active tool.
*   **Firebase Integration:** The project is now connected to a Firebase backend.
*   **Dynamic Dashboard:** The dashboard dynamically renders all tool categories and their tools from a centralized data source.
*   **Reusable Tool Cards:** The `ToolCard` component displays each tool in a clean, clickable card.
*   **Search Functionality:** A search bar allows users to easily find the specific tool they need.
*   **Improved Styling:** The dashboard has a fresh, modern look with a grid-based layout.
*   **Extract Pages Feature:**
    *   Created the `ExtractPages.jsx` component.
    *   Added a route for the new page in `src/router/index.jsx`.
    *   Added a tool card to the dashboard for easy navigation.
*   **Organize PDF Feature:**
    *   Created the `OrganizePdf.jsx` component.
    *   Added a route for the new page in `src/router/index.jsx`.
    *   Added a tool card to the dashboard for easy navigation.
*   **Bug Fixes:**
    *   Resolved `SyntaxError: Unexpected token '<'` by renaming `tools.js` to `tools.jsx` and updating imports.
    *   Fixed invisible card headings by adjusting CSS.
    *   Implemented active tool highlighting in the dropdown menu.

## 4. Development Plan

The next phase is to build out the backend functionality using Firebase and connect it to the frontend.

### Step 1: Firebase Initialization (Completed)
- **Summary:**
    - Logged into Firebase.
    - Selected the `project1-3d56e` Firebase project.
    - Retrieved the Firebase SDK configuration.
    - Created `src/firebase.js` to initialize the Firebase app.
    - Imported the Firebase configuration into the main application entry point (`src/main.jsx`).


### Step 2: User Authentication (Current Step)
- **Goal:** Allow users to sign up and log in to their accounts.
- **Services:** Firebase Authentication.
- **Implementation:**
    - Create dedicated sign-up and login pages.
    - Implement email/password and social (e.g., Google) authentication flows.
    - Update the UI to show the user's status (logged in/out).

### Step 3: File Management
- **Goal:** Enable users to upload, store, and manage their PDF files.
- **Services:** Cloud Storage for Firebase.
- **Implementation:**
    - Build a file upload component on the main page.
    - Create a user-specific dashboard to view and manage uploaded files.
    - Implement secure access rules so users can only see their own files.

### Step 4: PDF Processing with Serverless Functions
- **Goal:** Execute the core PDF manipulation tasks (merge, compress, etc.).
- **Services:** Cloud Functions for Firebase.
- **Implementation:**
    - For each tool (e.g., "Merge PDF"), create a Cloud Function that performs the backend processing.
    - The frontend will call these functions and provide feedback on the job status (e.g., "processing," "complete

### Step 5: Data Persistence
- **Goal:** Store user data and information about their PDF jobs.
- **Services:** Cloud Firestore (or Realtime Database).
- **Implementation:**
    - Create a database structure to store user profiles and file metadata.
    - Implement security rules to protect user data.
