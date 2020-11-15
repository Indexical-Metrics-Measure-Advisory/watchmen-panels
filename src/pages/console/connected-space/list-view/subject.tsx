import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import React, { Fragment, useRef } from 'react';
import styled from 'styled-components';
import { deleteSubject } from '../../../../services/console/space';
import { ConnectedConsoleSpace, ConsoleSpaceGroup, ConsoleSpaceSubject } from '../../../../services/console/types';
import Button, { ButtonType } from '../../../component/button';
import { useDialog } from '../../../context/dialog';
import { TooltipAlignment, useTooltip } from '../../context/console-tooltip';
import { useListView } from './list-context';

const SubjectContainer = styled.div.attrs({
	'data-widget': 'console-list-view-subject'
})`
	display: grid;
	grid-template-columns: 1fr 80px 80px 120px 120px 32px;
	grid-column-gap: calc(var(--margin) / 3);
	align-items: center;
	height: var(--console-subject-height);
	margin: 0 calc(var(--margin) / 2) 1px;
	padding: 0 calc(var(--margin) / 2);
	background-color: var(--bg-color);
	
	cursor: pointer;
	&:nth-child(2) {
		border-top-left-radius: calc(var(--border-radius));
		border-top-right-radius: calc(var(--border-radius));
	}
	&:last-child {
		border-bottom-left-radius: calc(var(--border-radius));
		border-bottom-right-radius: calc(var(--border-radius));
		margin-bottom: 0;
	}
	&:hover {
		box-shadow: var(--console-hover-shadow);
		z-index: 1;
		> div:first-child {
			color: var(--console-primary-color);
		}
		> div:last-child:not(:first-child) {
			opacity: 0.9;
			pointer-events: auto;
			&:hover {
				opacity: 1;
				color: var(--console-primary-color);
			}
		}
	}
	> div {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-size: 0.8em;
	}
	> div:not(:first-child) {
		opacity: 0.6;
		font-family: var(--console-title-font-family);
	}
	> div:last-child:not(:first-child) {
		justify-self: end;
		font-size: 1em;
		opacity: 0;
		transition: all 300ms ease-in-out;
		pointer-events: none;
	}
	> div[data-visit-advise=week] {
		color: var(--console-info-color);
	}
	> div[data-visit-advise=month] {
		color: var(--console-warn-color);
	}
	> div[data-visit-advise=year] {
		color: var(--console-danger-color);
	}
`;

const indexOf = (subject: ConsoleSpaceSubject, subjects: Array<ConsoleSpaceSubject>): number => {
	// eslint-disable-next-line
	return subjects.findIndex(s => s.subjectId == subject.subjectId);
};
const findParentGroup = (subject: ConsoleSpaceSubject, space: ConnectedConsoleSpace): ConsoleSpaceGroup | undefined => {
	if (indexOf(subject, space.subjects) !== -1) {
		return void 0;
	} else {
		return space.groups.find(group => indexOf(subject, group.subjects) !== -1);
	}
};

export const Subject = (props: {
	space: ConnectedConsoleSpace;
	group: ConsoleSpaceGroup;
	subject: ConsoleSpaceSubject & { nameAs?: ((props: any) => React.ReactNode) | React.ReactNode };
}) => {
	const { space, group, subject } = props;

	const dialog = useDialog();
	const listView = useListView();
	const deleteRef = useRef<HTMLElement>(null);
	const { mouseEnter, mouseLeave } = useTooltip({
		show: true,
		tooltip: 'Delete Subject',
		ref: deleteRef,
		rect: () => ({ align: TooltipAlignment.RIGHT, offsetY: 10, offsetX: -13 })
	});

	const lastVisit = dayjs(subject.lastVisitTime);
	const days = dayjs().diff(lastVisit, 'day');
	let visitAdvise = '';
	if (days > 365) {
		visitAdvise = 'year';
	} else if (days > 30) {
		visitAdvise = 'month';
	} else if (days > 7) {
		visitAdvise = 'week';
	}

	const onDeleteSubjectConfirmClicked = async () => {
		try {
			await deleteSubject(subject);
		} catch (e) {
			console.groupCollapsed(`%cError on delete group.`, 'color:rgb(251,71,71)');
			console.error('Space: ', space);
			console.error('Group: ', group);
			console.error('Subject:', subject);
			console.error(e);
			console.groupEnd();
		}
		// display group is not the really parent group
		let parentGroup: ConsoleSpaceGroup | undefined;
		const index = indexOf(subject, space.subjects);
		if (index !== -1) {
			space.subjects.splice(index, 1);
		} else {
			parentGroup = findParentGroup(subject, space)!;
			const index = indexOf(subject, parentGroup.subjects);
			parentGroup.subjects.splice(index as number, 1);
		}
		listView.subjectDeleted({ space, group: parentGroup, subject });
		dialog.hide();
	};
	const onDeleteClicked = async () => {
		const parentGroup = findParentGroup(subject, space);
		const label = parentGroup ? `${space.name} / ${parentGroup.name} / ${subject.name}` : `${space.name} / ${subject.name}`;
		dialog.show(
			<div data-widget='dialog-console-delete'>
				<span>Are you sure to delete subject?</span>
				<span data-widget='dialog-console-group'>{label}</span>
			</div>,
			<Fragment>
				<div style={{ flexGrow: 1 }}/>
				<Button inkType={ButtonType.PRIMARY} onClick={onDeleteSubjectConfirmClicked}>Yes</Button>
				<Button inkType={ButtonType.DEFAULT} onClick={dialog.hide}>Cancel</Button>
			</Fragment>
		);
	};

	return <SubjectContainer>
		<div>
			<span>{subject.nameAs || subject.name}</span>
		</div>
		{
			// eslint-disable-next-line
			subject.subjectId == '-1'
				? null
				: <Fragment>
					<div>{subject.topicCount}</div>
					<div>{subject.graphicsCount}</div>
					<div data-visit-advise={visitAdvise}>{dayjs(subject.lastVisitTime).fromNow()}</div>
					<div>{dayjs(subject.createdAt).fromNow()}</div>
					<div>
						<FontAwesomeIcon icon={faTrashAlt} onClick={onDeleteClicked}
						                 forwardedRef={deleteRef}
						                 onMouseEnter={mouseEnter} onMouseLeave={mouseLeave}/>
					</div>
				</Fragment>
		}
	</SubjectContainer>;
};