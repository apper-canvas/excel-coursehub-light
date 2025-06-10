import React from 'react';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const NoteItem = ({ note, onDelete, onGoToLesson }) => {
    return (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-start justify-between mb-2">
                <Text as="span" className="text-xs text-gray-500">
                    {format(new Date(note.createdAt), 'MMM dd, h:mm a')}
                </Text>
                <Button
                    onClick={() => onDelete(note.id)}
                    className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                >
                    <ApperIcon name="Trash2" className="w-3 h-3" />
                </Button>
            </div>
<div 
                className="text-gray-700 text-sm break-words"
                dangerouslySetInnerHTML={{ 
                    __html: note.content
                        .replace(/\n/g, '<br>')
                        .replace(/<span class="highlight-(\w+)"[^>]*>/g, '<span class="highlight-$1">')
                }}
            />
        </div>
    );
};

export default NoteItem;