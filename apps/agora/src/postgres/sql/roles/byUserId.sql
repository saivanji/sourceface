SELECT r.* AS result FROM roles AS r
INNER JOIN users AS u ON (u.role_id = r.id)
WHERE u.id = $1