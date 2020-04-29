import React from 'react';
import './style.less';

export default React.memo(function ToolBar({ getContainerNode, plugins }) {
    return (
        <div className="slate-toolbar">
            {plugins.map((item) => {
                if (item === 'line') {
                    return <span className="slate-toolbar-line"></span>;
                }
                return <item.ToolbarButton config={item.config} getContainerNode={getContainerNode} />;
            })}
        </div>
    );
});
