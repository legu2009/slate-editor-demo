import React from 'react';
import classnames from 'classnames';
import './index.less';

export default (props) => {
    const { active, onClick, className } = props;
    return <div onClick={onClick} className={classnames(className, 'slate-switch bf-switch', { active })}></div>;
};
