import { DataPage, QueriedReport, QueriedReportForSpace } from './types';

export const listReports = async (options: {
	search: string;
	pageNumber?: number;
	pageSize?: number;
}): Promise<DataPage<QueriedReport>> => {
	const { pageNumber = 1, pageSize = 9 } = options;

	return new Promise(resolve => {
		setTimeout(() => {
			resolve({
				data: [
					// {
					// 	reportId: '1',
					// 	name: 'Premium on State',
					// 	description: 'Annual premium summary group by state.',
					// 	predefined: true,
					// 	topicCount: 2,
					// 	groupCount: 1,
					// 	spaceCount: 2
					// }
				],
				itemCount: 0,
				pageNumber,
				pageSize,
				pageCount: 1
			});
		}, 1000);
	});
};

export const listReportsForSpace = async (search: string): Promise<Array<QueriedReportForSpace>> => {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(([] as Array<QueriedReportForSpace>).filter(x => x.name.toUpperCase().includes(search.toUpperCase())));
		}, 500);
	});
};