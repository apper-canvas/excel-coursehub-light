import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import { courseService, userProgressService } from '../services';

function MainFeature() {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [myProgress, setMyProgress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [courses, progress] = await Promise.all([
          courseService.getAll(),
          userProgressService.getAll()
        ]);
        
        // Get first 3 courses as featured
        setFeaturedCourses(courses.slice(0, 3));
        setMyProgress(progress);
      } catch (err) {
        setError(err.message || 'Failed to load data');
        toast.error('Failed to load featured content');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getProgressPercentage = (courseId) => {
    const progress = myProgress.find(p => p.courseId === courseId);
    if (!progress) return 0;
    
    const course = featuredCourses.find(c => c.id === courseId);
    if (!course) return 0;
    
    const totalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0);
    const completedLessons = progress.completedLessons.length;
    
    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Hero Section Skeleton */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-8 text-white">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-white/20 rounded w-3/4"></div>
            <div className="h-4 bg-white/20 rounded w-1/2"></div>
          </div>
        </div>
        
        {/* Featured Courses Skeleton */}
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-surface-50 rounded-xl p-6 shadow-sm">
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
        <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load content</h3>
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

  return (
    <div className="space-y-8 max-w-full overflow-hidden">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary to-secondary rounded-xl p-8 text-white"
      >
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Welcome to CourseHub
          </h1>
          <p className="text-lg text-white/90 mb-6">
            Discover amazing courses, track your progress, and master new skills at your own pace.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/browse')}
            className="px-6 py-3 bg-white text-primary font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Start Learning Today
          </motion.button>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-surface-50 rounded-xl p-6 text-center"
        >
          <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="BookOpen" className="w-6 h-6 text-success" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{featuredCourses.length}</h3>
          <p className="text-gray-600">Available Courses</p>
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
          <h3 className="text-2xl font-bold text-gray-900">{myProgress.length}</h3>
          <p className="text-gray-600">Courses Started</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-surface-50 rounded-xl p-6 text-center"
        >
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="Heart" className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {myProgress.filter(p => p.isFavorite).length}
          </h3>
          <p className="text-gray-600">Favorites</p>
        </motion.div>
      </div>

      {/* Featured Courses */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-heading font-bold text-gray-900">Featured Courses</h2>
          <button
            onClick={() => navigate('/browse')}
            className="text-primary hover:text-secondary font-medium flex items-center space-x-1"
          >
            <span>View All</span>
            <ApperIcon name="ArrowRight" className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCourses.map((course, index) => {
            const progressPercentage = getProgressPercentage(course.id);
            
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
                onClick={() => navigate(`/course/${course.id}`)}
              >
                <div className="h-40 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                  <ApperIcon name="BookOpen" className="w-12 h-12 text-primary" />
                </div>
                
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-heading font-semibold text-gray-900 mb-1 break-words">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 break-words">
                      by {course.instructor}
                    </p>
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
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-accent/5 to-accent/10 rounded-xl p-6 border border-accent/20"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
              <ApperIcon name="Search" className="w-6 h-6 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-heading font-semibold text-gray-900 mb-1">
                Explore New Courses
              </h3>
              <p className="text-gray-600 text-sm break-words">
                Discover courses across various subjects and skill levels
              </p>
            </div>
            <button
              onClick={() => navigate('/browse')}
              className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
            >
              Browse
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-primary/5 to-secondary/10 rounded-xl p-6 border border-primary/20"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
              <ApperIcon name="FileText" className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-heading font-semibold text-gray-900 mb-1">
                Review Your Notes
              </h3>
              <p className="text-gray-600 text-sm break-words">
                Access all your notes and annotations in one place
              </p>
            </div>
            <button
              onClick={() => navigate('/notes')}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Notes
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default MainFeature;