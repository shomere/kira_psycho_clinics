-- Create users table for Kira Psycho Clinics
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
DO $$ BEGIN
    CREATE TYPE user_status_enum AS ENUM ('active', 'inactive', 'suspended');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_type_enum AS ENUM ('patient', 'therapist');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50),
    profile_picture_url TEXT,
    date_registered TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ,
    status user_status_enum DEFAULT 'active',
    user_type user_type_enum NOT NULL,
    
    -- Patient-specific fields
    date_of_birth DATE,
    emergency_contact TEXT,
    
    -- Therapist-specific fields
    license_number VARCHAR(100),
    qualifications TEXT,
    bio TEXT,
    hourly_rate DECIMAL(10, 2),
    is_verified BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
-- Create users table for Kira Psycho Clinics
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
DO $$ BEGIN
    CREATE TYPE user_status_enum AS ENUM ('active', 'inactive', 'suspended');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_type_enum AS ENUM ('patient', 'therapist');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50),
    profile_picture_url TEXT,
    date_registered TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ,
    status user_status_enum DEFAULT 'active',
    user_type user_type_enum NOT NULL,
    
    -- Patient-specific fields
    date_of_birth DATE,
    emergency_contact TEXT,
    
    -- Therapist-specific fields
    license_number VARCHAR(100),
    qualifications TEXT,
    bio TEXT,
    hourly_rate DECIMAL(10, 2),
    is_verified BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);