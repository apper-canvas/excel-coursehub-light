import React from 'react';
import StatCard from '@/components/molecules/StatCard';

const MyCoursesSummary = ({ enrolledCourses, userProgress }) => {
    const totalLessonsCompleted = userProgress.reduce((total, progress) => total + progress.completedLessons.length, 0);
    
    const totalProgressPercentages = enrolledCourses.reduce((sum, course) => {
        const progress = userProgress.find(p => p.courseId === course.id);
        if (!progress) return sum; // Should not happen if filtered correctly
        
        const totalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0);
        const completedLessons = progress.completedLessons.length;
        return sum + (totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0);
    }, 0);

    const averageProgress = enrolledCourses.length > 0 
        ? Math.round(totalProgressPercentages / enrolledCourses.length) 
        : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
                iconName="BookOpen"
                iconBgClass="bg-primary/10"
                iconColorClass="text-primary"
                value={enrolledCourses.length}
                label="Courses Started"
                motionDelay={0}
            />
            <StatCard
                iconName="CheckCircle"
                iconBgClass="bg-success/10"
                iconColorClass="text-success"
                value={totalLessonsCompleted}
                label="Lessons Completed"
                motionDelay={0.1}
            />
            <StatCard
                iconName="Trophy"
                iconBgClass="bg-accent/10"
                iconColorClass="text-accent"
                value={`${averageProgress}%`}
                label="Average Progress"
                motionDelay={0.2}
            />
        </div>
    );
};

export default MyCoursesSummary;