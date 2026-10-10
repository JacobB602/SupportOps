-- Link support tickets to the user who reported the issue.
-- The user's school and organization can then be resolved
-- through the existing foreign-key relationships.

ALTER TABLE tickets
ADD COLUMN user_id INTEGER REFERENCES users(id);

-- Index the new relationship for efficient ticket lookups.
CREATE INDEX idx_tickets_user_id ON tickets(user_id);
