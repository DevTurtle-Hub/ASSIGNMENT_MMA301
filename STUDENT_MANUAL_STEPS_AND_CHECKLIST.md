# HƯỚNG DẪN THAO TÁC TAY & CHECKLIST NỘP BÀI (PRACTICAL EXAM 1)

Tài liệu này tổng hợp toàn bộ các bước thao tác tay (manual steps) mà bạn cần thực hiện trên máy / tài khoản cá nhân để hoàn tất kỳ thi **Practical Exam 1 – MMA301**.

---

## 📋 MỤC LỤC CÁC BƯỚC THAO TÁC TAY
1. [Bước 1: Tạo Firebase Project & Cloud Firestore](#bước-1-tạo-firebase-project--cloud-firestore)
2. [Bước 2: Cấu hình biến môi trường `.env`](#bước-2-cấu-hình-biến-môi-trường-env)
3. [Bước 3: Tạo Repo GitHub & Push Code](#bước-3-tạo-repo-github--push-code)
4. [Bước 4: Chạy App & Chụp 11 Ảnh Minh Chứng](#bước-4-chạy-app--chụp-11-ảnh-minh-chứng)
5. [Bước 5: Tạo File Nộp Bài `StudentID_Exam1.docx`](#bước-5-tạo-file-nộp-bài-studentid_exam1docx)

---

## 📌 BƯỚC 1: TẠO FIREBASE PROJECT & CLOUD FIRESTORE

1. Truy cập vào [Firebase Console](https://console.firebase.google.com/) bằng tài khoản Google.
2. Bấm **Add project** (Tạo dự án mới):
   - Đặt tên project (ví dụ: `task-manager-mma301` hoặc `taskflow-exam1`).
   - Tắt Google Analytics (để tạo nhanh) hoặc bật tùy ý -> Bấm **Create project**.
3. Bật **Cloud Firestore**:
   - Ở thanh menu bên trái, chọn **Build** -> **Firestore Database**.
   - Bấm **Create database**.
   - Chọn vị trí server (Location, ví dụ: `asia-southeast1` hoặc `nam5 (us-central)`).
   - Chọn chế độ bảo mật: **Start in test mode** (Chế độ thử nghiệm - cho phép đọc ghi không cần auth cho Exam 1).
   - Bấm **Enable**.
4. Tạo collection mẫu trên Firebase Console:
   - Bấm **+ Start collection**.
   - Collection ID: `tasks`.
   - Document ID: chọn **Auto-ID**.
   - Thêm các trường dữ liệu:
     - `title` (string): `Thiết lập môi trường dự án Expo`
     - `description` (string): `Khởi tạo React Native Expo với TypeScript và cấu trúc thư mục chuẩn.`
     - `status` (string): `done`
     - `priority` (string): `high`
     - `dueDate` (string): `2026-09-30`
     - `createdAt` (string): `2026-09-29T08:00:00.000Z`
     - `teamId` (null): để trống/null
     - `assigneeId` (null): để trống/null
   - Bấm **Save**.
5. Lấy cấu hình Web App Firebase:
   - Vào **Project Settings** (Biểu tượng bánh răng ở góc trên bên trái) -> tab **General**.
   - Kéo xuống mục **Your apps** -> Bấm vào biểu tượng **Web** (`</>`).
   - Đặt tên app (ví dụ: `TaskAppWeb`) -> Bấm **Register app**.
   - Copy các giá trị trong đoạn `const firebaseConfig = { ... }`.

---

## 📌 BƯỚC 2: CẤU HÌNH BIẾN MÔI TRƯỜNG `.env`

1. Tại thư mục gốc `d:\MMA301`, tạo file tên `.env` (hoặc nhân bản từ file `.env.example`).
2. Dán các thông tin cấu hình từ Bước 1 vào file `.env`:
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy... (API Key của bạn)
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
   EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
   ```
3. Lưu file lại. Khi khởi động ứng dụng, Header sẽ hiện huy hiệu xanh lá **"Firestore Live"** báo hiệu đã kết nối trực tiếp Firestore.

---

## 📌 BƯỚC 3: TẠO REPO GITHUB & PUSH CODE

1. Đăng nhập vào [GitHub](https://github.com/) -> Bấm **New repository**.
2. Đặt tên repository (ví dụ: `MMA301_Practical_Exam_1` hoặc `task-management-app`).
3. Chọn chế độ **Public** (Bắt buộc theo yêu cầu đề bài).
4. Không tích chọn "Add a README file" hay .gitignore (vì trong máy đã có sẵn). Bấm **Create repository**.
5. Mở terminal tại `d:\MMA301` và chạy lệnh liên kết & đẩy code:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>.git
   git push -u origin main
   ```
6. Kiểm tra lại trên GitHub: repository cần hiển thị đầy đủ code, các commits rõ ràng (`feat: ...`, `chore: ...`) và CI GitHub Actions chạy màu xanh (Passed).

---

## 📌 BƯỚC 4: CHẠY APP & CHỤP 11 ẢNH MINH CHỨNG THEO YÊU CẦU

Chạy ứng dụng:
```bash
npx expo start
```
- Nhấn `w` để mở ngay trên trình duyệt web, hoặc quét mã QR bằng **Expo Go** trên điện thoại / mở Android Emulator (`a`).

Chụp đầy đủ **11 ảnh màn hình rõ nét** (Full screen, không cắt xén làm mờ chữ):

| # | Tên Ảnh Minh Chứng | Yêu Cầu Chi Tiết |
|---|---|---|
| **Ảnh 1** | **Firebase Console Tasks Collection** | Chụp toàn màn hình trang Firebase Console -> Firestore Database -> tab `Data`, hiển thị rõ collection `tasks` và các document mẫu kèm các trường (`title`, `status`, `priority`, `dueDate`, `createdAt`). |
| **Ảnh 2** | **Home Screen Tổng Quan** | Màn hình Home hiển thị Header (TaskFlow, Firestore Live, các thống kê Total/Todo/InProgress/Done), thanh Search/Filter và danh sách các task ban đầu. |
| **Ảnh 3** | **Create Task Form (Đang nhập)** | Bấm nút (+) để mở modal tạo task, nhập đầy đủ thông tin (Title, Description, chọn Priority, chọn Status, Due Date) **trước khi bấm nút Create Task**. |
| **Ảnh 4** | **Task List (Sau khi tạo mới)** | Danh sách task trên màn hình Home ngay sau khi task mới được thêm vào thành công (task mới xuất hiện trên đầu danh sách nhờ Firestore real-time listener). |
| **Ảnh 5** | **Edit Task Form (Đang sửa)** | Bấm vào biểu tượng bút chì (Edit) trên 1 task, hiển thị modal sửa với các thông tin đã được điền sẵn và chỉnh sửa nội dung mới (ví dụ đổi title hoặc status). |
| **Ảnh 6** | **Task List (Sau khi đã sửa)** | Màn hình danh sách task cập nhật nội dung mới vừa sửa thành công. |
| **Ảnh 7** | **Task List (Sau khi xóa)** | Bấm biểu tượng thùng rác (Delete) -> xác nhận xóa -> chụp màn hình task đó đã biến mất khỏi danh sách. |
| **Ảnh 8** | **Bộ lọc Status & Priority (Bonus)** | Chụp màn hình khi chọn lọc theo status (ví dụ chỉ hiện "To Do" hoặc "Completed") và kết quả lọc tương ứng. |
| **Ảnh 9** | **Client-side Form Validation (Bonus)** | Mở modal Create Task, để trống ô Title và bấm Create Task -> hiển thị thông báo lỗi màu đỏ "Task title is required." |
| **Ảnh 10** | **Teams Placeholder Screen** | Bấm tab **Teams** ở thanh điều hướng dưới cùng, hiển thị giao diện placeholder "Coming Soon - Practical Exam 2" với các thẻ thông tin teamId & assigneeId. |
| **Ảnh 11** | **Profile Screen & Navigation Bar** | Bấm tab **Profile** ở thanh điều hướng dưới cùng, hiển thị giao diện hồ sơ sinh viên và thông tin kỹ thuật của dự án. |

---

## 📌 BƯỚC 5: TẠO FILE NỘP BÀI `StudentID_Exam1.docx`

1. Đổi tên file báo cáo theo đúng định dạng: `MãSinhViên_Exam1.docx` (Ví dụ: `QE170123_Exam1.docx` hoặc `SE160999_Exam1.docx`).
2. Mở file mẫu báo cáo `StudentID_Exam1_Report_Template.md` đã được tạo sẵn trong dự án.
3. Chèn các đường link:
   - Link GitHub Repository Public.
   - Link Expo QR / Snack / APK.
4. Chèn 11 ảnh đã chụp ở Bước 4 vào các mục tương ứng và ghi kèm chú thích ngắn gọn (Captions).
5. Lưu file thành định dạng `.docx` và nộp lên hệ thống quản lý học tập (LMS / Edunext) trước hạn chót.
