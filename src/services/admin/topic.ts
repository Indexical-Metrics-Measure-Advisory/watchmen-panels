import { DataPage, QueriedTopic, QueriedTopicForPipeline } from './types';

const DemoTopics = [
	{
		topicId: '1', code: 'quotation', name: 'Quotation',
		raw: false,
		factorCount: 6, reportCount: 5,
		groupCount: 3, spaceCount: 2
	},
	{
		topicId: '2', code: 'policy', name: 'Policy',
		raw: false,
		factorCount: 7, reportCount: 4,
		groupCount: 3, spaceCount: 2
	},
	{
		topicId: '3', code: 'participant', name: 'Participant',
		description: 'Participant of quotation or policy, including policy holder, insureds, etc.',
		raw: false,
		factorCount: 6, reportCount: 2,
		groupCount: 3, spaceCount: 2
	}
];

export const listTopics = async (options: {
	search: string;
	pageNumber?: number;
	pageSize?: number;
}): Promise<DataPage<QueriedTopic>> => {
	const { pageNumber = 1, pageSize = 9 } = options;

	return new Promise(resolve => {
		setTimeout(() => {
			resolve({
				data: DemoTopics,
				itemCount: DemoTopics.length,
				pageNumber,
				pageSize,
				pageCount: 3
			});
		}, 3000);
	});
};

export const listTopicsForPipeline = async (search: string): Promise<Array<QueriedTopicForPipeline>> => {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(DemoTopics);
		}, 500);
	});
};