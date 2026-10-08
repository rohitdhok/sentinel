import './App.css'
import Dashboard from './pages/Dashboard'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EventsPage from './pages/EventsPage';
import Layout from './layouts/Layout';

function App() {

  return (
    <BrowserRouter>
        <Routes>
            <Route element={<Layout/>}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/events" element={<EventsPage />} />
            </Route>
        </Routes>
    </BrowserRouter>
  )
}

export default App
