import { getServiceHost, isMockService } from "../service_utils";
import {
	DataPage,
	QueriedSpaceForUserGroup,
	QueriedUser,
	QueriedUserForUserGroup,
	QueriedUserGroup,
	QueriedUserGroupForGroupsHolder,
	User,
	UserGroup,
} from "./types";

export const listUserGroups = async (options: {
	search: string;
	pageNumber?: number;
	pageSize?: number;
}): Promise<DataPage<QueriedUserGroup>> => {
	if (isMockService()) {
		// call api
		const { pageNumber = 1, pageSize = 9 } = options;

		return new Promise((resolve) => {
			setTimeout(() => {
				resolve({
					data: [
						{
							userGroupId: "1",
							name: "Oklahoma",
							description: "South-center market analysis squad.",
							userCount: 4,
							spaceCount: 2,
							topicCount: 3,
							reportCount: 21,
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
		const response = await fetch(`${getServiceHost()}user_group/name?query_name=${options.search}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				// authorization: token,
			},
			body: JSON.stringify({ pageNumber: options.pageNumber, pageSize: options.pageSize }),
		});

		return await response.json();
	}
};

export const listUsers = async (options: {
	search: string;
	pageNumber?: number;
	pageSize?: number;
}): Promise<DataPage<QueriedUser>> => {
	if (isMockService()) {
		// call api
		const { pageNumber = 1, pageSize = 9 } = options;

		return new Promise((resolve) => {
			setTimeout(() => {
				resolve({
					data: [
						{
							userId: "1",
							name: "Damon Lindelof",
							spaceCount: 2,
							topicCount: 3,
							reportCount: 7,
						},
						{
							userId: "2",
							name: "Sally Jupiter",
							spaceCount: 2,
							topicCount: 3,
							reportCount: 2,
						},
						{
							userId: "3",
							name: "Roy Raymond",
							spaceCount: 2,
							topicCount: 3,
							reportCount: 4,
						},
						{
							userId: "4",
							name: "Walter Kovacs",
							spaceCount: 2,
							topicCount: 3,
							reportCount: 8,
						},
						{
							userId: "5",
							name: "Jeffrey Dean Morgan",
							spaceCount: 2,
							topicCount: 3,
							reportCount: 0,
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
		const response = await fetch(`${getServiceHost()}user/name?query_name=${options.search}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				// authorization: token,
			},
			body: JSON.stringify({ pageNumber: options.pageNumber, pageSize: options.pageSize }),
		});

		return await response.json();
	}
};

export const listUserGroupsForUser = async (search: string): Promise<Array<QueriedUserGroupForGroupsHolder>> => {
	if (isMockService()) {
		// call api
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve(
					[
						{ userGroupId: "1", name: "Oklahoma", description: "South-center market analysis squad." },
						{ userGroupId: "2", name: "Delaware" },
						{ userGroupId: "3", name: "Hawaii" },
						{ userGroupId: "4", name: "Alaska" },
						{ userGroupId: "5", name: "Missouri" },
						{ userGroupId: "6", name: "Arkansas" },
					].filter((x) => x.name.toUpperCase().includes(search.toUpperCase()))
				);
			}, 500);
		});

		// const token: string = Storage.findToken();
		// const account = Storage.findAccount();
	} else {
		// console.log(mock_flag);
		const response = await fetch(`${getServiceHost()}query/user_group/space?query_name=${search}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				// authorization: token,
			},
		});

		// const result = await
		return await response.json();
	}
};

export const fetchUser = async (
	userId: string
): Promise<{ user: User; groups: Array<QueriedUserGroupForGroupsHolder> }> => {
	console.log(isMockService());
	if (isMockService()) {
		// call api
		let user;
		switch (userId) {
			case "1":
				user = { userId: "1", name: "Damon Lindelof", groupIds: ["1"] };
				break;
			case "2":
				user = { userId: "2", name: "Sally Jupiter", groupIds: ["1"] };
				break;
			case "3":
				user = { userId: "3", name: "Roy Raymond", groupIds: ["1"] };
				break;
			case "4":
				user = { userId: "4", name: "Walter Kovacs", groupIds: ["1"] };
				break;
			case "5":
				user = { userId: "5", name: "Jeffrey Dean Morgan", groupIds: ["1"] };
				break;
			default:
				user = {};
		}
		return {
			user,
			groups: [{ userGroupId: "1", name: "Oklahoma", description: "Northwest market analysis squad." }],
		};

		// const token: string = Storage.findToken();
		// const account = Storage.findAccount();
	} else {
		const response = await fetch(`${getServiceHost()}user?user_id=${userId}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				// authorization: token,
			},
		});

		let user = await response.json();

		const groupIds = user["groupIds"];
		if (groupIds) {
			const result = await fetch(`${getServiceHost()}user_groups/ids`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					// authorization: token,
				},
				body: JSON.stringify(groupIds),
			});
			const group_list = await result.json();
			return { user, groups: group_list };
		} else {
			return { user, groups: [] };
		}
	}
};

export const saveUser = async (user: User): Promise<void> => {
	console.log(isMockService());
	if (isMockService()) {
		// call api
		return new Promise((resolve) => {
			user.userId = "10000";
			setTimeout(() => resolve(), 500);
		});

		// const token: string = Storage.findToken();
		// const account = Storage.findAccount();
	} else {
		const response = await fetch(`${getServiceHost()}user`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				// authorization: token,
			},
			body: JSON.stringify(user),
		});

		return await response.json();
	}
};

export const fetchUserGroup = async (
	userGroupId: string
): Promise<{ group: UserGroup; users: Array<QueriedUserForUserGroup>; spaces: Array<QueriedSpaceForUserGroup> }> => {
	console.log(isMockService());
	if (isMockService()) {
		// call api
		let group: UserGroup;
		switch (userGroupId) {
			case "1":
				group = {
					userGroupId: "1",
					name: "Oklahoma",
					description: "South-center market analysis squad.",
					userIds: ["1", "2", "3", "4", "5"],
					spaceIds: ["1"],
				};
				break;
			case "2":
				group = { userGroupId: "2", name: "Delaware", userIds: [], spaceIds: [] };
				break;
			case "3":
				group = { userGroupId: "3", name: "Hawaii", userIds: [], spaceIds: [] };
				break;
			case "4":
				group = { userGroupId: "4", name: "Alaska", userIds: [], spaceIds: [] };
				break;
			case "5":
				group = { userGroupId: "5", name: "Missouri", userIds: [], spaceIds: [] };
				break;
			case "6":
				group = { userGroupId: "6", name: "Arkansas", userIds: [], spaceIds: [] };
				break;
			default:
				group = {};
		}
		return {
			group,
			users: [
				{ userId: "1", name: "Damon Lindelof" },
				{ userId: "2", name: "Sally Jupiter" },
				{ userId: "3", name: "Roy Raymond" },
				{ userId: "4", name: "Walter Kovacs" },
				{ userId: "5", name: "Jeffrey Dean Morgan" },
			],
			spaces: [{ spaceId: "1", name: "Quotation & Policy", description: "All Sales Data" }],
		};

		// const token: string = Storage.findToken();
		// const account = Storage.findAccount();
	} else {
		const response = await fetch(`${getServiceHost()}user_group?user_group_id=${userGroupId}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				// authorization: token,
			},
		});

		let group = await response.json();

		const user_response = await fetch(`${getServiceHost()}user/ids`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				// authorization: token,
			},
			body: JSON.stringify(group["userIds"]),
		});

		const user_list = await user_response.json();

		const space_response = await fetch(`${getServiceHost()}space/ids`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				// authorization: token,
			},
			body: JSON.stringify(group["spaceIds"]),
		});

		const space_list = await space_response.json();

		return { group, users: user_list, spaces: space_list };
	}
};

export const saveUserGroup = async (group: UserGroup): Promise<void> => {
	console.log(isMockService());
	if (isMockService()) {
		// call api
		return new Promise((resolve) => {
			group.userGroupId = "10000";
			setTimeout(() => resolve(), 500);
		});

		// const token: string = Storage.findToken();
		// const account = Storage.findAccount();
	} else {
		// console.log(mock_flag);
		const response = await fetch(`${getServiceHost()}user_group`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				// authorization: token,
			},
			body: JSON.stringify(group),
		});

		// const result = await
		return await response.json();
	}
};

export const listUsersForUserGroup = async (search: string): Promise<Array<QueriedUserForUserGroup>> => {
	if (isMockService()) {
		// call api
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve(
					[
						{ userId: "1", name: "Damon Lindelof" },
						{ userId: "2", name: "Sally Jupiter" },
						{ userId: "3", name: "Roy Raymond" },
						{ userId: "4", name: "Walter Kovacs" },
						{ userId: "5", name: "Jeffrey Dean Morgan" },
					].filter((x) => x.name.toUpperCase().includes(search.toUpperCase()))
				);
			}, 500);
		});

		// const token: string = Storage.findToken();
		// const account = Storage.findAccount();
	} else {
		// console.log(mock_flag);
		const response = await fetch(`${getServiceHost()}query/user/group?query_name=${search}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				// authorization: token,
			},
		});

		// const result = await
		return await response.json();
	}
};

export const listUserGroupsForSpace = async (search: string): Promise<Array<QueriedUserGroupForGroupsHolder>> => {
	if (isMockService()) {
		// call api
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve(
					[
						{ userGroupId: "1", name: "Oklahoma", description: "South-center market analysis squad." },
						{ userGroupId: "2", name: "Delaware" },
						{ userGroupId: "3", name: "Hawaii" },
						{ userGroupId: "4", name: "Alaska" },
						{ userGroupId: "5", name: "Missouri" },
						{ userGroupId: "6", name: "Arkansas" },
					].filter((x) => x.name.toUpperCase().includes(search.toUpperCase()))
				);
			}, 500);
		});

		// const token: string = Storage.findToken();
		// const account = Storage.findAccount();
	} else {
		// console.log(mock_flag);
		const response = await fetch(`${getServiceHost()}query/user_group/space?query_name=${search}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				// authorization: token,
			},
		});

		// const result = await
		return await response.json();
	}
};
