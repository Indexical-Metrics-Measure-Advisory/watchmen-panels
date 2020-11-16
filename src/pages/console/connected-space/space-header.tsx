import { faBezierCurve, faCube, faPoll, faServer } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { matchPath, useHistory, useLocation } from 'react-router-dom';
import Path, { toConnectedSpace } from '../../../common/path';
import { ConnectedConsoleSpace, ConsoleSpaceGroup, ConsoleSpaceSubject } from '../../../services/console/types';
import { Header } from './components';
import { useSpaceContext } from './space-context';
import { SpaceHeaderTitle } from './space-header-title';
import { Tab, Tabs } from './tabs';

export const ConnectedSpaceHeader = (props: {
	space: ConnectedConsoleSpace
}) => {
	const { space } = props;
	const { groups } = space;
	const allSubjects = [
		...space.subjects.map(s => ({
			group: void 0,
			subject: s
		})),
		...groups.map(g => g.subjects.map(s => ({
			group: g,
			subject: s
		}))).flat()
	];

	const location = useLocation();
	const history = useHistory();
	const { isGroupOpened, openGroupIfCan, isSubjectOpened, openSubjectIfCan } = useSpaceContext();

	const isOverallActive = !!matchPath(location.pathname, Path.CONSOLE_CONNECTED_SPACE_OVERALL);
	const isResourcesActive = !!matchPath(location.pathname, Path.CONSOLE_CONNECTED_SPACE_RESOURCES);
	const isGroupsActive = matchPath<{ groupId: string }>(location.pathname, Path.CONSOLE_CONNECTED_SPACE_GROUP);
	const isSubjectsActive = matchPath<{ subjectId: string }>(location.pathname, Path.CONSOLE_CONNECTED_SPACE_SUBJECT);

	const onOverallClicked = () => history.push(toConnectedSpace(Path.CONSOLE_CONNECTED_SPACE_OVERALL, space.connectId));
	const onResourcesClicked = () => history.push(toConnectedSpace(Path.CONSOLE_CONNECTED_SPACE_RESOURCES, space.connectId));
	const onGroupTabClicked = (group: ConsoleSpaceGroup) => () => openGroupIfCan({ space, group });
	const onSubjectTabClicked = (subject: ConsoleSpaceSubject, group?: ConsoleSpaceGroup) => () => {
		openSubjectIfCan({ space, group, subject });
	};

	return <Header>
		<SpaceHeaderTitle space={space}/>
		<Tabs>
			<Tab active={isOverallActive} icon={faServer} label='Overall'
			     onClick={onOverallClicked}/>
			{groups.filter(isGroupOpened)
				.map(group => {
					// eslint-disable-next-line
					const isCurrentGroupActive = isGroupsActive && isGroupsActive.params.groupId == group.groupId;
					return <Tab active={!!isCurrentGroupActive}
					            icon={faCube}
					            label={group.name}
					            onClick={onGroupTabClicked(group)}
					            key={group.groupId}/>;
				})}
			{allSubjects.filter(({ subject }) => isSubjectOpened(subject))
				.map(({ group, subject }) => {
					// eslint-disable-next-line
					const isCurrentSubjectActive = isSubjectsActive && isSubjectsActive.params.subjectId == subject.subjectId;
					return <Tab active={!!isCurrentSubjectActive}
					            icon={faPoll}
					            label={group ? `${group.name} / ${subject.name}` : subject.name}
					            onClick={onSubjectTabClicked(subject, group)}
					            key={subject.subjectId}/>;
				})}
			<Tab active={isResourcesActive} icon={faBezierCurve} label='Available Resources'
			     onClick={onResourcesClicked}/>
		</Tabs>
	</Header>;
};
