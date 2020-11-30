import { faCaretDown, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import Input from '../../component/input';
import { SearchPanelState } from './types';
import { useSearch, useSearchPanel } from './utils';

export const Container = styled.div.attrs({
	'data-widget': 'console-pipeline-container'
})`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
`;
export const Header = styled.div.attrs({
	'data-widget': 'console-pipeline-header'
})`
	display: flex;
	position: sticky;
	top: 0;
	align-items: center;
	padding: 0 calc(var(--margin) / 2);
	height: var(--console-space-header-height);
	background-color: var(--invert-color);
	z-index: 2;
	overflow: hidden;
	&:after {
		content: '';
		display: block;
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 1px;
		background-color: var(--border-color);
		z-index: 3;
	}
`;
export const Body = styled.div.attrs({
	'data-widget': 'console-pipeline-body'
})`
	flex-grow: 1;
	display: flex;
`;

export const HeaderSection = styled.div`
	display: flex;
	position: relative;
	align-items: center;
	font-family: var(--console-title-font-family);
	font-size: 1.4em;
	height: var(--console-space-header-height);
	padding-right: 10px;
	margin-right: 10px;
	transition: all 300ms ease-in-out;
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
export const OperableHeaderSection = styled(HeaderSection)`
	padding-left: calc(var(--margin) / 2 + 10px);
	margin-left: -10px;
	cursor: pointer;
	&[data-visible=false] {
		opacity: 0;
		pointer-events: none;
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
`;

export const SearchPanel = styled.div.attrs<SearchPanelState>(({ visible, top, left }) => {
	return {
		style: {
			top,
			left,
			// transform: visible ? `translateY(0)` : 'translateY(20px)',
			opacity: visible ? 1 : 0,
			pointerEvents: visible ? 'auto' : 'none'
		}
	};
})<SearchPanelState>`
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
	transform-origin: top;
	overflow: hidden;
	z-index: 10000;
	transition: transform 300ms ease-in-out;
`;
export const SearchBar = styled.div`
	display: flex;
	align-items: center;
	border-bottom: var(--border);
	color: var(--console-font-color);
	> svg {
		font-size: 0.8em;
		margin-top: 1px;
		margin-left: calc(var(--margin) / 4);
	}
	> input {
		border: 0;
		font-size: 0.8em;
	}
`;
export const SearchResult = styled.div`
	display: flex;
	flex-direction: column;
	font-size: 0.8em;
	color: var(--console-font-color);
	> div {
		display: flex;
		align-items: center;
		height: 32px;
		padding: 0 calc(var(--margin) / 2);
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		transition: all 300ms ease-in-out;
		&:first-child {
			&[data-visible=false] {
				opacity: 0.7;
				height: 0;
			}
		}
		&:not(:first-child) {
			&:hover {
				color: var(--console-primary-color);
				text-decoration: underline;
			}
		}
	}
`;
export const Directions = styled.div`
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
			text-decoration: underline;
		}
	}
`;

export const PipelineHeaderSearchSection = <T extends any>(props: {
	visible: boolean;
	title: (selection?: T) => string;
	searchPlaceholder?: string;
	nonMatchLabel: string;
	selection?: T;
	doSearch: (searchText: string) => Promise<Array<T>>;
	renderCandidate: (item: T, hideSearchPanel: () => void) => ((props: any) => React.ReactNode) | React.ReactNode;
}) => {
	const {
		visible, title, nonMatchLabel, searchPlaceholder,
		selection,
		doSearch, renderCandidate
	} = props;

	const containerRef = useRef<HTMLDivElement>(null);
	const searchTextRef = useRef<HTMLInputElement>(null);
	const [ searchText, setSearchText ] = useState<string>('');
	const { ref: searchPanelRef, state: searchPanelState, show: showSearchPanel, hide: hideSearchPanel } = useSearchPanel();
	const { search: doSearchData, clear: doClearSearchData, data, searched } = useSearch(doSearch);

	const onShowSearchPanel = () => {
		const { top, left, height } = containerRef.current!.getBoundingClientRect();
		// clear previous search results
		doClearSearchData();
		setSearchText('');
		showSearchPanel(top + height - 5, left - 5);
		searchTextRef.current!.focus();
	};
	const onSearchTextChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchText(event.target.value);
		doSearchData(event.target.value);
	};

	let showSearchLabel = true;
	let searchLabel = 'Searching...';
	if (searched) {
		if (data.length === 0) {
			searchLabel = nonMatchLabel;
		} else {
			showSearchLabel = false;
		}
	} else if (searchText.trim().length === 0) {
		searchLabel = 'Waiting for criteria...';
	}

	return <OperableHeaderSection onClick={onShowSearchPanel} ref={containerRef}
	                              data-searching={searchPanelState.visible}
	                              data-visible={visible}>
		<span>{title(selection)}</span>
		<FontAwesomeIcon icon={faCaretDown}/>
		<SearchPanel {...searchPanelState} ref={searchPanelRef}>
			<SearchBar>
				<FontAwesomeIcon icon={faSearch}/>
				<Input ref={searchTextRef} placeholder={searchPlaceholder}
				       value={searchText} onChange={onSearchTextChanged}/>
			</SearchBar>
			<SearchResult>
				<div data-visible={showSearchLabel}>{searchLabel}</div>
				{searched ? data.map(item => renderCandidate(item, hideSearchPanel)) : null}
			</SearchResult>
		</SearchPanel>
	</OperableHeaderSection>;
};