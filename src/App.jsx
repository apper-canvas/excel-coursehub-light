import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from './Layout';
import Home from './pages/Home';
import BrowseCourses from './pages/BrowseCourses';
import MyCourses from './pages/MyCourses';
import Favorites from './pages/Favorites';
import Notes from './pages/Notes';
import CourseDetail from './pages/CourseDetail';
import LessonView from './pages/LessonView';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/browse" replace />} />
            <Route path="home" element={<Home />} />
            <Route path="browse" element={<BrowseCourses />} />
            <Route path="my-courses" element={<MyCourses />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="notes" element={<Notes />} />
            <Route path="course/:courseId" element={<CourseDetail />} />
            <Route path="course/:courseId/lesson/:lessonId" element={<LessonView />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="z-[9999]"
          toastClassName="rounded-lg shadow-lg"
          progressClassName="bg-primary"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;