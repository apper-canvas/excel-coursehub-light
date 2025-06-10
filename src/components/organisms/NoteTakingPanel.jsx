import React from 'react';
import { motion } from 'framer-motion';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import Card from '@/components/atoms/Card';
import NoteItem from '@/components/molecules/NoteItem';

const NoteTakingPanel = ({ noteContent, setNoteContent, onSaveNote, existingNotes, onDeleteNote, onGoToLesson }) => {
    const handleHighlight = (content, color) => {
        const selection = window.getSelection();
        if (selection.toString().length > 0) {
            const selectedText = selection.toString();
            const highlightedText = `<span class="highlight-${color}">${selectedText}</span>`;
            const newContent = content.replace(selectedText, highlightedText);
            setNoteContent(newContent);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
        >
            {/* Add Note */}
            <Card className="p-6">
                <Text as="h3" className="font-heading font-semibold text-gray-900 mb-4">
                    Add Note
                </Text>
                
                <div className="space-y-4">
                    <div className="relative">
                        <textarea
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            placeholder="Write your notes here... (Select text and use Ctrl+Shift+H to highlight)"
                            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                            onKeyDown={(e) => {
                                if (e.ctrlKey && e.shiftKey && e.key === 'H') {
                                    e.preventDefault();
                                    handleHighlight(noteContent, 'yellow');
                                }
                            }}
                        />
                        <div className="absolute top-2 right-2 text-xs text-gray-400 flex items-center">
                            <span className="mr-1">✨</span>
                            <span>Highlighting enabled</span>
                        </div>
                    </div>
                    
                    <Button
                        onClick={onSaveNote}
                        disabled={!noteContent.trim()}
                        className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Save Note
                    </Button>
                </div>
            </Card>

            {/* Existing Notes */}
            {existingNotes.length > 0 && (
                <Card className="p-6">
                    <Text as="h3" className="font-heading font-semibold text-gray-900 mb-4">
                        My Notes ({existingNotes.length})
                    </Text>
                    
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {existingNotes.map((note) => (
                            <NoteItem 
                                key={note.id} 
                                note={note} 
                                onDelete={onDeleteNote} 
                                onGoToLesson={onGoToLesson} 
                            />
                        ))}
                    </div>
                </Card>
            )}
        </motion.div>
    );
};

export default NoteTakingPanel;