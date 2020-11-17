import React, { Fragment } from 'react';
import { deleteSubject } from '../../../services/console/space';
import { ConnectedConsoleSpace, ConsoleSpaceGroup, ConsoleSpaceSubject } from '../../../services/console/types';
import Button, { ButtonType } from '../../component/button';
import { DialogContext } from '../../context/dialog';
import { findSubjectIndex } from './utils';

const doDeleteSubject = async (options: {
	space: ConnectedConsoleSpace;
	group?: ConsoleSpaceGroup;
	subject: ConsoleSpaceSubject;
}) => {
	const { space, group, subject } = options;

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
	if (!group) {
		const index = findSubjectIndex(subject, space.subjects);
		space.subjects.splice(index, 1);
	} else {
		const index = findSubjectIndex(subject, group.subjects);
		group.subjects.splice(index as number, 1);
	}
};

export const onDeleteSubjectClicked = (options: {
	dialog: DialogContext,
	space: ConnectedConsoleSpace;
	group?: ConsoleSpaceGroup;
	subject: ConsoleSpaceSubject;
	onDeleted: (options: {
		space: ConnectedConsoleSpace;
		group?: ConsoleSpaceGroup;
		subject: ConsoleSpaceSubject;
	}) => void;
}) => async (event: React.MouseEvent) => {
	const { dialog, space, group, subject, onDeleted } = options;

	event.preventDefault();
	event.stopPropagation();

	const label = group ? `${space.name} / ${group.name} / ${subject.name}` : `${space.name} / ${subject.name}`;
	const onConfirmClicked = async () => {
		await doDeleteSubject({ space, group, subject });
		onDeleted({ space, group, subject });
		dialog.hide();
	};

	dialog.show(
		<div data-widget='dialog-console-delete'>
			<span>Are you sure to delete subject?</span>
			<span data-widget='dialog-console-group'>{label}</span>
		</div>,
		<Fragment>
			<div style={{ flexGrow: 1 }}/>
			<Button inkType={ButtonType.PRIMARY} onClick={onConfirmClicked}>Yes</Button>
			<Button inkType={ButtonType.DEFAULT} onClick={dialog.hide}>Cancel</Button>
		</Fragment>
	);
};
