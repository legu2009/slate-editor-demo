import React, { useCallback, useMemo, useState, useRef } from 'react';
import { Transforms, Editor, Range, createEditor, Text, Point } from 'slate';
import { Editable, withReact, useSlate, Slate } from 'slate-react';
import Switch from '../../common/switch';
import DropDown from '../../common/dropDown';
import './style.less';

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

export default function LinkEditor() {
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
            Transforms.setSelection(editor, tmpSelection.current);
            unwrapLink(editor);
            isNewLink.current = false;
        }
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
        if (tmpSelection.current) {
            //Transforms.select(editor, tmpSelection.current);
            Transforms.setSelection(editor, tmpSelection.current);
        }
        if (isNewLink.current) {
            unwrapLink(editor);
            isNewLink.current = false;
        }
        setActive(false);
    };
    const onConfirm = (e) => {
        e.preventDefault();
        if (!url) return onCancel(e);
        if (tmpSelection.current) {
            Transforms.setSelection(editor, tmpSelection.current);
            editor.selection = tmpSelection.current;
            insertLink(
                editor,
                {
                    url,
                    target: target ? '_blank' : ''
                },
                true
            );
        }
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
                title="链接"
                autoHide={true}
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
                            placeholder={'输入链接地址'}
                            onKeyDown={onInputKeyDown}
                            onChange={onInputChange}
                        />
                    </div>
                    <div className="toolbar-link-switch">
                        <Switch active={target ? '_blank' : ''} onClick={onSwitchChange} />
                        <label>新窗口打开</label>
                    </div>
                    <div className="toolbar-link-buttons">
                        <button type="button" onMouseDown={onConfirm} className="slate-button primary fr">
                            确定
                        </button>
                        <button type="button" onMouseDown={onCancel} className="slate-button fr">
                            取消
                        </button>
                    </div>
                </>
            </DropDown>
            <button
                type="button"
                data-title="清除链接"
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
}

export { wrapLink, unwrapLink };
