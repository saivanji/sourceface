INSERT INTO users (username, email, password, role_id)
VALUES ($1, $2, $3, $4)
RETURNING *;