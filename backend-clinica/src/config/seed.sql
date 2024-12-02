
-- Insertar salas grandes (16)
INSERT INTO pabellones (nombre, tipo, estado)
SELECT 
    'Sala Grande ' || generate_series(1,16),
    'grande',
    'disponible'
WHERE NOT EXISTS (
    SELECT 1 FROM pabellones WHERE tipo = 'grande'
);

-- Insertar salas de obstetricia (8)
INSERT INTO pabellones (nombre, tipo, estado)
SELECT 
    'Sala Obstetricia ' || generate_series(1,8),
    'obstetricia',
    'disponible'
WHERE NOT EXISTS (
    SELECT 1 FROM pabellones WHERE tipo = 'obstetricia'
);

-- Insertar quirófanos ambulatorios (6)
INSERT INTO pabellones (nombre, tipo, estado)
SELECT 
    'Quirófano Ambulatorio ' || generate_series(1,6),
    'ambulatorio',
    'disponible'
WHERE NOT EXISTS (
    SELECT 1 FROM pabellones WHERE tipo = 'ambulatorio'
);

-- Insertar sala de hemodinámica (1)
INSERT INTO pabellones (nombre, tipo, estado)
SELECT 
    'Sala Hemodinámica 1',
    'hemodinamica',
    'disponible'
WHERE NOT EXISTS (
    SELECT 1 FROM pabellones WHERE tipo = 'hemodinamica'
);

-- Insertar personal de prueba
INSERT INTO personal (nombre, tipo, estado)
VALUES 
    ('Dr. Juan Pérez', 'cirujano', 'disponible'),
    ('Dr. María González', 'cirujano', 'disponible'),
    ('Dr. Carlos Rodríguez', 'anestesista', 'disponible'),
    ('Dr. Ana Martínez', 'anestesista', 'disponible'),
    ('Enf. Laura Torres', 'enfermera', 'disponible'),
    ('Enf. Pedro Soto', 'enfermera', 'disponible'),
    ('Tec. Carmen Luna', 'arsenalero', 'disponible'),
    ('Tec. Roberto Díaz', 'pabellonero', 'disponible'),
    ('Tec. Sandra Vega', 'tecnico_anestesia', 'disponible')
WHERE NOT EXISTS (
    SELECT 1 FROM personal LIMIT 1
);