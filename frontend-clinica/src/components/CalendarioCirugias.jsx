import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { useQuery } from '@tanstack/react-query';
import { cirugiasApi } from '../services/api';

function CalendarioCirugias() {
  const { data: cirugias, isLoading } = useQuery({
    queryKey: ['cirugias'],
    queryFn: async () => {
      const response = await cirugiasApi.getAll();
      return response.data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Cargando calendario...</div>
      </div>
    );
  }

  // Formatear las cirugías para el calendario
  const eventos = cirugias?.map(cirugia => ({
    id: cirugia.id,
    title: `${cirugia.paciente_nombre} - ${cirugia.nombre_pabellon || 'Pabellón'}`,
    start: cirugia.fecha_programada,
    end: new Date(new Date(cirugia.fecha_programada).getTime() + cirugia.duracion_estimada * 60000),
    backgroundColor: cirugia.es_urgencia ? '#EF4444' : '#3B82F6',
  })) || [];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridDay"
        locale={esLocale}
        slotMinTime="07:00:00"
        slotMaxTime="22:00:00"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'timeGridWeek,timeGridDay'
        }}
        events={eventos}
        height="auto"
        allDaySlot={false}
        slotDuration="00:15:00"
        eventClick={(info) => {
          console.log('Cirugía seleccionada:', info.event);
        }}
      />
    </div>
  );
}

export default CalendarioCirugias;