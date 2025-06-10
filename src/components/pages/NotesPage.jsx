import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import { courseService, userProgressService } from '@/services';
import SearchInput from '@/components/molecules/SearchInput';
import FilterSelect from '@/components/molecules/FilterSelect';
import NotesList from '@/components/organisms/NotesList';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

function NotesPage() {
  const [courses, setCourses] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [editContent, setEditContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Get current user and their progress only
        const user = userProgressService.getCurrentUser();
        setCurrentUser(user);
        
        const [coursesData, progressData] = await Promise.all([
          courseService.getAll(),
          userProgressService.getUserProgress(user.id) // Only get current user's progress
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

// Get all notes from current user's courses and enrich them
  const allNotes = userProgress.reduce((acc, progress) => {
    const course = courses.find(c => c.id === progress.courseId);
    if (course && progress.notes) {
      progress.notes
        .filter(note => note.userId === currentUser?.id) // Only show current user's notes
        .forEach(note => {
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

  const handleDeleteNote = async (noteId, courseId) => {
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
const handleEditNote = (note) => {
    setEditingNote(note);
    setEditContent(note.content);
  };

  const handleSaveNote = async () => {
    if (!editingNote) return;
    
    try {
      const updatedNote = await userProgressService.updateNote(
        editingNote.courseId,
        editingNote.id,
        { content: editContent }
      );
      
      // Update local state
      setUserProgress(prev => prev.map(progress => {
        if (progress.courseId === editingNote.courseId) {
          return {
            ...progress,
            notes: progress.notes.map(note => 
              note.id === editingNote.id ? updatedNote : note
            )
          };
        }
        return progress;
      }));
      
      setEditingNote(null);
      setEditContent('');
      toast.success('Note updated successfully');
    } catch (err) {
      toast.error('Failed to update note');
    }
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setEditContent('');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCourse('');
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
        <Text as="h3" className="text-lg font-medium text-gray-900 mb-2">Unable to load notes</Text>
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
        <Text as="h3" className="mt-4 text-lg font-medium text-gray-900">No notes yet</Text>
        <Text as="p" className="mt-2 text-gray-600 mb-6">
          {currentUser ? `Welcome ${currentUser.name}! ` : ''}
          Start taking notes while learning to keep track of important insights
        </Text>
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/browse')}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Start Learning
        </Button>
      </motion.div>
);
  }

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Text as="h1" className="text-2xl font-heading font-bold text-gray-900">My Notes</Text>
          <Text as="p" className="text-gray-600 mt-1">
            {currentUser && <span className="text-primary font-medium">{currentUser.name}</span>} • {' '}
            {sortedNotes.length} note{sortedNotes.length !== 1 ? 's' : ''} across {coursesWithNotes.length} course{coursesWithNotes.length !== 1 ? 's' : ''}
          </Text>
        </div>
        
        <div className="flex items-center space-x-2 text-primary">
          <ApperIcon name="User" className="w-5 h-5" />
          <Text as="span" className="font-medium">Personal Notes</Text>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SearchInput 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search notes..."
          className="relative"
        />

        <FilterSelect
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          options={coursesWithNotes.map(course => ({ value: course.id, label: course.title }))}
          defaultValue="All Courses"
        />
      </div>

      {(searchTerm || selectedCourse) && (
        <Button
          onClick={clearFilters}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
Clear Filters
        </Button>
      )}

      <NotesList 
        notes={sortedNotes} 
        onDeleteNote={handleDeleteNote} 
        onEditNote={handleEditNote}
        editingNote={editingNote}
        editContent={editContent}
        onEditContentChange={setEditContent}
        onSaveNote={handleSaveNote}
        onCancelEdit={handleCancelEdit}
        allNotesCount={allNotes.length}
        filteredNotesCount={sortedNotes.length}
        showEmptyState={true}
      />
    </div>
  );
}

export default NotesPage;