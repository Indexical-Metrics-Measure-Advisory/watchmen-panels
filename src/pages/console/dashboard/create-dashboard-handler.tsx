import React, { Fragment } from 'react';
import { createDashboard } from '../../../services/console/dashboard';
import { ConsoleDashboard } from '../../../services/console/types';
import Button, { ButtonType } from '../../component/button';
import Input from '../../component/input';
import { DialogContext } from '../../context/dialog';

export const createCreateDashboardClickHandler = (options: {
	dialog: DialogContext,
	onCreated: (dashboard: ConsoleDashboard) => void;
}) => async (event: React.MouseEvent) => {
	const { dialog, onCreated } = options;

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
				<Button inkType={ButtonType.PRIMARY} onClick={onConfirmClicked}>Yes</Button>
				<Button inkType={ButtonType.DEFAULT} onClick={dialog.hide}>Cancel</Button>
			</Fragment>
		);
	};
	const createContent = (error: boolean = false) => {
		return <div data-widget='dialog-console-create'>
			<span>New dashboard name:</span>
			<Input onChange={onTextChanged} value={name} data-error={error}/>
			<span>Name is required.</span>
		</div>;
	};
	const onConfirmClicked = async () => {
		if (!(name.trim())) {
			showDialog(createContent(true));
			return;
		}
		const dashboard = await createDashboard(name.trim());
		onCreated(dashboard);
		dialog.hide();
	};
	showDialog(createContent());
};