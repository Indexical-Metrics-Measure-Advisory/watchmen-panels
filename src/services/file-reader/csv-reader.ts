import crypto from "crypto";
import parse from 'csv-parse';
import { FileLike, ParsedFile } from './types';

export const readFromCsv = async (file: FileLike): Promise<ParsedFile> => {
	if (!file.name.endsWith('.csv')) {
		throw new Error('Not a CSV file.');
	}

	const text = await file.text();
	const hash = crypto.createHash('md5').update(text).digest('hex');
	return new Promise((resolve, reject) => {
		parse(text, (err, output) => {
			if (err) {
				reject(err);
				return;
			}

			resolve({
				hash,
				filename: file.name,
				data: output.reduce((data: { columns: Array<string>, data: Array<any> }, values: Array<any>, rowIndex: number) => {
					if (rowIndex === 0) {
						data.columns = values.map(value => (value || '').trim());
					} else if (values.length !== 0) {
						data.data.push(values.reduce((row, value, valueIndex) => {
							row[data.columns[valueIndex]] = value;
							return row;
						}, {} as { [key in string]: any }));
					}
					return data;
				}, { columns: [] as Array<string>, data: [] as Array<any> }).data
			});
		});
	});
};