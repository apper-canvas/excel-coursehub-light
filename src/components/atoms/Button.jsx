import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, className = '', onClick, disabled, type = 'button', whileHover, whileTap }) => {
    // Filter out motion-specific props if they are not meant for the DOM element
    const buttonProps = { onClick, disabled, type };
    
    // Apply motion props only if provided
    const MotionComponent = whileHover || whileTap ? motion.button : 'button';

    return (
        <MotionComponent 
            {...buttonProps} 
            className={className} 
            whileHover={whileHover} 
            whileTap={whileTap}
        >
            {children}
        </MotionComponent>
    );
};

export default Button;