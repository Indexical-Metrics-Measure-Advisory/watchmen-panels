import React, { useEffect, useRef, useState } from 'react';
import { notInMe } from '../../../common/utils';
import { SearchPanelState, SearchState } from './types';

export const useSearchPanel = () => {
	const searchPanelRef = useRef<HTMLDivElement>(null);
	const [ searchPanelState, setSearchPanelState ] = useState<SearchPanelState>({ visible: false, top: 0, left: 0 });

	useEffect(() => {
		const onFocus = (event: FocusEvent) => {
			if (searchPanelRef.current && notInMe(searchPanelRef.current, event.target)) {
				setSearchPanelState({ ...searchPanelState, visible: false });
			}
		};
		window.addEventListener('focus', onFocus, true);
		window.addEventListener('click', onFocus, true);
		return () => {
			window.removeEventListener('focus', onFocus, true);
			window.removeEventListener('click', onFocus, true);
		};
	});

	return {
		ref: searchPanelRef,
		state: searchPanelState,
		show: (top: number, left: number) => setSearchPanelState({ top, left, visible: true }),
		hide: () => setSearchPanelState({ ...searchPanelState, visible: false })
	};
};

export const useSearch = <T extends any>(
	fetchData: (searchText: string) => Promise<Array<T>>
) => {
	const [ searcher, setSearcher ] = useState<number | null>(null);
	const [ data, setData ] = useState<SearchState<T>>({ searched: false, searchText: '', data: [] });

	const doSearch = (searchText: string) => {
		if (searcher) {
			clearTimeout(searcher);
		}
		const search = async () => {
			if (searcher) {
				clearTimeout(searcher);
			}
			try {
				const data = await fetchData(searchText);
				setData({ searched: true, searchText, data });
			} catch (e) {
				console.groupCollapsed(`%cError on fetch data.`, 'color:rgb(251,71,71)');
				console.error(e);
				console.groupEnd();
				setData({ searched: true, searchText, data: [] });
			}
		};
		setSearcher(setTimeout(search, 300));
	};

	return {
		search: doSearch,
		clear: () => setData({ searched: false, searchText: '', data: [] }),
		...data
	};
};