# Pro Task Manager (React Native CLI)

A modern, robust, and feature-rich To-Do list application built with **React Native CLI** and **TypeScript**. This project focuses on delivering a seamless user experience with interactive swipe gestures, dynamic theming, and local data persistence.

---

## Key Features

* **Dynamic Theming:** Smooth toggle between Light and Dark modes using React Context API.
* **Interactive Gestures (Swipeable):** Implemented `react-native-gesture-handler` for intuitive actions:
  * **Swipe Left:** Delete a task (triggers a native confirmation alert to prevent accidental deletions).
  * **Swipe Right:** Toggle task status between "Done" (Green) and "Undo" (Orange) with dynamic UI text updates.
* **Modern UI Components:**
  * **Floating Action Button (FAB)** for quick task creation.
  * **Interactive Bottom Sheet (Modal)** with a clean interface to input task details seamlessly.
* **Date Integration:** Built-in native Date Picker to assign deadlines to tasks using `react-native-date-picker`.
* **Local Persistence:** Tasks are securely saved directly on the device using `@react-native-async-storage/async-storage` (v1.23.1 for max stability), ensuring zero data loss upon closing the app.
* **Safe Area Handling:** Perfectly optimized for modern displays (notches, punch holes, dynamic islands) using `react-native-safe-area-context`.

---

## Tech Stack

* **Framework:** React Native CLI (Not Expo)
* **Language:** TypeScript
* **State Management:** React Hooks (`useState`, `useEffect`, `useContext`)
* **Local Storage:** AsyncStorage
* **Gestures & Animations:** React Native Gesture Handler
* **UI Utilities:** React Native Modal, Safe Area Context

---

## Project Structure

A clean, scalable architectural approach was used for this project:

```text
ToDo-App/
├── android/                    # Native Android project configuration
├── ios/                        # Native iOS project configuration (requires macOS)
├── src/                        # Main application source code
│   ├── constants/              
│   │   └── colors.ts           # Centralized theme colors (Light & Dark objects)
│   ├── screens/                
│   │   └── TodoScreen.tsx      # Main screen containing the list, logic, and Bottom Sheet
├── assets/                     
│   └── fonts/                  # Custom fonts directory (e.g., Poppins, Cairo)
├── App.tsx                     # Entry point (Wraps app in Gesture, SafeArea, and Theme Providers)
├── react-native.config.js      # Linking configuration for custom assets/fonts
├── package.json                # Project dependencies and scripts
└── README.md                   # Project documentation
```

## Screenshots


## About the Developer

Developed with ❤️ by Emad.
A Computer Engineering student passionate about building clean, high-performance mobile applications and exploring advanced Android development.
