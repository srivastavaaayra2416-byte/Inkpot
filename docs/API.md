# Inkpot REST API Documentation

Base URL: `http://localhost:5000/api`

Inkpot exposes a predictable, clean RESTful API for tasks with uniform response envelopes and structured error handling.

---

## 1. Response Envelope Format

### Standard Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Standard Error Response
All errors follow the shape dictated in PRD Section 6.4:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR | NOT_FOUND | SERVER_ERROR",
    "message": "Human readable description of the error"
  }
}
```

---

## 2. Task Data Model

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `String` / `ObjectId` | Auto | Unique identifier |
| `title` | `String` | **Yes** | Task title, 1 to 120 characters, trimmed |
| `description` | `String` | No | Details or notes (up to 500 characters) |
| `category` | `String` | No | Category tag (e.g. "College", "Design", "Personal") (up to 30 chars) |
| `dueDate` | `Date` (ISO) | No | Optional due date timestamp |
| `completed` | `Boolean` | No | Completion status (defaults to `false`) |
| `createdAt` | `Date` (ISO) | Auto | Timestamp of creation |
| `updatedAt` | `Date` (ISO) | Auto | Timestamp of last modification |

---

## 3. Endpoints

### 3.1 List Tasks
- **Method**: `GET`
- **Endpoint**: `/tasks`
- **Query Parameters**:
  - `completed` (optional, boolean): `true` or `false` to filter by status
  - `q` (optional, string): Search query across title and description
- **Response**: `200 OK`
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "665f1c84b123456789abcdef",
      "title": "Submit Android Club task",
      "description": "PRD compliance and paper UI design",
      "category": "College",
      "dueDate": "2026-11-15T00:00:00.000Z",
      "completed": false,
      "createdAt": "2026-11-09T10:00:00.000Z",
      "updatedAt": "2026-11-09T10:00:00.000Z"
    }
  ]
}
```

---

### 3.2 Get Single Task
- **Method**: `GET`
- **Endpoint**: `/tasks/:id`
- **Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "665f1c84b123456789abcdef",
    "title": "Submit Android Club task",
    "category": "College",
    "completed": false
  }
}
```
- **Error Cases**:
  - `404 NOT_FOUND`: When task does not exist.

---

### 3.3 Create a Task
- **Method**: `POST`
- **Endpoint**: `/tasks`
- **Request Body**:
```json
{
  "title": "Submit Android Club task",
  "description": "Ensure responsive design and rubber stamp animation",
  "category": "College",
  "dueDate": "2026-11-12"
}
```
- **Response**: `201 Created`
```json
{
  "success": true,
  "data": {
    "_id": "665f1c84b123456789abcdef",
    "title": "Submit Android Club task",
    "description": "Ensure responsive design and rubber stamp animation",
    "category": "College",
    "dueDate": "2026-11-12T00:00:00.000Z",
    "completed": false,
    "createdAt": "2026-11-09T10:00:00.000Z",
    "updatedAt": "2026-11-09T10:00:00.000Z"
  }
}
```
- **Error Cases**:
  - `400 VALIDATION_ERROR`: Empty or missing title, or title > 120 chars, description > 500 chars.

---

### 3.4 Update a Task (Inline Edit)
- **Method**: `PUT`
- **Endpoint**: `/tasks/:id`
- **Request Body**:
```json
{
  "title": "Submit polished Android Club task",
  "category": "Priority"
}
```
- **Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "665f1c84b123456789abcdef",
    "title": "Submit polished Android Club task",
    "category": "Priority",
    "completed": false,
    "updatedAt": "2026-11-09T10:05:00.000Z"
  }
}
```
- **Error Cases**:
  - `400 VALIDATION_ERROR`: If empty title is submitted.
  - `404 NOT_FOUND`: Task not found.

---

### 3.5 Flip Completion Status (Rubber Stamp Toggle)
- **Method**: `PATCH`
- **Endpoint**: `/tasks/:id/toggle`
- **Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "665f1c84b123456789abcdef",
    "title": "Submit Android Club task",
    "completed": true,
    "updatedAt": "2026-11-09T10:06:00.000Z"
  }
}
```

---

### 3.6 Delete a Task
- **Method**: `DELETE`
- **Endpoint**: `/tasks/:id`
- **Response**: `204 No Content`
- **Error Cases**:
  - `404 NOT_FOUND`: Task ID does not exist.

---

### 3.7 Clear All Completed Tasks
- **Method**: `DELETE`
- **Endpoint**: `/tasks?completed=true`
- **Response**: `200 OK`
```json
{
  "success": true,
  "message": "All completed tasks cleared",
  "deletedCount": 3
}
```
