import React, { Fragment } from 'react';
import { renameDashboard } from '../../../services/console/dashboard';
import { ConsoleDashboard } from '../../../services/console/types';
import Button, { ButtonType } from '../../component/button';
import Input from '../../component/input';
import { DialogContext } from '../../context/dialog';

export const createRenameDashboardClickHandler = (options: {
	dashboard: ConsoleDashboard;
	dialog: DialogContext,
	onRenamed: (dashboard: ConsoleDashboard) => void;
}) => async (event: React.MouseEvent) => {
	const { dashboard, dialog, onRenamed } = options;

	let name = '';
	const onTextChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
		name = event.target.value;
	};
	const showDialog = (content: JSX.Element) => {
		dialog.show(
			content,
			<Fragment>
				<div style={{ flexGrow: 1 }}/>
				<Button inkType={ButtonType.PRIMARY} onClick={onConfirmClicked}>Yes</Button>
				<Button inkType={ButtonType.DEFAULT} onClick={dialog.hide}>Cancel</Button>
			</Fragment>
		);
	};
	const createContent = (error: boolean = false) => {
		return <div data-widget='dialog-console-rename'>
			<span>Rename <span data-widget='dialog-console-object'>{dashboard.name}</span> to:</span>
			<Input onChange={onTextChanged} defaultValue={name} data-error={error}/>
			<span>Name is required.</span>
		</div>;
	};
	const onConfirmClicked = async () => {
		if (!(name.trim())) {
			showDialog(createContent(true));
			return;
		}
		await renameDashboard(dashboard.dashboardId, name);
		dashboard.name = name;
		onRenamed(dashboard);
		dialog.hide();
	};
	showDialog(createContent());
};