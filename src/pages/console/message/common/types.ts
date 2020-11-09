export enum ActiveTab {
	READ = 'read',
	UNREAD = 'unread'
}

export interface State {
	active: ActiveTab;
	readInitialized: boolean;
	unreadInitialized: boolean;
}
