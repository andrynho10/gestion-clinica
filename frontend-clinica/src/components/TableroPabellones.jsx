import { useQuery } from '@tanstack/react-query';
import { pabellonesApi } from '../services/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

function TableroPabellones() {
  const { data: pabellones, isLoading, error } = useQuery({
    queryKey: ['pabellones'],
    queryFn: async () => {
      const response = await pabellonesApi.getAll();
      return response.data;
    }
  });

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-gray-500">Cargando pabellones...</div>
    </div>
  );

  if (error) return (
    <div className="text-red-500">Error al cargar los pabellones: {error.message}</div>
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Tablero de Pabellones - {format(new Date(), "EEEE d 'de' MMMM", { locale: es })}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {pabellones?.map((pabellon) => (
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
            <p className="text-sm text-gray-600">{tiposPabellon[pabellon.tipo]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TableroPabellones;