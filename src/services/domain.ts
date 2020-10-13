export interface Domain {
	id: number;
	code: string;
	label: string;
}

export interface TopDomains {
	domains: Array<Domain>;
	hasMore: boolean;
}

export const listTopDomains = async (): Promise<TopDomains> => {
	return {
		domains: [
			{ id: 1, code: 'IV01', label: 'Insurance Visualization' },
			{ id: 2, code: 'MI01', label: 'Marketing Investigating' },
			{ id: 3, code: 'SP01', label: 'Sales Planning' },
			{ id: 4, code: 'AM01', label: 'Assets Management' },
			{ id: 5, code: 'SI01', label: 'Software Implementation' }
		],
		hasMore: true
	};
};