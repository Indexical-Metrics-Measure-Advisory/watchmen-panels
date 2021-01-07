const ACCOUNT_KEY_IN_SESSION = 'IMMA-ACCOUNT';

export const saveAccount = (name: string, admin: boolean) => {
	sessionStorage.setItem(ACCOUNT_KEY_IN_SESSION, btoa(JSON.stringify({ name, admin })));
};

export const findAccount = (): { name: string, admin: boolean } | undefined => {
	const value = sessionStorage.getItem(ACCOUNT_KEY_IN_SESSION);
	if (value) {
		try {
			return JSON.parse(atob(value));
		} catch {
			return (void 0);
		}
	}

	return (void 0);
};