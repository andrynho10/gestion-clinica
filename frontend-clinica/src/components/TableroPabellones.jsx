import { useQuery } from '@tanstack/react-query';
import { pabellonesApi, cirugiasApi } from '../services/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState } from 'react';

function TableroPabellones() {
  const [selectedDate, setSelectedDate] = useState(new Date());

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

  

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Tablero de Pabellones - {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
        </h2>
        <input
          type="date"
          className="border rounded px-3 py-1"
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
                <h3 className="font-medium">{pabellon.nombre}</h3>
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
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TableroPabellones;