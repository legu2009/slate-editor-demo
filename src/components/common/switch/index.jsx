import React from 'react';
import './index.less';

export default props => {
    const { active, onClick, className = '' } = props;
    return (
        <div onClick={onClick} className={'slate-switch bf-switch ' + className + (active ? ' active' : '')}></div>
    );
};
