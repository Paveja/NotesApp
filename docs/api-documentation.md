# Notes App — API Documentation

Base URL: `http://localhost:5000/api`

---

## Health Check

### `GET /health`
Returns server status.

**Response**
```json
{ "status": "ok", "timestamp": "2024-01-15T10:00:00.000Z" }
```

---

## Notes Endpoints

### `GET /api/notes`
Returns all notes ordered by newest first.

**Query Parameters**
| Param | Type   | Description                 |
|-------|--------|-----------------------------|
| `q`   | string | Search term (title/content) |

**Response 200**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "My Note",
      "content": "Note content here",
      "created_at": "2024-01-15 10:00:00",
      "updated_at": "2024-01-15 10:00:00"
    }
  ],
  "count": 1
}
```

---

### `GET /api/notes/:id`
Returns a single note by ID.

**Path Parameters**
| Param | Type    | Description |
|-------|---------|-------------|
| `id`  | integer | Note ID     |

**Response 200**
```json
{
  "success": true,
  "data": { "id": 1, "title": "My Note", "content": "...", "created_at": "...", "updated_at": "..." }
}
```

**Response 404**
```json
{ "success": false, "error": "Note not found." }
```

---

### `POST /api/notes`
Creates a new note.

**Request Body**
```json
{ "title": "My Note Title", "content": "Note content here" }
```

| Field     | Type   | Required | Constraints        |
|-----------|--------|----------|--------------------|
| `title`   | string | ✅       | Max 200 characters |
| `content` | string | ✅       | Non-empty          |

**Response 201**
```json
{
  "success": true,
  "data": { "id": 7, "title": "My Note Title", "content": "Note content here", "created_at": "...", "updated_at": "..." },
  "message": "Note created successfully."
}
```

**Response 400**
```json
{ "success": false, "errors": ["Title is required.", "Content is required."] }
```

---

### `PUT /api/notes/:id`
Updates an existing note (full replacement).

**Path Parameters**
| Param | Type    | Description |
|-------|---------|-------------|
| `id`  | integer | Note ID     |

**Request Body**
```json
{ "title": "Updated Title", "content": "Updated content" }
```

**Response 200**
```json
{
  "success": true,
  "data": { "id": 1, "title": "Updated Title", "content": "Updated content", ... },
  "message": "Note updated successfully."
}
```

---

### `DELETE /api/notes/:id`
Deletes a note by ID.

**Response 200**
```json
{ "success": true, "message": "Note deleted successfully." }
```

**Response 404**
```json
{ "success": false, "error": "Note not found." }
```

---

## Error Response Shape

All error responses follow this format:

```json
{
  "success": false,
  "error": "Human-readable error message"
}
```

Validation errors return an `errors` array:

```json
{
  "success": false,
  "errors": ["Title is required.", "Content is required."]
}
```

## HTTP Status Codes Used

| Code | Meaning                    |
|------|----------------------------|
| 200  | OK                         |
| 201  | Created                    |
| 400  | Bad Request (validation)   |
| 404  | Not Found                  |
| 500  | Internal Server Error      |
