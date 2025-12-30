# Student Info - Description

## Table of Contents

- [1. Administrator (Quản trị viên)](#1-administrator-quản-trị-viên)
  - [1.1. UC: Quản lý Thống kê (Statistics Management)](#11-uc-quản-lý-thống-kê-statistics-management)
  - [1.2. UC: Quản lý Người dùng (User Management)](#12-uc-quản-lý-người-dùng-user-management)
  - [1.3. UC: Quản lý Khoa/Phòng ban (Department Management)](#13-uc-quản-lý-khoaphòng-ban-department-management)
  - [1.4. UC: Quản lý Đề tài (Topic Management)](#14-uc-quản-lý-đề-tài-topic-management)
- [2. Coordinator (Quản lý Khoa)](#2-coordinator-quản-lý-khoa)
  - [2.1. UC: Quản lý Dashboard Khoa (Department Dashboard)](#21-uc-quản-lý-dashboard-khoa-department-dashboard)
  - [2.2. UC: Quản lý Đề tài Khoa (Department Topic Management)](#22-uc-quản-lý-đề-tài-khoa-department-topic-management)
- [3. Student (Sinh viên)](#3-student-sinh-viên)
  - [3.1. UC: Quản lý Dashboard cá nhân (Student Dashboard)](#31-uc-quản-lý-dashboard-cá-nhân-student-dashboard)
  - [3.2. UC: Khám phá & Tương tác Đề tài (Topic Discovery)](#32-uc-khám-phá--tương-tác-đề-tài-topic-discovery)
  - [3.3. UC: Trợ lý ảo AI (AI Chat Assistant)](#33-uc-trợ-lý-ảo-ai-ai-chat-assistant)

---

## 1. Administrator (Quản trị viên)

Administrator là role có quyền hạn cao nhất, chịu trách nhiệm quản lý dữ liệu nền tảng và giám sát hệ thống.

### 1.1. UC: Quản lý Thống kê (Statistics Management)

Admin theo dõi và phân tích dữ liệu toàn hệ thống.

- **Sub-UC 1: Xem Dashboard tổng quan**: Hiển thị nhanh các chỉ số KPI (số lượng Users, Departments, Active Topics).
- **Sub-UC 2: Xem biểu đồ so sánh**: So sánh hiệu suất giữa các khoa (Department Comparison Chart).
- **Sub-UC 3: Xem xu hướng đăng ký**: Theo dõi số lượng sinh viên đăng ký theo thời gian (Student Registration Chart).
- **Sub-UC 4: Xem thống kê hoạt động**: Thống kê hiệu quả của Học bổng & Sự kiện.

### 1.2. UC: Quản lý Người dùng (User Management)

Admin thực hiện các tác vụ CRUD trên tài khoản người dùng.

- **Sub-UC 1: Xem danh sách người dùng**: Hiển thị bảng danh sách Admin, Coordinator, Student.
- **Sub-UC 2: Lọc & Tìm kiếm người dùng**: Tìm kiếm theo tên, email hoặc lọc theo Role/Khoa.
- **Sub-UC 3: Thêm người dùng mới**: Tạo tài khoản và cấp quyền truy cập.
- **Sub-UC 4: Chỉnh sửa thông tin**: Cập nhật hồ sơ, đổi mật khẩu hoặc phân quyền lại.
- **Sub-UC 5: Xóa/Vô hiệu hóa người dùng**: Loại bỏ tài khoản khỏi hệ thống.

### 1.3. UC: Quản lý Khoa/Phòng ban (Department Management)

Admin cấu hình cơ cấu tổ chức của trường.

- **Sub-UC 1: Xem danh sách Khoa**: Liệt kê toàn bộ các khoa hiện có.
- **Sub-UC 2: Thêm mới Khoa**: Tạo phòng ban mới trong hệ thống.
- **Sub-UC 3: Cập nhật thông tin Khoa**: Sửa tên, thông tin liên hệ.
- **Sub-UC 4: Xóa Khoa**: Xóa bỏ phòng ban không còn hoạt động.

### 1.4. UC: Quản lý Đề tài (Topic Management)

Admin có quyền quản lý toàn bộ các đề tài trong hệ thống thuộc các loại hình: `event`, `scholarship`, `notification`, `job`, `advertisement`, `internship`, `recruitment`, `volunteer`, `extracurricular`.

- **Sub-UC 1: Xem danh sách Đề tài**: Liệt kê toàn bộ đề tài trên hệ thống, hỗ trợ lọc theo các loại hình nêu trên.
- **Sub-UC 2: Thêm mới Đề tài**: Tạo đề tài mới (Admin có thể tạo thay cho Coordinator nếu cần).
- **Sub-UC 3: Cập nhật thông tin Đề tài**: Chỉnh sửa nội dung, tiêu đề, hoặc phân loại của đề tài.
- **Sub-UC 4: Xóa Đề tài**: Xóa bỏ các đề tài vi phạm quy định hoặc nội dung cũ.

---

## 2. Coordinator (Quản lý Khoa)

Role chịu trách nhiệm trực tiếp về các hoạt động và sinh viên thuộc khoa của mình.

### 2.1. UC: Quản lý Dashboard Khoa (Department Dashboard)

- **Sub-UC 1: Xem tổng quan Khoa**: Theo dõi các chỉ số riêng của khoa (Events active, Scholarships active).
- **Sub-UC 2: Xem dòng thời gian hoạt động**: Theo dõi lịch sử hoạt động gần nhất (Recent Activity).
- **Sub-UC 3: Truy cập nhanh (Quick Actions)**: Điều hướng nhanh đến các trang quản lý chức năng.

### 2.2. UC: Quản lý Đề tài Khoa (Department Topic Management)

Coordinator quản lý toàn bộ các đề tài trong phạm vi khoa, bao gồm các loại hình: `event`, `scholarship`, `notification` và các loại khác.

- **Sub-UC 1: Xem danh sách Đề tài**: Liệt kê toàn bộ đề tài của khoa với đầy đủ các trạng thái.
- **Sub-UC 2: Lọc & Tìm kiếm Đề tài**: Tìm kiếm theo từ khóa hoặc lọc theo loại (Sự kiện, Học bổng, Thông báo...) để quản lý hiệu quả.
- **Sub-UC 3: Thêm mới Đề tài**: Tạo đề tài mới cho khoa (bao gồm tạo sự kiện, học bổng, thông báo, v.v.).
- **Sub-UC 4: Cập nhật thông tin**: Chỉnh sửa tiêu đề, nội dung, thời gian hoặc các thuộc tính khác của đề tài.
- **Sub-UC 5: Xóa Đề tài**: Xóa bỏ các đề tài thuộc thẩm quyền quản lý của khoa.

---

## 3. Student (Sinh viên)

Role tập trung vào việc tra cứu thông tin và tương tác với các cơ hội học tập.

### 3.1. UC: Quản lý Dashboard cá nhân (Student Dashboard)

- **Sub-UC 1: Xem thống kê cá nhân**: Hiển thị số lượng đề tài đã lưu, sự kiện đã tham gia.
- **Sub-UC 2: Nhận thông báo (Updates)**: Xem feed thông báo mới nhất từ khoa.

### 3.2. UC: Khám phá & Tương tác Đề tài (Topic Discovery)

- **Sub-UC 1: Xem danh sách Đề tài**: Duyệt danh sách các đề tài thực tập/nghiên cứu.
- **Sub-UC 2: Lọc & Tìm kiếm Đề tài**:
  - Lọc theo loại (Research, Internship, Capstone).
  - Tìm theo từ khóa.
- **Sub-UC 3: Xem chi tiết Đề tài**: Mở Dialog xem đầy đủ thông tin (Yêu cầu, GVHD, Deadline).
- **Sub-UC 4: Lưu/Bỏ lưu Đề tài (Save/Unsave)**: Quản lý danh sách đề tài quan tâm (Wishlist).

### 3.3. UC: Trợ lý ảo AI (AI Chat Assistant)

- **Sub-UC 1: Tương tác hỏi đáp**: Sinh viên đặt câu hỏi và nhận câu trả lời từ AI về các vấn đề liên quan đến học vụ, quy trình.
- **Sub-UC 2: Hỗ trợ tìm kiếm thông tin**: AI hỗ trợ tra cứu nhanh thông tin đề tài, sự kiện hoặc thông báo.

---
