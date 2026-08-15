# Requirements Document

## 1. Application Overview

### 1.1 Application Name
Smart College Timetable Generator

### 1.2 Application Description
A responsive web application that enables colleges to automatically generate optimized timetables using intelligent scheduling algorithms. Users can create free accounts to manage their timetables. Administrators can input subjects, faculty names, sections, and constraints to generate timetables. The system manages multiple sections (A through I and beyond), prevents teacher clashes, classroom overlaps, and subject timing conflicts, while optimizing resource utilization across classrooms, faculty availability, and lab timings. Generated timetables can be edited after creation. The default administrator credentials are username: aishwarya2007ps and password: Rekhashankar45$.

---

## 2. Global Background Visual

**Purpose:** Apply an immersive animated background across all pages of the website to enhance visual appeal.

**Background Description:**
  - A full-screen animated background featuring a global world map rendered using dots and connecting lines
  - Visual elements include:
    - Dot-based world map: the continents and landmasses are represented by clusters of animated dots
    - Connecting lines: animated lines linking dots across the globe to simulate a network or data-flow effect
    - Global wireframe polygonal lines: geometric polygon mesh overlaid on the globe surface to create a futuristic wireframe appearance
    - The overall effect resembles a 4K-quality stock video of a rotating or pulsing dot-globe with interconnected wireframe lines
  - The background must be rendered in real-time using a canvas or WebGL-based approach (no actual video file required)
  - Color palette: dark background (deep navy or black) with bright accent dots and lines (white, cyan, or light blue) to ensure contrast and readability
  - The animation should be subtle and non-distracting — slow rotation or gentle pulsing is preferred
  - All foreground content (text, forms, tables, navigation) must remain fully legible against the animated background
  - The background applies globally to all pages: Homepage, Login, Sign Up, Timetable Generator, View Timetable, and About Project

---

## 3. Pages and Features

### 3.1 Homepage

**Purpose:** Entry point of the application, providing an overview and navigation.

**Content:**
  - Display the project title: Smart College Timetable Generator
  - Show a brief system description highlighting automation and intelligent scheduling capabilities
  - Navigation menu with links to:
    - Home
    - Create Timetable
    - View Timetable
    - About Project
    - Sign Up
    - Login

---

### 3.2 Sign Up Page

**Purpose:** Allow new users to create free accounts.

**Features:**
  - Registration form with the following fields:
    - Username
    - Password
    - Confirm Password
    - Email address
  - Sign Up button to create the account
  - Link to Login page for existing users
  - All registered accounts are stored in the database
  - After successful registration, redirect user to Login page

---

### 3.3 Login Page

**Purpose:** Authenticate users before granting access to administrative functions.

**Features:**
  - Login form with username and password input fields
  - Default admin credentials visibly displayed on the login page for reference:
    - Username: aishwarya2007ps
    - Password: Rekhashankar45$
  - All registered users can log in with their respective credentials
  - Link to Sign Up page for new users
  - Guest/public access: Users may browse view-only pages without logging in; login is required only for administrative operations

---

### 3.4 Timetable Generator Page

**Purpose:** Allow administrators to configure inputs and generate timetables.

#### 3.4.1 Manual Input Configuration
  - Section selector: Dropdown to choose a section (A, B, C, D, E, F, G, H, I, etc.)
  - Subject name input field
  - Teacher name input field
  - Day selector: Dropdown for Monday through Saturday
  - Time slot input with dual mode:
    - Dropdown for predefined time slots
    - Manual text input for custom time entry
  - Add button to insert entries into the timetable grid

#### 3.4.2 Settings Configuration
  - Editable number of subjects
  - Editable number of time slots
  - Editable number of sections
  - Constraint settings:
    - Teacher availability windows
    - Classroom capacity and availability
    - Lab timing requirements
    - Subject-specific constraints

#### 3.4.3 Timetable Display
  - Table format:
    - Rows represent time slots
    - Columns represent days (Monday to Saturday)
    - Each cell displays subject name, teacher name, and section
  - Section-wise view: Toggle between different sections
  - Conflict indicators: Visual color-coded alerts for scheduling conflicts

---

### 3.5 Intelligent Timetable Generation

**Purpose:** Automate the creation of optimized, conflict-free timetables.

**Features:**
  - Teacher-Subject Assignment Configuration:
    - Before generating the timetable, users must define which teacher teaches which subject
    - Input interface to add teacher name and their corresponding subject(s)
    - Display a list of all teacher-subject pairs configured by the user
    - The auto-generator uses only these predefined teacher-subject assignments and does not assign teachers to subjects independently
  - Weekly Hours Configuration:
    - For each teacher-subject pair, users must specify the number of hours per week that teacher should teach that subject
    - Input field to enter weekly hours (numeric value)
    - This configuration allows different subjects to have different weekly hour requirements
    - The auto-generator distributes the specified weekly hours across the timetable while respecting all constraints
    - Display the weekly hours alongside each teacher-subject pair in the configuration list
  - Time Slot Configuration:
    - Users can manually define custom time slots for the timetable
    - Input interface to add start time and end time for each slot
    - Users can specify the number of time slots needed
    - All manually entered time slots are used by the auto-generator
  - Break Configuration:
    - Users can specify the number of breaks in the timetable
    - Input interface to define break timing (start time and end time)
    - Breaks are inserted into the timetable at the specified positions
    - The auto-generator respects break timings and does not schedule classes during breaks
  - One-click generation: Generate a complete timetable based on configured inputs, teacher-subject pairs, weekly hours per subject, custom time slots, break timings, and constraints
  - Conflict detection and prevention:
    - Teacher clash detection — prevents the same teacher from being assigned to multiple sections at the same time
    - Classroom overlap prevention — ensures no two classes are assigned to the same room simultaneously
    - Subject timing conflict resolution — avoids scheduling the same subject multiple times in conflicting slots
  - Resource optimization:
    - Efficient classroom allocation
    - Faculty workload balancing
    - Lab timing optimization
    - Weekly hours distribution — ensures each subject receives the specified number of hours per week
  - The main administrator has full control over all resource management and scheduling decisions

---

### 3.6 Edit Timetable After Generation

**Purpose:** Allow users to modify the generated timetable.

**Features:**
  - After timetable generation, an Edit button is available
  - Users can click on any cell in the timetable to modify:
    - Subject name
    - Teacher name
    - Section
  - Changes are validated in real-time to detect conflicts
  - Conflict warnings are displayed if the edit creates a scheduling clash
  - Save button to persist the edited timetable
  - Cancel button to discard changes and revert to the previous version

---

### 3.7 View Timetable Page

**Purpose:** Allow all users (including guests) to view generated timetables.

**Features:**
  - Filter timetable by section
  - Display timetable in a clear table format (time slots vs. days)
  - Download timetable as PDF (section-wise or complete)
  - No login required to access this page

---

### 3.8 About Project Page

**Purpose:** Provide background information about the system.

**Content:**
  - Description of the project goals and motivation
  - Overview of the intelligent scheduling approach
  - Team or developer information (if applicable)

---

## 4. User Access Management

### 4.1 Roles and Permissions

| Role | Permissions |
|---|---|
| Main Administrator | Full control: create, edit, delete, manage timetable data, configure constraints, manage users |
| Registered Users | Create and manage their own timetables, view timetables, download PDF reports, edit their own generated timetables |
| Guest (Unauthenticated) | View-only access to timetable pages; no editing or downloading permissions |

### 4.2 Default Administrator Account
  - Username: aishwarya2007ps
  - Password: Rekhashankar45$
  - This account is seeded automatically on first launch
  - Credentials are displayed on the login page to assist first-time users

### 4.3 Access Policy
  - All users may access the platform freely
  - New users can sign up to create free accounts
  - Registered users can log in with their credentials
  - Login is required for creating, editing, and managing timetables

---

## 5. Timetable Management

**Available to registered users and administrators:**

  - Configure teacher-subject pairs: Define which teacher teaches which subject before auto-generation
  - Configure weekly hours: Specify the number of hours per week for each teacher-subject pair
  - Configure custom time slots: Manually define start and end times for each time slot
  - Configure breaks: Specify the number of breaks and their timings
  - Save timetable: Persist the current timetable data for all sections to the database
  - Edit timetable: Modify existing entries after generation with automatic conflict checking
  - Reset timetable: Clear all entries and start fresh
  - Download timetable as PDF: Export section-wise or complete timetable
  - View by section: Filter and display timetable for a specific section (available to all users)

---

## 6. Business Rules and Logic

  - Users must sign up and create an account to access timetable creation and editing features
  - Registered users can log in with their credentials to access their saved timetables
  - Users must define teacher-subject pairs before using the auto-generator
  - Users must specify the number of weekly hours for each teacher-subject pair before using the auto-generator
  - Users must define custom time slots before using the auto-generator
  - Users can optionally define breaks; if breaks are specified, they must be inserted at the correct positions in the timetable
  - The auto-generator uses only the predefined teacher-subject assignments, weekly hours configuration, custom time slots, and break timings provided by the user
  - The auto-generator must distribute the specified weekly hours for each subject across the timetable while respecting all constraints
  - A teacher cannot be assigned to more than one section at the same time slot on the same day
  - A classroom cannot be assigned to more than one section at the same time slot on the same day
  - The same subject cannot appear more than once in the same time slot for the same section
  - Breaks must not overlap with scheduled classes
  - Lab sessions must respect predefined lab timing constraints
  - The timetable generation algorithm must resolve all conflicts before presenting the output
  - If no conflict-free schedule can be generated with the given constraints, the system must display a clear error message indicating which constraint is causing the issue
  - After timetable generation, users can edit any cell in the timetable
  - Edits are validated in real-time to prevent conflicts
  - All data modifications (create, edit, delete, reset) require user authentication
  - The default admin account must be seeded on first launch if it does not already exist

---

## 7. Exceptions and Edge Cases

| Scenario | Expected Behavior |
|---|---|
| Duplicate username during sign up | Display an error message indicating the username is already taken |
| Password and Confirm Password do not match | Display an error message and prevent account creation |
| Invalid email format during sign up | Display an error message and prevent account creation |
| User attempts to generate timetable without defining teacher-subject pairs | Display a warning message prompting the user to configure teacher-subject assignments first |
| User attempts to generate timetable without specifying weekly hours for teacher-subject pairs | Display a warning message prompting the user to configure weekly hours for all teacher-subject pairs |
| User enters invalid or zero weekly hours | Display an error message and prevent the configuration from being saved |
| Total weekly hours for all subjects exceed available time slots | Display a warning indicating insufficient time slots and suggest increasing the number of slots or reducing weekly hours |
| User attempts to generate timetable without defining custom time slots | Display a warning message prompting the user to configure time slots first |
| User defines overlapping time slots | Display an error message and prevent the overlapping slots from being saved |
| User defines break timings that overlap with scheduled classes | Display a conflict warning and prevent the break from being saved |
| Duplicate entry (same teacher, section, day, time slot) | Display a conflict warning and prevent the duplicate from being saved |
| No available classroom for a given time slot | Alert the user and suggest alternative slots |
| Insufficient teachers for the number of sections | Display a warning indicating the resource shortage |
| Algorithm cannot resolve all conflicts | Show a detailed conflict report listing unresolved clashes |
| User attempts admin action without login | Redirect to the login page with an appropriate message |
| Invalid login credentials | Display an error message; do not grant access |
| Empty timetable download attempt | Notify the user that no timetable data is available to export |
| User edits timetable and creates a conflict | Display a conflict warning and prevent the change from being saved |
| Background animation causes performance degradation on low-end devices | Automatically reduce animation complexity or fall back to a static background image |

---

## 8. Acceptance Criteria

  - The animated dot-globe background renders correctly across all pages with no visual artifacts
  - The background animation does not obstruct or reduce the legibility of any foreground content
  - On low-end devices, the background gracefully degrades to a simpler or static version
  - The homepage loads correctly and all navigation links route to the correct pages
  - New users can sign up by providing username, password, and email
  - Sign up validation works correctly for duplicate usernames, password mismatch, and invalid email formats
  - Registered users can log in with their credentials
  - The login page displays the default admin credentials and allows successful authentication
  - Users can define teacher-subject pairs before generating the timetable
  - Users can specify the number of weekly hours for each teacher-subject pair
  - Weekly hours configuration is displayed alongside each teacher-subject pair
  - Users can manually define custom time slots by entering start and end times
  - Users can specify the number of breaks and define their timings
  - The auto-generator uses only the predefined teacher-subject assignments, weekly hours configuration, custom time slots, and break timings provided by the user
  - The auto-generator correctly distributes the specified weekly hours for each subject across the timetable
  - Administrators can input subjects, teachers, sections, days, and time slots, and add them to the timetable grid
  - The one-click generation feature produces a complete, conflict-free timetable based on the configured constraints, teacher-subject pairs, weekly hours, custom time slots, and breaks
  - Breaks are correctly inserted into the timetable at the specified positions and no classes are scheduled during break times
  - Conflict indicators are visually displayed when scheduling conflicts are detected
  - After timetable generation, users can click on any cell to edit subject, teacher, or section
  - Real-time conflict validation works correctly during editing
  - Edited timetables can be saved or changes can be canceled
  - The timetable is displayed correctly in table format with rows as time slots and columns as days (Monday to Saturday)
  - Section-wise filtering works correctly and displays only the relevant section data
  - Timetables can be saved, edited, reset, and downloaded as PDF by registered users
  - Guest users can view timetables without logging in
  - Role-based access control is enforced: only registered users can perform create, edit, delete, and reset operations
  - The default admin account (aishwarya2007ps / Rekhashankar45$) is seeded on first launch
  - All data persists across sessions
  - The application is responsive and functions correctly on desktop, tablet, and mobile screen sizes

---

## 9. Out of Scope

  - Photo or file upload for instant timetable conversion
  - Multi-institution or multi-campus support
  - Third-party calendar integrations (e.g., Google Calendar, Outlook)
  - Automated email or push notification systems
  - Advanced analytics or reporting dashboards
  - Bulk import of subjects or faculty via spreadsheet or CSV
  - Real-time collaborative editing by multiple administrators simultaneously
  - Password recovery or reset functionality
  - User profile management or account settings page