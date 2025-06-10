import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import ApperIcon from '../components/ApperIcon';
import { courseService, userProgressService } from '../services';

function Notes() {
  const [courses, setCourses] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
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
        setError(err.message || 'Failed to load notes');
        toast.error('Failed to load notes');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Get all notes from all courses
  const allNotes = userProgress.reduce((acc, progress) => {
    const course = courses.find(c => c.id === progress.courseId);
    if (course && progress.notes) {
      progress.notes.forEach(note => {
        // Find the lesson for this note
        let lesson = null;
        for (const module of course.modules) {
          const foundLesson = module.lessons.find(l => l.id === note.lessonId);
          if (foundLesson) {
            lesson = foundLesson;
            break;
          }
        }
        
        if (lesson) {
          acc.push({
            ...note,
            courseName: course.title,
            courseId: course.id,
            lessonName: lesson.title
          });
        }
      });
    }
    return acc;
  }, []);

  // Filter notes
  const filteredNotes = allNotes.filter(note => {
    const matchesSearch = !searchTerm || 
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.lessonName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCourse = !selectedCourse || note.courseId === selectedCourse;
    
    return matchesSearch && matchesCourse;
  });

  // Sort notes by most recent
  const sortedNotes = filteredNotes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  const coursesWithNotes = courses.filter(course => 
    userProgress.some(progress => 
      progress.courseId === course.id && progress.notes && progress.notes.length > 0
    )
  );

  const deleteNote = async (noteId, courseId) => {
    try {
      const progress = userProgress.find(p => p.courseId === courseId);
      if (progress) {
        const updatedNotes = progress.notes.filter(note => note.id !== noteId);
        const updatedProgress = await userProgressService.update(progress.id, {
          ...progress,
          notes: updatedNotes
        });
        
        setUserProgress(prev => 
          prev.map(p => p.id === progress.id ? updatedProgress : p)
        );
        
        toast.success('Note deleted');
      }
    } catch (err) {
      toast.error('Failed to delete note');
    }
  };

  const goToLesson = (courseId, lessonId) => {
    navigate(`/course/${courseId}/lesson/${lessonId}`);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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
        <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load notes</h3>
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

  if (allNotes.length === 0) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-12"
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
        >
          <ApperIcon name="FileText" className="w-16 h-16 text-gray-300 mx-auto" />
        </motion.div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No notes yet</h3>
        <p className="mt-2 text-gray-600 mb-6">Start taking notes while learning to keep track of important insights</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/browse')}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Start Learning
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">My Notes</h1>
          <p className="text-gray-600 mt-1">
            {sortedNotes.length} note{sortedNotes.length !== 1 ? 's' : ''} across {coursesWithNotes.length} course{coursesWithNotes.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex items-center space-x-2 text-primary">
          <ApperIcon name="FileText" className="w-5 h-5" />
          <span className="font-medium">{allNotes.length} Total Notes</span>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Search */}
        <div className="relative">
          <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search notes..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Course Filter */}
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">All Courses</option>
          {coursesWithNotes.map(course => (
            <option key={course.id} value={course.id}>{course.title}</option>
          ))}
        </select>
      </div>

      {/* Clear Filters */}
      {(searchTerm || selectedCourse) && (
        <button
          onClick={() => {
            setSearchTerm('');
            setSelectedCourse('');
          }}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Clear Filters
        </button>
      )}

      {/* Notes List */}
      {sortedNotes.length === 0 ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-12"
        >
          <ApperIcon name="Search" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notes found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search criteria</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCourse('');
            }}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Show All Notes
          </button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {sortedNotes.map((note, index) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      {note.courseName}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-600 break-words">
                      {note.lessonName}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {format(new Date(note.updatedAt), 'MMM dd, yyyy • h:mm a')}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => goToLesson(note.courseId, note.lessonId)}
                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                    title="Go to lesson"
                  >
                    <ApperIcon name="ExternalLink" className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteNote(note.id, note.courseId)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete note"
                  >
                    <ApperIcon name="Trash2" className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div 
                className="prose prose-sm max-w-none text-gray-700 break-words"
                dangerouslySetInnerHTML={{ 
                  __html: note.content.replace(/\n/g, '<br>') 
                }}
              />
            </motion.div>
          ))}
        </div>
      )}
      
      {sortedNotes.length > 0 && (
        <div className="text-center text-gray-600">
          Showing {sortedNotes.length} of {allNotes.length} notes
        </div>
      )}
    </div>
  );
}

export default Notes;