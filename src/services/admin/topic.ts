import { DataPage, FactorType, QueriedFactorForPipeline, QueriedTopic, QueriedTopicForPipeline } from './types';

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
			resolve(DemoTopics.filter(topic => topic.name.toUpperCase().includes(search.toUpperCase())));
		}, 500);
	});
};

export const listFactorsByTopic = async (topicId: string): Promise<Array<QueriedFactorForPipeline>> => {
	return new Promise(resolve => {
		setTimeout(() => {
			switch (topicId) {
				case '1':
					return resolve([
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
					]);
				case '2':
					return resolve([
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
					]);
				case '3':
					return resolve([
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
					]);
				default:
					return resolve([]);
			}
		}, 500);
	});
};
