import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import { courseService, userProgressService } from '@/services';
import FavoritesSummary from '@/components/organisms/FavoritesSummary';
import CourseListings from '@/components/organisms/CourseListings';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

function FavoritesPage() {
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
        <Text as="h3" className="text-lg font-medium text-gray-900 mb-2">Unable to load favorites</Text>
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
        <Text as="h3" className="mt-4 text-lg font-medium text-gray-900">No favorite courses yet</Text>
        <Text as="p" className="mt-2 text-gray-600 mb-6">Save courses you love for quick access</Text>
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
        <div>
          <Text as="h1" className="text-2xl font-heading font-bold text-gray-900">Favorite Courses</Text>
          <Text as="p" className="text-gray-600 mt-1">
            {favoriteCourses.length} course{favoriteCourses.length !== 1 ? 's' : ''} saved
          </Text>
        </div>
        
        <div className="flex items-center space-x-2 text-red-500">
          <ApperIcon name="Heart" className="w-5 h-5 fill-current" />
          <Text as="span" className="font-medium">Favorites</Text>
        </div>
      </div>

      <FavoritesSummary 
        favoriteCourses={favoriteCourses} 
        userProgress={userProgress} 
        allCourses={courses} 
      />

      {/* Courses Grid */}
      <CourseListings
        courses={favoriteCourses}
        userProgress={userProgress}
        onToggleFavorite={removeFavorite} // Re-using toggleFavorite for removal
        onNavigateCourse={handleNavigateCourse}
        onContinueLearning={() => {}} // Pass a dummy function since not needed here. CourseCard will adapt.
        showEmptyState={false}
      />
    </div>
  );
}

export default FavoritesPage;