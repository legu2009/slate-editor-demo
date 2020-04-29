import React from 'react';
import classnames from 'classnames';
import './style.less';

export default React.memo(({ presetColors, color, onChange }) => (
    <ul className="slate-color-list">
        {presetColors.map((item, index) => {
            return (
                <li
                    key={index}
                    title={item}
                    className={classnames({ active: color && item === color })}
                    style={{ color: item }}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        onChange(item);
                    }}></li>
            );
        })}
    </ul>
));
