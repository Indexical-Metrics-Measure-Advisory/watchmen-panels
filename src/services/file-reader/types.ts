export interface FileLike {
	name: string;
	text: () => Promise<string>;
	// stream: Stream;
	// buffer: () => Promise<ArrayBuffer>;
}

export interface ParsedFile {
	hash: string;
	data: Array<any>;
	filename: string;
}
