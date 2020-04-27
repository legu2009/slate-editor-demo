import React, { useRef, useState } from 'react';
import DropDown from '../../common/dropDown';
import { useSlate } from 'slate-react';
import { Editor, Transforms, createEditor, Range } from 'slate';
import { preventDefault, toggleBlock } from '../../../editor/common.js';
import './style.less';

export default React.memo(() => {
    const editor = useSlate();
    const headings = ['header-1', 'header-2', 'header-3', 'header-4', 'header-5', 'header-6', 'header-0'];
    const names = {
        'header-1': '标题1',
        'header-2': '标题2',
        'header-3': '标题3',
        'header-4': '标题4',
        'header-5': '标题5',
        'header-6': '标题6',
        'header-0': '常规'
    };
    let current = 'header-0';
    const [match] = Editor.nodes(editor, {
        match: n => n.type && n.type.indexOf('header-') === 0
    });
    if (match && match[0]) {
        current = match[0].type;
    }
    const [active, setActive] = useState(false);
    return (
        <DropDown
            caption={names[current]}
            autoHide={true}
            title="标题"
            arrowActive={true}
            className="slate-toolbar-item slate-toolbar-headings"
            active={active}
            onActiveChange={setActive}>
            <ul className="slate-headings-list">
                {headings.map((item, index) => {
                    let headSize = item.replace('header-', '');
                    return (
                        <li
                            key={index}
                            className={`slate-headings-head${headSize} ` + (current === item ? 'active' : '')}
                            onMouseDown={e => {
                                e.preventDefault();
                                toggleBlock(editor, item);
                                setActive(false);
                            }}>
                            {headSize === '0' ? names[item] : React.createElement('h' + headSize, {}, names[item])}
                        </li>
                    );
                })}
            </ul>
        </DropDown>
    );
});
