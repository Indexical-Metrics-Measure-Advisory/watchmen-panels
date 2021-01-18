import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import {
	faBars,
	faHistory,
	faPenAlt,
	faPoll,
	faSortAlphaDown,
	faSortAlphaUp,
	faTimes
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useForceUpdate } from '../../../../common/utils';
import { createSubject } from '../../../../services/console/space';
import { ConnectedConsoleSpace, ConsoleSpaceSubject } from '../../../../services/console/types';
import { LinkButton } from '../../../component/console/link-button';
import { useDialog } from '../../../context/dialog';
import { createDeleteGroupClickHandler, createDeleteSubjectClickHandler, createRenameClickHandler } from '../dialog';
import { useSpaceContext } from '../space-context';
import { findParentGroup, getVisitAdvice } from '../utils';

enum SortType {
	BY_NAME_ASC = 'by-name-asc',
	BY_NAME_DESC = 'by-name-desc',
	BY_VISIT_ASC = 'by-visit-asc',
	BY_VISIT_DESC = 'by-visit-desc',
}

const GroupViewContainer = styled.div.attrs({
	'data-widget': 'console-group-view'
})`
	display: flex;
	position: relative;
	width: 100%;
	&[data-min=true] {
		> button {
			opacity: 1;
			pointer-events: auto;
			&:hover {
				box-shadow: var(--console-primary-hover-shadow);
			}
		}
	}
	> button {
		display: block;
		position: absolute;
		opacity: 0;
		font-family: var(--console-title-font-family);
		color: var(--invert-color);
		background-color: var(--console-primary-color);
		top: calc(var(--margin) / 2);
		left: calc(var(--margin) / 2);
		white-space: nowrap;
		padding: 6px calc(var(--margin) / 2);
		border-radius: var(--border-radius);
		box-shadow: var(--console-primary-shadow);
		pointer-events: none;
		z-index: 1;
		transition: all 300ms ease-in-out;
		&:hover:before {
			 display: none;
		}
	}
`;
const SubjectList = styled.div.attrs({
	'data-widget': 'console-group-view-subject-list'
})`
	display: flex;
	flex-direction: column;
	width: 300px;
	height: 100%;
	border-right: var(--border);
	box-shadow: var(--console-hover-shadow);
	transition: all 300ms ease-in-out;
	overflow: hidden;
	&[data-min=true] {
		width: 0;
		border-right-width: 0;
	}
`;
const SubjectListHeader = styled.div.attrs({
	'data-widget': 'console-group-view-subject-list-header'
})`
	display: flex;
	align-items: center;
	height: 40px;
	padding: 0 calc(var(--margin) / 2);
	border-bottom: var(--border);
	transition: all 300ms ease-in-out;
	> div:first-child {
		flex-grow: 1;
		display: flex;
		align-items: center;
		font-family: var(--console-title-font-family);
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	> button {
		height: 20px;
		&:hover {
			color: var(--console-primary-color);
		}
	}
`;
const SubjectListBody = styled.div.attrs({
	'data-widget': 'console-group-view-subject-list-body'
})`
	flex-grow: 1;
	display: flex;
	position: relative;
	flex-direction: column;
`;
const SubjectListBodyWrapper = styled.div`
	display: flex;
	flex-direction: column;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	overflow-x: hidden;
	overflow-y: auto;
	padding: calc(var(--margin) / 2) calc(var(--margin) / 2);
	&::-webkit-scrollbar {
		background-color: transparent;
		width: 4px;
	}
	&::-webkit-scrollbar-track {
		background-color: var(--scrollbar-background-color);
		border-radius: 2px;
	}
	&::-webkit-scrollbar-thumb {
		background-color: var(--console-favorite-color);
		border-radius: 2px;
	}
`;
const SubjectCard = styled.div`
	display: grid;
	position: relative;
	grid-template-columns: 1fr auto;
	grid-column-gap: 8px;
	grid-row-gap: 8px;
	border-radius: calc(var(--border-radius) * 2);
	border: var(--border);
	padding: 0 calc(var(--margin) / 2) calc(var(--margin) / 2);
	box-shadow: var(--console-shadow);
	cursor: pointer;
	margin-bottom: calc(var(--margin) / 2);
	transition: all 300ms ease-in-out;
	&:last-child {
		margin-bottom: 0;
	}
	&:hover {
		box-shadow: var(--console-hover-shadow);
		> div:first-child {
			> button {
				opacity: 1;
			}
		}
	}
	&:before {
		content: '';
		position: absolute;
		top: -1px;
		left: -1px;
		width: calc(100% + 2px);
		height: calc(100% + 2px);
		border-radius: calc(var(--border-radius) * 2);
		background-color: transparent;
		z-index: 1;
		//opacity: 0.2;
		pointer-events: none;
	}
	&[data-visit-advice=recent] {
		border-color: transparent;
		&:before {
			background-color: var(--console-bg-color-recent);
		}
	}
	&[data-visit-advice=week] {
		border-color: transparent;
		&:before {
			background-color: var(--console-bg-color-week);
		}
	}
	&[data-visit-advice=month] {
		border-color: transparent;
		&:before {
			background-color: var(--console-bg-color-month);
		}
	}
	&[data-visit-advice=year] {
		border-color: transparent;
		&:before {
			background-color: var(--console-bg-color-year);
		}
	}
	&[data-visit-advice=ancient] {
		border-color: transparent;
		&:before {
			background-color: var(--console-bg-color-ancient);
		}
	}
	> div {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	> div:first-child {
		grid-column: span 2;
		font-family: var(--console-title-font-family);
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: var(--border);
		> button {
			opacity: 0;
		}
	}
	> div:not(:first-child) {
		font-size: 0.8em;
	}
	> div:nth-child(2n + 1):not(:first-child) {
		justify-self: end;
	}
`;

export const GroupView = (props: {
	space: ConnectedConsoleSpace;
	visible: boolean;
}) => {
	const { space, visible } = props;

	const { groupId } = useParams<{ groupId: string }>();
	const dialog = useDialog();
	const { closeGroupIfCan, groupRenamed, openSubjectIfCan, closeSubjectIfCan } = useSpaceContext();
	const forceUpdate = useForceUpdate();
	const [ min, setMin ] = useState<boolean>(false);
	const [ sort, setSort ] = useState<SortType>(SortType.BY_VISIT_ASC);

	if (!visible) {
		return null;
	}

	// eslint-disable-next-line
	const group = space.groups.find(g => g.groupId == groupId)!;
	const subjects = group.subjects.sort((s1, s2) => {
		switch (sort) {
			case SortType.BY_NAME_ASC:
				return s1.name.toUpperCase().localeCompare(s2.name.toUpperCase());
			case SortType.BY_NAME_DESC:
				return s2.name.toUpperCase().localeCompare(s1.name.toUpperCase());
			case SortType.BY_VISIT_DESC:
				return s1.lastVisitTime.toUpperCase().localeCompare(s2.lastVisitTime.toUpperCase());
			case SortType.BY_VISIT_ASC:
			default:
				return s2.lastVisitTime.toUpperCase().localeCompare(s1.lastVisitTime.toUpperCase());
		}
	});

	const onGroupDeleteClicked = createDeleteGroupClickHandler({
		dialog, space, group,
		onDeleted: ({ space, group }) => closeGroupIfCan({ space, group })
	});
	const onRenameGroupClicked = createRenameClickHandler({
		dialog, space, group,
		asFullName: () => `${space.name} / ${group!.name}`,
		renameObject: (options, newName) => group.name = newName,
		onRenamed: () => {
			groupRenamed({ space, group });
			forceUpdate();
		}
	});
	const onAddClicked = async () => {
		const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
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
	const onSortByNameAscClicked = () => setSort(SortType.BY_NAME_ASC);
	const onSortByNameDescClicked = () => setSort(SortType.BY_NAME_DESC);
	const onSortByVisitAscClicked = () => setSort(SortType.BY_VISIT_ASC);
	const onSortByVisitDescClicked = () => setSort(SortType.BY_VISIT_DESC);
	const onMaxClicked = () => setMin(false);
	const onMinClicked = () => setMin(true);
	const onOpenClicked = (subject: ConsoleSpaceSubject) => () => openSubjectIfCan({ space, group, subject });
	const onSubjectDeleteClicked = (subject: ConsoleSpaceSubject) => createDeleteSubjectClickHandler({
		dialog,
		space,
		group: findParentGroup(subject, space),
		subject,
		onDeleted: ({ space, group, subject }) => closeSubjectIfCan({ space, group, subject })
	});

	return <GroupViewContainer data-min={min}>
		<SubjectList data-min={min}>
			<SubjectListHeader>
				<div>{group.name}</div>
				<LinkButton onClick={onRenameGroupClicked} ignoreHorizontalPadding={true} tooltip='Rename'
				            center={true}>
					<FontAwesomeIcon icon={faPenAlt}/>
				</LinkButton>
				<LinkButton onClick={onGroupDeleteClicked} ignoreHorizontalPadding={true} tooltip='Delete Group'
				            center={true}>
					<FontAwesomeIcon icon={faTrashAlt}/>
				</LinkButton>
				<LinkButton onClick={onMinClicked} ignoreHorizontalPadding={true} tooltip='Minimize' center={true}>
					<FontAwesomeIcon icon={faTimes}/>
				</LinkButton>
			</SubjectListHeader>
			<SubjectListHeader>
				<div>Subjects</div>
				<LinkButton onClick={onAddClicked} ignoreHorizontalPadding={true} tooltip='Add Subject' center={true}>
					<FontAwesomeIcon icon={faPoll}/>
				</LinkButton>
				<LinkButton onClick={onSortByNameAscClicked} ignoreHorizontalPadding={true}
				            tooltip='Sort by Name, Ascending' center={true}>
					<FontAwesomeIcon icon={faSortAlphaUp}/>
				</LinkButton>
				<LinkButton onClick={onSortByNameDescClicked} ignoreHorizontalPadding={true}
				            tooltip='Sort by Name, Descending' center={true}>
					<FontAwesomeIcon icon={faSortAlphaDown}/>
				</LinkButton>
				<LinkButton onClick={onSortByVisitAscClicked} ignoreHorizontalPadding={true}
				            tooltip='Sort by Visit, Latest on Top' center={true}>
					<FontAwesomeIcon icon={faHistory} style={{ transform: 'rotateY(180deg)' }}/>
				</LinkButton>
				<LinkButton onClick={onSortByVisitDescClicked} ignoreHorizontalPadding={true}
				            tooltip='Sort by Visit, Latest on Bottom' center={true}>
					<FontAwesomeIcon icon={faHistory}/>
				</LinkButton>
			</SubjectListHeader>
			<SubjectListBody>
				<SubjectListBodyWrapper>
					{subjects.length === 0
						? <div>No Subject.</div>
						: subjects.map(subject => {
							const visitAdvice = getVisitAdvice(subject.lastVisitTime);
							return <SubjectCard data-visit-advice={visitAdvice} key={subject.subjectId}
							                    onClick={onOpenClicked(subject)}>
								<div>
									<span>{subject.name}</span>
									<LinkButton onClick={onSubjectDeleteClicked(subject)} ignoreHorizontalPadding={true}
									            tooltip='Delete Subject' center={true}>
										<FontAwesomeIcon icon={faTrashAlt}/>
									</LinkButton>
								</div>
								<div>Topics:</div>
								<div>{subject.topicCount}</div>
								<div>Graphics:</div>
								<div>{subject.graphicsCount}</div>
								<div>Created At:</div>
								<div>{dayjs(subject.createdAt).fromNow()}</div>
								<div>Last Visit:</div>
								<div>{dayjs(subject.lastVisitTime).fromNow()}</div>
							</SubjectCard>;
						})}
				</SubjectListBodyWrapper>
			</SubjectListBody>
		</SubjectList>
		<LinkButton onClick={onMaxClicked} ignoreHorizontalPadding={true}
		            tooltip='Show Group View Menus'>
			<FontAwesomeIcon icon={faBars}/>
		</LinkButton>
	</GroupViewContainer>;
};