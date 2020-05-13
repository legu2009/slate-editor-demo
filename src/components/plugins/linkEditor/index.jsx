import React, { useCallback, useMemo, useState, useRef } from 'react';
import { Transforms, Editor, Range, createEditor, Text, Point } from 'slate';
import { Editable, withReact, useSlate, Slate } from 'slate-react';
import Switch from '../../common/switch';
import DropDown from '../../common/dropDown';
import './style.less';

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

const insertLink = (editor, props, flag) => {
    if (editor.selection) {
        wrapLink(editor, props, flag);
    }
};

const isLinkActive = (editor) => {
    const [link] = Editor.nodes(editor, { match: (n) => n.type === 'link' });
    return !!link;
};

const unwrapLink = (editor) => {
    Transforms.unwrapNodes(editor, {
        match: (n) => n.type === 'link',
        split: true
    });
};

const wrapLink = (editor, { url, target }, flag) => {
    const { selection } = editor;
    const isActive = isLinkActive(editor);
    if (Point.equals(selection.anchor, selection.focus) && isActive) {
        Transforms.setNodes(
            editor,
            {
                type: 'link',
                url,
                target
            },
            { match: (n) => n.type === 'link' }
        );
        return;
    }
    if (isActive) {
        unwrapLink(editor);
    }
    const isCollapsed = selection && Range.isCollapsed(selection);
    const link = {
        type: 'link',
        url,
        target,
        children: isCollapsed ? [{ text: url }] : []
    };
    if (isCollapsed) {
        Transforms.insertNodes(editor, link);
    } else {
        Transforms.wrapNodes(editor, link, { split: true });
        if (flag) {
            Transforms.collapse(editor, { edge: 'end' });
        }
    }
};

const LinkEditor = function LinkEditor({ getContainerNode, config }) {
    const caption = <i className="bfi-link"></i>;
    const [url, setUrl] = useState('');
    const [target, setTarget] = useState(false);
    const [active, _setActive] = useState(false);

    const editor = useSlate();
    const tmpSelection = useRef(null);
    const isActive = isLinkActive(editor);
    const isNewLink = useRef(false);
    const onSwitchChange = (e) => {
        setTarget((f) => !f);
    };
    const onInputChange = (e) => {
        setUrl(e.target.value);
    };
    const onDropDownShow = () => {
        let editorEnd = Editor.end(editor, []);
        if (!editor.selection) {
            Transforms.select(editor, {anchor: editorEnd, focus: editorEnd});
        }
        let selection = (tmpSelection.current = editor.selection);
        isNewLink.current = false;
        const [link] = Editor.nodes(editor, {
            match: (n) => {
                return n.type === 'link';
            }
        });
        if (!!link) {
            setUrl(link[0].url);
            setTarget(link[0].target === '_blank');
        } else {
            setUrl('');
            setTarget(false);
            if (!Range.isCollapsed(selection)) {
                insertLink(editor, {
                    url: 'about:blank',
                    target: ''
                });
                isNewLink.current = true;
                tmpSelection.current = editor.selection;
            }
        }
    };
    const onDropDownHide = () => {
        if (isNewLink.current) {
            Transforms.select(editor, tmpSelection.current);
            unwrapLink(editor);
            isNewLink.current = false;
        }
        getContainerNode().querySelector('.slate-content').focus();
    };
    const setActive = (_active) => {
        if (active === _active) return;
        _setActive(_active);
        if (_active) {
            onDropDownShow();
        } else {
            onDropDownHide();
        }
    };
    const onCancel = (e) => {
        e.preventDefault();
        setActive(false);
    };
    const onConfirm = (e) => {
        e.preventDefault();
        if (!url) return onCancel(e);
        Transforms.select(editor, tmpSelection.current);
        editor.selection = tmpSelection.current;
        insertLink(
            editor,
            {
                url,
                target: target ? '_blank' : ''
            },
            true
        );
        isNewLink.current = false;
        setActive(false);
    };
    const onInputKeyDown = (e) => {
        if (e.keyCode === 13) {
            onConfirm(e);
        }
    };
    return (
        <>
            <DropDown
                caption={caption}
                title={config.title.button}
                autoHide={true}
                key={'link'}
                className="slate-toolbar-item slate-toolbar-link"
                isMousePrevent={false}
                active={active}
                onActiveChange={setActive}>
                <>
                    <div className="toolbar-link-input">
                        <input
                            type="text"
                            value={url}
                            spellCheck={false}
                            placeholder={config.title.url}
                            onKeyDown={onInputKeyDown}
                            onChange={onInputChange}
                        />
                    </div>
                    <div className="toolbar-link-switch">
                        <Switch active={target ? '_blank' : ''} onClick={onSwitchChange} />
                        <label>{config.title.target}</label>
                    </div>
                    <div className="toolbar-link-buttons">
                        <button type="button" onMouseDown={onConfirm} className="slate-button primary fr">
                        {config.title.confirm}
                        </button>
                        <button type="button" onMouseDown={onCancel} className="slate-button fr">
                        {config.title.cancel}
                        </button>
                    </div>
                </>
            </DropDown>
            <button
                key="link-off"
                type="button"
                data-title={config.title.unwrap}
                disabled={!isActive}
                className="slate-toolbar-item"
                onMouseDown={(e) => {
                    e.preventDefault();
                    unwrapLink(editor);
                }}>
                <i className="bfi-link-off"></i>
            </button>
        </>
    );
};

export default {
    key: 'linkEditor',
    config: {
        title: {
            button: '链接',
            url: '输入链接地址',
            target: '新窗口打开',
            confirm: '确定',
            cancel: '取消',
            unwrap: '清除链接'
        }
    },
    withEditor: (editor) => {
        const { insertData, insertText, isInline } = editor;
        editor.isInline = (element) => {
            return element.type === 'link' ? true : isInline(element);
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
    },
    ToolbarButton: LinkEditor,
    processElement: ({ attributes, children, element }) => {
        if (element.type === 'link') {
            return (
                <a {...attributes} href={element.url}>
                    {children}
                </a>
            );
        }
    }
};
