import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Dogs from './pages/Dogs';
import Notes from './pages/Notes';
import Calendar from './pages/Calendar';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dogs" element={<Dogs />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
