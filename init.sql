-- =============================
-- Schema cho hệ thống Auto Login (PostgreSQL)
-- =============================

-- 1. Tạo ENUM cho role
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Bảng users
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(128) NOT NULL,
  role user_role DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Thêm tài khoản admin mẫu (dùng pgcrypto để hash password)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO users (username, password, role)
SELECT 'admin', crypt('admin123', gen_salt('bf')), 'admin'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin');

INSERT INTO users (username, password, role)
SELECT 'user1', crypt('user123', gen_salt('bf')), 'user'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'user1');

-- 4. Bảng stats
CREATE TABLE IF NOT EXISTS stats (
  id SERIAL PRIMARY KEY,
  pheduyet INT DEFAULT 0,
  duyetcode INT DEFAULT 0,
  captcha INT DEFAULT 0,
  saimk INT DEFAULT 0,
  thanhcong INT DEFAULT 0,
  visits INT DEFAULT 0,
  otpOK INT DEFAULT 0,
  otpFail INT DEFAULT 0,
  online INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Thêm dữ liệu mẫu cho stats nếu chưa có
INSERT INTO stats (pheduyet, duyetcode, captcha, saimk, thanhcong, visits, otpOK, otpFail, online, updated_at)
SELECT 1, 2, 0, 0, 1, 10, 7, 3, 2, NOW()
WHERE NOT EXISTS (SELECT 1 FROM stats);

-- 5. Bảng logs
CREATE TABLE IF NOT EXISTS logs (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50),
  time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip VARCHAR(45),
  status VARCHAR(32)
);

-- Thêm log mẫu nếu chưa có
INSERT INTO logs (username, ip, status)
SELECT 'user1', '127.0.0.1', 'OK'
WHERE NOT EXISTS (SELECT 1 FROM logs WHERE username = 'user1' AND ip = '127.0.0.1');
