CREATE TABLE IF NOT EXISTS "user" (
	id SERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	username VARCHAR(50) NOT NULL UNIQUE,
	password_hash VARCHAR(255) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- First, create the function
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Then, add the trigger to your table
CREATE TRIGGER set_updated_at BEFORE	
UPDATE ON "user" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();