import React, { useState } from 'react';
import styled from 'styled-components';
import { ConnectedConsoleSpace } from '../../../../services/console/types';
import Input from '../../../component/input';
import Radio from '../../../component/radio';
import { useListView } from './list-context';
import { ViewType } from './types';

const Container = styled.div`
	display: flex;
	justify-content: space-between;
	margin-bottom: var(--margin);
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
`;
const ViewTypeRadio = styled.div`
	display: flex;
	align-items: center;
	margin-left: calc(var(--margin) / 4);
	cursor: pointer;
	> div:first-child {
		margin-right: calc(var(--margin) / 5);
		transform: scale(0.8);
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
		margin-top: -2px;
		transition: all 300ms ease-in-out;
	}
`;

export const ListHeader = (props: {
	space: ConnectedConsoleSpace
}) => {
	const listView = useListView();

	const [ viewType, setViewType ] = useState(ViewType.BY_GROUP);
	const onViewTypeChanged = (newViewType: ViewType) => () => {
		if (newViewType === viewType) {
			return;
		}
		setViewType(newViewType);
		listView.viewTypeChanged(newViewType);
	};


	return <Container>
		<NameFilter placeholder='Filter by name...'/>
		<HeaderButtons>
			<ViewTypeRadio onClick={onViewTypeChanged(ViewType.BY_GROUP)}>
				<Radio selected={viewType === ViewType.BY_GROUP}/>
				<span>By Group</span>
			</ViewTypeRadio>
			<ViewTypeRadio onClick={onViewTypeChanged(ViewType.BY_VISIT)}>
				<Radio selected={viewType === ViewType.BY_VISIT}/>
				<span>By Visit</span>
			</ViewTypeRadio>
		</HeaderButtons>
	</Container>;
};