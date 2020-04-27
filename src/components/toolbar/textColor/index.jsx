import React, { useCallback, useMemo, useState, useRef } from 'react';
import DropDown from '../../common/dropDown';
import ColorPicker from '../../common/colorPicker';
import { Editor } from 'slate';
import { useSlate } from 'slate-react';
import { preventDefault } from '../../../editor/common.js';
import './style.less';

export default function TextColor() {
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
    const colors = [
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
    ];
    const [active, setActive] = useState(false);
    return (
        <DropDown
            caption={<i className="bfi-text-color" style={{ backgroundColor: bgColor, color: fontColor }} />}
            autoHide={true}
            className={'slate-toolbar-item slate-toolbar-color'}
            title="颜色"
            active={active}
            onActiveChange={setActive}>
            <>
                <div className="slate-color-switch">
                    <button
                        type="button"
                        className={colorType === 'color' ? 'active' : ''}
                        onMouseDown={e => {
                            e.preventDefault();
                            setColorType('color');
                        }}>
                        文字颜色
                    </button>
                    <button
                        type="button"
                        className={colorType === 'backgroundColor' ? 'active' : ''}
                        onMouseDown={e => {
                            e.preventDefault();
                            setColorType('backgroundColor');
                        }}>
                        背景颜色
                    </button>
                </div>
                <ColorPicker
                    width={200}
                    color={currentColor}
                    disableAlpha={true}
                    presetColors={colors}
                    onChange={color => {
                        Editor.addMark(editor, colorType, color);
                        setActive(false);
                    }}
                />
            </>
        </DropDown>
    );
}
