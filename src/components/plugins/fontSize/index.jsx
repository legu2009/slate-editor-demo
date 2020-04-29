import React, { useRef, useState } from 'react';
import DropDown from '../../common/dropDown';
import { Editor } from 'slate';
import { useSlate } from 'slate-react';

export default {
    config: {
        fontSizes: [12, 14, 16, 18, 20, 24, 28, 30, 32, 36, 40, 48, 56, 64, 72, 96, 120, 144],
        title: '字号'
    },
    ToolbarButton: function FontSize({ config }) {
        const fontSizes = config.fontSizes;
        let current = 14;
        const editor = useSlate();
        const marks = Editor.marks(editor);
        if (marks && marks['fontSize']) {
            current = marks['fontSize'];
        }
        const [active, setActive] = useState(false);
        return (
            <DropDown
                key={'fontSizes'}
                caption={current}
                title={config.title}
                className="slate-toolbar-item"
                active={active}
                onActiveChange={setActive}>
                <ul className="slate-dropdown-list">
                    {fontSizes.map((item, index) => {
                        return (
                            <li
                                key={index}
                                className={'slate-dropdown-hide ' + (item === current ? 'active' : null)}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    Editor.addMark(editor, 'fontSize', item);
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
        if (leaf.fontSize) {
            style.fontSize = leaf.fontSize;
        }
    }
};
