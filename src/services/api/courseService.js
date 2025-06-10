import coursesData from '../mockData/courses.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const courseService = {
  async getAll() {
    await delay(300);
    return [...coursesData];
  },

  async getById(id) {
    await delay(200);
    const course = coursesData.find(course => course.id === id);
    if (!course) {
      throw new Error('Course not found');
    }
    return { ...course };
  },

  async create(courseData) {
    await delay(400);
    const newCourse = {
      id: Date.now().toString(),
      ...courseData
    };
    return { ...newCourse };
  },

  async update(id, courseData) {
    await delay(350);
    const existingCourse = coursesData.find(course => course.id === id);
    if (!existingCourse) {
      throw new Error('Course not found');
    }
    const updatedCourse = { ...existingCourse, ...courseData };
    return { ...updatedCourse };
  },

  async delete(id) {
    await delay(300);
    const course = coursesData.find(course => course.id === id);
    if (!course) {
      throw new Error('Course not found');
    }
    return { success: true };
  }
};

export default courseService;