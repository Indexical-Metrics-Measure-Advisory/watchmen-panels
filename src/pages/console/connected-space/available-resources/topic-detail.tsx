import { faLink, faSoap, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { ConsoleSpace, ConsoleTopic, ConsoleTopicFactor } from '../../../../services/console/types';
import { UserAvatar } from '../../component/user-avatar';
import { TooltipAlignment, useTooltip } from '../../context/console-tooltip';
import { usePalette } from './palette-context';
import { TopicSelectionGraphics } from './types';

const TopicDetailContainer = styled.div`
	display: block;
	position: absolute;
	right: 0;
	bottom: 0;
	padding-right: calc(var(--margin) / 2);
	padding-bottom: calc(var(--margin) / 2);
	overflow: hidden;
	transition: all 300ms ease-in-out;
	&[data-visible=false] {
		width: 96px;
		height: 96px;
		> div:last-child {
			margin-top: 80px;
			margin-left: 80px;
			height: 0;
			width: 0;
			padding: 0;
			opacity: 0;
			pointer-events: none;
		}
	}
	&[data-visible=true] {
		height: calc(var(--margin) + 420px);
		width: calc(var(--margin) + 320px);
		padding-top: calc(var(--margin) / 2);
		padding-left: calc(var(--margin) / 2);
		> div:first-child {
			height: 420px;
			width: 320px;
			opacity: 0;
			pointer-events: none;
			border-radius: 0;
			border-color: var(--console-primary-color);
		}
		> div:last-child {
			border-color: var(--console-primary-color);
		}
	}
`;
const TopicDetailTriggerButton = styled.div`
	display: flex;
	position: absolute;
	align-items: center;
	justify-content: center;
	right: calc(var(--margin) / 2);
	bottom: calc(var(--margin) / 2);
	background-color: var(--console-favorite-color);
	color: var(--invert-color);
	width: 64px;
	height: 64px;
	border-radius: 100%;
	border-style: solid;
	border-color: var(--console-favorite-color);
	border-width: 2px;
	font-size: 2em;
	cursor: pointer;
	transition: all 300ms ease-in-out;
	&:hover {
		box-shadow: var(--console-hover-shadow);
	}
`;
const FactorList = styled.div`
	display: flex;
	flex-direction: column;
	height: 420px;
	width: 320px;
	border-radius: calc(var(--border-radius) * 2);
	border-style: solid;
	border-color: var(--console-favorite-color);
	border-width: 2px;
	box-shadow: var(--console-shadow);
	background-color: var(--invert-color);
	opacity: 0.95;
	transition: all 300ms ease-in-out;
`;
const TopicHeader = styled.div`
	display: flex;
	height: 40px;
	align-items: center;
	justify-content: space-between;
	padding: 0 calc(var(--margin) / 2);
	border-bottom: var(--border);
	border-color: var(--console-primary-color);
	> div:first-child {
		font-family: var(--console-title-font-family);
	}
	> svg {
		cursor: pointer;
		&:hover {
			color: var(--console-primary-color);
		}
	}
`;
const NoData = styled.div`
	padding: 0 calc(var(--margin) / 2);
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	opacity: 0.7;
`;
const TopicBody = styled.div`
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	overflow-x: hidden;
	overflow-y: auto;
	&::-webkit-scrollbar {
		background-color: transparent;
		width: 4px;
	}
	&::-webkit-scrollbar-track {
		background-color: var(--scrollbar-background-color);
		border-radius: 2px;
	}
	&::-webkit-scrollbar-thumb {
		background-color: var(--console-favorite-color);
		border-radius: 2px;
	}
`;
const TopicFactoryRow = styled.div`
	display: flex;
	align-items: center;
	height: 32px;
	padding: 0 calc(var(--margin) / 3) 0 calc(var(--margin) / 4);
	border-bottom: var(--border);
	> div:first-child {
		transform: scale(0.6);
	}
	> div:nth-child(2) {
		font-size: 0.8em;
		flex-grow: 1;
	}
	> div:nth-child(3) {
		font-size: 0.8em;
		color: var(--console-primary-color);
		cursor: pointer;
	}
`;

const TopicFactor = (props: {
	space: ConsoleSpace;
	topic: ConsoleTopic;
	factor: ConsoleTopicFactor;
}) => {
	const { space, topic, factor } = props;
	const { type, label } = factor;

	const { topicRelations } = space;
	const { topicId } = topic;

	const linkRef = useRef<HTMLDivElement>(null);
	const relations = (topicRelations || []).filter(relation => {
		// eslint-disable-next-line
		if (relation.sourceTopicId == topicId && relation.sourceFactorNames.includes(factor.name)) {
			return true;
			// eslint-disable-next-line
		} else if (relation.targetTopicId == topicId && relation.targetFactorNames.includes(factor.name)) {
			return true;
		}
		return false;
	});
	const asTooltip = () => {
		return relations.map(relation => {
			// eslint-disable-next-line
			if (relation.sourceTopicId == topicId) {
				// eslint-disable-next-line
				return space.topics.find(topic => relation.targetTopicId == topic.topicId)!.name;
				// eslint-disable-next-line
			} else if (relation.targetTopicId == topicId) {
				// eslint-disable-next-line
				return space.topics.find(topic => relation.sourceTopicId == topic.topicId)!.name;
			}
			return null;
		}).filter(x => x != null).join(', ');
	};
	const { mouseEnter, mouseLeave } = useTooltip({
		show: relations.length !== 0,
		tooltip: asTooltip(),
		ref: linkRef,
		rect: () => ({ align: TooltipAlignment.RIGHT, offsetX: -13, offsetY: 10 })
	});

	return <TopicFactoryRow>
		<UserAvatar name={type} showTooltip={true}/>
		<div>{label}</div>
		{
			relations.length !== 0
				?
				<div onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} ref={linkRef}><FontAwesomeIcon icon={faLink}/>
				</div>
				: null
		}
	</TopicFactoryRow>;
};

export const TopicDetail = (props: { space: ConsoleSpace }) => {
	const { space } = props;

	const buttonRef = useRef<HTMLDivElement>(null);
	const [ visible, setVisible ] = useState<boolean>(false);
	const [ topic, setTopic ] = useState<ConsoleTopic | null>(null);
	const palette = usePalette();
	useEffect(() => {
		const onSelectionChanged = ({ topicId, visible }: TopicSelectionGraphics) => {
			if (!visible) {
				setTopic(null);
			} else {
				// eslint-disable-next-line
				const selectedTopic = space.topics.find(topic => topic.topicId == topicId)!;
				if (selectedTopic !== topic) {
					setTopic(selectedTopic);
				}
			}
		};
		palette.addTopicSelectionChangedListener(onSelectionChanged);
		return () => {
			palette.removeTopicSelectionChangedListener(onSelectionChanged);
		};
	}, [ palette, topic, space.topics ]);

	const showDetail = () => setVisible(true);
	const hideDetail = () => setVisible(false);

	return <TopicDetailContainer data-visible={visible}>
		<TopicDetailTriggerButton ref={buttonRef} onClick={showDetail}>
			<FontAwesomeIcon icon={faSoap}/>
		</TopicDetailTriggerButton>
		<FactorList>
			<TopicHeader>
				<div>{topic?.name || 'No Selection'}</div>
				<FontAwesomeIcon icon={faTimes} onClick={hideDetail}/>
			</TopicHeader>
			<TopicBody>
				{
					topic
						? topic.factors
							.sort((f1, f2) => f1.label.localeCompare(f2.label))
							.map(factor => {
								return <TopicFactor key={factor.name} space={space} topic={topic} factor={factor}/>;
							})
						: <NoData>No Data</NoData>
				}
			</TopicBody>
		</FactorList>
	</TopicDetailContainer>;
};