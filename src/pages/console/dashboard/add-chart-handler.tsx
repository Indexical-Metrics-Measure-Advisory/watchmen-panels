import React, {Fragment} from 'react';
import {ConnectedConsoleSpace, ConsoleSpaceSubject, ConsoleSpaceSubjectChart} from '../../../services/console/types';
import Button, {ButtonType} from '../../component/button';
import {DialogContext} from '../../context/dialog';
import Dropdown, {DropdownOption} from "../../component/dropdown";
import styled from "styled-components";

interface SpaceOption extends DropdownOption {
	space: ConnectedConsoleSpace
}

interface SubjectOption extends DropdownOption {
	subject: ConsoleSpaceSubject;
}

interface ChartOption extends DropdownOption {
	chart: ConsoleSpaceSubjectChart;
}

const AddChartContainer = styled.div`
	> div {
		margin-bottom: calc(var(--margin) / 4);
	}
`;

const buildSubjectOptions = (space: ConnectedConsoleSpace) => {
	return space.subjects.map(subject => {
		if (!subject.graphics || subject.graphics.length === 0) {
			return null;
		}
		return {value: subject.subjectId, label: subject.name, subject};
	}).filter(x => !!x) as Array<SubjectOption>;
};

const buildChartOptions = (subject: ConsoleSpaceSubject) => {
	return (subject.graphics || []).map(chart => {
		return {value: chart.chartId!, label: chart.name, chart};
	});
};

export const createAddChartClickHandler = (options: {
	dialog: DialogContext,
	connectedSpaces: Array<ConnectedConsoleSpace>;
	onSelected: (space: ConnectedConsoleSpace, subject: ConsoleSpaceSubject, chart: ConsoleSpaceSubjectChart) => void;
}) => async (event: React.MouseEvent) => {
	const {dialog, connectedSpaces, onSelected} = options;

	let selectedSpace: ConnectedConsoleSpace;
	let selectedSubject: ConsoleSpaceSubject;
	let selectedChart: ConsoleSpaceSubjectChart;

	let subjects: Array<SubjectOption> = [];
	let charts: Array<ChartOption> = [];
	const spaces: Array<SpaceOption> = connectedSpaces.map(connected => {
		// ignore space which has no subject
		// or subject has not chart
		if (!connected.subjects || connected.subjects.length === 0
			|| connected.subjects.every(subject => !subject.graphics || subject.graphics.length === 0)) {
			return null;
		}
		return {value: connected.connectId, label: connected.name, space: connected};
	}).filter(x => !!x) as Array<SpaceOption>;

	const onSpaceChanged = async (option: DropdownOption, refresh: boolean = true) => {
		const space = (option as SpaceOption).space;
		// eslint-disable-next-line
		if (space.connectId != selectedSpaceId) {
			selectedSpace = space;
			selectedSpaceId = space.connectId;
			subjects = buildSubjectOptions(space);
			await onSubjectChanged(subjects[0], false);
		}

		refresh && showDialog(createContent());
	};
	const onSubjectChanged = async (option: DropdownOption, refresh: boolean = true) => {
		const subject = (option as SubjectOption).subject;
		// eslint-disable-next-line
		if (subject.subjectId != selectedSubjectId) {
			selectedSubject = subject;
			selectedSubjectId = subject.subjectId;
			charts = buildChartOptions(subject);
			await onChartChanged(charts[0], false);
		}
		refresh && showDialog(createContent());
	};
	const onChartChanged = async (option: DropdownOption, refresh: boolean = true) => {
		selectedChart = (option as ChartOption).chart;
		selectedChartId = selectedChart.chartId!;
		refresh && showDialog(createContent());
	};
	let selectedChartId: string;
	let selectedSubjectId: string;
	let selectedSpaceId: string;

	const showDialog = (content: JSX.Element) => {
		dialog.show(
			content,
			<Fragment>
				<div style={{flexGrow: 1}}/>
				<Button inkType={ButtonType.PRIMARY} onClick={onConfirmClicked}>Yes</Button>
				<Button inkType={ButtonType.DEFAULT} onClick={dialog.hide}>Cancel</Button>
			</Fragment>
		);
	};
	const createContent = (error: boolean = false) => {
		return <AddChartContainer>
			<div>Pick chart:</div>
			<Dropdown value={selectedSpaceId} options={spaces} onChange={onSpaceChanged}/>
			<Dropdown value={selectedSubjectId} options={subjects} onChange={onSubjectChanged}/>
			<Dropdown value={selectedChartId} options={charts} onChange={onChartChanged}/>
		</AddChartContainer>;
	};
	const onConfirmClicked = async () => {
		onSelected(selectedSpace, selectedSubject, selectedChart);
		dialog.hide();
	};

	const showReminder = () => {
		dialog.show(
			<div data-widget='dialog-console-switch'>
				<span>No chart is ready.</span>
			</div>,
			<Fragment>
				<div style={{flexGrow: 1}}/>
				<Button inkType={ButtonType.PRIMARY} onClick={dialog.hide}>Close</Button>
			</Fragment>
		);
	};

	await (async () => {
		if (spaces.length === 0) {
			showReminder();
		} else {
			await onSpaceChanged(spaces[0], false);
			if (charts.length === 0) {
				showReminder();
			} else {
				showDialog(createContent());
			}
		}
	})();
};