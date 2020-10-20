import dayjs from 'dayjs';
// @ts-ignore
import SoftwareImplementationTasks from './software-implementation.csv';

export interface DomainExpression {
	code: string;
	name: string;
	label: string;
	body: string;
}

export interface PredefinedExpression extends DomainExpression {
	func: () => any;
}

export const CustomDomainExpression: DomainExpression = {
	code: 'custom',
	name: 'customIndicator',
	label: 'Custom Indicator',
	body: ''
};

export interface Domain {
	code: string;
	label: string;
	expressions?: Array<DomainExpression>;
	demo?: { [key in string]: string }
}

export const NoDomain = { code: 'no-domain', label: 'No Domain' };
export const InsuranceVisualization = { code: 'insurance-visualization', label: 'Insurance Visualization' };
export const MarketingInvestigating = { code: 'marketing-investigating', label: 'Marketing Investigating' };
export const SalesPlanning = { code: 'sales-planning', label: 'Sales Planning' };
export const AssetsManagement = { code: 'assets-management', label: 'Assets Management' };
export const SoftwareImplementation = {
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
			name: 'Categorical'

		}
	]
};

export interface TopDomains {
	domains: Array<Domain>;
	hasMore: boolean;
}

export const listTopDomains = async (): Promise<TopDomains> => {
	return {
		domains: [
			InsuranceVisualization,
			MarketingInvestigating,
			SalesPlanning,
			AssetsManagement,
			SoftwareImplementation
		],
		hasMore: true
	};
};

export const getDomainDemoData = async (location: string): Promise<string> => {
	const response = await fetch(location);
	return await response.text();
};