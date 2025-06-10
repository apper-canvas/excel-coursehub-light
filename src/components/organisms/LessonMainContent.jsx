import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import Card from '@/components/atoms/Card';
import ResourceItem from '@/components/molecules/ResourceItem';

const LessonMainContent = ({ lesson, onDownloadResource, nextLesson, previousLesson, onNavigateLesson, onCourseComplete, className = '' }) => {
    return (
        <div className={`space-y-6 ${className}`}>
            {/* Video/Content Area */}
            <Card
                motionProps={{
                    initial: { opacity: 0, scale: 0.95 },
                    animate: { opacity: 1, scale: 1 }
                }}
                className="overflow-hidden"
            >
                {lesson.videoUrl ? (
                    <div className="aspect-video bg-gray-900 flex items-center justify-center">
                        <div className="text-center text-white">
                            <ApperIcon name="Play" className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <Text as="p" className="text-lg">Video: {lesson.title}</Text>
                            <Text as="p" className="text-sm opacity-75">{lesson.duration} minutes</Text>
                        </div>
                    </div>
                ) : (
                    <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                        <div className="text-center">
                            <ApperIcon name="BookOpen" className="w-16 h-16 text-primary mx-auto mb-4" />
                            <Text as="p" className="text-lg text-gray-700">Text-based Lesson</Text>
                            <Text as="p" className="text-sm text-gray-500">{lesson.duration} minutes</Text>
                        </div>
                    </div>
                )}
            </Card>

            {/* Lesson Content */}
            <Card
                motionProps={{
                    initial: { opacity: 0, y: 20 },
                    animate: { opacity: 1, y: 0 },
                    transition: { delay: 0.1 }
                }}
                className="p-6"
            >
                <div className="prose max-w-none">
                    <div 
                        className="text-gray-700 leading-relaxed break-words"
                        dangerouslySetInnerHTML={{ 
                            __html: lesson.content.replace(/\n/g, '<br>') 
                        }}
                    />
                </div>
            </Card>

            {/* Resources */}
            {lesson.resources && lesson.resources.length > 0 && (
                <Card
                    motionProps={{
                        initial: { opacity: 0, y: 20 },
                        animate: { opacity: 1, y: 0 },
                        transition: { delay: 0.2 }
                    }}
                    className="p-6"
                >
                    <Text as="h3" className="font-heading font-semibold text-gray-900 mb-4">
                        Lesson Resources
                    </Text>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {lesson.resources.map((resource) => (
                            <ResourceItem 
                                key={resource.id} 
                                resource={resource} 
                                onDownload={onDownloadResource} 
                            />
                        ))}
                    </div>
                </Card>
            )}

            {/* Navigation */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-between"
            >
                <div>
                    {previousLesson ? (
                        <Button
                            onClick={() => onNavigateLesson(previousLesson.id)}
                            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                        >
                            <ApperIcon name="ChevronLeft" className="w-4 h-4" />
                            <Text as="span">Previous Lesson</Text>
                        </Button>
                    ) : (
                        <div></div>
                    )}
                </div>
                
                <div>
                    {nextLesson ? (
                        <Button
                            onClick={() => onNavigateLesson(nextLesson.id)}
                            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            <Text as="span">Next Lesson</Text>
                            <ApperIcon name="ChevronRight" className="w-4 h-4" />
                        </Button>
                    ) : (
                        <Button
                            onClick={onCourseComplete}
                            className="px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90 transition-colors"
                        >
                            Course Complete!
                        </Button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default LessonMainContent;