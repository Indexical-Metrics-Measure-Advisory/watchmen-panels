import dayjs from 'dayjs';
import React from 'react';
import { CountDoughnut } from '../charts/count-doughnut';
import { Gantt } from '../charts/gantt';
import { SegmentBar } from '../charts/segment-bar';
// @ts-ignore
import SoftwareImplementationTasks from './software-implementation.csv';
import { Domain, PredefinedExpression } from './types';

export const SoftwareImplementation: Domain = {
	code: 'software-implementation',
	label: 'Software Implementation',
	expressions: [
		{
			code: 'workdays', name: 'Workdays', label: 'Workdays', body: '{{EndDate}} - {{StartDate}}',
			func: (item: { EndDate: string, StartDate: string }) => {
				const { EndDate: end, StartDate: start } = item;

				const endDate = dayjs(end);
				const endWeekday = endDate.day();
				const startDate = dayjs(start);
				const startWeekday = startDate.day();

				let diffDays = endDate.diff(startDate, 'day') + 1;
				if (endWeekday >= startWeekday && diffDays <= 7) {
					// same week
					return endWeekday - startWeekday - (startWeekday === 0 ? 1 : 0) + (endWeekday === 6 ? 1 : 0);
				} else if (endWeekday >= startWeekday) {
					return Math.floor(diffDays / 7) * 5 + ((endWeekday === 6 ? 5 : endWeekday) - startWeekday);
				} else {
					return Math.floor(diffDays / 7) * 5 + (6 - (startWeekday === 0 ? 1 : startWeekday)) + endWeekday;
				}
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
		},
		{
			key: 'workdays-segmental',
			name: 'Workdays - Segmental',
			enabled: (data: Array<any>) => {
				const enabled = data && -1 === data.findIndex(item => typeof item.Workdays !== 'number');
				return { enabled, reason: 'Factor "Workdays" missing.' };
			},
			chart: (props: { data: Array<any>, className?: string }): JSX.Element => {
				const { data, className } = props;

				const segments = [
					{ name: '5-', label: 'Perfect', take: (value: number) => value <= 5 },
					{ name: '6 ~ 10', label: 'Good', take: (value: number) => value > 5 && value <= 10 },
					{ name: '11 ~ 20', label: 'Notable', take: (value: number) => value > 10 && value <= 20 },
					{ name: '21+', label: 'Poor', take: (value: number) => value > 20 }
				];
				const chartData = data.map(item => {
					return {
						name: item.Task,
						value: item.Workdays
					};
				});

				return <SegmentBar className={className} title={"{{count}} Tasks"}
				                   segments={segments}
				                   data={chartData}/>;
			}
		}
	]
};