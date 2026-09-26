-- +goose Up
ALTER TABLE identity.users ADD COLUMN IF NOT EXISTS nickname VARCHAR(100) NOT NULL DEFAULT '';

-- +goose Down
ALTER TABLE identity.users DROP COLUMN IF EXISTS nickname;
