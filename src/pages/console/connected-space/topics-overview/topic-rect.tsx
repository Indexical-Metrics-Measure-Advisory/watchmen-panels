import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { ConsoleTopic } from '../../../../services/console/types';
import { PaletteEvent, usePalette } from './palette-context';
import { findSvgRoot } from './utils';

interface Coordinate {
	x: number;
	y: number;
}

interface Frame {
	width: number;
	height: number;
}

interface Name {
	x: number;
	y: number;
}

interface Paint {
	frame: Frame;
	name: Name;
}

interface Dnd {
	drag: boolean;
}

const Container = styled.g.attrs<{ coordinate: Coordinate }>(({ coordinate: { x, y } }) => {
	return {
		transform: `translate(${x}, ${y})`
	};
})<{ coordinate: Coordinate }>``;
const Rect = styled.rect.attrs<{ frame: Frame, dnd: Dnd }>(({ frame: { width, height }, dnd: { drag } }) => {
	return {
		width,
		height,
		cursor: drag ? 'move' : 'pointer'
	};
})<{ frame: Frame, dnd: Dnd }>`
	stroke: var(--console-primary-color);
	stroke-width: 2px;
	fill: var(--invert-color);
	rx: 6px;
	ry: 6px;
`;
const NameText = styled.text.attrs<{ dnd: Dnd }>(({ dnd: { drag } }) => {
	return {
		cursor: drag ? 'move' : 'pointer'
	};
})<{ dnd: Dnd }>`
	fill: var(--console-font-color);
	text-anchor: middle;
	font-family: var(--console-title-font-family);
	font-size: 1.1em;
	user-select: none;
`;

const WidthMin = 150;
const PaddingVertical = 8;
const FullPaddingVertical = PaddingVertical * 2;
const PaddingHorizontal = 16;
const FullPaddingHorizontal = PaddingHorizontal * 2;
const TitleOffsetY = 6.2;

const createDefaultPaintState = () => {
	return {
		frame: { width: 100, height: 50 },
		name: { x: 50, y: 25 }
	};
};
const createDefaultDndState = () => ({ drag: false });
const computeFrameSize = (name: DOMRect) => {
	return { width: Math.max(name.width + FullPaddingHorizontal, WidthMin), height: name.height + FullPaddingVertical };
};
const computeNamePosition = (frame: Frame) => {
	return { x: frame.width / 2, y: frame.height / 2 + TitleOffsetY };
};

export const TopicRect = (props: { topic: ConsoleTopic }) => {
	const { topic } = props;

	const palette = usePalette();
	const [ coordinate, setCoordinate ] = useState<Coordinate>({ x: 0, y: 0 });
	const [ paint, setPaint ] = useState<Paint>(createDefaultPaintState);
	const [ dnd, setDnd ] = useState<Dnd>(createDefaultDndState);
	const nameRef = useRef<SVGTextElement>(null);
	useEffect(() => {
		const nameRect = nameRef.current!.getBBox();
		const frame = computeFrameSize(nameRect);
		setPaint({ frame, name: computeNamePosition(frame) });
		// @ts-ignore
		palette.emit(PaletteEvent.TOPIC_INIT_PAINTED, topic);
	}, [ topic.name ]);

	const onMouseDown = (event: React.MouseEvent) => {
		if (event.button === 0) {
			const { clientX, clientY } = event;
			const [ offsetX, offsetY ] = [ clientX - coordinate.x, clientY - coordinate.y ];
			const onMove = ({ clientX: x, clientY: y }: MouseEvent) => {
				setCoordinate({ x: x - offsetX, y: y - offsetY });
			};
			const root = findSvgRoot(event.target as SVGGraphicsElement);
			const onEnd = () => {
				root.removeEventListener('mousemove', onMove);
				root.removeEventListener('mouseleave', onEnd);
				root.removeEventListener('mouseup', onEnd);
				setDnd(createDefaultDndState());
			};
			root.addEventListener('mousemove', onMove);
			root.addEventListener('mouseleave', onEnd);
			root.addEventListener('mouseup', onEnd);
			setDnd({ drag: true });
		}
	};

	return <Container onMouseDown={onMouseDown} coordinate={coordinate}
	                  data-topic-id={topic.topicId} data-topic-code={topic.code}>
		<Rect x={0} y={0} frame={paint.frame} dnd={dnd} data-role='frame'/>
		<NameText ref={nameRef} x={paint.name.x} y={paint.name.y} dnd={dnd}>{topic.name}</NameText>
	</Container>;
};