import dayjs from "dayjs";
import {ConsoleDashboard} from "./types";

export const fetchDashboards = async (): Promise<Array<ConsoleDashboard>> => {
	return [
		{
			dashboardId: "1",
			name: "Sales Statistics",
			lastVisitTime: "2020/10/20 09:36:46",
			graphics: []
		},
	];
};

let newDashboardId = 10000;

export const createDashboard = async (name: string): Promise<ConsoleDashboard> => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				dashboardId: `${newDashboardId++}`,
				name,
				lastVisitTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
				current: true,
				graphics: []
			});
		}, 1000);
	});
};

export const renameDashboard = async (dashboardId: string, name: string): Promise<void> => {
	return new Promise((resolve) => {
		setTimeout(() => resolve(), 500);
	});
};

export const deleteDashboard = async (dashboardId: string): Promise<void> => {
	return new Promise((resolve) => {
		setTimeout(() => resolve(), 500);
	});
};
