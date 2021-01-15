import React from "react";
import styled from 'styled-components';
import BackgroundImage from '../../../assets/console-dashboard-background.png';
import { NarrowPageTitle } from '../../component/console/narrow-page-title';
import { PageContainer } from '../../component/console/page-container';
import { useConsoleContext } from '../context/console-context';
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
`;

export const Dashboards = () => {
	const { dashboards: { initialized, items: dashboards } } = useConsoleContext();

	const canShow = initialized && dashboards.length !== 0;

	return <Container background-image={BackgroundImage}>
		{canShow
			? <DashboardsContainer>
				<Dashboard/>
			</DashboardsContainer>
			: <DashboardsContainer>
				<NarrowPageTitle title='Dashboards'/>
				<Reminder data-visible={initialized && dashboards.length === 0}>
					No dashboard yet.
				</Reminder>
				<Reminder data-visible={!initialized}>
					Loading...
				</Reminder>
			</DashboardsContainer>
		}
	</Container>;
};