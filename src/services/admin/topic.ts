import { getServiceHost, isMockService } from "../service_utils";
import {
	DatePartArithmetic,
	PipelineFlow,
	PipelineTriggerType,
	SomeValueType,
	WriteTopicActionType,
} from "./pipeline-types";
import {
	DataPage,
	FactorType,
	QueriedTopic,
	QueriedTopicForPipeline,
	QueriedTopicForSpace,
	Topic,
	TopicType,
} from "./types";

const DemoTopics = [
	{
		topicId: "1",
		code: "quotation",
		name: "Quotation",
		type: TopicType.DISTINCT,
		raw: false,
		factorCount: 6,
		reportCount: 5,
		groupCount: 3,
		spaceCount: 2,
		factors: [
			{
				factorId: "101",
				name: "quotationId",
				label: "Quotation Sequence",
				type: FactorType.SEQUENCE,
			},
			{ factorId: "102", name: "quoteNo", label: "Quotation No.", type: FactorType.TEXT },
			{
				factorId: "103",
				name: "quoteDate",
				label: "Quotation Create Date",
				type: FactorType.DATETIME,
			},
			{
				factorId: "104",
				name: "policyHolderId",
				label: "Policy Holder Id",
				type: FactorType.SEQUENCE,
			},
			{ factorId: "105", name: "premium", label: "Premium", type: FactorType.NUMBER },
			{ factorId: "106", name: "issued", label: "Issued", type: FactorType.BOOLEAN },
		],
	},
	{
		topicId: "2",
		code: "policy",
		name: "Policy",
		type: TopicType.DISTINCT,
		raw: false,
		factorCount: 7,
		reportCount: 4,
		groupCount: 3,
		spaceCount: 2,
		factors: [
			{ factorId: "201", name: "policyId", label: "Policy Sequence", type: FactorType.SEQUENCE },
			{ factorId: "202", name: "quotationNo", label: "Quotation No.", type: FactorType.TEXT },
			{
				factorId: "203",
				name: "quoteDate",
				label: "Quotation Create Date",
				type: FactorType.DATETIME,
			},
			{ factorId: "204", name: "policyNo", label: "Policy No.", type: FactorType.TEXT },
			{ factorId: "205", name: "issueDate", label: "Policy Issue Date", type: FactorType.DATETIME },
			{
				factorId: "206",
				name: "policyHolderId",
				label: "Policy Holder Id",
				type: FactorType.SEQUENCE,
			},
			{ factorId: "207", name: "premium", label: "Premium", type: FactorType.NUMBER },
		],
	},
	{
		topicId: "3",
		code: "participant",
		name: "Participant",
		type: TopicType.DISTINCT,
		description: "Participant of quotation or policy, including policy holder, insureds, etc.",
		raw: false,
		factorCount: 6,
		reportCount: 2,
		groupCount: 3,
		spaceCount: 2,
		factors: [
			{
				factorId: "301",
				name: "participantId",
				label: "Participant Sequence",
				type: FactorType.SEQUENCE,
			},
			{ factorId: "302", name: "firstName", label: "First Name", type: FactorType.TEXT },
			{ factorId: "303", name: "lastName", label: "Last Name", type: FactorType.TEXT },
			{ factorId: "304", name: "fullName", label: "Full Name", type: FactorType.TEXT },
			{ factorId: "305", name: "dateOfBirth", label: "Birth Date", type: FactorType.DATETIME },
			{ factorId: "306", name: "gender", label: "Gender", type: FactorType.ENUM },
			{ factorId: "307", name: "city", label: "City", type: FactorType.ENUM },
		],
	},
	{
		topicId: "4",
		code: "raw-quotation",
		name: "Raw Quotation",
		type: TopicType.RAW,
		raw: true,
		factorCount: 10,
		reportCount: 0,
		groupCount: 0,
		spaceCount: 0,
		factors: [
			{ factorId: "401", name: "quotationId", label: "Quotation Sequence", type: FactorType.SEQUENCE },
			{ factorId: "402", name: "quotationNo", label: "Quotation No.", type: FactorType.TEXT },
			{ factorId: "403", name: "quoteDate", label: "Quotation Create Date", type: FactorType.DATETIME },
			{ factorId: "404", name: "policyNo", label: "Policy No.", type: FactorType.TEXT },
			{ factorId: "405", name: "issueDate", label: "Issue Date", type: FactorType.DATETIME },
			{ factorId: "406", name: "holderId", label: "Holder Id", type: FactorType.SEQUENCE },
			{ factorId: "407", name: "holderFirstName", label: "Holder First Name", type: FactorType.TEXT },
			{ factorId: "408", name: "holderLastName", label: "Holder Last Name", type: FactorType.TEXT },
			{
				factorId: "410",
				name: "holderDateOfBirth",
				label: "Policy Holder Birth Date",
				type: FactorType.DATETIME,
			},
			{ factorId: "411", name: "holderGender", label: "Holder Gender", type: FactorType.ENUM },
			{ factorId: "412", name: "holderCity", label: "Holder City", type: FactorType.ENUM },
			{ factorId: "413", name: "premium", label: "Premium", type: FactorType.NUMBER },
		],
	},
	{
		topicId: "5",
		code: "weekly-policy-premium",
		name: "Weekly Policy Premium",
		type: TopicType.TIME,
		raw: false,
		factorCount: 3,
		reportCount: 0,
		groupCount: 0,
		spaceCount: 0,
		factors: [
			{ factorId: "501", name: "year", label: "Year", type: FactorType.NUMBER },
			{ factorId: "502", name: "week", label: "Week", type: FactorType.NUMBER },
			{ factorId: "503", name: "premium", label: "Premium Sum", type: FactorType.NUMBER },
		],
	},
	{
		topicId: "6",
		code: "monthly-policy-premium",
		name: "Monthly Policy Premium",
		type: TopicType.TIME,
		raw: false,
		factorCount: 3,
		reportCount: 0,
		groupCount: 0,
		spaceCount: 0,
		factors: [
			{ factorId: "601", name: "year", label: "Year", type: FactorType.NUMBER },
			{ factorId: "602", name: "month", label: "Month", type: FactorType.NUMBER },
			{ factorId: "603", name: "premium", label: "Premium Sum", type: FactorType.NUMBER },
		],
	},
	{
		topicId: "7",
		code: "raw-endorsement",
		name: "Raw Endorsement",
		type: TopicType.RAW,
		raw: true,
		factorCount: 10,
		reportCount: 0,
		groupCount: 0,
		spaceCount: 0,
		factors: [
			{ factorId: "701", name: "endorsementId", label: "Endorsement Sequence", type: FactorType.SEQUENCE },
			{ factorId: "702", name: "endorsementNo", label: "Endorsement No.", type: FactorType.TEXT },
			{ factorId: "703", name: "endorsementDate", label: "Endorsement Create Date", type: FactorType.DATETIME },
			{ factorId: "704", name: "policyNo", label: "Policy No.", type: FactorType.TEXT },
			{ factorId: "705", name: "effectiveDate", label: "Effective Date", type: FactorType.DATETIME },
			{ factorId: "706", name: "premium", label: "Premium", type: FactorType.NUMBER },
		],
	},
	{
		topicId: "8",
		code: "weekly-policy-premium-increment",
		name: "Weekly Policy Premium Increment",
		type: TopicType.RATIO,
		raw: false,
		factorCount: 3,
		reportCount: 0,
		groupCount: 0,
		spaceCount: 0,
		factors: [
			{ factorId: "801", name: "year", label: "Year", type: FactorType.NUMBER },
			{ factorId: "802", name: "week", label: "Week", type: FactorType.NUMBER },
			{ factorId: "803", name: "incrementRatio", label: "Increment Ratio", type: FactorType.NUMBER },
		],
	},
];

export const listTopics = async (options: {
	search: string;
	pageNumber?: number;
	pageSize?: number;
}): Promise<DataPage<QueriedTopic>> => {
	if (isMockService()) {
		// call api
		const { pageNumber = 1, pageSize = 9 } = options;

		return new Promise((resolve) => {
			setTimeout(() => {
				resolve({
					data: DemoTopics,
					itemCount: DemoTopics.length,
					pageNumber,
					pageSize,
					pageCount: 3,
				});
			}, 3000);
		});

		// const token: string = Storage.findToken();
		// const account = Storage.findAccount();
	} else {
		// console.log(mock_flag);
		const response = await fetch(`${getServiceHost()}topic/name?query_name=${options.search}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				// authorization: token,
			},
			body: JSON.stringify({ pageNumber: options.pageNumber, pageSize: options.pageSize }),
		});

		const result = await response.json();

		return result;
	}
};

export const listTopicsForPipeline = async (
	pageNumber: number,
	pageSize: number = 100
): Promise<{ data: Array<QueriedTopicForPipeline>; completed: boolean }> => {
	return new Promise((resolve) => {
		setTimeout(
			() =>
				resolve({
					data: DemoTopics,
					completed: true,
				}),
			1000
		);
	});
};

const DemoPipelineOfPolicy = {
	topicId: "2",
	consume: [
		{
			topicId: "4",
			type: PipelineTriggerType.INSERT,
			stages: [
				{
					units: [
						{
							do: [
								{
									type: WriteTopicActionType.WRITE_FACTOR,
									topicId: "2",
									factorId: "201",
									value: { type: SomeValueType.FACTOR, topicId: "4", factorId: "401" },
								},
							],
						},
					],
				},
			],
		},
		{
			topicId: "7",
			type: PipelineTriggerType.INSERT,
			stages: [
				{
					units: [
						{
							do: [
								{
									type: WriteTopicActionType.WRITE_FACTOR,
									topicId: "2",
									factorId: "201",
									value: { type: SomeValueType.FACTOR, topicId: "4", factorId: "401" },
								},
							],
						},
					],
				},
			],
		},
	],
	produce: [
		{
			topicId: "2",
			type: PipelineTriggerType.INSERT_OR_MERGE,
			stages: [
				{
					units: [
						{
							do: [
								{
									type: WriteTopicActionType.WRITE_FACTOR,
									topicId: "5",
									factorId: "501",
									value: {
										type: SomeValueType.FACTOR,
										topicId: "2",
										factorId: "205",
										arithmetic: DatePartArithmetic.YEAR_OF,
									},
								},
								{
									type: WriteTopicActionType.WRITE_FACTOR,
									topicId: "5",
									factorId: "502",
									value: {
										type: SomeValueType.FACTOR,
										topicId: "2",
										factorId: "205",
										arithmetic: DatePartArithmetic.WEEK_OF,
									},
								},
								{
									type: WriteTopicActionType.WRITE_FACTOR,
									topicId: "5",
									factorId: "503",
									value: {
										type: SomeValueType.FACTOR,
										topicId: "2",
										factorId: "207",
									},
								},
							],
						},
						{
							do: [
								{
									type: WriteTopicActionType.WRITE_FACTOR,
									topicId: "6",
									factorId: "601",
									value: {
										type: SomeValueType.FACTOR,
										topicId: "2",
										factorId: "205",
										arithmetic: DatePartArithmetic.YEAR_OF,
									},
								},
								{
									type: WriteTopicActionType.WRITE_FACTOR,
									topicId: "6",
									factorId: "602",
									value: {
										type: SomeValueType.FACTOR,
										topicId: "2",
										factorId: "205",
										arithmetic: DatePartArithmetic.MONTH_OF,
									},
								},
								{
									type: WriteTopicActionType.WRITE_FACTOR,
									topicId: "6",
									factorId: "603",
									value: {
										type: SomeValueType.FACTOR,
										topicId: "2",
										factorId: "207",
									},
								},
							],
						},
					],
				},
			],
		},
		{
			topicId: "5",
			type: PipelineTriggerType.INSERT_OR_MERGE,
			stages: [
				{
					units: [
						{
							do: [
								{
									type: WriteTopicActionType.WRITE_FACTOR,
									topicId: "8",
									factorId: "801",
									value: {
										type: SomeValueType.FACTOR,
										topicId: "5",
										factorId: "501",
									},
								},
							],
						},
					],
				},
			],
		},
	],
};

export const fetchPipeline = async (topicId: string): Promise<PipelineFlow> => {
	return new Promise((resolve) => {
		setTimeout(() => {
			if (topicId === "2") {
				resolve(DemoPipelineOfPolicy);
			} else {
				resolve({ topicId, consume: [], produce: [] });
			}
		}, 1000);
	});
};

export const listTopicsForSpace = async (search: string): Promise<Array<QueriedTopicForSpace>> => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(
				[
					{ topicId: "1", name: "Quotation" },
					{ topicId: "2", name: "Policy" },
					{ topicId: "3", name: "Participant" },
				].filter((x) => x.name.toUpperCase().includes(search.toUpperCase()))
			);
		}, 500);
	});
};

export const fetchTopic = async (topicId: string): Promise<{ topic: Topic }> => {
	let topic: Topic;
	switch (true) {
		case ["1", "2", "3", "4", "5", "6", "7", "8"].includes(`${topicId}`):
			const { topicId: id, code, name, type, description, factors } = DemoTopics.find(
				(topic) => topic.topicId === topicId
			)!;
			topic = { topicId: id, code, name, type, description, factors };
			break;
		default:
			topic = { type: TopicType.DISTINCT, factors: [] };
	}
	return { topic };
};

export const saveTopic = async (topic: Topic): Promise<void> => {
	console.log(isMockService());
	if (isMockService()) {
		// call api
		return new Promise((resolve) => {
			topic.topicId = "10000";
			setTimeout(() => resolve(), 500);
		});

		// const token: string = Storage.findToken();
		// const account = Storage.findAccount();
	} else {
		// console.log(mock_flag);
		const response = await fetch(`${getServiceHost()}topic`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				// authorization: token,
			},
			body: JSON.stringify(topic),
		});

		// const result = await
		return await response.json();
	}
};
