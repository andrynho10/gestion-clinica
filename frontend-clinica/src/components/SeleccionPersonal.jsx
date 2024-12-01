import { useQuery } from '@tanstack/react-query';
import { personalApi } from '../services/api';
import PropTypes from 'prop-types';

function SeleccionPersonal({ onChange, personalSeleccionado = {} }) {
  // Consulta para obtener todo el personal
  const { data: personal, isLoading } = useQuery({
    queryKey: ['personal'],
    queryFn: async () => {
      const response = await personalApi.getAll();
      return response.data;
    }
  });

  // Filtrar personal por tipo
  const getPersonalPorTipo = (tipo) => {
    return personal?.filter(p => p.tipo === tipo && p.estado === 'disponible') || [];
  };

  // Estructura de roles requeridos
  const rolesRequeridos = [
    { tipo: 'cirujano', label: 'Cirujano', required: true },
    { tipo: 'anestesista', label: 'Anestesista', required: true },
    { tipo: 'enfermera', label: 'Enfermera', required: true },
    { tipo: 'arsenalero', label: 'Arsenalero/a', required: true },
    { tipo: 'pabellonero', label: 'Pabellonero/a', required: true },
    { tipo: 'tecnico_anestesia', label: 'Técnico/a de Anestesia', required: true }
  ];

  const handlePersonalChange = (tipo, personalId) => {
    onChange({
      ...personalSeleccionado,
      [tipo]: personalId ? parseInt(personalId) : null
    });
  };

  if (isLoading) return <div className="text-gray-500">Cargando personal...</div>;

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-gray-900">Personal Requerido</h4>
      {rolesRequeridos.map(({ tipo, label, required }) => (
        <div key={tipo}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <select
            value={personalSeleccionado[tipo] || ''}
            onChange={(e) => handlePersonalChange(tipo, e.target.value)}
            className="block w-full rounded-md border px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            required={required}
          >
            <option value="">Seleccione {label}</option>
            {getPersonalPorTipo(tipo).map(p => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

SeleccionPersonal.propTypes = {
    onChange: PropTypes.func.isRequired,
    personalSeleccionado: PropTypes.object
  };
  

export default SeleccionPersonal;