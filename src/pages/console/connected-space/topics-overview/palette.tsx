import React from 'react';
import styled from 'styled-components';
import { ConnectedConsoleSpace } from '../../../../services/console/types';
import { TopicRect } from './topic-rect';

const PaletteContainer = styled.div`
	flex-grow: 1;
	background-image: radial-gradient(var(--console-waive-color) 1px, transparent 0);
	background-size: 48px 48px;
`;

export const Palette = (props: { space: ConnectedConsoleSpace }) => {
	const { space } = props;
	const { topics } = space;

	return <PaletteContainer>
		<svg width={1000} height={500} viewBox='0 0 1000 500'>
			{topics.map(topic => {
				return <TopicRect topic={topic} key={topic.code}/>;
			})}
		</svg>
	</PaletteContainer>;
};
