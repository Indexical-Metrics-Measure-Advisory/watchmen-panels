import Quill from 'quill';
import React, { Fragment } from 'react';
import ReactQuill from 'react-quill';
import { AsRnd } from './as-rnd';

const QuillFonts = [ 'Arial', 'Microsoft-YaHei', 'SimHei', 'Tahoma', 'Times-New-Roman', 'Verdana' ];
const Font = Quill.import('formats/font');
Font.whitelist = QuillFonts; //将字体加入到白名单

export const Paragraphs = (props: {
	rnd: boolean,
	texts: Array<string>,
	onTextsChanged: (texts: Array<string>) => void
}) => {
	const { rnd, texts, onTextsChanged } = props;

	if (!rnd) {
		return null;
	}

	const modules = {
		toolbar: [
			[ { 'font': QuillFonts } ],
			[ { 'header': 1 }, { 'header': 2 } ],
			[ 'pin' ],
			[ { 'header': [ 1, 2, 3, 4, 5, 6, false ] } ],
			[ 'bold', 'italic', 'underline', 'strike', 'blockquote' ],
			[ { 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' } ],
			[ { 'script': 'sub' }, { 'script': 'super' } ],
			[ 'image' ],
			[ { 'color': [] }, { 'background': [] } ],
			[ 'clean' ]
		]
	};

	const onTextChanged = (index: number) => (text: string) => {
		onTextsChanged(texts.map((t, idx) => {
			return idx !== index ? t : text;
		}));
	};

	return <Fragment>
		{texts.map((text, index) => {
			return <AsRnd rnd={rnd} key={index}>
				<ReactQuill value={text} modules={modules} onChange={onTextChanged(index)}/>
			</AsRnd>;
		})}
	</Fragment>;
};
