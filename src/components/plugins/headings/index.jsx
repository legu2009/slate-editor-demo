import React, { useRef, useState } from 'react';
import DropDown from '../../common/dropDown';
import { useSlate } from 'slate-react';
import { Editor, Transforms, createEditor, Range } from 'slate';
import { preventDefault, toggleBlock } from '../../../editor/common.js';
import './style.less';

const Headings = React.memo(({ config }) => {
    const editor = useSlate();
    const headings = config.headings;
    const names = config.names;
    let current = 'header-0';
    const [match] = Editor.nodes(editor, {
        match: (n) => n.type && n.type.indexOf('header-') === 0
    });
    if (match && match[0]) {
        current = match[0].type;
    }
    const [active, setActive] = useState(false);
    return (
        <DropDown
            key={'headings'}
            caption={names[current]}
            title={config.title}
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
                            onMouseDown={(e) => {
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

export default {
    config: {
        headings: ['header-1', 'header-2', 'header-3', 'header-4', 'header-5', 'header-6', 'header-0'],
        title: '标题',
        names: {
            'header-1': '标题1',
            'header-2': '标题2',
            'header-3': '标题3',
            'header-4': '标题4',
            'header-5': '标题5',
            'header-6': '标题6',
            'header-0': '常规'
        }
    },
    ToolbarButton: Headings,
    processElement: ({ attributes, children, element }) => {
        if (element.type.indexOf('header-') === 0) {
            let headSize = element.type.replace('header-', '');
            if (headSize !== '0') {
                return React.createElement('h' + headSize, attributes, children);
            }
        }
    }
};
