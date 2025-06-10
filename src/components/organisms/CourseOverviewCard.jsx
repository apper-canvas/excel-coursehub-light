import React from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Text from '@/components/atoms/Text';

const CourseOverviewCard = ({ progressData, courseDuration, motionDelay = 0 }) => {
    return (
        <Card
            motionProps={{
                initial: { opacity: 0, x: 20 },
                animate: { opacity: 1, x: 0 },
                transition: { delay: motionDelay }
            }}
            className="p-6"
        >
            <Text as="h3" className="font-heading font-semibold text-gray-900 mb-4">Course Overview</Text>
            
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Text as="span" className="text-gray-600">Total Lessons</Text>
                    <Text as="span" className="font-medium">{progressData.total}</Text>
                </div>
                <div className="flex items-center justify-between">
                    <Text as="span" className="text-gray-600">Completed</Text>
                    <Text as="span" className="font-medium text-success">{progressData.completed}</Text>
                </div>
                <div className="flex items-center justify-between">
                    <Text as="span" className="text-gray-600">Progress</Text>
                    <Text as="span" className="font-medium text-accent">{progressData.percentage}%</Text>
                </div>
                <div className="flex items-center justify-between">
                    <Text as="span" className="text-gray-600">Duration</Text>
                    <Text as="span" className="font-medium">{courseDuration}h</Text>
                </div>
            </div>
        </Card>
    );
};

export default CourseOverviewCard;