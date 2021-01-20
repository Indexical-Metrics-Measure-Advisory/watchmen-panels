import {
	faPenSquare,
	faPoll,
	faSatelliteDish,
	faShare,
	faTachometerAlt,
	faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React, {Fragment, useRef, useState} from 'react';
import styled from 'styled-components';
import {useForceUpdate} from '../../../common/utils';
import {
	ConnectedConsoleSpace,
	ConsoleDashboard,
	ConsoleDashboardChart,
	ConsoleSpaceSubject,
	ConsoleSpaceSubjectChart
} from '../../../services/console/types';
import {LinkButton} from '../../component/console/link-button';
import {useDialog} from '../../context/dialog';
import {useConsoleContext} from '../context/console-context';
import {createCreateDashboardClickHandler} from './create-dashboard-handler';
import {createDeleteDashboardClickHandler} from './delete-dashboard-handler';
import {createRenameDashboardClickHandler} from './rename-dashboard-handler';
import {createSwitchDashboardClickHandler} from './switch-dashboard-handler';
import Button, {ButtonType} from "../../component/button";
import {createAddChartClickHandler} from "./add-chart-handler";
import {CHART_ASPECT_RATIO, CHART_HEADER_HEIGHT, INIT_MIN_WIDTH} from "../connected-space/subject-view/graphics/utils";
import {v4} from "uuid";
import {Chart} from "../connected-space/subject-view/graphics/chart";
import {SubjectContextProvider} from "../connected-space/subject-view/context";
import {saveDashboard} from "../../../services/console/dashboard";

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
	display: flex;
	> button {
		margin-left: calc(var(--margin) / 2);
		font-size: 0.7em;
		padding: 0 calc(var(--margin) / 2);
	}
`;
const DashboardBody = styled.div`
	display: block;
	position: relative;
	flex-grow: 1;
	background-color: var(--bg-color);
	overflow: auto;
	&::-webkit-scrollbar {
		background-color: transparent;
		height: 4px;
		width: 4px;
	}
	&::-webkit-scrollbar-track {
		background-color: var(--scrollbar-background-color);
		border-radius: 2px;
	}
	&::-webkit-scrollbar-thumb {
		background-color: var(--console-favorite-color);
		border-radius: 2px;
	}
`;

export const Dashboard = () => {
	const dialog = useDialog();
	const {
		spaces: {available: spaces, connected: connectedSpaces},
		dashboards: {
			items: dashboards,
			addDashboard, deleteDashboard
		}
	} = useConsoleContext();
	const containerRef = useRef<HTMLDivElement>(null);
	const [saveHandle, setSaveHandle] = useState<{ handle?: number, dashboard?: ConsoleDashboard }>({});
	const forceUpdate = useForceUpdate();

	const onCopyClicked = (url: string) => () => {
		navigator.clipboard.writeText(url);
	};
	const onShareClicked = (dashboard: ConsoleDashboard) => () => {
		const url = `${window.location.href}/share/${dashboard.dashboardId}`;
		dialog.show(
			<div data-widget='dialog-console-loading'>
                <span>
                    <span>Copy following URL and share:</span>
	                <br/>
                    <span data-widget='dialog-console-object'>{url}</span>
                </span>
			</div>,
			<Fragment>
				<div style={{flexGrow: 1}}/>
				<Button inkType={ButtonType.PRIMARY} onClick={onCopyClicked(url)}>Copy</Button>
				<Button inkType={ButtonType.PRIMARY} onClick={dialog.hide}>Close</Button>
			</Fragment>
		);
	};
	const onRenameClicked = (dashboard: ConsoleDashboard) => createRenameDashboardClickHandler({
		dashboard,
		dialog,
		onRenamed: (dashboard) => forceUpdate()
	});
	const onAddChartClicked = (dashboard: ConsoleDashboard) => createAddChartClickHandler({
		dialog,
		connectedSpaces,
		onSelected: (space: ConnectedConsoleSpace, subject: ConsoleSpaceSubject, chart: ConsoleSpaceSubjectChart) => {
			console.log(space, subject, chart);
			if (!dashboard.graphics) {
				dashboard.graphics = [];
			}
			dashboard.graphics.push({
				spaceId: space.spaceId,
				connectId: space.connectId,
				subjectId: subject.subjectId,
				chartId: chart.chartId!,
				rect: {
					top: 0,
					left: 0,
					width: (chart.rect || {width: INIT_MIN_WIDTH}).width,
					height: (chart.rect || {height: INIT_MIN_WIDTH * CHART_ASPECT_RATIO + CHART_HEADER_HEIGHT}).height
				}
			});
			forceUpdate();
		}
	});
	const onDeleteClicked = (dashboard: ConsoleDashboard) => createDeleteDashboardClickHandler({
		dashboard,
		dialog,
		onDeleted: (dashboard) => {
			deleteDashboard(dashboard);
			if (dashboards.length >= 1) {
				forceUpdate();
			}
		}
	});
	const onCreateClicked = createCreateDashboardClickHandler({
		dialog,
		onCreated: (dashboard) => {
			dashboards.forEach(dashboard => dashboard.current = false);
			addDashboard(dashboard);
			forceUpdate();
		}
	});
	const onSwitchClicked = (dashboard: ConsoleDashboard) => createSwitchDashboardClickHandler({
		dashboard,
		dashboards,
		dialog,
		onSwitched: (dashboard) => {
			dashboards.forEach(d => d.current = d === dashboard);
			forceUpdate();
		}
	});
	const onChartDelete = (dashboard: ConsoleDashboard) => (chart: ConsoleSpaceSubjectChart) => {
		const {chartId} = chart;
		// eslint-disable-next-line
		const index = dashboard.graphics.findIndex(chart => chart.chartId == chartId);
		dashboard.graphics.splice(index, 1);
		forceUpdate();
	};
	const doSaveChart = (dashboard: ConsoleDashboard, chart: ConsoleSpaceSubjectChart) => async (subject: ConsoleSpaceSubject) => {
		const {rect, chartId} = chart;
		// eslint-disable-next-line
		const graph = dashboard.graphics.find(chart => chart.chartId == chartId)!;
		graph.rect = rect;
		if (saveHandle.handle) {
			// another dashboard was in saving queue
			clearTimeout(saveHandle.handle);
			if (saveHandle.dashboard !== dashboard) {
				// not current, simply save, don't wait
				saveDashboard(saveHandle.dashboard!);
			}
		}
		setSaveHandle({
			handle: setTimeout(async () => {
				setSaveHandle({});
				await saveDashboard(dashboard);
			}, 10000),
			dashboard
		});
	};

	let currentDashboard = dashboards.find(dashboard => dashboard.current);
	if (!currentDashboard && dashboards.length > 0) {
		// current not found
		currentDashboard = dashboards[0];
	}

	return <DashboardContainer data-visible={!!currentDashboard}>
		<DashboardHeader>
			<DashboardTitle>
				<span>{currentDashboard?.name}</span>
				{currentDashboard
					? <LinkButton ignoreHorizontalPadding={true} onClick={onShareClicked(currentDashboard)}>
						<FontAwesomeIcon icon={faShare}/>
					</LinkButton>
					: null}
			</DashboardTitle>
			{currentDashboard
				? <LinkButton ignoreHorizontalPadding={true} tooltip='Rename this dashboard'
				              right={true} offsetX={-4} offsetY={6}
				              onClick={onRenameClicked(currentDashboard)}>
					<FontAwesomeIcon icon={faPenSquare}/>
				</LinkButton>
				: null}
			{currentDashboard
				? <LinkButton ignoreHorizontalPadding={true} tooltip='Add chart'
				              right={true} offsetX={-4} offsetY={6}
				              onClick={onAddChartClicked(currentDashboard)}>
					<FontAwesomeIcon icon={faPoll}/>
				</LinkButton>
				: null}
			{currentDashboard
				? <LinkButton ignoreHorizontalPadding={true} tooltip='Delete this dashboard'
				              right={true} offsetX={-4} offsetY={6}
				              onClick={onDeleteClicked(currentDashboard)}>
					<FontAwesomeIcon icon={faTrashAlt}/>
				</LinkButton>
				: null}
			<LinkButton ignoreHorizontalPadding={true} tooltip='Create new dashboard'
			            right={true} offsetX={-4} offsetY={6}
			            onClick={onCreateClicked}>
				<FontAwesomeIcon icon={faTachometerAlt}/>
			</LinkButton>
			{dashboards.length > 1 && currentDashboard
				? <LinkButton ignoreHorizontalPadding={true} tooltip='Switch to another dashboard'
				              right={true} offsetX={-4} offsetY={6}
				              onClick={onSwitchClicked(currentDashboard)}>
					<FontAwesomeIcon icon={faSatelliteDish}/>
				</LinkButton>
				: null}
		</DashboardHeader>
		<DashboardBody ref={containerRef}>
			{currentDashboard
				? (currentDashboard.graphics || []).map((chart: ConsoleDashboardChart) => {
					if (!chart.chartId) {
						chart.chartId = v4();
					}
					const {spaceId, connectId, subjectId, chartId} = chart;
					// eslint-disable-next-line
					const space = spaces.find(space => space.spaceId == spaceId);
					if (!space) {
						return (void 0);
					}
					// eslint-disable-next-line
					const connectedSpace = connectedSpaces.find(space => space.connectId == connectId);
					if (!connectedSpace) {
						return (void 0);
					}
					// eslint-disable-next-line
					const subject = connectedSpace.subjects.find(subject => subject.subjectId == subjectId);
					if (!subject) {
						return (void 0);
					}
					// eslint-disable-next-line
					let subjectChart = (subject.graphics || []).find(c => c.chartId == chartId);
					if (!subjectChart) {
						return (void 0);
					}
					subjectChart = {...subjectChart, rect: chart.rect};
					return <SubjectContextProvider space={connectedSpace} subject={subject}
					                               doSave={doSaveChart(currentDashboard!, subjectChart)}>
						<Chart containerRef={containerRef}
						       space={space} subject={subject} chart={subjectChart} locked={false}
						       settings={false}
						       onDeleteChart={onChartDelete(currentDashboard!)}
						       key={chart.chartId}/>
					</SubjectContextProvider>;
				})
				: null}
		</DashboardBody>
	</DashboardContainer>;
};