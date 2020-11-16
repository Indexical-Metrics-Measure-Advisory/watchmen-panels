import {
	ConnectedConsoleSpace,
	ConsoleSpace,
	ConsoleSpaceGroup,
	ConsoleSpaceSubject,
	ConsoleSpaceType,
	ConsoleTopic,
	ConsoleTopicFactorType,
	ConsoleTopicRelationship,
	ConsoleTopicRelationshipType
} from './types';

const demoTopics: Array<ConsoleTopic> = [
	{
		topicId: '1', code: 'quotation', name: 'Quotation',
		factors: [
			{
				factorId: '101',
				name: 'quotationId',
				label: 'Quotation Sequence',
				type: ConsoleTopicFactorType.SEQUENCE
			},
			{ factorId: '102', name: 'quoteNo', label: 'Quotation No.', type: ConsoleTopicFactorType.TEXT },
			{
				factorId: '103',
				name: 'quoteDate',
				label: 'Quotation Create Date',
				type: ConsoleTopicFactorType.DATETIME
			},
			{
				factorId: '104',
				name: 'policyHolderId',
				label: 'Policy Holder Id',
				type: ConsoleTopicFactorType.SEQUENCE
			},
			{ factorId: '105', name: 'premium', label: 'Premium', type: ConsoleTopicFactorType.NUMBER },
			{ factorId: '106', name: 'issued', label: 'Issued', type: ConsoleTopicFactorType.BOOLEAN }
		]
	},
	{
		topicId: '2', code: 'policy', name: 'Policy',
		factors: [
			{ factorId: '201', name: 'policyId', label: 'Policy Sequence', type: ConsoleTopicFactorType.SEQUENCE },
			{ factorId: '202', name: 'quotationNo', label: 'Quotation No.', type: ConsoleTopicFactorType.TEXT },
			{
				factorId: '203',
				name: 'quoteDate',
				label: 'Quotation Create Date',
				type: ConsoleTopicFactorType.DATETIME
			},
			{ factorId: '204', name: 'policyNo', label: 'Policy No.', type: ConsoleTopicFactorType.TEXT },
			{ factorId: '205', name: 'issueDate', label: 'Policy Issue Date', type: ConsoleTopicFactorType.DATETIME },
			{
				factorId: '206',
				name: 'policyHolderId',
				label: 'Policy Holder Id',
				type: ConsoleTopicFactorType.SEQUENCE
			},
			{ factorId: '207', name: 'premium', label: 'Premium', type: ConsoleTopicFactorType.NUMBER }
		]
	},
	{
		topicId: '3', code: 'participant', name: 'Participant',
		factors: [
			{
				factorId: '301',
				name: 'participantId',
				label: 'Participant Sequence',
				type: ConsoleTopicFactorType.SEQUENCE
			},
			{ factorId: '302', name: 'firstName', label: 'First Name', type: ConsoleTopicFactorType.TEXT },
			{ factorId: '303', name: 'lastName', label: 'Last Name', type: ConsoleTopicFactorType.TEXT },
			{ factorId: '304', name: 'fullName', label: 'Full Name', type: ConsoleTopicFactorType.TEXT },
			{ factorId: '305', name: 'dateOfBirth', label: 'Birth Date', type: ConsoleTopicFactorType.DATETIME },
			{ factorId: '306', name: 'gender', label: 'Gender', type: ConsoleTopicFactorType.ENUM, enum: 'Gender' },
			{ factorId: '307', name: 'city', label: 'City', type: ConsoleTopicFactorType.ENUM, enum: 'City' }
		]
	}
];
const demoTopicRelations: Array<ConsoleTopicRelationship> = [
	{
		relationId: '1',
		sourceTopicId: '2',
		sourceFactorNames: [ 'quotationNo' ],
		targetTopicId: '1',
		targetFactorNames: [ 'quoteNo' ],
		type: ConsoleTopicRelationshipType.ONE_2_ONE,
		strictToTarget: true,
		strictToSource: false
	},
	{
		relationId: '2',
		sourceTopicId: '2',
		sourceFactorNames: [ 'policyHolderId' ],
		targetTopicId: '3',
		targetFactorNames: [ 'participantId' ],
		type: ConsoleTopicRelationshipType.MANY_2_ONE,
		strictToTarget: true,
		strictToSource: false
	},
	{
		relationId: '3',
		sourceTopicId: '1',
		sourceFactorNames: [ 'policyHolderId' ],
		targetTopicId: '3',
		targetFactorNames: [ 'participantId' ],
		type: ConsoleTopicRelationshipType.MANY_2_ONE,
		strictToTarget: true,
		strictToSource: false
	}
];
export const fetchConnectedSpaces = async (): Promise<Array<ConnectedConsoleSpace>> => {
	return [ {
		spaceId: '1',
		connectId: '1',
		name: 'Sales Statistics',
		type: ConsoleSpaceType.PUBLIC,
		lastVisitTime: '2020/10/31 14:23:07',
		topics: demoTopics,
		topicRelations: demoTopicRelations,
		groups: [],
		subjects: []
	}, {
		spaceId: '1',
		connectId: '2',
		name: 'Sales Statistics in New York',
		type: ConsoleSpaceType.PRIVATE,
		lastVisitTime: '2020/11/05 15:14:11',
		topics: demoTopics,
		topicRelations: demoTopicRelations,
		subjects: [
			{
				subjectId: '1',
				name: 'Premium Summary',
				topicCount: 1,
				graphicsCount: 2,
				lastVisitTime: '2020/11/12 20:20:01',
				createdAt: '2020/11/12 19:20:02'
			},
			{
				subjectId: '2',
				name: 'District Summary',
				topicCount: 2,
				graphicsCount: 1,
				lastVisitTime: '2020/11/02 20:25:01',
				createdAt: '2020/11/01 19:25:02'
			}
		],
		groups: [
			{
				groupId: '1', name: 'All About Money', subjects: [
					{
						subjectId: '101',
						name: 'Premium Summary',
						topicCount: 1,
						graphicsCount: 1,
						lastVisitTime: '2020/11/12 20:25:01',
						createdAt: '2020/11/12 19:25:02'
					}
				]
			},
			{
				groupId: '2', name: 'All About Time', subjects: [
					{
						subjectId: '201',
						name: 'Premium Summary',
						topicCount: 2,
						graphicsCount: 1,
						lastVisitTime: '2020/11/12 20:25:01',
						createdAt: '2020/11/12 19:25:02'
					}
				]
			},
			{
				groupId: '3', name: 'All About Gender', subjects: [
					{
						subjectId: '301',
						name: 'Premium Summary',
						topicCount: 2,
						graphicsCount: 1,
						lastVisitTime: '2020/8/31 20:25:01',
						createdAt: '2020/8/21 19:25:02'
					}
				]
			},
			{
				groupId: '4', name: 'All About Age', subjects: [
					{
						subjectId: '401',
						name: 'Premium Summary',
						topicCount: 2,
						graphicsCount: 1,
						lastVisitTime: '2019/11/12 20:25:01',
						createdAt: '2019/11/12 19:25:02'
					}
				]
			}
		]
	}, {
		spaceId: '1',
		connectId: '3',
		name: 'Sales Statistics in Maine',
		type: ConsoleSpaceType.PRIVATE,
		lastVisitTime: '2020/11/05 14:13:11',
		topics: demoTopics,
		topicRelations: demoTopicRelations,
		groups: [],
		subjects: []
	}, {
		spaceId: '1',
		connectId: '4',
		name: 'Sales Statistics in New Hampshire',
		type: ConsoleSpaceType.PUBLIC,
		lastVisitTime: '2020/11/05 13:12:11',
		topics: demoTopics,
		topicRelations: demoTopicRelations,
		groups: [],
		subjects: []
	}, {
		spaceId: '1',
		connectId: '5',
		name: 'Sales Statistics in Vermont',
		type: ConsoleSpaceType.PUBLIC,
		lastVisitTime: '2020/11/05 12:11:11',
		topics: demoTopics,
		topicRelations: demoTopicRelations,
		groups: [],
		subjects: []
	}, {
		spaceId: '1',
		connectId: '6',
		name: 'Sales Statistics in Rhode Island',
		type: ConsoleSpaceType.PRIVATE,
		lastVisitTime: '2020/11/05 11:10:11',
		topics: demoTopics,
		topicRelations: demoTopicRelations,
		groups: [],
		subjects: []
	}, {
		spaceId: '1',
		connectId: '7',
		name: 'Sales Statistics in Connecticut',
		type: ConsoleSpaceType.PRIVATE,
		lastVisitTime: '2020/11/05 10:09:11',
		topics: demoTopics,
		topicRelations: demoTopicRelations,
		groups: [],
		subjects: []
	}, {
		spaceId: '1',
		connectId: '8',
		name: 'Sales Statistics in Massachusetts',
		type: ConsoleSpaceType.PUBLIC,
		lastVisitTime: '2020/11/05 09:08:11',
		topics: demoTopics,
		topicRelations: demoTopicRelations,
		groups: [],
		subjects: []
	} ];
};

export const fetchAvailableSpaces = async (): Promise<Array<ConsoleSpace>> => {
	return [ {
		spaceId: '1',
		name: 'Sales Statistics',
		topics: demoTopics,
		topicRelations: demoTopicRelations
	}, {
		spaceId: '2',
		name: 'Claim Trend',
		topics: demoTopics
	} ];
};

// TODO demo purpose
let newGroupId = 10000;
let newSubjectId = 10000;
export const createGroup = async (data: { space: ConnectedConsoleSpace, group: ConsoleSpaceGroup }): Promise<void> => {
	data.group.groupId = `${newGroupId++}`;
};
export const deleteGroup = async (group: ConsoleSpaceGroup): Promise<void> => {

};

export const createSubject = async (data: { space: ConnectedConsoleSpace, group?: ConsoleSpaceGroup, subject: ConsoleSpaceSubject }): Promise<void> => {
	data.subject.subjectId = `${newSubjectId++}`;
};
export const deleteSubject = async (subject: ConsoleSpaceSubject): Promise<void> => {

};