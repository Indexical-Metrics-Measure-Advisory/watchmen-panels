import React, { useEffect, useReducer, useRef } from 'react';
import styled from 'styled-components';
import { usePalette } from './palette-context';
import { Graphics, GraphicsRole, TopicGraphics, TopicRelationCurvePoints, TopicRelationGraphics } from './types';
import { computeTopicRelationPoints } from './utils';


const Curve = styled.path.attrs<{ lattice: TopicRelationCurvePoints }>((
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
})<{ lattice: TopicRelationCurvePoints }>`
	stroke: var(--console-primary-color);
	stroke-width: 2px;
	fill: transparent;
`;

export const TopicRelation = (props: {
	graphics: Graphics;
	relation: TopicRelationGraphics;
}) => {
	const { graphics, relation: relationGraphics } = props;
	const { relation } = relationGraphics;

	const palette = usePalette();
	const gRef = useRef<SVGGElement>(null);
	const [ , forceUpdate ] = useReducer(x => x + 1, 0);
	useEffect(() => {
		const repaint = ({ topic }: TopicGraphics) => {
			const { sourceTopicId, targetTopicId } = relation;
			// eslint-disable-next-line
			if (topic.topicId != sourceTopicId && topic.topicId != targetTopicId) {
				// irrelevant
				return;
			}
			relationGraphics.points = computeTopicRelationPoints({ graphics, sourceTopicId, targetTopicId });
			forceUpdate();
		};
		palette.addTopicMovedListener(repaint);
		return () => palette.removeTopicMovedListener(repaint);
	}, [ palette, relationGraphics ]);

	return <g ref={gRef} data-topic-relation-id={relation.relationId} data-role={GraphicsRole.TOPIC_RELATION}>
		<Curve lattice={relationGraphics.points} data-role={GraphicsRole.TOPIC_RELATION_LINK}/>
	</g>;
};