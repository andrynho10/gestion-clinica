import { useQuery } from '@tanstack/react-query';
import { pabellonesApi, cirugiasApi } from '../services/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState } from 'react';
import EventosCirugia from './EventosCirugia';

function TableroPabellones() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCirugiaId, setSelectedCirugiaId] = useState(null);

  const { data: pabellones, isLoading: loadingPabellones } = useQuery({
    queryKey: ['pabellones'],
    queryFn: async () => {
      const response = await pabellonesApi.getAll();
      return response.data;
    }
  });

  const { data: cirugias, isLoading: loadingCirugias } = useQuery({
    queryKey: ['cirugias', format(selectedDate, 'yyyy-MM-dd')],
    queryFn: async () => {
      const response = await cirugiasApi.getByDate(format(selectedDate, 'yyyy-MM-dd'));
      return response.data;
    }
  });

  if (loadingPabellones || loadingCirugias) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-gray-500">Cargando...</div>
    </div>
  );

  const tiposPabellon = {
    grande: 'Sala Grande',
    obstetricia: 'Obstetricia y Ginecología',
    ambulatorio: 'Quirófano Ambulatorio',
    hemodinamica: 'Hemodinámica'
  };

  const estadoColor = {
    disponible: 'bg-green-100 text-green-800',
    ocupado: 'bg-red-100 text-red-800',
    en_aseo: 'bg-yellow-100 text-yellow-800',
    mantenimiento: 'bg-gray-100 text-gray-800'
  };

  const getCirugiaPabellon = (pabellonId) => {
    return cirugias?.find(cirugia => cirugia.pabellon_id === pabellonId);
  };

  const handleEventosClick = (cirugiaId) => {
    setSelectedCirugiaId(cirugiaId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center text-gray-900">
        <h2 className="text-xl font-semibold">
          Tablero de Pabellones - {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
        </h2>
        <input
          type="date"
          className="block rounded-md border px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600"
          value={format(selectedDate, 'yyyy-MM-dd')}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {pabellones?.map((pabellon) => {
          const cirugia = getCirugiaPabellon(pabellon.id);
          
          return (
            <div 
              key={pabellon.id}
              className="bg-white rounded-lg shadow p-4 border border-gray-200"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900">{pabellon.nombre}</h3>
                <span 
                  className={`px-2 py-1 rounded-full text-xs font-medium ${estadoColor[pabellon.estado]}`}
                >
                  {pabellon.estado}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{tiposPabellon[pabellon.tipo]}</p>
              
              {cirugia && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm font-medium">Cirugía Programada:</p>
                  <p className="text-sm text-gray-600">Paciente: {cirugia.paciente_nombre}</p>
                  <p className="text-sm text-gray-600">
                    Hora: {format(new Date(cirugia.fecha_programada), 'HH:mm')}
                  </p>
                  <p className="text-sm text-gray-600">
                    Duración: {cirugia.duracion_estimada} min
                  </p>
                  {cirugia.es_urgencia && (
                    <span className="inline-block mt-1 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                      URGENCIA
                    </span>
                  )}
                  <button
                    onClick={() => handleEventosClick(cirugia.id)}
                    className="mt-2 w-full text-sm bg-gray-100 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-200 transition-colors"
                  >
                    Gestionar Eventos
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Modal de Eventos */}
      {selectedCirugiaId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <EventosCirugia 
              cirugiaId={selectedCirugiaId}
              onClose={() => setSelectedCirugiaId(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default TableroPabellones;