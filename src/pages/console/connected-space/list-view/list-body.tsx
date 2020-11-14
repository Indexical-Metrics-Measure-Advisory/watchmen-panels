import React from 'react';
import styled from 'styled-components';
import { ConnectedConsoleSpace } from '../../../../services/console/types';
import { ListByGroup } from './list-by-group';
import { ListByVisit } from './list-by-visit';
import { useListView } from './list-context';
import { ViewType } from './types';

const Container = styled.div.attrs({
	'data-widget': 'console-list-view-body'
})`
	display: flex;
`;

export const ListBody = (props: { space: ConnectedConsoleSpace }) => {
	const { space } = props;

	const { viewType } = useListView();
	return <Container>
		{viewType === ViewType.BY_GROUP ? <ListByGroup space={space}/> : null}
		{viewType === ViewType.BY_VISIT ? <ListByVisit space={space}/> : null}
	</Container>;
};