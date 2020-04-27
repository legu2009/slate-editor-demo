import React, { useRef, useState } from 'react';
import DropDown from '../../common/dropDown';
import { preventDefault } from '../../../editor/common.js';
import { Editor } from 'slate';
import { useSlate } from 'slate-react';

export default function LineHeight() {
    let current = 1;
    const editor = useSlate();
    const marks = Editor.marks(editor);
    if (marks && marks['lineHeight']) {
        current = marks['lineHeight'];
    }
    const lineHeights = [1, 1.2, 1.5, 1.75, 2, 2.5, 3, 4];
    const [active, setActive] = useState(false);
    return (
        <DropDown
            autoHide={true}
            caption={current}
            title="行高"
            className="slate-toolbar-item"
            active={active}
            onActiveChange={setActive}>
            <ul className="slate-dropdown-list">
                {lineHeights.map((item, index) => {
                    return (
                        <li
                            key={index}
                            className={item === current ? 'active' : null}
                            onMouseDown={e => {
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
}
