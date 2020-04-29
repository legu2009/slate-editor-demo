import React, { useCallback, useMemo, useState, useRef } from 'react';
import { Editor, Transforms, Range, Point } from 'slate';



const WRAP_TYPES = [
    {
        type: 'numbered-list',
        childType: 'list-item'
    },
    {
        type: 'bulleted-list',
        childType: 'list-item'
    },
    {
        type: 'block-code'
    },
    {
        type: 'block-quote'
    }
];

const toggleBlock = (editor, format) => {
    const isActive = isBlockActive(editor, format);
    const config = WRAP_TYPES.find((item) => item.type === format);
    Transforms.unwrapNodes(editor, {
        match: (n) => WRAP_TYPES.find((item) => item.type === n.type),
        split: true
    });
    if (!isActive) {
        if (config) {
            Transforms.setNodes(editor, {
                type: config.childType || 'paragraph'
            });
            Transforms.wrapNodes(editor, { type: format, children: [] });
        } else {
            Transforms.setNodes(editor, {
                type: format
            });
        }
    } else {
        Transforms.setNodes(editor, {
            type: 'paragraph'
        });
    }
};

const clearMark = (editor) => {
    Editor.removeMark(editor, [
        'bold',
        'italic',
        'underline',
        'strikethrough',
        'superscript',
        'subscript',
        'fontSize',
        'lineHeight',
        'color',
        'backgroundColor',
        'letterSpacing'
    ]);
    editor.marks = null;
};

const toggleMark = (editor, format, otherFormat) => {
    const isActive = isMarkActive(editor, format);
    if (isActive) {
        Editor.removeMark(editor, format);
    } else {
        Editor.addMark(editor, format, true);
        if (otherFormat) {
            Editor.removeMark(editor, otherFormat);
        }
    }
};

const isBlockActive = (editor, format) => {
    const [match] = Editor.nodes(editor, {
        match: (n) => n.type === format
    });

    return !!match;
};

const isMarkActive = (editor, format) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
};

const preventDefault = (e) => {
    e.preventDefault();
};





/*const removeLine = (editor) => {
    Transforms.removeNodes(editor);
};

const clearContent = (editor) => {
    Transforms.removeNodes(editor, {
        at: {
            anchor: Editor.start(editor, []),
            focus: Editor.end(editor, [])
        }
    });
    Transforms.insertNodes(editor, {
        type: 'paragraph',
        children: [{ text: '' }]
    });
};

const insertMention = (editor, character) => {
    const element = { type: 'mention', character, children: [{ text: '' }] };
    Transforms.insertNodes(editor, element);
    Transforms.move(editor);
};

const insertTable = (editor) => {
    const element = {
        type: 'paragraph',
        children: [
            {
                type: 'table',
                children: [
                    {
                        type: 'table-row',
                        children: [
                            {
                                type: 'table-cell',
                                children: [
                                    {
                                        type: 'paragraph',
                                        children: [{ text: '1sfsdfsdfsdf' }]
                                    }
                                ]
                            },
                            {
                                type: 'table-cell',
                                children: [
                                    {
                                        type: 'paragraph',
                                        children: [{ text: '1' }]
                                    }
                                ]
                            },
                            {
                                type: 'table-cell',
                                children: [
                                    {
                                        type: 'paragraph',
                                        children: [{ text: '2' }]
                                    }
                                ]
                            },
                            {
                                type: 'table-cell',
                                children: [
                                    {
                                        type: 'paragraph',
                                        children: [{ text: '3' }]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    };
    Transforms.insertNodes(editor, element);
    Transforms.move(editor);
};
*/
export {
    isMarkActive,
    isBlockActive,
    toggleMark,
    toggleBlock,
    clearMark,
    preventDefault,
};
