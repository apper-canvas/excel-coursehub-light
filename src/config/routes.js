import BrowseCoursesPage from '@/components/pages/BrowseCoursesPage';
import MyCoursesPage from '@/components/pages/MyCoursesPage';
import FavoritesPage from '@/components/pages/FavoritesPage';
import NotesPage from '@/components/pages/NotesPage';

export const routes = {
  browse: {
    id: 'browse',
    label: 'Browse Courses',
    path: '/browse',
    icon: 'Search',
component: BrowseCoursesPage
  },
  myCourses: {
    id: 'my-courses',
    label: 'My Courses',
    path: '/my-courses',
    icon: 'BookOpen',
component: MyCoursesPage
  },
  favorites: {
    id: 'favorites',
    label: 'Favorites',
    path: '/favorites',
    icon: 'Heart',
component: FavoritesPage
  },
  notes: {
    id: 'notes',
    label: 'Notes',
    path: '/notes',
    icon: 'FileText',
component: NotesPage
  }
};

export const routeArray = Object.values(routes);