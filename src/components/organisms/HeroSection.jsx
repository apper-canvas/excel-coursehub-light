import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const HeroSection = ({ onStartLearningClick }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-primary to-secondary rounded-xl p-8 text-white"
        >
            <div className="max-w-2xl">
                <Text as="h1" className="text-3xl md:text-4xl font-heading font-bold mb-4">
                    Welcome to CourseHub
                </Text>
                <Text as="p" className="text-lg text-white/90 mb-6">
                    Discover amazing courses, track your progress, and master new skills at your own pace.
                </Text>
                <Button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onStartLearningClick}
                    className="px-6 py-3 bg-white text-primary font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Start Learning Today
                </Button>
            </div>
        </motion.div>
    );
};

export default HeroSection;