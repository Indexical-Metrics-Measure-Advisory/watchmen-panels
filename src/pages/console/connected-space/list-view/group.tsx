import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ConsoleSpaceGroup, ConsoleSpaceSubject } from '../../../../services/console/types';
import { LinkButton } from '../../component/link-button';
import { useListView } from './list-context';
import { Subject } from './subject';

const GroupContainer = styled.div.attrs({
	'data-widget': 'console-list-view-group'
})<{ colorSuffix?: string }>`
	display: flex;
	flex-direction: column;
	position: relative;
	border-radius: calc(var(--border-radius) * 2);
	background-color: ${({ colorSuffix }) => colorSuffix ? `var(--console-group-bg-color-${colorSuffix})` : 'var(--console-group-bg-color)'};
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
		background-color: ${({ colorSuffix }) => colorSuffix ? `var(--console-group-quote-color-${colorSuffix})` : 'var(--console-group-quote-color)'};
	}
	&:hover {
		div[data-widget='console-list-view-header-buttons'] {
			opacity: 1;
			pointer-events: auto;
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
		opacity: 0;
		pointer-events: none;
		transition: all 300ms ease-in-out;
		> button {
			font-size: 0.8em;
			font-weight: var(--font-bold);
			opacity: 0.6;
			&:hover {
				opacity: 1;
			}
		}
	}
`;
const GroupBody = styled.div.attrs<{ itemCount: number, visible: boolean }>(({ itemCount, visible }) => {
	return {
		'data-widget': 'console-list-view-group-body',
		style: {
			height: visible ? `calc(1.9em + ${itemCount} * 33px - 1px)` : 0,
			marginBottom: visible ? 'calc(var(--margin) / 2)' : 0
		}
	};
})<{ itemCount: number, visible: boolean }>`
	display: flex;
	flex-direction: column;
	transition: all 300ms ease-in-out;
	overflow: hidden;
`;
const GroupItemHeader = styled.div`
	display: grid;
	align-items: center;
	grid-template-columns: 1fr 80px 80px 120px 120px;
	grid-column-gap: calc(var(--margin) / 3);
	font-family: var(--console-title-font-family);
	font-size: 0.8em;
	padding: 0 calc(var(--margin) / 2);
	opacity: 0.5;
	height: 1.6em;
	margin-bottom: 0.3em;
`;

const decorateDisplaySubjects = (subjects: Array<ConsoleSpaceSubject>, filtering: boolean): Array<ConsoleSpaceSubject> => {
	if (subjects.length === 0) {
		return [ {
			subjectId: '-1',
			name: filtering ? 'No matched.' : 'No subject yet.',
			topicCount: 0,
			graphicsCount: 0,
			lastVisitTime: '',
			createdAt: ''
		} ];
	} else {
		return subjects;
	}
};

export const Group = (props: { group: ConsoleSpaceGroup, colorSuffix?: string }) => {
	const { group, colorSuffix } = props;
	const { subjects } = group;

	const listView = useListView();
	const [ collapsed, setCollapsed ] = useState<boolean>(false);
	const [ displaySubjects, setDisplaySubjects ] = useState<Array<ConsoleSpaceSubject>>(decorateDisplaySubjects(subjects, false));
	useEffect(() => {
		const onCollapsedChanged = (newCollapsed: boolean) => {
			if (newCollapsed === collapsed) {
				return;
			}
			setCollapsed(newCollapsed);
		};
		const onFilterTextChanged = (text: string) => {
			const value = (text || '').trim();
			if (!value) {
				if (displaySubjects.length === subjects.length) {
					return;
				} else {
					setDisplaySubjects(decorateDisplaySubjects(subjects, false));
				}
			} else {
				setDisplaySubjects(decorateDisplaySubjects(subjects.filter(subject => subject.name.toUpperCase().includes(value.toUpperCase())), true));
			}
		};
		listView.addCollapsedChangedListener(onCollapsedChanged);
		listView.addFilterTextChangedListener(onFilterTextChanged);
		return () => {
			listView.removeCollapsedChangedListener(onCollapsedChanged);
			listView.removeFilterTextChangedListener(onFilterTextChanged);
		};
	}, [ listView, collapsed, displaySubjects, subjects ]);

	const onToggleExpand = () => setCollapsed(!collapsed);

	return <GroupContainer colorSuffix={colorSuffix}>
		<GroupHeader>
			<div>{group.name}</div>
			<div data-widget='console-list-view-header-buttons'>
				<LinkButton onClick={onToggleExpand}>
					{collapsed ? 'Expand' : 'Collapse'}
				</LinkButton>
			</div>
		</GroupHeader>
		<GroupBody visible={!collapsed} itemCount={displaySubjects.length}>
			<GroupItemHeader>
				<div/>
				<div>Relevant Topics</div>
				<div>Graphics</div>
				<div>Last Visit</div>
				<div>Created At</div>
			</GroupItemHeader>
			{displaySubjects.map(subject => {
				return <Subject subject={subject} key={subject.subjectId}/>;
			})}
		</GroupBody>
	</GroupContainer>;
};