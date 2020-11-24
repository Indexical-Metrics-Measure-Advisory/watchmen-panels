import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCube, faEllipsisH, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ForwardedRef, forwardRef, useEffect, useReducer, useRef, useState } from 'react';
import { matchPath, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Path from '../../../common/path';
import { ConnectedConsoleSpace, ConsoleSpaceGroup, ConsoleSpaceSubject } from '../../../services/console/types';
import { LinkButton } from '../../component/console/link-button';
import { hideMenu, Menu, MenuItem, MenuState, MenuStateAlignment, showMenu, useMenu } from './components';
import { SubjectClosedListener, useSpaceContext } from './space-context';
import { TabContainer } from './tabs';

interface SubjectItem {
	group?: ConsoleSpaceGroup;
	subject: ConsoleSpaceSubject;
}

const offset = { offsetX: 0, offsetY: -1 };

const DropdownTabContainer = styled(TabContainer)`
	&:hover {
		> span:nth-child(3) {
			opacity: 1;
		}
	}
	> span:nth-child(3) {
		height: 20px;
		text-align: center;
		line-height: 20px;
		margin-left: calc(var(--margin) / 4);
		padding: 0 calc(var(--margin) / 3);
		border-radius: 10px;
		color: var(--invert-color);
		background-color: ${({ active }) => active ? 'var(--console-primary-color)' : 'var(--console-font-color)'};
		opacity: ${({ active }) => active ? 1 : 0.6};
		transform-origin: center center;
		transform: scaleX(0.8) scaleY(0.8);
		transition: all 300ms ease-in-out;
	}
	> button {
		margin-left: calc(var(--margin) / 4);
		color: ${({ active }) => active ? 'var(--console-primary-color)' : 'var(--console-font-color)'};
		opacity: ${({ active }) => active ? 1 : 0.6};
		transition: all 300ms ease-in-out;
	}
`;
const DropdownMenuItem = styled(MenuItem)`
	&:hover {
		> button:nth-child(3) {
			opacity: 1;
			pointer-events: auto;
		}
	}
	> button:nth-child(3) {
		margin-left: calc(var(--margin) / 4);
		opacity: 0;
		pointer-events: none;
	}
`;

export const DropdownTab = forwardRef((props: {
	active: boolean;
	icon: IconProp;
	label?: string;
	onTabClicked: () => void;
	onTabCloseClicked: () => void;
	showDropdown: () => void;
	dropdownItemsCount: number;
	children?: ((props: any) => React.ReactNode) | React.ReactNode;
}, ref: ForwardedRef<HTMLDivElement>) => {
	const {
		active,
		icon, label,
		onTabClicked, onTabCloseClicked, showDropdown, dropdownItemsCount,
		children
	} = props;

	const onMoreClicked = (event: React.MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();
		showDropdown();
	};
	const onCloseClicked = (event: React.MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();
		onTabCloseClicked();
	};

	return <DropdownTabContainer active={active} onClick={onTabClicked} ref={ref}>
		<FontAwesomeIcon icon={icon}/>
		<span>{label}</span>
		{children
			? <span>{dropdownItemsCount + 1}</span>
			: null}
		{children
			? <LinkButton onClick={onMoreClicked} ignoreHorizontalPadding={true}>
				<FontAwesomeIcon icon={faEllipsisH}/>
			</LinkButton>
			: null}
		<LinkButton onClick={onCloseClicked} ignoreHorizontalPadding={true}>
			<FontAwesomeIcon icon={faTimes}/>
		</LinkButton>
		{children}
		<div/>
		<div/>
	</DropdownTabContainer>;
});

export const DropdownTabWithData = <T extends ConsoleSpaceGroup | SubjectItem>(props: {
	active: boolean;
	tab: {
		icon: IconProp;
		label: string;
		onClicked: () => void;
		onCloseClicked: () => void;
	},
	dropdown: {
		items: Array<T>;
		onClicked: (item: T) => void;
		onCloseClicked: (item: T) => void;
		asKey: (item: T) => string;
		asLabel: (item: T) => string;
	}
}) => {
	const {
		active,
		tab: { icon, label, onClicked: onTabClicked, onCloseClicked: onTabCloseClicked },
		dropdown: { items: dropdownItems, onClicked: onItemClicked, onCloseClicked: onItemCloseClicked, asKey: itemAsKey, asLabel: itemAsLabel }
	} = props;

	const containerRef = useRef<HTMLDivElement>(null);
	const [ menuState, setMenuState ] = useState<MenuState>({
		align: MenuStateAlignment.RIGHT,
		left: 0,
		right: 0,
		top: 0,
		visible: false
	});
	useMenu({ containerRef, state: menuState, changeState: setMenuState, ...offset });

	const onMenuItemClicked = (item: T) => (event: React.MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();
		hideMenu({ containerRef, changeState: setMenuState, align: menuState.align, ...offset });
		onItemClicked(item);
	};
	const onMenuItemCloseClicked = (item: T) => (event: React.MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();
		onItemCloseClicked(item);
	};

	const showDropdown = () => showMenu({
		containerRef,
		state: menuState,
		changeState: setMenuState,
		...offset
	});

	return <DropdownTab active={active} icon={icon} label={label}
	                    onTabClicked={onTabClicked} onTabCloseClicked={onTabCloseClicked}
	                    showDropdown={showDropdown} dropdownItemsCount={dropdownItems.length}
	                    ref={containerRef}>
		{dropdownItems.length !== 0
			? <Menu {...menuState} itemCount={dropdownItems.length}>
				{dropdownItems.map(item => {
					return <DropdownMenuItem key={itemAsKey(item)} onClick={onMenuItemClicked(item)}>
						<FontAwesomeIcon icon={icon}/>
						<span>{itemAsLabel(item)}</span>
						<LinkButton onClick={onMenuItemCloseClicked(item)} ignoreHorizontalPadding={true}>
							<FontAwesomeIcon icon={faTimes}/>
						</LinkButton>
					</DropdownMenuItem>;
				})}
			</Menu>
			: null}
	</DropdownTab>;
};

export const GroupTab = (props: { space: ConnectedConsoleSpace }) => {
	const { space } = props;

	const location = useLocation();
	const {
		store: { activeGroupId },
		isGroupOpened, openGroupIfCan, closeGroupIfCan,
		addGroupClosedListener, removeGroupClosedListener,
		addGroupRenamedListener, removeGroupRenamedListener
	} = useSpaceContext();
	const [ , forceUpdate ] = useReducer(x => x + 1, 0);
	useEffect(() => {
		// group already be removed from active stack, force update is only option here
		const groupListener = () => forceUpdate();
		addGroupClosedListener(groupListener);
		addGroupRenamedListener(groupListener);
		return () => {
			removeGroupClosedListener(groupListener);
			removeGroupRenamedListener(groupListener);
		};
	}, [ addGroupClosedListener, removeGroupClosedListener, addGroupRenamedListener, removeGroupRenamedListener ]);

	const { groups } = space;
	let openedGroups = groups.filter(isGroupOpened).sort((g1, g2) => g1.name.toUpperCase().localeCompare(g2.name.toUpperCase()));
	// eslint-disable-next-line
	const activeGroup = openedGroups.length !== 0 ? openedGroups.find(g => g.groupId == activeGroupId)! : null;

	if (!activeGroup) {
		return null;
	}

	const isGroupsActive = matchPath<{ groupId: string }>(location.pathname, Path.CONSOLE_CONNECTED_SPACE_GROUP);
	openedGroups = openedGroups.filter(g => g !== activeGroup);

	const onGroupTabClicked = () => openGroupIfCan({ space, group: activeGroup });
	const onGroupTabCloseClicked = () => closeGroupIfCan({ space, group: activeGroup });
	const onGroupOpenClicked = (group: ConsoleSpaceGroup) => openGroupIfCan({ space, group });
	const onGroupCloseClicked = (group: ConsoleSpaceGroup) => closeGroupIfCan({ space, group });
	const asKey = (group: ConsoleSpaceGroup) => group.groupId;
	const asLabel = (group: ConsoleSpaceGroup) => group.name;

	const tab = {
		icon: faCube,
		label: activeGroup.name,
		onClicked: onGroupTabClicked,
		onCloseClicked: onGroupTabCloseClicked
	};
	const dropdown = {
		items: openedGroups,
		onClicked: onGroupOpenClicked,
		onCloseClicked: onGroupCloseClicked,
		asKey,
		asLabel
	};

	return <DropdownTabWithData active={!!isGroupsActive} tab={tab} dropdown={dropdown}/>;
};

const asSubjectLabel = (data: { group?: ConsoleSpaceGroup, subject: ConsoleSpaceSubject }): string => {
	const { group, subject } = data;
	return group ? `${group.name} / ${subject.name}` : subject.name;
};

const getAllSubjects = (space: ConnectedConsoleSpace, isSubjectOpened: (subject: ConsoleSpaceSubject) => boolean) => {
	const { groups } = space;
	return [
		...space.subjects.map(s => ({
			group: void 0,
			subject: s
		})),
		...groups.map(g => g.subjects.map(s => ({
			group: g,
			subject: s
		}))).flat()
	].filter(({ subject }) => isSubjectOpened(subject));
};
const sortSubjects = (subjects: Array<SubjectItem>) => {
	return subjects
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
};

export const SubjectTab = (props: { space: ConnectedConsoleSpace }) => {
	const { space } = props;

	const location = useLocation();
	const {
		store: { activeSubjectId },
		isSubjectOpened, openSubjectIfCan, closeSubjectIfCan,
		addSubjectClosedListener, removeSubjectClosedListener
	} = useSpaceContext();
	const [ , forceUpdate ] = useReducer(x => x + 1, 0);
	useEffect(() => {
		// subject already be removed from active stack, force update is only option here
		const subjectClosedListener: SubjectClosedListener = () => forceUpdate();
		addSubjectClosedListener(subjectClosedListener);
		return () => removeSubjectClosedListener(subjectClosedListener);
	}, [ addSubjectClosedListener, removeSubjectClosedListener ]);

	// eslint-disable-next-line
	const allSubjects = getAllSubjects(space, isSubjectOpened);
	let openedSubjects = sortSubjects(allSubjects);
	// eslint-disable-next-line
	const activeSubject = openedSubjects.length !== 0 ? openedSubjects.find(s => s.subject.subjectId == activeSubjectId)! : null;

	if (!activeSubject) {
		return null;
	}

	const isSubjectsActive = matchPath<{ subjectId: string }>(location.pathname, Path.CONSOLE_CONNECTED_SPACE_SUBJECT);
	openedSubjects = openedSubjects.filter(s => s !== activeSubject);

	const onSubjectTabClicked = () => openSubjectIfCan({ space, ...activeSubject });
	const onSubjectTabCloseClicked = () => closeSubjectIfCan({ space, ...activeSubject });
	const onSubjectOpenClicked = ({ subject, group }: SubjectItem) => openSubjectIfCan({ space, group, subject });
	const onSubjectCloseClicked = ({ subject, group }: SubjectItem) => closeSubjectIfCan({ space, group, subject });
	const asKey = ({ subject }: SubjectItem) => subject.subjectId;
	const asLabel = ({ subject, group }: SubjectItem) => asSubjectLabel({ group, subject });

	const tab = {
		icon: faCube,
		label: asSubjectLabel(activeSubject),
		onClicked: onSubjectTabClicked,
		onCloseClicked: onSubjectTabCloseClicked
	};
	const dropdown = {
		items: openedSubjects,
		onClicked: onSubjectOpenClicked,
		onCloseClicked: onSubjectCloseClicked,
		asKey,
		asLabel
	};

	return <DropdownTabWithData active={!!isSubjectsActive} tab={tab} dropdown={dropdown}/>;
};