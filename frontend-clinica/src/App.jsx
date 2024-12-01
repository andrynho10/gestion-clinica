import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Toaster } from 'react-hot-toast'
import TableroPabellones from './components/TableroPabellones'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DndProvider backend={HTML5Backend}>
        <div className="min-h-screen bg-gray-100">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">
              Sistema de Gestión de Pabellones
            </h1>
            <TableroPabellones />
          </div>
        </div>
        <Toaster position="top-right" />
      </DndProvider>
    </QueryClientProvider>
  )
}

export default App