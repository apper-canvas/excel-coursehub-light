import React from 'react';
import { motion } from 'framer-motion';
import CourseCard from '@/components/molecules/CourseCard';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const CourseListings = ({ 
    courses, 
    userProgress, 
    onToggleFavorite, 
    onNavigateCourse, 
    onContinueLearning, // Only for MyCourses/Favorites pages
    viewMode = 'grid', 
    showEmptyState = true,
    emptyStateIcon = 'Search',
    emptyStateTitle = 'No courses found',
    emptyStateMessage = 'Try adjusting your search criteria',
    onEmptyStateAction,
    emptyStateActionLabel = 'Show All Courses'
}) => {
    if (showEmptyState && courses.length === 0) {
        return (
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12"
            >
                <ApperIcon name={emptyStateIcon} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <Text as="h3" className="text-lg font-medium text-gray-900 mb-2">{emptyStateTitle}</Text>
                <Text as="p" className="text-gray-600 mb-4">{emptyStateMessage}</Text>
                {onEmptyStateAction && (
                    <Button
                        onClick={onEmptyStateAction}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        {emptyStateActionLabel}
                    </Button>
                )}
            </motion.div>
        );
    }

    const getProgressPercentage = (courseId) => {
        const progress = userProgress.find(p => p.courseId === courseId);
        if (!progress) return 0;
        
        const course = courses.find(c => c.id === courseId); // Ensure course context is available
        if (!course) return 0;
        
        const totalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0);
        const completedLessons = progress.completedLessons.length;
        
        return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    };

    const getIsFavorite = (courseId) => {
        return userProgress.find(p => p.courseId === courseId)?.isFavorite || false;
    };

    return (
        <div className={`grid gap-6 ${
            viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
        }`}>
            {courses.map((course, index) => (
                <CourseCard
                    key={course.id}
                    course={course}
                    progressPercentage={onContinueLearning ? getProgressPercentage(course.id) : undefined}
                    isFavorite={getIsFavorite(course.id)}
                    onToggleFavorite={onToggleFavorite}
                    onNavigateCourse={onNavigateCourse}
                    onContinueLearning={onContinueLearning}
                    viewMode={viewMode}
                    motionDelay={index * 0.05}
                />
            ))}
        </div>
    );
};

export default CourseListings;