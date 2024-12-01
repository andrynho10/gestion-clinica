import { useQuery } from '@tanstack/react-query';
import { cirugiasApi } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Formatear datos para los gráficos
  const datosParaBarras = estadisticas?.cirugiasPorTipo?.map(item => ({
    tipo: item.tipo === 'obstetricia' ? 'Obstetricia' :
          item.tipo === 'grande' ? 'Sala Grande' :
          item.tipo === 'ambulatorio' ? 'Ambulatorio' : 'Hemodinámica',
    cantidad: parseInt(item.cantidad)
  })) || [];

  const datosParaPie = estadisticas?.eventos?.map(item => ({
    name: item.tipo_evento === 'extension_tiempo' ? 'Extensión de Tiempo' :
          item.tipo_evento === 'complicacion' ? 'Complicación' :
          item.tipo_evento === 'requiere_aseo_profundo' ? 'Aseo Profundo' : 'Cancelación',
    value: parseInt(item.cantidad)
  })) || [];

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-8">
      <h2 className="text-xl font-semibold text-gray-900">Dashboard de Operaciones</h2>
      
      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-600">Total Cirugías</h3>
          <p className="text-2xl font-bold text-blue-900">
            {estadisticas?.resumen.total_cirugias || 0}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-red-600">Cirugías Canceladas</h3>
          <p className="text-2xl font-bold text-red-900">
            {estadisticas?.resumen.cirugias_canceladas || 0}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-600">Cirugías de Urgencia</h3>
          <p className="text-2xl font-bold text-yellow-900">
            {estadisticas?.resumen.cirugias_urgencia || 0}
          </p>
        </div>
      </div>

      {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Gráfico de barras */}
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-6 text-gray-900">Cirugías por Tipo de Pabellón</h3>
            <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={datosParaBarras}>
                <XAxis dataKey="tipo" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cantidad" fill="#3B82F6" />
                </BarChart>
            </ResponsiveContainer>
            </div>
        </div>

        {/* Gráfico circular */}
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-6 text-gray-900">Distribución de Eventos</h3>
            <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                <Pie
                    data={datosParaPie}
                    cx="50%"
                    cy="50%"
                    outerRadius={45}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, value}) => `${name}: ${value}`}
                >
                    {datosParaPie.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                </PieChart>
            </ResponsiveContainer>
            </div>
        </div>
        </div>
    </div>
  );
}

export default Dashboard;