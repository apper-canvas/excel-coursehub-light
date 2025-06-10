import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, className = '', onClick, disabled, type = 'button', whileHover, whileTap }) => {
    // Base props for both regular and motion buttons
    const baseProps = { onClick, disabled, type, className };
    
    // Determine if we need motion functionality
    const useMotion = whileHover || whileTap;
    
    if (useMotion) {
        // Use motion.button with motion-specific props
        const motionProps = { ...baseProps };
        if (whileHover) motionProps.whileHover = whileHover;
        if (whileTap) motionProps.whileTap = whileTap;
        
        return (
            <motion.button {...motionProps}>
                {children}
            </motion.button>
        );
    }
    
    // Use regular button without motion props
    return (
        <button {...baseProps}>
            {children}
        </button>
    );
};

export default Button;