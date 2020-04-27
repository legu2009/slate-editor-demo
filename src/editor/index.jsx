import React, { useCallback, useMemo, useState, useRef } from 'react';
import isHotkey from 'is-hotkey';
import { Editable, withReact, useSlate, Slate, useSelected, useFocused } from 'slate-react';
import { createEditor, Transforms, Text, Editor } from 'slate';
import { withHistory } from 'slate-history';
import { FullContext } from './context.jsx';
import Toolbar from '../components/toolbar/index.jsx';
import { isMarkActive, isBlockActive, toggleMark, toggleBlock, clearMark, withEditor, removeLine } from './common.js';

import '../css/slate-editor.less';

const HOTKEYS = {
    'mod+b': 'bold',
    'mod+i': 'italic',
    'mod+u': 'underline',
    'mod+`': 'code'
};

const SlateEditor = React.memo(({ value, onChange }) => {
    const renderElement = useCallback((props) => <Element {...props} />, []);
    const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
    const editor = useMemo(() => withEditor(withHistory(withReact(createEditor()))), []);
    const [isFull, setIsFull] = useState(false);
    const containerNode = useRef(null);
    const getContainerNode = useCallback(() => containerNode.current);
    return (
        <FullContext.Provider value={{ isFull, setIsFull }}>
            <div className={'slate-container' + (isFull ? ' fullscreen' : '')} ref={containerNode}>
                <Slate editor={editor} value={value} onChange={onChange}>
                    <Toolbar getContainerNode={getContainerNode} />
                    <Editable
                        className="slate-content"
                        renderElement={renderElement}
                        renderLeaf={renderLeaf}
                        placeholder="Enter some rich text…"
                        spellCheck={false}
                        autoFocus
                        onCompositionEnd={(e) => {
                            //if (editor.marks) {
                            Transforms.setNodes(
                                editor,
                                {
                                    key: +new Date()
                                },
                                { match: Text.isText }
                            );
                        }}
                        onKeyDown={(event) => {
                            /*for (const hotkey in HOTKEYS) {
                                if (isHotkey(hotkey, event)) {
                                    event.preventDefault();
                                    const mark = HOTKEYS[hotkey];
                                    toggleMark(editor, mark);
                                }
                            }*/
                        }}
                    />
                </Slate>
            </div>
        </FullContext.Provider>
    );
});

const HR = React.memo(({ attributes, children, element }) => {
    const selected = useSelected();
    const editor = useSlate();
    const fn = () => {
        Transforms.removeNodes(editor);
    };
    return (
        <div contentEditable={false} {...attributes}>
            <div className={'slate-hr' + (selected ? ' active' : '')}>
                <div className="slate-content-toolbar" onClick={fn}>
                    <a>&#xe9ac;</a>
                </div>
            </div>
            {children}
        </div>
    );
});

const Mention = ({ attributes, children, element }) => {
    const selected = useSelected();
    const focused = useFocused();
    return (
        <span
            {...attributes}
            contentEditable={false}
            style={{
                padding: '3px 3px 2px',
                margin: '0 1px',
                verticalAlign: 'baseline',
                display: 'inline-block',
                borderRadius: '4px',
                backgroundColor: '#eee',
                fontSize: '0.9em',
                boxShadow: selected && focused ? '0 0 0 2px #B4D5FF' : 'none'
            }}>
            @{element.character}
            {children}
        </span>
    );
};

const Table = ({ attributes, children, element }) => {
    const selected = useSelected();
    const focused = useFocused();
    return (
        <table className={selected && focused ? 'active' : ''}>
            <tbody {...attributes}>{children}</tbody>
        </table>
    );
};

const Tr = ({ attributes, children, element }) => {
    const selected = useSelected();
    const focused = useFocused();
    return (
        <tr className={selected && focused ? 'active' : ''} {...attributes}>
            {children}
        </tr>
    );
};

const Td = ({ attributes, children, element }) => {
    const selected = useSelected();
    const focused = useFocused();
    return (
        <td className={selected && focused ? 'active' : ''} {...attributes}>
            {children}
        </td>
    );
};

const Element = React.memo((props) => {
    let { attributes, children, element } = props;
    let style = {};
    if (element.increase) {
        style['paddingLeft'] = element.increase * 2 + 'em';
    }
    if (element.align) {
        style['textAlign'] = element.align;
    }
    attributes.style = style;
    switch (true) {
        case element.type === 'table':
            return <Table {...props} />;
        case element.type === 'table-row':
            return <Tr {...props} />;
        case element.type === 'table-cell':
            return <Td {...props} />;
        case element.type === 'link':
            return (
                <a {...attributes} href={element.url}>
                    {children}
                </a>
            );
        case element.type === 'mention':
            return <Mention {...props} />;
        case element.type === 'hr':
            return <HR {...props} />;
        case element.type === 'block-quote':
            return <blockquote {...attributes}>{children}</blockquote>;
        case element.type === 'block-code':
            return (
                <pre {...attributes}>
                    <code>{children}</code>
                </pre>
            );
        case element.type === 'bulleted-list':
            return (
                <ul {...attributes} className="slate-ul">
                    {children}
                </ul>
            );
        case element.type === 'list-item':
            return <li {...attributes}>{children}</li>;
        case element.type === 'numbered-list':
            return (
                <ol {...attributes} className="slate-ol">
                    {children}
                </ol>
            );
        case element.type.indexOf('header-') === 0:
            let headSize = element.type.replace('header-', '');
            if (headSize !== '0') {
                return React.createElement('h' + headSize, attributes, children);
            }
        default:
            return <div {...attributes}>{children}</div>;
    }
});

const Leaf = React.memo((props) => {
    let { attributes, children, leaf } = props;
    const style = {};
    if (leaf.fontSize) {
        style.fontSize = leaf.fontSize;
    }
    if (leaf.lineHeight) {
        style.lineHeight = leaf.lineHeight;
    }
    if (leaf.letterSpacing) {
        style.letterSpacing = leaf.letterSpacing + 'px';
    }
    if (leaf.color) {
        style.color = leaf.color;
    }
    if (leaf.backgroundColor) {
        style.backgroundColor = leaf.backgroundColor;
    }
    if (leaf.superscript) {
        style.verticalAlign = 'super';
    }
    if (leaf.subscript) {
        style.verticalAlign = 'sub';
    }
    let textDecoration = [];
    if (leaf.underline) {
        textDecoration.push('underline');
    }
    if (leaf.strikethrough) {
        textDecoration.push('line-through');
    }
    if (textDecoration.length > 0) {
        style.textDecoration = textDecoration.join(' ');
    }
    if (leaf.bold) {
        style.fontWeight = 'bold';
    }
    if (leaf.italic) {
        style.fontStyle = 'italic';
    }
    if (leaf.key) {
        attributes.key = leaf.key;
    }
    return (
        <span {...attributes} style={style}>
            {children}
        </span>
    );
});

export default SlateEditor;
