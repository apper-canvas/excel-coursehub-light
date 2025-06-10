let userProgressData = [
  {
    id: "1",
    courseId: "1",
    completedLessons: ["1", "2"],
    lastAccessed: new Date("2024-01-15T10:30:00"),
    notes: [
      {
        id: "note1",
        lessonId: "1",
        content: "React fundamentals are crucial for building modern web applications. Key concepts include components, state, and props.",
        createdAt: new Date("2024-01-15T10:35:00"),
        updatedAt: new Date("2024-01-15T10:35:00")
      },
      {
        id: "note2",
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
    courseId: "3",
    completedLessons: ["7", "8", "9"],
    lastAccessed: new Date("2024-01-14T15:45:00"),
    notes: [
      {
        id: "note3",
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
    courseId: "2",
    completedLessons: [],
    lastAccessed: new Date("2024-01-13T09:20:00"),
    notes: [],
    isFavorite: true
  }
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const userProgressService = {
  async getAll() {
    await delay(250);
    return [...userProgressData];
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
  }
};

export default userProgressService;