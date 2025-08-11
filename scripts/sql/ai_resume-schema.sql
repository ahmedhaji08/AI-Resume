-- 1. Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'user', -- user/admin
    linkedin_id VARCHAR(255),
    profile_picture TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Resumes table
CREATE TABLE resumes (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    ai_generated_content TEXT,
    uploaded_document TEXT,
    template_used VARCHAR(50),
    last_updated TIMESTAMP DEFAULT NOW()
);

-- 3. LinkedIn Profiles table
CREATE TABLE linkedin_profiles (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    headline TEXT,
    summary TEXT,
    experience JSONB,
    education JSONB,
    skills TEXT[],
    last_synced TIMESTAMP DEFAULT NOW()
);

-- 4. Payments table
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    payment_status VARCHAR(20) DEFAULT 'pending', -- pending, success, failed
    payment_method VARCHAR(50),
    transaction_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 5. Analytics table
CREATE TABLE analytics (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(255) NOT NULL,
    details JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
