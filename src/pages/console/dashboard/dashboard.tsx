import { faPenSquare, faPoll, faSatelliteDish, faTachometerAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components';
import { useForceUpdate } from '../../../common/utils';
import { LinkButton } from '../../component/console/link-button';
import { useDialog } from '../../context/dialog';
import { useConsoleContext } from '../context/console-context';
import { createCreateDashboardClickHandler } from './create-dashboard-handler';

const DashboardContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	&[data-visible=false] {
		display: none;
	}
`;
const DashboardHeader = styled.div`
	display: flex;
	align-items: center;
	border-bottom: var(--border);
	> button {
		align-self: flex-end;
		width: 28px;
		height: 28px;
		font-size: 1.2em;
	}
`;
const DashboardTitle = styled.div`
	font-size: 3em;
	font-family: var(--console-title-font-family);
	flex-grow: 1;
`;

export const Dashboard = () => {
	const dialog = useDialog();
	const {
		dashboards: {
			items,
			addDashboard
		}
	} = useConsoleContext();
	const forceUpdate = useForceUpdate();

	const onRenameClicked = () => {
	};
	const onAddClicked = () => {
	};
	const onDeleteClicked = () => {
	};
	const onCreateClicked = createCreateDashboardClickHandler({
		dialog,
		onCreated: (dashboard) => {
			items.forEach(dashboard => dashboard.current = false);
			addDashboard(dashboard);
			forceUpdate();
		}
	});
	const onSwitchClicked = () => {
	};

	let currentDashboard = items.find(dashboard => dashboard.current);
	if (!currentDashboard && items.length > 0) {
		// current not found
		currentDashboard = items[0];
	}

	return <DashboardContainer data-visible={!!currentDashboard}>
		<DashboardHeader>
			<DashboardTitle>{currentDashboard?.name}</DashboardTitle>
			<LinkButton ignoreHorizontalPadding={true} tooltip='Rename this dashboard'
			            right={true} offsetX={-4} offsetY={6}
			            onClick={onRenameClicked}>
				<FontAwesomeIcon icon={faPenSquare}/>
			</LinkButton>
			<LinkButton ignoreHorizontalPadding={true} tooltip='Add chart'
			            right={true} offsetX={-4} offsetY={6}
			            onClick={onAddClicked}>
				<FontAwesomeIcon icon={faPoll}/>
			</LinkButton>
			<LinkButton ignoreHorizontalPadding={true} tooltip='Delete this dashboard'
			            right={true} offsetX={-4} offsetY={6}
			            onClick={onDeleteClicked}>
				<FontAwesomeIcon icon={faTrashAlt}/>
			</LinkButton>
			<LinkButton ignoreHorizontalPadding={true} tooltip='Create new dashboard'
			            right={true} offsetX={-4} offsetY={6}
			            onClick={onCreateClicked}>
				<FontAwesomeIcon icon={faTachometerAlt}/>
			</LinkButton>
			{items.length === 1
				? <LinkButton ignoreHorizontalPadding={true} tooltip='Switch to another dashboard'
				              right={true} offsetX={-4} offsetY={6}
				              onClick={onSwitchClicked}>
					<FontAwesomeIcon icon={faSatelliteDish}/>
				</LinkButton>
				: null}
		</DashboardHeader>
	</DashboardContainer>;
};