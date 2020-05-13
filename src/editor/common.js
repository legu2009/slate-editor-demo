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
        'underlined',
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

const blockWithEditor = (editor) => {
    const { insertBreak, deleteBackward } = editor;
    editor.__BLOCKS__ = [];
    editor.deleteBackward = () => {
        const [match] = Editor.nodes(editor, {
            match: (n) => editor.__BLOCKS__.includes(n.type)
        });
        if (match) {
            let [node, blockPath] = match;
            let blockStart = Editor.start(editor, blockPath);
            let blockEnd = Editor.end(editor, blockPath);
            if (node.children.length === 1 && Point.equals(blockEnd, blockStart)) {
                let selection = editor.selection;
                if (selection) {
                    let [, selectionEnd] = Range.edges(selection);
                    if (Range.isCollapsed(editor.selection) && Point.equals(blockEnd, selectionEnd)) {
                        let { path: endPath } = Editor.end(editor, []);
                        Transforms.removeNodes(editor, {
                            select: true,
                            at: blockPath
                        });
                        if (endPath[0] === blockPath[0]) {
                            Transforms.insertNodes(editor, {
                                type: 'paragraph',
                                children: [{ text: '' }]
                            });
                        }
                        return;
                    }
                }
            }
        }
        deleteBackward();
    };
    editor.insertBreak = () => {
        const [match] = Editor.nodes(editor, {
            match: (n) => editor.__BLOCKS__.includes(n.type)
        });
        if (match) {
            let blockPath = match[1];
            let blockEnd = Editor.end(editor, blockPath);
            //最后一行是空行
            if (blockEnd.path[blockEnd.path.length - 1] === 0 && blockEnd.offset === 0) {
                let selection = editor.selection;
                if (selection) {
                    let [, selectionEnd] = Range.edges(selection);
                    if (Range.isCollapsed(editor.selection) && Point.equals(blockEnd, selectionEnd)) {
                        let path = blockEnd.path;
                        path.length--;
                        Transforms.removeNodes(editor, { at: path });
                        blockPath[blockPath.length - 1]++;
                        Transforms.insertNodes(
                            editor,
                            {
                                type: 'paragraph',
                                children: [{ text: '' }]
                            },
                            {
                                select: true,
                                at: blockPath
                            }
                        );
                        return;
                    }
                }
            }
        }
        insertBreak();
    };
    return editor;
};

export { blockWithEditor, isMarkActive, isBlockActive, toggleMark, toggleBlock, clearMark, preventDefault };
