# TaskFlow – Task & Team Management Mobile App (React Native & Firebase)

> **MMA301 – Practical Exam 2 Submission**  
> Complete collaborative task management mobile application with **Firebase Authentication**, **Team Workspaces & Roles**, **Task Assignments**, and **Real-Time Team Chat** powered by **Cloud Firestore**.

---

## 📱 Features (Practical Exam 2)

### 1. 🔐 Firebase Authentication & Protected Navigation
- **Sign Up**: Full registration form (`name`, `email`, `password`, `confirmPassword`) creating a Firebase Auth user and a linked document in the `users` Firestore collection (`id`, `name`, `email`, `avatarUrl`, `createdAt`).
- **Sign In**: Secure authentication via email & password with contextual validation and Firebase error handling.
- **Persistent Auth**: Session persists across app restarts using `onAuthStateChanged` and `@react-native-async-storage/async-storage`.
- **Auth-Aware Navigation**: Automatic routing between `AuthStack` (`Login`, `SignUp`) and `AppStack` (`Home`, `Teams`, `Profile`, `TeamDetail`, `Chat`).
- **Profile & Logout**: Dedicated Profile screen showing user credentials, student metadata, and secure sign-out.

### 2. 👥 Teams & Workspaces
- **Create Teams**: Generate workspaces with name, description, and an auto-generated 6-character join code (e.g. `AB12CD`).
- **Join Teams**: Join existing teams instantly by entering the 6-character team code.
- **Team Detail Screen**:
  - Displays team metadata and join code.
  - Lists all team members with roles (`Owner` vs `Member`) and avatar initials.
  - Lists tasks filtered for the team.
  - Direct CTA button to launch the team's real-time chat.

### 3. 📋 Tasks with Teams & Assignees
- **Assign to Teams**: Select any of the user's teams or assign as Personal task.
- **Assign to Members**: Dynamically loads team members in `TaskModal` for assigning to a specific teammate.
- **Rich Task Cards**: Shows Priority pill, Status pill, Due date, **Team Name tag**, and **Assignee Name tag**.
- **Real-time Task Synchronization**: Uses Firestore `onSnapshot` to sync updates instantly across devices.

### 4. 💬 Real-Time Team Chat
- **Per-team Subcollection**: Chat messages stored under `teams/{teamId}/messages`.
- **Real-time `onSnapshot` Listener**: Automatically scrolls and reflects incoming messages without manual refresh.
- **Visual Bubble Distinction**:
  - Current user messages: Aligned right, Royal Blue background, white text.
  - Other members: Aligned left, white card, sender name in cyan/purple, dark text.
- **Message Timestamps**: Formatted timestamp per bubble.

### 5. 🛡️ Firestore Security Rules
- Production-ready security rules in `firestore.rules` enforcing `request.auth != null` for read/write on `users`, `teams`, `teamMembers`, `tasks`, and `messages`.

---

## 🗄️ Database Architecture & Complete ERD Schema

```mermaid
erDiagram
    USERS ||--o{ TEAM_MEMBERS : "joins"
    TEAMS ||--o{ TEAM_MEMBERS : "contains"
    TEAMS ||--o{ MESSAGES : "has"
    USERS ||--o{ MESSAGES : "sends"
    TEAMS ||--o{ TASKS : "owns"
    USERS ||--o{ TASKS : "assigned to"

    USERS {
        string id PK "Firebase Auth UID"
        string name "Full Name"
        string email "User Email"
        string avatarUrl "Profile image URL"
        string createdAt "ISO 8601 Timestamp"
    }

    TEAMS {
        string id PK "Firestore Auto ID"
        string name "Team Name"
        string description "Team Purpose / Scope"
        string ownerId FK "Creator User UID"
        string code "6-character join code"
        string createdAt "ISO 8601 Timestamp"
    }

    TEAM_MEMBERS {
        string id PK "Firestore Auto ID"
        string teamId FK "Reference to TEAMS"
        string userId FK "Reference to USERS"
        string userName "Member Display Name"
        string userEmail "Member Email"
        string role "Enum: owner | member"
        string joinedAt "ISO 8601 Timestamp"
    }

    TASKS {
        string id PK "Firestore Auto ID"
        string title "Task Title"
        string description "Task Details"
        string status "Enum: todo | in_progress | done"
        string priority "Enum: low | medium | high"
        string dueDate "ISO Date string (YYYY-MM-DD)"
        string createdAt "ISO 8601 Timestamp"
        string teamId FK "Nullable team reference"
        string teamName "Cached team name"
        string assigneeId FK "Nullable assignee user UID"
        string assigneeName "Cached assignee display name"
    }

    MESSAGES {
        string id PK "Firestore Auto ID"
        string senderId FK "Sender user UID"
        string senderName "Sender display name"
        string text "Message content"
        string createdAt "ISO 8601 Timestamp"
    }
```

---

## 🛠️ Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) (v0.86) with [Expo SDK 57](https://expo.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict mode)
- **Backend / Database**: [Firebase Auth](https://firebase.google.com/docs/auth) & [Cloud Firestore](https://firebase.google.com/docs/firestore)
- **Storage / Persistence**: `@react-native-async-storage/async-storage`
- **Navigation**: `@react-navigation/native-stack` & `@react-navigation/bottom-tabs`
- **Icons**: `@expo/vector-icons (Ionicons)`
- **Code Quality**: ESLint v10 + Prettier + TypeScript Compiler (`tsc --noEmit`)

---

## 🚀 Getting Started

### 1. Installation
```bash
# Clone the repository
git clone <YOUR_GITHUB_REPO_URL>
cd MMA301

# Install dependencies
npm install
```

### 2. Running Locally
```bash
# Start on Android Emulator
npm run android

# Or start Metro bundler
npm start
```

### 3. Type Checking
```bash
npm run typecheck
```

---

## 📝 Firestore Security Rules Setup
Copy the contents of [firestore.rules](file:///d:/MMA301/firestore.rules) into your Firebase Console -> Firestore Database -> Rules tab and click **Publish**.
