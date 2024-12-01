import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cirugiasApi } from '../services/api';
import toast from 'react-hot-toast';

function FormularioCirugia() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    paciente_nombre: '',
    fecha_programada: '',
    hora_programada: '',
    duracion_estimada: 60,
    es_urgencia: false,
    requiere_aseo_profundo: false
  });


  const mutation = useMutation({
    mutationFn: async (nuevaCirugia) => {
      return await cirugiasApi.create(nuevaCirugia);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['cirugias']);
      toast.success('Cirugía programada con éxito');
      setFormData({
        paciente_nombre: '',
        fecha_programada: '',
        hora_programada: '',
        duracion_estimada: 60,
        es_urgencia: false,
        requiere_aseo_profundo: false
      });
    },
    onError: (error) => {
      toast.error('Error al programar la cirugía: ' + error.message);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const dateTime = `${formData.fecha_programada}T${formData.hora_programada}:00`;
    
    const cirugia = {
      ...formData,
      fecha_programada: dateTime,
      pabellon_id: null, // Se asignará con drag & drop
      personal_asignado: [] // Se asignará con drag & drop
    };

    mutation.mutate(cirugia);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">Nueva Cirugía</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Paciente
          </label>
          <input
            type="text"
            value={formData.paciente_nombre}
            onChange={(e) => setFormData({...formData, paciente_nombre: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha
            </label>
            <input
              type="date"
              value={formData.fecha_programada}
              onChange={(e) => setFormData({...formData, fecha_programada: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Hora
            </label>
            <input
              type="time"
              value={formData.hora_programada}
              onChange={(e) => setFormData({...formData, hora_programada: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Duración estimada (minutos)
          </label>
          <input
            type="number"
            value={formData.duracion_estimada}
            onChange={(e) => setFormData({...formData, duracion_estimada: parseInt(e.target.value)})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            min="15"
            step="15"
          />
        </div>

        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.es_urgencia}
              onChange={(e) => setFormData({...formData, es_urgencia: e.target.checked})}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Es urgencia</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.requiere_aseo_profundo}
              onChange={(e) => setFormData({...formData, requiere_aseo_profundo: e.target.checked})}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Requiere aseo profundo</span>
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Crear Cirugía
        </button>
      </form>
    </div>
  );
}

export default FormularioCirugia;