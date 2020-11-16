import { faBezierCurve, faCube, faPoll, faServer } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useState } from 'react';
import { matchPath, useHistory, useLocation } from 'react-router-dom';
import Path, { toConnectedSpace } from '../../../common/path';
import { ConnectedConsoleSpace, ConsoleSpaceGroup, ConsoleSpaceSubject } from '../../../services/console/types';
import { Header, hideMenu, Menu, MenuItem, MenuState, showMenu, useMenu } from './components';
import { useSpaceContext } from './space-context';
import { SpaceHeaderTitle } from './space-header-title';
import { Tab, Tabs } from './tabs';

const offset = { offsetX: 6, offsetY: -1 };
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
	const {
		store: { activeGroupId, activeSubjectId },
		isGroupOpened, openGroupIfCan,
		isSubjectOpened, openSubjectIfCan
	} = useSpaceContext();
	const groupTabRef = useRef<HTMLDivElement>(null);
	const [ groupMenuShown, setGroupMenuShown ] = useState<MenuState>({
		left: 0,
		top: 0,
		visible: false
	});
	const subjectTabRef = useRef<HTMLDivElement>(null);
	const [ subjectMenuShown, setSubjectMenuShown ] = useState<MenuState>({
		left: 0,
		top: 0,
		visible: false
	});
	useMenu({ containerRef: groupTabRef, state: groupMenuShown, changeState: setGroupMenuShown, ...offset });
	useMenu({ containerRef: subjectTabRef, state: subjectMenuShown, changeState: setSubjectMenuShown, ...offset });

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

	let openedGroups = groups.filter(isGroupOpened).sort((g1, g2) => g1.name.toUpperCase().localeCompare(g2.name.toUpperCase()));
	// eslint-disable-next-line
	const activeGroup = openedGroups.length !== 0 ? openedGroups.find(g => g.groupId == activeGroupId)! : null;
	openedGroups = openedGroups.filter(g => g !== activeGroup);
	let openedSubjects = allSubjects.filter(({ subject }) => isSubjectOpened(subject))
		.sort((s1, s2) => {
			switch (true) {
				case !s1.group && !s2.group:
					return s1.subject.name.toUpperCase().localeCompare(s2.subject.name.toUpperCase());
				case !s1.group && s2.group:
					return -1;
				case s1.group && !s2.group:
					return 1;
				case !!s1.group && !!s2.group:
				default:
					const groupCompare = s1.group!.name.toUpperCase().localeCompare(s2.group!.name.toUpperCase());
					if (groupCompare === 0) {
						return s1.subject.name.toUpperCase().localeCompare(s2.subject.name.toUpperCase());
					} else {
						return groupCompare;
					}
			}
		});
	// eslint-disable-next-line
	const activeSubject = openedSubjects.length !== 0 ? openedSubjects.find(s => s.subject.subjectId == activeSubjectId)! : null;
	openedSubjects = openedSubjects.filter(s => s !== activeSubject);

	const onMoreGroupClicked = (event: React.MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();
		showMenu({
			containerRef: groupTabRef, state: groupMenuShown, changeState: setGroupMenuShown, ...offset
		});
	};
	const onMoreSubjectClicked = (event: React.MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();
		showMenu({ containerRef: subjectTabRef, state: subjectMenuShown, changeState: setSubjectMenuShown, ...offset });
	};
	const onGroupOpenClicked = (group: ConsoleSpaceGroup) => (event: React.MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();
		hideMenu({ containerRef: groupTabRef, changeState: setGroupMenuShown, ...offset });
		openGroupIfCan({ space, group });
	};
	const onSubjectOpenClicked = (subject: ConsoleSpaceSubject, group?: ConsoleSpaceGroup) => (event: React.MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();
		hideMenu({ containerRef: subjectTabRef, changeState: setSubjectMenuShown, ...offset });
		openSubjectIfCan({ space, group, subject });
	};

	return <Header>
		<SpaceHeaderTitle space={space}/>
		<Tabs>
			<Tab active={isOverallActive} icon={faServer} label='Overall'
			     onClick={onOverallClicked}/>
			{activeGroup
				? <Tab active={!!isGroupsActive}
				       icon={faCube}
				       label={activeGroup.name}
				       onClick={onGroupTabClicked(activeGroup)}
				       moreClick={openedGroups.length > 0 ? onMoreGroupClicked : (void 0)}
				       more={<Menu {...groupMenuShown} itemCount={openedGroups.length}>
					       {openedGroups.map(group => {
						       return <MenuItem onClick={onGroupOpenClicked(group)} key={group.groupId}>
							       <FontAwesomeIcon icon={faCube}/>
							       <span>{group.name}</span>
						       </MenuItem>;
					       })}
				       </Menu>}
				       ref={groupTabRef}/>
				: null}
			{activeSubject
				? <Tab active={!!isSubjectsActive}
				       icon={faPoll}
				       label={activeSubject.group ? `${activeSubject.group.name} / ${activeSubject.subject.name}` : activeSubject.subject.name}
				       onClick={onSubjectTabClicked(activeSubject.subject, activeSubject.group)}
				       moreClick={openedSubjects.length > 0 ? onMoreSubjectClicked : (void 0)}
				       more={<Menu {...subjectMenuShown} itemCount={openedSubjects.length}>
					       {openedSubjects.map(({ group, subject }) => {
						       return <MenuItem onClick={onSubjectOpenClicked(subject, group)} key={subject.subjectId}>
							       <FontAwesomeIcon icon={faPoll}/>
							       <span>{group ? `${group.name} / ${subject.name}` : subject.name}</span>
						       </MenuItem>;
					       })}
				       </Menu>}
				       ref={subjectTabRef}/>
				: null}
			<Tab active={isResourcesActive} icon={faBezierCurve} label='Available Resources'
			     onClick={onResourcesClicked}/>
		</Tabs>
	</Header>;
};
