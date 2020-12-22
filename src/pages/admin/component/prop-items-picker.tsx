import { faBan, faCheck, faPlus, faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';
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
	min-height: 40px;
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
export const SelectedItemInItemPicker = styled.div`
	display: flex;
	align-items: center;
	height: 24px;
	padding-left: calc(var(--margin) / 2);
	color: var(--invert-color);
	font-size: 0.8em;
	background-color: var(--console-primary-color);
	border-radius: 12px;
	cursor: pointer;
	transition: all 300ms ease-in-out;
	&:hover {
		box-shadow: var(--console-primary-hover-shadow);
	}
	> span {
		position: relative;
		padding-right: calc(var(--margin) / 4);
		cursor: default;
	}
	> div {
		display: flex;
		position: relative;
		align-items: center;
		height: 24px;
		padding: 0 calc(var(--margin) / 3) 0 calc(var(--margin) / 4);
		border-top-right-radius: 12px;
		border-bottom-right-radius: 12px;
		&:before {
			content: '';
			display: block;
			position: absolute;
			top: 25%;
			left: 0;
			width: 1px;
			height: 50%;
			background-color: var(--invert-color);
			opacity: 0.7;
		}
		> svg {
		}
	}
`;
const ItemFinder = styled.div`
	display: flex;
	position: relative;
	align-items: center;
	height: 32px;
	margin: 4px 0;
	border: var(--border);
	border-color: transparent;
	border-radius: var(--border-radius);
	&[data-in-search=true] {
		border-color: var(--border-color);
		> input {
			flex-grow: 1;
			padding-left: var(--input-indent);
			margin-right: var(--input-indent);
		}
		> button {
			margin-left: 0;
			margin-right: 4px;
			border-radius: var(--border-radius);
		}
	}
	> input {
		width: 0;
		border: 0;
		padding: 5px 0;
		font-size: 0.8em;
		height: 30px;
	}
	> button {
		margin-left: -1px;
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
export const CandidateItemInItemPicker = styled.div`
	display: flex;
	align-items: center;
	min-height: 32px;
	height: 32px;
	cursor: pointer;
	&:hover {
		color: var(--invert-color);
		background-color: var(--console-primary-color);
	}
	> div:first-child {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		&[data-visible=false] {
			opacity: 0;
		}
	}
	> span:nth-child(3) {
		margin-left: calc(var(--margin) / 4);
		transform: scale(0.8);
		transform-origin: left bottom;
		opacity: 0.7;
	}
`;

const ItemPicker = <T extends any>(props: {
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
			inputRef.current!.focus();
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
		const rect = containerRef.current!.getBoundingClientRect();
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

export const PropItemPicker = <Entity extends object, Item extends any>(props: {
	label: string;
	entity: Entity;
	codes: Array<Item>;
	initPropArray: (entity: Entity) => void;
	addItemToProp: (entity: Entity, item: Item) => void;
	removeItemFromProp: (entity: Entity, item: Item) => void;
	isItemPicked: (entity: Entity, item: Item) => boolean;
	addItemToCodes: (codes: Array<Item>, item: Item) => void;
	removeItemFromCodes: (codes: Array<Item>, item: Item) => void;
	getKeyOfItem: (item: Item) => string;
	getNameOfItem: (item: Item) => string;
	getMinorNameOfItem: (item: Item) => string | undefined | null;
	listItems: (searchText: string) => Promise<Array<Item>>;
	onDataChanged: () => void;
}) => {
	const {
		label,
		entity, codes,
		initPropArray,
		addItemToProp, removeItemFromProp, isItemPicked, addItemToCodes, removeItemFromCodes,
		getKeyOfItem, getNameOfItem, getMinorNameOfItem, listItems,
		onDataChanged
	} = props;

	const onSpaceAdd = (entity: Entity, item: Item, onDataChanged: () => void) => {
		initPropArray(entity);
		addItemToProp(entity, item);
		addItemToCodes(codes, item);
		onDataChanged();
	};
	const onSpaceRemove = (entity: Entity, item: Item, onDataChanged: () => void) => {
		removeItemFromProp(entity, item);
		removeItemFromCodes(codes, item);
		onDataChanged();
	};
	const renderSelectedItem = (entity: Entity, onDataChanged: () => void) => (item: Item) => {
		return <SelectedItemInItemPicker>
			<span>{getNameOfItem(item)}</span>
			<div onClick={() => onSpaceRemove(entity, item, onDataChanged)}>
				<FontAwesomeIcon icon={faTimes}/>
			</div>
		</SelectedItemInItemPicker>;
	};
	const renderCandidateItem = (entity: Entity, onDataChanged: () => void) => (item: Item) => {
		// eslint-disable-next-line
		const checked = isItemPicked(entity, item);
		const onClicked = () => {
			if (checked) {
				onSpaceRemove(entity, item, onDataChanged);
			} else {
				onSpaceAdd(entity, item, onDataChanged);
			}
		};
		return <CandidateItemInItemPicker onClick={onClicked}>
			<div data-visible={checked}><FontAwesomeIcon icon={faCheck}/></div>
			<span>{getNameOfItem(item)}</span>
			<span>{getMinorNameOfItem(item)}</span>
		</CandidateItemInItemPicker>;
	};
	const sortItem = (items: Array<Item>) => {
		items.sort((g1, g2) => getNameOfItem(g1).toUpperCase().localeCompare(getNameOfItem(g2).toUpperCase()));
	};
	const fetchSpacesBySearch = async (searchText: string): Promise<Array<Item>> => {
		const items = await listItems(searchText);
		sortItem(items);
		return items;
	};

	return <ItemPicker label={label}
	                   selectedItems={codes}
	                   renderSelectedItem={renderSelectedItem(entity, onDataChanged)}
	                   renderCandidateItem={renderCandidateItem(entity, onDataChanged)}
	                   getKeyOfItem={getKeyOfItem}
	                   fetchItems={fetchSpacesBySearch}/>;
};