import dayjs from 'dayjs';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { ConnectedConsoleSpace, ConsoleSpaceGroup, ConsoleSpaceSubject } from '../../../../services/console/types';
import { Group } from './group';
import { useListView } from './list-context';
import { ViewType } from './types';

const Container = styled.div.attrs({
	'data-widget': 'console-list-by-visit'
})`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
`;

const FromGroup = styled.span`
	display: inline-block;
	opacity: 0.5;
	margin-left: calc(var(--margin) / 3);
	transform-origin: left bottom;
	transform: scale(0.8);
`;

export const ListByVisit = (props: { space: ConnectedConsoleSpace }) => {
	const { space } = props;
	const { subjects, groups } = space;

	const { viewType } = useListView();

	const timeGroups: Array<ConsoleSpaceGroup & { colorSuffix: string }> = [
		{ groupId: '-1', name: 'Most Recently', subjects: [], colorSuffix: 'recent' },
		{ groupId: '-2', name: 'In A Month', subjects: [], colorSuffix: 'month' },
		{ groupId: '-3', name: 'In A Year', subjects: [], colorSuffix: 'year' },
		{ groupId: '-4', name: 'Long Long Ago', subjects: [], colorSuffix: 'ancient' }
	];

	const now = dayjs();
	[ ...subjects, ...groups.reduce((all, group) => {
		all.push(...group.subjects.map(subject => {
			return {
				...subject,
				nameAs: <Fragment>
					<span>{subject.name}</span>
					<FromGroup>{group.name}</FromGroup>
				</Fragment>
			};
		}));
		return all;
	}, [] as Array<ConsoleSpaceSubject>) ].forEach(subject => {
		const { lastVisitTime } = subject;
		const days = now.diff(dayjs(lastVisitTime), 'day');
		if (days > 365) {
			timeGroups[3].subjects.push(subject);
		} else if (days > 30) {
			timeGroups[2].subjects.push(subject);
		} else if (days > 7) {
			timeGroups[1].subjects.push(subject);
		} else {
			timeGroups[0].subjects.push(subject);
		}
	});

	return <Container data-visible={viewType === ViewType.BY_VISIT}>
		{timeGroups.map(group => {
			return <Group space={space} group={group}
			              colorSuffix={group.colorSuffix} removable={false} canAddSubject={false}
			              key={group.groupId}/>;
		})}
	</Container>;
};