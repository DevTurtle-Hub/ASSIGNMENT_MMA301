# FPT UNIVERSITY – DEPARTMENT OF COMPUTING
## MMA301 – MOBILE MULTI-PLATFORM APPLICATION DEVELOPMENT
### PRACTICAL EXAM 1 REPORT: TASK MANAGEMENT APP (REACT NATIVE & FIREBASE)

---

### 👤 STUDENT INFORMATION
- **Full Name**: [Nguyễn Văn A]
- **Student ID**: [QE170123 / SE160999]
- **Class**: [MMA301.SE1701]
- **Lecturer**: [Tên Giảng Viên]
- **Submission Date**: 29/09/2026

---

### 🔗 PROJECT & REPOSITORY LINKS
- **Public GitHub Repository**: `https://github.com/DevTurtle-Hub/ASSIGNMENT_MMA301`
- **Expo Project Link / QR Code / APK Download**: `https://expo.dev/@[YOUR_EXPO_USERNAME]/[YOUR_PROJECT_NAME]`

---

## 1. FIRESTORE DATA MODEL & ARCHITECTURE

### 1.1 Data Schema
The Firestore database uses a root-level collection named `tasks` with auto-generated document IDs. The document structure is specified as follows:

| Field Name | Type | Description | Required | Practical Exam |
|---|---|---|---|---|
| `id` | `string` | Unique auto-generated document ID in Firestore | Yes | Exam 1 |
| `title` | `string` | Task title / main objective | Yes | Exam 1 |
| `description` | `string` | Detailed description or notes | No | Exam 1 |
| `status` | `string` | Current progress (`todo`, `in_progress`, `done`) | Yes | Exam 1 |
| `priority` | `string` | Priority urgency (`low`, `medium`, `high`) | Yes | Exam 1 |
| `dueDate` | `string` | Due date formatted as `YYYY-MM-DD` | Yes | Exam 1 |
| `createdAt` | `string` | ISO 8601 timestamp of creation time | Yes | Exam 1 |
| `teamId` | `string \| null` | Team reference identifier (for multi-tenant teams) | No | Exam 2 (Placeholder) |
| `assigneeId` | `string \| null` | Assigned user identifier | No | Exam 2 (Placeholder) |

### 1.2 Entity Relationship Diagram (ERD)

```
+-------------------------------------------------------------+
|                     COLLECTION: tasks                       |
+-------------------------------------------------------------+
| * id          : string (Primary Key, Firestore Auto-ID)     |
|   title       : string                                      |
|   description : string                                      |
|   status      : 'todo' | 'in_progress' | 'done'             |
|   priority    : 'low' | 'medium' | 'high'                   |
|   dueDate     : string (YYYY-MM-DD)                         |
|   createdAt   : string (ISO 8601)                           |
|   teamId      : string | null (Exam 2 foreign key)          |
|   assigneeId  : string | null (Exam 2 foreign key)          |
+-------------------------------------------------------------+
```

---

## 2. FUNCTIONAL SCREENSHOTS & DESCRIPTIONS

*(Note: Paste your actual screenshots below each section)*

### Screenshot 1: Firebase Console (Firestore Data Tab)
> **Description & Caption**: Firestore `tasks` collection in the Firebase Console displaying auto-generated document IDs and task fields (`title`, `description`, `status`, `priority`, `dueDate`, `createdAt`, `teamId`, `assigneeId`).
>
> *(Chèn ảnh chụp Firebase Console vào đây)*

---

### Screenshot 2: Home Screen (Overview & Task List)
> **Description & Caption**: Home Screen of TaskFlow showing the app branding header, real-time live statistics chips, multi-criteria filter bar, and the initial list of tasks retrieved from Cloud Firestore.
>
> *(Chèn ảnh chụp Home Screen tổng quan vào đây)*

---

### Screenshot 3: Create Task Form (Filled In Before Submitting)
> **Description & Caption**: "Create New Task" modal form with Title, Description, High Priority, To Do status, and Due Date selected before clicking "Create Task".
>
> *(Chèn ảnh chụp Form Tạo Task đang điền vào đây)*

---

### Screenshot 4: Task List (After Task Creation)
> **Description & Caption**: Task list immediately updated in real-time displaying the newly created task at the top with its colored priority bar and status badge.
>
> *(Chèn ảnh chụp Danh sách Task sau khi tạo mới vào đây)*

---

### Screenshot 5: Edit Task Modal (Modifying Existing Task)
> **Description & Caption**: "Edit Task" modal with pre-filled task information, modifying the title and advancing the status to "In Progress".
>
> *(Chèn ảnh chụp Modal Chỉnh sửa Task vào đây)*

---

### Screenshot 6: Task List (After Task Update)
> **Description & Caption**: Task list demonstrating real-time update reflections from Cloud Firestore with modified title and updated status badge.
>
> *(Chèn ảnh chụp Danh sách sau khi sửa vào đây)*

---

### Screenshot 7: Task Deletion (Confirmation & List After Removal)
> **Description & Caption**: Confirmation modal and the subsequent task list proving the successful deletion of the task document from Firestore.
>
> *(Chèn ảnh chụp Xác nhận xóa và danh sách sau khi xóa vào đây)*

---

### Screenshot 8: Status & Priority Filters (Bonus Feature)
> **Description & Caption**: Multi-criteria filtering in action, filtering tasks by "Completed" status and "High" priority with live count badges.
>
> *(Chèn ảnh chụp Tính năng lọc Task vào đây)*

---

### Screenshot 9: Client-side Form Validation (Bonus Feature)
> **Description & Caption**: Client-side validation displaying an alert message "Task title is required." when attempting to submit an empty title.
>
> *(Chèn ảnh chụp Báo lỗi Form Validation vào đây)*

---

### Screenshot 10: Teams Placeholder Screen ("Coming Soon" for Exam 2)
> **Description & Caption**: Bottom Tab Navigation on the "Teams" tab, displaying the Exam 2 roadmap and data model integration notes for `teamId` and `assigneeId`.
>
> *(Chèn ảnh chụp Màn hình Teams Placeholder vào đây)*

---

### Screenshot 11: Profile Screen & App Navigation
> **Description & Caption**: Profile tab showing developer information, technical stack specifications, and Firebase connection status.
>
> *(Chèn ảnh chụp Màn hình Profile vào đây)*

---

## 3. CONCLUSION & SELF-EVALUATION

- **Project Scaffolding & Architecture**: 100% completed with Expo SDK 57, TypeScript strict mode, ESLint, Prettier, and modular structure.
- **Firebase Connection & Data Model**: Fully integrated with Cloud Firestore real-time listener (`onSnapshot`) and public CRUD operations.
- **Bonus Implementations**: Client-side validation, multi-criteria filters, pull-to-refresh, CI/CD pipeline with GitHub Actions, and detailed ERD diagram.
