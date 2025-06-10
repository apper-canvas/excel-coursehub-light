import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import ProgressIndicator from '@/components/atoms/ProgressIndicator';

const CourseCard = ({ 
    course, 
    progressPercentage, 
    isFavorite, 
    onToggleFavorite, 
    onNavigateCourse, 
    onContinueLearning, 
    viewMode,
    motionDelay = 0 
}) => {
    return (
        <Card
            motionProps={{
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: motionDelay },
                whileHover: { scale: 1.02 }
            }}
            className={`hover:shadow-md transition-all duration-200 overflow-hidden ${
                viewMode === 'list' ? 'flex' : ''
            } group`}
        >
            <div 
                className={`${
                    viewMode === 'list' 
                        ? 'w-48 h-32 flex-shrink-0' 
                        : 'h-40 w-full'
                } bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center cursor-pointer relative`}
                onClick={() => onNavigateCourse(course.id)}
            >
                <ApperIcon name="BookOpen" className="w-12 h-12 text-primary" />
                {isFavorite && (
                    <div className="absolute top-3 right-3">
                        <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                            <ApperIcon name="Heart" className="w-4 h-4 text-red-500 fill-current" />
                        </div>
                    </div>
                )}
            </div>
            
            <div className={`p-6 space-y-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                <div className="flex items-start justify-between">
                    <div 
                        className="flex-1 cursor-pointer min-w-0"
                        onClick={() => onNavigateCourse(course.id)}
                    >
                        <Text as="h3" className="font-heading font-semibold text-gray-900 mb-1 break-words">
                            {course.title}
                        </Text>
                        <Text as="p" className="text-sm text-gray-600 break-words">
                            by {course.instructor}
                        </Text>
                    </div>
                    
                    {onToggleFavorite && ( // Only show if toggleFavorite is passed (e.g., on BrowseCourses)
                        <Button
                            onClick={() => onToggleFavorite(course.id)}
                            className="ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
                            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                        >
                            <ApperIcon 
                                name="Heart" 
                                className={`w-5 h-5 ${
                                    isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'
                                }`} 
                            />
                        </Button>
                    )}
                    {onContinueLearning && !onToggleFavorite && ( // Only show 'X' button for favorites list
                         <Button
                            onClick={() => onToggleFavorite(course.id)} // re-use toggleFavorite to remove
                            className="ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                            title="Remove from favorites"
                        >
                            <ApperIcon name="X" className="w-4 h-4 text-gray-400" />
                        </Button>
                    )}
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center space-x-1">
                        <ApperIcon name="Clock" className="w-4 h-4" />
                        <Text as="span">{course.duration}h</Text>
                    </span>
                    <span className="px-2 py-1 bg-surface-100 rounded-full text-xs">
                        {course.difficulty}
                    </span>
                </div>
                
                <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                    {course.category}
                </span>
                
                {progressPercentage !== undefined && progressPercentage > 0 && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <Text as="span" className="text-gray-600">Progress</Text>
                            <Text as="span" className="text-accent font-medium">{progressPercentage}%</Text>
                        </div>
                        <ProgressIndicator percentage={progressPercentage} />
                    </div>
                )}
                
                {onContinueLearning && ( // Only show continue button if it's for 'My Courses'
                    <Button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onContinueLearning(course.id)}
                        className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        {progressPercentage === 100 ? 'Review Course' : 'Continue Learning'}
                    </Button>
                )}
            </div>
        </Card>
    );
};

export default CourseCard;