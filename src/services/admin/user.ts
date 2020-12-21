import { DataPage, QueriedUser, QueriedUserGroup, QueriedUserGroupForUser, User } from './types';

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
						description: 'South-center market analysis squad.',
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

export const listUserGroupsForUser = async (search: string): Promise<Array<QueriedUserGroupForUser>> => {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve([
				{
					userGroupId: '1',
					name: 'Oklahoma',
					description: 'South-center market analysis squad.'
				},
				{
					userGroupId: '2',
					name: 'Delaware'
				},
				{
					userGroupId: '3',
					name: 'Hawaii'
				},
				{
					userGroupId: '4',
					name: 'Alaska'
				},
				{
					userGroupId: '5',
					name: 'Missouri'
				},
				{
					userGroupId: '6',
					name: 'Arkansas'
				}
			].filter(x => x.name.toUpperCase().includes(search.toUpperCase())));
		}, 500);
	});
};

export const fetchUser = async (userId: string): Promise<{ user: User, groups: Array<QueriedUserGroupForUser> }> => {
	let user;
	switch (userId) {
		case '1':
			user = { userId: '1', name: 'Damon Lindelof', groupIds: [ '1' ] };
			break;
		case '2':
			user = { userId: '2', name: 'Sally Jupiter', groupIds: [ '1' ] };
			break;
		case '3':
			user = { userId: '3', name: 'Roy Raymond', groupIds: [ '1' ] };
			break;
		case '4':
			user = { userId: '4', name: 'Walter Kovacs', groupIds: [ '1' ] };
			break;
		case '5':
			user = { userId: '5', name: 'Jeffrey Dean Morgan', groupIds: [ '1' ] };
			break;
		default:
			user = {};
	}
	return {
		user,
		groups: [ { userGroupId: '1', name: 'Oklahoma', description: 'Northwest market analysis squad.' } ]
	};
};

export const saveUser = async (user: User) => {
	return new Promise(resolve => {
		user.userId = '10000';
		setTimeout(() => resolve(), 500);
	});
};