import React, { useCallback, useMemo, useState, useRef } from 'react';
import { Editable, withReact, useSlate, Slate } from 'slate-react';
import { withHistory } from 'slate-history';

export default {
    config: {
        title: {
            undo: '撤销',
            redo: '重做'
        }
    },
    withEditor: (editor) => {
        return withHistory(editor);
    },
    ToolbarButton: React.memo(({ config }) => {
        const editor = useSlate();
        const history = editor.history;
        return (
            <>
                <button
                    type="button"
                    key="undo"
                    disabled={history.undos.length < 2}
                    data-title={config.title.undo}
                    className="slate-toolbar-item"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        editor.undo();
                    }}>
                    <i className="bfi-undo"></i>
                </button>
                <button
                    type="button"
                    key="redo"
                    disabled={history.redos.length === 0}
                    data-title={config.title.redo}
                    className="slate-toolbar-item"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        editor.redo();
                    }}>
                    <i className="bfi-redo"></i>
                </button>
            </>
        );
    })
};
