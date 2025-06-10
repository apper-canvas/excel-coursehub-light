import React from 'react';

const Input = ({ as = 'input', className = '', ...props }) => {
    const Component = as;
    return (
        <Component
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${className}`}
            {...props}
        />
    );
};

export default Input;