import { faCaretDown, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { RefObject, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { notInMe } from '../../../common/utils';
import { listTopicsForPipeline } from '../../../services/admin/topic';
import { QueriedTopicForPipeline } from '../../../services/admin/types';
import { ConsoleTopicFactor } from '../../../services/console/types';
import Input from '../../component/input';
import { Header } from './components';

enum SearchWhat {
	TOPIC = 'topic',
	FACTOR = 'factor',
	DIRECTION = 'direction'
}

enum Direction {
	TO_SOURCE = 'to the source',
	TO_USAGE = 'to the usage',
	BOTH = 'both sides'
}

interface SearchState {
	visible: boolean;
	top: number;
	left: number;
	what?: SearchWhat;
	searchText: string;
	placeholder?: string;
}

interface Status {
	topic?: QueriedTopicForPipeline;
	factor?: ConsoleTopicFactor;
	direction?: Direction;
}

const Title = styled.div.attrs<{ order: number }>(({ order }) => {
	return {
		style: { order }
	};
})<{ order: number }>`
	display: flex;
	position: relative;
	align-items: center;
	font-family: var(--console-title-font-family);
	font-size: 1.4em;
	height: var(--console-space-header-height);
	padding-right: 10px;
	margin-right: 10px;
	transition: all 300ms ease-in-out;
	&[data-visible=false] {
		opacity: 0;
		pointer-events: none;
	}
	&:not([data-first=true]) {
		padding-left: calc(var(--margin) / 2 + 10px);
		margin-left: -10px;
		cursor: pointer;
	}
	&[data-searching=true] {
		color: var(--console-primary-color);
		background-color: var(--border-color);
		&:before {
			border-color: var(--invert-color) transparent var(--invert-color) var(--border-color);
		}
		&:after {
			border-color: transparent transparent transparent var(--border-color);
		}
	}
	&:before,
	&:after {
	    content: '';
	    position: absolute;
	    top: -2px;
	    height: var(--console-space-header-height + 4px);
	    border-style: solid;
	    border-left-width: 10px;
	    border-top-width: calc(var(--console-space-header-height) / 2 + 2px);
	    border-bottom-width: calc(var(--console-space-header-height) / 2 + 2px);
	    border-right: 0;
	    transition: all 300ms ease-in-out;
	}
	&:before {
	    right: -10px;
	    border-color: transparent transparent transparent var(--border-color);
	    z-index: 1;
	}
	&:after {
	    right: -9px;
	    border-color: transparent transparent transparent var(--invert-color);
	    z-index: 2;
	}
	> svg {
		margin-left: calc(var(--margin) / 3);
		font-size: 0.7em;
	}
	> span {
		text-transform: capitalize;
	}
`;

const SearchPanel = styled.div.attrs<SearchState>(({ visible, top, left }) => {
	return {
		style: {
			top,
			transform: visible ? `translateX(${left}px) scaleY(1)` : 'scaleY(0)',
			pointerEvents: visible ? 'auto' : 'none'
		}
	};
})<SearchState>`
	display: flex;
	position: fixed;
	flex-direction: column;
	left: 0;
	width: 300px;
	font-family: var(--font-family);
	font-size: var(--font-size);
	background-color: var(--invert-color);
	border-radius: var(--border-radius);
	box-shadow: var(--console-hover-shadow);
	overflow: hidden;
	z-index: 10000;
	transition: transform 300ms ease-in-out;
	> div {
		opacity: 0;
		height: 0;
		pointer-events: none;
		overflow: hidden;
		transition: all 300ms ease-in-out;
		&[data-visible=true] {
			opacity: 1;
			height: unset;
			pointer-events: auto;
		}
	}
	> div:first-child {
		display: flex;
		align-items: center;
		border-bottom: var(--border);
		> svg {
			font-size: 0.8em;
			margin-top: 1px;
			margin-left: calc(var(--margin) / 4);
		}
		> input {
			border: 0;
			font-size: 0.8em;
		}
	}
	> div:nth-child(2) {
		display: flex;
		font-size: 0.8em;
		> div:first-child {
			display: flex;
			align-items: center;
			height: 32px;
			padding: 0 calc(var(--margin) / 2);
			opacity: 0.7;
			overflow: hidden;
			transition: height 300ms ease-in-out;
			&[data-visible=false] {
				height: 0;
			}
		}
	}
	> div:nth-child(3) {
		display: flex;
		flex-direction: column;
		font-size: 0.8em;
		margin-top: -1px;
		> span {
			display: flex;
			align-items: center;
			height: 32px;
			text-transform: capitalize;
			padding: 0 calc(var(--margin) / 2);
			cursor: pointer;
			transition: all 300ms ease-in-out;
			&:hover {
				background-color: var(--console-primary-color);
				color: var(--invert-color);
			}
		}
	}
`;

export const PipelineHeader = () => {
	const chooseTopicRef = useRef<HTMLDivElement>(null);
	const chooseFactorRef = useRef<HTMLDivElement>(null);
	const chooseDirectionRef = useRef<HTMLDivElement>(null);
	const searchPanelRef = useRef<HTMLDivElement>(null);
	const searchTextRef = useRef<HTMLInputElement>(null);
	const [ status, setStatus ] = useState<Status>({});
	const [ topicCandidates, setTopicCandidates ] = useState<{
		searched: boolean;
		searchText: string; data: Array<QueriedTopicForPipeline>
	}>({ searched: false, searchText: '', data: [] });
	const [ searchState, setSearchState ] = useState<SearchState>({ visible: false, top: 0, left: 0, searchText: '' });
	const [ topicSearcher, setTopicSearcher ] = useState<number | null>(null);
	useEffect(() => {
		const onFocus = (event: FocusEvent) => {
			if (searchPanelRef.current && notInMe(searchPanelRef.current, event.target)) {
				setSearchState({ ...searchState, visible: false });
			}
		};
		window.addEventListener('focus', onFocus, true);
		window.addEventListener('click', onFocus, true);
		return () => {
			window.removeEventListener('focus', onFocus, true);
			window.removeEventListener('click', onFocus, true);
		};
	});

	const onShowSearchPanel = <T extends HTMLElement>(options: {
		ref: RefObject<T>;
		what: SearchWhat;
		placeholder?: string;
	}) => {
		const { ref, placeholder, what } = options;
		const { top, left, height } = ref.current!.getBoundingClientRect();
		if (what === SearchWhat.TOPIC) {
			// clear previous topic search results
			setTopicCandidates({ searched: false, searchText: '', data: [] });
		}
		setSearchState({
			visible: true,
			top: top + height - 5,
			left: left - 5,
			what,
			searchText: '',
			placeholder
		});
		searchTextRef.current!.focus();
	};
	const onChooseTopicClicked = () => onShowSearchPanel({
		ref: chooseTopicRef,
		what: SearchWhat.TOPIC,
		placeholder: 'Topic name...'
	});
	const onChooseFactorClicked = () => onShowSearchPanel({
		ref: chooseFactorRef,
		what: SearchWhat.FACTOR,
		placeholder: 'Factor name...'
	});
	const onChooseDirectionClicked = () => onShowSearchPanel({
		ref: chooseDirectionRef,
		what: SearchWhat.DIRECTION
	});
	const doSearchTopic = (searchText: string) => {
		if (topicSearcher) {
			clearTimeout(topicSearcher);
		}
		const search = async () => {
			if (topicSearcher) {
				clearTimeout(topicSearcher);
			}
			try {
				const topics = await listTopicsForPipeline(searchText);
				setTopicCandidates({ searched: true, searchText, data: topics });
			} catch (e) {
				console.groupCollapsed(`%cError on fetch topics.`, 'color:rgb(251,71,71)');
				console.error(e);
				console.groupEnd();
				setTopicCandidates({ searched: true, searchText, data: [] });
			}
		};
		setTopicSearcher(setTimeout(search, 300));
	};
	const doSearchFactor = (searchText: string) => {
		// TODO
	};
	const onSearchTextChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchState({ ...searchState, searchText: event.target.value });
		if (searchState.what === SearchWhat.TOPIC) {
			doSearchTopic(event.target.value);
		} else if (searchState.what === SearchWhat.FACTOR) {
			doSearchFactor(event.target.value);
		}
	};
	const onDirectionClicked = (direction: Direction) => () => {
		setStatus({ ...status, direction });
		setSearchState({ ...searchState, visible: false });
	};

	const isSearchTopic = searchState.visible && searchState.what === SearchWhat.TOPIC;
	const isSearchFactor = searchState.visible && searchState.what === SearchWhat.FACTOR;
	const isChangeDirection = searchState.visible && searchState.what === SearchWhat.DIRECTION;

	let showSearchLabel = true;
	let searchLabel = 'Searching...';
	if (topicCandidates.searched) {
		if (topicCandidates.data.length === 0) {
			searchLabel = 'No matched topic.';
		} else {
			showSearchLabel = false;
		}
	} else if (searchState.searchText.trim().length === 0) {
		searchLabel = 'Waiting for criteria...';
	}

	return <Header>
		<Title onClick={onChooseDirectionClicked} data-searching={isChangeDirection} data-visible={!!status.factor}
		       order={4} ref={chooseDirectionRef}>
			<span>{status.direction ? status.direction : 'Choose Direction'}</span>
			<FontAwesomeIcon icon={faCaretDown}/>
		</Title>
		<Title onClick={onChooseFactorClicked} data-searching={isSearchFactor} data-visible={!!status.topic}
		       order={3}
		       ref={chooseFactorRef}>
			<span>Choose Factor</span>
			<FontAwesomeIcon icon={faCaretDown}/>
		</Title>
		<Title onClick={onChooseTopicClicked} data-searching={isSearchTopic} order={2}
		       ref={chooseTopicRef}>
			<span>Choose Topic</span>
			<FontAwesomeIcon icon={faCaretDown}/>
		</Title>
		<Title data-next-searching={isSearchTopic} data-first={true} order={1}>Pipelines</Title>
		<SearchPanel {...searchState} ref={searchPanelRef}>
			<div data-visible={isSearchTopic || isSearchFactor}>
				<FontAwesomeIcon icon={faSearch}/>
				<Input ref={searchTextRef} placeholder={searchState.placeholder}
				       value={searchState.searchText}
				       onChange={onSearchTextChanged}/>
			</div>
			<div data-visible={isSearchTopic || isSearchFactor}>
				<div data-visible={showSearchLabel}>{searchLabel}</div>
			</div>
			<div data-visible={isChangeDirection}>
				<span onClick={onDirectionClicked(Direction.TO_SOURCE)}>{Direction.TO_SOURCE}</span>
				<span onClick={onDirectionClicked(Direction.TO_USAGE)}>{Direction.TO_USAGE}</span>
				<span onClick={onDirectionClicked(Direction.BOTH)}>{Direction.BOTH}</span>
			</div>
		</SearchPanel>
	</Header>;
};