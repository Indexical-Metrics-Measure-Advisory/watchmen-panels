// @ts-ignore
import SoftwareImplementationTasks from './software-implementation.csv';

export interface DomainExpression {
	code: string;
	name: string;
	label: string;
	body: string;
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
		{ code: 'workdays', name: 'workdays', label: 'Workdays', body: '{{EndDate}} - {{StartDate}}' }
	],
	demo: {
		tasks: SoftwareImplementationTasks
	}
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