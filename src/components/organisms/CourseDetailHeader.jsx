import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import ProgressIndicator from '@/components/atoms/ProgressIndicator';

const CourseDetailHeader = ({ course, userProgress, onToggleFavorite }) => {
    const progressData = {
        total: course.modules.reduce((total, module) => total + module.lessons.length, 0),
        completed: userProgress?.completedLessons.length || 0
    };
    progressData.percentage = progressData.total > 0 ? Math.round((progressData.completed / progressData.total) * 100) : 0;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-primary to-secondary rounded-xl p-8 text-white"
        >
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="flex-1">
                    <Text as="h1" className="text-3xl font-heading font-bold mb-2 break-words">
                        {course.title}
                    </Text>
                    <Text as="p" className="text-lg text-white/90 mb-4 break-words">
                        by {course.instructor}
                    </Text>
                    <Text as="p" className="text-white/80 mb-6 break-words">
                        {course.description}
                    </Text>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                        <span className="flex items-center space-x-1">
                            <ApperIcon name="Clock" className="w-4 h-4" />
                            <Text as="span">{course.duration} hours</Text>
                        </span>
                        <span className="flex items-center space-x-1">
                            <ApperIcon name="BarChart3" className="w-4 h-4" />
                            <Text as="span">{course.difficulty}</Text>
                        </span>
                        <span className="flex items-center space-x-1">
                            <ApperIcon name="Tag" className="w-4 h-4" />
                            <Text as="span">{course.category}</Text>
                        </span>
                        <span className="flex items-center space-x-1">
                            <ApperIcon name="BookOpen" className="w-4 h-4" />
                            <Text as="span">{progressData.total} lessons</Text>
                        </span>
                    </div>
                </div>
                
                <div className="flex items-center space-x-4">
                    <Button
                        onClick={onToggleFavorite}
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <ApperIcon 
                            name="Heart" 
                            className={`w-6 h-6 ${
                                userProgress?.isFavorite ? 'text-red-300 fill-current' : 'text-white'
                            }`} 
                        />
                    </Button>
                    
                    {progressData.total > 0 && (
                        <div className="text-center">
                            <Text as="div" className="text-2xl font-bold">{progressData.percentage}%</Text>
                            <Text as="div" className="text-white/80 text-sm">Complete</Text>
                        </div>
                    )}
                </div>
            </div>
            
            {progressData.total > 0 && (
                <div className="mt-6">
                    <div className="flex items-center justify-between text-sm mb-2">
                        <Text as="span">Course Progress</Text>
                        <Text as="span">{progressData.completed} of {progressData.total} lessons</Text>
                    </div>
                    <ProgressIndicator percentage={progressData.percentage} barClassName="bg-accent" className="h-3" />
                </div>
            )}
        </motion.div>
    );
};

export default CourseDetailHeader;