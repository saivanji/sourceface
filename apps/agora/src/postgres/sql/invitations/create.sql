INSERT INTO invitations (id, email, expires_at, role_id)
VALUES ($1, $2, $3, $4)
RETURNING *