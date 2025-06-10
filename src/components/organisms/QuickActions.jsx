import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const QuickActions = ({ onNavigateBrowse, onNavigateNotes, className = '' }) => {
    return (
        <section className={`${className}`}>
            {/* Enhanced Section Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-8"
            >
                <Text as="h2" className="font-heading font-bold text-3xl md:text-4xl text-gray-900 mb-3">
                    Review Your Notes & Explore New Courses
                </Text>
                <Text as="p" className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Continue your learning journey by reviewing your notes or discovering new courses to expand your skills
                </Text>
            </motion.div>

            {/* Enhanced Action Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Notes Card */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="group bg-gradient-to-br from-primary/8 via-primary/5 to-secondary/8 rounded-2xl p-8 border-2 border-primary/15 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/25"
                >
                    <div className="flex flex-col space-y-6">
                        {/* Icon and Badge */}
                        <div className="flex items-center justify-between">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                                <ApperIcon name="FileText" className="w-8 h-8 text-white" />
                            </div>
                            <div className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                                Study Tools
                            </div>
                        </div>

                        {/* Content */}
                        <div className="space-y-3">
                            <Text as="h3" className="font-heading font-bold text-2xl text-gray-900 group-hover:text-primary transition-colors duration-300">
                                Review Your Notes
                            </Text>
                            <Text as="p" className="text-gray-600 text-lg leading-relaxed">
                                Access all your notes and annotations in one organized place. Review key concepts and insights from your learning journey.
                            </Text>
                        </div>

                        {/* Action Button */}
                        <Button
                            onClick={onNavigateNotes}
                            className="w-full py-4 px-6 bg-gradient-to-r from-primary to-primary/90 text-white rounded-xl font-semibold text-lg hover:from-primary/90 hover:to-primary hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <ApperIcon name="BookOpen" className="w-5 h-5" />
                            <span>View My Notes</span>
                        </Button>
                    </div>
                </motion.div>

                {/* Courses Card */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="group bg-gradient-to-br from-accent/8 via-accent/5 to-orange-100/50 rounded-2xl p-8 border-2 border-accent/15 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-accent/25"
                >
                    <div className="flex flex-col space-y-6">
                        {/* Icon and Badge */}
                        <div className="flex items-center justify-between">
                            <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent/80 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                                <ApperIcon name="Search" className="w-8 h-8 text-white" />
                            </div>
                            <div className="px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full">
                                Discover
                            </div>
                        </div>

                        {/* Content */}
                        <div className="space-y-3">
                            <Text as="h3" className="font-heading font-bold text-2xl text-gray-900 group-hover:text-accent transition-colors duration-300">
                                Explore New Courses
                            </Text>
                            <Text as="p" className="text-gray-600 text-lg leading-relaxed">
                                Discover courses across various subjects and skill levels. Find your next learning adventure and expand your knowledge.
                            </Text>
                        </div>

                        {/* Action Button */}
                        <Button
                            onClick={onNavigateBrowse}
                            className="w-full py-4 px-6 bg-gradient-to-r from-accent to-accent/90 text-white rounded-xl font-semibold text-lg hover:from-accent/90 hover:to-accent hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <ApperIcon name="Compass" className="w-5 h-5" />
                            <span>Browse Courses</span>
                        </Button>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Accent */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-8 flex justify-center"
            >
                <div className="w-24 h-1 bg-gradient-to-r from-primary via-accent to-secondary rounded-full"></div>
            </motion.div>
        </section>
    );
};

export default QuickActions;