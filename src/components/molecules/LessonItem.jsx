import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const LessonItem = ({ lesson, isCompleted, onToggleComplete, onStartLesson, motionDelay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: motionDelay }}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
                <Button
                    onClick={() => onToggleComplete(lesson.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isCompleted 
                            ? 'bg-success border-success text-white' 
                            : 'border-gray-300 hover:border-success'
                    }`}
                >
                    {isCompleted && <ApperIcon name="Check" className="w-3 h-3" />}
                </Button>
                
                <div className="flex-1 min-w-0">
                    <Text as="h4" className={`font-medium break-words ${
                        isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'
                    }`}>
                        {lesson.title}
                    </Text>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <ApperIcon name="Clock" className="w-3 h-3" />
                        <Text as="span">{lesson.duration} min</Text>
                        {lesson.resources && lesson.resources.length > 0 && (
                            <>
                                <Text as="span">•</Text>
                                <Text as="span">{lesson.resources.length} resource{lesson.resources.length !== 1 ? 's' : ''}</Text>
                            </>
                        )}
                    </div>
                </div>
            </div>
            
            <Button
                onClick={() => onStartLesson(lesson.id)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
            >
                {isCompleted ? 'Review' : 'Start'}
            </Button>
        </motion.div>
    );
};

export default LessonItem;