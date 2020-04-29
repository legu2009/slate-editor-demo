import React, { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import classnames from 'classnames';
import './style.less';

const DropDown = React.memo(
    ({ disabled, className, title, caption, children, active, onActiveChange, isMousePrevent = true }) => {
        const handlerInstance = useRef(null);
        const contentInstance = useRef(null);

        let toggle = (e) => {
            e.preventDefault();
            onActiveChange(!active);
        };

        let preventDefault = function (e) {
            e.preventDefault();
        };

        useEffect(() => {
            let listener = (event) => {
                if (contentInstance.current.contains(event.target) || handlerInstance.current.contains(event.target)) {
                    return false;
                }
                onActiveChange(false);
            };
            document.body.addEventListener('click', listener);
            return () => {
                document.body.removeEventListener('click', listener);
            };
        }, []);

        return (
            <div className={classnames(className, 'slate-dropdown', { active, disabled })}>
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
                    <div className="slate-dropdown-content" onMouseDown={isMousePrevent ? preventDefault : null}>
                        {children}
                    </div>
                </div>
            </div>
        );
    }
);

export default DropDown;
