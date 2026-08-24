import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import InvestigationView from './pages/InvestigationView'
import GraphView from './pages/GraphView'
import HistoryPage from './pages/HistoryPage'
import DesktopTitleBar from './components/DesktopTitleBar'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen overflow-hidden bg-zinc-950">
        <DesktopTitleBar />
        <div className="flex-1 overflow-auto flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/investigation/:id" element={<InvestigationView />} />
            <Route path="/investigation/:id/graph" element={<GraphView />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}
