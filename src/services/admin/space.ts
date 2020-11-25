import { DataPage, QueriedSpace } from './types';

export const listSpaces = async (options: {
	search: string;
	pageNumber?: number;
	pageSize?: number;
}): Promise<DataPage<QueriedSpace>> => {
	const { pageNumber = 1, pageSize = 9 } = options;

	return new Promise(resolve => {
		setTimeout(() => {
			resolve({
				data: [
					{
						spaceId: '1',
						name: 'Quotation & Policy',
						description: 'All Sales Data',
						topicCount: 3,
						reportCount: 2,
						groupCount: 2,
						connectionCount: 8
					}
				],
				itemCount: 0,
				pageNumber,
				pageSize,
				pageCount: 1
			});
		}, 1000);
	});
};