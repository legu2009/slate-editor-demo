import React, { useCallback, useMemo, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import Editor from './editor/index.jsx';
import './index.less';

const Main = () => {
    const [value, setValue] = useState([
        {
            type: 'paragraph',
            children: [{ text: 'abc' }]
        }
    ]);
    const onChange = useCallback(function (val) {
        console.log('onChange', val);
        setValue(val);
    });
    return <Editor value={value} onChange={onChange} />;
};

const render = (Component) => {
    ReactDOM.render(<Component />, document.getElementById('root'));
};

render(Main);
