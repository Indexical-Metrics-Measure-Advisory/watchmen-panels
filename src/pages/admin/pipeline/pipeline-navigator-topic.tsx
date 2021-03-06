import { faChevronRight, faWaveSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment, useEffect, useState } from 'react';
import styled from 'styled-components';
import { fetchPipeline } from '../../../services/admin/topic';
import { QueriedFactorForPipeline, QueriedTopicForPipeline } from '../../../services/admin/types';
import { LinkButton } from '../../component/console/link-button';
import { useDialog } from '../../context/dialog';
import { TopicIcon } from './components';
import { usePipelineContext } from './pipeline-context';
import { NavigatorFactors } from './pipeline-nagivator-factor';
import { PipelineNavigatorNodeLabel } from './pipeline-navigator-node-label';

const TopicContainer = styled.div.attrs({
	'data-widget': 'pipeline-navigator-topic'
})`
	display: flex;
	flex-direction: column;
	font-size: 0.8em;
	&[data-visible=false] {
		display: none;
	}
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
		> button:last-child {
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
	> button:last-child {
		font-size: 1em;
		opacity: 0;
		pointer-events: none;
		cursor: pointer;
	}
`;

export const NavigatorTopic = (props: { topic: QueriedTopicForPipeline }) => {
	const { topic } = props;

	const { show: showDialog, hide: hideDialog } = useDialog();
	const {
		store: { topic: current },
		changeFlow, addFlowChangedListener, removeFlowChangedListener,
		addCollapseAllTopicsListener, removeCollapseAllTopicsListener,
		addTopicFilterChangedListener, removeTopicFilterChangedListener
	} = usePipelineContext();
	const [ factorsVisible, setFactorsVisible ] = useState<boolean>(false);
	const [ active, setActive ] = useState(current === topic);
	const [ filterText, setFilterText ] = useState('');
	useEffect(() => {
		const onFlowChanged = (pickedTopic: QueriedTopicForPipeline) => setActive(pickedTopic === topic);
		const onCollapseAllTopics = () => setFactorsVisible(false);
		const onFilterTextChange = (filterText: string) => setFilterText(filterText);
		addFlowChangedListener(onFlowChanged);
		addCollapseAllTopicsListener(onCollapseAllTopics);
		addTopicFilterChangedListener(onFilterTextChange);
		return () => {
			removeFlowChangedListener(onFlowChanged);
			removeCollapseAllTopicsListener(onCollapseAllTopics);
			removeTopicFilterChangedListener(onFilterTextChange);
		};
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

	let topicVisible = false;
	let visibleFactors: Array<QueriedFactorForPipeline> = [];
	if (filterText) {
		if (topic.name.toLowerCase().includes(filterText)) {
			// topic contains filter text
			topicVisible = true;
		} else {
			visibleFactors = topic.factors.filter(factor => factor.name.toLowerCase().includes(filterText));
			if (visibleFactors.length !== 0) {
				topicVisible = true;
			}
		}
	} else {
		topicVisible = true;
	}

	return <TopicContainer data-topic-id={topic.topicId} data-visible={topicVisible}>
		<TopicContent data-factors-visible={factorsVisible} onClick={onTitleClicked}>
			<FontAwesomeIcon icon={faChevronRight}/>
			<TopicIcon topic={topic}/>
			<PipelineNavigatorNodeLabel name={topic.name} filter={filterText}/>
			<LinkButton ignoreHorizontalPadding={true} tooltip='Show Pipeline' right={true} offsetX={-8}
			            onClick={onShowPipelineClicked}>
				<FontAwesomeIcon icon={faWaveSquare}/>
			</LinkButton>
		</TopicContent>
		<NavigatorFactors topic={topic} visible={factorsVisible} visibleFactors={visibleFactors}
		                  filterText={filterText}/>
	</TopicContainer>;
};
