import React from 'react';
import styled from 'styled-components';
import { ConnectedConsoleSpace } from '../../../../services/console/types';
import { Palette } from './palette';
import { ResourcesList } from './resources-list';

const Container = styled.div`
	display: flex;
	min-height: 100%;
`;

const AvailableResourcesContent = (props: {
	space: ConnectedConsoleSpace;
}) => {
	const { space } = props;

	return <Container>
		<Palette space={space}/>
		<ResourcesList space={space}/>
	</Container>;
};

export const AvailableResources = (props: {
	visible: boolean;
	space: ConnectedConsoleSpace;
}) => {
	const { visible, ...rest } = props;

	if (!visible) {
		return null;
	}

	return <AvailableResourcesContent {...rest}/>;
};