import React from 'react';
import { CountDoughnut } from '../../charts/count-doughnut';
import { Gantt } from '../../charts/gantt';
import { SegmentBar } from '../../charts/segment-bar';
import { DataSet } from '../../data/types';
// @ts-ignore
import SoftwareImplementationTasks from './software-implementation.csv';
import { Domain } from './types';

export const SoftwareImplementation: Domain = {
	code: 'software-implementation',
	label: 'Software Implementation',
	expressions: [
		{ code: 'workdays', name: 'Workdays', label: 'Workdays', body: 'workdays({{StartDate}}, {{EndDate}})' }
	],
	demo: {
		tasks: SoftwareImplementationTasks
	},
	charts: [
		{
			key: 'task-count-category',
			name: 'Task - Count by Category',
			chart: (props: { data: DataSet, className?: string }): JSX.Element => {
				const { data: { tasks: { data } }, className } = props;
				const chartData = data.map(item => {
					return { name: item.Category, value: 1 };
				});
				return <CountDoughnut className={className}
				                      title={'{{count}} Tasks'}
				                      data={chartData}/>;
			}
		},
		{
			key: 'task-count-owner',
			name: 'Task - Count by Owner',
			chart: (props: { data: DataSet, className?: string }): JSX.Element => {
				const { data: { tasks: { data } }, className } = props;
				const chartData = data.map(item => {
					return { name: item.Owner, value: 1 };
				});
				return <CountDoughnut className={className}
				                      title={'{{count}} Tasks'}
				                      data={chartData}/>;
			}
		},
		{
			key: 'task-count-categorical',
			name: 'Task - Count Categorical',
			chart: (props: { data: DataSet, className?: string, options?: { categoryBy: string } }): JSX.Element => {
				const { data: { tasks: { data } }, className, options: { categoryBy = 'Category' } = {} } = props;

				const chartData = data.map(item => {
					return { name: item[categoryBy], value: 1 };
				});

				return <CountDoughnut className={className}
				                      title={'{{count}} Tasks'}
				                      data={chartData}/>;
			},
			options: {
				groupBy: [
					{
						key: 'categoryBy',
						label: 'Count by',
						options: [
							{ label: 'Category', value: 'Category', default: true },
							{ label: 'Owner', value: 'Owner' } ]
					}
				]
			}
		},
		{
			key: 'task-gantt',
			name: 'Task Gantt',
			chart: (props: { data: DataSet, className?: string }): JSX.Element => {
				const { data: { tasks: { data } }, className } = props;

				const chartData = data.map(item => {
					return {
						name: item.Task,
						owner: item.Owner,
						startDate: item.StartDate,
						endDate: item.EndDate
					};
				});

				return <Gantt className={className} title={'{{tasks}} Tasks, {{members}} Members'} data={chartData}/>;
			}
		},
		{
			key: 'schedule-risk-management',
			name: 'Schedule - Risk Management',
			enabled: (data?: DataSet) => {
				const tasks: Array<any> = (data || {}).tasks?.data || [];
				const enabled = tasks && -1 === tasks.findIndex(item => typeof item.Workdays !== 'number');
				return { enabled, reason: 'Factor "Workdays" missing.' };
			},
			chart: (props: { data: DataSet, className?: string }): JSX.Element => {
				const { data: { tasks: { data } }, className } = props;

				const segments = {
					label: 'Man day',
					definition: [
						{ name: '5-', label: 'Perfect', take: (value: number) => value <= 5 },
						{ name: '6 ~ 10', label: 'Good', take: (value: number) => value > 5 && value <= 10 },
						{ name: '11 ~ 20', label: 'Cautious', take: (value: number) => value > 10 && value <= 20 },
						{ name: '21+', label: 'Wild', take: (value: number) => value > 20 }
					]
				};
				const chartData = data.map(item => {
					return {
						name: item.Task,
						value: item.Workdays
					};
				});

				return <SegmentBar className={className} title={'{{count}} Tasks'}
				                   segments={segments}
				                   data={chartData}/>;
			}
		}
	]
};