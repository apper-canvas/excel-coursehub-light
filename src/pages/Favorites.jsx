import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { courseService, userProgressService } from '../services';

function Favorites() {
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
        setError(err.message || 'Failed to load favorites');
        toast.error('Failed to load favorites');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const favoriteCourses = courses.filter(course => 
    userProgress.some(progress => progress.courseId === course.id && progress.isFavorite)
  );

  const getProgressPercentage = (courseId) => {
    const progress = userProgress.find(p => p.courseId === courseId);
    const course = courses.find(c => c.id === courseId);
    
    if (!progress || !course) return 0;
    
    const totalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0);
    const completedLessons = progress.completedLessons.length;
    
    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  };

  const removeFavorite = async (courseId) => {
    try {
      const existingProgress = userProgress.find(p => p.courseId === courseId);
      
      if (existingProgress) {
        const updatedProgress = await userProgressService.update(existingProgress.id, {
          ...existingProgress,
          isFavorite: false
        });
        
        setUserProgress(prev => 
          prev.map(p => p.id === existingProgress.id ? updatedProgress : p)
        );
        
        toast.success('Removed from favorites');
      }
    } catch (err) {
      toast.error('Failed to remove from favorites');
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
        <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load favorites</h3>
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

  if (favoriteCourses.length === 0) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-12"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ApperIcon name="Heart" className="w-16 h-16 text-gray-300 mx-auto" />
        </motion.div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No favorite courses yet</h3>
        <p className="mt-2 text-gray-600 mb-6">Save courses you love for quick access</p>
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
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Favorite Courses</h1>
          <p className="text-gray-600 mt-1">
            {favoriteCourses.length} course{favoriteCourses.length !== 1 ? 's' : ''} saved
          </p>
        </div>
        
        <div className="flex items-center space-x-2 text-red-500">
          <ApperIcon name="Heart" className="w-5 h-5 fill-current" />
          <span className="font-medium">Favorites</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-surface-50 rounded-xl p-6 text-center"
        >
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="Heart" className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{favoriteCourses.length}</h3>
          <p className="text-gray-600">Favorite Courses</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-surface-50 rounded-xl p-6 text-center"
        >
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="BookOpen" className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {favoriteCourses.filter(course => 
              userProgress.some(p => p.courseId === course.id && p.completedLessons.length > 0)
            ).length}
          </h3>
          <p className="text-gray-600">Started</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-surface-50 rounded-xl p-6 text-center"
        >
          <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="Trophy" className="w-6 h-6 text-success" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {favoriteCourses.filter(course => getProgressPercentage(course.id) === 100).length}
          </h3>
          <p className="text-gray-600">Completed</p>
        </motion.div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favoriteCourses.map((course, index) => {
          const progressPercentage = getProgressPercentage(course.id);
          
          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden group"
            >
              <div 
                className="h-40 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center cursor-pointer relative"
                onClick={() => navigate(`/course/${course.id}`)}
              >
                <ApperIcon name="BookOpen" className="w-12 h-12 text-primary" />
                
                {/* Favorite indicator */}
                <div className="absolute top-3 right-3">
                  <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                    <ApperIcon name="Heart" className="w-4 h-4 text-red-500 fill-current" />
                  </div>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div 
                    className="flex-1 cursor-pointer min-w-0"
                    onClick={() => navigate(`/course/${course.id}`)}
                  >
                    <h3 className="font-heading font-semibold text-gray-900 mb-1 break-words">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 break-words">
                      by {course.instructor}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => removeFavorite(course.id)}
                    className="ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                    title="Remove from favorites"
                  >
                    <ApperIcon name="X" className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center space-x-1">
                    <ApperIcon name="Clock" className="w-4 h-4" />
                    <span>{course.duration}h</span>
                  </span>
                  <span className="px-2 py-1 bg-surface-100 rounded-full text-xs">
                    {course.difficulty}
                  </span>
                </div>
                
                <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                  {course.category}
                </span>
                
                {progressPercentage > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="text-accent font-medium">{progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="bg-accent h-2 rounded-full"
                      />
                    </div>
                  </div>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/course/${course.id}`)}
                  className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {progressPercentage > 0 ? 'Continue Learning' : 'Start Learning'}
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default Favorites;