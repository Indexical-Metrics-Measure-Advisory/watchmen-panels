import { faBan, faPlus, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment, useRef, useState } from "react";
import styled, { keyframes } from 'styled-components';
import { useCollapseFixedThing } from '../../../common/utils';
import Input from '../../component/input';
import { PrimaryObjectButton } from '../pipeline/editor/components/object-button';

interface DropdownState {
	visible: boolean;
	top?: number;
	bottom?: number;
	left: number;
	minWidth: number;
	atTop: boolean
}

const PropItemsPickerContainer = styled.div`
	display: flex;
	flex-direction: column;
	min-height: 80px;
`;
const Items = styled.div`
	padding: 6px 0;
	display: flex;
	flex-wrap: wrap;
	margin-left: calc(var(--margin) / -3);
	> div {
		margin: 2px 0 2px calc(var(--margin) / 3);
	}
`;
const ItemFinder = styled.div`
	display: flex;
	position: relative;
	align-items: center;
	height: 40px;
	&[data-in-search=true] {
		> input {
			width: 100%;
			border-color: var(--border-color);
		}
		> button {
			margin-right: 4px;
			right: 0;
			border-radius: var(--border-radius);
		}
	}
	> input {
		width: 0;
		border-color: transparent;
		padding-right: calc(80px + var(--input-indent));
		font-size: 0.8em;
	}
	> button {
		position: absolute;
		margin: 8px 0;
		align-self: start;
		min-width: 80px;
		right: calc(100% - 110px);
		border-radius: 12px;
	}
`;
const Rotate = keyframes`
	from {
		transform: rotateZ(0deg);
	}
	to {
		transform: rotateZ(360deg);
	}
`;
const Dropdown = styled.div.attrs<DropdownState>(({ visible, top, bottom, left, minWidth, atTop }) => {
	return {
		'data-at-top': atTop,
		style: {
			opacity: visible ? 1 : 0,
			pointerEvents: visible ? 'auto' : 'none',
			minWidth,
			top,
			bottom,
			left
		}
	};
})<DropdownState>`
	display: flex;
	position: fixed;
	flex-direction: column;
	font-size: 0.8em;
	min-height: 32px;
	max-height: 256px;
	background-color: var(--bg-color);
	border-radius: var(--border-radius);
	box-shadow: var(--console-primary-hover-shadow);
	overflow-x: hidden;
	z-index: 1000;
	transition: opacity 300ms ease-in-out;
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
	> div[data-widget='no-data'] {
		height: 32px;
		display: flex;
		align-items: center;
		padding: 0 calc(var(--margin) / 2);
		> svg {
			animation: ${Rotate} infinite 1000ms linear;
			margin-right: calc(var(--margin) / 3);
		}
	}
`;

export const PropItemsPicker = <T extends any>(props: {
	label: string;
	selectedItems: Array<T>;
	renderSelectedItem: (item: T) => React.ReactNode;
	renderCandidateItem: (item: T) => React.ReactNode;
	getKeyOfItem: (item: T) => string;
	fetchItems: (searchText: string) => Promise<Array<T>>;
}) => {
	const {
		label,
		selectedItems,
		renderSelectedItem,
		renderCandidateItem,
		getKeyOfItem,
		fetchItems
	} = props;

	const containerRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const [ inSearch, setInSearch ] = useState(false);
	const [ searchText, setSearchText ] = useState('');
	const [ searchItems, setSearchItems ] = useState<Array<T>>([]);
	const [ searchHandle, setSearchHandle ] = useState<number | null>(null);
	const [ expanded, setExpanded ] = useState<DropdownState>({ visible: false, left: 0, minWidth: 0, atTop: false });
	useCollapseFixedThing(containerRef, () => setExpanded({ ...expanded, visible: false }));

	const onSearchClicked = () => {
		if (!inSearch) {
			setInSearch(true);
			// dropdown width is according to input width, therefore waiting 350ms for fully expand input horizontally
			setTimeout(() => inputRef.current!.focus(), 350);
		} else {
			setInSearch(false);
		}
	};
	const onSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;

		if (searchHandle) {
			clearTimeout(searchHandle);
		}

		if (value.trim().length === 0) {
			setSearchItems([]);
			// no more search needed
			setSearchHandle(null);
		} else {
			const handle = setTimeout(async () => {
				const items = await fetchItems(value.trim());
				setSearchItems(items);
				setSearchHandle(null);
			}, 500);
			setSearchHandle(handle);
		}

		// update search input
		setSearchText(value);
	};
	const onSearchFocus = () => {
		const rect = inputRef.current!.getBoundingClientRect();
		// always on top
		setExpanded({
			visible: true,
			bottom: window.innerHeight - rect.top + 2,
			left: rect.left,
			minWidth: rect.width,
			atTop: true
		});
	};

	let dropdownContent;
	if (searchText.trim().length === 0) {
		dropdownContent = <div data-widget='no-data'>No search text...</div>;
	} else if (!!searchHandle) {
		// in searching
		dropdownContent = <div data-widget='no-data'>
			<FontAwesomeIcon icon={faSpinner}/>
			<span>Searching...</span>
		</div>;
	} else if (searchItems.length === 0) {
		// searched, but nothing found
		dropdownContent = <div data-widget='no-data'>No matched.</div>;
	} else {
		// searched, items found
		dropdownContent = searchItems.map(item => {
			return <Fragment key={getKeyOfItem(item)}>
				{renderCandidateItem(item)}
			</Fragment>;
		});
	}

	return <PropItemsPickerContainer>
		<ItemFinder data-in-search={inSearch} ref={containerRef}>
			<Input ref={inputRef}
			       placeholder='Search by Group Name...'
			       value={searchText} onChange={onSearchTextChange}
			       onFocus={onSearchFocus}/>
			<PrimaryObjectButton onClick={onSearchClicked}>
				<FontAwesomeIcon icon={inSearch ? faBan : faPlus}/>
				<span>{inSearch ? 'Done' : label}</span>
			</PrimaryObjectButton>
			<Dropdown {...expanded} visible={expanded.visible && inSearch}>
				{dropdownContent}
			</Dropdown>
		</ItemFinder>
		<Items>
			{selectedItems.map(item => {
				return <Fragment key={getKeyOfItem(item)}>{renderSelectedItem(item)}</Fragment>;
			})}
		</Items>
	</PropItemsPickerContainer>;
};