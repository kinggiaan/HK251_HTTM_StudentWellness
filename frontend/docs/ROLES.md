## User Roles and Permissions (Matrix)

Legend: Yes = allowed · No = not allowed

<!-- START_MATRIX (auto-generated; do not edit rows below manually) -->\n| Feature | Admin | Consultant | Teacher | Data Scientist |\n|---|---|---|---|---|\n| users.manage | Yes | No | No | No |\n| students.viewAll | Yes | No | Yes | Yes |\n| students.create | Yes | Yes | No | No |\n| students.update | Yes | Yes | No | No |\n| students.delete | Yes | Yes | No | No |\n| students.export | Yes | Yes | No | Yes |\n| students.import | Yes | No | No | No |\n| records.viewAll | Yes | No | Yes | No |\n| records.create | Yes | Yes | No | No |\n| records.update | Yes | Yes | No | No |\n| records.delete | Yes | Yes | No | No |\n| sessions.manageOwn | Yes | Yes | No | No |\n| analytics.viewAll | Yes | No | Yes | Yes |\n| mlModels.manage | Yes | No | No | Yes |\n| datasets.manage | Yes | No | No | Yes |\n<!-- END_MATRIX -->

### Frontend Role Mapping

- Mapping in `src/App.tsx`:
  - consultant -> consultant
  - teacher_supervisor -> teacher
  - data_scientist -> dataScientist
  - admin -> consultant (admin uses the consultant dashboard by default)

### Backend Role Enum

- Defined in `backend/prisma/schema.prisma`:
  - `enum UserRole { consultant, teacher_supervisor, data_scientist, admin }`

### How to apply changes

1) Update this matrix (single source of truth).
2) Backend: update Prisma enum + authorization checks, run migrations if needed.
3) Frontend: update `roleMap` in `src/App.tsx` and feature visibility in components.
4) Seed/tests: adjust `backend/prisma/seed.ts` and tests referencing roles.

### Admin visibility

- Admin is developer-only and not shown in end-user navigation.
- Admins are routed to the Admin Console for configuring the permission matrix (`src/components/AdminConsole.tsx`). 


