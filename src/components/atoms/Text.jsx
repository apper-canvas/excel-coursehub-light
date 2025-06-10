import React from 'react';

const Text = ({ as = 'p', children, className = '', ...props }) => {
    const Component = as;
    return <Component className={className} {...props}>{children}</Component>;
};

export default Text;