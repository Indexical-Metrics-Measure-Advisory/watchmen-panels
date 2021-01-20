import dayjs from "dayjs";
import { findToken } from "../account/account-session";
import { DataPage } from "../admin/types";
import { getServiceHost, isMockService } from "../service_utils";
import {
	ConnectedConsoleSpace,
	ConsoleSpace,
	ConsoleSpaceGroup,
	ConsoleSpaceSubject,
	ConsoleSpaceSubjectChartDataSet,
	ConsoleSpaceType,
	ConsoleTopic,
	ConsoleTopicFactorType,
	ConsoleTopicRelationship,
	ConsoleTopicRelationshipType,
} from "./types";

const demoTopics: Array<ConsoleTopic> = [
	{
		topicId: "1",
		code: "quotation",
		name: "Quotation",
		factors: [
			{
				factorId: "101",
				name: "quotationId",
				label: "Quotation Sequence",
				type: ConsoleTopicFactorType.SEQUENCE,
			},
			{ factorId: "102", name: "quoteNo", label: "Quotation No.", type: ConsoleTopicFactorType.TEXT },
			{
				factorId: "103",
				name: "quoteDate",
				label: "Quotation Create Date",
				type: ConsoleTopicFactorType.DATETIME,
			},
			{
				factorId: "104",
				name: "policyHolderId",
				label: "Policy Holder Id",
				type: ConsoleTopicFactorType.SEQUENCE,
			},
			{ factorId: "105", name: "premium", label: "Premium", type: ConsoleTopicFactorType.NUMBER },
			{ factorId: "106", name: "issued", label: "Issued", type: ConsoleTopicFactorType.BOOLEAN },
		],
	},
	{
		topicId: "2",
		code: "policy",
		name: "Policy",
		factors: [
			{ factorId: "201", name: "policyId", label: "Policy Sequence", type: ConsoleTopicFactorType.SEQUENCE },
			{ factorId: "202", name: "quotationNo", label: "Quotation No.", type: ConsoleTopicFactorType.TEXT },
			{
				factorId: "203",
				name: "quoteDate",
				label: "Quotation Create Date",
				type: ConsoleTopicFactorType.DATETIME,
			},
			{ factorId: "204", name: "policyNo", label: "Policy No.", type: ConsoleTopicFactorType.TEXT },
			{ factorId: "205", name: "issueDate", label: "Policy Issue Date", type: ConsoleTopicFactorType.DATETIME },
			{
				factorId: "206",
				name: "policyHolderId",
				label: "Policy Holder Id",
				type: ConsoleTopicFactorType.SEQUENCE,
			},
			{ factorId: "207", name: "premium", label: "Premium", type: ConsoleTopicFactorType.NUMBER },
		],
	},
	{
		topicId: "3",
		code: "participant",
		name: "Participant",
		factors: [
			{
				factorId: "301",
				name: "participantId",
				label: "Participant Sequence",
				type: ConsoleTopicFactorType.SEQUENCE,
			},
			{ factorId: "302", name: "firstName", label: "First Name", type: ConsoleTopicFactorType.TEXT },
			{ factorId: "303", name: "lastName", label: "Last Name", type: ConsoleTopicFactorType.TEXT },
			{ factorId: "304", name: "fullName", label: "Full Name", type: ConsoleTopicFactorType.TEXT },
			{ factorId: "305", name: "dateOfBirth", label: "Birth Date", type: ConsoleTopicFactorType.DATETIME },
			{
				factorId: "306",
				name: "gender",
				label: "Gender",
				type: ConsoleTopicFactorType.ENUM,
				enum: JSON.stringify([
					{ value: "F", label: "Female" },
					{ value: "M", label: "Male" },
				]),
			},
			{
				factorId: "307",
				name: "city",
				label: "City",
				type: ConsoleTopicFactorType.ENUM,
				enum: JSON.stringify([
					{ value: "AU", label: "Augusta" },
					{ value: "BO", label: "Boston" },
					{ value: "CO", label: "Concord" },
					{ value: "HA", label: "Hartford" },
					{ value: "MO", label: "Montpelier" },
					{ value: "NY", label: "New York" },
					{ value: "PR", label: "Providence" },
				]),
			},
		],
	},
];
const demoTopicRelations: Array<ConsoleTopicRelationship> = [
	{
		relationId: "1",
		sourceTopicId: "2",
		sourceFactorNames: ["quotationNo"],
		targetTopicId: "1",
		targetFactorNames: ["quoteNo"],
		type: ConsoleTopicRelationshipType.ONE_2_ONE,
		strictToTarget: true,
		strictToSource: false,
	},
	{
		relationId: "2",
		sourceTopicId: "2",
		sourceFactorNames: ["policyHolderId"],
		targetTopicId: "3",
		targetFactorNames: ["participantId"],
		type: ConsoleTopicRelationshipType.MANY_2_ONE,
		strictToTarget: true,
		strictToSource: false,
	},
	{
		relationId: "3",
		sourceTopicId: "1",
		sourceFactorNames: ["policyHolderId"],
		targetTopicId: "3",
		targetFactorNames: ["participantId"],
		type: ConsoleTopicRelationshipType.MANY_2_ONE,
		strictToTarget: true,
		strictToSource: false,
	},
];
export const fetchConnectedSpaces = async (): Promise<Array<ConnectedConsoleSpace>> => {
	if (isMockService()) {
		return [
			{
				spaceId: "1",
				connectId: "1",
				name: "Sales Statistics",
				type: ConsoleSpaceType.PUBLIC,
				lastVisitTime: "2020/10/31 14:23:07",
				topics: demoTopics,
				topicRelations: demoTopicRelations,
				groups: [],
				subjects: [],
			},
			{
				spaceId: "1",
				connectId: "2",
				name: "Sales Statistics in New York",
				type: ConsoleSpaceType.PRIVATE,
				lastVisitTime: "2020/11/05 15:14:11",
				topics: demoTopics,
				topicRelations: demoTopicRelations,
				subjects: [
					{
						subjectId: "1",
						name: "Premium Summary",
						topicCount: 3,
						graphicsCount: 2,
						lastVisitTime: "2020/11/12 20:20:01",
						createdAt: "2020/11/12 19:20:02",
						dataset: {
							columns: [
								{ topicId: "1", factorId: "102" },
								{ topicId: "1", factorId: "103" },
								{ topicId: "1", factorId: "106" },
								{ topicId: "2", factorId: "204" },
								{ topicId: "2", factorId: "205" },
								{ topicId: "2", factorId: "207" },
								{ topicId: "3", factorId: "304" },
								{ topicId: "3", factorId: "305" },
								{ topicId: "3", factorId: "306" },
								{ topicId: "3", factorId: "307" },
							],
						},
					},
					{
						subjectId: "2",
						name: "District Summary",
						topicCount: 2,
						graphicsCount: 1,
						lastVisitTime: "2020/11/02 20:25:01",
						createdAt: "2020/11/01 19:25:02",
					},
				],
				groups: [
					{
						groupId: "1",
						name: "All About Money",
						subjects: [
							{
								subjectId: "101",
								name: "Premium Summary",
								topicCount: 1,
								graphicsCount: 1,
								lastVisitTime: "2020/11/12 20:25:01",
								createdAt: "2020/11/12 19:25:02",
							},
						],
					},
					{
						groupId: "2",
						name: "All About Time",
						subjects: [
							{
								subjectId: "201",
								name: "Premium Summary",
								topicCount: 2,
								graphicsCount: 1,
								lastVisitTime: "2020/11/12 20:25:01",
								createdAt: "2020/11/12 19:25:02",
							},
						],
					},
					{
						groupId: "3",
						name: "All About Gender",
						subjects: [
							{
								subjectId: "301",
								name: "Premium Summary",
								topicCount: 2,
								graphicsCount: 1,
								lastVisitTime: "2020/8/31 20:25:01",
								createdAt: "2020/8/21 19:25:02",
							},
						],
					},
					{
						groupId: "4",
						name: "All About Age",
						subjects: [
							{
								subjectId: "401",
								name: "Premium Summary",
								topicCount: 2,
								graphicsCount: 1,
								lastVisitTime: "2019/11/12 20:25:01",
								createdAt: "2019/11/12 19:25:02",
							},
						],
					},
				],
			},
			{
				spaceId: "1",
				connectId: "3",
				name: "Sales Statistics in Maine",
				type: ConsoleSpaceType.PRIVATE,
				lastVisitTime: "2020/11/05 14:13:11",
				topics: demoTopics,
				topicRelations: demoTopicRelations,
				groups: [],
				subjects: [],
			},
			{
				spaceId: "1",
				connectId: "4",
				name: "Sales Statistics in New Hampshire",
				type: ConsoleSpaceType.PUBLIC,
				lastVisitTime: "2020/11/05 13:12:11",
				topics: demoTopics,
				topicRelations: demoTopicRelations,
				groups: [],
				subjects: [],
			},
			{
				spaceId: "1",
				connectId: "5",
				name: "Sales Statistics in Vermont",
				type: ConsoleSpaceType.PUBLIC,
				lastVisitTime: "2020/11/05 12:11:11",
				topics: demoTopics,
				topicRelations: demoTopicRelations,
				groups: [],
				subjects: [],
			},
			{
				spaceId: "1",
				connectId: "6",
				name: "Sales Statistics in Rhode Island",
				type: ConsoleSpaceType.PRIVATE,
				lastVisitTime: "2020/11/05 11:10:11",
				topics: demoTopics,
				topicRelations: demoTopicRelations,
				groups: [],
				subjects: [],
			},
			{
				spaceId: "1",
				connectId: "7",
				name: "Sales Statistics in Connecticut",
				type: ConsoleSpaceType.PRIVATE,
				lastVisitTime: "2020/11/05 10:09:11",
				topics: demoTopics,
				topicRelations: demoTopicRelations,
				groups: [],
				subjects: [],
			},
			{
				spaceId: "1",
				connectId: "8",
				name: "Sales Statistics in Massachusetts",
				type: ConsoleSpaceType.PUBLIC,
				lastVisitTime: "2020/11/05 09:08:11",
				topics: demoTopics,
				topicRelations: demoTopicRelations,
				groups: [],
				subjects: [],
			},
		];
	} else {
		const token = findToken();
		const response = await fetch(`${getServiceHost()}console_space/connected/me`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + token,
			},
		});

		return await response.json();
	}
};

export const fetchAvailableSpaces = async (): Promise<Array<ConsoleSpace>> => {
	if (isMockService()) {
		return [
			{
				spaceId: "1",
				name: "Sales Statistics",
				topics: demoTopics,
				topicRelations: demoTopicRelations,
			},
			{
				spaceId: "2",
				name: "Claim Trend",
				topics: demoTopics,
			},
		];

		// const account = Storage.findAccount();
	} else {
		// console.log(mock_flag);
		const token = findToken();
		const response = await fetch(`${getServiceHost()}space/available`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + token,
			},
		});

		return await response.json();
	}
};

// TODO demo purpose
let newConnectedSpaceId = 10000;
export const connectSpace = async (
	spaceId: string,
	name: string,
	type: ConsoleSpaceType
): Promise<ConnectedConsoleSpace> => {
	if (isMockService()) {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve({
					spaceId,
					connectId: `${newConnectedSpaceId++}`,
					name,
					type,
					lastVisitTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
					topics: demoTopics,
					topicRelations: demoTopicRelations,
					groups: [],
					subjects: [],
				});
			}, 1000);
		});

		// const account = Storage.findAccount();
	} else {
		// console.log(mock_flag);
		const token = findToken();
		const response = await fetch(`${getServiceHost()}space/connect?space_id=${spaceId}&name=${name}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + token,
			},
		});

		return await response.json();
	}
};

export const renameConnectedSpace = async (connectId: string, name: string): Promise<void> => {};

export const deleteConnectedSpace = async (space: ConnectedConsoleSpace): Promise<void> => {};

// TODO demo purpose
let newGroupId = 10000;
let newSubjectId = 10000;
export const createGroup = async (data: { space: ConnectedConsoleSpace; group: ConsoleSpaceGroup }): Promise<void> => {
	if (isMockService()) {
		data.group.groupId = `${newGroupId++}`;
	} else {
		const token = findToken();
		const response = await fetch(`${getServiceHost()}console_space/group?connect_id=${data.space.connectId}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + token,
			},
			body: JSON.stringify(data.group),
		});

		const result = await response.json();
		data.group.groupId = result.groupId;
	}
};
export const deleteGroup = async (group: ConsoleSpaceGroup): Promise<void> => {};
export const renameGroup = async (groupId: string, name: string): Promise<void> => {};

export const createSubject = async (data: {
	space: ConnectedConsoleSpace;
	group?: ConsoleSpaceGroup;
	subject: ConsoleSpaceSubject;
}): Promise<void> => {
	if (isMockService()) {
		data.subject.subjectId = `${newSubjectId++}`;
	} else {
		const token = findToken();
		const response = await fetch(
			`${getServiceHost()}console_space/subject?connect_id=${data.space.connectId}&group_id=${
				data.group?.groupId
			}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + token,
				},
				body: JSON.stringify(data.subject),
			}
		);

		const result = await response.json();
		console.log(result);
		data.subject.subjectId = result.subjectId;
	}
};
export const deleteSubject = async (subject: ConsoleSpaceSubject): Promise<void> => {};
export const saveSubject = async (subject: ConsoleSpaceSubject): Promise<void> => {
	if (isMockService()) {
		return new Promise((resolve) => {
			setTimeout(() => resolve(), 500);
		});
	} else {
		const token = findToken();
		const response = await fetch(`${getServiceHost()}console_space/subject/save`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + token,
			},
			body: JSON.stringify(subject),
		});

		const result = await response.json();
		console.log(result);
	}
};

export const fetchSubjectData = async (options: {
	subjectId: string;
	pageNumber?: number;
	pageSize?: number;
}): Promise<DataPage<Array<any>>> => {
	const { pageNumber = 1, pageSize = 100 } = options;
	if (isMockService()) {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve({
					itemCount: 223,
					pageNumber,
					pageSize,
					pageCount: 3,
					data: new Array(pageNumber === 3 ? 23 : 100).fill(1).map((row, rowIndex) => {
						const index = `${(pageNumber - 1) * pageSize + rowIndex + 1}`.padStart(5, "0");
						const quoteDate = dayjs()
							.subtract(1, "year")
							.subtract(Math.floor(Math.random() * 30), "day");
						const issueDate = quoteDate.add(Math.floor(Math.random() * 30), "day");
						return [
							`Q${index}`,
							quoteDate.format("YYYY/MM/DD"),
							true,
							`P${index}`,
							issueDate.format("YYYY/MM/DD"),
							10000,
							"John Doe",
							"1985/02/13",
							"M",
							"AU",
						];
					}),
				});
			}, 1000);
		});
	} else {
		const token = findToken();
		const response = await fetch(
			`${getServiceHost()}console_space/subject/dataset?subject_id=${options.subjectId}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + token,
				},
				body: JSON.stringify({ pageNumber: options.pageNumber, pageSize: options.pageSize }),
			}
		);

		const result = await response.json();
		return result;
	}
};

export const fetchCountChartData = async (
	subjectId: string,
	chartId: string
): Promise<ConsoleSpaceSubjectChartDataSet> => {
	return new Promise((resolve) => {
		setTimeout(
			() =>
				resolve({
					meta: [],
					data: [[1234]],
				} as ConsoleSpaceSubjectChartDataSet),
			500
		);
	});
};

export const fetchChartData = async (subjectId: string, chartId: string): Promise<ConsoleSpaceSubjectChartDataSet> => {
	if (isMockService()) {
		return new Promise((resolve) => {
			setTimeout(
				() =>
					resolve({
						meta: [],
						data: [],
					} as ConsoleSpaceSubjectChartDataSet),
				500
			);
		});
	} else {
		const token = findToken();
		const response = await fetch(
			`${getServiceHost()}console_space/dataset/chart?subject_id=${subjectId}&chart_id=${chartId}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + token,
				},
			}
		);

		const result = await response.json();
		return result;
	}
};
