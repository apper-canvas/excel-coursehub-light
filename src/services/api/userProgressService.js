import { toast } from 'react-toastify';

// Mock data for user progress
let userProgressData = {
  courses: {},
  notes: [],
  favorites: [],
  certificates: []
};

// Helper function to sanitize content while preserving highlights
const sanitizeContent = (content) => {
  if (!content) return '';
  
  // Allow only highlight spans and basic formatting
  const allowedTags = ['span', 'br', 'strong', 'em', 'p'];
  const allowedClasses = ['highlight-yellow', 'highlight-green', 'highlight-blue', 'highlight-pink', 'highlight-orange', 'highlight-custom'];
  
  // Create a temporary div to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;
  
  // Remove script tags and other dangerous elements
  const scripts = tempDiv.querySelectorAll('script, object, embed, iframe');
  scripts.forEach(script => script.remove());
  
  // Filter spans to only allow highlight classes
  const spans = tempDiv.querySelectorAll('span');
  spans.forEach(span => {
    const hasValidClass = allowedClasses.some(cls => span.classList.contains(cls));
    if (!hasValidClass && !span.style.backgroundColor) {
      // Replace with text content if not a valid highlight span
      span.replaceWith(document.createTextNode(span.textContent));
    }
  });
return tempDiv.innerHTML;
};

// Mock current user
const currentUser = {
  id: "user1",
  name: "Current User",
  email: "user@example.com"
};

// Mock user progress array
const userProgressArray = [
  {
    id: "1",
    userId: "user1", // Associate with current user
    courseId: "1",
    completedLessons: ["1", "2"],
    lastAccessed: new Date("2024-01-15T10:30:00"),
    notes: [
      {
        id: "note1",
        userId: "user1",
        lessonId: "1",
        content: "React fundamentals are crucial for building modern web applications. Key concepts include components, state, and props.",
        createdAt: new Date("2024-01-15T10:35:00"),
        updatedAt: new Date("2024-01-15T10:35:00")
      },
      {
        id: "note2",
        userId: "user1",
        lessonId: "2",
        content: "JSX syntax makes it easier to write React components. Remember that JSX is transpiled to JavaScript function calls.",
        createdAt: new Date("2024-01-15T11:15:00"),
        updatedAt: new Date("2024-01-15T11:15:00")
      }
    ],
    isFavorite: true
  },
  {
    id: "2",
    userId: "user2", // Different user's data
    courseId: "3",
    completedLessons: ["7", "8", "9"],
    lastAccessed: new Date("2024-01-14T15:45:00"),
    notes: [
      {
        id: "note3",
        userId: "user2",
        lessonId: "7",
        content: "Python data structures: Lists are mutable, tuples are immutable. Choose the right one based on your needs.",
        createdAt: new Date("2024-01-14T15:50:00"),
        updatedAt: new Date("2024-01-14T15:50:00")
      }
    ],
    isFavorite: false
  },
  {
    id: "3",
    userId: "user1", // Current user's progress for another course
    courseId: "2",
    completedLessons: [],
    lastAccessed: new Date("2024-01-13T09:20:00"),
    notes: [],
    isFavorite: true
  }
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const userProgressService = {
  // Get current user info
  getCurrentUser() {
    return { ...currentUser };
  },

  // Get all progress records (optionally filtered by user)
  async getAll(userId = null) {
    await delay(250);
    if (userId) {
      return userProgressArray.filter(p => p.userId === userId).map(p => ({ ...p }));
    }
    return userProgressArray.map(p => ({ ...p }));
  },

  // Update note method
  updateNote: async (noteId, courseId, content) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const noteIndex = userProgressData.notes.findIndex(note => note.id === noteId);
          if (noteIndex === -1) {
            reject(new Error('Note not found'));
            return;
          }

          // Sanitize content while preserving highlights
          const sanitizedContent = sanitizeContent(content);

          userProgressData.notes[noteIndex] = {
            ...userProgressData.notes[noteIndex],
            content: sanitizedContent,
            updatedAt: new Date().toISOString()
          };

          const updatedNote = { ...userProgressData.notes[noteIndex] };
          resolve(updatedNote);
        } catch (error) {
          reject(error);
        }
      }, 300);
    });
  },

  // Create new progress record
  async create(progressData) {
    await delay(400);
    const newProgress = {
      id: Date.now().toString(),
      userId: currentUser.id, // Always associate with current user
      ...progressData
    };
    userProgressArray.push(newProgress);
    return { ...newProgress };
  },

  // Update progress record
  async update(id, progressData) {
    await delay(350);
    const index = userProgressArray.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Progress not found');
    }
    userProgressArray[index] = {
      ...userProgressArray[index],
      ...progressData
    };
    return { ...userProgressArray[index] };
  },

  // Delete progress record
  async delete(id) {
    await delay(300);
    const index = userProgressArray.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Progress not found');
    }
    userProgressArray.splice(index, 1);
    return { success: true };
  },

  // Add new note
  async addNote(courseId, lessonId, content, courseName = '', lessonName = '') {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Sanitize content while preserving highlights
          const sanitizedContent = sanitizeContent(content);
          
          const note = {
            id: Date.now().toString(),
            userId: currentUser.id,
            courseId,
            lessonId,
            courseName,
            lessonName,
            content: sanitizedContent,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          // Add to global notes array
          userProgressData.notes.push(note);

          // Also add to progress record if it exists
          const progress = userProgressArray.find(p => p.courseId === courseId && p.userId === currentUser.id);
          if (progress) {
            progress.notes.push(note);
          }

          resolve(note);
        } catch (error) {
          reject(error);
        }
      }, 300);
    });
  },

  // Update a specific note (alternative method)
  async updateSpecificNote(courseId, noteId, noteData) {
    await delay(300);
    const progress = userProgressArray.find(p => p.courseId === courseId && p.userId === currentUser.id);
    if (!progress) {
      throw new Error('Progress not found');
    }
    
    const noteIndex = progress.notes.findIndex(n => n.id === noteId);
    if (noteIndex === -1) {
      throw new Error('Note not found');
    }
    
    // Clean up content for storage - preserve highlights but sanitize
    const cleanContent = noteData.content 
      ? noteData.content
          .replace(/<div>/g, '\n')
          .replace(/<\/div>/g, '')
          .replace(/<br\s*\/?>/g, '\n')
          .replace(/&nbsp;/g, ' ')
          // Preserve highlight spans but clean up any malformed ones
          .replace(/<span class="highlight-(\w+)"([^>]*)>/g, '<span class="highlight-$1">')
          .replace(/<span class="highlight-custom"[^>]*style="background-color:\s*([^"]+)"[^>]*>/g, '<span class="highlight-custom" style="background-color: $1">')
      : noteData.content;
    
    progress.notes[noteIndex] = {
      ...progress.notes[noteIndex],
      ...noteData,
      content: cleanContent || progress.notes[noteIndex].content,
      updatedAt: new Date()
    };
    
    // Also update in global notes array
    const globalNoteIndex = userProgressData.notes.findIndex(n => n.id === noteId);
    if (globalNoteIndex !== -1) {
      userProgressData.notes[globalNoteIndex] = { ...progress.notes[noteIndex] };
    }
    
    return { ...progress.notes[noteIndex] };
  }
};

export default userProgressService;