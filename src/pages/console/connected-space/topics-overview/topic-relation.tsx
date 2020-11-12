import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { ConnectedConsoleSpace, ConsoleTopicRelationship } from '../../../../services/console/types';
import { findSvgRoot } from './utils';

interface CurvePoints {
	startX: number;
	startY: number;
	firstControlX: number;
	firstControlY: number;
	secondControlX: number;
	secondControlY: number;
	centerX: number;
	centerY: number;
	thirdControlX: number;
	thirdControlY: number;
	endX: number;
	endY: number;
}

const Curve = styled.path.attrs<{ lattice: CurvePoints }>((
	{
		lattice: {
			startX, startY, firstControlX, firstControlY, secondControlX, secondControlY,
			centerX, centerY, thirdControlX, thirdControlY, endX, endY
		}
	}
) => {
	return {
		d: `M ${startX} ${startY} C ${firstControlX} ${firstControlY}, ${secondControlX} ${secondControlY}, ${centerX} ${centerY} S ${thirdControlX} ${thirdControlY}, ${endX} ${endY}`
	};
})<{ lattice: CurvePoints }>`
	stroke: var(--console-primary-color);
	stroke-width: 2px;
	fill: transparent;
`;

const findTopicG = (svg: SVGElement, topicId: string) => {
	return svg.querySelector(`g[data-topic-id='${topicId}']`)! as SVGGraphicsElement;
};
const findTopicFrame = (g: SVGGElement) => {
	return g.querySelector('rect[data-role=frame]')! as SVGRectElement;
};

const createDefaultCurvePoints = () => {
	return {
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
	};
};
const computePoints = (topic: SVGGElement, frame: SVGRectElement) => {
	const topicBBox = topic.getBBox();
	const frameBBox = frame.getBBox();
	return {
		top: { x: topicBBox.x + frameBBox.x + frameBBox.width / 2, y: topicBBox.y + frameBBox.y },
		right: { x: topicBBox.x + frameBBox.x + frameBBox.width, y: topicBBox.y + frameBBox.y + frameBBox.height / 2 },
		bottom: { x: topicBBox.x + frameBBox.x + frameBBox.width / 2, y: topicBBox.y + frameBBox.y + frameBBox.height },
		left: { x: topicBBox.x + frameBBox.x, y: topicBBox.y + frameBBox.y + frameBBox.height / 2 }
	};
};

const repaint = (options: {
	ref?: SVGGElement;
	sourceTopicId: string;
	targetTopicId: string;
	paint: (lattice: CurvePoints) => void;
}) => {
	const { ref, sourceTopicId, targetTopicId, paint } = options;

	if (!ref) {
		return;
	}

	// to find the start and end point position
	const svg = findSvgRoot(ref);
	const sourceTopic = findTopicG(svg, sourceTopicId);
	const sourceFrame = findTopicFrame(sourceTopic);
	const sourcePoints = computePoints(sourceTopic, sourceFrame);
	const targetTopic = findTopicG(svg, targetTopicId);
	const targetFrame = findTopicFrame(targetTopic);
	const targetPoints = computePoints(targetTopic, targetFrame);

	const [ startX, startY ] = [ sourcePoints.right.x, sourcePoints.right.y ];
	const [ endX, endY ] = [ targetPoints.left.x, targetPoints.right.y ];
	const [ centerX, centerY ] = [ (startX + endX) / 2, (startY + endY) / 2 ];
	const [ firstControlX, firstControlY ] = [ startX + (centerX - startX) / 4, startY + (centerY - startY) / 4 ];
	const [ secondControlX, secondControlY ] = [ startX + (centerX - startX) / 4 * 3, startY + (centerY - startY) / 4 ];
	const [ thirdControlX, thirdControlY ] = [ centerX + (endX - centerX) / 4 * 3, centerY + (endY - centerY) / 4 ];

	paint({
		startX, startY,
		firstControlX, firstControlY,
		secondControlX, secondControlY,
		centerX, centerY,
		thirdControlX, thirdControlY,
		endX, endY
	});
};

export const TopicRelation = (props: { space: ConnectedConsoleSpace, relation: ConsoleTopicRelationship }) => {
	const { space: { topics }, relation } = props;

	const { sourceTopicId, targetTopicId } = relation;

	const [ lattice, setLattice ] = useState<CurvePoints>(createDefaultCurvePoints);
	const gRef = useRef<SVGGElement>(null);

	return <g ref={gRef}>
		<Curve lattice={lattice}/>
	</g>;
};