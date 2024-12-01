const pool = require('../config/db');

const pabellonController = {
    // Obtener todos los pabellones
    getAll: async (req, res) => {
        try {
            const result = await pool.query('SELECT * FROM pabellones ORDER BY id');
            res.json(result.rows);
        } catch (error) {
            console.error('Error al obtener pabellones:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    // Obtener un pabellón por ID
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await pool.query('SELECT * FROM pabellones WHERE id = $1', [id]);
            
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Pabellón no encontrado' });
            }
            
            res.json(result.rows[0]);
        } catch (error) {
            console.error('Error al obtener pabellón:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    // Actualizar estado de un pabellón
    updateStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { estado } = req.body;
            
            const result = await pool.query(
                'UPDATE pabellones SET estado = $1 WHERE id = $2 RETURNING *',
                [estado, id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Pabellón no encontrado' });
            }

            res.json(result.rows[0]);
        } catch (error) {
            console.error('Error al actualizar estado:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

module.exports = pabellonController;