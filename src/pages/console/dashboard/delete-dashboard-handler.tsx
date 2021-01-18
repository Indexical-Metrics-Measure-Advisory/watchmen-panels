import React, { Fragment } from 'react';
import { deleteDashboard } from '../../../services/console/dashboard';
import { ConsoleDashboard } from '../../../services/console/types';
import Button, { ButtonType } from '../../component/button';
import { DialogContext } from '../../context/dialog';

export const createDeleteDashboardClickHandler = (options: {
	dashboard: ConsoleDashboard;
	dialog: DialogContext,
	onDeleted: (dashboard: ConsoleDashboard) => void;
}) => async (event: React.MouseEvent) => {
	const { dashboard, dialog, onDeleted } = options;

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
		return <div data-widget='dialog-console-delete'>
			<span>
				<span>Are you sure to delete dashboard </span>
				<span data-widget='dialog-console-object'>{dashboard.name}</span>
				<span>?</span>
			</span>
		</div>;
	};
	const onConfirmClicked = async () => {
		await deleteDashboard(dashboard.dashboardId);
		onDeleted(dashboard);
		dialog.hide();
	};
	showDialog(createContent());
};