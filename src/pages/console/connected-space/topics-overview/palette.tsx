import React, { useEffect, useReducer, useRef, useState } from 'react';
import styled from 'styled-components';
import { ConnectedConsoleSpace } from '../../../../services/console/types';
import { PaletteContextProvider, usePalette } from './palette-context';
import { TopicRect } from './topic-rect';
import { TopicRelation } from './topic-relation';
import { TopicSelection } from './topic-selection';
import { Graphics, GraphicsRole, GraphicsSize, TopicGraphics, TopicRelationGraphics } from './types';
import {
	computeTopicFrameSize,
	computeTopicNamePosition,
	computeTopicRelationPoints,
	computeTopicSelection,
	TopicHeightMin,
	TopicWidthMin
} from './utils';

const PaletteContainer = styled.div`
	position: relative;
	flex-grow: 1;
	background-image: radial-gradient(var(--console-waive-color) 1px, transparent 0);
	background-size: 48px 48px;
	overflow: hidden;
`;
const PaletteSvg = styled.svg`
	display: block;
	position: absolute;
	top: 0;
	left: 0;
`;

const createInitGraphics = (space: ConnectedConsoleSpace): Graphics => {
	const { topics, topicRelations = [] } = space;
	return {
		topics: topics.map(topic => {
			return {
				topic,
				rect: {
					coordinate: { x: 0, y: 0 },
					frame: { x: 0, y: 0, width: TopicWidthMin, height: TopicHeightMin },
					name: { x: TopicWidthMin / 2, y: TopicHeightMin / 2 }
				}
			};
		}),
		topicRelations: topicRelations.map(relation => {
			return {
				relation,
				points: {
					startX: 0,
					startY: 0,
					firstControlX: 0,
					firstControlY: 0,
					secondControlX: 0,
					secondControlY: 0,
					centerX: 0,
					centerY: 0,
					thirdControlX: 0,
					thirdControlY: 0,
					endX: 0,
					endY: 0
				}
			};
		}),
		topicSelection: {
			visible: false,
			rect: { x: 0, y: 0, width: 0, height: 0 }
		}
	};
};
const asTopicMap = (graphics: Graphics) => {
	return graphics.topics.reduce((map, topic) => {
		map.set(topic.topic.topicId, topic);
		return map;
	}, new Map<string, TopicGraphics>());
};
const asTopicRelationMap = (graphics: Graphics) => {
	return graphics.topicRelations.reduce((map, relation) => {
		map.set(relation.relation.relationId, relation);
		return map;
	}, new Map<string, TopicRelationGraphics>());
};
const computeGraphics = (options: {
	graphics: Graphics;
	repaint: () => void;
	svg: SVGSVGElement;
}) => {
	const { graphics, repaint, svg } = options;

	const topicMap: Map<string, TopicGraphics> = asTopicMap(graphics);
	Array.from(svg.querySelectorAll(`g[data-role=${GraphicsRole.TOPIC}]`)).forEach(topicRect => {
		const topicId = topicRect.getAttribute('data-topic-id')!;
		const name = topicRect.querySelector(`text[data-role='${GraphicsRole.TOPIC_NAME}']`)! as SVGTextElement;
		const nameRect = name.getBBox();
		const rect = topicMap.get(topicId)!.rect;
		rect.frame = { ...rect.frame, ...computeTopicFrameSize(nameRect) };
		rect.name = computeTopicNamePosition(rect.frame);
	});
	// TODO compute topic positions in palette
	graphics.topicRelations.forEach(relation => {
		const { relation: { sourceTopicId, targetTopicId } } = relation;
		relation.points = computeTopicRelationPoints({ graphics, sourceTopicId, targetTopicId });
	});
	repaint();
};

const SvgPalette = (props: { space: ConnectedConsoleSpace }) => {
	const { space } = props;
	const { topics, topicRelations = [] } = space;

	const palette = usePalette();
	const svgRef = useRef<SVGSVGElement>(null);
	const [ , forceUpdate ] = useReducer(x => x + 1, 0);
	const [ svgSize, setSvgSize ] = useState<GraphicsSize>({ width: 300, height: 300 });
	const [ graphics ] = useState<Graphics>(createInitGraphics(space));
	useEffect(() => {
		const svg = svgRef.current;
		if (svg) {
			const container = svg.parentElement! as HTMLDivElement;
			const resize = () => setSvgSize({ width: container.clientWidth, height: container.clientHeight });
			// @ts-ignore
			const resizeObserver = new ResizeObserver(resize);
			resizeObserver.observe(container);
			resize();
			computeGraphics({ graphics, repaint: forceUpdate, svg });
			return () => resizeObserver.disconnect();
		}
		// eslint-disable-next-line
	}, []);

	const topicMap: Map<string, TopicGraphics> = asTopicMap(graphics);
	const topicRelationMap: Map<string, TopicRelationGraphics> = asTopicRelationMap(graphics);

	const clearSelection = () => {
		delete graphics.topicSelection.topicId;
		graphics.topicSelection.visible = false;
		palette.topicSelectionChanged(graphics.topicSelection);
	};
	const onSvgMouseDown = (event: React.MouseEvent) => {
		const { button, target } = event;
		if (button === 2 || button === 1) {
			return;
		}

		const element = target as SVGGraphicsElement;
		const tagName = element.tagName.toUpperCase();
		if (tagName === 'SVG') {
			clearSelection();
			return;
		}

		const role = element.getAttribute('data-role') || '';
		switch (role) {
			case GraphicsRole.TOPIC_FRAME:
			case GraphicsRole.TOPIC_NAME:
				const topicRect = element.parentElement! as unknown as SVGGElement;
				const topicId = topicRect.getAttribute('data-topic-id')!;
				graphics.topicSelection.topicId = topicId;
				graphics.topicSelection.visible = true;
				graphics.topicSelection.rect = computeTopicSelection({ graphics, topicId });
				palette.topicSelectionChanged(graphics.topicSelection);
				break;
			default:
				clearSelection();
				break;
		}
	};

	return <PaletteSvg width={svgSize.width} height={svgSize.height}
	                   viewBox={`0 0 ${svgSize.width} ${svgSize.height}`}
	                   onMouseDown={onSvgMouseDown}
	                   ref={svgRef}>
		{topics.map(topic => {
			const topicGraphics = topicMap.get(topic.topicId)!;
			return <TopicRect topic={topicGraphics} key={topic.code}/>;
		})}
		{topicRelations.map(relation => {
			const relationGraphics = topicRelationMap.get(relation.relationId)!;
			return <TopicRelation graphics={graphics} relation={relationGraphics} key={relation.relationId}/>;
		})}
		<TopicSelection graphics={graphics} selection={graphics.topicSelection}/>
	</PaletteSvg>;
};

export const Palette = (props: { space: ConnectedConsoleSpace }) => {
	const { space } = props;

	return <PaletteContainer>
		<PaletteContextProvider>
			<SvgPalette space={space}/>
		</PaletteContextProvider>
	</PaletteContainer>;
};
