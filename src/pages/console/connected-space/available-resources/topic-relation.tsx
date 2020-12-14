import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useForceUpdate } from '../../../../common/utils';
import { usePalette } from './palette-context';
import { Graphics, GraphicsRole, TopicGraphics, TopicRelationCurvePoints, TopicRelationGraphics } from './types';
import { computeTopicRelationPoints } from './utils';

const Curve = styled.path.attrs<{ lattice: TopicRelationCurvePoints }>(({ lattice: { drawn } }) => {
	return { d: drawn };
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
	const forceUpdate = useForceUpdate();
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
			palette.topicRelationTransformed(relationGraphics);
		};
		palette.addTopicMovedListener(repaint);
		return () => palette.removeTopicMovedListener(repaint);
	}, [ palette, relationGraphics, relation, graphics ]);

	return <g ref={gRef} data-topic-relation-id={relation.relationId} data-role={GraphicsRole.TOPIC_RELATION}>
		<Curve lattice={relationGraphics.points} data-role={GraphicsRole.TOPIC_RELATION_LINK}/>
	</g>;
};