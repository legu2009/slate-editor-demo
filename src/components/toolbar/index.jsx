import React, { useContext } from 'react';
import { Editable, withReact, useSlate, Slate } from 'slate-react';
import { Editor, Transforms } from 'slate';
import classnames from 'classnames';
import {
    isBlockActive,
    toggleBlock,
    clearMark,
    insertLine,
    clearContent,
    preventDefault,
    insertMention,
    insertTable
} from '../../editor/common.js';
import './style.less';


export default React.memo(function ToolBar({ getContainerNode, plugins }) {
    const editor = useSlate();
    return (
        <div className="slate-toolbar">
            {plugins.map((item) => {
                if (item === 'line') {
                    return <span className="slate-toolbar-line"></span>;
                }
                return <item.ToolbarButton config={item.config} getContainerNode={getContainerNode} />;
            })}
            <button
                type="button"
                key="mention"
                data-title="mention"
                className="slate-toolbar-item"
                onMouseDown={(e) => {
                    e.preventDefault();
                    insertMention(editor, 'emoji');
                }}>
                <i className="bfi-emoji"></i>
            </button>
            <button
                type="button"
                key="table"
                data-title="table"
                className="slate-toolbar-item"
                onMouseDown={(e) => {
                    e.preventDefault();
                    insertTable(editor);
                }}>
                <i className="bfi-table"></i>
            </button>
        </div>
    );
});
