import { Routes, Route, Navigate } from 'react-router-dom'
import UploadPage from './pages/UploadPage'
import ResultPage from './pages/ResultPage'
import HistoryPage from './pages/HistoryPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/upload" replace />} />
      <Route path="/upload" element={<UploadPage />} />
      <Route path="/predictions" element={<HistoryPage />} />
      <Route path="/predictions/:id" element={<ResultPage />} />
    </Routes>
  )
}

export default App
