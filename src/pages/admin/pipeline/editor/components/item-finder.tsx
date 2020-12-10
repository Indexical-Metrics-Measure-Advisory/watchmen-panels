import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { v4 } from 'uuid';
import { ActionInput } from './action-input';

interface DropdownRect {
	top?: number;
	bottom?: number;
	left: number;
	width: number;
	atTop: boolean;
}

const FinderContainer = styled.div`
	display: flex;
	position: relative;
	border-radius: var(--border-radius);
	box-shadow: 0 0 0 1px var(--border-color);
	transition: all 300ms ease-in-out;
	align-items: center;
	overflow: hidden;
	&:hover {
		box-shadow: var(--console-primary-hover-shadow);
	}
	> input {
		flex-grow: 1;
		height: 22px;
		border: 0;
		cursor: pointer;
		text-overflow: ellipsis;
		&:hover,
		&:focus {
			border-color: transparent;
			box-shadow: none;
		}
	}
`;
const TypeChar = styled.div`
	display: flex;
	position: relative;
	align-items: center;
	align-self: stretch;
	justify-content: center;
	background-color: var(--pipeline-bg-color);
	font-variant: petite-caps;
	font-weight: var(--font-demi-bold);
	border-right: var(--border);
	padding: 0 calc(var(--margin) / 5);
	z-index: 1;
	cursor: pointer;
	&[data-visible=false] {
		display: none;
	}
	&[data-visible=true] {
		+ input {
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
			border-left-color: transparent;
		}
	}
`;
const Dropdown = styled.div.attrs<DropdownRect>(({ top, bottom, left, width, atTop }) => {
	return {
		style: {
			top: atTop ? 'unset' : top,
			bottom: atTop ? `calc(100vh - ${bottom}px)` : 'unset',
			left,
			minWidth: Math.max(width, 200),
			transformOrigin: atTop ? 'bottom' : 'top'
		}
	};
})<DropdownRect>`
	display: flex;
	position: fixed;
	flex-direction: column;
	z-index: 1000;
	max-height: 200px;
	transform: scaleY(0);
	transition: transform 300ms ease-in-out;
	pointer-events: none;
	background-color: var(--bg-color);
	border-radius: var(--border-radius);
	box-shadow: var(--console-primary-hover-shadow);
	overflow-x: hidden;
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
	&[data-expanded=true] {
		transform: scaleY(1);
		pointer-events: auto;
	}
	> input {
		min-height: 28px;
		position: sticky;
		top: 0;
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
		background-color: var(--bg-color);
		border-color: transparent;
		border-bottom: var(--border);
		&:hover,
		&:focus {
			border-bottom-color: var(--border-color);
			box-shadow: none;
		}
	}
	> div {
		min-height: 28px;
		height: 28px;
		line-height: 28px;
		padding: 0 var(--input-indent);
		background-color: var(--pipeline-bg-color);
		&[data-visible=false] {
			display: none;
		}
		&:not(:nth-child(2)) {
			cursor: pointer;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			&:hover {
				color: var(--invert-color);
				background-color: var(--console-primary-color);
			}
			> span:nth-child(2n) {
				font-weight: 800;
				font-variant: petite-caps;
			}
		}
	}
`;

const isInFinder = (element: EventTarget | null, container: HTMLDivElement): boolean => {
	if (!element || element === window || element === document) {
		return false;
	}
	if (element === container) {
		return true;
	}
	let parent = (element as HTMLElement).parentElement;
	while (parent && parent !== document.body) {
		if (parent === container) {
			return true;
		}
		parent = parent.parentElement;
	}
	return false;
};

export const ItemFinder = <I extends any>(props: {
	// single character
	typeChar?: string;
	item?: I
	asLabel: (item?: I) => string;
	filterItems: (searchText: string) => Array<{ item: I, parts: Array<string> }>;
	onSelect: (item: I) => void;
}) => {
	const { typeChar, item, asLabel, filterItems, onSelect } = props;

	const name = asLabel(item);

	const containerRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const searchInputRef = useRef<HTMLInputElement>(null);
	const [ expanded, setExpanded ] = useState(false);
	const [ dropdownRect, setDropdownRect ] = useState<DropdownRect>({ left: 0, width: 0, atTop: false });
	const [ searchText, setSearchText ] = useState<string>(name);
	const [ filteredItems, setFilteredItems ] = useState<Array<{ item: I, parts: Array<string> }>>(filterItems(name));
	const [ filterTimeout, setFilterTimeout ] = useState<number | null>(null);
	useEffect(() => {
		const collapse = (event: Event) => {
			const target = event.target;
			if (!isInFinder(target, containerRef.current!)) {
				setExpanded(false);
			}
		};
		window.addEventListener('scroll', collapse, true);
		window.addEventListener('focus', collapse, true);
		window.addEventListener('click', collapse, true);
		return () => {
			window.removeEventListener('scroll', collapse, true);
			window.removeEventListener('focus', collapse, true);
			window.removeEventListener('click', collapse, true);
		};
	});

	const expand = (count: number) => {
		if (!expanded) {
			const rect = containerRef.current!.getBoundingClientRect();
			const top = rect.top + rect.height + 2;
			const bottom = top + 28 * (count + 1);
			if (bottom > window.innerHeight) {
				setDropdownRect({ bottom: rect.top - 2, left: rect.left, width: rect.width, atTop: true });
			} else {
				setDropdownRect({ top, left: rect.left, width: rect.width, atTop: false });
			}
			setExpanded(true);
			searchInputRef.current!.focus();
			searchInputRef.current!.select();
		}
	};
	const onNameChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		if (filterTimeout) {
			clearTimeout(filterTimeout);
		}

		setSearchText(value);
		setFilterTimeout(setTimeout(() => {
			const filtered = filterItems(value);
			setFilterTimeout(null);
			setFilteredItems(filtered);
			expand(filtered.length);
		}, 200));
	};
	const onExpandClick = () => expand(filteredItems.length);
	const onItemClicked = (item: I) => () => {
		onSelect(item);
		setExpanded(false);
		const searchText = asLabel(item);
		setSearchText(searchText);
		setFilteredItems(filterItems(searchText));
	};

	return <FinderContainer ref={containerRef}>
		<TypeChar data-visible={!!typeChar} onClick={onExpandClick}>
			<span>{typeChar}</span>
		</TypeChar>
		<ActionInput value={name} onChange={onNameChanged}
		             onClick={onExpandClick} readOnly={true}
		             ref={inputRef}/>
		<Dropdown ref={dropdownRef} data-expanded={expanded} {...dropdownRect}
		          data-count={filteredItems.length + 1}>
			<ActionInput value={searchText} onChange={onNameChanged} ref={searchInputRef}/>
			<div data-visible={filteredItems.length === 0}>
				{!searchText ? 'Key in please...' : 'No matched.'}
			</div>
			{filteredItems.map(({ item, parts }) => {
				return <div key={v4()} onClick={onItemClicked(item)}>
					{parts.map(part => <span key={v4()}>{part}</span>)}
				</div>;
			})}
		</Dropdown>
	</FinderContainer>;
};