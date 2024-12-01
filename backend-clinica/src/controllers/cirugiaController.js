const pool = require('../config/db');

const cirugiaController = {
    // Obtener todas las cirugías
    getAll: async (req, res) => {
        try {
            const result = await pool.query(`
                SELECT c.*, p.nombre as nombre_pabellon 
                FROM cirugias c 
                LEFT JOIN pabellones p ON c.pabellon_id = p.id 
                ORDER BY fecha_programada DESC
            `);
            res.json(result.rows);
        } catch (error) {
            console.error('Error al obtener cirugías:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    // Crear nueva cirugía programada
    create: async (req, res) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            const {
                paciente_nombre,
                pabellon_id,
                fecha_programada,
                duracion_estimada,
                personal_asignado,
                requiere_aseo_profundo = false,
                es_urgencia = false
            } = req.body;

            // Insertar cirugía
            const cirugiาResult = await client.query(
                `INSERT INTO cirugias 
                (paciente_nombre, pabellon_id, fecha_programada, duracion_estimada, 
                requiere_aseo_profundo, es_urgencia) 
                VALUES ($1, $2, $3, $4, $5, $6) 
                RETURNING *`,
                [paciente_nombre, pabellon_id, fecha_programada, duracion_estimada, 
                requiere_aseo_profundo, es_urgencia]
            );

            const cirugia = cirugiาResult.rows[0];

            // Asignar personal
            for (const asignacion of personal_asignado) {
                await client.query(
                    `INSERT INTO cirugia_personal 
                    (cirugia_id, personal_id, rol) 
                    VALUES ($1, $2, $3)`,
                    [cirugia.id, asignacion.personal_id, asignacion.rol]
                );

                // Actualizar estado del personal a ocupado
                await client.query(
                    'UPDATE personal SET estado = $1 WHERE id = $2',
                    ['ocupado', asignacion.personal_id]
                );
            }

            // Actualizar estado del pabellón
            await client.query(
                'UPDATE pabellones SET estado = $1 WHERE id = $2',
                ['ocupado', pabellon_id]
            );

            await client.query('COMMIT');
            res.status(201).json(cirugia);
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error al crear cirugía:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        } finally {
            client.release();
        }
    },

    // Actualizar estado de cirugía
    updateStatus: async (req, res) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            const { id } = req.params;
            const { estado } = req.body;
            
            const result = await client.query(
                'UPDATE cirugias SET estado = $1 WHERE id = $2 RETURNING *',
                [estado, id]
            );

            if (result.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({ error: 'Cirugía no encontrada' });
            }

            // Si la cirugía se completa o cancela, liberar recursos
            if (estado === 'completada' || estado === 'cancelada') {
                // Liberar personal
                await client.query(
                    `UPDATE personal SET estado = 'disponible' 
                    WHERE id IN (
                        SELECT personal_id FROM cirugia_personal 
                        WHERE cirugia_id = $1
                    )`,
                    [id]
                );

                // Liberar pabellón (ponerlo en aseo)
                await client.query(
                    `UPDATE pabellones SET estado = 'en_aseo' 
                    WHERE id = (
                        SELECT pabellon_id FROM cirugias 
                        WHERE id = $1
                    )`,
                    [id]
                );
            }

            await client.query('COMMIT');
            res.json(result.rows[0]);
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error al actualizar estado:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        } finally {
            client.release();
        }
    },

    // Obtener cirugías por fecha
    getByDate: async (req, res) => {
        try {
            const { fecha } = req.params;
            const result = await pool.query(
                `SELECT c.*, p.nombre as nombre_pabellon 
                FROM cirugias c 
                LEFT JOIN pabellones p ON c.pabellon_id = p.id 
                WHERE DATE(fecha_programada) = $1 
                ORDER BY fecha_programada`,
                [fecha]
            );
            res.json(result.rows);
        } catch (error) {
            console.error('Error al obtener cirugías por fecha:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

module.exports = cirugiaController;