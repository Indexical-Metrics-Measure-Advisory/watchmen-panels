import { faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components';
import Button, { ButtonType } from '../../component/button';

const QuitButton = styled(Button).attrs({
	'data-widget': 'chart-quit-export-btn'
})`
	display: block;
	position: fixed;
	font-size: 32px;
	line-height: 64px;
	width: 64px;
	right: 32px;
	top: 314px;
	z-index: 10000;
	padding: 0;
	border: 0;
	border-radius: 100%;
`;

export const QuitExportButton = (props: {
	rnd: boolean,
	onClick: () => void
}) => {
	const { rnd, onClick } = props;

	if (!rnd) {
		return null;
	}

	return <QuitButton inkType={ButtonType.PRIMARY} title='Quit Export' onClick={onClick}>
		<FontAwesomeIcon icon={faDoorOpen}/>
	</QuitButton>;
};
