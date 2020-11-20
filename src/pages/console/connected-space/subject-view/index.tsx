import { faChartBar, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faDatabase, faPenAlt, faTable } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useReducer, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { ConnectedConsoleSpace, ConsoleSpaceGroup, ConsoleSpaceSubject } from '../../../../services/console/types';
import { useDialog } from '../../../context/dialog';
import { LinkButton } from '../../component/link-button';
import { createDeleteSubjectClickHandler, createRenameClickHandler } from '../dialog';
import { useSpaceContext } from '../space-context';
import { SubjectContextProvider } from './context';
import { DataSet } from './dataset';

interface Visible {
	dataset: boolean;
}

const SubjectViewContainer = styled.div.attrs({
	'data-widget': 'console-subject-view'
})`
	display: flex;
	position: relative;
	width: 100%;
`;
const SubjectViewMenu = styled.div`
	display: flex;
	position: absolute;
	top: calc(var(--margin) / 2);
	left: calc(var(--margin) / 2);
	> button {
		font-family: var(--console-title-font-family);
		color: var(--invert-color);
		background-color: var(--console-primary-color);
		white-space: nowrap;
		padding: 6px calc(var(--margin) / 2);
		box-shadow: var(--console-primary-shadow);
		&:first-child {
			border-top-left-radius: var(--border-radius);
			border-bottom-left-radius: var(--border-radius);
		}		
		&:last-child {
			border-top-right-radius: var(--border-radius);
			border-bottom-right-radius: var(--border-radius);
		}		
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
	const [ visible, setVisible ] = useState<Visible>({ dataset: false });

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
	const onVisibleChanged = (key: keyof Visible) => () => setVisible({ ...visible, [key]: !visible[key] });
	const changeVisible = (key: keyof Visible) => (value: boolean) => setVisible({ ...visible, [key]: value });

	return <SubjectViewContainer>
		<SubjectViewMenu>
			<LinkButton onClick={onRenameSubjectClicked} ignoreHorizontalPadding={true} tooltip='Rename'
			            center={true}>
				<FontAwesomeIcon icon={faPenAlt}/>
			</LinkButton>
			<LinkButton onClick={onDeleteSubjectClicked} ignoreHorizontalPadding={true} tooltip='Delete Group'
			            center={true}>
				<FontAwesomeIcon icon={faTrashAlt}/>
			</LinkButton>
			<LinkButton onClick={onVisibleChanged('dataset')} ignoreHorizontalPadding={true}
			            tooltip='Show DataSet Definition'>
				<FontAwesomeIcon icon={faDatabase}/>
			</LinkButton>
			<LinkButton onClick={() => {
			}} ignoreHorizontalPadding={true}
			            tooltip='Show DataSet'>
				<FontAwesomeIcon icon={faTable}/>
			</LinkButton>
			<LinkButton onClick={() => {
			}} ignoreHorizontalPadding={true}
			            tooltip='Show Graphics'>
				<FontAwesomeIcon icon={faChartBar}/>
			</LinkButton>
		</SubjectViewMenu>
		<DataSet space={space} subject={subject}
		         visible={visible.dataset} onVisibleChanged={changeVisible('dataset')}/>
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