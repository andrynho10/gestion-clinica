-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    rol VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Pabellones
CREATE TABLE IF NOT EXISTS pabellones (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    tipo VARCHAR(50) NOT NULL, -- grande, obstetricia, ambulatorio, hemodinamica
    estado VARCHAR(20) DEFAULT 'disponible', -- disponible, ocupado, en_aseo, mantenimiento
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Personal
CREATE TABLE IF NOT EXISTS personal (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL, -- cirujano, anestesista, enfermera, arsenalero, pabellonero, tecnico_anestesia
    estado VARCHAR(20) DEFAULT 'disponible',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Cirugías
CREATE TABLE IF NOT EXISTS cirugias (
    id SERIAL PRIMARY KEY,
    paciente_nombre VARCHAR(100),
    pabellon_id INTEGER REFERENCES pabellones(id),
    fecha_programada TIMESTAMP NOT NULL,
    duracion_estimada INTEGER NOT NULL, -- en minutos
    estado VARCHAR(20) DEFAULT 'programada', -- programada, en_proceso, completada, cancelada
    requiere_aseo_profundo BOOLEAN DEFAULT false,
    es_urgencia BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Asignación de Personal a Cirugías
CREATE TABLE IF NOT EXISTS cirugia_personal (
    id SERIAL PRIMARY KEY,
    cirugia_id INTEGER REFERENCES cirugias(id),
    personal_id INTEGER REFERENCES personal(id),
    rol VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Eventos
CREATE TABLE IF NOT EXISTS eventos (
    id SERIAL PRIMARY KEY,
    cirugia_id INTEGER REFERENCES cirugias(id),
    tipo_evento VARCHAR(50) NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);