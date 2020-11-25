import { DataPage, QueriedUser, QueriedUserGroup } from './types';

export const listUserGroups = async (options: {
	search: string;
	pageNumber?: number;
	pageSize?: number;
}): Promise<DataPage<QueriedUserGroup>> => {
	const { pageNumber = 1, pageSize = 9 } = options;

	return new Promise(resolve => {
		setTimeout(() => {
			resolve({
				data: [
					{
						userGroupId: '1',
						name: 'Oklahoma',
						description: 'Northwest market analysis squad.',
						userCount: 4,
						spaceCount: 2,
						topicCount: 3,
						reportCount: 21
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

export const listUsers = async (options: {
	search: string;
	pageNumber?: number;
	pageSize?: number;
}): Promise<DataPage<QueriedUser>> => {
	const { pageNumber = 1, pageSize = 9 } = options;

	return new Promise(resolve => {
		setTimeout(() => {
			resolve({
				data: [
					{
						userId: '1',
						name: 'Damon Lindelof',
						spaceCount: 2,
						topicCount: 3,
						reportCount: 7
					},
					{
						userId: '2',
						name: 'Sally Jupiter',
						spaceCount: 2,
						topicCount: 3,
						reportCount: 2
					},
					{
						userId: '3',
						name: 'Roy Raymond',
						spaceCount: 2,
						topicCount: 3,
						reportCount: 4
					},
					{
						userId: '4',
						name: 'Walter Kovacs',
						spaceCount: 2,
						topicCount: 3,
						reportCount: 8
					},
					{
						userId: '5',
						name: 'Jeffrey Dean Morgan',
						spaceCount: 2,
						topicCount: 3,
						reportCount: 0
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