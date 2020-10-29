import { faPrint } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components';
import Button, { ButtonType } from '../../component/button';

const PrintButton = styled(Button).attrs({
	'data-widget': 'chart-print-pdf-btn'
})`
	display: block;
	position: fixed;
	font-size: 32px;
	line-height: 64px;
	width: 64px;
	right: 32px;
	top: 240px;
	z-index: 10000;
	padding: 0;
	border: 0;
	border-radius: 100%;
`;

export const PrintPdfButton = (props: {
	rnd: boolean,
	onPrint: () => void
}) => {
	const { rnd, onPrint } = props;

	if (!rnd) {
		return null;
	}

	return <PrintButton inkType={ButtonType.PRIMARY} title='Print as PDF' onClick={onPrint}>
		<FontAwesomeIcon icon={faPrint}/>
	</PrintButton>;
};
