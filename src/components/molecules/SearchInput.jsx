import React from 'react';
import Input from '@/components/atoms/Input';
import Text from '@/components/atoms/Text';
import ApperIcon from '@/components/ApperIcon';

const SearchInput = ({ label, value, onChange, placeholder, className = '' }) => {
    return (
        <div className={className}>
            {label && <Text as="label" className="block text-sm font-medium text-gray-700 mb-2">{label}</Text>}
            <div className="relative">
                <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                    type="text"
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="pl-10 pr-4"
                />
            </div>
        </div>
    );
};

export default SearchInput;