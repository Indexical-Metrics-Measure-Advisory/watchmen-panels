export interface Account {
	name?: string;
	credential?: string;
	role: string;
}

export interface LoginResponse {
	pass: boolean;
	admin: boolean;
	error?: string;
}
