const pool = require('../config/db');

const eventoController = {
    // Crear nuevo evento
    create: async (req, res) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            const { cirugia_id, tipo_evento, descripcion } = req.body;
            
            // Registrar el evento
            const eventoResult = await client.query(
                `INSERT INTO eventos (cirugia_id, tipo_evento, descripcion) 
                VALUES ($1, $2, $3) RETURNING *`,
                [cirugia_id, tipo_evento, descripcion]
            );

            // Actualizar estados según el tipo de evento
            switch (tipo_evento) {
                case 'extension_tiempo':
                    await client.query(
                        `UPDATE cirugias 
                        SET duracion_estimada = duracion_estimada + $1 
                        WHERE id = $2`,
                        [parseInt(descripcion), cirugia_id]
                    );
                    break;
                case 'requiere_aseo_profundo':
                    await client.query(
                        `UPDATE cirugias 
                        SET requiere_aseo_profundo = true 
                        WHERE id = $1`,
                        [cirugia_id]
                    );
                    break;
                case 'complicacion':
                    // Solo registramos el evento, no cambiamos estado
                    break;
                case 'cancelacion':
                    await client.query(
                        `UPDATE cirugias 
                        SET estado = 'cancelada' 
                        WHERE id = $1`,
                        [cirugia_id]
                    );
                    break;
            }

            await client.query('COMMIT');
            res.status(201).json(eventoResult.rows[0]);
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error al crear evento:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        } finally {
            client.release();
        }
    },

    // Obtener eventos de una cirugía
    getByCirugia: async (req, res) => {
        try {
            const { cirugia_id } = req.params;
            const result = await pool.query(
                'SELECT * FROM eventos WHERE cirugia_id = $1 ORDER BY created_at DESC',
                [cirugia_id]
            );
            res.json(result.rows);
        } catch (error) {
            console.error('Error al obtener eventos:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

module.exports = eventoController;