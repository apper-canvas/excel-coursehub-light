import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import { courseService, userProgressService } from '@/services';
import SearchInput from '@/components/molecules/SearchInput';
import FilterSelect from '@/components/molecules/FilterSelect';
import CourseListings from '@/components/organisms/CourseListings';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

function BrowseCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [viewMode, setViewMode] = useState('grid');
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
        setError(err.message || 'Failed to load courses');
        toast.error('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const categories = [...new Set(courses.map(course => course.category))];
  const difficulties = [...new Set(courses.map(course => course.difficulty))];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || course.category === selectedCategory;
    const matchesDifficulty = !selectedDifficulty || course.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const toggleFavorite = async (courseId) => {
    try {
      const existingProgress = userProgress.find(p => p.courseId === courseId);
      
      if (existingProgress) {
        const updatedProgress = await userProgressService.update(existingProgress.id, {
          ...existingProgress,
          isFavorite: !existingProgress.isFavorite
        });
        
        setUserProgress(prev => 
          prev.map(p => p.id === existingProgress.id ? updatedProgress : p)
        );
      } else {
        const newProgress = await userProgressService.create({
          courseId,
          completedLessons: [],
          lastAccessed: new Date(),
          notes: [],
          isFavorite: true
        });
        
        setUserProgress(prev => [...prev, newProgress]);
      }
      
      toast.success('Favorites updated');
    } catch (err) {
      toast.error('Failed to update favorites');
    }
  };

  const handleNavigateCourse = (courseId) => navigate(`/course/${courseId}`);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedDifficulty('');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
            <div className="md:col-span-3">
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
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
        <Text as="h3" className="text-lg font-medium text-gray-900 mb-2">Unable to load courses</Text>
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
    <div className="space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Text as="h1" className="text-2xl font-heading font-bold text-gray-900">Browse Courses</Text>
        
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <ApperIcon name="Grid3X3" className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <ApperIcon name="List" className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="space-y-6">
          <SearchInput 
            label="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search courses..."
          />

          <FilterSelect
            label="Category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            options={categories}
            defaultValue="All Categories"
          />

          <FilterSelect
            label="Difficulty"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            options={difficulties}
            defaultValue="All Levels"
          />

          {(searchTerm || selectedCategory || selectedDifficulty) && (
            <Button
              onClick={clearFilters}
              className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Course Results */}
        <div className="md:col-span-3">
          <CourseListings
            courses={filteredCourses}
            userProgress={userProgress}
            onToggleFavorite={toggleFavorite}
            onNavigateCourse={handleNavigateCourse}
            viewMode={viewMode}
            showEmptyState={true}
            emptyStateActionLabel="Show All Courses"
            onEmptyStateAction={clearFilters}
          />
          
          {filteredCourses.length > 0 && (
            <div className="mt-8 text-center text-gray-600">
              Showing {filteredCourses.length} of {courses.length} courses
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BrowseCoursesPage;