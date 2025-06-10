import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const ResourceItem = ({ resource, onDownload }) => {
    const resourceTypeMap = {
        pdf: { label: 'PDF', color: 'bg-red-500' },
        video: { label: 'VID', color: 'bg-blue-500' },
        slides: { label: 'PPT', color: 'bg-green-500' },
    };

    const typeInfo = resourceTypeMap[resource.type] || { label: 'FILE', color: 'bg-gray-500' };

    return (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-medium ${typeInfo.color}`}>
                    {typeInfo.label}
                </div>
                <div className="flex-1 min-w-0">
                    <Text as="p" className="font-medium text-gray-900 break-words">
                        {resource.title}
                    </Text>
                    <Text as="p" className="text-sm text-gray-500">
                        {(resource.size / 1024 / 1024).toFixed(1)} MB
                    </Text>
                </div>
            </div>
            <Button
                onClick={() => onDownload(resource)}
                className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
            >
                <ApperIcon name="Download" className="w-4 h-4" />
            </Button>
        </div>
    );
};

export default ResourceItem;