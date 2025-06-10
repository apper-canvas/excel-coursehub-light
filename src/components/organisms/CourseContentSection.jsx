import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import Card from '@/components/atoms/Card';
import ProgressIndicator from '@/components/atoms/ProgressIndicator';
import LessonItem from '@/components/molecules/LessonItem';

const CourseContentSection = ({ 
    modules, 
    userProgress, 
    expandedModules, 
    onToggleModule, 
    onToggleLessonComplete, 
    onStartLesson 
}) => {

    const getModuleProgress = (module) => {
        if (!userProgress) return { percentage: 0, completed: 0, total: module.lessons.length };
        
        const completedLessons = module.lessons.filter(lesson => 
            userProgress.completedLessons.includes(lesson.id)
        ).length;
        const percentage = module.lessons.length > 0 ? 
          Math.round((completedLessons / module.lessons.length) * 100) : 0;
        
        return { percentage, completed: completedLessons, total: module.lessons.length };
    };

    return (
        <div className="space-y-4">
            {modules.map((module, moduleIndex) => {
                const moduleProgress = getModuleProgress(module);
                const isExpanded = expandedModules[module.id];
                
                return (
                    <Card
                        key={module.id}
                        motionProps={{
                            initial: { opacity: 0, y: 20 },
                            animate: { opacity: 1, y: 0 },
                            transition: { delay: moduleIndex * 0.1 }
                        }}
                        className="overflow-hidden"
                    >
                        <Button
                            onClick={() => onToggleModule(module.id)}
                            className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <Text as="h3" className="font-heading font-semibold text-gray-900 mb-1 break-words">
                                        Module {module.order}: {module.title}
                                    </Text>
                                    <Text as="p" className="text-gray-600 text-sm break-words">
                                        {module.description}
                                    </Text>
                                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                        <Text as="span">{module.lessons.length} lessons</Text>
                                        <Text as="span">•</Text>
                                        <Text as="span">{moduleProgress.completed} of {moduleProgress.total} completed</Text>
                                        <Text as="span">•</Text>
                                        <Text as="span" className="text-accent font-medium">{moduleProgress.percentage}%</Text>
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-3 ml-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                        <div className="text-sm font-medium text-gray-600">
                                            {moduleProgress.percentage}%
                                        </div>
                                    </div>
                                    <ApperIcon 
                                        name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                                        className="w-5 h-5 text-gray-400" 
                                    />
                                </div>
                            </div>
                            
                            <ProgressIndicator percentage={moduleProgress.percentage} className="mt-3 h-2" />
                        </Button>
                        
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="border-t border-gray-100"
                                >
                                    <div className="p-6 space-y-3">
                                        {module.lessons.map((lesson, lessonIndex) => (
                                            <LessonItem
                                                key={lesson.id}
                                                lesson={lesson}
                                                isCompleted={userProgress?.completedLessons.includes(lesson.id) || false}
                                                onToggleComplete={onToggleLessonComplete}
                                                onStartLesson={onStartLesson}
                                                motionDelay={lessonIndex * 0.05}
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Card>
                );
            })}
        </div>
    );
};

export default CourseContentSection;