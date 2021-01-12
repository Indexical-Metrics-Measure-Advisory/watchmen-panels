import { getServiceHost, isMockService } from "../service_utils";
import { Account, LoginResponse } from "./types";

const ADMIN = "imma-admin";
const USER = "imma-user";

export const login = async (account: Account): Promise<LoginResponse> => {
	if (isMockService()) {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve({
					pass: [ADMIN, USER].includes(account.name || ""),
					admin: account.name === ADMIN,
					error: [ADMIN, USER].includes(account.name || "")
						? void 0
						: "Name or credential cannot be identified now.",
				});
			}, 1000);
		});
	} else {
		const response = await fetch(`${getServiceHost()}login/access-token`, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				// authorization: token,
			},
			body: new URLSearchParams({
				username: account.name || "",
				password: account.credential || "",
				grant_type: "password",
			}),
		});

		const result = await response.json();

		return { pass: true, admin: account.name === ADMIN };
	}
};
