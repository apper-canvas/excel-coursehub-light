import { useState, useEffect } => 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import { courseService, userProgressService } from '@/services';
import LessonHeader from '@/components/organisms/LessonHeader';
import LessonMainContent from '@/components/organisms/LessonMainContent';
import NoteTakingPanel from '@/components/organisms/NoteTakingPanel';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

function LessonViewPage() {
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
        
        if (existingProgress && existingProgress.notes) {
          const lessonNotes = existingProgress.notes.filter(note => note.lessonId === lessonId);
          setExistingNotes(lessonNotes);
        }
        
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
      // If module finished, reset previous for next module
      previous = null; 
    }
    return null;
  };

  const handleNavigateLesson = (targetLessonId) => {
    navigate(`/course/${courseId}/lesson/${targetLessonId}`);
  };

  const handleCourseComplete = () => {
    navigate(`/course/${courseId}`);
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
        <Text as="h3" className="text-lg font-medium text-gray-900 mb-2">Lesson not found</Text>
        <Text as="p" className="text-gray-600 mb-4">{error || 'The requested lesson could not be found'}</Text>
        <Button
          onClick={() => navigate(`/course/${courseId}`)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Back to Course
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-full overflow-hidden">
      <LessonHeader
        courseTitle={course.title}
        lessonTitle={lesson.title}
        isCompleted={isCompleted}
        isNotePanelOpen={isNotePanelOpen}
        onBack={() => navigate(`/course/${courseId}`)}
        onToggleComplete={toggleLessonComplete}
        onToggleNotePanel={() => setIsNotePanelOpen(!isNotePanelOpen)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <LessonMainContent
          lesson={lesson}
          onDownloadResource={downloadResource}
          nextLesson={nextLesson}
          previousLesson={previousLesson}
          onNavigateLesson={handleNavigateLesson}
          onCourseComplete={handleCourseComplete}
          className={`${isNotePanelOpen ? 'lg:col-span-2' : 'lg:col-span-3'}`}
        />

        {isNotePanelOpen && (
          <NoteTakingPanel
            noteContent={noteContent}
            setNoteContent={setNoteContent}
            onSaveNote={saveNote}
            existingNotes={existingNotes}
            onDeleteNote={deleteNote}
          />
        )}
      </div>
    </div>
  );
}

export default LessonViewPage;