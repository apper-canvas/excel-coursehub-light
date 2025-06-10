import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from './Layout';
import HomePage from '@/components/pages/HomePage';
import BrowseCoursesPage from '@/components/pages/BrowseCoursesPage';
import MyCoursesPage from '@/components/pages/MyCoursesPage';
import FavoritesPage from '@/components/pages/FavoritesPage';
import NotesPage from '@/components/pages/NotesPage';
import CourseDetailPage from '@/components/pages/CourseDetailPage';
import LessonViewPage from '@/components/pages/LessonViewPage';
import NotFoundPage from '@/components/pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/browse" replace />} />
<Route path="home" element={<HomePage />} />
            <Route path="browse" element={<BrowseCoursesPage />} />
            <Route path="my-courses" element={<MyCoursesPage />} />
            <Route path="favorites" element={<FavoritesPage />} />
            <Route path="notes" element={<NotesPage />} />
            <Route path="course/:courseId" element={<CourseDetailPage />} />
            <Route path="course/:courseId/lesson/:lessonId" element={<LessonViewPage />} />
            <Route path="*" element={<NotFoundPage />} />
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