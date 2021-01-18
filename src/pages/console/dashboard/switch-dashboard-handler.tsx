import React, { Fragment } from 'react';
import { useForceUpdate } from '../../../common/utils';
import { ConsoleDashboard } from '../../../services/console/types';
import Button, { ButtonType } from '../../component/button';
import Dropdown, { DropdownOption } from '../../component/dropdown';
import { DialogContext } from '../../context/dialog';

export const createSwitchDashboardClickHandler = (options: {
	dashboard: ConsoleDashboard,
	dashboards: Array<ConsoleDashboard>;
	dialog: DialogContext,
	onSwitched: (dashboard: ConsoleDashboard) => void;
}) => async (event: React.MouseEvent) => {
	const { dashboard, dashboards, dialog, onSwitched } = options;

	let selected = dashboards[0];
	const candidates = dashboards.filter(d => d !== dashboard)
		.map(dashboard => {
			return { value: dashboard.dashboardId, label: dashboard.name };
		})
		.sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()));

	const showDialog = () => {
		dialog.show(
			<DialogContent/>,
			<Fragment>
				<div style={{ flexGrow: 1 }}/>
				<Button inkType={ButtonType.PRIMARY} onClick={onConfirmClicked}>Yes</Button>
				<Button inkType={ButtonType.DEFAULT} onClick={dialog.hide}>Cancel</Button>
			</Fragment>
		);
	};
	const DialogContent = () => {
		const forceUpdate = useForceUpdate();
		const onDashboardChanged = async (option: DropdownOption) => {
			const dashboardId = option.value as string;
			// eslint-disable-next-line
			selected = dashboards.find(d => d.dashboardId == dashboardId)!;
			forceUpdate();
		};
		return <div data-widget='dialog-console-switch'>
			<span>Switch to:</span>
			<Dropdown options={candidates} value={selected.dashboardId} onChange={onDashboardChanged}/>
		</div>;
	};
	const onConfirmClicked = async () => {
		onSwitched(selected);
		dialog.hide();
	};
	showDialog();
};