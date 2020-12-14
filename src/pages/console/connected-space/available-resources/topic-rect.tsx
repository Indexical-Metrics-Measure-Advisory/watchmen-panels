import React, { useState } from 'react';
import styled from 'styled-components';
import { useForceUpdate } from '../../../../common/utils';
import { usePalette } from './palette-context';
import { GraphicsRole, TopicCoordinate, TopicFrame, TopicGraphics, TopicName } from './types';
import { findSvgRoot } from './utils';

const Container = styled.g.attrs<{ coordinate: TopicCoordinate }>(({ coordinate: { x, y } }) => {
	return { transform: `translate(${x}, ${y})` };
})<{ coordinate: TopicCoordinate }>``;
const Rect = styled.rect.attrs<{ frame: TopicFrame, dnd: boolean }>(({ frame: { x, y, width, height }, dnd }) => {
	return { x, y, width, height, rx: 6, ry: 6, cursor: dnd ? 'move' : 'pointer' };
})<{ frame: TopicFrame, dnd: boolean }>`
	stroke: var(--console-primary-color);
	stroke-width: 2px;
	fill: var(--invert-color);
`;
const NameText = styled.text.attrs<{ dnd: boolean, pos: TopicName }>(({ dnd, pos: { x, y } }) => {
	return { x, y, cursor: dnd ? 'move' : 'pointer' };
})<{ dnd: boolean, pos: TopicName }>`
	fill: var(--console-font-color);
	text-anchor: middle;
	font-family: var(--console-title-font-family);
	font-size: 1.1em;
	user-select: none;
`;

export const TopicRect = (props: { topic: TopicGraphics }) => {
	const { topic: topicGraphics } = props;
	const { topic, rect } = topicGraphics;
	const { coordinate, frame: frameRect, name: namePos } = rect;

	const palette = usePalette();
	const forceUpdate = useForceUpdate();
	const [ dnd, setDnd ] = useState<boolean>(false);

	const onMouseDown = (event: React.MouseEvent) => {
		if (event.button === 0) {
			const { clientX, clientY } = event;
			const [ offsetX, offsetY ] = [ clientX - coordinate.x, clientY - coordinate.y ];
			const onMove = ({ clientX: x, clientY: y }: MouseEvent) => {
				rect.coordinate = { x: x - offsetX, y: y - offsetY };
				forceUpdate();
				palette.topicMoved(topicGraphics);
			};
			const root = findSvgRoot(event.target as SVGGraphicsElement);
			const onEnd = () => {
				root.removeEventListener('mousemove', onMove);
				root.removeEventListener('mouseleave', onEnd);
				root.removeEventListener('mouseup', onEnd);
				setDnd(false);
			};
			root.addEventListener('mousemove', onMove);
			root.addEventListener('mouseleave', onEnd);
			root.addEventListener('mouseup', onEnd);
			setDnd(true);
		}
	};

	return <Container onMouseDown={onMouseDown} coordinate={coordinate}
	                  data-topic-id={topic.topicId} data-topic-code={topic.code}
	                  data-role={GraphicsRole.TOPIC}>
		<Rect frame={frameRect} dnd={dnd}
		      data-topic-id={topic.topicId} data-topic-code={topic.code}
		      data-role={GraphicsRole.TOPIC_FRAME}/>
		<NameText pos={namePos} dnd={dnd} data-role={GraphicsRole.TOPIC_NAME}>{topic.name}</NameText>
	</Container>;
};