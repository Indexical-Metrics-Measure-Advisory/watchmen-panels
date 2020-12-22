import {
	DataPage,
	QueriedReportForSpace,
	QueriedSpace,
	QueriedSpaceForUserGroup,
	QueriedTopicForSpace,
	QueriedUserGroupForGroupsHolder,
	Space
} from './types';

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

export const listSpacesForUserGroup = async (search: string): Promise<Array<QueriedSpaceForUserGroup>> => {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve([
				{ spaceId: '1', name: 'Quotation & Policy', description: 'All Sales Data' }
			].filter(x => x.name.toUpperCase().includes(search.toUpperCase())));
		}, 500);
	});
};

export const fetchSpace = async (spaceId: string): Promise<{ space: Space, groups: Array<QueriedUserGroupForGroupsHolder>, topics: Array<QueriedTopicForSpace>, reports: Array<QueriedReportForSpace> }> => {
	let space: Space;
	switch (spaceId) {
		case '1':
			space = {
				spaceId: '1',
				name: 'Quotation & Policy',
				description: 'All Sales Data',
				groupIds: [ '1' ]
			};
			break;
		default:
			space = {};
	}
	return {
		space,
		groups: [ { userGroupId: '1', name: 'Oklahoma', description: 'Northwest market analysis squad.' } ],
		topics: [
			{ topicId: '1', name: 'Quotation' },
			{ topicId: '2', name: 'Policy' },
			{ topicId: '3', name: 'Participant' }
		],
		reports: []
	};
};

export const saveSpace = async (space: Space): Promise<void> => {
	return new Promise(resolve => {
		space.spaceId = '10000';
		setTimeout(() => resolve(), 500);
	});
};
