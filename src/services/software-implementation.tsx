import dayjs from 'dayjs';
import React from 'react';
import { CountDoughnut } from '../charts/count-doughnut';
import { Gantt } from '../charts/gantt';
// @ts-ignore
import SoftwareImplementationTasks from './software-implementation.csv';
import { Domain, PredefinedExpression } from './types';

export const SoftwareImplementation: Domain = {
	code: 'software-implementation',
	label: 'Software Implementation',
	expressions: [
		{
			code: 'workdays', name: 'workdays', label: 'Workdays', body: '{{EndDate}} - {{StartDate}}',
			func: (item: { EndDate: string, StartDate: string }) => {
				const { EndDate: end, StartDate: start } = item;

				const endDate = dayjs(end);
				const startDate = dayjs(start);

				let days = endDate.diff(startDate, 'day') + 1;

				switch (startDate.day()) {
					case 0:
						days -= 1;
						break;
					case 6:
						days -= 2;
						break;
					default:
				}
				return days - Math.floor(days / 7) * 2 - ((days) % 7 - 5);
			}
		} as PredefinedExpression
	],
	demo: {
		tasks: SoftwareImplementationTasks
	},
	charts: [
		{
			key: 'task-count-category',
			name: 'Task - Count by Category',
			chart: (props: { data: Array<any>, className?: string }): JSX.Element => {
				const { data, className } = props;
				const chartData = data.map(item => {
					return { name: item.Category, value: 1 };
				});
				return <CountDoughnut className={className}
				                      title={"{{count}} Tasks"}
				                      data={chartData}/>;
			}
		},
		{
			key: 'task-count-owner',
			name: 'Task - Count by Owner',
			chart: (props: { data: Array<any>, className?: string }): JSX.Element => {
				const { data, className } = props;
				const chartData = data.map(item => {
					return { name: item.Owner, value: 1 };
				});
				return <CountDoughnut className={className}
				                      title={"{{count}} Tasks"}
				                      data={chartData}/>;
			}
		},
		{
			key: 'task-count-categorical',
			name: 'Task - Count Categorical',
			chart: (props: { data: Array<any>, className?: string, options?: { categoryBy: string } }): JSX.Element => {
				const { data, className, options: { categoryBy = 'Category' } = {} } = props;

				const chartData = data.map(item => {
					return { name: item[categoryBy], value: 1 };
				});

				return <CountDoughnut className={className}
				                      title={"{{count}} Tasks"}
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
			chart: (props: { data: Array<any>, className?: string }): JSX.Element => {
				const { data, className } = props;

				const chartData = data.map(item => {
					return {
						name: item.Task,
						owner: item.Owner,
						startDate: item.StartDate,
						endDate: item.EndDate
					};
				});

				return <Gantt className={className} title={"{{tasks}} Tasks, {{members}} Members"} data={chartData}/>;
			}
		}
	]
};