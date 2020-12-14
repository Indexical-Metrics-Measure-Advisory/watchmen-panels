import {
	faCompressAlt,
	faExpandAlt,
	faExternalLinkAlt,
	faFlagCheckered,
	faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useForceUpdate } from '../../../../common/utils';
import { createSubject } from '../../../../services/console/space';
import { ConnectedConsoleSpace, ConsoleSpaceGroup, ConsoleSpaceSubject } from '../../../../services/console/types';
import { Theme } from '../../../../theme/types';
import { LinkButton } from '../../../component/console/link-button';
import { useDialog } from '../../../context/dialog';
import { createDeleteGroupClickHandler } from '../dialog';
import { useSpaceContext } from '../space-context';
import { useListView } from './list-context';
import { Subject } from './subject';
import { getGroupFilterText, hasFilter, isGroupFilter, matchesFilter } from './utils';

const GroupContainer = styled.div.attrs({
	'data-widget': 'console-list-view-group'
})<{ colorSuffix?: string }>`
	display: flex;
	flex-direction: column;
	position: relative;
	border-radius: calc(var(--border-radius) * 2);
	background-color: ${({ colorSuffix }) => colorSuffix ? `var(--console-bg-color-${colorSuffix})` : 'var(--console-group-bg-color)'};
	padding: 0 calc(var(--margin) / 2);
	margin-bottom: var(--margin);
	overflow: hidden;
	transition: all 300ms ease-in-out;
	&:before {
		content: '';
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		width: 4px;
		height: 100%;
		background-color: ${({ colorSuffix }) => colorSuffix ? `var(--console-color-${colorSuffix})` : 'var(--console-group-quote-color)'};
	}
	&:hover {
		div[data-widget='console-list-view-header-buttons'] {
			opacity: 1;
			pointer-events: auto;
		}
		div[data-widget='console-list-view-subject-header'] {
			> div:first-child > button {
				opacity: 1;
				pointer-events: auto;
			}
		}
	}
	&[data-visible=false] {
		margin-bottom: 0;
		> div {
			height: 0;
		}
	}
`;
const GroupHeader = styled.div.attrs({
	'data-widget': 'console-list-view-group-header'
})`
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 44px;
	> div:first-child {
		font-family: var(--console-title-font-family);
	}
	> div:last-child {
		display: flex;
		opacity: 0;
		pointer-events: none;
		transition: all 300ms ease-in-out;
		> button {
			font-size: 0.8em;
			font-weight: var(--font-bold);
			color: var(--console-primary-color);
			opacity: 0.6;
			&:hover {
				opacity: 1;
			}
			> svg {
				margin-right: calc(var(--margin) / 4);
			}
		}
	}
`;
const GroupName = styled.div`
	display: flex;
	align-items: center;
	&[data-openable=true]:hover {
		cursor: pointer;
		> span {
			color: var(--console-primary-color);
		}
		> svg {
			color: var(--console-primary-color);
			opacity: 1;
			pointer-events: auto;
		}
	}
	> svg {
		margin-left: calc(var(--margin) / 4);
		opacity: 0;
		pointer-events: none;
		transition: all 300ms ease-in-out;
	}
`;
const GroupBody = styled.div.attrs<{ itemCount: number, visible: boolean }>(({ theme, itemCount, visible }) => {
	const t = theme as Theme;
	return {
		'data-widget': 'console-list-view-group-body',
		style: {
			height: visible ? `calc(1.9em + ${itemCount} * ${t.consoleSubjectHeight + 1}px - 1px)` : 0,
			marginBottom: visible ? 'calc(var(--margin) / 2)' : 0
		}
	};
})<{ itemCount: number, visible: boolean }>`
	display: flex;
	flex-direction: column;
	transition: all 300ms ease-in-out;
	margin: 0 calc(var(--margin) / -2);
	overflow: hidden;
`;
const GroupItemHeader = styled.div.attrs({
	'data-widget': 'console-list-view-subject-header'
})`
	display: grid;
	align-items: center;
	grid-template-columns: 1fr 80px 80px 120px 120px 32px;
	grid-column-gap: calc(var(--margin) / 3);
	font-family: var(--console-title-font-family);
	font-size: 0.8em;
	padding: 0 calc(var(--margin) / 2);
	margin: 0 calc(var(--margin) / 2);
	height: 1.6em;
	margin-bottom: 0.5em;
	> div:not(:first-child) {
		opacity: 0.5;
	}
`;

const decorateDisplaySubjects = (subjects: Array<ConsoleSpaceSubject>, filtering: boolean): Array<ConsoleSpaceSubject> => {
	if (subjects.length === 0) {
		return [ {
			subjectId: '-1',
			name: filtering ? 'No matched.' : 'No subject.',
			topicCount: 0,
			graphicsCount: 0,
			lastVisitTime: '',
			createdAt: ''
		} ];
	} else {
		return subjects;
	}
};
const computeDisplaySubjects = (options: {
	filter: string;
	subjects: Array<ConsoleSpaceSubject>;
	group: ConsoleSpaceGroup;
}): {
	visible: boolean;
	subjects: Array<ConsoleSpaceSubject>;
} => {
	const { filter, subjects, group } = options;

	if (!hasFilter(filter)) {
		return { visible: true, subjects: decorateDisplaySubjects(subjects, false) };
	} else if (isGroupFilter(filter)) {
		const name = getGroupFilterText(filter);
		if (!matchesFilter(group.name, name)) {
			return { visible: false, subjects: decorateDisplaySubjects(subjects, false) };
		} else {
			return { visible: true, subjects: decorateDisplaySubjects(subjects, false) };
		}
	} else {
		return {
			visible: true,
			subjects: decorateDisplaySubjects(subjects.filter(subject => matchesFilter(subject.name, filter)), true)
		};
	}
};

export const Group = (props: {
	space: ConnectedConsoleSpace;
	group: ConsoleSpaceGroup;
	colorSuffix?: string;
	openable?: boolean;
	removable?: boolean;
	canAddSubject?: boolean;
}) => {
	const { space, group, colorSuffix, openable = true, removable = true, canAddSubject = true } = props;
	const { subjects } = group;

	const dialog = useDialog();
	const { openGroupIfCan, closeGroupIfCan, openSubjectIfCan } = useSpaceContext();
	const listView = useListView();
	const forceUpdate = useForceUpdate();
	const [ collapsed, setCollapsed ] = useState<boolean>(false);
	useEffect(() => {
		const onCollapsedChanged = (newCollapsed: boolean) => {
			if (newCollapsed === collapsed) {
				return;
			}
			setCollapsed(newCollapsed);
		};
		const onFilterTextChanged = () => forceUpdate();
		listView.addCollapsedChangedListener(onCollapsedChanged);
		listView.addFilterTextChangedListener(onFilterTextChanged);
		return () => {
			listView.removeCollapsedChangedListener(onCollapsedChanged);
			listView.removeFilterTextChangedListener(onFilterTextChanged);
		};
	}, [ listView, collapsed, forceUpdate ]);

	const onOpenGroupClicked = () => openGroupIfCan({ space, group });
	const onToggleExpand = () => setCollapsed(!collapsed);
	const onAddSubjectClicked = async () => {
		const now = dayjs().format('YYYY/MM/DD HH:mm:ss');
		const newSubject = {
			subjectId: '',
			name: 'Noname',
			topicCount: 0,
			graphicsCount: 0,
			lastVisitTime: now,
			createdAt: now
		};
		group.subjects.push(newSubject);
		await createSubject({ space, group, subject: newSubject });
		openSubjectIfCan({ space, group, subject: newSubject });
	};

	const { visible, subjects: displaySubjects } = computeDisplaySubjects({
		filter: listView.store.filter,
		subjects,
		group
	});
	const onDeleteClicked = createDeleteGroupClickHandler({
		dialog,
		space,
		group,
		onDeleted: ({ space, group }) => {
			listView.groupDeleted({ space, group });
			closeGroupIfCan({ space, group });
		}
	});

	return <GroupContainer data-visible={visible} colorSuffix={colorSuffix}>
		<GroupHeader>
			<GroupName data-openable={openable} onClick={openable ? onOpenGroupClicked : (void 0)}>
				<span>{group.name}</span>
				{openable ? <FontAwesomeIcon icon={faExternalLinkAlt}/> : null}
			</GroupName>
			<div data-widget='console-list-view-header-buttons'>
				{canAddSubject
					? <LinkButton onClick={onAddSubjectClicked}>
						<FontAwesomeIcon icon={faFlagCheckered}/>
						<span>Add Subject</span>
					</LinkButton>
					: null}
				{removable
					? <LinkButton onClick={onDeleteClicked}>
						<FontAwesomeIcon icon={faTrashAlt}/>
						<span>Delete Group</span>
					</LinkButton>
					: null
				}
				<LinkButton onClick={onToggleExpand}>
					<FontAwesomeIcon icon={collapsed ? faExpandAlt : faCompressAlt}/>
					{collapsed ? 'Expand' : 'Collapse'}
				</LinkButton>
			</div>
		</GroupHeader>
		<GroupBody visible={!collapsed && visible} itemCount={displaySubjects.length}>
			<GroupItemHeader>
				<div/>
				<div>Relevant Topics</div>
				<div>Graphics</div>
				<div>Last Visit</div>
				<div>Created At</div>
			</GroupItemHeader>
			{displaySubjects.map(subject => {
				return <Subject space={space} group={group} subject={subject} key={subject.subjectId}/>;
			})}
		</GroupBody>
	</GroupContainer>;
};