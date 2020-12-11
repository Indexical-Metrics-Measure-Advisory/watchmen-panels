import { faChevronRight, faWaveSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment, useEffect, useState } from 'react';
import styled from 'styled-components';
import { fetchPipeline } from '../../../services/admin/topic';
import { QueriedTopicForPipeline } from '../../../services/admin/types';
import { LinkButton } from '../../component/console/link-button';
import { useDialog } from '../../context/dialog';
import { TopicIcon } from './components';
import { usePipelineContext } from './pipeline-context';
import { NavigatorFactors } from './pipeline-nagivator-factor';

const TopicContainer = styled.div.attrs({
	'data-widget': 'pipeline-navigator-topic'
})`
	display: flex;
	flex-direction: column;
	font-size: 0.8em;
`;
const TopicContent = styled.div`
	display: flex;
	position: relative;
	align-items: center;
	height: 32px;
	padding: 0 calc(var(--margin) / 2);
	cursor: pointer;
	&:hover {
		background-color: var(--console-navigator-hover-color);
		> span ~ button {
			opacity: 0.8;
			pointer-events: auto;
		}
	}
	&[data-factors-visible=true] {
		&:before {
			content: '';
			display: block;
			position: absolute;
			width: 1px;
			height: 7px;
			top: 25px;
			left: calc(var(--margin) / 2 + 3px);
			background-color: var(--console-waive-color);
		}
		> svg:first-child {
			transform: rotateZ(90deg);
		}
	}
	> svg:first-child {
		margin-right: calc(var(--margin) / 4);
		color: var(--console-waive-color);
		transition: transform 300ms ease-in-out;
	}
	> div:nth-child(2) {
		margin-right: calc(var(--margin) / 4);
	}
	> span {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		flex-grow: 1;
		~ button {
			font-size: 1em;
			opacity: 0;
			pointer-events: none;
			cursor: pointer;
		}
	}
`;

export const NavigatorTopic = (props: { topic: QueriedTopicForPipeline }) => {
	const { topic } = props;

	const { show: showDialog, hide: hideDialog } = useDialog();
	const {
		store: { topic: current },
		changeFlow, addFlowChangedListener, removeFlowChangedListener
	} = usePipelineContext();
	const [ factorsVisible, setFactorsVisible ] = useState<boolean>(false);
	const [ active, setActive ] = useState(current === topic);
	useEffect(() => {
		const onFlowChanged = (pickedTopic: QueriedTopicForPipeline) => setActive(pickedTopic === topic);
		addFlowChangedListener(onFlowChanged);
		return () => removeFlowChangedListener(onFlowChanged);
	});

	const onTitleClicked = () => setFactorsVisible(!factorsVisible);
	const onShowPipelineClicked = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		event.stopPropagation();

		if (active) {
			return;
		}

		showDialog(
			<div data-widget='dialog-console-loading'>
				<span>Loading pipeline of topic <span data-widget='dialog-console-object'>{topic.name}</span>.</span>
				<span>Don't close current page, it should take a while.</span>
			</div>,
			<Fragment>
				<div style={{ flexGrow: 1 }}/>
			</Fragment>
		);
		const flow = await fetchPipeline(topic.topicId);
		hideDialog();
		changeFlow(topic, flow);
	};

	return <TopicContainer data-topic-id={topic.topicId}>
		<TopicContent data-factors-visible={factorsVisible} onClick={onTitleClicked}>
			<FontAwesomeIcon icon={faChevronRight}/>
			<TopicIcon topic={topic}/>
			<span>{topic.name}</span>
			<LinkButton ignoreHorizontalPadding={true} tooltip='Show Pipeline' right={true} offsetX={-8}
			            onClick={onShowPipelineClicked}>
				<FontAwesomeIcon icon={faWaveSquare}/>
			</LinkButton>
		</TopicContent>
		<NavigatorFactors topic={topic} visible={factorsVisible}/>
	</TopicContainer>;
};
