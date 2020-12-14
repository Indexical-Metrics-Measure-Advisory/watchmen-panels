import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useForceUpdate } from '../../../../common/utils';
import { usePalette } from './palette-context';
import { Graphics, GraphicsPosition, GraphicsRole, GraphicsSize, TopicGraphics, TopicSelectionGraphics } from './types';
import { computeTopicSelection } from './utils';

const Container = styled.g.attrs<{ visible: boolean }>(({ visible }) => {
	return { style: { display: visible ? 'block' : 'none' } };
})<{ visible: boolean }>``;
const Rect = styled.rect.attrs<{ rect: GraphicsPosition & GraphicsSize }>(({ rect: { x, y, width, height } }) => {
	return { x, y, rx: 8, ry: 8, width, height };
})<{ rect: GraphicsPosition & GraphicsSize }>`
	stroke: var(--console-favorite-color);
	stroke-width: 2px;
	stroke-dasharray: 3px 3px;
	fill: transparent;
	z-index: -1;
	pointer-events: none;
`;

export const TopicSelection = (props: { graphics: Graphics, selection: TopicSelectionGraphics }) => {
	const { graphics, selection } = props;

	const palette = usePalette();
	const forceUpdate = useForceUpdate();
	useEffect(() => {
		const onSelectionChanged = () => forceUpdate();
		const onTopicMove = ({ topic: { topicId } }: TopicGraphics) => {
			// eslint-disable-next-line
			if (topicId != selection.topicId) {
				return;
			}
			selection.topicId = topicId;
			selection.visible = true;
			selection.rect = computeTopicSelection({ graphics, topicId });
			forceUpdate();
		};
		palette.addTopicSelectionChangedListener(onSelectionChanged);
		palette.addTopicMovedListener(onTopicMove);
		return () => {
			palette.removeTopicSelectionChangedListener(onSelectionChanged);
			palette.removeTopicMovedListener(onTopicMove);
		};
	}, [ palette, selection, graphics, forceUpdate ]);

	return <Container data-role={GraphicsRole.TOPIC_SELECTION} visible={selection.visible}>
		<Rect rect={selection.rect} data-topic-id={selection.topicId}/>
	</Container>;
};