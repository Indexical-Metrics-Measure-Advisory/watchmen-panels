import React, { useEffect } from "react";
import styled from 'styled-components';
import BackgroundImage from '../../../assets/console-dashboard-background.png';
import { useForceUpdate } from '../../../common/utils';
import { NarrowPageTitle } from '../../component/console/narrow-page-title';
import { PageContainer } from '../../component/console/page-container';
import { useDialog } from '../../context/dialog';
import { useConsoleContext } from '../context/console-context';
import { createCreateDashboardClickHandler } from './create-dashboard-handler';
import { Dashboard } from './dashboard';

const Container = styled(PageContainer)`
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	position: relative;
	margin: calc(var(--margin) / 2) var(--margin) var(--margin);
`;
const DashboardsContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	grid-row-gap: var(--margin);
`;
const Reminder = styled.div`
	display: block;
	font-size: 2em;
	font-family: var(--console-title-font-family);
	opacity: 0;
	height: 0;
	width: 100%;
	transition: all 300ms ease-in-out;
	text-align: center;
	&[data-visible=true] {
		opacity: 0.5;
		height: 100px;
	}
	> span {
		text-decoration: underline;
		cursor: pointer;
	}
`;

export const Dashboards = () => {
	const dialog = useDialog();
	const {
		dashboards: {
			initialized,
			items: dashboards,
			addDashboard,
			addDashboardDeletedListener, removeDashboardDeletedListener
		}
	} = useConsoleContext();
	const forceUpdate = useForceUpdate();
	useEffect(() => {
		const onDelete = () => {
			if (dashboards.length === 0) {
				forceUpdate();
			}
		};
		addDashboardDeletedListener(onDelete);
		return () => removeDashboardDeletedListener(onDelete);
	});

	const onCreateClicked = createCreateDashboardClickHandler({
		dialog,
		onCreated: (dashboard) => {
			dashboards.forEach(dashboard => dashboard.current = false);
			addDashboard(dashboard);
			forceUpdate();
		}
	});

	const canShow = initialized && dashboards.length !== 0;

	return <Container background-image={BackgroundImage}>
		{canShow
			? <DashboardsContainer>
				<Dashboard/>
			</DashboardsContainer>
			: <DashboardsContainer>
				<NarrowPageTitle title='Dashboards'/>
				<Reminder data-visible={initialized && dashboards.length === 0}>
					No dashboard yet, <span onClick={onCreateClicked}>create one</span> now?
				</Reminder>
				<Reminder data-visible={!initialized}>
					Loading...
				</Reminder>
			</DashboardsContainer>
		}
	</Container>;
};