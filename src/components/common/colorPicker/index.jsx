import React from 'react';
import './style.less';

export default React.memo(({ presetColors, color, onChange }) => (
    <ul className="slate-color-list">
        {presetColors.map((item, index) => {
            let className = color && item === color ? 'active' : '';
            return (
                <li
                    key={index}
                    title={item}
                    className={className}
                    style={{ color: item }}
                    onMouseDown={e => {
                        e.preventDefault();
                        onChange(item);
                    }}></li>
            );
        })}
    </ul>
));
