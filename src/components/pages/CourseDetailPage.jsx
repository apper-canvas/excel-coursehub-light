import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import { courseService, userProgressService } from '@/services';
import CourseDetailHeader from '@/components/organisms/CourseDetailHeader';
import CourseContentSection from '@/components/organisms/CourseContentSection';
import CourseOverviewCard from '@/components/organisms/CourseOverviewCard';
import CourseResourcesCard from '@/components/organisms/CourseResourcesCard';
import QuickActions from '@/components/organisms/QuickActions';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

function CourseDetailPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [courseData, progressData] = await Promise.all([
          courseService.getById(courseId),
          userProgressService.getAll()
        ]);
        
        setCourse(courseData);
        
        const existingProgress = progressData.find(p => p.courseId === courseId);
        setUserProgress(existingProgress);
        
        // Expand first module by default
        if (courseData && courseData.modules.length > 0) {
          setExpandedModules({ [courseData.modules[0].id]: true });
        }
      } catch (err) {
        setError(err.message || 'Failed to load course');
        toast.error('Failed to load course details');
      } finally {
        setLoading(false);
      }
    };
    
    if (courseId) {
      loadData();
    }
  }, [courseId]);

  const handleToggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const handleToggleFavorite = async () => {
    try {
      if (userProgress) {
        const updatedProgress = await userProgressService.update(userProgress.id, {
          ...userProgress,
          isFavorite: !userProgress.isFavorite
        });
        setUserProgress(updatedProgress);
      } else {
        const newProgress = await userProgressService.create({
          courseId,
          completedLessons: [],
          lastAccessed: new Date(),
          notes: [],
          isFavorite: true
        });
        setUserProgress(newProgress);
      }
      
      toast.success(userProgress?.isFavorite ? 'Removed from favorites' : 'Added to favorites');
    } catch (err) {
      toast.error('Failed to update favorites');
    }
  };

  const handleToggleLessonComplete = async (lessonId) => {
    try {
      let updatedProgress;
      
      if (userProgress) {
        const isCompleted = userProgress.completedLessons.includes(lessonId);
        const completedLessons = isCompleted
          ? userProgress.completedLessons.filter(id => id !== lessonId)
          : [...userProgress.completedLessons, lessonId];
        
        updatedProgress = await userProgressService.update(userProgress.id, {
          ...userProgress,
          completedLessons,
          lastAccessed: new Date()
        });
      } else {
        updatedProgress = await userProgressService.create({
          courseId,
          completedLessons: [lessonId],
          lastAccessed: new Date(),
          notes: [],
          isFavorite: false
        });
      }
      
      setUserProgress(updatedProgress);
      toast.success('Progress updated');
    } catch (err) {
      toast.error('Failed to update progress');
    }
  };

  const handleStartLesson = (lessonId) => {
    navigate(`/course/${courseId}/lesson/${lessonId}`);
  };

  const handleDownloadResource = (resource) => {
    toast.success(`Downloading ${resource.title}...`);
  };

  const getProgressData = () => {
    if (!course || !userProgress) return { percentage: 0, completed: 0, total: 0 };
    
    const totalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0);
    const completedLessons = userProgress.completedLessons.length;
    const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    
    return { percentage, completed: completedLessons, total: totalLessons };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="space-y-2">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="h-3 bg-gray-200 rounded w-full"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
        <Text as="h3" className="text-lg font-medium text-gray-900 mb-2">Course not found</Text>
        <Text as="p" className="text-gray-600 mb-4">{error || 'The requested course could not be found'}</Text>
        <Button
          onClick={() => navigate('/browse')}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Browse Courses
        </Button>
      </div>
    );
  }

  const progressData = getProgressData();

  return (
    <div className="space-y-8 max-w-full overflow-hidden">
      <CourseDetailHeader 
        course={course} 
        userProgress={userProgress} 
        onToggleFavorite={handleToggleFavorite} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Content */}
        <div className="lg:col-span-2 space-y-6">
          <Text as="h2" className="text-2xl font-heading font-bold text-gray-900">Course Content</Text>
          
          <CourseContentSection
            modules={course.modules}
            userProgress={userProgress}
            expandedModules={expandedModules}
            onToggleModule={handleToggleModule}
            onToggleLessonComplete={handleToggleLessonComplete}
            onStartLesson={handleStartLesson}
          />
        </div>

        {/* Course Sidebar */}
        <div className="space-y-6">
          <CourseOverviewCard 
            progressData={progressData} 
            courseDuration={course.duration} 
          />

          <CourseResourcesCard 
            modules={course.modules} 
            onDownloadResource={handleDownloadResource} 
            motionDelay={0.1}
          />

          <QuickActions 
            onNavigateNotes={() => navigate('/notes')} 
            onNavigateBrowse={() => navigate('/browse')} 
            motionDelay={0.2}
          />
        </div>
      </div>
    </div>
  );
}

export default CourseDetailPage;