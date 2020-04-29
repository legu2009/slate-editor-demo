import React, { useRef, useState } from 'react';
import DropDown from '../../common/dropDown';
import { Editor } from 'slate';
import { useSlate } from 'slate-react';

export default {
    config: {
        lineHeights: [1, 1.2, 1.5, 1.75, 2, 2.5, 3, 4],
        title: '行高'
    },
    ToolbarButton: function LineHeight({ config }) {
        const lineHeights = config.lineHeights;
        let current = 1;
        const editor = useSlate();
        const marks = Editor.marks(editor);
        if (marks && marks['lineHeight']) {
            current = marks['lineHeight'];
        }
        const [active, setActive] = useState(false);
        return (
            <DropDown
                caption={current}
                title={config.title}
                key={'lineHeight'}
                className="slate-toolbar-item"
                active={active}
                onActiveChange={setActive}>
                <ul className="slate-dropdown-list">
                    {lineHeights.map((item, index) => {
                        return (
                            <li
                                key={index}
                                className={item === current ? 'active' : null}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    Editor.addMark(editor, 'lineHeight', item);
                                    setActive(false);
                                }}>
                                {item}
                            </li>
                        );
                    })}
                </ul>
            </DropDown>
        );
    },
    processLeaf({ leaf, style }) {
        if (leaf.lineHeight) {
            style.lineHeight = leaf.lineHeight;
        }
    }
};
