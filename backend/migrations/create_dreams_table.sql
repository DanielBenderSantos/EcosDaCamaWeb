CREATE TABLE IF NOT EXISTS dreams (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  mood VARCHAR(20),
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (now() at time zone 'utc')
);
