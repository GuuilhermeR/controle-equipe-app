import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Membros from './pages/Membros'
import Times from './pages/Times'
import Tarefas from './pages/Tarefas'
import Escala from './pages/Escala'
import Relatorios from './pages/Relatorios'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/membros" element={<Membros />} />
          <Route path="/times" element={<Times />} />
          <Route path="/tarefas" element={<Tarefas />} />
          <Route path="/escala" element={<Escala />} />
          <Route path="/relatorios" element={<Relatorios />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
