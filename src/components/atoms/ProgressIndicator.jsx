import React from 'react';
import { motion } from 'framer-motion';

const ProgressIndicator = ({ percentage, className = '', barClassName = '' }) => {
    return (
        <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`bg-accent h-2 rounded-full ${barClassName}`}
            />
        </div>
    );
};

export default ProgressIndicator;