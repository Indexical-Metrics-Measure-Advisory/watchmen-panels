import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faBars, faPenAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useReducer, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { ConnectedConsoleSpace, ConsoleSpaceGroup, ConsoleSpaceSubject } from '../../../../services/console/types';
import { useDialog } from '../../../context/dialog';
import { LinkButton } from '../../component/link-button';
import { createDeleteSubjectClickHandler, createRenameClickHandler } from '../dialog';
import { useSpaceContext } from '../space-context';
import { SubjectColumns } from './columns';
import { SubjectMenuHeader } from './components';
import { SubjectContextProvider } from './context';
import { SubjectFilters } from './filters';
import { SubjectJoins } from './joins';

interface Min {
	all: boolean;
	filters: boolean;
	columns: boolean;
	joins: boolean;
}

const SubjectViewContainer = styled.div.attrs({
	'data-widget': 'console-subject-view'
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
const SubjectMenu = styled.div.attrs({
	'data-widget': 'console-subject-view-menu'
})`
	display: flex;
	position: relative;
	flex-direction: column;
	width: 500px;
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

const findSubject = (space: ConnectedConsoleSpace, subjectId: string) => {
	// eslint-disable-next-line
	let subject = space.subjects.find(s => s.subjectId == subjectId);
	if (!subject) {
		return space.groups.reduce((found, group) => {
			if (found.subject) {
				return found;
			}
			// eslint-disable-next-line
			const subject = group.subjects.find(s => s.subjectId == subjectId);
			if (subject) {
				return { subject, group };
			} else {
				return found;
			}
		}, {} as { group: ConsoleSpaceGroup, subject: ConsoleSpaceSubject });
	} else {
		return { subject, group: (void 0) };
	}
};
const initDataSet = (subject: ConsoleSpaceSubject) => {
	let { dataset } = subject;
	if (!dataset) {
		dataset = { filters: [], columns: [], joins: [] };
		subject.dataset = dataset;
	}
	if (!dataset.filters) {
		dataset.filters = [];
	}
	if (!dataset.columns) {
		dataset.columns = [];
	}
	if (!dataset.joins) {
		dataset.joins = [];
	}
};

export const SubjectViewContent = (props: {
	space: ConnectedConsoleSpace;
	group?: ConsoleSpaceGroup;
	subject: ConsoleSpaceSubject;
}) => {
	const { space, group, subject } = props;

	const dialog = useDialog();
	const { closeSubjectIfCan, subjectRenamed } = useSpaceContext();
	const [ , forceUpdate ] = useReducer(x => x + 1, 0);
	const [ min, setMin ] = useState<Min>({ all: false, filters: false, columns: false, joins: false });

	initDataSet(subject);

	const onDeleteSubjectClicked = createDeleteSubjectClickHandler({
		dialog, space, group, subject,
		onDeleted: ({ space, group, subject }) => closeSubjectIfCan({ space, group, subject })
	});
	const onRenameSubjectClicked = createRenameClickHandler({
		dialog, space, group, subject,
		asFullName: () => group ? `${space.name} / ${group.name} / ${subject.name}` : `${space.name} / ${subject.name}`,
		renameObject: (options, newName) => subject.name = newName,
		onRenamed: () => {
			subjectRenamed({ space, group, subject });
			forceUpdate();
		}
	});
	const changeMinAllState = (value: boolean) => () => setMin({ ...min, all: value });
	const changeMinState = (key: keyof Min) => (value: boolean) => setMin({ ...min, [key]: value });

	return <SubjectViewContainer data-min={min.all}>
		<SubjectMenu data-min={min.all}>
			<SubjectMenuHeader>
				<div>{subject.name}</div>
				<LinkButton onClick={onRenameSubjectClicked} ignoreHorizontalPadding={true} tooltip='Rename'
				            center={true}>
					<FontAwesomeIcon icon={faPenAlt}/>
				</LinkButton>
				<LinkButton onClick={onDeleteSubjectClicked} ignoreHorizontalPadding={true} tooltip='Delete Group'
				            center={true}>
					<FontAwesomeIcon icon={faTrashAlt}/>
				</LinkButton>
				<LinkButton onClick={changeMinAllState(true)} ignoreHorizontalPadding={true} tooltip='Minimize'
				            center={true}>
					<FontAwesomeIcon icon={faTimes}/>
				</LinkButton>
			</SubjectMenuHeader>
			<SubjectFilters subject={subject} min={min.filters} onMinChanged={changeMinState('filters')}/>
			<SubjectColumns space={space} subject={subject} min={min.columns} onMinChanged={changeMinState('columns')}/>
			<SubjectJoins space={space} subject={subject} min={min.joins} onMinChanged={changeMinState('joins')}/>
		</SubjectMenu>
		<LinkButton onClick={changeMinAllState(false)} ignoreHorizontalPadding={true}
		            tooltip='Show Subject View Menus'>
			<FontAwesomeIcon icon={faBars}/>
		</LinkButton>
	</SubjectViewContainer>;
};

export const SubjectView = (props: {
	space: ConnectedConsoleSpace;
	visible: boolean;
}) => {
	const { space, visible } = props;
	if (!visible) {
		return null;
	}

	// eslint-disable-next-line
	const { subjectId } = useParams<{ subjectId: string }>();
	const { group, subject } = findSubject(space, subjectId);

	return <SubjectContextProvider space={space} group={group} subject={subject}>
		<SubjectViewContent space={space} group={group} subject={subject}/>
	</SubjectContextProvider>;
};