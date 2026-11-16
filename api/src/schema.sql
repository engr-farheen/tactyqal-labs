CREATE TABLE IF NOT EXISTS posts (
  id           SERIAL PRIMARY KEY,
  title        TEXT        NOT NULL,
  slug         TEXT        NOT NULL UNIQUE,
  excerpt      TEXT        NOT NULL DEFAULT '',
  content      TEXT        NOT NULL,
  cover_image  TEXT,
  source_url   TEXT,
  author       TEXT        NOT NULL DEFAULT 'Tactyqal',
  category     TEXT        NOT NULL DEFAULT 'General',
  tags         TEXT[]      NOT NULL DEFAULT '{}',
  status       TEXT        NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  read_minutes INT         NOT NULL DEFAULT 1,
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  search       TSVECTOR GENERATED ALWAYS AS (
                 to_tsvector('english', title || ' ' || excerpt || ' ' || content)
               ) STORED
);
CREATE INDEX IF NOT EXISTS posts_status_published_idx ON posts (status, published_at DESC);
CREATE INDEX IF NOT EXISTS posts_category_idx ON posts (category);
CREATE INDEX IF NOT EXISTS posts_tags_idx ON posts USING GIN (tags);
CREATE INDEX IF NOT EXISTS posts_search_idx ON posts USING GIN (search);

CREATE TABLE IF NOT EXISTS leads (
  id         SERIAL PRIMARY KEY,
  name       TEXT        NOT NULL,
  email      TEXT        NOT NULL,
  phone      TEXT,
  message    TEXT,
  source     TEXT        NOT NULL DEFAULT 'website',
  status     TEXT        NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS leads_created_idx ON leads (created_at DESC);

ALTER TABLE posts ADD COLUMN IF NOT EXISTS source_url TEXT;
