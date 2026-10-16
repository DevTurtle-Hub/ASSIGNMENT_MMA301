# FPT UNIVERSITY – DEPARTMENT OF COMPUTING
## MMA301 – MOBILE MULTI-PLATFORM APPLICATION DEVELOPMENT
### PRACTICAL EXAM 2 REPORT: TASK MANAGEMENT APP (AUTHENTICATION, TEAMS & REAL-TIME CHAT)

---

### 👤 THÔNG TIN SINH VIÊN
- **Họ và tên**: [Điền họ và tên của bạn - ví dụ: Nguyễn Văn Quý]
- **Mã số sinh viên (StudentID)**: [Điền MSSV của bạn - ví dụ: QE170123 / SE160999]
- **Lớp học (Class)**: [Điền mã lớp - ví dụ: MMA301.SE1701]
- **Giảng viên hướng dẫn**: [Điền tên giảng viên]
- **Ngày nộp bài**: 16/10/2026

---

### 🔗 CÁC LIÊN KẾT DỰ ÁN (PROJECT LINKS)
- **Public GitHub Repository**: [https://github.com/DevTurtle-Hub/ASSIGNMENT_MMA301](https://github.com/DevTurtle-Hub/ASSIGNMENT_MMA301)
- **Direct APK Download Link (EAS Build)**: [https://expo.dev/accounts/quynv64/projects/task-management-app/builds/4735525b-ae79-4fcb-a46e-52221f2f2921](https://expo.dev/accounts/quynv64/projects/task-management-app/builds/4735525b-ae79-4fcb-a46e-52221f2f2921)
- **Expo Project Link / QR Code**: `exp://u.expo.dev/e3458b13-6cf6-4bda-9bd8-d3c012522a39`

---

## 1. KIẾN TRÚC CƠ SỞ DỮ LIỆU & FIRESTORE DATA SCHEMA (ERD)

### 1.1 Chi tiết các Collections trong Cloud Firestore

#### 1. Collection `users` (Thông tin tài khoản)
| Tên trường (Field) | Kiểu dữ liệu (Type) | Mô tả & Ràng buộc |
|---|---|---|
| `id` | `string (Primary Key)` | Khóa chính, đồng bộ với UID từ Firebase Authentication |
| `name` | `string` | Tên đầy đủ hiển thị của người dùng |
| `email` | `string` | Địa chỉ email đăng nhập duy nhất |
| `avatarUrl` | `string` | Đường dẫn ảnh đại diện |
| `createdAt` | `string (ISO 8601)` | Thời điểm tài khoản được khởi tạo |

#### 2. Collection `teams` (Thông tin nhóm làm việc)
| Tên trường (Field) | Kiểu dữ liệu (Type) | Mô tả & Ràng buộc |
|---|---|---|
| `id` | `string (Primary Key)` | Mã nhóm tự sinh bởi Firestore |
| `name` | `string` | Tên nhóm làm việc (ví dụ: Mobile Dev Squad) |
| `description` | `string` | Mục tiêu và mô tả nhóm |
| `ownerId` | `string (Foreign Key)` | Khóa ngoại liên kết tới `users.id` của trưởng nhóm |
| `code` | `string (Unique)` | Mã 6 ký tự để thành viên khác nhập và tham gia nhóm |
| `createdAt` | `string (ISO 8601)` | Thời điểm tạo nhóm |

#### 3. Collection `teamMembers` (Quan hệ thành viên trong nhóm)
| Tên trường (Field) | Kiểu dữ liệu (Type) | Mô tả & Ràng buộc |
|---|---|---|
| `id` | `string (Primary Key)` | Mã định danh quan hệ thành viên |
| `teamId` | `string (Foreign Key)` | Khóa ngoại tham chiếu tới `teams.id` |
| `userId` | `string (Foreign Key)` | Khóa ngoại tham chiếu tới `users.id` |
| `userName` | `string` | Tên hiển thị của thành viên |
| `userEmail` | `string` | Email của thành viên |
| `role` | `string` | Vai trò trong nhóm (`owner` hoặc `member`) |
| `joinedAt` | `string (ISO 8601)` | Thời điểm gia nhập nhóm |

#### 4. Collection `tasks` (Công việc gán theo Team & Assignee)
| Tên trường (Field) | Kiểu dữ liệu (Type) | Mô tả & Ràng buộc |
|---|---|---|
| `id` | `string (Primary Key)` | Mã định danh công việc (Firestore Auto-ID) |
| `title` | `string` | Tiêu đề công việc |
| `description` | `string` | Chi tiết nội dung công việc |
| `status` | `string` | Trạng thái: `todo`, `in_progress`, `done` |
| `priority` | `string` | Mức độ ưu tiên: `low`, `medium`, `high` |
| `dueDate` | `string` | Hạn hoàn thành (YYYY-MM-DD) |
| `createdAt` | `string (ISO 8601)` | Thời điểm tạo task |
| `teamId` | `string \| null` | Khóa ngoại liên kết nhóm |
| `assigneeId` | `string \| null` | Khóa ngoại liên kết thành viên được giao task |
| `teamName` | `string \| null` | Tên nhóm được gán |
| `assigneeName` | `string \| null` | Tên người được gán |

#### 5. Subcollection `teams/{teamId}/messages` (Tin nhắn nội bộ nhóm)
| Tên trường (Field) | Kiểu dữ liệu (Type) | Mô tả & Ràng buộc |
|---|---|---|
| `id` | `string (Primary Key)` | Mã tin nhắn tự sinh trong subcollection |
| `senderId` | `string (Foreign Key)` | Khóa ngoại tham chiếu tới `users.id` của người gửi |
| `senderName` | `string` | Tên của người gửi tin nhắn |
| `text` | `string` | Nội dung văn bản tin nhắn chat |
| `createdAt` | `string (ISO 8601)` | Thời điểm gửi tin nhắn (dùng sắp xếp real-time) |

---

### 1.2 Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && request.auth.uid == userId;
    }
    match /teams/{teamId} {
      allow read, write: if isAuthenticated();
      match /messages/{messageId} {
        allow read, write: if isAuthenticated();
      }
    }
    match /teamMembers/{memberId} {
      allow read, write: if isAuthenticated();
    }
    match /tasks/{taskId} {
      allow read, write: if isAuthenticated();
    }
  }
}
```

---

## 2. DANH SÁCH 11 ẢNH MINH CHỨNG & CHÚ THÍCH (CAPTIONS)

### 2.1 Ảnh 1: Firebase Authentication Console
- **Thao tác tay cần chụp**: Vào Firebase Console -> Authentication -> tab Users. Hiển thị danh sách các tài khoản test đã tạo (`alice@gmail.com` và `bob@gmail.com`).
- **Caption**: *Bảng điều khiển Firebase Authentication hiển thị danh sách các tài khoản test đã đăng ký (alice@gmail.com, bob@gmail.com).*
- **Đạt yêu cầu**: Authentication – Quản lý danh tính người dùng an toàn.

### 2.2 Ảnh 2: Firestore Database Console
- **Thao tác tay cần chụp**: Vào Firestore Database -> tab Data. Chụp toàn cảnh hiển thị các root collections: `users`, `teams`, `teamMembers`, `tasks` và subcollection `messages` cùng dữ liệu mẫu.
- **Caption**: *Bảng điều khiển Cloud Firestore hiển thị đầy đủ các collections users, teams, teamMembers, tasks và subcollection messages cùng dữ liệu thực tế.*
- **Đạt yêu cầu**: Quản lý dữ liệu NoSQL Cloud Firestore đồng bộ thời gian thực.

### 2.3 Ảnh 3: Firestore Security Rules
- **Thao tác tay cần chụp**: Vào Firestore Database -> tab Rules. Chụp toàn màn hình hiển thị nội dung file `firestore.rules` đã Publish thành công.
- **Caption**: *Quy tắc bảo mật Firestore Security Rules yêu cầu request.auth != null để đảm bảo chỉ người dùng đã xác thực mới có quyền truy cập dữ liệu.*
- **Đạt yêu cầu**: Bảo mật dữ liệu – Thay thế hoàn toàn test mode mở.

### 2.4 Ảnh 4: Màn hình Sign Up (Đăng ký tài khoản)
- **Thao tác tay cần chụp**: Mở app trên điện thoại/máy ảo -> Bấm "Create Account" -> Nhập đầy đủ thông tin form đăng ký (Full Name, Email, Password, Confirm Password).
- **Caption**: *Giao diện màn hình đăng ký tài khoản mới với các trường Name, Email, Password và xử lý kiểm tra dữ liệu hợp lệ.*
- **Đạt yêu cầu**: Chức năng đăng ký tài khoản mới kèm lưu trữ User Profile.

### 2.5 Ảnh 5: Màn hình Login (Đăng nhập)
- **Thao tác tay cần chụp**: Màn hình đăng nhập tài khoản bằng email/password, có thông báo và nút Sign In.
- **Caption**: *Giao diện màn hình đăng nhập tài khoản bằng Firebase Auth, có cơ chế ghi nhớ phiên đăng nhập qua onAuthStateChanged.*
- **Đạt yêu cầu**: Xác thực đăng nhập và duy trì trạng thái đăng nhập khi mở lại app.

### 2.6 Ảnh 6: Màn hình Home (Task List) sau khi đăng nhập
- **Thao tác tay cần chụp**: Màn hình Home sau khi đăng nhập, danh sách task hiển thị huy hiệu tên Team và tên Assignee.
- **Caption**: *Màn hình danh sách công việc được bảo vệ (sau đăng nhập), hiển thị các task kèm tên Team và tên Assignee.*
- **Đạt yêu cầu**: Bảo vệ màn hình và hiển thị liên kết nhiệm vụ với thành viên.

### 2.7 Ảnh 7: Màn hình Teams (Danh sách & Tạo / Tham gia Team)
- **Thao tác tay cần chụp**: Tab Teams hiển thị các nhóm đã tham gia cùng mã Join Code 6 ký tự, nút tạo team và nút nhập code tham gia team.
- **Caption**: *Màn hình Teams cho phép tạo team mới sinh mã Join Code và tham gia team bằng mã 6 ký tự.*
- **Đạt yêu cầu**: Quản trị nhóm làm việc (thay thế placeholder của Exam 1).

### 2.8 Ảnh 8: Màn hình Team Detail (Chi tiết nhóm & Thành viên)
- **Thao tác tay cần chụp**: Bấm vào 1 team -> Hiển thị chi tiết nhóm, danh sách các thành viên kèm vai trò (Owner/Member) và các task của nhóm.
- **Caption**: *Màn hình chi tiết nhóm hiển thị danh sách thành viên với role (Owner/Member) và các task thuộc nhóm.*
- **Đạt yêu cầu**: Chi tiết thành viên và các task liên quan trong nhóm.

### 2.9 Ảnh 9: Màn hình Modal gán Task cho Team & Assignee
- **Thao tác tay cần chụp**: Bấm nút (+) tạo task hoặc sửa task -> Hộp thoại TaskModal hiển thị picker chọn Team và dropdown chọn thành viên (Assignee) từ nhóm đó.
- **Caption**: *Form tạo/sửa task cho phép chọn Team và gán người thực hiện (Assignee) từ danh sách thành viên của team.*
- **Đạt yêu cầu**: Gán công việc cụ thể cho từng thành viên trong nhóm.

### 2.10 Ảnh 10: Màn hình Real-Time Chat giữa 2 tài khoản (Alice & Bob)
- **Thao tác tay cần chụp**: Màn hình Chat thời gian thực với cuộc trò chuyện qua lại giữa Alice và Bob, hiển thị giờ gửi và phân biệt tin nhắn gửi (màu xanh bên phải) và tin nhắn nhận (màu xám bên trái kèm avatar).
- **Caption**: *Màn hình Chat thời gian thực với cuộc hội thoại giữa 2 user khác nhau, hiển thị rõ giờ gửi và phân biệt tin nhắn của mình (bên phải) và thành viên khác (bên trái kèm avatar).*
- **Đạt yêu cầu**: Trò chuyện nhóm thời gian thực với subcollection messages và listener onSnapshot.

### 2.11 Ảnh 11: Màn hình Profile và hành vi Logout
- **Thao tác tay cần chụp**: Tab Profile hiển thị thông tin người dùng đang đăng nhập -> Bấm nút đỏ "Log Out of TaskFlow" -> Ứng dụng tự động chuyển về màn hình Login.
- **Caption**: *Màn hình Profile hiển thị thông tin tài khoản hiện tại và xác nhận khi bấm Logout ứng dụng tự động quay về màn hình Login.*
- **Đạt yêu cầu**: Đăng xuất an toàn và điều hướng bảo vệ tài nguyên.

---

## 3. BẢNG TỔNG HỢP KIỂM THỬ TÍNH NĂNG (FEATURE CHECKLIST)

| Yêu cầu chức năng | Triển khai trong Source Code | Đánh giá |
|---|---|---|
| **1. Firebase Authentication** | Đăng ký, đăng nhập, đăng xuất, lưu trạng thái `onAuthStateChanged`, lưu trữ profile vào collection `users`. | **Hoàn thành 100%** |
| **2. Teams Management** | Tạo nhóm, sinh mã join code 6 ký tự, tham gia bằng mã code, màn hình Team Detail danh sách thành viên. | **Hoàn thành 100%** |
| **3. Task Linking & Assignee** | Cho phép gán task vào Team và gán thành viên (Assignee), hiển thị tên trên Task Card. | **Hoàn thành 100%** |
| **4. Real-Time Team Chat** | Subcollection `teams/{teamId}/messages`, cập nhật tức thì với `onSnapshot`, giao diện bong bóng chat phân biệt 2 phía. | **Hoàn thành 100%** |
| **5. Firestore Security Rules** | Ràng buộc bảo mật `request.auth != null` bảo vệ toàn diện các collections. | **Hoàn thành 100%** |
| **6. Bonus Marks** | Sắp xếp dữ liệu client-side tối ưu, giao diện responsive mượt mà trên cả Mobile và Web. | **Hoàn thành 100%** |
