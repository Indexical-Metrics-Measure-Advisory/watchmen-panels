import { SoftwareImplementation } from './software-implementation';
// @ts-ignore
import { Domain } from './types';

export const NoDomain: Domain = { code: 'no-domain', label: 'No Domain' };
export const InsuranceVisualization: Domain = { code: 'insurance-visualization', label: 'Insurance Visualization' };
export const MarketingInvestigating: Domain = { code: 'marketing-investigating', label: 'Marketing Investigating' };
export const SalesPlanning: Domain = { code: 'sales-planning', label: 'Sales Planning' };
export const AssetsManagement: Domain = { code: 'assets-management', label: 'Assets Management' };

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
