import React, { useState, useRef, useEffect } from 'react';
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
                        <NoteEditor
                            note={editingNote}
                            editContent={editContent}
                            onEditContentChange={onEditContentChange}
                            onSaveNote={onSaveNote}
                            onCancelEdit={onCancelEdit}
                        />
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

const NoteEditor = ({ 
    note, 
    editContent, 
    onEditContentChange, 
    onSaveNote, 
    onCancelEdit 
}) => {
    const [selectedColor, setSelectedColor] = useState('yellow');
const [isSaving, setIsSaving] = useState(false);
    const editorRef = useRef(null);
    const [showHighlightToolbar, setShowHighlightToolbar] = useState(true);
    const [hasSelection, setHasSelection] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'H') {
                e.preventDefault();
                handleHighlight(selectedColor, getColorValue(selectedColor));
            }
        };

        if (editorRef.current) {
            editorRef.current.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            if (editorRef.current) {
                editorRef.current.removeEventListener('keydown', handleKeyDown);
            }
        };
    }, [selectedColor]);

    useEffect(() => {
        const handleSelection = () => {
            const selection = window.getSelection();
            setHasSelection(selection.toString().length > 0);
        };

        document.addEventListener('selectionchange', handleSelection);
        return () => document.removeEventListener('selectionchange', handleSelection);
    }, []);
    const getColorValue = (colorName) => {
        const colorMap = {
            yellow: '#fef3c7',
            green: '#d1fae5',
            blue: '#dbeafe',
            pink: '#fce7f3',
            orange: '#ffedd5'
        };
        return colorMap[colorName] || '#fef3c7';
    };

    const handleHighlight = (colorName, colorValue) => {
        const selection = window.getSelection();
        if (selection.rangeCount === 0 || selection.toString().length === 0) return;

        const range = selection.getRangeAt(0);
        const selectedText = range.toString();
        
        // Create highlight span
        const highlightSpan = document.createElement('span');
        highlightSpan.className = colorName === 'custom' ? 'highlight-custom' : `highlight-${colorName}`;
        if (colorName === 'custom') {
            highlightSpan.style.backgroundColor = colorValue;
        }
        highlightSpan.textContent = selectedText;
        
        // Replace selection with highlighted span
        range.deleteContents();
        range.insertNode(highlightSpan);
        
        // Update content
        if (editorRef.current) {
            const newContent = editorRef.current.innerHTML;
            onEditContentChange(newContent);
        }
        
// Clear selection
        selection.removeAllRanges();
        setHasSelection(false);
    };

    const handleRemoveHighlight = () => {
        const selection = window.getSelection();
        if (selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        const container = range.commonAncestorContainer;
        
        // Find highlight spans within selection
let element = container.nodeType === Node.TEXT_NODE ? container.parentNode : container;

if (element.classList && (element.classList.contains('highlight-yellow') || 
element.classList.contains('highlight-green') ||
element.classList.contains('highlight-blue') ||
element.classList.contains('highlight-pink') ||
element.classList.contains('highlight-orange') ||
element.classList.contains('highlight-custom'))) {
            // Replace highlighted span with its text content
            const textNode = document.createTextNode(element.textContent);
            element.parentNode.replaceChild(textNode, element);
            
            // Update content
            if (editorRef.current) {
                const newContent = editorRef.current.innerHTML;
onEditContentChange(newContent);
            }
        }
        
        selection.removeAllRanges();
        setHasSelection(false);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSaveNote();
        } catch (error) {
            console.error('Failed to save note:', error);
            // Error handling is done in parent component
        } finally {
            setIsSaving(false);
        }
    };
return (
        <div className="space-y-4">
            {/* Highlight Toolbar - Always visible when editing */}
            <div className="p-3 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-primary/20 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                        <ApperIcon name="Highlighter" className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-gray-700">Text Highlighter</span>
                        {hasSelection && (
                            <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                                Text Selected
                            </span>
                        )}
                    </div>
                    <span className="text-xs text-gray-500">Ctrl+Shift+H</span>
                </div>
                <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">Colors:</span>
                    {['yellow', 'green', 'blue', 'pink', 'orange'].map(color => (
                        <button
                            key={color}
                            onClick={() => {
                                setSelectedColor(color);
                                handleHighlight(color, getColorValue(color));
                            }}
                            className={`w-8 h-8 rounded-lg border-2 hover:scale-110 transition-all duration-200 ${
                                selectedColor === color ? 'border-primary ring-2 ring-primary/20' : 'border-gray-300 hover:border-gray-400'
                            }`}
                            style={{ backgroundColor: getColorValue(color) }}
                            title={`Highlight with ${color}`}
                            disabled={!hasSelection}
                        />
                    ))}
                    <div className="w-px h-6 bg-gray-300 mx-2"></div>
                    <button
                        onClick={handleRemoveHighlight}
                        className="px-3 py-1.5 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                        title="Remove highlight from selected text"
                        disabled={!hasSelection}
                    >
                        <ApperIcon name="X" className="w-3 h-3 mr-1 inline" />
                        Remove
                    </button>
                </div>
                {!hasSelection && (
                    <p className="text-xs text-gray-500 mt-2">Select text above to highlight it</p>
                )}
            </div>

            <div
                ref={editorRef}
                contentEditable
                className="w-full min-h-[120px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none note-editor bg-white shadow-sm"
                style={{ whiteSpace: 'pre-wrap' }}
                dangerouslySetInnerHTML={{ __html: editContent }}
                onInput={(e) => onEditContentChange(e.target.innerHTML)}
                placeholder="Edit your note..."
            />
            <div className="flex items-center space-x-2">
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                >
                    {isSaving ? (
                        <>
                            <ApperIcon name="Loader2" className="w-4 h-4 mr-1 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <ApperIcon name="Check" className="w-4 h-4 mr-1" />
                            Save
                        </>
                    )}
                </Button>
                <Button
                    onClick={onCancelEdit}
                    disabled={isSaving}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors text-sm"
                >
                    <ApperIcon name="X" className="w-4 h-4 mr-1" />
                    Cancel
                </Button>
            </div>
        </div>
    );
};

export default NotesList;