import crypto from "crypto";
import { FileLike, ParsedFile } from './types';

export const readFromCsv = async (file: FileLike): Promise<ParsedFile> => {
	if (!file.name.endsWith('.csv')) {
		throw new Error('Not a CSV file.');
	}

	const text = await file.text();
	const hash = crypto.createHash('md5').update(text).digest('hex');
	return {
		hash,
		data: text.split('\n')
			.map(line => (line || '').trim())
			.filter(line => line)
			.reduce((data, line, index) => {
				const values = line.split(',');
				if (index === 0) {
					data.columns = values.map(value => (value || '').trim());
				} else if (values.length !== 0) {
					data.data.push(values.reduce((row, value, index) => {
						row[data.columns[index]] = value;
						return row;
					}, {} as { [key in string]: any }));
				}
				return data;
			}, { columns: [] as Array<string>, data: [] as Array<any> }).data,
		filename: file.name
	};
};