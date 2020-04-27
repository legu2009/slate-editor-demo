import React, { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import './style.less';

const DropDown = React.memo(({ disabled, className, title, autoHide, caption, children, active, onActiveChange, isMousePrevent = true }) => {
    const handlerInstance = useRef(null);
    const contentInstance = useRef(null);

    let toggle = e => {
        e.preventDefault();
        onActiveChange(!active);
    };

    let preventDefault = function(e) {
        e.preventDefault();
    };

    useEffect(() => {
        let registerClickEvent = event => {
            if (contentInstance.current.contains(event.target) || handlerInstance.current.contains(event.target)) {
                return false;
            }
            autoHide && onActiveChange(false);
        };
        document.body.addEventListener('click', registerClickEvent);
        return () => {
            document.body.removeEventListener('click', registerClickEvent);
        };
    }, []);

    return (
        <div className={'slate-dropdown ' + (active ? 'active ' : '') + (disabled ? 'disabled ' : '') + className}>
            <button
                type="button"
                className="slate-dropdown-handler"
                data-title={title}
                onMouseDown={toggle}
                ref={handlerInstance}>
                <span>{caption}</span>
                <i className="bfi-drop-down"></i>
            </button>
            <div className="slate-dropdown-box" ref={contentInstance}>
                <i className="slate-dropdown-arrow"></i>
                <div className="slate-dropdown-content" onMouseDown={isMousePrevent ? preventDefault: null}>
                    {children}
                </div>
            </div>
        </div>
    );
});

export default DropDown;
