import { faParagraph } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components';
import Button, { ButtonType } from '../../component/button';

const ParagraphButton = styled(Button).attrs({
	'data-widget': 'chart-add-paragraph-btn'
})`
	display: block;
	position: fixed;
	font-size: 32px;
	line-height: 64px;
	width: 64px;
	right: 32px;
	top: 166px;
	z-index: 10000;
	padding: 0;
	border: 0;
	border-radius: 100%;
`;

export const AddParagraphButton = (props: { rnd: boolean, onAdd: () => void }) => {
	const { rnd, onAdd } = props;

	if (!rnd) {
		return null;
	}

	return <ParagraphButton inkType={ButtonType.PRIMARY} title='Add new paragraph' onClick={onAdd}>
		<FontAwesomeIcon icon={faParagraph}/>
	</ParagraphButton>;
};
