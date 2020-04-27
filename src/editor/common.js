import React, { useCallback, useMemo, useState, useRef } from 'react';
import { Editor, Transforms, Range, Point } from 'slate';
import { wrapLink, unwrapLink } from '../components/toolbar/linkEditor/index';

var protocolAndDomainRE = /^(?:\w+:)?\/\/(\S+)$/;
var localhostDomainRE = /^localhost[\:?\d]*(?:[^\:?\d]\S*)?$/;
var nonLocalhostDomainRE = /^[^\s\.]+\.\S{2,}$/;

const isUrl = function (string) {
    if (typeof string !== 'string') {
        return false;
    }

    var match = string.match(protocolAndDomainRE);
    if (!match) {
        return false;
    }

    var everythingAfterProtocol = match[1];
    if (!everythingAfterProtocol) {
        return false;
    }

    if (localhostDomainRE.test(everythingAfterProtocol) || nonLocalhostDomainRE.test(everythingAfterProtocol)) {
        return true;
    }

    return false;
};

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

const withEditor = (editor) => {
    const { insertData, insertText, isVoid, isInline, deleteBackward, deleteForward, insertBreak } = editor;

    /*editor.deleteBackward = (unit) => {
        const { selection } = editor;
        if (selection && Range.isCollapsed(selection)) {
            const [cell] = Editor.nodes(editor, {
                match: (n) => n.type === 'table-cell'
            });
            if (cell) {
                const [, cellPath] = cell;
                const start = Editor.start(editor, cellPath);
                if (Point.equals(selection.anchor, start)) {
                    return;
                }
            }
        }
        deleteBackward(unit);
    };

    editor.deleteForward = (unit) => {
        const { selection } = editor;
        if (selection && Range.isCollapsed(selection)) {
            const [cell] = Editor.nodes(editor, {
                match: (n) => n.type === 'table-cell'
            });
            if (cell) {
                const [, cellPath] = cell;
                const end = Editor.end(editor, cellPath);
                if (Point.equals(selection.anchor, end)) {
                    return;
                }
            }
        }
        deleteForward(unit);
    };
*/
    editor.insertBreak = () => {
        const { selection: at } = editor;
        if (at) {
            if (Range.isRange(at) && Range.isCollapsed(at)) {
                var [entry] = Editor.nodes(editor, {
                    at: at.path,
                    match: (n) => Editor.isBlock(editor, n),
                    mode: 'lowest',
                    voids: false
                });
            }
        }
        insertBreak();
    };

    editor.isVoid = (element) => {
        return element.type === 'hr' || element.type === 'mention' ? true : isVoid(element);
    };
    editor.isInline = (element) => {
        return element.type === 'link' || element.type === 'mention' ? true : isInline(element);
    };

    editor.insertText = (text) => {
        if (text && isUrl(text)) {
            wrapLink(editor, text);
        } else {
            insertText(text);
        }
    };

    editor.insertData = (data) => {
        const text = data.getData('text/plain');
        if (text && isUrl(text)) {
            wrapLink(editor, { url: text });
        } else {
            insertData(data);
        }
    };

    return editor;
};

const insertLine = (editor) => {
    let editorEnd = Editor.end(editor, []);
    let selection = editor.selection;
    let [selectionStart, selectionEnd] = Range.edges(selection);
    let isEditorEnd = false;
    if (selection) {
        if (Point.equals(editorEnd, selectionEnd)) {
            isEditorEnd = true;
        }
    }
    if (Point.equals(selectionStart, selectionEnd) && isEditorEnd) {
        //最后一行
        if (editorEnd.offset === 0 && editorEnd.path.length === 2 && editorEnd.path[1] === 0) {
            Transforms.removeNodes(editor, {
                at: selection
            });
        }
    }
    Transforms.insertNodes(editor, {
        type: 'hr',
        children: [{ text: '' }]
    });
    if (isEditorEnd) {
        Transforms.insertNodes(editor, {
            type: 'paragraph',
            children: [{ text: '' }]
        });
    } else {
        let anchor = editor.selection.anchor;
        Transforms.select(editor, {
            path: [anchor.path[0] + 1, anchor.path[1]],
            offset: 0
        });
    }
};

const removeLine = (editor) => {
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

export {
    isMarkActive,
    isBlockActive,
    toggleMark,
    toggleBlock,
    clearMark,
    preventDefault,
    withEditor,
    insertLine,
    removeLine,
    clearContent,
    insertMention,
    insertTable
};
