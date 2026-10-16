# Practical Exam 2 – Hướng Dẫn Hoàn Thiện & Chuẩn Bị Báo Cáo

Tài liệu này tổng hợp toàn bộ các phần **đã được code hoàn thiện 100% trong dự án** và **các bước bạn cần thao tác thực tế (chụp ảnh màn hình)** để nộp bài file `StudentID_Exam2.docx`.

---

## I. Những Phần Đã Được Hoàn Thiện Trong Code

| STT | Yêu cầu trong đề bài | Trạng thái Code | File thực thi chính |
|---|---|---|---|
| 1 | **Firebase Authentication**<br>- Đăng ký (Sign Up) với name, email, password<br>- Tạo doc tương ứng trong collection `users` (`id`, `name`, `email`, `avatarUrl`, `createdAt`)<br>- Đăng nhập (Login)<br>- Đăng xuất (Logout)<br>- Lưu trạng thái đăng nhập qua `AsyncStorage` + `onAuthStateChanged`<br>- Bảo vệ màn hình (unauthenticated chuyển về Login) | **Hoàn thành 100%** | [`src/contexts/AuthContext.tsx`](file:///d:/MMA301/src/contexts/AuthContext.tsx)<br>[`src/screens/auth/LoginScreen.tsx`](file:///d:/MMA301/src/screens/auth/LoginScreen.tsx)<br>[`src/screens/auth/SignUpScreen.tsx`](file:///d:/MMA301/src/screens/auth/SignUpScreen.tsx)<br>[`src/navigation/AppNavigator.tsx`](file:///d:/MMA301/src/navigation/AppNavigator.tsx) |
| 2 | **Teams (Thay thế placeholder)**<br>- Màn hình Teams thực tế<br>- Tạo team mới (name, description, tạo mã 6 ký tự)<br>- Tham gia team bằng mã code<br>- Lưu trữ `teams` và `teamMembers`<br>- Màn hình Team Detail liệt kê members & tasks | **Hoàn thành 100%** | [`src/screens/TeamsScreen.tsx`](file:///d:/MMA301/src/screens/TeamsScreen.tsx)<br>[`src/screens/TeamDetailScreen.tsx`](file:///d:/MMA301/src/screens/TeamDetailScreen.tsx)<br>[`src/services/teamService.ts`](file:///d:/MMA301/src/services/teamService.ts) |
| 3 | **Gán Task cho Team & Thành viên**<br>- Form tạo/sửa task cho phép chọn Team (`teamId`)<br>- Cho phép chọn Assignee (`assigneeId`) từ danh sách thành viên team<br>- Hiển thị tên Assignee & tên Team trên card task<br>- Lọc task theo team | **Hoàn thành 100%** | [`src/components/TaskModal.tsx`](file:///d:/MMA301/src/components/TaskModal.tsx)<br>[`src/components/TaskCard.tsx`](file:///d:/MMA301/src/components/TaskCard.tsx)<br>[`src/services/taskService.ts`](file:///d:/MMA301/src/services/taskService.ts) |
| 4 | **Real-Time Chat theo Team**<br>- Nút mở Chat từ Team Detail screen<br>- Lưu tin nhắn vào subcollection `teams/{teamId}/messages`<br>- Phân biệt trực quan tin nhắn của mình (xanh, bên phải) và người khác (trắng/xám, bên trái)<br>- Hiển thị tên người gửi, nội dung, giờ gửi<br>- `onSnapshot` cập nhật real-time không cần reload | **Hoàn thành 100%** | [`src/screens/ChatScreen.tsx`](file:///d:/MMA301/src/screens/ChatScreen.tsx)<br>[`src/services/chatService.ts`](file:///d:/MMA301/src/services/chatService.ts) |
| 5 | **Firestore Security Rules**<br>- Yêu cầu `request.auth != null` cho tất cả collections | **Hoàn thành 100%** | [`firestore.rules`](file:///d:/MMA301/firestore.rules) |
| 6 | **Bonus: ERD Schema Diagram**<br>- Vẽ đầy đủ quan hệ giữa `users`, `teams`, `teamMembers`, `tasks`, `messages` | **Hoàn thành 100%** | [`README.md`](file:///d:/MMA301/README.md) |

---

## II. Những Chỗ Bạn Cần Xử Lý Bằng Tay (Manual Steps)

Vì bài thi được chấm chủ yếu qua file báo cáo `StudentID_Exam2.docx` kèm ảnh chụp bằng chứng (theo quy định ở mục *Deliverables*), dưới đây là các bước bạn cần thao tác:

### Bước 1: Cấu hình trên Firebase Console
1. Truy cập [Firebase Console](https://console.firebase.google.com/) vào project của bạn (`mma301-49273`).
2. Vào **Authentication** -> **Sign-in method** -> Nhấn **Email/Password** -> Bật **Enable** -> Nhấn **Save**.
3. Vào **Firestore Database** -> Chọn tab **Rules**:
   - Dán nội dung từ file [`firestore.rules`](file:///d:/MMA301/firestore.rules):
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
   - Nhấn **Publish**.

---

### Bước 2: Tạo 2 Tài Khoản Test (User A và User B)
Chạy ứng dụng:
```bash
npm run android
```
1. **Đăng ký User A**:
   - Chọn "Create Account" trên màn hình Login.
   - Nhập: Name (ví dụ: `Alice Nguyen`), Email (`alice@gmail.com`), Password (`123456`).
   - Sau khi vào app:
     - Vào tab **Teams** -> Nhấn nút **New** -> Tạo team tên: `Mobile Dev Squad` -> Hệ thống sẽ cấp một mã Code gồm 6 ký tự (ví dụ: `AB12CD`).
     - Ghi lại mã code này.
     - Vào tab **Profile** -> Bấm **Log Out of TaskFlow**.
2. **Đăng ký User B**:
   - Chọn "Create Account" -> Nhập: Name (ví dụ: `Bob Tran`), Email (`bob@gmail.com`), Password (`123456`).
   - Vào tab **Teams** -> Nhấn nút **Join** -> Nhập mã code vừa lưu ở trên -> Nhấn **Join Team**.
   - Mở màn hình **Team Detail** -> Nhấn **Open Real-Time Team Chat** -> Nhắn tin: *"Hi Alice, I joined the team!"*.
   - Đăng xuất User B.
3. **Đăng nhập lại User A**:
   - Mở lại Team Chat -> Nhắn trả lời: *"Welcome Bob! Let's start the project"*.
   - Vào tab **Tasks** (hoặc trong Team Detail) -> Bấm `+` tạo task:
     - Title: `Implement Firebase Chat UI`
     - Chọn Assign to Team: `Mobile Dev Squad`
     - Chọn Assignee: `Bob Tran`
     - Lưu task.

---

### Bước 3: Danh Sách 11 Ảnh Chụp Màn Hình Cần Chèn Vào Báo Cáo (`StudentID_Exam2.docx`)

Khi soạn file Word (đặt tên ví dụ: `QE123456_Exam2.docx`), chèn lần lượt các ảnh chụp màn hình sau kèm caption mô tả:

1. **Ảnh 1: Firebase Authentication Console**  
   *Caption: Bảng điều khiển Firebase Authentication hiển thị danh sách các tài khoản test đã đăng ký (`alice@gmail.com`, `bob@gmail.com`).*

2. **Ảnh 2: Firestore Database Console**  
   *Caption: Bảng điều khiển Cloud Firestore hiển thị các collections `users`, `teams`, `teamMembers`, `tasks`, và subcollection `messages` cùng dữ liệu mẫu.*

3. **Ảnh 3: Firestore Security Rules**  
   *Caption: Quy tắc bảo mật Firestore Security Rules yêu cầu request.auth != null để đảm bảo chỉ người dùng đã xác thực mới có quyền truy cập dữ liệu.*

4. **Ảnh 4: Màn hình Sign Up**  
   *Caption: Giao diện màn hình đăng ký tài khoản mới với các trường họ tên, email, mật khẩu và xác nhận mật khẩu.*

5. **Ảnh 5: Màn hình Login**  
   *Caption: Giao diện màn hình đăng nhập tài khoản bằng Firebase Authentication với xử lý validation và hiển thị lỗi thân thiện.*

6. **Ảnh 6: Màn hình Home (Task List) sau khi đăng nhập**  
   *Caption: Màn hình danh sách công việc hiển thị đầy đủ trạng thái, mức độ ưu tiên, tên Team và tên người được gán (Assignee).*

7. **Ảnh 7: Màn hình Teams (Danh sách & Tạo/Tham gia Team)**  
   *Caption: Màn hình Teams hiển thị các nhóm đã tham gia cùng mã tham gia (Join Code) và popup tạo/join team.*

8. **Ảnh 8: Màn hình Team Detail**  
   *Caption: Chi tiết nhóm hiển thị danh sách thành viên với role (Owner/Member) và các task thuộc nhóm.*

9. **Ảnh 9: Màn hình Modal gán Task cho Team & Assignee**  
   *Caption: Hộp thoại tạo/chỉnh sửa task cho phép chọn Team và chọn thành viên cụ thể trong team làm Assignee.*

10. **Ảnh 10: Màn hình Real-Time Chat giữa 2 tài khoản**  
    *Caption: Màn hình Chat thời gian thực hiển thị cuộc hội thoại giữa User A và User B với bong bóng chat trực quan và mốc thời gian rõ ràng.*

11. **Ảnh 11: Màn hình Profile và hành vi Logout**  
    *Caption: Màn hình Profile hiển thị thông tin tài khoản người dùng và xác nhận đăng xuất đưa ứng dụng quay lại màn hình Login.*

---

## III. Link GitHub & EAS Build
- Đẩy toàn bộ code lên GitHub:
  ```bash
  git add .
  git commit -m "Complete Practical Exam 2: Auth, Teams, Task Assignment, and Real-Time Chat"
  git push origin main
  ```
- Nếu muốn tạo file APK trực tiếp bằng EAS Build:
  ```bash
  npm run build:apk
  ```
