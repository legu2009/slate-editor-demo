import React, { useRef, useState } from 'react';
import DropDown from '../../common/dropDown';
import { Editor } from 'slate';
import { useSlate } from 'slate-react';

export default {
    
    config: {
        title: '字间距',
        letterSpacings: [0, 1, 2, 3, 4, 5, 6]
    },
    ToolbarButton: function LetterSpacing({ config }) {
        const letterSpacings = config.letterSpacings;
        let current = 1;
        const editor = useSlate();
        const marks = Editor.marks(editor);
        if (marks && marks['letterSpacing']) {
            current = marks['letterSpacing'];
        }
        const [active, setActive] = useState(false);
        return (
            <DropDown
                title={config.title}
                caption={current}
                key={'letterSpacing'}
                className="slate-toolbar-item"
                active={active}
                onActiveChange={setActive}>
                <ul className="slate-dropdown-list">
                    {letterSpacings.map((item, index) => {
                        return (
                            <li
                                key={index}
                                className={item === current ? 'active' : null}
                                data-size={item}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    Editor.addMark(editor, 'letterSpacing', item);
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
        if (leaf.letterSpacing) {
            style.letterSpacing = leaf.letterSpacing + 'px';
        }
    }
};
