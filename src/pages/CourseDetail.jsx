import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { courseService, userProgressService } from '../services';

function CourseDetail() {
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

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const toggleFavorite = async () => {
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

  const toggleLessonComplete = async (lessonId) => {
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

  const startLesson = (lessonId) => {
    navigate(`/course/${courseId}/lesson/${lessonId}`);
  };

  const getProgressData = () => {
    if (!course || !userProgress) return { percentage: 0, completed: 0, total: 0 };
    
    const totalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0);
    const completedLessons = userProgress.completedLessons.length;
    const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    
    return { percentage, completed: completedLessons, total: totalLessons };
  };

  const getModuleProgress = (module) => {
    if (!userProgress) return { percentage: 0, completed: 0, total: module.lessons.length };
    
    const completedLessons = module.lessons.filter(lesson => 
      userProgress.completedLessons.includes(lesson.id)
    ).length;
    const percentage = module.lessons.length > 0 ? 
      Math.round((completedLessons / module.lessons.length) * 100) : 0;
    
    return { percentage, completed: completedLessons, total: module.lessons.length };
  };

  const downloadResource = (resource) => {
    // Simulate download
    toast.success(`Downloading ${resource.title}...`);
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
        <h3 className="text-lg font-medium text-gray-900 mb-2">Course not found</h3>
        <p className="text-gray-600 mb-4">{error || 'The requested course could not be found'}</p>
        <button
          onClick={() => navigate('/browse')}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Browse Courses
        </button>
      </div>
    );
  }

  const progressData = getProgressData();

  return (
    <div className="space-y-8 max-w-full overflow-hidden">
      {/* Course Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary to-secondary rounded-xl p-8 text-white"
      >
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-heading font-bold mb-2 break-words">
              {course.title}
            </h1>
            <p className="text-lg text-white/90 mb-4 break-words">
              by {course.instructor}
            </p>
            <p className="text-white/80 mb-6 break-words">
              {course.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="flex items-center space-x-1">
                <ApperIcon name="Clock" className="w-4 h-4" />
                <span>{course.duration} hours</span>
              </span>
              <span className="flex items-center space-x-1">
                <ApperIcon name="BarChart3" className="w-4 h-4" />
                <span>{course.difficulty}</span>
              </span>
              <span className="flex items-center space-x-1">
                <ApperIcon name="Tag" className="w-4 h-4" />
                <span>{course.category}</span>
              </span>
              <span className="flex items-center space-x-1">
                <ApperIcon name="BookOpen" className="w-4 h-4" />
                <span>{progressData.total} lessons</span>
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleFavorite}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <ApperIcon 
                name="Heart" 
                className={`w-6 h-6 ${
                  userProgress?.isFavorite ? 'text-red-300 fill-current' : 'text-white'
                }`} 
              />
            </button>
            
            {progressData.total > 0 && (
              <div className="text-center">
                <div className="text-2xl font-bold">{progressData.percentage}%</div>
                <div className="text-white/80 text-sm">Complete</div>
              </div>
            )}
          </div>
        </div>
        
        {progressData.total > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Course Progress</span>
              <span>{progressData.completed} of {progressData.total} lessons</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressData.percentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-accent h-3 rounded-full"
              />
            </div>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Content */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-heading font-bold text-gray-900">Course Content</h2>
          
          <div className="space-y-4">
            {course.modules.map((module, moduleIndex) => {
              const moduleProgress = getModuleProgress(module);
              const isExpanded = expandedModules[module.id];
              
              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: moduleIndex * 0.1 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading font-semibold text-gray-900 mb-1 break-words">
                          Module {module.order}: {module.title}
                        </h3>
                        <p className="text-gray-600 text-sm break-words">
                          {module.description}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>{module.lessons.length} lessons</span>
                          <span>•</span>
                          <span>{moduleProgress.completed} of {moduleProgress.total} completed</span>
                          <span>•</span>
                          <span className="text-accent font-medium">{moduleProgress.percentage}%</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 ml-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <div className="text-sm font-medium text-gray-600">
                            {moduleProgress.percentage}%
                          </div>
                        </div>
                        <ApperIcon 
                          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                          className="w-5 h-5 text-gray-400" 
                        />
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                      <div 
                        className="bg-accent h-2 rounded-full transition-all duration-300"
                        style={{ width: `${moduleProgress.percentage}%` }}
                      />
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-100"
                      >
                        <div className="p-6 space-y-3">
                          {module.lessons.map((lesson, lessonIndex) => {
                            const isCompleted = userProgress?.completedLessons.includes(lesson.id) || false;
                            
                            return (
                              <motion.div
                                key={lesson.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: lessonIndex * 0.05 }}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                              >
                                <div className="flex items-center space-x-3 flex-1 min-w-0">
                                  <button
                                    onClick={() => toggleLessonComplete(lesson.id)}
                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                      isCompleted 
                                        ? 'bg-success border-success text-white' 
                                        : 'border-gray-300 hover:border-success'
                                    }`}
                                  >
                                    {isCompleted && <ApperIcon name="Check" className="w-3 h-3" />}
                                  </button>
                                  
                                  <div className="flex-1 min-w-0">
                                    <h4 className={`font-medium break-words ${
                                      isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'
                                    }`}>
                                      {lesson.title}
                                    </h4>
                                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                                      <ApperIcon name="Clock" className="w-3 h-3" />
                                      <span>{lesson.duration} min</span>
                                      {lesson.resources && lesson.resources.length > 0 && (
                                        <>
                                          <span>•</span>
                                          <span>{lesson.resources.length} resource{lesson.resources.length !== 1 ? 's' : ''}</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                
                                <button
                                  onClick={() => startLesson(lesson.id)}
                                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
                                >
                                  {isCompleted ? 'Review' : 'Start'}
                                </button>
                              </motion.div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Course Sidebar */}
        <div className="space-y-6">
          {/* Course Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <h3 className="font-heading font-semibold text-gray-900 mb-4">Course Overview</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Lessons</span>
                <span className="font-medium">{progressData.total}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Completed</span>
                <span className="font-medium text-success">{progressData.completed}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium text-accent">{progressData.percentage}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Duration</span>
                <span className="font-medium">{course.duration}h</span>
              </div>
            </div>
          </motion.div>

          {/* Resources */}
          {course.modules.some(module => 
            module.lessons.some(lesson => lesson.resources && lesson.resources.length > 0)
          ) && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <h3 className="font-heading font-semibold text-gray-900 mb-4">Course Resources</h3>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {course.modules.map(module =>
                  module.lessons.map(lesson =>
                    lesson.resources?.map(resource => (
                      <div key={resource.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-medium ${
                            resource.type === 'pdf' ? 'bg-red-500' :
                            resource.type === 'video' ? 'bg-blue-500' :
                            resource.type === 'slides' ? 'bg-green-500' :
                            'bg-gray-500'
                          }`}>
                            {resource.type === 'pdf' ? 'PDF' :
                             resource.type === 'video' ? 'VID' :
                             resource.type === 'slides' ? 'PPT' : 'FILE'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-sm break-words">
                              {resource.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(resource.size / 1024 / 1024).toFixed(1)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => downloadResource(resource)}
                          className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                        >
                          <ApperIcon name="Download" className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )
                )}
              </div>
            </motion.div>
          )}

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <h3 className="font-heading font-semibold text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <button
                onClick={() => navigate('/notes')}
                className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                <ApperIcon name="FileText" className="w-5 h-5 text-primary" />
                <span className="text-gray-700">View My Notes</span>
              </button>
              
              <button
                onClick={() => navigate('/browse')}
                className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                <ApperIcon name="Search" className="w-5 h-5 text-primary" />
                <span className="text-gray-700">Browse More Courses</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;