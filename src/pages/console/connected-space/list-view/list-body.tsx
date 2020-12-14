import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useForceUpdate } from '../../../../common/utils';
import { ConnectedConsoleSpace } from '../../../../services/console/types';
import { ListByGroup } from './list-by-group';
import { ListByVisit } from './list-by-visit';
import { useListView } from './list-context';
import { ViewType } from './types';
import { hasFilter, isGroupFilter } from './utils';

const Container = styled.div.attrs({
	'data-widget': 'console-list-view-body'
})`
	display: flex;
	flex-direction: column;
`;
const Filter = styled.div`
	align-self: center;
	font-size: 0.8em;
	height: 0;
	margin-bottom: 0;
	overflow: hidden;
	transition: all 300ms ease-in-out;
	&[data-visible=true] {
		height: 16px;
		margin-bottom: var(--margin);
	}
	> span {
		text-decoration: underline;
		cursor: pointer;
	}
`;

const FilterReminder = () => {
	const listView = useListView();
	const { store: { filter } } = listView;

	const forceUpdate = useForceUpdate();
	useEffect(() => {
		listView.addFilterTextChangedListener(forceUpdate);
		return () => {
			listView.removeFilterTextChangedListener(forceUpdate);
		};
	}, [ listView, filter, forceUpdate ]);

	const filtering = hasFilter(filter);
	const groupFiltering = isGroupFilter(filter);
	const onClearFilterClicked = () => listView.clearFilter();

	return <Filter data-visible={filtering}>
		{groupFiltering ? 'Groups' : 'Subjects'} are hidden. To show all contents, <span onClick={onClearFilterClicked}>clear filter</span>
	</Filter>;
};

export const ListBody = (props: { space: ConnectedConsoleSpace }) => {
	const { space } = props;

	const { viewType } = useListView();

	return <Container>
		{viewType === ViewType.BY_GROUP ? <ListByGroup space={space}/> : null}
		{viewType === ViewType.BY_VISIT ? <ListByVisit space={space}/> : null}
		<FilterReminder/>
	</Container>;
};