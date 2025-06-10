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
    const [customColor, setCustomColor] = useState('#fef3c7');
    const [isSaving, setIsSaving] = useState(false);
    const [hasSelection, setHasSelection] = useState(false);
    const [selectionRange, setSelectionRange] = useState(null);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const [plainText, setPlainText] = useState('');
    const [previewContent, setPreviewContent] = useState('');
    const textareaRef = useRef(null);
    const previewRef = useRef(null);

    // Initialize plain text from HTML content
    useEffect(() => {
        if (editContent) {
            // Strip HTML tags but preserve line breaks
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = editContent;
            const text = tempDiv.textContent || tempDiv.innerText || '';
            setPlainText(text);
            setPreviewContent(editContent);
        }
    }, []);

    const predefinedColors = [
        { name: 'yellow', value: '#fef3c7', class: 'highlight-yellow' },
        { name: 'green', value: '#d1fae5', class: 'highlight-green' },
        { name: 'blue', value: '#dbeafe', class: 'highlight-blue' },
        { name: 'pink', value: '#fce7f3', class: 'highlight-pink' },
        { name: 'orange', value: '#ffedd5', class: 'highlight-orange' }
    ];

    const getColorClass = (colorName) => {
        const colorObj = predefinedColors.find(c => c.name === colorName);
        return colorObj ? colorObj.class : 'highlight-custom';
    };

    const getColorValue = (colorName) => {
        const colorObj = predefinedColors.find(c => c.name === colorName);
        return colorObj ? colorObj.value : customColor;
    };

    const applyHighlight = (colorName, isCustom = false) => {
        if (!selectionRange || !textareaRef.current) return;

        const { start, end } = selectionRange;
        const selectedText = plainText.substring(start, end);
        
        if (selectedText.length === 0) return;

        // Create highlighted HTML
        const colorClass = isCustom ? 'highlight-custom' : getColorClass(colorName);
        const colorValue = isCustom ? customColor : getColorValue(colorName);
        const highlightStyle = isCustom ? `style="background-color: ${colorValue};"` : '';
        const highlightSpan = `<span class="${colorClass}" ${highlightStyle}>${selectedText}</span>`;

        // Update preview content immediately
        const beforeText = plainText.substring(0, start);
        const afterText = plainText.substring(end);
        const newPreviewContent = beforeText + highlightSpan + afterText;
        
        setPreviewContent(newPreviewContent);
        onEditContentChange(newPreviewContent);

        // Clear selection
        setHasSelection(false);
        setSelectionRange(null);
        setShowColorPicker(false);
        setShowContextMenu(false);

        // Remember color choice
        if (!isCustom) {
            setSelectedColor(colorName);
        }
    };

    const removeHighlight = () => {
        if (!selectionRange || !textareaRef.current) return;

        const { start, end } = selectionRange;
        const selectedText = plainText.substring(start, end);
        
        // Remove highlight from preview content
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = previewContent;
        
        // Find and replace highlighted spans with plain text
        const highlightSpans = tempDiv.querySelectorAll('span[class*="highlight-"]');
        highlightSpans.forEach(span => {
            if (span.textContent === selectedText) {
                span.replaceWith(document.createTextNode(span.textContent));
            }
        });

        const newPreviewContent = tempDiv.innerHTML;
        setPreviewContent(newPreviewContent);
        onEditContentChange(newPreviewContent);

        // Clear selection
        setHasSelection(false);
        setSelectionRange(null);
        setShowContextMenu(false);
    };

    const handleTextSelection = () => {
        if (!textareaRef.current) return;

        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        if (start !== end) {
            setSelectionRange({ start, end });
            setHasSelection(true);
        } else {
            setHasSelection(false);
            setSelectionRange(null);
        }
    };

    const handleTextChange = (e) => {
        const newText = e.target.value;
        setPlainText(newText);
        
        // Update preview content, preserving any existing highlights
        // For now, just update with plain text - highlights will be re-applied
        setPreviewContent(newText.replace(/\n/g, '<br>'));
        onEditContentChange(newText.replace(/\n/g, '<br>'));
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

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.shiftKey && hasSelection) {
                if (e.key === 'H') {
                    e.preventDefault();
                    applyHighlight(selectedColor);
                } else if (e.key === 'R') {
                    e.preventDefault();
                    removeHighlight();
                }
            }
        };

        if (textareaRef.current) {
            textareaRef.current.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            if (textareaRef.current) {
                textareaRef.current.removeEventListener('keydown', handleKeyDown);
            }
        };
    }, [selectedColor, hasSelection, selectionRange]);

    // Handle context menu
    const handleContextMenu = (e) => {
        if (hasSelection) {
            e.preventDefault();
            setContextMenuPosition({ x: e.clientX, y: e.clientY });
            setShowContextMenu(true);
        }
    };

    // Close menus on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.color-picker-popup') && !e.target.closest('.highlight-context-menu')) {
                setShowColorPicker(false);
                setShowContextMenu(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <div className="space-y-4">
            {/* Color Selection Toolbar */}
            <div className="highlight-toolbar">
                <Text as="span" className="text-sm font-medium text-gray-700 mr-2">Highlight Color:</Text>
                
                {/* Predefined Colors */}
                <div className="flex items-center gap-2">
                    {predefinedColors.map(color => (
                        <button
                            key={color.name}
                            onClick={() => setSelectedColor(color.name)}
                            className={`highlight-color-button ${selectedColor === color.name ? 'active' : ''}`}
                            style={{ backgroundColor: color.value }}
                            title={`${color.name} highlight`}
                        />
                    ))}
                    
                    {/* Custom Color Picker */}
                    <div className="relative">
                        <button
                            onClick={() => setShowColorPicker(!showColorPicker)}
                            className={`highlight-color-button ${selectedColor === 'custom' ? 'active' : ''}`}
                            style={{ backgroundColor: customColor }}
                            title="Custom color"
                        >
                            <ApperIcon name="Palette" className="w-3 h-3 text-gray-600" />
                        </button>
                        
                        {showColorPicker && (
                            <div className="color-picker-popup">
                                <div className="mb-3">
                                    <Text as="label" className="text-sm font-medium text-gray-700 mb-2 block">
                                        Custom Highlight Color
                                    </Text>
                                    <input
                                        type="color"
                                        value={customColor}
                                        onChange={(e) => {
                                            setCustomColor(e.target.value);
                                            setSelectedColor('custom');
                                        }}
                                        className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                                    />
                                </div>
                                <Button
                                    onClick={() => setShowColorPicker(false)}
                                    className="w-full px-3 py-1.5 bg-primary text-white rounded text-sm hover:bg-primary/90 transition-colors"
                                >
                                    Apply Custom Color
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-300">
                    <Button
                        onClick={() => hasSelection && applyHighlight(selectedColor, selectedColor === 'custom')}
                        disabled={!hasSelection}
                        className="px-3 py-1.5 bg-primary text-white rounded text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Highlight selected text (Ctrl+Shift+H)"
                    >
                        <ApperIcon name="Highlighter" className="w-3 h-3 mr-1" />
                        Highlight
                    </Button>
                    <Button
                        onClick={removeHighlight}
                        disabled={!hasSelection}
                        className="px-3 py-1.5 text-gray-600 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Remove highlight (Ctrl+Shift+R)"
                    >
                        <ApperIcon name="Eraser" className="w-3 h-3 mr-1" />
                        Remove
                    </Button>
                </div>
            </div>

            {/* Editor Container */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Text Input */}
                <div className="space-y-2">
                    <Text as="label" className="text-sm font-medium text-gray-700">
                        Edit Text (Clean Input)
                    </Text>
                    <textarea
                        ref={textareaRef}
                        value={plainText}
                        onChange={handleTextChange}
                        onSelect={handleTextSelection}
                        onContextMenu={handleContextMenu}
                        className="w-full min-h-[200px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none bg-white shadow-sm"
                        placeholder="Edit your note text here... (Select text and use the toolbar above to highlight)"
                    />
                    {hasSelection && (
                        <div className="text-xs text-primary bg-primary/5 p-2 rounded border border-primary/20">
                            ✨ Text selected! Use the toolbar above or Ctrl+Shift+H to highlight
                        </div>
                    )}
                </div>

                {/* Preview */}
                <div className="space-y-2">
                    <Text as="label" className="text-sm font-medium text-gray-700">
                        Preview (With Highlights)
                    </Text>
                    <div
                        ref={previewRef}
                        className="w-full min-h-[200px] p-4 border border-gray-300 rounded-lg bg-gray-50 shadow-sm prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: previewContent || '<em class="text-gray-400">Preview will appear here...</em>' }}
                    />
                </div>
            </div>

            {/* Context Menu */}
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
                        {predefinedColors.map(color => (
                            <button
                                key={color.name}
                                onClick={() => applyHighlight(color.name)}
                                className="mini-color-button"
                                style={{ backgroundColor: color.value }}
                                title={`Highlight ${color.name}`}
                            />
                        ))}
                        <button
                            onClick={() => applyHighlight('custom', true)}
                            className="mini-color-button"
                            style={{ backgroundColor: customColor }}
                            title="Highlight with custom color"
                        >
                            <ApperIcon name="Palette" className="w-2 h-2 text-gray-600" />
                        </button>
                    </div>
                    <div className="context-menu-divider"></div>
                    <div className="context-menu-item" onClick={removeHighlight}>
                        <ApperIcon name="Eraser" className="w-4 h-4 mr-2 text-red-600" />
                        <span className="text-sm">Remove Highlight</span>
                    </div>
                </div>
            )}

            {/* Help Text */}
            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <span>💡 Select text in the editor and use the toolbar to highlight with your chosen color</span>
                    <div className="flex items-center space-x-2">
                        <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">Ctrl+Shift+H</kbd>
                        <span>Highlight</span>
                        <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">Ctrl+Shift+R</kbd>
                        <span>Remove</span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
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