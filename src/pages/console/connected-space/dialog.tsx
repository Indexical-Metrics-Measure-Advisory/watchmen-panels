import React, { Fragment } from 'react';
import { deleteGroup, deleteSubject } from '../../../services/console/space';
import { ConnectedConsoleSpace, ConsoleSpaceGroup, ConsoleSpaceSubject } from '../../../services/console/types';
import Button, { ButtonType } from '../../component/button';
import Input from '../../component/input';
import { DialogContext } from '../../context/dialog';
import { findSubjectIndex } from './utils';

export const createDeleteSubjectClickHandler = (options: {
	dialog: DialogContext,
	space: ConnectedConsoleSpace;
	group?: ConsoleSpaceGroup;
	subject: ConsoleSpaceSubject;
	/** on deleted, subject already be deleted from memory, refresh display  */
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
	const onConfirmClicked = async () => {
		await doDeleteSubject({ space, group, subject });
		onDeleted({ space, group, subject });
		dialog.hide();
	};

	dialog.show(
		<div data-widget='dialog-console-delete'>
			<span>Are you sure to delete subject?</span>
			<span data-widget='dialog-console-object'>{label}</span>
		</div>,
		<Fragment>
			<div style={{ flexGrow: 1 }}/>
			<Button inkType={ButtonType.PRIMARY} onClick={onConfirmClicked}>Yes</Button>
			<Button inkType={ButtonType.DEFAULT} onClick={dialog.hide}>Cancel</Button>
		</Fragment>
	);
};

export const createDeleteGroupClickHandler = (options: {
	dialog: DialogContext,
	space: ConnectedConsoleSpace;
	group: ConsoleSpaceGroup;
	/** on deleted, subject already be deleted from memory, refresh display  */
	onDeleted: (options: {
		space: ConnectedConsoleSpace;
		group: ConsoleSpaceGroup;
	}) => void;
}) => async (event: React.MouseEvent) => {
	const { dialog, space, group, onDeleted } = options;

	event.preventDefault();
	event.stopPropagation();

	const doDeleteGroup = async (options: { space: ConnectedConsoleSpace; group: ConsoleSpaceGroup; }) => {
		const { space, group } = options;
		try {
			await deleteGroup(group);
		} catch (e) {
			console.groupCollapsed(`%cError on delete group.`, 'color:rgb(251,71,71)');
			console.error('Space: ', space);
			console.error('Group: ', group);
			console.error(e);
			console.groupEnd();
		}
		const index = space.groups.findIndex(exists => exists === group);
		space.groups.splice(index, 1);
	};
	const onConfirmClicked = async () => {
		await doDeleteGroup({ space, group });
		onDeleted({ space, group });
		dialog.hide();
	};
	dialog.show(
		<div data-widget='dialog-console-delete'>
			<span>Are you sure to delete group?</span>
			<span data-widget='dialog-console-object'>{space.name} / {group.name}</span>
		</div>,
		<Fragment>
			<div style={{ flexGrow: 1 }}/>
			<Button inkType={ButtonType.PRIMARY} onClick={onConfirmClicked}>Yes</Button>
			<Button inkType={ButtonType.DEFAULT} onClick={dialog.hide}>Cancel</Button>
		</Fragment>
	);
};

export const createRenameClickHandler = (options: {
	dialog: DialogContext,
	space: ConnectedConsoleSpace;
	group?: ConsoleSpaceGroup;
	subject?: ConsoleSpaceSubject;
	asFullName: (options: { space: ConnectedConsoleSpace; group?: ConsoleSpaceGroup; subject?: ConsoleSpaceSubject; }) => string;
	renameObject: (options: { space: ConnectedConsoleSpace; group?: ConsoleSpaceGroup; subject?: ConsoleSpaceSubject; }, newName: string) => void;
	onRenamed: (options: { space: ConnectedConsoleSpace; group?: ConsoleSpaceGroup; subject?: ConsoleSpaceSubject; }) => void;
}) => async (event: React.MouseEvent) => {
	const { dialog, space, group, subject, asFullName, renameObject, onRenamed } = options;

	event.preventDefault();
	event.stopPropagation();

	let name = '';
	const onTextChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
		name = event.target.value;
		showDialog(createContent(!(name.trim())));
	};
	const showDialog = (content: JSX.Element) => {
		dialog.show(
			content,
			<Fragment>
				<div style={{ flexGrow: 1 }}/>
				<Button inkType={ButtonType.PRIMARY} onClick={onRenameConfirmClicked}>Yes</Button>
				<Button inkType={ButtonType.DEFAULT} onClick={dialog.hide}>Cancel</Button>
			</Fragment>
		);
	};
	const createContent = (error: boolean = false) => {
		return <div data-widget='dialog-console-rename'>
			<span>Rename <span data-widget='dialog-console-object'>{asFullName({
				space,
				group,
				subject
			})}</span> to:</span>
			<Input onChange={onTextChanged} value={name}
			       data-error={error}
			       placeholder='new name...'/>
			<span>Name is required.</span>
		</div>;
	};
	const onRenameConfirmClicked = async () => {
		if (!(name.trim())) {
			showDialog(createContent(true));
			return;
		}
		renameObject({ space, group, subject }, name.trim());
		onRenamed({ space, group, subject });
		dialog.hide();
	};
	showDialog(createContent());
};