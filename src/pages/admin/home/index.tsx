import styled from 'styled-components';
import React, { RefObject, useRef } from 'react';
import { Chart } from '../../console/connected-space/subject-view/graphics/chart';
import { SubjectContextProvider } from '../../console/connected-space/subject-view/context';
import {
	ConnectedConsoleSpace,
	ConsoleSpace,
	ConsoleSpaceSubject,
	ConsoleSpaceSubjectChart,
	ConsoleSpaceSubjectChartIndicatorAggregator,
	ConsoleSpaceSubjectChartType,
	ConsoleSpaceType,
	ConsoleTopicFactorType
} from '../../../services/console/types';
import dayjs from 'dayjs';

const Container = styled.div`
	display        : flex;
	flex-direction : column;
	width          : 100%;
`;
const Header = styled.div`
	display       : flex;
	align-items   : center;
	border-bottom : var(--border);
	> button {
		align-self : flex-end;
		width      : 28px;
		height     : 28px;
		font-size  : 1.2em;
	}
`;
const Title = styled.div`
	font-size   : 3em;
	font-family : var(--console-title-font-family);
	flex-grow   : 1;
	display     : flex;
	padding     : 0 var(--margin);
	> button {
		margin-left : calc(var(--margin) / 2);
		font-size   : 0.7em;
		padding     : 0 calc(var(--margin) / 2);
	}
`;
const Body = styled.div`
	display               : grid;
	position              : relative;
	flex-grow             : 1;
	grid-template-columns : repeat(12, 1fr);
	grid-column-gap       : var(--margin);
	grid-auto-rows        : 400px;
	grid-row-gap          : var(--margin);
	overflow              : auto;
	padding               : calc(var(--margin) / 2) var(--margin) var(--margin);
	margin-bottom         : var(--margin);
	&::-webkit-scrollbar {
		background-color : transparent;
		height           : 4px;
		width            : 4px;
	}
	&::-webkit-scrollbar-track {
		background-color : var(--scrollbar-background-color);
		border-radius    : 2px;
	}
	&::-webkit-scrollbar-thumb {
		background-color : var(--console-favorite-color);
		border-radius    : 2px;
	}
	> div {
		position    : relative;
		grid-column : span 6;
		> div {
			width  : 100%;
			height : 100%;
		}
	}
`;

const onChartDelete = (chart: ConsoleSpaceSubjectChart) => (void 0);
const onChartSave = async (subject: ConsoleSpaceSubject) => (void 0);

const createDef = (subjectId: string, chartId: string, chartName: string, dimensionName: string) => {
	const space: ConsoleSpace = {
		spaceId: 'demo-admin-dashboard',
		name: 'Demo Admin Dashboard Space',
		topics: [ {
			topicId: '1',
			code: 'top-slow-sql',
			name: 'Top Slow SQL',
			factors: [
				{ factorId: '1', name: 'sql', label: dimensionName, type: ConsoleTopicFactorType.TEXT },
				{ factorId: '2', name: 'time', label: 'Time', type: ConsoleTopicFactorType.NUMBER }
			]
		} ],
		topicRelations: []
	};
	const chart: ConsoleSpaceSubjectChart = {
		chartId,
		name: chartName,
		type: ConsoleSpaceSubjectChartType.BAR,
		indicators: [ {
			topicId: '1',
			factorId: '2',
			aggregator: ConsoleSpaceSubjectChartIndicatorAggregator.NONE,
			alias: 'Execution(ms)'
		} ],
		dimensions: [ {
			topicId: '1',
			factorId: '1',
			alias: 'Topic'
		} ],
		rect: { top: -1, left: -1, width: -1, height: -1 }
	};
	const subject: ConsoleSpaceSubject = {
		subjectId,
		name: 'Top Slow SQL',
		topicCount: 1,
		graphicsCount: 1,
		lastVisitTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
		createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
		dataset: {
			filters: [],
			columns: [],
			joins: []
		},
		graphics: [ chart ]
	};
	const connectedSpace: ConnectedConsoleSpace = {
		connectId: 'demo-admin-dashboard',
		type: ConsoleSpaceType.PRIVATE,
		lastVisitTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
		groups: [],
		subjects: [ subject ],
		// from space
		spaceId: space.spaceId,
		name: space.name,
		topics: space.topics,
		topicRelations: space.topicRelations
	};
	return { connectedSpace, space, subject, chart };
};
const TopX = (props: {
	containerRef: RefObject<HTMLDivElement>;
	subjectId: string;
	chartId: string;
	chartName: string;
	dimensionName: string;
}) => {
	const { containerRef, subjectId, chartId, chartName, dimensionName } = props;
	const { connectedSpace, space, subject, chart } = createDef(subjectId, chartId, chartName, dimensionName);

	return <div>
		<SubjectContextProvider space={connectedSpace} subject={subject}
		                        doSave={onChartSave}>
			<Chart containerRef={containerRef}
			       space={space} subject={subject} chart={chart} locked={true}
			       settings={false}
			       onDeleteChart={onChartDelete}/>
		</SubjectContextProvider>
	</div>;
};

export const Home = () => {
	const bodyRef = useRef<HTMLDivElement>(null);

	return <Container>
		<Header>
			<Title>
				<span>Aerial View for Administrator</span>
			</Title>
		</Header>
		<Body ref={bodyRef}>
			<TopX containerRef={bodyRef} subjectId='SYS_001' chartId='TOP_10_SQL' chartName='Top Slow SQL'
			      dimensionName='SQL'/>
			<TopX containerRef={bodyRef} subjectId='SYS_001' chartId='TOP_10_SLOW_PIPELINE'
			      chartName='Top Slow Pipeline' dimensionName='Pipeline'/>
		</Body>
	</Container>;
};