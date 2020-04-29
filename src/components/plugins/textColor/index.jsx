import React, { useCallback, useMemo, useState, useRef } from 'react';
import DropDown from '../../common/dropDown';
import ColorPicker from '../../common/colorPicker';
import { Editor } from 'slate';
import { useSlate } from 'slate-react';
import './style.less';

function TextColor({ config }) {
    const [colorType, setColorType] = useState('color');
    const editor = useSlate();
    const marks = Editor.marks(editor);
    let bgColor = 'transparent';
    let fontColor = '#000000';
    if (marks && marks['color']) {
        fontColor = marks['color'];
    }
    if (marks && marks['backgroundColor']) {
        bgColor = marks['backgroundColor'];
    }
    let currentColor = colorType === 'color' ? fontColor : bgColor;
    const colors = config.colors;
    const [active, setActive] = useState(false);
    return (
        <DropDown
            key="textColor"
            caption={<i className="bfi-text-color" style={{ backgroundColor: bgColor, color: fontColor }} />}
            className={'slate-toolbar-item slate-toolbar-color'}
            title={config.title.button}
            active={active}
            onActiveChange={setActive}>
            <>
                <div className="slate-color-switch">
                    <button
                        type="button"
                        key="fontColor"
                        className={colorType === 'color' ? 'active' : ''}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            setColorType('color');
                        }}>
                        {config.title.fontColor}
                    </button>
                    <button
                        type="button"
                        key="bgColor"
                        className={colorType === 'backgroundColor' ? 'active' : ''}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            setColorType('backgroundColor');
                        }}>
                        {config.title.bgColor}
                    </button>
                </div>
                <ColorPicker
                    width={200}
                    color={currentColor}
                    disableAlpha={true}
                    presetColors={colors}
                    onChange={(color) => {
                        Editor.addMark(editor, colorType, color);
                        setActive(false);
                    }}
                />
            </>
        </DropDown>
    );
}

export default {
    config: {
        title: {
            button: '颜色',
            fontColor: '文字颜色',
            bgColor: '背景颜色'
        },
        colors: [
            '#000000',
            '#333333',
            '#666666',
            '#999999',
            '#cccccc',
            '#ffffff',
            '#61a951',
            '#16a085',
            '#07a9fe',
            '#003ba5',
            '#8e44ad',
            '#f32784',
            '#c0392b',
            '#d35400',
            '#f39c12',
            '#fdda00'
        ]
    },
    ToolbarButton: TextColor,
    processLeaf({ leaf, style }) {
        if (leaf.color) {
            style.color = leaf.color;
        }
        if (leaf.backgroundColor) {
            style.backgroundColor = leaf.backgroundColor;
        }
    }
};
