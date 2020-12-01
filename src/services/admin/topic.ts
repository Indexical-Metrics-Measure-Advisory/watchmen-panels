import { DataPage, FactorType, QueriedTopic, QueriedTopicForPipeline, TopicType } from './types';

const DemoTopics = [
	{
		topicId: '1', code: 'quotation', name: 'Quotation', type: TopicType.DISTINCT,
		raw: false,
		factorCount: 6, reportCount: 5,
		groupCount: 3, spaceCount: 2,
		factors: [
			{
				factorId: '101',
				name: 'quotationId',
				label: 'Quotation Sequence',
				type: FactorType.SEQUENCE
			},
			{ factorId: '102', name: 'quoteNo', label: 'Quotation No.', type: FactorType.TEXT },
			{
				factorId: '103',
				name: 'quoteDate',
				label: 'Quotation Create Date',
				type: FactorType.DATETIME
			},
			{
				factorId: '104',
				name: 'policyHolderId',
				label: 'Policy Holder Id',
				type: FactorType.SEQUENCE
			},
			{ factorId: '105', name: 'premium', label: 'Premium', type: FactorType.NUMBER },
			{ factorId: '106', name: 'issued', label: 'Issued', type: FactorType.BOOLEAN }
		]
	},
	{
		topicId: '2', code: 'policy', name: 'Policy', type: TopicType.DISTINCT,
		raw: false,
		factorCount: 7, reportCount: 4,
		groupCount: 3, spaceCount: 2,
		factors: [
			{ factorId: '201', name: 'policyId', label: 'Policy Sequence', type: FactorType.SEQUENCE },
			{ factorId: '202', name: 'quotationNo', label: 'Quotation No.', type: FactorType.TEXT },
			{
				factorId: '203',
				name: 'quoteDate',
				label: 'Quotation Create Date',
				type: FactorType.DATETIME
			},
			{ factorId: '204', name: 'policyNo', label: 'Policy No.', type: FactorType.TEXT },
			{ factorId: '205', name: 'issueDate', label: 'Policy Issue Date', type: FactorType.DATETIME },
			{
				factorId: '206',
				name: 'policyHolderId',
				label: 'Policy Holder Id',
				type: FactorType.SEQUENCE
			},
			{ factorId: '207', name: 'premium', label: 'Premium', type: FactorType.NUMBER }
		]
	},
	{
		topicId: '3', code: 'participant', name: 'Participant', type: TopicType.DISTINCT,
		description: 'Participant of quotation or policy, including policy holder, insureds, etc.',
		raw: false,
		factorCount: 6, reportCount: 2,
		groupCount: 3, spaceCount: 2,
		factors: [
			{
				factorId: '301',
				name: 'participantId',
				label: 'Participant Sequence',
				type: FactorType.SEQUENCE
			},
			{ factorId: '302', name: 'firstName', label: 'First Name', type: FactorType.TEXT },
			{ factorId: '303', name: 'lastName', label: 'Last Name', type: FactorType.TEXT },
			{ factorId: '304', name: 'fullName', label: 'Full Name', type: FactorType.TEXT },
			{ factorId: '305', name: 'dateOfBirth', label: 'Birth Date', type: FactorType.DATETIME },
			{ factorId: '306', name: 'gender', label: 'Gender', type: FactorType.ENUM },
			{ factorId: '307', name: 'city', label: 'City', type: FactorType.ENUM }
		]
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

export const listTopicsForPipeline = async (pageNumber: number, pageSize: number = 100): Promise<{ data: Array<QueriedTopicForPipeline>, completed: boolean }> => {
	return new Promise(resolve => {
		setTimeout(() => resolve({
			data: DemoTopics,
			completed: true
		}), 5000);
	});
};