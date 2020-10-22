import { ChartElement } from '../charts/types';

export interface DomainExpression {
	code: string;
	name: string;
	label: string;
	body: string;
}

export interface PredefinedExpression extends DomainExpression {
	func: (item: any) => any;
}

export const CustomDomainExpression: DomainExpression = {
	code: 'custom',
	name: 'customIndicator',
	label: 'Custom Indicator',
	body: ''
};

export interface DomainChartGroupBy {
	key: string;
	label: string;
	options: Array<{ label: string, value: string, default?: true }>
}

export interface DomainChartOptions {
	groupBy?: Array<DomainChartGroupBy>
}

export interface DomainChart {
	key: string;
	name: string;
	chart: ChartElement;
	enabled?: (data: Array<any>) => { enabled: boolean, reason?: string };
	options?: DomainChartOptions
}

export interface Domain {
	code: string;
	label: string;
	expressions?: Array<DomainExpression>;
	demo?: { [key in string]: string },
	charts?: Array<DomainChart>
}
