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
    const [hasSelection, setHasSelection] = useState(false);
    const [selectionPosition, setSelectionPosition] = useState(null);
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const editorRef = useRef(null);

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

    const handleHighlight = (colorName) => {
        const selection = window.getSelection();
        if (selection.rangeCount === 0 || selection.toString().length === 0) return;

        const range = selection.getRangeAt(0);
        const selectedText = range.toString();
        
        // Create highlight span
        const highlightSpan = document.createElement('span');
        highlightSpan.className = `highlight-${colorName}`;
        highlightSpan.textContent = selectedText;
        
        // Replace selection with highlighted span
        range.deleteContents();
        range.insertNode(highlightSpan);
        
        // Update content
        if (editorRef.current) {
            const newContent = editorRef.current.innerHTML;
            onEditContentChange(newContent);
        }
        
        // Clear selection and hide toolbars
        selection.removeAllRanges();
        setHasSelection(false);
        setSelectionPosition(null);
        setShowContextMenu(false);
    };

    const handleRemoveHighlight = () => {
        const selection = window.getSelection();
        if (selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        const container = range.commonAncestorContainer;
        
        let element = container.nodeType === Node.TEXT_NODE ? container.parentNode : container;

        if (element.classList && (
            element.classList.contains('highlight-yellow') || 
            element.classList.contains('highlight-green') ||
            element.classList.contains('highlight-blue') ||
            element.classList.contains('highlight-pink') ||
            element.classList.contains('highlight-orange') ||
            element.classList.contains('highlight-custom')
        )) {
            const textNode = document.createTextNode(element.textContent);
            element.parentNode.replaceChild(textNode, element);
            
            if (editorRef.current) {
                const newContent = editorRef.current.innerHTML;
                onEditContentChange(newContent);
            }
        }
        
        selection.removeAllRanges();
        setHasSelection(false);
        setSelectionPosition(null);
        setShowContextMenu(false);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSaveNote();
        } catch (error) {
            console.error('Failed to save note:', error);
        } finally {
            setIsSaving(false);
        }
    };

    // Handle text selection for floating toolbar
    useEffect(() => {
        const handleSelection = () => {
            const selection = window.getSelection();
            const hasText = selection.toString().length > 0;
            
            if (hasText && editorRef.current && editorRef.current.contains(selection.anchorNode)) {
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                const editorRect = editorRef.current.getBoundingClientRect();
                
                setSelectionPosition({
                    x: rect.left + (rect.width / 2) - editorRect.left,
                    y: rect.top - editorRect.top
                });
                setHasSelection(true);
            } else {
                setHasSelection(false);
                setSelectionPosition(null);
            }
        };

        document.addEventListener('selectionchange', handleSelection);
        return () => document.removeEventListener('selectionchange', handleSelection);
    }, []);

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.shiftKey) {
                if (e.key === 'H') {
                    e.preventDefault();
                    if (hasSelection) {
                        handleHighlight(selectedColor);
                    }
                } else if (e.key === 'R') {
                    e.preventDefault();
                    if (hasSelection) {
                        handleRemoveHighlight();
                    }
                }
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
    }, [selectedColor, hasSelection]);

    // Handle right-click context menu
    const handleContextMenu = (e) => {
        const selection = window.getSelection();
        if (selection.toString().length > 0) {
            e.preventDefault();
            setContextMenuPosition({ x: e.clientX, y: e.clientY });
            setShowContextMenu(true);
        }
    };

    // Close context menu on click outside
    useEffect(() => {
        const handleClickOutside = () => {
            setShowContextMenu(false);
        };

        if (showContextMenu) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [showContextMenu]);

    return (
        <div className="space-y-4">
            <div className="editor-container relative">
                <div
                    ref={editorRef}
                    contentEditable
                    className="w-full min-h-[160px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none note-editor bg-white shadow-sm editor-with-highlights"
                    style={{ whiteSpace: 'pre-wrap' }}
                    dangerouslySetInnerHTML={{ __html: editContent }}
                    onInput={(e) => onEditContentChange(e.target.innerHTML)}
                    onContextMenu={handleContextMenu}
                    placeholder="Edit your note... (Select text to highlight)"
                />

                {/* Highlight indicator */}
                <div className="highlight-indicator" title="Text highlighting enabled">
                    <ApperIcon name="Highlighter" className="w-3 h-3" />
                </div>

                {/* Floating highlight toolbar */}
                {hasSelection && selectionPosition && (
                    <div 
                        className="floating-highlight-toolbar"
                        style={{
                            left: `${selectionPosition.x}px`,
                            top: `${selectionPosition.y}px`,
                            transform: 'translateX(-50%)'
                        }}
                    >
                        <div className="mini-color-palette">
                            {['yellow', 'green', 'blue', 'pink', 'orange'].map(color => (
                                <button
                                    key={color}
                                    onClick={() => handleHighlight(color)}
                                    className="mini-color-button"
                                    style={{ backgroundColor: getColorValue(color) }}
                                    title={`Highlight ${color}`}
                                />
                            ))}
                        </div>
                        <div className="w-px h-4 bg-gray-300 mx-1"></div>
                        <button
                            onClick={handleRemoveHighlight}
                            className="p-1 text-gray-600 hover:text-red-600 rounded transition-colors"
                            title="Remove highlight"
                        >
                            <ApperIcon name="X" className="w-3 h-3" />
                        </button>
                    </div>
                )}

                {/* Context menu */}
                {showContextMenu && (
                    <div 
                        className="highlight-context-menu"
                        style={{
                            left: `${contextMenuPosition.x}px`,
                            top: `${contextMenuPosition.y}px`
                        }}
                    >
                        <div className="context-menu-item" onClick={() => setShowContextMenu(false)}>
                            <ApperIcon name="Highlighter" className="w-4 h-4 mr-2 text-primary" />
                            <span className="text-sm font-medium">Highlight Selection</span>
                        </div>
                        <div className="context-menu-divider"></div>
                        <div className="mini-color-palette p-2">
                            {['yellow', 'green', 'blue', 'pink', 'orange'].map(color => (
                                <button
                                    key={color}
                                    onClick={() => handleHighlight(color)}
                                    className="mini-color-button"
                                    style={{ backgroundColor: getColorValue(color) }}
                                    title={`Highlight ${color}`}
                                />
                            ))}
                        </div>
                        <div className="context-menu-divider"></div>
                        <div className="context-menu-item" onClick={handleRemoveHighlight}>
                            <ApperIcon name="Eraser" className="w-4 h-4 mr-2 text-red-600" />
                            <span className="text-sm">Remove Highlight</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Help text and keyboard shortcuts */}
            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                    <span>💡 Select text to highlight it with the floating toolbar or right-click menu</span>
                    <div className="flex items-center space-x-2">
                        <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">Ctrl+Shift+H</kbd>
                        <span>Highlight</span>
                        <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">Ctrl+Shift+R</kbd>
                        <span>Remove</span>
                    </div>
                </div>
            </div>

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