-- Create specializations table
CREATE TABLE IF NOT EXISTS specializations (
    specialization_id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

-- Junction table for therapist specializations
CREATE TABLE IF NOT EXISTS therapist_specializations (
    therapist_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    specialization_id INTEGER REFERENCES specializations(specialization_id) ON DELETE CASCADE,
    PRIMARY KEY (therapist_id, specialization_id)
);

-- Create availability slots table
CREATE TABLE IF NOT EXISTS availability_slots (
    slot_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    therapist_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    is_recurring BOOLEAN DEFAULT false,
    recurrence_pattern VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
    appointment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    therapist_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    slot_id UUID REFERENCES availability_slots(slot_id) ON DELETE SET NULL,
    scheduled_time TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 50,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')),
    session_type VARCHAR(20) DEFAULT 'video' CHECK (session_type IN ('video', 'audio', 'chat')),
    agenda TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_participants CHECK (patient_id != therapist_id),
    CONSTRAINT valid_duration CHECK (duration_minutes > 0 AND duration_minutes <= 180)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_therapist ON appointments(therapist_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_time ON appointments(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_availability_therapist ON availability_slots(therapist_id);
CREATE INDEX IF NOT EXISTS idx_availability_time ON availability_slots(start_time, end_time);

-- Insert sample specializations
INSERT INTO specializations (name, description) VALUES 
('Anxiety', 'Treatment for anxiety disorders and panic attacks'),
('Depression', 'Treatment for major depressive disorder'),
('PTSD', 'Post-traumatic stress disorder treatment'),
('Relationship Issues', 'Couples counseling and relationship therapy'),
('Addiction', 'Substance abuse and behavioral addiction treatment'),
('OCD', 'Obsessive-compulsive disorder treatment'),
('Eating Disorders', 'Treatment for anorexia, bulimia, and related conditions');
