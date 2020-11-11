import React from 'react';
import styled from 'styled-components';
import { ConnectedConsoleSpace } from '../../../../services/console/types';
import { Palette } from './palette';
import { TopicList } from './topic-list';

const Container = styled.div`
	display: flex;
	min-height: 100%;
`;

const SpaceTopicsContent = (props: {
	space: ConnectedConsoleSpace;
}) => {
	const { space } = props;

	return <Container>
		<Palette space={space}/>
		<TopicList space={space}/>
	</Container>;
};

export const TopicsOverview = (props: {
	visible: boolean;
	space: ConnectedConsoleSpace;
}) => {
	const { visible, ...rest } = props;

	if (!visible) {
		return null;
	}

	return <SpaceTopicsContent {...rest}/>;
};