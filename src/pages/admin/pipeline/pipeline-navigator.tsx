import { faCircleNotch, faCompressAlt, faLink, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes, useTheme } from 'styled-components';
import { useForceUpdate } from '../../../common/utils';
import { QueriedTopicForPipeline } from '../../../services/admin/types';
import { Theme } from '../../../theme/types';
import { LinkButton } from '../../component/console/link-button';
import { ResizeHandle, ResizeHandleAlignment } from '../../component/console/menu/resize-handle';
import Input from '../../component/input';
import { usePipelineContext } from './pipeline-context';
import { NavigatorTopic } from './pipeline-navigator-topic';

const ScrollWidth = 15;
const Navigator = styled.div.attrs<{ width: number, visible: boolean }>(({ theme, width, visible }) => {
	return {
		'data-widget': 'console-pipeline-topics-navigator',
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
const Title = styled.div.attrs({
	'data-widget': 'console-pipeline-topics-navigator-title'
})`
	display: flex;
	align-items: center;
	font-family: var(--console-title-font-family);
	min-height: 40px;
	border-bottom: var(--border);
	padding: 0 calc(var(--margin) / 2);
	&[data-link-topic=true] {
		> button:last-child {
			color: var(--invert-color);
			background-color: var(--console-primary-color);
		}
	}
	> button {
		border-radius: var(--border-radius);
		font-size: 0.8em;
		padding: calc(var(--margin) / 5);
		width: 24px;
		height: 24px;
	}
	> button:not(:last-child) {
		margin-right: calc(var(--margin) / 6);
	}
`;
const Search = styled.div.attrs({
	'data-widget': 'console-pipeline-topics-navigator-search'
})`
	flex-grow: 1;
	display: flex;
	position: relative;
	align-items: center;
	justify-content: flex-end;
	padding-left: calc(var(--margin) / 2);
	margin-right: calc(var(--margin) / 6);
	> input {
		flex-grow: 0;
		min-width: 0;
		height: 24px;
		font-size: 0.8em;
		border-radius: 0;
		border: 0;
		padding: 0 24px 0 0;
		&[data-on-search=false] {
			padding-right: 0;
			width: 0;
		}
		&[data-on-search=true] {
			width: 100%;
			box-shadow: 0 1px 0 0 var(--border-color);
		}
	}
	> button {
		display: block;
		position: absolute;
		right: 0;
		top: 1px;
		width: 24px;
		height: 24px;
		font-size: 0.8em;
	}
`;
const Body = styled.div.attrs({
	'data-widget': 'console-pipeline-topics-navigator-body'
})`
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

const SearchInTitle = () => {
	const { changeTopicFilter } = usePipelineContext();
	const searchInputRef = useRef<HTMLInputElement>(null);
	const [ onSearch, setOnSearch ] = useState(false);
	const [ searchThrottle, setSearchThrottle ] = useState<number | null>(null);
	const [ searchText, setSearchText ] = useState('');

	const onSearchInputChange = () => {
		const value = searchInputRef.current?.value;
		setSearchText(value || '');
		const searchText = (value || '').trim();
		if (searchThrottle) {
			clearTimeout(searchThrottle);
			setSearchThrottle(null);
		}
		setSearchThrottle(setTimeout(() => {
			setSearchThrottle(null);
			changeTopicFilter(searchText);
		}, 300));
	};
	const onSearchInputFocus = () => searchInputRef.current?.select();
	const onSearchInputBlur = () => !searchInputRef.current?.value && setOnSearch(false);
	const onSearchClicked = () => {
		setOnSearch(true);
		searchInputRef.current?.focus();
	};

	return <Search>
		<Input data-on-search={onSearch}
		       value={searchText} placeholder='Filter by name'
		       onChange={onSearchInputChange}
		       onFocus={onSearchInputFocus} onBlur={onSearchInputBlur}
		       ref={searchInputRef}/>
		<LinkButton ignoreHorizontalPadding={true} tooltip='Search by Name' right={true} offsetX={-8}
		            onClick={onSearchClicked}>
			<FontAwesomeIcon icon={faSearch}/>
		</LinkButton>
	</Search>;
};

export const PipelineNavigator = () => {
	const { consoleSpaceHeaderHeight } = useTheme() as Theme;
	const {
		store: { topics, menuVisible },
		addMenuVisibilityListener, removeMenuVisibilityListener,
		addTopicsChangedListener, removeTopicsChangedListener,
		addTopicSelectionChangedListener, removeTopicSelectionChangedListener,
		collapseAllTopics
	} = usePipelineContext();
	const bodyRef = useRef<HTMLDivElement>(null);
	const [ width, setWidth ] = useState(300 + ScrollWidth);
	const [ linkTopic, setLinkTopic ] = useState(false);
	const forceUpdate = useForceUpdate();
	useEffect(() => {
		const onVisibleChanged = (visible: boolean) => {
			if (visible) {
				setWidth(Math.max(width, 300 + ScrollWidth));
			}
			forceUpdate();
		};
		const onTopicLink = (topic?: QueriedTopicForPipeline) => {
			if (!topic || !linkTopic || !bodyRef.current) {
				return;
			}

			const topicNode = bodyRef.current.querySelector(`div[data-topic-id="${topic.topicId}"]`);
			if (!topicNode) {
				// not found
				return;
			}
			topicNode.scrollIntoView({ behavior: 'smooth', block: 'start' });
		};
		addMenuVisibilityListener(onVisibleChanged);
		addTopicsChangedListener(forceUpdate);
		addTopicSelectionChangedListener(onTopicLink);
		return () => {
			removeMenuVisibilityListener(onVisibleChanged);
			removeTopicsChangedListener(forceUpdate);
			removeTopicSelectionChangedListener(onTopicLink);
		};
	});

	const onLinkTopicClicked = () => setLinkTopic(!linkTopic);
	const onCollapseAllClicked = () => collapseAllTopics();
	const onResize = (width: number) => setWidth(Math.min(Math.max(width, ScrollWidth), 500));

	return <Navigator width={width - ScrollWidth} visible={menuVisible}>
		<Title data-link-topic={linkTopic}>
			<span>Topics</span>
			<SearchInTitle/>
			<LinkButton ignoreHorizontalPadding={true} tooltip='Collapse All' right={true} offsetX={-8}
			            onClick={onCollapseAllClicked}>
				<FontAwesomeIcon icon={faCompressAlt} transform={{ rotate: -45 }}/>
			</LinkButton>
			<LinkButton ignoreHorizontalPadding={true} tooltip='Synchronized with Editor' right={true} offsetX={-8}
			            onClick={onLinkTopicClicked}>
				<FontAwesomeIcon icon={faLink}/>
			</LinkButton>
		</Title>
		<Body ref={bodyRef}>
			{topics.map(topic => <NavigatorTopic topic={topic} key={topic.topicId}/>)}
			<LoadingInCenter/>
		</Body>
		<LoadingInBottom/>
		<ResizeHandle top={consoleSpaceHeaderHeight} width={width} onResize={onResize}
		              alignment={ResizeHandleAlignment.RIGHT}/>
	</Navigator>;
};