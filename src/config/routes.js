import BrowseCourses from '../pages/BrowseCourses';
import MyCourses from '../pages/MyCourses';
import Favorites from '../pages/Favorites';
import Notes from '../pages/Notes';

export const routes = {
  browse: {
    id: 'browse',
    label: 'Browse Courses',
    path: '/browse',
    icon: 'Search',
    component: BrowseCourses
  },
  myCourses: {
    id: 'my-courses',
    label: 'My Courses',
    path: '/my-courses',
    icon: 'BookOpen',
    component: MyCourses
  },
  favorites: {
    id: 'favorites',
    label: 'Favorites',
    path: '/favorites',
    icon: 'Heart',
    component: Favorites
  },
  notes: {
    id: 'notes',
    label: 'Notes',
    path: '/notes',
    icon: 'FileText',
    component: Notes
  }
};

export const routeArray = Object.values(routes);