import React from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Text from '@/components/atoms/Text';
import ResourceItem from '@/components/molecules/ResourceItem';

const CourseResourcesCard = ({ modules, onDownloadResource, motionDelay = 0 }) => {
    const allResources = modules.flatMap(module => 
        module.lessons.flatMap(lesson => lesson.resources || [])
    );

    if (allResources.length === 0) return null;

    return (
        <Card
            motionProps={{
                initial: { opacity: 0, x: 20 },
                animate: { opacity: 1, x: 0 },
                transition: { delay: motionDelay }
            }}
            className="p-6"
        >
            <Text as="h3" className="font-heading font-semibold text-gray-900 mb-4">Course Resources</Text>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
                {allResources.map(resource => (
                    <ResourceItem 
                        key={resource.id} 
                        resource={resource} 
                        onDownload={onDownloadResource} 
                    />
                ))}
            </div>
        </Card>
    );
};

export default CourseResourcesCard;