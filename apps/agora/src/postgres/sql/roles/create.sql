INSERT INTO roles (name, is_privileged)
VALUES ($1, $2)
RETURNING *