import React from 'react';
import Text from '@/components/atoms/Text';

const FilterSelect = ({ label, value, onChange, options, className = '', defaultValue = '' }) => {
    // Helper function to extract key from option
    const getOptionKey = (option, index) => {
        if (typeof option === 'string') return option;
        if (typeof option === 'object' && option !== null) {
            return option.value || option.id || option.label || `option-${index}`;
        }
        return `option-${index}`;
    };

    // Helper function to extract value from option
    const getOptionValue = (option) => {
        if (typeof option === 'string') return option;
        if (typeof option === 'object' && option !== null) {
            return option.value || option.label || '';
        }
        return '';
    };

    // Helper function to extract display text from option
    const getOptionText = (option) => {
        if (typeof option === 'string') return option;
        if (typeof option === 'object' && option !== null) {
            return option.label || option.text || option.value || '';
        }
        return '';
    };

    return (
        <div className={className}>
            {label && <Text as="label" className="block text-sm font-medium text-gray-700 mb-2">{label}</Text>}
            <select
                value={value}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
                <option value="">{defaultValue}</option>
                {options.map((option, index) => (
                    <option 
                        key={getOptionKey(option, index)} 
                        value={getOptionValue(option)}
                    >
                        {getOptionText(option)}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default FilterSelect;