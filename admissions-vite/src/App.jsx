import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/register';
import ApplicationForm from './pages/application';
import Login from './pages/Login';
import CourseManagement from './pages/Course';
import ViewApplication from './pages/view';
import ResetPassword from './pages/ResetPassword';
import './App.css';

function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/home" element={<Home />} />
       <Route path="/view/:id" element={<ViewApplication />} />
       <Route path="/ResetPassword" element={<ResetPassword />} />
        <Route path="/Course" element={<CourseManagement />} />
        <Route path="/register" element={<Register />} />
        <Route path="/application" element={<ApplicationForm />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
