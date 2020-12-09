import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components';

const AL = styled.div.attrs({
	'data-widget': 'pipeline-unit-action-lead'
})`
	white-space: nowrap;
	font-weight: var(--font-demi-bold);
	height: 32px;
	line-height: 32px;
	align-self: start;
	justify-self: end;
	padding-right: calc(var(--margin) / 2);
`;

export const ActionLead = () => {
	return <AL><FontAwesomeIcon icon={faMinus}/></AL>;
};
