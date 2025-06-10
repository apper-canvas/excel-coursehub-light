import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const QuickActions = ({ onNavigateBrowse, onNavigateNotes, className = '' }) => {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${className}`}>
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-accent/5 to-accent/10 rounded-xl p-6 border border-accent/20"
            >
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                        <ApperIcon name="Search" className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <Text as="h3" className="font-heading font-semibold text-gray-900 mb-1">
                            Explore New Courses
                        </Text>
                        <Text as="p" className="text-gray-600 text-sm break-words">
                            Discover courses across various subjects and skill levels
                        </Text>
                    </div>
                    <Button
                        onClick={onNavigateBrowse}
                        className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                    >
                        Browse
                    </Button>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-primary/5 to-secondary/10 rounded-xl p-6 border border-primary/20"
            >
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                        <ApperIcon name="FileText" className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <Text as="h3" className="font-heading font-semibold text-gray-900 mb-1">
                            Review Your Notes
                        </Text>
                        <Text as="p" className="text-gray-600 text-sm break-words">
                            Access all your notes and annotations in one place
                        </Text>
                    </div>
                    <Button
                        onClick={onNavigateNotes}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Notes
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};

export default QuickActions;