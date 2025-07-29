-- Social media app structure:
CREATE TABLE users (
  id UUID PRIMARY KEY,
  username TEXT UNIQUE,
  email TEXT UNIQUE
);

CREATE TABLE posts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,  -- User's posts
  content TEXT
);

CREATE TABLE comments (
  id UUID PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,  -- Comments on posts
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,  -- Who commented
  content TEXT
);

CREATE TABLE likes (
  id UUID PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,  -- Likes on posts
  user_id UUID REFERENCES users(id) ON DELETE CASCADE   -- Who liked
);