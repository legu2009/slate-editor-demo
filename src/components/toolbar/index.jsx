import React, { useContext } from 'react';
import FontSizePicker from './fontSize';
import LineHeightPicker from './lineHeight';
import LetterSpacingPicker from './letterSpacing';
import TextColorPicker from './textColor';
import HeadingPicker from './headings';
import LinkEditor from './linkEditor';
import { Editable, withReact, useSlate, Slate } from 'slate-react';
import { Editor, Transforms } from 'slate';
import {
    isMarkActive,
    isBlockActive,
    toggleMark,
    toggleBlock,
    clearMark,
    insertLine,
    clearContent,
    preventDefault,
    insertMention,
    insertTable
} from '../../editor/common.js';
import { FullContext } from '../../editor/context.jsx';
import './style.less';

const MarkButton = React.memo(({ children, title, format, otherFormat }) => {
    const editor = useSlate();
    return (
        <button
            type="button"
            data-title={title}
            className={'slate-toolbar-item' + (isMarkActive(editor, format) ? ' active' : '')}
            onMouseDown={(e) => {
                e.preventDefault();
                toggleMark(editor, format, otherFormat);
            }}>
            {children}
        </button>
    );
});

const BlockButton = React.memo(({ children, title, format, otherFormat }) => {
    const editor = useSlate();
    return (
        <button
            type="button"
            data-title={title}
            className={'slate-toolbar-item' + (isBlockActive(editor, format) ? ' active' : '')}
            onMouseDown={(e) => {
                e.preventDefault();
                toggleBlock(editor, format, otherFormat);
            }}>
            {children}
        </button>
    );
});

const HistoryBtns = React.memo(() => {
    const editor = useSlate();
    const history = editor.history;
    return (
        <>
            <button
                type="button"
                key="undo"
                disabled={history.undos.length < 2}
                data-title="撤销"
                className="slate-toolbar-item"
                onMouseDown={(e) => {
                    e.preventDefault();
                    editor.undo();
                }}>
                <i className="bfi-undo"></i>
            </button>
            <button
                type="button"
                key="redo"
                disabled={history.redos.length === 0}
                data-title="重做"
                className="slate-toolbar-item"
                onMouseDown={(e) => {
                    e.preventDefault();
                    editor.redo();
                }}>
                <i className="bfi-redo"></i>
            </button>
        </>
    );
});

const FullBtn = React.memo(() => {
    const { isFull, setIsFull } = useContext(FullContext);
    return (
        <button
            type="button"
            data-title={isFull ? '退出全屏' : '全屏'}
            className="slate-toolbar-item"
            onMouseDown={(e) => {
                e.preventDefault();
                setIsFull((f) => !f);
            }}>
            <i className={isFull ? 'bfi-fullscreen-exit' : 'bfi-fullscreen'}></i>
        </button>
    );
});

const IndentBtns = React.memo(() => {
    const editor = useSlate();
    let increase = 0;
    const [match] = Editor.nodes(editor, {
        match: (n) => n.increase
    });
    if (match && match[0]) {
        increase = match[0].increase;
    }
    return (
        <>
            <button
                type="button"
                key="indent-increase"
                data-title="增加缩进"
                className="slate-toolbar-item"
                onMouseDown={(e) => {
                    e.preventDefault();
                    Transforms.setNodes(editor, {
                        increase: increase + 1
                    });
                }}>
                <i className="bfi-indent-increase"></i>
            </button>
            <button
                type="button"
                key="indent-decrease"
                disabled={increase === 0}
                data-title="减少缩进"
                className="slate-toolbar-item"
                onMouseDown={(e) => {
                    e.preventDefault();
                    Transforms.setNodes(editor, {
                        increase: increase - 1
                    });
                }}>
                <i className="bfi-indent-decrease"></i>
            </button>
        </>
    );
});

const AlignBtns = React.memo(() => {
    const editor = useSlate();
    let align = 'left';
    const [match] = Editor.nodes(editor, {
        match: (n) => n.align
    });
    if (match && match[0]) {
        align = match[0].align;
    }
    const getClickFn = (align) => {
        return (e) => {
            e.preventDefault();
            Transforms.setNodes(editor, {
                align
            });
        };
    };
    return (
        <>
            <button
                type="button"
                key="left"
                data-title="居左"
                className={'slate-toolbar-item' + (align === 'left' ? ' active' : '')}
                onMouseDown={getClickFn('left')}>
                <i className="bfi-align-left"></i>
            </button>
            <button
                type="button"
                key="align-center"
                data-title="居中"
                className={'slate-toolbar-item' + (align === 'center' ? ' active' : '')}
                onMouseDown={getClickFn('center')}>
                <i className="bfi-align-center"></i>
            </button>
            <button
                type="button"
                key="align-right"
                data-title="居右"
                className={'slate-toolbar-item' + (align === 'right' ? ' active' : '')}
                onMouseDown={getClickFn('right')}>
                <i className="bfi-align-right"></i>
            </button>
            <button
                type="button"
                key="align-justify"
                data-title="两端"
                className={'slate-toolbar-item' + (align === 'justify' ? ' active' : '')}
                onMouseDown={getClickFn('justify')}>
                <i className="bfi-align-justify"></i>
            </button>
        </>
    );
});

export default React.memo(function ToolBar() {
    const editor = useSlate();
    return (
        <div className="slate-toolbar">
            <HistoryBtns />
            <span className="slate-toolbar-line"></span>
            <FontSizePicker />
            <LineHeightPicker />
            <LetterSpacingPicker />
            <span className="slate-toolbar-line"></span>
            <TextColorPicker />
            <MarkButton key="bold" format="bold" title={'加粗'}>
                <i className="bfi-bold"></i>
            </MarkButton>
            <MarkButton key="italic" format="italic" title={'斜体'}>
                <i className="bfi-italic"></i>
            </MarkButton>
            <MarkButton key="underlined" format="underline" title={'下划线'}>
                <i className="bfi-underlined"></i>
            </MarkButton>
            <MarkButton key="strikethrough" format="strikethrough" title={'删除线'}>
                <i className="bfi-strikethrough"></i>
            </MarkButton>
            <span className="slate-toolbar-line"></span>
            <MarkButton key="superscript" format="superscript" otherFormat="subscript" title={'上标'}>
                <i className="bfi-superscript"></i>
            </MarkButton>
            <MarkButton key="subscript" format="subscript" otherFormat="superscript" title={'下标'}>
                <i className="bfi-subscript"></i>
            </MarkButton>
            <button
                type="button"
                key="format-clear"
                data-title="清除样式"
                className={'slate-toolbar-item'}
                onMouseDown={(e) => {
                    e.preventDefault();
                    clearMark(editor);
                }}>
                <i className="bfi-format-clear"></i>
            </button>
            <span className="slate-toolbar-line"></span>
            <IndentBtns />
            <AlignBtns />
            <span className="slate-toolbar-line"></span>
            <HeadingPicker />
            <BlockButton key="bulleted-list" format="bulleted-list" title="无序列表">
                <i className="bfi-list"></i>
            </BlockButton>
            <BlockButton key="numbered-list" format="numbered-list" title="有序列表">
                <i className="bfi-list-numbered"></i>
            </BlockButton>
            <BlockButton key="block-quote" format="block-quote" title="引用">
                <i className="bfi-quote"></i>
            </BlockButton>
            <BlockButton key="block-code" format="block-code" title="代码">
                <i className="bfi-code"></i>
            </BlockButton>
            <span className="slate-toolbar-line"></span>
            <LinkEditor />
            <button
                type="button"
                key="hr"
                data-title="水平线"
                className="slate-toolbar-item"
                onMouseDown={(e) => {
                    e.preventDefault();
                    insertLine(editor);
                }}>
                <i className="bfi-hr"></i>
            </button>
            <span className="slate-toolbar-line"></span>
            <button
                type="button"
                key="clear-all"
                data-title="清除内容"
                className="slate-toolbar-item"
                onMouseDown={(e) => {
                    e.preventDefault();
                    clearContent(editor);
                }}>
                <i className="bfi-clear-all"></i>
            </button>
            <span className="slate-toolbar-line"></span>
            <FullBtn />
            <button
                type="button"
                key="mention"
                data-title="mention"
                className={'slate-toolbar-item'}
                onMouseDown={(e) => {
                    e.preventDefault();
                    insertMention(editor, 'emoji');
                }}>
                <i className="bfi-emoji"></i>
            </button>
            <button
                type="button"
                key="table"
                data-title="table"
                className={'slate-toolbar-item'}
                onMouseDown={(e) => {
                    e.preventDefault();
                    insertTable(editor);
                }}>
                <i className="bfi-table"></i>
            </button>
        </div>
    );
});
