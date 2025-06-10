// Simulated current user - in a real app this would come from authentication
const currentUser = {
  id: "user1",
  name: "John Doe",
  email: "john.doe@example.com"
};

let userProgressData = [
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
      return userProgressData.filter(p => p.userId === userId).map(p => ({ ...p }));
    }
    return [...userProgressData];
  },

  // Get user's progress only
  async getUserProgress(userId = currentUser.id) {
    await delay(250);
    return userProgressData.filter(p => p.userId === userId).map(p => ({ ...p }));
  },

  async getById(id) {
    await delay(200);
    const progress = userProgressData.find(p => p.id === id);
    if (!progress) {
      throw new Error('Progress not found');
    }
    return { ...progress };
  },

  async create(progressData) {
    await delay(400);
    const newProgress = {
      id: Date.now().toString(),
      userId: currentUser.id, // Always associate with current user
      ...progressData
    };
    userProgressData.push(newProgress);
    return { ...newProgress };
  },

  async update(id, progressData) {
    await delay(350);
    const index = userProgressData.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Progress not found');
    }
    const updatedProgress = { ...userProgressData[index], ...progressData };
    userProgressData[index] = updatedProgress;
    return { ...updatedProgress };
  },

  async delete(id) {
    await delay(300);
    const index = userProgressData.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Progress not found');
    }
    userProgressData.splice(index, 1);
    return { success: true };
  },

  // Update a specific note
  async updateNote(courseId, noteId, noteData) {
    await delay(300);
    const progress = userProgressData.find(p => p.courseId === courseId && p.userId === currentUser.id);
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
      : noteData.content;
    
    progress.notes[noteIndex] = {
      ...progress.notes[noteIndex],
      ...noteData,
      content: cleanContent || progress.notes[noteIndex].content,
      updatedAt: new Date()
    };
    
    return { ...progress.notes[noteIndex] };
  }
};

export default userProgressService;