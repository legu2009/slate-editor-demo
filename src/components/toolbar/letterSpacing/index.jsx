import React, { useRef, useState } from 'react';
import DropDown from '../../common/dropDown';
import { preventDefault } from '../../../editor/common.js';
import { Editor } from 'slate';
import { useSlate } from 'slate-react';

export default function LetterSpacing() {
    let current = 1;
    const editor = useSlate();
    const marks = Editor.marks(editor);
    if (marks && marks['letterSpacing']) {
        current = marks['letterSpacing'];
    }
    const letterSpacings = [0, 1, 2, 3, 4, 5, 6];
    const [active, setActive] = useState(false);
    return (
        <DropDown
            autoHide={true}
            title="字间距"
            caption={current}
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
                            onMouseDown={e => {
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
}
