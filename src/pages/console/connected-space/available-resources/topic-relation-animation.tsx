import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useForceUpdate } from '../../../../common/utils';
import { usePalette } from './palette-context';
import { Graphics, TopicRelationCurvePoints, TopicRelationGraphics, TopicSelectionGraphics } from './types';

const TopicRelationAnimationFrames = keyframes`
	from {
        offset-distance: 0;
    }

    to {
        offset-distance: 100%;
    }
`;
const TopicRelationAnimationDot = styled.div.attrs<{ lattice: TopicRelationCurvePoints, visible: boolean }>(({ lattice: { drawn }, visible }) => {
	return {
		style: {
			display: visible ? 'block' : 'none',
			offsetPath: `path("${drawn}")`
		}
	};
})<{ lattice: TopicRelationCurvePoints, visible: boolean }>`
	position: absolute;
	top: 0;
	left: 0;
	width: 8px;
	height: 8px;
	background-color: var(--console-favorite-color);
	border-radius: 100%;
	offset-distance: 0;
	animation: ${TopicRelationAnimationFrames} 2s ease-in-out 0s infinite normal none;
`;

export const TopicRelationAnimation = (props: {
	graphics: Graphics;
	relation: TopicRelationGraphics;
}) => {
	const { graphics, relation: relationGraphics } = props;
	const { relation } = relationGraphics;

	const palette = usePalette();
	const forceUpdate = useForceUpdate();
	const [ visible, setVisible ] = useState(false);
	useEffect(() => {
		const onSelectionChanged = ({ topicId, visible }: TopicSelectionGraphics) => {
			// eslint-disable-next-line
			if (!visible || (topicId != relation.sourceTopicId && topicId != relation.targetTopicId)) {
				setVisible(false);
			} else {
				setVisible(true);
			}
		};
		const onTopicRelationTransformed = ({ relation: { relationId } }: TopicRelationGraphics) => {
			// eslint-disable-next-line
			if (relationId == relation.relationId) {
				forceUpdate();
			}
		};
		palette.addTopicSelectionChangedListener(onSelectionChanged);
		palette.addTopicRelationTransformedListener(onTopicRelationTransformed);
		return () => {
			palette.removeTopicSelectionChangedListener(onSelectionChanged);
			palette.removeTopicRelationTransformedListener(onTopicRelationTransformed);
		};
	}, [ palette, graphics, relation ]);

	return <TopicRelationAnimationDot lattice={relationGraphics.points} visible={visible}/>;
};
