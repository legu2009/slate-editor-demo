import React, { useCallback, useMemo, useState, useRef } from 'react';
import { Editable, withReact, useSlate, Slate, useSelected, useFocused } from 'slate-react';
import { createEditor, Transforms, Text, Editor } from 'slate';
import merge from 'merge-deep';
import classnames from 'classnames';
import Toolbar from '../components/toolbar/index.jsx';
import pluginMap from '../components/plugins/index.js';
import {blockWithEditor, extendWithEditor} from './common.js';
import '../css/slate-editor.less';

const SlateEditor = React.memo(({ className: _className, value, onChange, plugins: _plugins }) => {
    const plugins = useMemo(() => {
        return _plugins.map((item) => {
            if (typeof item === 'string') {
                return pluginMap[item] || item;
            } else if (pluginMap[item.key]) {
                return merge(pluginMap[item.key], item);
            } else {
                return item;
            }
        });
    }, [_plugins]);
    const renderElement = useCallback((props) => <Element {...props} plugins={plugins} />, []);
    const renderLeaf = useCallback((props) => <Leaf {...props} plugins={plugins} />, []);
    const [className, setClassName] = useState('');
    const editor = useMemo(() => {
        let editor = extendWithEditor(blockWithEditor(withReact(createEditor())));
        plugins.forEach(item => {
            if (item.withEditor) {
                editor = item.withEditor(editor);
            }
        });
        let _className = className;
        Object.defineProperty(editor, 'className', {
            get() {
                return _className;
            },
            set: function (value) {
                _className = value;
                setClassName(value);
            }
        });

        return editor;
    }, []);
    const containerNode = useRef(null);
    const getContainerNode = useCallback(() => containerNode.current);

    return (
        <div className={classnames('slate-container', _className, className)} ref={containerNode}>
            <Slate editor={editor} value={value} onChange={onChange}>
                <Toolbar getContainerNode={getContainerNode} plugins={plugins} />
                <Editable
                    className="slate-content"
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    placeholder="Enter some rich text…"
                    spellCheck={false}
                    autoFocus
                    onCompositionEnd={(e) => {
                        Transforms.setNodes(
                            editor,
                            {
                                key: +new Date()
                            },
                            { match: Text.isText }
                        );
                    }}
                />
            </Slate>
        </div>
    );
});

const defaultPlugins = [
    'history',
    'line',
    'fontSize',
    'lineHeight',
    'letterSpacing',
    'line',
    'textColor',
    'bold',
    'italic',
    'underlined',
    'strikethrough',
    'line',
    'superscript',
    'subscript',
    'format-clear',
    'line',
    'indent',
    'align',
    'line',
    'headings',
    'bulleted-list',
    'numbered-list',
    'block-quote',
    'block-code',
    'line',
    'linkEditor',
    'hr',
    'clear-all',
    'line',
    'fullscreen'
];

SlateEditor.defaultProps = {
    plugins: defaultPlugins
};

const Element = React.memo((props) => {
    let { attributes, children, element, plugins } = props;
    attributes.style = attributes.style || {};
    let res, item;
    for (var i = 0, len = plugins.length; i < len; i++) {
        item = plugins[i];
        if (item.processElement) {
            res = item.processElement({ attributes, children, element });
            if (res) {
                return res;
            }
        }
    }
    return <div {...attributes}>{children}</div>;
});

const Leaf = React.memo((props) => {
    let { attributes, children, leaf, plugins } = props;
    const style = {};
    plugins.forEach((item) => {
        if (item.processLeaf) {
            item.processLeaf({ attributes, children, leaf, style });
        }
    });
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
export { defaultPlugins };
