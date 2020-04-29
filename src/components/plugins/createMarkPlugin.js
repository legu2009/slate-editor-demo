import React, { useContext } from 'react';
import { isMarkActive, toggleMark } from '../../editor/common.js';
import classnames from 'classnames';
import { useSlate } from 'slate-react';

const MarkButton = React.memo(({ children, title, format, otherFormat }) => {
    const editor = useSlate();
    return (
        <button
            type="button"
            data-title={title}
            className={classnames('slate-toolbar-item', { active: isMarkActive(editor, format) })}
            onMouseDown={(e) => {
                e.preventDefault();
                toggleMark(editor, format, otherFormat);
            }}>
            {children}
        </button>
    );
});

export default ({ format, title, otherFormat, config, processLeaf, icon }) => {
    config = config || {};
    config.title = title;
    return {
        config,
        ToolbarButton: () => {
            return (
                <MarkButton key={format} format={format} otherFormat={otherFormat} title={title}>
                    <i className={icon || 'bfi-' + format}></i>
                </MarkButton>
            );
        },
        processLeaf:
            processLeaf ||
            (({ leaf, style }) => {
                if (leaf[format]) {
                    style[format] = leaf[format];
                }
            })
    };
};
