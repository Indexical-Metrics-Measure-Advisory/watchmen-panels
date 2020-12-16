import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faBars, faWaveSquare } from '@fortawesome/free-solid-svg-icons';
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
`;
const Button = styled.div`
	width: 44px;
	height: 36px;
	border-radius: calc(var(--border-radius) * 2);
	overflow: hidden;
	&:not(:first-child) {
		margin-left: calc(var(--margin) / 3);
	}
	&[data-pressed=true] {
		color: var(--invert-color);
		background-color: var(--console-primary-color);
	}
	> button {
		width: 44px;
		height: 36px;
		font-size: 1.4em;
		padding: 8px;
		border-radius: calc(var(--border-radius) * 2);
	}
`;

const ToggleButton = (props: {
	onClick: () => void;
	icon: IconProp;
	pressed: boolean;
}) => {
	const { onClick, icon, pressed } = props;

	return <Button data-pressed={pressed}>
		<LinkButton ignoreHorizontalPadding={true} onClick={onClick}>
			<FontAwesomeIcon icon={icon}/>
		</LinkButton>
	</Button>;
};

const CanvasToggleButton = () => {
	const {
		store: { canvasVisible },
		changeCanvasVisible,
		addCanvasVisibilityListener,
		removeCanvasVisibilityListener
	} = usePipelineContext();

	const forceUpdate = useForceUpdate();
	useEffect(() => {
		addCanvasVisibilityListener(forceUpdate);
		return () => removeCanvasVisibilityListener(forceUpdate);
	});
	const onMenuClicked = () => changeCanvasVisible(!canvasVisible);

	return <ToggleButton icon={faWaveSquare} onClick={onMenuClicked} pressed={canvasVisible}/>;
};

const MenuToggleButton = () => {
	const {
		store: { menuVisible },
		changeMenuVisible, addMenuVisibilityListener, removeMenuVisibilityListener
	} = usePipelineContext();
	const forceUpdate = useForceUpdate();
	useEffect(() => {
		addMenuVisibilityListener(forceUpdate);
		return () => removeMenuVisibilityListener(forceUpdate);
	});

	const onMenuClicked = () => changeMenuVisible(!menuVisible);

	return <ToggleButton icon={faBars} onClick={onMenuClicked} pressed={menuVisible}/>;
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
			<CanvasToggleButton/>
			<MenuToggleButton/>
		</Buttons>
	</Header>;
};