import React, { useContext } from 'react';
import { isBlockActive, toggleBlock } from '../../editor/common.js';
import classnames from 'classnames';
import { useSlate } from 'slate-react';

const BlockButton = React.memo(({ children, title, format, otherFormat }) => {
    const editor = useSlate();
    return (
        <button
            type="button"
            data-title={title}
            className={classnames('slate-toolbar-item', { active: isBlockActive(editor, format) })}
            onMouseDown={(e) => {
                e.preventDefault();
                toggleBlock(editor, format, otherFormat);
            }}>
            {children}
        </button>
    );
});

export default ({ format, title, otherFormat, config, processElement, icon, withEditor, ...props }) => {
    config = config || {};
    config.title = title;
    return {
        config,
        ToolbarButton: () => {
            return (
                <BlockButton key={format} format={format} title={title} otherFormat={otherFormat}>
                    <i className={icon || 'bfi-' + format}></i>
                </BlockButton>
            );
        },
        processElement,
        withEditor: (editor) => {
            editor.__BLOCKS__.push(format);
            if (withEditor) {
                return withEditor(editor);
            }
            return editor
        },
        ...props
    };
};
