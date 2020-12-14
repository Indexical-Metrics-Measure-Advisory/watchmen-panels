import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment, useEffect } from 'react';
import styled from 'styled-components';
import { useForceUpdate } from '../../../common/utils';
import { LinkButton } from '../../component/console/link-button';
import { usePipelineContext } from './pipeline-context';

const Header = styled.div.attrs({
	'data-widget': 'console-pipeline-header'
})`
	display: flex;
	position: sticky;
	grid-column: span 2;
	height: var(--console-space-header-height);
	&:after {
		content: '';
		display: block;
		position: absolute;
		z-index: 1;
		bottom: 0;
		width: 100%;
		height: 1px;
		background-color: var(--border-color);
	}
`;
const Slice = styled.div`
	display: flex;
	position: relative;
	align-items: center;
	font-family: var(--console-title-font-family);
	font-size: 1.6em;
	padding: 0 calc(var(--margin) / 3);
	margin-right: calc(var(--margin) / 3);
	&:first-child {
		padding-left: calc(var(--margin) / 2);
	}
	&:before,
	&:after {
		content: '';
		display: block;
		position: absolute;
		top: -2px;
		height: calc(var(--console-space-header-height) + 3px);
		border-right: 0;
		border-top: calc(var(--console-space-header-height) / 2 + 1.5px) solid transparent;
		border-bottom: calc(var(--console-space-header-height) / 2 + 1.5px) solid transparent;
		border-left: 10px solid var(--border-color);
	}
	&:before {
		right: -10px;
	}
	&:after {
		right: -9px;
		border-left-color: var(--bg-color);
	}
	> span {
		font-variant: petite-caps;
	}
`;
const Placeholder = styled.div`
	flex-grow: 1;
`;
const Buttons = styled.div`
	display: flex;
	align-items: center;
	padding-right: calc(var(--margin) / 2);
	> button {
		font-size: 1.4em;
		padding: 8px;
	}
`;

const MenuToggleButton = () => {
	const {
		store: { menuVisible },
		changeMenuVisible, addMenuVisibilityListener, removeMenuVisibilityListener
	} = usePipelineContext();
	const forceUpdate = useForceUpdate();
	useEffect(() => {
		addMenuVisibilityListener(forceUpdate);
		return () => {
			removeMenuVisibilityListener(forceUpdate);
		};
	});

	const onMenuClicked = () => {
		changeMenuVisible(!menuVisible);
	};

	return <LinkButton ignoreHorizontalPadding={true} onClick={onMenuClicked}>
		<FontAwesomeIcon icon={faBars}/>
	</LinkButton>;
};

export const PipelineHeader = () => {
	const {
		store: { topics, topic, selectedTopic, selectedPipeline },
		addFlowChangedListener, removeFlowChangedListener,
		addTopicSelectionChangedListener, removeTopicSelectionChangedListener,
		addPipelineSelectionChangedListener, removePipelineSelectionChangedListener
	} = usePipelineContext();
	const forceUpdate = useForceUpdate();
	useEffect(() => {
		const render = () => setTimeout(forceUpdate, 1);
		addFlowChangedListener(render);
		addTopicSelectionChangedListener(render);
		addPipelineSelectionChangedListener(render);
		return () => {
			removeFlowChangedListener(render);
			removeTopicSelectionChangedListener(render);
			removePipelineSelectionChangedListener(render);
		};
	});

	const asDirection = () => {
		if (!selectedPipeline) {
			return '';
		} else if (selectedPipeline.topicId === selectedTopic?.topicId) {
			return 'From ';
		} else {
			return 'To ';
		}
	};
	const buildTopicSlice = () => {
		if (!topic) {
			return null;
		} else if (topic === selectedTopic) {
			return <Slice>{`${asDirection()} ${topic.name}`.trim()}</Slice>;
		} else {
			return <Slice>Through {topic.name}</Slice>;
		}
	};
	const buildSelectedTopicSlice = () => {
		if (!selectedTopic) {
			return null;
		} else if (selectedTopic === topic) {
			return null;
		} else {
			const direction = asDirection();
			if (direction === 'To ') {
				// eslint-disable-next-line
				const fromTopic = topics.find(topic => topic.topicId == selectedPipeline?.topicId)!;
				return <Fragment>
					<Slice>From {`${fromTopic.name}`.trim()}</Slice>
					<Slice>To {`${selectedTopic.name}`.trim()}</Slice>
				</Fragment>;
			} else {
				return <Slice>From {`${selectedTopic.name}`.trim()}</Slice>;
			}
		}
	};
	const buildPipelineSlice = () => {
		if (selectedPipeline) {
			return <Slice>{selectedPipeline.name || 'Untitled Pipeline'}</Slice>;
		} else {
			return null;
		}
	};

	return <Header>
		<Slice>Pipelines</Slice>
		{buildTopicSlice()}
		{buildSelectedTopicSlice()}
		{buildPipelineSlice()}
		<Placeholder/>
		<Buttons>
			<MenuToggleButton/>
		</Buttons>
	</Header>;
};