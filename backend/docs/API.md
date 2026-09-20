# DevFlow API examples

All protected requests use:

```http
Authorization: Bearer <JWT>
Content-Type: application/json
```

## Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Alex Developer",
  "email": "alex@example.com",
  "password": "strong-password"
}
```

## Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "alex@example.com",
  "password": "strong-password"
}
```

## Create project

```http
POST /api/projects
Authorization: Bearer <JWT>
Content-Type: application/json

{
  "name": "Developer Portal",
  "description": "Internal productivity platform",
  "status": "Active"
}
```

## Create task

```http
POST /api/tasks
Authorization: Bearer <JWT>
Content-Type: application/json

{
  "title": "Build authentication screen",
  "description": "Create responsive login and registration UI",
  "project": "<PROJECT_ID>",
  "priority": "High",
  "status": "todo",
  "dueDate": "2026-10-15"
}
```

## Update task status

```http
PATCH /api/tasks/<TASK_ID>/status
Authorization: Bearer <JWT>
Content-Type: application/json

{
  "status": "done"
}
```

## Generate AI tasks

```http
POST /api/ai/generate-tasks
Authorization: Bearer <JWT>
Content-Type: application/json

{
  "projectId": "<PROJECT_ID>",
  "count": 8
}
```

## Analytics

```http
GET /api/analytics
Authorization: Bearer <JWT>
```
