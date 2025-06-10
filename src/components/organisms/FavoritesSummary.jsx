import React from 'react';
import StatCard from '@/components/molecules/StatCard';

const FavoritesSummary = ({ favoriteCourses, userProgress, allCourses }) => {
    const getProgressPercentage = (courseId) => {
        const progress = userProgress.find(p => p.courseId === courseId);
        const course = allCourses.find(c => c.id === courseId);
        
        if (!progress || !course) return 0;
        
        const totalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0);
        const completedLessons = progress.completedLessons.length;
        
        return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    };

    const startedCoursesCount = favoriteCourses.filter(course => 
        userProgress.some(p => p.courseId === course.id && p.completedLessons.length > 0)
    ).length;

    const completedCoursesCount = favoriteCourses.filter(course => getProgressPercentage(course.id) === 100).length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
                iconName="Heart"
                iconBgClass="bg-red-100"
                iconColorClass="text-red-500"
                value={favoriteCourses.length}
                label="Favorite Courses"
                motionDelay={0}
            />
            <StatCard
                iconName="BookOpen"
                iconBgClass="bg-primary/10"
                iconColorClass="text-primary"
                value={startedCoursesCount}
                label="Started"
                motionDelay={0.1}
            />
            <StatCard
                iconName="Trophy"
                iconBgClass="bg-success/10"
                iconColorClass="text-success"
                value={completedCoursesCount}
                label="Completed"
                motionDelay={0.2}
            />
        </div>
    );
};

export default FavoritesSummary;