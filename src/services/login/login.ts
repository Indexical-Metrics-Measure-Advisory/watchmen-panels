import { Account, LoginResponse } from './types';

export const login = async (account: Account): Promise<LoginResponse> => {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve({
				pass: [ 'imma-admin', 'imma-user' ].includes(account.name || ''),
				admin: account.name === 'imma-admin',
				error: [ 'imma-admin', 'imma-user' ].includes(account.name || '') ? (void 0) : 'Name or credential cannot be identified now.'
			});
		}, 10000);
	});
};