import React from 'react';
import styled, { useTheme } from 'styled-components';
import { LightColors24 } from '../../../charts/color-theme';
import { QueriedFactorForPipeline, QueriedTopicForPipeline, TopicType } from '../../../services/admin/types';
import { Theme } from '../../../theme/types';

const Icon = styled.div.attrs<{ color: string }>(({ color }) => {
	return { style: { backgroundColor: color } };
})<{ color: string }>`
	display: flex;
	position: relative;
	align-items: center;
	justify-content: center;
	font-family: var(--console-title-font-family);
	font-weight: var(--console-title-font-weight);
	font-size: 0.8em;
	min-height: 20px;
	height: 20px;
	min-width: 20px;
	width: 20px;
	border-radius: 100%;
	color: var(--invert-color);
	user-select: none;
	text-transform: uppercase;
	> span:first-child {
		margin-left: -1px;
	}
`;
const TypeChar = styled.span.attrs<{ left: number }>(({ left }) => {
	return { style: { transform: `scale(0.7) translateY(-4px) translateX(${left}px)` } };
})<{ left: number }>`
	display: block;
	position: absolute;
	z-index: 0;
	right: 0;
	bottom: 0;
	transform-origin: bottom;
`;

const getTopicColor = (topic: QueriedTopicForPipeline, theme: Theme) => {
	switch (topic.type) {
		case TopicType.RAW:
			return theme.consoleRawTopicColor;
		case TopicType.RATIO:
			return theme.consoleRatioTopicColor;
		case TopicType.DISTINCT:
			return theme.consoleDistinctTopicColor;
		case TopicType.AGGREGATE:
			return theme.consoleAggregateTopicColor;
		case TopicType.TIME:
			return theme.consoleTimeTopicColor;
		case TopicType.NOT_DEFINED:
			return theme.consoleUndefinedTopicColor;
	}
};

export const TopicIcon = (props: { topic: QueriedTopicForPipeline }) => {
	const { topic } = props;

	const theme = useTheme() as Theme;
	const color = getTopicColor(topic, theme);

	return <Icon color={color}>
		<span>{(topic.type || 'u')[0]}</span>
		<TypeChar left={-3}>T</TypeChar>
	</Icon>;
};

export const FactorIcon = (props: { factor: QueriedFactorForPipeline }) => {
	const { factor } = props;

	const color = LightColors24[(factor.type || 'u').split('').reduce((x, char) => x + char.charCodeAt(0), 0) % LightColors24.length];

	return <Icon color={color}>
		<span>{(factor.type || 'u')[0]}</span>
		<TypeChar left={-4}>F</TypeChar>
	</Icon>;
};
