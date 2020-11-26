import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { DataPage } from '../../../services/admin/types';
import { CarvedButton } from '../../component/console/carved-button';
import { HorizontalLoading } from '../../component/console/horizontal-loading';
import { LinkButton } from '../../component/console/link-button';
import Input from '../../component/input';
import { createBlankDataPage } from '../utils';

interface State<T> extends DataPage<T> {
	queried: boolean;
	searched?: string;
}

const Main = styled.div`
	display: flex;
	flex-direction: column;
	position: relative;
	margin-top: 30px;
	&[data-on-before-search=false] {
		> button:first-child {
			left: calc(100% - 44px);
			font-size: 2em;
			width: 44px;
			margin-top: -0.4em;
		}
		> input:nth-child(2) {
			margin-left: 100%;
			width: 0;
			padding-left: 0;
		}
	}
	> button:first-child {
		display: block;
		position: absolute;
		font-size: 1.2em;
		width: 32px;
		top: calc(1em + 6px);
		left: 0;
		transform: translateY(-50%);
		cursor: pointer;
		transition: all 300ms ease-in-out;
	}
`;
const Search = styled(Input)`
	border-radius: 0;
	border-top: 0;
	border-left: 0;
	border-right: 0;
	padding-left: 36px;
	padding-right: 0;
	margin-bottom: calc(var(--margin) / 2);
	font-size: 1.4em;
	line-height: 1.6em;
	height: calc(1.6em + 12px);
	width: 100%;
	color: var(--console-font-color);
	transition: all 300ms ease-in-out;
`;
const List = styled.div`
	display: none;
	grid-template-columns: repeat(3, 1fr);
	grid-column-gap: calc(var(--margin) / 2);
	grid-row-gap: calc(var(--margin) / 2);
	padding-top: calc(var(--margin) / 2);
	&[data-visible=true] {
		display: grid;
	}
`;
const NoData = styled.div`
	display: none;
	align-items: center;
	justify-content: center;
	padding-top: calc(var(--margin) / 2);
	grid-column: span 3;
	font-family: var(--console-title-font-family);
	font-weight: var(--font-demi-bold);
	font-size: 1.2em;
	&[data-visible=true] {
		display: flex;
	}
`;
const Bottom = styled.div`
	display: flex;
	margin-top: calc(var(--margin) / 2);
	margin-bottom: 50px;
	&[data-visible=false] {
		display: none;
	}
	> div:nth-child(2) {
		flex-grow: 1;
	}
	> div:nth-child(3) {
		display: flex;
		align-items: center;
		padding: 4px 0;
	}
	> div:nth-child(3),
	> button {
		line-height: 1.6em;
		font-family: var(--console-title-font-family);
		font-weight: var(--font-demi-bold);
		color: var(--console-font-color);
		&[data-visible=false] {
			display: none;
		}
	}
	> button:last-child {
		margin-left: calc(var(--margin) / 2);
	}
`;

export const SingleSearchItemCard = styled.div`
	display: flex;
	flex-direction: column;
	padding: calc(var(--margin) / 2) var(--margin);
	position: relative;
	border-radius: calc(var(--border-radius) * 2);
	box-shadow: var(--console-shadow);
	cursor: pointer;
	transition: all 300ms ease-in-out;
	&:hover {
		box-shadow: var(--console-hover-shadow);
	}
	> div:first-child {
		display: flex;
		align-items: center;
		font-family: var(--console-title-font-family);
		font-size: 1.4em;
	}
	> div:nth-child(2) {
		display: flex;
		flex-grow: 1;
		position: relative;
		word-break: break-word;
		font-size: 0.8em;
		opacity: 0.8;
		margin-top: calc(var(--margin) / 2);
		min-height: 3.5em;
		line-height: 1.5em;
	}
	> div:nth-child(3) {
		display: flex;
		justify-content: space-around;
		line-height: 1.2em;
		opacity: 0.7;
		margin-top: calc(var(--margin) / 2);
		> button {
			font-size: 0.8em;
			color: var(--console-font-color);
			svg {
				margin-right: calc(var(--margin) / 4);
			}
		}
	}
`;

export const SingleSearch = <T extends any>(props: {
	searchPlaceholder?: string;
	listData: (options: { search: string; pageNumber: number; pageSize: number }) => Promise<DataPage<T>>;
	renderItem: (item: T) => React.ReactNode;
	getKeyOfItem: (item: T) => string;
}) => {
	const { searchPlaceholder, listData, renderItem, getKeyOfItem } = props;

	const searchRef = useRef<HTMLInputElement>(null);
	const [ beforeSearch, setBeforeSearch ] = useState<boolean>(true);
	const [ loading, setLoading ] = useState<boolean>(false);
	const [ state, setState ] = useState<State<T>>({ queried: false, ...createBlankDataPage() });
	const [ searchText, setSearchText ] = useState<string>('');
	useEffect(() => {
		if (searchRef.current) {
			searchRef.current.focus();
		}
	}, [ searchRef ]);

	const onBeforeSearchClicked = () => {
		!beforeSearch && setBeforeSearch(true);
		searchRef.current!.focus();
		searchRef.current!.select();
	};
	const onSearchChanged = (event: React.ChangeEvent<HTMLInputElement>) => setSearchText(event.target.value);
	const searchPage = async (searchText: string, pageNumber: number, clear: boolean = false, collapseSearchText: boolean = false) => {
		try {
			setLoading(true);
			if (clear) {
				setState({ queried: false, ...createBlankDataPage<T>() });
			}
			const result = await listData({ search: searchText, pageNumber, pageSize: state.pageSize });
			setState({ queried: true, searched: searchText, ...result });
			if (collapseSearchText && result.data.length !== 0) {
				setBeforeSearch(false);
			}
			setLoading(false);
		} catch (e) {
			console.groupCollapsed(`%cError on fetch data.`, 'color:rgb(251,71,71)');
			console.error(e);
			console.groupEnd();
		}
	};
	const onSearchKeyPressed = async (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key !== 'Enter') {
			return;
		}

		await searchPage(searchText, 1, true, true);
	};
	const onPreviousPageClicked = () => searchPage(state.searched!, state.pageNumber - 1);
	const onNextPageClicked = () => searchPage(state.searched!, state.pageNumber + 1);

	return <Main data-on-before-search={beforeSearch}>
		<LinkButton ignoreHorizontalPadding={true} onClick={onBeforeSearchClicked}>
			<FontAwesomeIcon icon={faSearch}/>
		</LinkButton>
		<Search placeholder={searchPlaceholder}
		        value={searchText} onChange={onSearchChanged}
		        onKeyPress={onSearchKeyPressed}
		        ref={searchRef}/>
		<List data-visible={state.queried}>
			<NoData data-visible={state.data.length === 0}>No matched data.</NoData>
			{state.data.map(item => {
				return <Fragment key={getKeyOfItem(item)}>{renderItem(item)}</Fragment>;
			})}
		</List>
		<Bottom data-visible={!state.queried || state.data.length !== 0}>
			<CarvedButton data-visible={state.queried && state.pageNumber !== 1}
			              onClick={onPreviousPageClicked}>
				Previous Page
			</CarvedButton>
			<HorizontalLoading visible={loading}/>
			<div data-visible={state.queried}>
				<sub>#</sub>{state.pageNumber} of {state.pageCount} Pages
			</div>
			<CarvedButton
				data-visible={state.queried && state.pageNumber !== state.pageCount}
				onClick={onNextPageClicked}>
				Next Page
			</CarvedButton>
		</Bottom>
	</Main>;
};