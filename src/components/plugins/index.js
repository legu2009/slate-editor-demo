import React, { useContext } from 'react';
import { isBlockActive, toggleBlock, clearMark } from '../../editor/common.js';
import { Editable, withReact, useSlate, Slate, useSelected, useFocused } from 'slate-react';
import { Editor, Transforms, createEditor, Range, Point } from 'slate';
import classnames from 'classnames';

const IndentBtns = React.memo(({ config }) => {
    const editor = useSlate();
    let increase = 0;
    const [match] = Editor.nodes(editor, {
        match: (n) => n.increase
    });
    if (match && match[0]) {
        increase = match[0].increase;
    }
    return (
        <>
            <button
                type="button"
                key="indent-increase"
                data-title={config.title.increase}
                className="slate-toolbar-item"
                onMouseDown={(e) => {
                    e.preventDefault();
                    Transforms.setNodes(editor, {
                        increase: increase + 1
                    });
                }}>
                <i className="bfi-indent-increase"></i>
            </button>
            <button
                type="button"
                key="indent-decrease"
                disabled={increase === 0}
                data-title={config.title.decrease}
                className="slate-toolbar-item"
                onMouseDown={(e) => {
                    e.preventDefault();
                    Transforms.setNodes(editor, {
                        increase: increase - 1
                    });
                }}>
                <i className="bfi-indent-decrease"></i>
            </button>
        </>
    );
});

const AlignBtns = React.memo(({ config }) => {
    const editor = useSlate();
    let align = 'left';
    const [match] = Editor.nodes(editor, {
        match: (n) => n.align
    });
    if (match && match[0]) {
        align = match[0].align;
    }
    const getClickFn = (align) => {
        return (e) => {
            e.preventDefault();
            Transforms.setNodes(editor, {
                align
            });
        };
    };
    return (
        <>
            <button
                type="button"
                key="align-left"
                data-title={config.title.left}
                className={classnames('slate-toolbar-item', { active: align === 'left' })}
                onMouseDown={getClickFn('left')}>
                <i className="bfi-align-left"></i>
            </button>
            <button
                type="button"
                key="align-center"
                data-title={config.title.center}
                className={classnames('slate-toolbar-item', { active: align === 'center' })}
                onMouseDown={getClickFn('center')}>
                <i className="bfi-align-center"></i>
            </button>
            <button
                type="button"
                key="align-right"
                data-title={config.title.right}
                className={classnames('slate-toolbar-item', { active: align === 'right' })}
                onMouseDown={getClickFn('right')}>
                <i className="bfi-align-right"></i>
            </button>
            <button
                type="button"
                key="align-justify"
                data-title={config.title.justify}
                className={classnames('slate-toolbar-item', { active: align === 'justify' })}
                onMouseDown={getClickFn('justify')}>
                <i className="bfi-align-justify"></i>
            </button>
        </>
    );
});

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
        let path = anchor.path.map((item) => item);
        path[path.length - 2]++;
        Transforms.select(editor, {
            path,
            offset: 0
        });
    }
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

const HR = React.memo(({ attributes, children, element }) => {
    const selected = useSelected();
    const editor = useSlate();
    const fn = () => {
        Transforms.removeNodes(editor);
    };
    return (
        <div contentEditable={false} {...attributes}>
            <div className={classnames('slate-hr', { active: selected })}>
                <div className="slate-content-toolbar" onClick={fn}>
                    <a>&#xe9ac;</a>
                </div>
            </div>
            {children}
        </div>
    );
});

export default {
    ['format-clear']: {
        config: {
            title: '清除样式'
        },
        ToolbarButton: ({ config }) => {
            const editor = useSlate();
            return (
                <button
                    type="button"
                    key="format-clear"
                    data-title={config.title}
                    className="slate-toolbar-item"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        clearMark(editor);
                    }}>
                    <i className="bfi-format-clear"></i>
                </button>
            );
        }
    },
    indent: {
        config: {
            title: {
                increase: '增加缩进',
                decrease: '减少缩进'
            }
        },
        ToolbarButton: IndentBtns,
        processElement: ({ attributes, children, element }) => {
            if (element.increase) {
                attributes.style['paddingLeft'] = element.increase * 2 + 'em';
            }
        }
    },
    align: {
        config: {
            title: {
                left: '居左',
                center: '居中',
                right: '居右',
                justify: '两端'
            }
        },
        ToolbarButton: AlignBtns,
        processElement: ({ attributes, children, element }) => {
            if (element.align) {
                attributes.style['textAlign'] = element.align;
            }
        }
    },
    hr: {
        config: {
            title: '水平线'
        },
        withEditor: (editor) => {
            const { isVoid } = editor;
            editor.isVoid = (element) => {
                return element.type === 'hr' ? true : isVoid(element);
            };
            return editor;
        },
        ToolbarButton: ({ config }) => {
            const editor = useSlate();
            return (
                <button
                    type="button"
                    key="hr"
                    data-title={config.title}
                    className="slate-toolbar-item"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        insertLine(editor);
                    }}>
                    <i className="bfi-hr"></i>
                </button>
            );
        },
        processElement: ({ attributes, children, element }) => {
            if (element.type === 'hr') {
                return <HR attributes={attributes} children={children} element={element} />;
            }
        }
    },
    ['clear-all']: {
        config: {
            title: '清除内容'
        },
        ToolbarButton: ({ config }) => {
            const editor = useSlate();
            return (
                <button
                    type="button"
                    key="clear-all"
                    data-title={config.title}
                    className="slate-toolbar-item"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        clearContent(editor);
                    }}>
                    <i className="bfi-clear-all"></i>
                </button>
            );
        }
    },
    ['fullscreen']: {
        config: {
            title: {
                fullscreen: '全屏',
                exit: '退出全屏'
            }
        },
        ToolbarButton: ({ config }) => {
            const editor = useSlate();
            const isFull = editor.className.indexOf('fullscreen') !== -1;
            return (
                <button
                    type="button"
                    key="fullscreen"
                    data-title={isFull ? config.title.exit : config.title.fullscreen}
                    className="slate-toolbar-item"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        editor.setClassName((className) =>
                            isFull ? className.replace('fullscreen', '') : className + ' fullscreen'
                        );
                    }}>
                    <i className={isFull ? 'bfi-fullscreen-exit' : 'bfi-fullscreen'}></i>
                </button>
            );
        }
    }
};
