import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { usePalette } from './palette-context';
import {
	Graphics,
	TopicGraphics,
	TopicRelationCurvePoints,
	TopicRelationGraphics,
	TopicSelectionGraphics
} from './types';

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
	const { sourceTopicId, targetTopicId } = relation;

	const palette = usePalette();
	const [ visible, setVisible ] = useState(false);
	useEffect(() => {
		const onSelectionChanged = ({ topicId, visible }: TopicSelectionGraphics) => {
			// eslint-disable-next-line
			if (!visible || (topicId != sourceTopicId && topicId != targetTopicId)) {
				setVisible(false);
			} else {
				setVisible(true);
			}
		};
		const onTopicMove = ({ topic: { topicId } }: TopicGraphics) => {
			// eslint-disable-next-line
			if (topicId != sourceTopicId && topicId != targetTopicId) {
				// irrelevant
				setVisible(false);
				return;
			} else {
				setVisible(true);
			}
		};
		palette.addTopicSelectionChangedListener(onSelectionChanged);
		palette.addTopicMovedListener(onTopicMove);
		return () => {
			palette.removeTopicSelectionChangedListener(onSelectionChanged);
			palette.removeTopicMovedListener(onTopicMove);
		};
	}, [ palette, graphics, sourceTopicId, targetTopicId, setVisible ]);

	return <TopicRelationAnimationDot lattice={relationGraphics.points} visible={visible}/>;
};
