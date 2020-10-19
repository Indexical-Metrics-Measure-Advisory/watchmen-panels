export interface Domain {
	code: string;
	label: string;
}

export const NoDomain = { code: 'no-domain', label: 'No Domain' };

export interface TopDomains {
	domains: Array<Domain>;
	hasMore: boolean;
}

export const listTopDomains = async (): Promise<TopDomains> => {
	return {
		domains: [
			{ code: 'insurance-visualization', label: 'Insurance Visualization' },
			{ code: 'marketing-investigating', label: 'Marketing Investigating' },
			{ code: 'sales-planning', label: 'Sales Planning' },
			{ code: 'assets-management', label: 'Assets Management' },
			{ code: 'software-implementation', label: 'Software Implementation' }
		],
		hasMore: true
	};
};