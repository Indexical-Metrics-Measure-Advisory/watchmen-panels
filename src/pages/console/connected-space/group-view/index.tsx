import React from 'react';
import styled from 'styled-components';
import { ConnectedConsoleSpace } from '../../../../services/console/types';

const GroupViewContainer = styled.div.attrs({
	'data-widget': 'console-group-view'
})``;

export const GroupView = (props: {
	space: ConnectedConsoleSpace;
	visible: boolean;
}) => {
	const { visible } = props;

	if (!visible) {
		return null;
	}

	return <GroupViewContainer></GroupViewContainer>;
};