import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import NoteItem from '@/components/molecules/NoteItem';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const NotesList = ({ 
  notes, 
  onDeleteNote, 
  onEditNote,
  editingNote,
  editContent,
  onEditContentChange,
  onSaveNote,
  onCancelEdit,
  showEmptyState = true, 
  allNotesCount = 0, 
  filteredNotesCount = 0 
}) => {
    if (showEmptyState && notes.length === 0) {
        return (
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12"
            >
                <ApperIcon name="Search" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <Text as="h3" className="text-lg font-medium text-gray-900 mb-2">No notes found</Text>
                <Text as="p" className="text-gray-600 mb-4">Try adjusting your search criteria or create your first note</Text>
            </motion.div>
        );
    }

    return (
        <div className="space-y-4">
            {notes.map((note, index) => (
                <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                                    {note.courseName}
                                </span>
                                <span className="text-gray-400">•</span>
                                <Text as="span" className="text-sm text-gray-600 break-words">
                                    {note.lessonName}
                                </Text>
                            </div>
                            <Text as="p" className="text-xs text-gray-500">
                                {format(new Date(note.updatedAt), 'MMM dd, yyyy • h:mm a')}
                            </Text>
                        </div>
<div className="flex items-center space-x-2">
                            <Button
                                onClick={() => onEditNote(note)}
                                className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                                title="Edit note"
                            >
                                <ApperIcon name="Edit3" className="w-4 h-4" />
                            </Button>
                            <Button
                                onClick={() => onDeleteNote(note.id, note.courseId)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete note"
                            >
                                <ApperIcon name="Trash2" className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
{editingNote && editingNote.id === note.id ? (
                        <div className="space-y-4">
                            <textarea
                                value={editContent}
                                onChange={(e) => onEditContentChange(e.target.value)}
                                className="w-full min-h-[120px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                                placeholder="Edit your note..."
                            />
                            <div className="flex items-center space-x-2">
                                <Button
                                    onClick={onSaveNote}
                                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
                                >
                                    <ApperIcon name="Check" className="w-4 h-4 mr-1" />
                                    Save
                                </Button>
                                <Button
                                    onClick={onCancelEdit}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                                >
                                    <ApperIcon name="X" className="w-4 h-4 mr-1" />
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div 
                            className="prose prose-sm max-w-none text-gray-700 break-words cursor-pointer hover:bg-gray-50 rounded p-2 -m-2 transition-colors"
                            onClick={() => onEditNote(note)}
                            title="Click to edit note"
                            dangerouslySetInnerHTML={{ __html: note.content.replace(/\n/g, '<br>') }}
                        />
                    )}
                </motion.div>
            ))}
            
            {allNotesCount > 0 && filteredNotesCount > 0 && (
                <div className="text-center text-gray-600">
                    Showing {filteredNotesCount} of {allNotesCount} notes
                </div>
            )}
        </div>
    );
};

export default NotesList;