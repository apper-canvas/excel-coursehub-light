import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const LessonHeader = ({ 
    courseTitle, 
    lessonTitle, 
    isCompleted, 
    isNotePanelOpen, 
    onBack, 
    onToggleComplete, 
    onToggleNotePanel 
}) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6"
        >
            <div className="flex items-center space-x-4">
                <Button
                    onClick={onBack}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ApperIcon name="ArrowLeft" className="w-5 h-5 text-gray-600" />
                </Button>
                <div>
                    <Text as="h1" className="text-2xl font-heading font-bold text-gray-900 break-words">
                        {lessonTitle}
                    </Text>
                    <Text as="p" className="text-gray-600 break-words">{courseTitle}</Text>
                </div>
            </div>
            
            <div className="flex items-center space-x-3">
                <Button
                    onClick={onToggleNotePanel}
                    className={`p-2 rounded-lg transition-colors ${
                        isNotePanelOpen ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    <ApperIcon name="FileText" className="w-5 h-5" />
                </Button>
                
                <Button
                    onClick={onToggleComplete}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        isCompleted 
                            ? 'bg-success text-white hover:bg-success/90' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    {isCompleted ? 'Completed' : 'Mark Complete'}
                </Button>
            </div>
        </motion.div>
    );
};

export default LessonHeader;