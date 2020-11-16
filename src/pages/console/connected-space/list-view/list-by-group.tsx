import React from 'react';
import styled from 'styled-components';
import { ConnectedConsoleSpace, ConsoleSpaceGroup } from '../../../../services/console/types';
import { Group } from './group';
import { useListView } from './list-context';
import { ViewType } from './types';

const Container = styled.div.attrs({
	'data-widget': 'console-list-by-group'
})`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
`;

export const ListByGroup = (props: { space: ConnectedConsoleSpace }) => {
	const { space } = props;
	const { subjects, groups } = space;

	const { viewType } = useListView();

	let ungroup: ConsoleSpaceGroup | null = null;
	if (subjects && subjects.length !== 0) {
		ungroup = {
			groupId: '-1',
			name: 'Ungrouped',
			subjects
		};
	}

	return <Container data-visible={viewType === ViewType.BY_GROUP}>
		{ungroup ?
			<Group space={space} group={ungroup} colorSuffix='ungroup' openable={false} removable={false}/> : null}
		{groups.map(group => {
			return <Group space={space} group={group} key={group.groupId}/>;
		})}
	</Container>;
};