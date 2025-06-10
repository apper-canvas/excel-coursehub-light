import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import ApperIcon from '../components/ApperIcon';
import { courseService, userProgressService } from '../services';

function LessonView() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [noteContent, setNoteContent] = useState('');
  const [isNotePanelOpen, setIsNotePanelOpen] = useState(false);
  const [existingNotes, setExistingNotes] = useState([]);

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
        
        // Find the lesson
        let foundLesson = null;
        for (const module of courseData.modules) {
          const lesson = module.lessons.find(l => l.id === lessonId);
          if (lesson) {
            foundLesson = lesson;
            break;
          }
        }
        
        if (!foundLesson) {
          throw new Error('Lesson not found');
        }
        
        setLesson(foundLesson);
        
        const existingProgress = progressData.find(p => p.courseId === courseId);
        setUserProgress(existingProgress);
        
        // Load existing notes for this lesson
        if (existingProgress && existingProgress.notes) {
          const lessonNotes = existingProgress.notes.filter(note => note.lessonId === lessonId);
          setExistingNotes(lessonNotes);
        }
        
        // Mark lesson as accessed
        if (existingProgress) {
          await userProgressService.update(existingProgress.id, {
            ...existingProgress,
            lastAccessed: new Date()
          });
        } else {
          const newProgress = await userProgressService.create({
            courseId,
            completedLessons: [],
            lastAccessed: new Date(),
            notes: [],
            isFavorite: false
          });
          setUserProgress(newProgress);
        }
      } catch (err) {
        setError(err.message || 'Failed to load lesson');
        toast.error('Failed to load lesson');
      } finally {
        setLoading(false);
      }
    };
    
    if (courseId && lessonId) {
      loadData();
    }
  }, [courseId, lessonId]);

  const toggleLessonComplete = async () => {
    if (!userProgress) return;
    
    try {
      const isCompleted = userProgress.completedLessons.includes(lessonId);
      const completedLessons = isCompleted
        ? userProgress.completedLessons.filter(id => id !== lessonId)
        : [...userProgress.completedLessons, lessonId];
      
      const updatedProgress = await userProgressService.update(userProgress.id, {
        ...userProgress,
        completedLessons,
        lastAccessed: new Date()
      });
      
      setUserProgress(updatedProgress);
      toast.success(isCompleted ? 'Lesson marked as incomplete' : 'Lesson completed!');
    } catch (err) {
      toast.error('Failed to update progress');
    }
  };

  const saveNote = async () => {
    if (!noteContent.trim() || !userProgress) return;
    
    try {
      const newNote = {
        id: Date.now().toString(),
        lessonId,
        content: noteContent.trim(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const updatedNotes = [...(userProgress.notes || []), newNote];
      
      const updatedProgress = await userProgressService.update(userProgress.id, {
        ...userProgress,
        notes: updatedNotes
      });
      
      setUserProgress(updatedProgress);
      setExistingNotes(prev => [...prev, newNote]);
      setNoteContent('');
      toast.success('Note saved');
    } catch (err) {
      toast.error('Failed to save note');
    }
  };

  const deleteNote = async (noteId) => {
    if (!userProgress) return;
    
    try {
      const updatedNotes = userProgress.notes.filter(note => note.id !== noteId);
      
      const updatedProgress = await userProgressService.update(userProgress.id, {
        ...userProgress,
        notes: updatedNotes
      });
      
      setUserProgress(updatedProgress);
      setExistingNotes(prev => prev.filter(note => note.id !== noteId));
      toast.success('Note deleted');
    } catch (err) {
      toast.error('Failed to delete note');
    }
  };

  const downloadResource = (resource) => {
    toast.success(`Downloading ${resource.title}...`);
  };

  const getNextLesson = () => {
    if (!course || !lesson) return null;
    
    let foundCurrent = false;
    for (const module of course.modules) {
      for (const moduleLesson of module.lessons) {
        if (foundCurrent) {
          return moduleLesson;
        }
        if (moduleLesson.id === lesson.id) {
          foundCurrent = true;
        }
      }
    }
    return null;
  };

  const getPreviousLesson = () => {
    if (!course || !lesson) return null;
    
    let previous = null;
    for (const module of course.modules) {
      for (const moduleLesson of module.lessons) {
        if (moduleLesson.id === lesson.id) {
          return previous;
        }
        previous = moduleLesson;
      }
    }
    return null;
  };

  const nextLesson = getNextLesson();
  const previousLesson = getPreviousLesson();
  const isCompleted = userProgress?.completedLessons.includes(lessonId) || false;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
            <div className="h-6 bg-gray-200 rounded w-48"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-64 bg-gray-200 rounded-lg"></div>
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded-lg"></div>
              <div className="h-20 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course || !lesson) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Lesson not found</h3>
        <p className="text-gray-600 mb-4">{error || 'The requested lesson could not be found'}</p>
        <button
          onClick={() => navigate(`/course/${courseId}`)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Back to Course
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-full overflow-hidden">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(`/course/${courseId}`)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ApperIcon name="ArrowLeft" className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-heading font-bold text-gray-900 break-words">
              {lesson.title}
            </h1>
            <p className="text-gray-600 break-words">{course.title}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsNotePanelOpen(!isNotePanelOpen)}
            className={`p-2 rounded-lg transition-colors ${
              isNotePanelOpen ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <ApperIcon name="FileText" className="w-5 h-5" />
          </button>
          
          <button
            onClick={toggleLessonComplete}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isCompleted 
                ? 'bg-success text-white hover:bg-success/90' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isCompleted ? 'Completed' : 'Mark Complete'}
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className={`${isNotePanelOpen ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-6`}>
          {/* Video/Content Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            {lesson.videoUrl ? (
              <div className="aspect-video bg-gray-900 flex items-center justify-center">
                <div className="text-center text-white">
                  <ApperIcon name="Play" className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Video: {lesson.title}</p>
                  <p className="text-sm opacity-75">{lesson.duration} minutes</p>
                </div>
              </div>
            ) : (
              <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                <div className="text-center">
                  <ApperIcon name="BookOpen" className="w-16 h-16 text-primary mx-auto mb-4" />
                  <p className="text-lg text-gray-700">Text-based Lesson</p>
                  <p className="text-sm text-gray-500">{lesson.duration} minutes</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Lesson Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="prose max-w-none">
              <div 
                className="text-gray-700 leading-relaxed break-words"
                dangerouslySetInnerHTML={{ 
                  __html: lesson.content.replace(/\n/g, '<br>') 
                }}
              />
            </div>
          </motion.div>

          {/* Resources */}
          {lesson.resources && lesson.resources.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <h3 className="font-heading font-semibold text-gray-900 mb-4">
                Lesson Resources
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {lesson.resources.map((resource) => (
                  <div 
                    key={resource.id} 
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-medium ${
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
                        <p className="font-medium text-gray-900 break-words">
                          {resource.title}
                        </p>
                        <p className="text-sm text-gray-500">
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
                ))}
              </div>
            </motion.div>
          )}

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-between"
          >
            <div>
              {previousLesson ? (
                <button
                  onClick={() => navigate(`/course/${courseId}/lesson/${previousLesson.id}`)}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                >
                  <ApperIcon name="ChevronLeft" className="w-4 h-4" />
                  <span>Previous Lesson</span>
                </button>
              ) : (
                <div></div>
              )}
            </div>
            
            <div>
              {nextLesson ? (
                <button
                  onClick={() => navigate(`/course/${courseId}/lesson/${nextLesson.id}`)}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <span>Next Lesson</span>
                  <ApperIcon name="ChevronRight" className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => navigate(`/course/${courseId}`)}
                  className="px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90 transition-colors"
                >
                  Course Complete!
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Notes Panel */}
        {isNotePanelOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Add Note */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-heading font-semibold text-gray-900 mb-4">
                Add Note
              </h3>
              
              <div className="space-y-4">
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Write your notes here..."
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
                
                <button
                  onClick={saveNote}
                  disabled={!noteContent.trim()}
                  className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Save Note
                </button>
              </div>
            </div>

            {/* Existing Notes */}
            {existingNotes.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-heading font-semibold text-gray-900 mb-4">
                  My Notes ({existingNotes.length})
                </h3>
                
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {existingNotes.map((note) => (
                    <div 
                      key={note.id} 
                      className="p-4 bg-gray-50 rounded-lg border border-gray-100"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs text-gray-500">
                          {format(new Date(note.createdAt), 'MMM dd, h:mm a')}
                        </span>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                        >
                          <ApperIcon name="Trash2" className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-gray-700 text-sm break-words">
                        {note.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default LessonView;