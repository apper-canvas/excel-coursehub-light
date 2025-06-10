import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import { courseService, userProgressService } from '@/services';
import MyCoursesSummary from '@/components/organisms/MyCoursesSummary';
import CourseListings from '@/components/organisms/CourseListings';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

function MyCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [coursesData, progressData] = await Promise.all([
          courseService.getAll(),
          userProgressService.getAll()
        ]);
        setCourses(coursesData);
        setUserProgress(progressData);
      } catch (err) {
        setError(err.message || 'Failed to load your courses');
        toast.error('Failed to load your courses');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const enrolledCourses = courses.filter(course => 
    userProgress.some(progress => progress.courseId === course.id)
  );

  const getLastAccessedLesson = (courseId) => {
    const progress = userProgress.find(p => p.courseId === courseId);
    const course = courses.find(c => c.id === courseId);
    
    if (!progress || !course || progress.completedLessons.length === 0) {
      // Return first lesson if no progress
      const firstModule = course?.modules?.[0];
      const firstLesson = firstModule?.lessons?.[0];
      return firstLesson ? { module: firstModule, lesson: firstLesson } : null;
    }
    
    // Find the next uncompleted lesson or the last completed one
    for (const module of course.modules) {
      for (const lesson of module.lessons) {
        if (!progress.completedLessons.includes(lesson.id)) {
          return { module, lesson };
        }
      }
    }
    
    // All lessons completed, return last lesson
    const lastModule = course.modules[course.modules.length - 1];
    const lastLesson = lastModule.lessons[lastModule.lessons.length - 1];
    return { module: lastModule, lesson: lastLesson };
  };

  const handleContinueLearning = (courseId) => {
    const lessonData = getLastAccessedLesson(courseId);
    if (lessonData) {
      navigate(`/course/${courseId}/lesson/${lessonData.lesson.id}`);
    } else {
      navigate(`/course/${courseId}`);
    }
  };

  const handleNavigateCourse = (courseId) => navigate(`/course/${courseId}`);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="animate-pulse space-y-4">
                  <div className="h-32 bg-gray-200 rounded-lg"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-2 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
        <Text as="h3" className="text-lg font-medium text-gray-900 mb-2">Unable to load your courses</Text>
        <Text as="p" className="text-gray-600 mb-4">{error}</Text>
        <Button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (enrolledCourses.length === 0) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-12"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <ApperIcon name="BookOpen" className="w-16 h-16 text-gray-300 mx-auto" />
        </motion.div>
        <Text as="h3" className="mt-4 text-lg font-medium text-gray-900">No courses started yet</Text>
        <Text as="p" className="mt-2 text-gray-600 mb-6">Discover amazing courses to begin your learning journey</Text>
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/browse')}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Browse Courses
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Text as="h1" className="text-2xl font-heading font-bold text-gray-900">My Courses</Text>
        <Text as="p" className="text-gray-600">
          {enrolledCourses.length} course{enrolledCourses.length !== 1 ? 's' : ''} in progress
        </Text>
      </div>

      <MyCoursesSummary enrolledCourses={enrolledCourses} userProgress={userProgress} />

      {/* Courses Grid */}
      <CourseListings
        courses={enrolledCourses}
        userProgress={userProgress}
        onNavigateCourse={handleNavigateCourse}
        onContinueLearning={handleContinueLearning}
        showEmptyState={false} // Handled by the page's direct empty state
      />
    </div>
  );
}

export default MyCoursesPage;