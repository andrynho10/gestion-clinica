import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Toaster } from 'react-hot-toast';
import TableroPabellones from './components/TableroPabellones';
import FormularioCirugia from './components/FormularioCirugia';
import Dashboard from './components/Dashboard';
import CalendarioCirugias from './components/CalendarioCirugias';

const queryClient = new QueryClient();

function App() {
  const [vistaActual, setVistaActual] = useState('tablero'); // 'tablero' o 'dashboard'

  return (
    <QueryClientProvider client={queryClient}>
      <DndProvider backend={HTML5Backend}>
        <div className="min-h-screen bg-gray-100">
          <div className="max-w-[1500px] mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Sistema de Gestión de Pabellones
              </h1>
              <div className="space-x-4">
                <button
                  onClick={() => setVistaActual('tablero')}
                  className={`px-4 py-2 rounded-md ${
                    vistaActual === 'tablero'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Tablero
                </button>
                <button
                  onClick={() => setVistaActual('calendario')}
                  className={`px-4 py-2 rounded-md ${
                    vistaActual === 'calendario'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Calendario
                </button>
                <button
                  onClick={() => setVistaActual('dashboard')}
                  className={`px-4 py-2 rounded-md ${
                    vistaActual === 'dashboard'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Dashboard
                </button>
              </div>
            </div>

            {vistaActual === 'tablero' ? (
              <div className="flex gap-8">
                <div className="flex-grow">
                  <TableroPabellones />
                </div>
                <div className="w-96">
                  <FormularioCirugia />
                </div>
              </div>
            ) : vistaActual === 'calendario' ? (
              <CalendarioCirugias />
            ) : (
              <Dashboard />
            )}
          </div>
        </div>
        <Toaster position="top-right" />
      </DndProvider>
    </QueryClientProvider>
  );
}

export default App;