import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { eventosApi } from '../services/api';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';

function EventosCirugia({ cirugiaId, onClose }) {
  const queryClient = useQueryClient();
  const [tipoEvento, setTipoEvento] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tiempoExtension, setTiempoExtension] = useState(30);

  // Obtener eventos de la cirugía
  const { data: eventos, isLoading } = useQuery({
    queryKey: ['eventos', cirugiaId],
    queryFn: async () => {
      const response = await eventosApi.getByCirugia(cirugiaId);
      return response.data;
    }
  });

  // Mutación para crear evento
  const mutation = useMutation({
    mutationFn: async (nuevoEvento) => {
      const response = await eventosApi.create(nuevoEvento);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['eventos', cirugiaId]);
      queryClient.invalidateQueries(['cirugias']);
      toast.success('Evento registrado correctamente');
      setTipoEvento('');
      setDescripcion('');
    },
    onError: (error) => {
      toast.error('Error al registrar evento: ' + error.message);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const evento = {
      cirugia_id: cirugiaId,
      tipo_evento: tipoEvento,
      descripcion: tipoEvento === 'extension_tiempo' 
        ? tiempoExtension.toString() 
        : descripcion
    };
    mutation.mutate(evento);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Eventos de la Cirugía</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Evento
          </label>
          <select
            value={tipoEvento}
            onChange={(e) => setTipoEvento(e.target.value)}
            className="block w-full rounded-md border px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            required
          >
            <option value="">Seleccione tipo de evento</option>
            <option value="extension_tiempo">Extensión de tiempo</option>
            <option value="complicacion">Complicación</option>
            <option value="requiere_aseo_profundo">Requiere aseo profundo</option>
            <option value="cancelacion">Cancelación</option>
          </select>
        </div>

        {tipoEvento === 'extension_tiempo' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tiempo adicional (minutos)
            </label>
            <input
              type="number"
              value={tiempoExtension}
              onChange={(e) => setTiempoExtension(parseInt(e.target.value))}
              className="block w-full rounded-md border px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              min="15"
              step="15"
              required
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="block w-full rounded-md border px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              required
              rows="3"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Registrar Evento
        </button>
      </form>

      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Historial de Eventos</h4>
        {isLoading ? (
          <p className="text-gray-500">Cargando eventos...</p>
        ) : eventos?.length === 0 ? (
          <p className="text-gray-500">No hay eventos registrados</p>
        ) : (
          <div className="space-y-2">
            {eventos?.map((evento, index) => (
              <div key={index} className="border rounded p-3 text-sm">
                <div className="font-medium text-gray-900">
                  {evento.tipo_evento === 'extension_tiempo' ? 'Extensión de tiempo' : 
                   evento.tipo_evento === 'complicacion' ? 'Complicación' :
                   evento.tipo_evento === 'requiere_aseo_profundo' ? 'Requiere aseo profundo' :
                   'Cancelación'}
                </div>
                <div className="text-gray-600">{evento.descripcion}</div>
                <div className="text-gray-400 text-xs mt-1">
                  {new Date(evento.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

EventosCirugia.propTypes = {
    cirugiaId: PropTypes.number.isRequired,
    onClose: PropTypes.func.isRequired
  };

export default EventosCirugia;