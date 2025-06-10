import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Card from '@/components/atoms/Card';

const StatCard = ({ iconName, iconBgClass, iconColorClass, value, label, motionDelay = 0 }) => {
    return (
        <Card
            motionProps={{
                initial: { opacity: 0, scale: 0.9 },
                animate: { opacity: 1, scale: 1 },
                transition: { delay: motionDelay }
            }}
            className="p-6 text-center bg-surface-50"
        >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${iconBgClass}`}>
                <ApperIcon name={iconName} className={`w-6 h-6 ${iconColorClass}`} />
            </div>
            <Text as="h3" className="text-2xl font-bold text-gray-900">{value}</Text>
            <Text className="text-gray-600">{label}</Text>
        </Card>
    );
};

export default StatCard;