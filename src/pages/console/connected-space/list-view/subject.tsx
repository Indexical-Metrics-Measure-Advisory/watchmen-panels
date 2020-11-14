import dayjs from 'dayjs';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { ConsoleSpaceSubject } from '../../../../services/console/types';

const SubjectContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr 80px 80px 120px 120px;
	grid-column-gap: calc(var(--margin) / 3);
	align-items: center;
	height: 32px;
	margin-bottom: 1px;
	padding: 0 calc(var(--margin) / 2);
	background-color: var(--bg-color);
	
	cursor: pointer;
	&:first-child {
		border-top-left-radius: calc(var(--border-radius) / 2);
		border-top-right-radius: calc(var(--border-radius) / 2);
	}
	&:last-child {
		border-bottom-left-radius: calc(var(--border-radius) / 2);
		border-bottom-right-radius: calc(var(--border-radius) / 2);
		margin-bottom: 0;
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

export const Subject = (props: {
	subject: ConsoleSpaceSubject & { nameAs?: ((props: any) => React.ReactNode) | React.ReactNode };
}) => {
	const { subject } = props;

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

	return <SubjectContainer>
		<div>{subject.nameAs || subject.name}</div>
		{
			// eslint-disable-next-line
			subject.subjectId == '-1'
				? null
				: <Fragment>
					<div>{subject.topicCount}</div>
					<div>{subject.graphicsCount}</div>
					<div data-visit-advise={visitAdvise}>{dayjs(subject.lastVisitTime).fromNow()}</div>
					<div>{dayjs(subject.createdAt).fromNow()}</div>
				</Fragment>
		}
	</SubjectContainer>;
};