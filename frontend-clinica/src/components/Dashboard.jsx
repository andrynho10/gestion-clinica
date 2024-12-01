import { useQuery } from '@tanstack/react-query';
import { cirugiasApi } from '../services/api';
import { format, subDays } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

function Dashboard() {
  const { data: estadisticas, isLoading } = useQuery({
    queryKey: ['estadisticas'],
    queryFn: async () => {
      const hoy = new Date();
      const fechaInicio = format(subDays(hoy, 30), 'yyyy-MM-dd');
      const response = await cirugiasApi.getEstadisticas(fechaInicio, format(hoy, 'yyyy-MM-dd'));
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

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Dashboard de Operaciones</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-600">Total Cirugías</h3>
          <p className="text-2xl font-bold text-blue-900">{estadisticas?.totalCirugias}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-600">Tasa de Ocupación</h3>
          <p className="text-2xl font-bold text-green-900">{estadisticas?.tasaOcupacion}%</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-600">Cirugías con Retraso</h3>
          <p className="text-2xl font-bold text-yellow-900">{estadisticas?.cirugiasRetrasadas}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-red-600">Cirugías Suspendidas</h3>
          <p className="text-2xl font-bold text-red-900">{estadisticas?.cirugiasSuspendidas}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80">
          <h3 className="text-lg font-medium mb-4">Cirugías por Tipo de Pabellón</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={estadisticas?.cirugiasPorTipo}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tipo" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cantidad" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="h-80">
          <h3 className="text-lg font-medium mb-4">Distribución de Eventos</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={estadisticas?.eventos}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                {estadisticas?.eventos.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;