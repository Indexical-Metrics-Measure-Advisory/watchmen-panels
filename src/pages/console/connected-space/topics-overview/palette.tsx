import React, { useEffect, useReducer, useRef, useState } from 'react';
import styled from 'styled-components';
import { ConnectedConsoleSpace } from '../../../../services/console/types';
import { PaletteContextProvider } from './palette-context';
import { TopicRect } from './topic-rect';
import { TopicRelation } from './topic-relation';
import { Graphics, GraphicsTopic, GraphicsTopicRelation } from './types';
import {
	computeTopicFrameSize,
	computeTopicNamePosition,
	computeTopicRelationPoints,
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
		})
	};
};
const asTopicMap = (graphics: Graphics) => {
	return graphics.topics.reduce((map, topic) => {
		map.set(topic.topic.topicId, topic);
		return map;
	}, new Map<string, GraphicsTopic>());
};
const asTopicRelationMap = (graphics: Graphics) => {
	return graphics.topicRelations.reduce((map, relation) => {
		map.set(relation.relation.relationId, relation);
		return map;
	}, new Map<string, GraphicsTopicRelation>());
};
const computeGraphics = (options: {
	graphics: Graphics;
	repaint: () => void;
	svg: SVGSVGElement;
}) => {
	const { graphics, repaint, svg } = options;

	const topicMap: Map<string, GraphicsTopic> = asTopicMap(graphics);
	Array.from(svg.querySelectorAll('g[data-role=topic]')).forEach(topicRect => {
		const topicId = topicRect.getAttribute('data-topic-id')!;
		// const frame = topicRect.querySelector('rect[data-role="topic-frame"]')! as SVGRectElement;
		const name = topicRect.querySelector('text[data-role="topic-name"]')! as SVGTextElement;
		const nameRect = name.getBBox();
		const rect = topicMap.get(topicId)!.rect;
		rect.frame = { ...rect.frame, ...computeTopicFrameSize(nameRect) };
		rect.name = computeTopicNamePosition(rect.frame);
	});
	graphics.topicRelations.forEach(relation => {
		const { relation: { sourceTopicId, targetTopicId } } = relation;
		relation.points = computeTopicRelationPoints({ graphics, sourceTopicId, targetTopicId });
	});
	repaint();
};

export const Palette = (props: { space: ConnectedConsoleSpace }) => {
	const { space } = props;
	const { topics, topicRelations = [] } = space;

	const containerRef = useRef<HTMLDivElement>(null);
	const svgRef = useRef<SVGSVGElement>(null);
	const [ , forceUpdate ] = useReducer(x => x + 1, 0);
	const [ svgSize, setSvgSize ] = useState<{ width: number, height: number }>({ width: 300, height: 300 });
	const [ graphics ] = useState<Graphics>(createInitGraphics(space));
	useEffect(() => {
		const ref = containerRef.current;
		const svg = svgRef.current;
		if (ref && svg) {
			const resize = () => setSvgSize({ width: ref.clientWidth, height: ref.clientHeight });
			// @ts-ignore
			const resizeObserver = new ResizeObserver(resize);
			resizeObserver.observe(ref);
			resize();
			computeGraphics({ graphics, repaint: forceUpdate, svg });
			return () => resizeObserver.disconnect();
		}
		// eslint-disable-next-line
	}, []);

	const topicMap: Map<string, GraphicsTopic> = asTopicMap(graphics);
	const topicRelationMap: Map<string, GraphicsTopicRelation> = asTopicRelationMap(graphics);

	return <PaletteContainer ref={containerRef}>
		<PaletteContextProvider>
			<PaletteSvg width={svgSize.width} height={svgSize.height}
			            viewBox={`0 0 ${svgSize.width} ${svgSize.height}`}
			            ref={svgRef}>
				{topics.map(topic => {
					const topicGraphics = topicMap.get(topic.topicId)!;
					return <TopicRect topic={topicGraphics} key={topic.code}/>;
				})}
				{topicRelations.map(relation => {
					const relationGraphics = topicRelationMap.get(relation.relationId)!;
					return <TopicRelation graphics={graphics} relation={relationGraphics} key={relation.relationId}/>;
				})}
			</PaletteSvg>
		</PaletteContextProvider>
	</PaletteContainer>;
};
