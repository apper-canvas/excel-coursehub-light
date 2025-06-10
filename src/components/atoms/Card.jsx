import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', motionProps, ...props }) => {
    const Component = motionProps ? motion.div : 'div';
    return (
        <Component
            className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}
            {...(motionProps || {})}
            {...props}
        >
            {children}
        </Component>
    );
};

export default Card;