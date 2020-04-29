import React from 'react';
import './style.less';

export default React.memo(function ToolBar({ getContainerNode, plugins }) {
    return (
        <div className="slate-toolbar">
            {plugins.map((item, index) => {
                if (item === 'line') {
                    return <span key={'line' + index} className="slate-toolbar-line"></span>;
                }
                return <item.ToolbarButton key={item.key} config={item.config} getContainerNode={getContainerNode} />;
            })}
        </div>
    );
});
