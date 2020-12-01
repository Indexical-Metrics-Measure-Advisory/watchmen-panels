import { faChevronRight, faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useReducer, useState } from 'react';
import styled, { keyframes, useTheme } from 'styled-components';
import { QueriedTopicForPipeline } from '../../../services/admin/types';
import { Theme } from '../../../theme/types';
import { ResizeHandle, ResizeHandleAlignment } from '../../component/console/menu/resize-handle';
import { UserAvatar } from '../../component/console/user-avatar';
import { usePipelineContext } from './pipeline-context';

const ScrollWidth = 15;
const Navigator = styled.div.attrs<{ width: number, visible: boolean }>(({ theme, width, visible }) => {
	return {
		style: {
			position: visible ? 'relative' : 'absolute',
			right: visible ? 0 : (-1 - width),
			top: visible ? 'unset' : (theme as Theme).consoleSpaceHeaderHeight,
			width,
			height: visible ? 'unset' : `calc(100% - ${(theme as Theme).consoleSpaceHeaderHeight}px)`,
			pointerEvents: visible ? 'auto' : 'none',
			opacity: visible ? 1 : 0
		}
	};
})<{ width: number, visible: boolean }>`
	display: flex;
	flex-direction: column;
	border-left: var(--border);
	transition: opacity 300ms ease-in-out, right 300ms ease-in-out;
	overflow: hidden;
`;
const Title = styled.div`
	display: flex;
	align-items: center;
	font-family: var(--console-title-font-family);
	min-height: 40px;
	border-bottom: var(--border);
	padding: 0 calc(var(--margin) / 2);
	> span {
		flex-grow: 1;
	}
`;
const Body = styled.div`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	overflow: auto;
	&::-webkit-scrollbar {
		background-color: transparent;
		width: 4px;
	}
	&::-webkit-scrollbar-track {
		background-color: transparent;
		border-radius: 2px;
	}
	&::-webkit-scrollbar-thumb {
		background-color: var(--console-favorite-color);
		border-radius: 2px;
	}
`;
const Topic = styled.div`
	display: flex;
	flex-direction: column;
	font-size: 0.8em;
`;
const TopicTitle = styled.div`
	display: flex;
	position: relative;
	align-items: center;
	height: 32px;
	padding: 0 calc(var(--margin) / 2);
	cursor: pointer;
	&:hover {
		background-color: var(--hover-color);
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
		font-size: 0.8em;
		min-height: 20px;
		height: 20px;
		min-width: 20px;
		width: 20px;
		margin-right: calc(var(--margin) / 4);
	}
	> span {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
`;
const Factors = styled.div.attrs<{ visible: boolean, count: number }>(({ visible, count }) => {
	return {
		style: {
			height: visible ? count * 32 : 0
		}
	};
})<{ visible: boolean, count: number }>`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	overflow: hidden;
	transition: height 300ms ease-in-out;
	> div {
		display: flex;
		position: relative;
		align-items: center;
		height: 32px;
		padding: 0 calc(var(--margin) / 2) 0 calc(var(--margin) / 2 + 15px);
		cursor: pointer;
		&:hover {
			background-color: var(--hover-color);
		}
		&:before,
		&:after {
			content: '';
			display: block;
			position: absolute;
			background-color: var(--console-waive-color);
		}
		&:before {
			left: calc(var(--margin) / 2 + 3px);
			top: -16px;
			height: 32px;
			width: 1px;
		}
		&:after {
			left: calc(var(--margin) / 2 + 3px);
			top: 16px;
			width: 8px;
			height: 1px;
			transform: translateY(-50%);
		}
		> div:first-child {
			font-size: 0.8em;
			min-height: 20px;
			height: 20px;
			min-width: 20px;
			width: 20px;
			margin-right: calc(var(--margin) / 4);
		}
		> span:nth-child(2) {
			flex-grow: 1;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
`;

const TopicItem = (props: { topic: QueriedTopicForPipeline }) => {
	const { topic } = props;

	const [ factorsVisible, setFactorsVisible ] = useState<boolean>(false);

	const onTitleClicked = () => setFactorsVisible(!factorsVisible);

	return <Topic>
		<TopicTitle data-factors-visible={factorsVisible} onClick={onTitleClicked}>
			<FontAwesomeIcon icon={faChevronRight}/>
			<UserAvatar name={topic.type}/>
			<span>{topic.name}</span>
		</TopicTitle>
		<Factors visible={factorsVisible} count={topic.factors.length}>
			{topic.factors.map(factor => {
				return <div key={factor.factorId}>
					<UserAvatar name={factor.type}/>
					<span>{factor.label}</span>
				</div>;
			})}
		</Factors>
	</Topic>;
};

const Spin = keyframes`
	from {
		transform: rotateZ(0deg);
	}
	to {
		transform: rotateZ(360deg);
	}
`;
const LoadingInCenterDiv = styled.div`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	align-items: center;
	justify-content: center;
	> svg {
		font-size: 3em;
		opacity: 0.2;
		filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.5));
		animation: ${Spin} infinite 2s forwards linear;
		margin-bottom: calc(var(--margin) / 4);
	}
	> span {
		font-size: 1.2em;
		opacity: 0.3;
		font-family: var(--console-title-font-family);
	}
`;
const LoadingInCenter = () => {
	const {
		store: { topics, topicsLoadCompleted }
	} = usePipelineContext();

	if (topicsLoadCompleted) {
		return null;
	}

	if (topics.length !== 0) {
		return null;
	}

	// setTimeout(forceUpdate, 500);

	return <LoadingInCenterDiv>
		<FontAwesomeIcon icon={faCircleNotch}/>
		<span>Loading...</span>
	</LoadingInCenterDiv>;
};
const LoadingInBottomDiv = styled.div`
	display: flex;
	align-items: center;
	justify-content: flex-end;
	font-size: 0.8em;
	padding: 0 calc(var(--margin) / 2);
	min-height: 36px;
	font-family: var(--console-title-font-family);
	border-top: var(--border);
	color: var(--console-favorite-color);
	> svg {
		animation: ${Spin} infinite 2s forwards linear;
		margin-right: calc(var(--margin) / 3);
	}
`;
const LoadingInBottom = () => {
	const {
		store: { topics, topicsLoadCompleted }
	} = usePipelineContext();

	if (topicsLoadCompleted) {
		return null;
	}

	if (topics.length === 0) {
		return null;
	}

	return <LoadingInBottomDiv>
		<FontAwesomeIcon icon={faCircleNotch}/>
		<span>More Data On Loading...</span>
	</LoadingInBottomDiv>;
};

export const PipelineNavigator = () => {
	const { consoleSpaceHeaderHeight } = useTheme() as Theme;
	const {
		store: { topics, menuVisible },
		addMenuVisibilityListener, removeMenuVisibilityListener,
		addTopicsChangedListener, removeTopicsChangedListener
	} = usePipelineContext();
	const [ width, setWidth ] = useState(300 + ScrollWidth);
	const [ , forceUpdate ] = useReducer(x => x + 1, 0);
	useEffect(() => {
		const onVisibleChanged = (visible: boolean) => {
			if (visible) {
				setWidth(Math.max(width, 300 + ScrollWidth));
			}
			forceUpdate();
		};
		addMenuVisibilityListener(onVisibleChanged);
		addTopicsChangedListener(forceUpdate);
		return () => {
			removeMenuVisibilityListener(onVisibleChanged);
			removeTopicsChangedListener(forceUpdate);
		};
	});

	const onResize = (width: number) => setWidth(Math.min(Math.max(width, ScrollWidth), 500));

	return <Navigator width={width - ScrollWidth} visible={menuVisible}>
		<Title>
			<span>Topics</span>
		</Title>
		<Body>
			{topics.map(topic => <TopicItem topic={topic} key={topic.topicId}/>)}
			<LoadingInCenter/>
		</Body>
		<LoadingInBottom/>
		<ResizeHandle top={consoleSpaceHeaderHeight} width={width} onResize={onResize}
		              alignment={ResizeHandleAlignment.RIGHT}/>
	</Navigator>;
};