import React from 'react';
import styled from 'styled-components';
import { ConnectedConsoleSpace } from '../../../../services/console/types';

const SubjectViewContainer = styled.div.attrs({
	'data-widget': 'console-subject-view'
})``;

export const SubjectView = (props: {
	space: ConnectedConsoleSpace;
	visible: boolean;
}) => {
	const { space, visible } = props;

	if (!visible) {
		return null;
	}

	return <SubjectViewContainer></SubjectViewContainer>;
};