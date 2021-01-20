import dayjs from "dayjs";
import { findToken } from "../account/account-session";
import { getServiceHost, isMockService } from "../service_utils";
import { ConsoleDashboard } from "./types";

export const fetchDashboards = async (): Promise<Array<ConsoleDashboard>> => {
	if (isMockService()) {
		return [
			{
				dashboardId: "1",
				name: "Sales Statistics",
				lastVisitTime: "2020/10/20 09:36:46",
				graphics: [],
			},
		];
	} else {
		const token = findToken();
		const response = await fetch(`${getServiceHost()}dashboard/me`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + token,
			},
			// body: JSON.stringify(subject),
		});

		const result = await response.json();
		return result;
	}
};

let newDashboardId = 10000;

export const createDashboard = async (name: string): Promise<ConsoleDashboard> => {
	if (isMockService()) {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve({
					dashboardId: `${newDashboardId++}`,
					name,
					lastVisitTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
					current: true,
					graphics: [],
				});
			}, 1000);
		});
	} else {
		const token = findToken();
		const response = await fetch(`${getServiceHost()}dashboard/create?name=${name}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + token,
			},
			// body: JSON.stringify(subject),
		});

		const result = await response.json();
		return result;
	}
};

export const saveDashboard = async (dashboard: ConsoleDashboard): Promise<void> => {
	if (isMockService()) {
		return new Promise((resolve) => {
			setTimeout(() => resolve(), 500);
		});
	} else {
		const token = findToken();
		const response = await fetch(`${getServiceHost()}dashboard/save`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + token,
			},
			body: JSON.stringify(dashboard),
		});

		const result = await response.json();
		return result;
	}
};

export const renameDashboard = async (dashboardId: string, name: string): Promise<void> => {
	if (isMockService()) {
		return new Promise((resolve) => {
			setTimeout(() => resolve(), 500);
		});
	} else {
		const token = findToken();
		await fetch(`${getServiceHost()}dashboard/rename?dashboard_id=${dashboardId}&name=${name}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + token,
			},
		});

		// const result = await response.json();
		// return result;
	}
};

export const deleteDashboard = async (dashboardId: string): Promise<void> => {
	if (isMockService()) {
		return new Promise((resolve) => {
			setTimeout(() => resolve(), 500);
		});
	} else {
		const token = findToken();
		await fetch(`${getServiceHost()}dashboard/delete?dashboard_id=${dashboardId}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + token,
			},
		});

		// const result = await response.json();
		// return result;
	}
};
