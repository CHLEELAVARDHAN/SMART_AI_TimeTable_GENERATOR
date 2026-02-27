# Smart Faculty Timetable Generator

An intelligent, AI-powered academic scheduling system built with React, TypeScript, and Tailwind CSS. This tool automates the creation of conflict-free timetables for educational institutions, ensuring optimal resource utilization and faculty workload balance.

## 🚀 Features

### 🧠 Intelligent Scheduling Engine
- **Balanced Distribution**: Automatically spreads subjects across the week, aiming for at least one session per day for every subject.
- **Emergency Syllabus Mode**: Allows subjects to exceed 2 periods per day if necessary to meet high weekly hour requirements.
- **Lab Continuity**: Automatically schedules labs in 3-hour continuous blocks.
- **One-Lab-Per-Day Limit**: Ensures students and facilities are not overloaded by restricting labs to one session per day.

### 📅 Special Period Handling
- **Afternoon Slots**: Sports, Mentor, and Library periods are restricted to the 3:00 PM - 4:00 PM slot.
- **Combined Library/Mentor**: Automatically merges Library and Mentor sessions into a single "LIBRARY/MENTOR" slot on one day.
- **Weekly Frequency**: Special periods are limited to two days per week total, with no internal repetition.

### 🛡️ Conflict Prevention
- **Global Faculty Tracker**: Prevents double-booking faculty members across different sections or departments.
- **Room Management**: Tracks room assignments to avoid physical space clashes.

### 📄 Professional Export & UI
- **Glassmorphism Design**: Modern, semi-transparent UI with backdrop blur effects for a premium look.
- **Dynamic Glow Heading**: A massive, stacked "FACULTY TIMETABLE GENERATOR" title with a continuous, staggered letter-glow animation.
- **Rainbow Effects**: Subtle rainbow text gradients and hover glows on primary action buttons.
- **Pill-Shaped Time Picker**: Sleek, rounded time input fields and period containers for a tactile user experience.
- **Multi-Format Export**: Export your generated timetables as **PDF**, **DOCX (Word)**, or print them directly.
- **Signature Blocks**: Professional gaps for Timetable Coordinator, HOD, and Principal signatures.
- **Social Integration**: Footer includes updated 2026 copyright and interactive social icons (Instagram, Facebook, Mail).
- **Responsive Dashboard**: Support for single and batch timetable generation across all devices.

## 🛠️ Tech Stack
- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS 4.0
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **PDF Generation**: jsPDF, jsPDF-AutoTable
- **Word Generation**: docx, file-saver
- **Form Handling**: React Hook Form

## 💻 Local Setup (VS Code)

### Prerequisites
- **Node.js**: [Download and install Node.js](https://nodejs.org/) (LTS version recommended).
- **VS Code**: [Download and install Visual Studio Code](https://code.visualstudio.com/).

### Installation Steps
1. **Open Project**: Open the project folder in VS Code.
2. **Open Terminal**: Press ``Ctrl + ` `` (backtick) to open the integrated terminal.
3. **Install Dependencies**:
   ```bash
   npm install
   ```
4. **Start Development Server**:
   ```bash
   npm run dev
   ```
5. **Access the App**: Open your browser and navigate to `http://localhost:3000`.

## 📂 Project Structure
- `/src/components`: Reusable UI components (Forms, Displays).
- `/src/utils`: The core `Scheduler` logic and utility functions.
- `/src/types.ts`: TypeScript interfaces for the entire application.
- `/src/constants.ts`: Default timings and day configurations.

## 📄 License
MIT License - Feel free to use and modify for your institution.
