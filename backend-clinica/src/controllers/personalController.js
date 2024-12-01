const pool = require('../config/db');

const personalController = {
    // Obtener todo el personal
    getAll: async (req, res) => {
        try {
            const result = await pool.query('SELECT * FROM personal ORDER BY tipo, nombre');
            res.json(result.rows);
        } catch (error) {
            console.error('Error al obtener personal:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    // Obtener personal por ID
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await pool.query('SELECT * FROM personal WHERE id = $1', [id]);
            
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Personal no encontrado' });
            }
            
            res.json(result.rows[0]);
        } catch (error) {
            console.error('Error al obtener personal:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    // Obtener personal disponible por tipo
    getDisponible: async (req, res) => {
        try {
            const { tipo } = req.params;
            const result = await pool.query(
                'SELECT * FROM personal WHERE tipo = $1 AND estado = $2',
                [tipo, 'disponible']
            );
            res.json(result.rows);
        } catch (error) {
            console.error('Error al obtener personal disponible:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    // Actualizar estado del personal
    updateStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { estado } = req.body;
            
            const result = await pool.query(
                'UPDATE personal SET estado = $1 WHERE id = $2 RETURNING *',
                [estado, id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Personal no encontrado' });
            }

            res.json(result.rows[0]);
        } catch (error) {
            console.error('Error al actualizar estado:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

module.exports = personalController;