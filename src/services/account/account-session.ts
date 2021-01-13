const ACCOUNT_KEY_IN_SESSION = "IMMA-ACCOUNT";
const ACCOUNT_TOKEN = "IMMA-ACCOUNT-TOKEN";

export const saveAccount = (name: string, admin: boolean) => {
	sessionStorage.setItem(ACCOUNT_KEY_IN_SESSION, btoa(JSON.stringify({ name, admin })));
};

export const findAccount = (): { name: string; admin: boolean } | undefined => {
	const value = sessionStorage.getItem(ACCOUNT_KEY_IN_SESSION);
	if (value) {
		try {
			return JSON.parse(atob(value));
		} catch {
			return void 0;
		}
	}

	return (void 0);
};

export const isAdmin = (): boolean => {
	const account = findAccount();
	return !!account && account.admin;
};

export const findToken = (): string | null => {
	return sessionStorage.getItem(ACCOUNT_TOKEN);
};

export const setToken = (token: string) => {
	sessionStorage.setItem(ACCOUNT_TOKEN, token);
};
