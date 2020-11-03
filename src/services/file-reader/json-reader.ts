import crypto from "crypto";
import { FileLike, ParsedFile } from './types';

export const readFromJson = async (file: FileLike): Promise<ParsedFile> => {
	if (!file.name.endsWith('.json')) {
		throw new Error('Not a JSON file.');
	}

	const text = await file.text();
	const hash = crypto.createHash('md5').update(text).digest('hex');
	const data = JSON.parse(text);
	if (Array.isArray(data)) {
		return { hash, data, filename: file.name };
	} else {
		return { hash, data: [ data ], filename: file.name };
	}
};