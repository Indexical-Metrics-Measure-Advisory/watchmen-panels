import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { ConnectedConsoleSpace } from '../../../../services/console/types';
import Input from '../../../component/input';
import Radio from '../../../component/radio';
import { TooltipAlignment, useTooltip } from '../../context/console-tooltip';
import { useListView } from './list-context';
import { ViewType } from './types';

const Container = styled.div.attrs({
	'data-widget': 'console-list-view-header'
})`
	display: flex;
	align-items: center;
	margin-bottom: calc(var(--margin) / 2);
	> div:first-child {
		flex-grow: 1;
	}
`;
const NameFilter = styled(Input)`
	min-width: 200px;
	font-size: 0.8em;
	&:hover {
		border-color: var(--console-primary-color);
	}
	&:focus {
		border-color: var(--console-primary-color);
		box-shadow: var(--console-hover-shadow);
	}
`;
const HeaderButtons = styled.div`
	display: flex;
	align-items: center;
	> div {
		display: flex;
		position: relative;
		align-items: center;
		padding: 0 calc(var(--margin) / 3);
		&:not(:first-child) {
			&:before {
				content: '';
				display: block;
				position: absolute;
				top: 20%;
				left: 0;
				width: 1px;
				height: 60%;
				background-color: var(--border-color);
			}
		}
		> *:not(:first-child) {
			margin-left: calc(var(--margin) / 4);
		}
	}
`;
const ViewTypeRadio = styled.div`
	display: flex;
	align-items: center;
	border-radius: var(--border-radius);
	cursor: pointer;
	&:hover {
		color: var(--console-primary-color);
		> div:first-child {
			border-color: var(--console-primary-color);
			&:before {
				background-color: var(--console-primary-color);
			}
		}
	}
	> div:first-child {
		margin-top: 2px;
		margin-right: calc(var(--margin) / 5);
		transform: scale(0.7);
		transform-origin: center center;
		&:hover {
			border-color: var(--console-primary-color);
			&:before {
				background-color: var(--console-primary-color);
			}
		}
	}
	> span {
		font-size: 0.8em;
		font-weight: var(--font-demi-bold);
		transition: all 300ms ease-in-out;
	}
`;
const Button = styled.button`
	display: flex;
	position: relative;
	height: 24px;
	align-items: center;
	justify-content: center;
	margin: 0 calc(var(--margin) / -4);
	padding: 0 calc(var(--margin) / 4);
	border: 0;
	border-radius: var(--border-radius);
	font-family: var(--console-font-family);
	font-size: 0.8em;
	font-weight: var(--font-demi-bold);
	appearance: none;
	outline: none;
	color: var(--console-font-color);
	background-color: transparent;
	cursor: pointer;
	transition: all 300ms ease-in-out;
	&[data-visible=false] {
		opacity: 0;
		pointer-events: none;
	}
	&:hover {
		color: var(--console-primary-color);
		background-color: var(--invert-color);
		box-shadow: var(--console-hover-shadow);
	}
	> svg {
		margin-right: calc(var(--margin) / 4);
	}
`;

let filterTextChangeTimer: number | null = null;
const clearFilterTextChangeTimer = () => {
	if (filterTextChangeTimer != null) {
		clearTimeout(filterTextChangeTimer);
	}

};
export const ListHeader = (props: {
	space: ConnectedConsoleSpace
}) => {
	const { viewType, setViewType, toggleCollapsed } = useListView();

	const filterRef = useRef<HTMLInputElement>(null);
	const listView = useListView();
	const { mouseEnter, mouseLeave } = useTooltip({
		show: true,
		ref: filterRef,
		tooltip: 'Filter group by "g:name"',
		rect: () => ({ align: TooltipAlignment.LEFT, offsetY: 8 })
	});
	useEffect(() => {
		const onFilterCleared = () => {
			filterRef.current!.value = '';
			// force invoke text changed
			listView.filterTextChanged('');
		};
		listView.addFilterClearedListener(onFilterCleared);
		return () => {
			listView.addFilterClearedListener(onFilterCleared);
		};
	}, [ listView ]);

	const onFilterTextChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = (event.target.value || '').trim();

		clearFilterTextChangeTimer();
		filterTextChangeTimer = setTimeout(() => {
			clearFilterTextChangeTimer();
			listView.filterTextChanged(value);
		}, 300);
	};
	const onViewTypeChanged = (newViewType: ViewType) => () => {
		if (newViewType === viewType) {
			return;
		}
		setViewType(newViewType);
	};

	return <Container>
		<div>
			<NameFilter placeholder='Filter by name...' onChange={onFilterTextChanged}
			            ref={filterRef} onMouseEnter={mouseEnter} onMouseLeave={mouseLeave}/>
		</div>
		<HeaderButtons>
			<div>
				<ViewTypeRadio onClick={onViewTypeChanged(ViewType.BY_GROUP)}>
					<Radio selected={viewType === ViewType.BY_GROUP}/>
					<span>By Group</span>
				</ViewTypeRadio>
				<ViewTypeRadio onClick={onViewTypeChanged(ViewType.BY_VISIT)}>
					<Radio selected={viewType === ViewType.BY_VISIT}/>
					<span>By Visit</span>
				</ViewTypeRadio>
			</div>
			<div>
				<Button onClick={() => toggleCollapsed(true)}>Collapse All</Button>
				<Button onClick={() => toggleCollapsed(false)}>Expand All</Button>
			</div>
		</HeaderButtons>
	</Container>;
};