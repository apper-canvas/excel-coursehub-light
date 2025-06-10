import React from 'react';
import Text from '@/components/atoms/Text';

const FilterSelect = ({ label, value, onChange, options, className = '', defaultValue = '' }) => {
    return (
        <div className={className}>
            {label && <Text as="label" className="block text-sm font-medium text-gray-700 mb-2">{label}</Text>}
            <select
                value={value}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
                <option value="">{defaultValue}</option>
                {options.map(option => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
        </div>
    );
};

export default FilterSelect;