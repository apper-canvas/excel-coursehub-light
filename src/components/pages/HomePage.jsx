import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { courseService, userProgressService } from '@/services';
import HeroSection from '@/components/organisms/HeroSection';
import StatCard from '@/components/molecules/StatCard';
import CourseListings from '@/components/organisms/CourseListings';
import QuickActions from '@/components/organisms/QuickActions';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

function HomePage() {
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

  const handleNavigateBrowse = () => navigate('/browse');
  const handleNavigateNotes = () => navigate('/notes');
  const handleNavigateCourse = (courseId) => navigate(`/course/${courseId}`);

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
        <Text as="h3" className="text-lg font-medium text-gray-900 mb-2">Unable to load content</Text>
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

  return (
    <div className="space-y-8 max-w-full overflow-hidden">
      <HeroSection onStartLearningClick={handleNavigateBrowse} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          iconName="BookOpen"
          iconBgClass="bg-success/10"
          iconColorClass="text-success"
          value={featuredCourses.length}
          label="Available Courses"
          motionDelay={0.1}
        />
        <StatCard
          iconName="Trophy"
          iconBgClass="bg-accent/10"
          iconColorClass="text-accent"
          value={myProgress.length}
          label="Courses Started"
          motionDelay={0.2}
        />
        <StatCard
          iconName="Heart"
          iconBgClass="bg-primary/10"
          iconColorClass="text-primary"
          value={myProgress.filter(p => p.isFavorite).length}
          label="Favorites"
          motionDelay={0.3}
        />
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Text as="h2" className="text-2xl font-heading font-bold text-gray-900">Featured Courses</Text>
          <Button
            onClick={handleNavigateBrowse}
            className="text-primary hover:text-secondary font-medium flex items-center space-x-1"
          >
            <Text as="span">View All</Text>
            <ApperIcon name="ArrowRight" className="w-4 h-4" />
          </Button>
        </div>
        <CourseListings 
            courses={featuredCourses} 
            userProgress={myProgress} 
            onNavigateCourse={handleNavigateCourse}
        />
      </div>

      <QuickActions onNavigateBrowse={handleNavigateBrowse} onNavigateNotes={handleNavigateNotes} />
    </div>
  );
}

export default HomePage;