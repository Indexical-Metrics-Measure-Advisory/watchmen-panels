import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import React, { Fragment, useRef } from 'react';
import styled from 'styled-components';
import { ConnectedConsoleSpace, ConsoleSpaceGroup, ConsoleSpaceSubject } from '../../../../services/console/types';
import { useDialog } from '../../../context/dialog';
import { TooltipAlignment, useTooltip } from '../../context/console-tooltip';
import { onDeleteSubjectClicked } from '../dialog';
import { useSpaceContext } from '../space-context';
import { findParentGroup, findSubjectIndex, getVisitAdvice } from '../utils';
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
	> div[data-visit-advice=week] {
		color: var(--console-color-week);
	}
	> div[data-visit-advice=month] {
		color: var(--console-color-month);
	}
	> div[data-visit-advice=year] {
		color: var(--console-color-year);
	}
	> div[data-visit-advice=ancient] {
		color: var(--console-color-ancient);
	}
`;

export const Subject = (props: {
	space: ConnectedConsoleSpace;
	group: ConsoleSpaceGroup;
	subject: ConsoleSpaceSubject & { nameAs?: ((props: any) => React.ReactNode) | React.ReactNode };
}) => {
	const { space, subject } = props;

	const dialog = useDialog();
	const listView = useListView();
	const { openSubjectIfCan, closeSubjectIfCan } = useSpaceContext();
	const deleteRef = useRef<HTMLElement>(null);
	const { mouseEnter, mouseLeave } = useTooltip({
		show: true,
		tooltip: 'Delete Subject',
		ref: deleteRef,
		rect: () => ({ align: TooltipAlignment.RIGHT, offsetY: 10, offsetX: -13 })
	});

	const visitAdvice = getVisitAdvice(subject.lastVisitTime);
	const onSubjectClicked = () => {
		let parentGroup: ConsoleSpaceGroup | undefined;
		const index = findSubjectIndex(subject, space.subjects);
		if (index === -1) {
			parentGroup = findParentGroup(subject, space)!;
		}
		openSubjectIfCan({ space, group: parentGroup, subject });
	};
	const onDeleteClicked = onDeleteSubjectClicked({
		dialog,
		space,
		group: findParentGroup(subject, space),
		subject,
		onDeleted: ({ space, group, subject }) => {
			listView.subjectDeleted({ space, group, subject });
			closeSubjectIfCan({ space, group, subject });
		}
	});

	return <SubjectContainer onClick={onSubjectClicked}>
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
					<div data-visit-advice={visitAdvice}>{dayjs(subject.lastVisitTime).fromNow()}</div>
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