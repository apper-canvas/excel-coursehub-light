import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { courseService, userProgressService } from '../services';

function MyCourses() {
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

  const getProgressData = (courseId) => {
    const progress = userProgress.find(p => p.courseId === courseId);
    const course = courses.find(c => c.id === courseId);
    
    if (!progress || !course) return { percentage: 0, completed: 0, total: 0 };
    
    const totalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0);
    const completedLessons = progress.completedLessons.length;
    const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    
    return { percentage, completed: completedLessons, total: totalLessons };
  };

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

  const continueLearning = (courseId) => {
    const lessonData = getLastAccessedLesson(courseId);
    if (lessonData) {
      navigate(`/course/${courseId}/lesson/${lessonData.lesson.id}`);
    } else {
      navigate(`/course/${courseId}`);
    }
  };

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
        <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load your courses</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
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
        <h3 className="mt-4 text-lg font-medium text-gray-900">No courses started yet</h3>
        <p className="mt-2 text-gray-600 mb-6">Discover amazing courses to begin your learning journey</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/browse')}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Browse Courses
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-heading font-bold text-gray-900">My Courses</h1>
        <p className="text-gray-600">{enrolledCourses.length} course{enrolledCourses.length !== 1 ? 's' : ''} in progress</p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-surface-50 rounded-xl p-6 text-center"
        >
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="BookOpen" className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{enrolledCourses.length}</h3>
          <p className="text-gray-600">Courses Started</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-surface-50 rounded-xl p-6 text-center"
        >
          <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="CheckCircle" className="w-6 h-6 text-success" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {userProgress.reduce((total, progress) => total + progress.completedLessons.length, 0)}
          </h3>
          <p className="text-gray-600">Lessons Completed</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-surface-50 rounded-xl p-6 text-center"
        >
          <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="Trophy" className="w-6 h-6 text-accent" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {Math.round(
              enrolledCourses.reduce((total, course) => total + getProgressData(course.id).percentage, 0) / 
              enrolledCourses.length
            )}%
          </h3>
          <p className="text-gray-600">Average Progress</p>
        </motion.div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrolledCourses.map((course, index) => {
          const progressData = getProgressData(course.id);
          const lastLesson = getLastAccessedLesson(course.id);
          
          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              <div 
                className="h-40 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center cursor-pointer"
                onClick={() => navigate(`/course/${course.id}`)}
              >
                <ApperIcon name="BookOpen" className="w-12 h-12 text-primary" />
              </div>
              
              <div className="p-6 space-y-4">
                <div 
                  className="cursor-pointer"
                  onClick={() => navigate(`/course/${course.id}`)}
                >
                  <h3 className="font-heading font-semibold text-gray-900 mb-1 break-words">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-600 break-words">
                    by {course.instructor}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="text-accent font-medium">{progressData.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressData.percentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="bg-accent h-2 rounded-full"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    {progressData.completed} of {progressData.total} lessons completed
                  </p>
                </div>
                
                {lastLesson && (
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-2">
                      {progressData.percentage === 100 ? 'Course completed!' : 'Continue with:'}
                    </p>
                    <p className="text-sm font-medium text-gray-700 break-words">
                      {lastLesson.lesson.title}
                    </p>
                  </div>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => continueLearning(course.id)}
                  className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {progressData.percentage === 100 ? 'Review Course' : 'Continue Learning'}
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default MyCourses;