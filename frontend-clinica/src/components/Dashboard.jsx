import { useQuery } from '@tanstack/react-query';
import { cirugiasApi } from '../services/api';

function Dashboard() {
  const { data: estadisticas, isLoading, error } = useQuery({
    queryKey: ['estadisticas'],
    queryFn: async () => {
      const response = await cirugiasApi.getEstadisticas();
      return response.data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Cargando estadísticas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">
        Error al cargar estadísticas: {error.message}
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Dashboard de Operaciones</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total de Cirugías */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-600">Total Cirugías</h3>
          <p className="text-2xl font-bold text-blue-900">
            {estadisticas?.resumen.total_cirugias || 0}
          </p>
        </div>

        {/* Cirugías Canceladas */}
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-red-600">Cirugías Canceladas</h3>
          <p className="text-2xl font-bold text-red-900">
            {estadisticas?.resumen.cirugias_canceladas || 0}
          </p>
        </div>

        {/* Cirugías de Urgencia */}
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-600">Cirugías de Urgencia</h3>
          <p className="text-2xl font-bold text-yellow-900">
            {estadisticas?.resumen.cirugias_urgencia || 0}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;