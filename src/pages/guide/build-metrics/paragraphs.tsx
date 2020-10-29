import { faLock, faTimes, faUnlock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styled from 'styled-components';
import Button, { ButtonType } from '../../component/button';
import { AsRnd } from './as-rnd';

export interface ParagraphText {
	text: string;
	uuid: string;
}

const QuillFonts = [ 'Arial', 'Microsoft-YaHei', 'SimHei', 'Tahoma', 'Times-New-Roman', 'Verdana' ];
const Font = Quill.import('formats/font');
Font.whitelist = QuillFonts; //将字体加入到白名单

const modules = {
	toolbar: [
		[ { font: QuillFonts } ],
		[ { header: [ 1, 2, 3, 4, 5, 6, false ] }, { 'align': [] } ],
		[ 'bold', 'italic', 'underline', 'strike', 'blockquote' ],
		[ { list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }, { script: 'sub' }, { script: 'super' } ],
		[ 'image' ],
		[ { 'color': [] }, { 'background': [] } ],
		[ 'clean' ]
	]
};

const RichEditorRndContainer = styled.div`
	position: absolute;
	&:hover {
		.quill {
			.ql-toolbar.ql-snow + .ql-container.ql-snow {
	            border-top-color: var(--border-color);
	            border-top-style: dashed;
	        }
			.ql-container {
				border-color: var(--border-color);
				border-style: dashed;
			}
		}
	}
	&:focus-within {
		div[data-widget='chart-paragraph-container'] > button {
			pointer-events: auto;
			opacity: 1;
			&:first-child {
				left: calc(100% + 4px);
			}
			&:nth-child(2) {
				left: calc(100% + 4px + 32px + 4px);
			}
		}
		.quill {
			.ql-toolbar {
				opacity: 1;
				pointer-events: auto;
				&.ql-snow + .ql-container.ql-snow {
		            border-top-color: var(--border-color);
		             border-top-style: solid;
		        }
			}
			.ql-container {
				border-color: var(--border-color);
				background-color: var(--bg-color);
				border-style: solid;
			}
		}
	}
`;
const RichEditorContainer = styled.div.attrs({
	'data-widget': 'chart-paragraph-container'
})`
	position: relative;
	height: 100%;
	> button {
		display: block;
		position: absolute;
		border: 0;
		border-radius: 100%;
		top: 6px;
		left: 100%;
		width: 32px;
		height: 32px;
		pointer-events: none;
		padding: 0;
		opacity: 0;
	}
	.quill {
		height: 100%;
		.ql-toolbar {
			position: absolute;
			border: var(--border);
			border-radius: var(--border-radius);
	        opacity: 0;
	        pointer-events: none;
	        bottom: calc(100% + 4px);
	        width: 400px;
	        background-color: var(--bg-color);
	        transition: all 300ms ease-in-out;
	        &.ql-snow + .ql-container.ql-snow {
	        	border-top: var(--border);
	        	border-top-color: transparent;
	        }
	        &.ql-snow .ql-picker.ql-font {
	        	width: 200px;
	        }
		}
		.ql-container {
			border: var(--border);
			border-color: transparent;
			border-radius: var(--border-radius);
			transition: all 300ms ease-in-out;
		}
	}
`;
const RichEditor = (props: {
	rnd: boolean,
	value: ParagraphText,
	onChanged: (text: ParagraphText) => void,
	onRemove: () => void;
}) => {
	const { rnd, value, onChanged, onRemove } = props;

	const [ locked, setLocked ] = useState(false);
	const onTextChanged = (text: string) => {
		value.text = text;
		onChanged(value);
	};

	return <RichEditorRndContainer>
		<AsRnd rnd={rnd} lock={locked}>
			<RichEditorContainer>
				<Button inkType={ButtonType.PRIMARY} title={locked ? 'Unlock' : 'Lock'}
				        onClick={() => setLocked(!locked)}>
					<FontAwesomeIcon icon={locked ? faUnlock : faLock}/>
				</Button>
				<Button inkType={ButtonType.PRIMARY} title='Delete this paragraph'
				        onClick={onRemove}>
					<FontAwesomeIcon icon={faTimes}/>
				</Button>
				<ReactQuill value={value.text} modules={modules} onChange={onTextChanged}/>
			</RichEditorContainer>
		</AsRnd>
	</RichEditorRndContainer>;
};

export const Paragraphs = (props: {
	rnd: boolean,
	texts: Array<ParagraphText>,
	onTextsChanged: (texts: Array<ParagraphText>) => void
}) => {
	const { rnd, texts, onTextsChanged } = props;

	if (!rnd) {
		return null;
	}

	const onTextChanged = () => {
		onTextsChanged([ ...texts ]);
	};
	const onTextRemove = (text: ParagraphText) => () => {
		onTextsChanged(texts.filter(t => t !== text));
	};

	return <Fragment>
		{texts.map((text, index) => {
			return <RichEditor rnd={rnd} value={text} key={text.uuid}
			                   onChanged={onTextChanged}
			                   onRemove={onTextRemove(text)}/>;
		})}
	</Fragment>;
};
