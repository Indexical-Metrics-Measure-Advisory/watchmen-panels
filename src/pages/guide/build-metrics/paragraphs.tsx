import { faLock, faUnlock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import styled from 'styled-components';
import Button, { ButtonType } from '../../component/button';
import { AsRnd } from './as-rnd';

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
		left: calc(100% + var(--margin) / 2);
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
const RichEditor = (props: { rnd: boolean, value: string, onChanged: (text: string) => void }) => {
	const { rnd, value, onChanged } = props;

	const [ locked, setLocked ] = useState(false);

	return <RichEditorRndContainer>
		<AsRnd rnd={rnd} lock={locked}>
			<RichEditorContainer>
				<Button inkType={ButtonType.PRIMARY} title={locked ? 'Unlock' : 'Lock'}
				        onClick={() => setLocked(!locked)}>
					<FontAwesomeIcon icon={locked ? faUnlock : faLock}/>
				</Button>
				<ReactQuill value={value} modules={modules} onChange={onChanged}/>
			</RichEditorContainer>
		</AsRnd>
	</RichEditorRndContainer>;
};

export const Paragraphs = (props: {
	rnd: boolean,
	texts: Array<string>,
	onTextsChanged: (texts: Array<string>) => void
}) => {
	const { rnd, texts, onTextsChanged } = props;

	if (!rnd) {
		return null;
	}

	const onTextChanged = (index: number) => (text: string) => {
		onTextsChanged(texts.map((t, idx) => {
			return idx !== index ? t : text;
		}));
	};

	return <Fragment>
		{texts.map((text, index) => {
			return <RichEditor rnd={rnd} value={text} onChanged={onTextChanged(index)} key={index}/>;
		})}
	</Fragment>;
};
