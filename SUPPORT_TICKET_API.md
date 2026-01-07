# Support Ticket System - API Documentation

## Tổng quan

Hệ thống Support Ticket cho phép sinh viên tạo phiếu hỗ trợ khi AI chatbot không thể xử lý yêu cầu của họ. Admin/Coordinator của khoa sẽ nhận được thông báo và có thể xử lý ticket.

## 📋 Tóm tắt nhanh - Phân quyền

### 🎓 Chức năng dành cho STUDENT:

- ✅ **Tạo ticket mới** - Khi AI không giải quyết được vấn đề
- ✅ **Xem danh sách tickets** - Chỉ xem được ticket của mình
- ✅ **Xem chi tiết ticket** - Xem trạng thái, ghi chú admin, và giải pháp

### 👨‍🏫 Chức năng dành cho COORDINATOR:

- ✅ **Tất cả chức năng của Student**
- ✅ **Xem tickets của khoa** - Xem tất cả tickets trong khoa mình quản lý
- ✅ **Cập nhật trạng thái** - Thay đổi trạng thái ticket (open → in_progress → resolved → closed)
- ✅ **Thêm ghi chú** - Ghi chú nội bộ về quá trình xử lý
- ✅ **Giải quyết ticket** - Đánh dấu ticket đã được giải quyết với ghi chú
- ✅ **Gán ticket** - Gán ticket cho admin/coordinator khác
- ✅ **Xem thống kê** - Thống kê tickets theo status, priority, category

### 👑 Chức năng dành cho ADMIN:

- ✅ **Tất cả chức năng của Coordinator**
- ✅ **Xem tất cả tickets** - Không giới hạn theo khoa
- ✅ **Xóa ticket** - Quyền xóa ticket (chỉ admin)

---

## Luồng hoạt động

1. **Sinh viên** gặp vấn đề mà AI không giải quyết được
2. **AI** tự động tạo support ticket với context của cuộc hội thoại
3. **Ticket** được gán cho coordinator của khoa sinh viên
4. **Admin/Coordinator** xem ticket, thêm ghi chú, và giải quyết
5. **Sinh viên** được thông báo khi ticket được giải quyết

---

## API Endpoints

### 1. Tạo Support Ticket

**🎓 STUDENT** | **👨‍🏫 COORDINATOR** | **👑 ADMIN**

```http
POST /api/support-tickets
Authorization: Bearer {token}
Content-Type: application/json

{
  "subject": "AI không thể trả lời câu hỏi về học phí",
  "description": "Tôi đã hỏi AI về chính sách miễn giảm học phí nhưng không nhận được câu trả lời rõ ràng",
  "priority": "medium",
  "category": "administrative",
  "aiConversation": {
    "userQuery": "Làm thế nào để xin miễn giảm học phí?",
    "aiResponse": "Xin lỗi, tôi không có thông tin về vấn đề này.",
    "conversationId": "conv_123456"
  },
  "contactInfo": {
    "email": "student@vgu.edu.vn",
    "phoneNumber": "0123456789"
  }
}
```

**Response:**

```json
{
  "status": true,
  "message": "Support ticket created successfully",
  "data": {
    "_id": "ticket_id",
    "student": {
      "_id": "student_id",
      "name": "Nguyen Van A",
      "email": "student@vgu.edu.vn"
    },
    "department": {
      "_id": "dept_id",
      "name": "Computer Science",
      "code": "CS"
    },
    "assignedTo": {
      "_id": "admin_id",
      "name": "Dr. Nguyen",
      "email": "admin@vgu.edu.vn"
    },
    "subject": "AI không thể trả lời câu hỏi về học phí",
    "status": "open",
    "priority": "medium",
    "createdAt": "2026-01-07T12:00:00.000Z"
  }
}
```

---

### 2. Lấy danh sách Tickets

**🎓 STUDENT** | **👨‍🏫 COORDINATOR** | **👑 ADMIN**

```http
GET /api/support-tickets?page=1&limit=10&status=open&priority=high
Authorization: Bearer {token}
```

**Lọc theo role:**

- **🎓 Student**: Chỉ thấy ticket của mình
- **👨‍🏫 Coordinator**: Thấy ticket của khoa mình
- **👑 Admin**: Thấy tất cả tickets

**Query Parameters:**

- `page`: Số trang (default: 1)
- `limit`: Số lượng/trang (default: 10)
- `status`: open | in_progress | resolved | closed
- `priority`: low | medium | high | urgent
- `category`: academic | technical | administrative | other
- `department`: Department ID (chỉ admin)

---

### 3. Xem chi tiết Ticket

**🎓 STUDENT** | **👨‍🏫 COORDINATOR** | **👑 ADMIN**

```http
GET /api/support-tickets/{ticketId}
Authorization: Bearer {token}
```

**Quyền truy cập:**

- **🎓 Student**: Chỉ xem được ticket của mình
- **👨‍🏫 Coordinator**: Xem được ticket của khoa mình
- **👑 Admin**: Xem được tất cả tickets

---

### 4. Cập nhật trạng thái Ticket

**👨‍🏫 COORDINATOR** | **👑 ADMIN**

```http
PUT /api/support-tickets/{ticketId}/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "in_progress"
}
```

**⚠️ Chỉ Coordinator/Admin có quyền**

**Các trạng thái:**

- `open` - Mới tạo
- `in_progress` - Đang xử lý
- `resolved` - Đã giải quyết
- `closed` - Đã đóng

---

### 5. Thêm ghi chú Admin

**👨‍🏫 COORDINATOR** | **👑 ADMIN**

```http
POST /api/support-tickets/{ticketId}/notes
Authorization: Bearer {token}
Content-Type: application/json

{
  "note": "Đã liên hệ với phòng tài chính, sẽ có câu trả lời trong 2 ngày"
}
```

**⚠️ Chỉ Coordinator/Admin có quyền**

---

### 6. Giải quyết Ticket

**👨‍🏫 COORDINATOR** | **👑 ADMIN**

```http
PUT /api/support-tickets/{ticketId}/resolve
Authorization: Bearer {token}
Content-Type: application/json

{
  "resolutionNote": "Đã hướng dẫn sinh viên quy trình xin miễn giảm học phí qua email"
}
```

**⚠️ Chỉ Coordinator/Admin có quyền**

---

### 7. Gán Ticket cho Admin khác

**👨‍🏫 COORDINATOR** | **👑 ADMIN**

```http
PUT /api/support-tickets/{ticketId}/assign
Authorization: Bearer {token}
Content-Type: application/json

{
  "adminId": "admin_user_id"
}
```

**⚠️ Chỉ Coordinator/Admin có quyền**

---

### 8. Xóa Ticket

**👑 ADMIN ONLY**

```http
DELETE /api/support-tickets/{ticketId}
Authorization: Bearer {token}
```

**⚠️ Chỉ Admin có quyền**

---

### 9. Thống kê Tickets

**👨‍🏫 COORDINATOR** | **👑 ADMIN**

```http
GET /api/support-tickets/stats
Authorization: Bearer {token}
```

**⚠️ Chỉ Coordinator/Admin có quyền**

**Response:**

```json
{
  "status": true,
  "message": "Ticket statistics retrieved successfully",
  "data": {
    "total": 45,
    "byStatus": [
      { "_id": "open", "count": 12 },
      { "_id": "in_progress", "count": 8 },
      { "_id": "resolved", "count": 20 },
      { "_id": "closed", "count": 5 }
    ],
    "byPriority": [
      { "_id": "low", "count": 10 },
      { "_id": "medium", "count": 20 },
      { "_id": "high", "count": 12 },
      { "_id": "urgent", "count": 3 }
    ],
    "byCategory": [
      { "_id": "academic", "count": 15 },
      { "_id": "technical", "count": 10 },
      { "_id": "administrative", "count": 12 },
      { "_id": "other", "count": 8 }
    ]
  }
}
```

## Tích hợp với AI Chatbot

Khi AI không thể trả lời câu hỏi, frontend nên:

1. Hiển thị nút "Tạo phiếu hỗ trợ"
2. Tự động điền thông tin:
   - Subject: Tóm tắt câu hỏi
   - Description: Chi tiết vấn đề
   - aiConversation: Context của cuộc hội thoại
3. Gọi API tạo ticket
4. Thông báo cho user rằng ticket đã được tạo

## Ví dụ tích hợp Frontend

```javascript
// Khi AI không thể trả lời
const createSupportTicketFromAI = async (conversation) => {
  try {
    const response = await fetch("/api/support-tickets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject: `Câu hỏi về: ${conversation.userQuery.substring(0, 50)}...`,
        description: `AI không thể trả lời câu hỏi sau:\n\n${conversation.userQuery}`,
        priority: "medium",
        category: "other",
        aiConversation: {
          userQuery: conversation.userQuery,
          aiResponse: conversation.aiResponse,
          conversationId: conversation.id,
        },
      }),
    });

    const data = await response.json();

    if (data.status) {
      alert("Phiếu hỗ trợ đã được tạo! Admin sẽ liên hệ với bạn sớm.");
    }
  } catch (error) {
    console.error("Error creating ticket:", error);
  }
};
```

## Quyền hạn

| Hành động           | Student | Coordinator | Admin |
| ------------------- | ------- | ----------- | ----- |
| Tạo ticket          | ✅      | ✅          | ✅    |
| Xem ticket của mình | ✅      | ✅          | ✅    |
| Xem ticket của khoa | ❌      | ✅          | ✅    |
| Xem tất cả tickets  | ❌      | ❌          | ✅    |
| Cập nhật status     | ❌      | ✅          | ✅    |
| Thêm ghi chú        | ❌      | ✅          | ✅    |
| Giải quyết ticket   | ❌      | ✅          | ✅    |
| Gán ticket          | ❌      | ✅          | ✅    |
| Xóa ticket          | ❌      | ❌          | ✅    |

## Database Schema

```javascript
{
  student: ObjectId,           // Sinh viên tạo ticket
  department: ObjectId,         // Khoa của sinh viên
  assignedTo: ObjectId,         // Admin được gán
  subject: String,              // Tiêu đề
  description: String,          // Mô tả chi tiết
  aiConversation: {             // Context từ AI
    userQuery: String,
    aiResponse: String,
    conversationId: String
  },
  status: String,               // open, in_progress, resolved, closed
  priority: String,             // low, medium, high, urgent
  category: String,             // academic, technical, administrative, other
  contactInfo: {
    email: String,
    phoneNumber: String
  },
  adminNotes: [{                // Ghi chú của admin
    admin: ObjectId,
    note: String,
    createdAt: Date
  }],
  resolution: {                 // Thông tin giải quyết
    resolvedBy: ObjectId,
    resolvedAt: Date,
    resolutionNote: String
  },
  createdAt: Date,
  updatedAt: Date,
  closedAt: Date
}
```

## Testing

Sử dụng Swagger UI tại: `http://localhost:5000/api-docs`

Hoặc test với curl:

```bash
# Tạo ticket
curl -X POST http://localhost:5000/api/support-tickets \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Test ticket",
    "description": "This is a test",
    "priority": "medium"
  }'
```
