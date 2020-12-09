import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useReducer, useState } from 'react';
import styled, { keyframes, useTheme } from 'styled-components';
import { Theme } from '../../../theme/types';
import { ResizeHandle, ResizeHandleAlignment } from '../../component/console/menu/resize-handle';
import { usePipelineContext } from './pipeline-context';
import { NavigatorTopic } from './pipeline-navigator-topic';

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
		filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.5));
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

	// const onLocateTopicClicked = () => {
	// };
	const onResize = (width: number) => setWidth(Math.min(Math.max(width, ScrollWidth), 500));

	return <Navigator width={width - ScrollWidth} visible={menuVisible}>
		<Title>
			<span>Topics</span>
			{/*<LinkButton ignoreHorizontalPadding={true} tooltip='Locate In Navigator' right={true} offsetX={-8}*/}
			{/*            onClick={onLocateTopicClicked}>*/}
			{/*	<FontAwesomeIcon icon={faCrosshairs}/>*/}
			{/*</LinkButton>*/}
		</Title>
		<Body>
			{topics.map(topic => <NavigatorTopic topic={topic} key={topic.topicId}/>)}
			<LoadingInCenter/>
		</Body>
		<LoadingInBottom/>
		<ResizeHandle top={consoleSpaceHeaderHeight} width={width} onResize={onResize}
		              alignment={ResizeHandleAlignment.RIGHT}/>
	</Navigator>;
};