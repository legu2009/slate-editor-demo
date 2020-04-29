import React, { useCallback, useMemo, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import Editor from './editor/index.jsx';
import createMarkPlugin from './components/plugins/createMarkPlugin.js';
import createBlockPlugin from './components/plugins/createBlockPlugin.js';
import plugins from './components/plugins/index.js';
import classnames from 'classnames';
import './index.less';

const Main = () => {
    const [value, setValue] = useState([
        {
            type: 'paragraph',
            children: [{ text: 'abc' }]
        }
    ]);
    const onChange = useCallback(function (val) {
        console.log('onChange', val);
        setValue(val);
    });
    return (
        <Editor
            value={value}
            onChange={onChange}
            plugins={[
                require('./components/plugins/history/index.jsx').default,
                'line',
                require('./components/plugins/fontSize/index.jsx').default,
                require('./components/plugins/lineHeight/index.jsx').default,
                require('./components/plugins/letterSpacing/index.jsx').default,
                'line',
                require('./components/plugins/textColor/index.jsx').default,
                createMarkPlugin({
                    format: 'bold',
                    title: '加粗',
                    processLeaf: ({ leaf, style }) => {
                        if (leaf.bold) {
                            style.fontWeight = 'bold';
                        }
                    }
                }),
                createMarkPlugin({
                    format: 'italic',
                    title: '斜体',
                    processLeaf: ({ leaf, style }) => {
                        if (leaf.italic) {
                            style.fontStyle = 'italic';
                        }
                    }
                }),
                createMarkPlugin({
                    format: 'underlined',
                    title: '下划线',
                    processLeaf: ({ leaf, style }) => {
                        style.textDecoration = style.textDecoration || '';
                        if (leaf.underlined) {
                            style.textDecoration += ' underline';
                        }
                    }
                }),
                createMarkPlugin({
                    format: 'strikethrough',
                    title: '删除线',
                    processLeaf: ({ leaf, style }) => {
                        style.textDecoration = style.textDecoration || '';
                        if (leaf.strikethrough) {
                            style.textDecoration += ' line-through';
                        }
                    }
                }),
                'line',
                createMarkPlugin({
                    format: 'superscript',
                    title: '上标',
                    otherFormat: 'subscript',
                    processLeaf: ({ leaf, attributes }) => {
                        if (leaf.superscript) {
                            attributes.className = classnames(attributes.className, 'slate-sup');
                        }
                    }
                }),
                createMarkPlugin({
                    format: 'subscript',
                    title: '下标',
                    otherFormat: 'superscript',
                    processLeaf: ({ leaf, attributes }) => {
                        if (leaf.subscript) {
                            attributes.className = classnames(attributes.className, 'slate-sub');
                        }
                    }
                }),
                plugins['format-clear'],
                'line',
                plugins['indent'],
                plugins['align'],
                'line',
                require('./components/plugins/headings/index.jsx').default,
                'line',
                createBlockPlugin({
                    format: 'bulleted-list',
                    title: '无序列表',
                    icon: 'bfi-list',
                    processElement: ({ attributes, children, element }) => {
                        if (element.type === 'bulleted-list') {
                            return <ul {...attributes}>{children}</ul>;
                        }
                        if (element.type === 'list-item') {
                            return <li {...attributes}>{children}</li>;
                        }
                    }
                }),
                createBlockPlugin({
                    format: 'numbered-list',
                    title: '有序列表',
                    icon: 'bfi-list-numbered',
                    processElement: ({ attributes, children, element }) => {
                        if (element.type === 'numbered-list') {
                            return <ol {...attributes}>{children}</ol>;
                        }
                        if (element.type === 'list-item') {
                            return <li {...attributes}>{children}</li>;
                        }
                    }
                }),
                createBlockPlugin({
                    format: 'block-quote',
                    title: '引用',
                    icon: 'bfi-quote',
                    processElement: ({ attributes, children, element }) => {
                        if (element.type === 'block-quote') {
                            return <blockquote {...attributes}>{children}</blockquote>;
                        }
                    }
                }),
                createBlockPlugin({
                    format: 'block-code',
                    title: '代码',
                    icon: 'bfi-code',
                    processElement: ({ attributes, children, element }) => {
                        if (element.type === 'block-code') {
                            return (
                                <pre {...attributes}>
                                    <code>{children}</code>
                                </pre>
                            );
                        }
                    }
                }),
                'line',
                require('./components/plugins/linkEditor/index.jsx').default,
                plugins['hr'],
                plugins['clear-all'],
                plugins['fullscreen']
            ]}
        />
    );
};

const render = (Component) => {
    ReactDOM.render(<Component />, document.getElementById('root'));
};

render(Main);
