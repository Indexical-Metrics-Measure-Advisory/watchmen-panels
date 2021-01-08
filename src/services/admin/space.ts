import { getServiceHost, isMockService } from "../service_utils";
import {
	DataPage,
	QueriedSpace,
	QueriedSpaceForUserGroup,
	QueriedTopicForSpace,
	QueriedUserGroupForGroupsHolder,
	Space,
} from "./types";

export const listSpaces = async (options: {
	search: string;
	pageNumber?: number;
	pageSize?: number;
}): Promise<DataPage<QueriedSpace>> => {
	if (isMockService()) {
		// call api
		const { pageNumber = 1, pageSize = 9 } = options;

		return new Promise((resolve) => {
			setTimeout(() => {
				resolve({
					data: [
						{
							spaceId: "1",
							name: "Quotation & Policy",
							description: "All Sales Data",
							topicCount: 3,
							reportCount: 2,
							groupCount: 2,
							connectionCount: 8,
						},
					],
					itemCount: 0,
					pageNumber,
					pageSize,
					pageCount: 1,
				});
			}, 1000);
		});

		// const token: string = Storage.findToken();
		// const account = Storage.findAccount();
	} else {
		// console.log(mock_flag);
		const response = await fetch(`${getServiceHost()}space/name?query_name=${options.search}`, {
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

export const listSpacesForUserGroup = async (search: string): Promise<Array<QueriedSpaceForUserGroup>> => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(
				[{ spaceId: "1", name: "Quotation & Policy", description: "All Sales Data" }].filter((x) =>
					x.name.toUpperCase().includes(search.toUpperCase())
				)
			);
		}, 500);
	});
};

export const fetchSpace = async (
	spaceId: string
): Promise<{ space: Space; groups: Array<QueriedUserGroupForGroupsHolder>; topics: Array<QueriedTopicForSpace> }> => {
	console.log(spaceId);
	if (isMockService()) {
		// call api
		let space: Space;
		switch (spaceId) {
			case "1":
				space = {
					spaceId: "1",
					name: "Quotation & Policy",
					description: "All Sales Data",
					groupIds: ["1"],
				};
				break;
			default:
				space = {};
		}
		return {
			space,
			groups: [{ userGroupId: "1", name: "Oklahoma", description: "Northwest market analysis squad." }],
			topics: [
				{ topicId: "1", name: "Quotation" },
				{ topicId: "2", name: "Policy" },
				{ topicId: "3", name: "Participant" },
			],
		};

		// const token: string = Storage.findToken();
		// const account = Storage.findAccount();
	} else {
		// console.log(mock_flag);
		const response = await fetch(`${getServiceHost()}space?space_id=${spaceId}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				// authorization: token,
			},
		});
		// const result = await
		const space = await response.json();
		//TODO: load groups and topics

		return { space, groups: [], topics: [] };
	}
};

export const saveSpace = async (space: Space): Promise<void> => {
	console.log(isMockService());
	if (isMockService()) {
		// call api
		return new Promise((resolve) => {
			space.spaceId = "10000";
			setTimeout(() => resolve(), 500);
		});

		// const token: string = Storage.findToken();
		// const account = Storage.findAccount();
	} else {
		// console.log(mock_flag);
		const response = await fetch(`${getServiceHost()}space`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				// authorization: token,
			},
			body: JSON.stringify(space),
		});

		// const result = await
		return await response.json();
	}
};
