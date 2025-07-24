-- Kenyan SDA Songs Database Schema
-- File: db/migrations/001_initial_schema.sql

-- Main songs table
CREATE TABLE songs (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  title TEXT NOT NULL,
  artist TEXT,
  composer TEXT,
  lyrics TEXT,
  youtube_link TEXT,
  audio_link TEXT,
  language TEXT NOT NULL DEFAULT 'swahili', -- swahili, english, kikuyu, luo, etc.
  region TEXT, -- central, coast, nyanza, rift_valley, eastern, northeastern, western, nairobi
  category TEXT DEFAULT 'praise', -- praise, worship, sabbath, youth, choir, evangelism, funeral, wedding
  tags TEXT, -- JSON array of tags like ["uplifting", "traditional", "modern"]
  duration INTEGER, -- in seconds
  view_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'active', -- active, pending, archived
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table for better organization
CREATE TABLE categories (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT, -- emoji or icon class
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Languages table
CREATE TABLE languages (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE, -- sw, en, ki, luo, etc.
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Regions table for Kenyan counties/regions
CREATE TABLE regions (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contributors table (for people who add songs)
CREATE TABLE contributors (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT NOT NULL,
  email TEXT,
  github_username TEXT,
  bio TEXT,
  contributions_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Song contributions tracking
CREATE TABLE song_contributions (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  song_id TEXT NOT NULL,
  contributor_id TEXT NOT NULL,
  contribution_type TEXT NOT NULL, -- added, lyrics_updated, info_corrected, etc.
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (song_id) REFERENCES songs (id) ON DELETE CASCADE,
  FOREIGN KEY (contributor_id) REFERENCES contributors (id) ON DELETE CASCADE
);

-- Playlists (for future feature)
CREATE TABLE playlists (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  songs TEXT, -- JSON array of song IDs
  created_by TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES contributors (id)
);

-- Insert default categories
INSERT INTO categories (name, description, icon, sort_order) VALUES
('Praise & Worship', 'Songs of praise and worship to God', '🙏', 1),
('Sabbath Songs', 'Special songs for Sabbath worship', '📅', 2),
('Youth Songs', 'Contemporary songs for young people', '🎵', 3),
('Choir Anthems', 'Traditional choir compositions', '🎼', 4),
('Evangelism', 'Songs for outreach and evangelism', '📢', 5),
('Funeral Songs', 'Comforting songs for farewell services', '🕊️', 6),
('Wedding Songs', 'Joyful songs for marriage ceremonies', '💒', 7),
('Children Songs', 'Songs for Sabbath School and children', '👶', 8),
('Seasonal Songs', 'Christmas, Easter, and other seasonal songs', '🎄', 9);

-- Insert default languages
INSERT INTO languages (name, code) VALUES
('Swahili', 'sw'),
('English', 'en'),
('Kikuyu', 'ki'),
('Luo', 'luo'),
('Luhya', 'luy'),
('Kamba', 'kam'),
('Kalenjin', 'kal'),
('Kisii', 'guz'),
('Meru', 'mer'),
('Embu', 'ebu');

-- Insert Kenyan regions
INSERT INTO regions (name, description) VALUES
('Central Kenya', 'Kiambu, Murang''a, Nyeri, Kirinyaga, Nyandarua'),
('Coast Region', 'Mombasa, Kwale, Kilifi, Tana River, Lamu, Taita-Taveta'),
('Eastern Region', 'Machakos, Kitui, Makueni, Embu, Tharaka-Nithi, Meru, Isiolo'),
('Nairobi Region', 'Nairobi County'),
('North Eastern', 'Garissa, Wajir, Mandera'),
('Nyanza Region', 'Kisumu, Siaya, Migori, Homa Bay, Kisii, Nyamira'),
('Rift Valley', 'Nakuru, Uasin Gishu, Trans Nzoia, Turkana, West Pokot, Samburu'),
('Western Region', 'Kakamega, Vihiga, Bungoma, Busia');

-- Create indexes for better performance
CREATE INDEX idx_songs_language ON songs(language);
CREATE INDEX idx_songs_category ON songs(category);
CREATE INDEX idx_songs_region ON songs(region);
CREATE INDEX idx_songs_status ON songs(status);
CREATE INDEX idx_songs_featured ON songs(is_featured);
CREATE INDEX idx_songs_title ON songs(title);
CREATE INDEX idx_songs_artist ON songs(artist);
CREATE INDEX idx_song_contributions_song_id ON song_contributions(song_id);
CREATE INDEX idx_song_contributions_contributor_id ON song_contributions(contributor_id);

-- Full-text search index (if supported)
CREATE VIRTUAL TABLE songs_fts USING fts5(
  title, 
  artist, 
  composer, 
  lyrics, 
  content=songs, 
  content_rowid=rowid
);

-- Trigger to keep FTS table updated
CREATE TRIGGER songs_fts_insert AFTER INSERT ON songs BEGIN
  INSERT INTO songs_fts(rowid, title, artist, composer, lyrics) 
  VALUES (new.rowid, new.title, new.artist, new.composer, new.lyrics);
END;

CREATE TRIGGER songs_fts_delete AFTER DELETE ON songs BEGIN
  INSERT INTO songs_fts(songs_fts, rowid, title, artist, composer, lyrics) 
  VALUES('delete', old.rowid, old.title, old.artist, old.composer, old.lyrics);
END;

CREATE TRIGGER songs_fts_update AFTER UPDATE ON songs BEGIN
  INSERT INTO songs_fts(songs_fts, rowid, title, artist, composer, lyrics) 
  VALUES('delete', old.rowid, old.title, old.artist, old.composer, old.lyrics);
  INSERT INTO songs_fts(rowid, title, artist, composer, lyrics) 
  VALUES (new.rowid, new.title, new.artist, new.composer, new.lyrics);
END;