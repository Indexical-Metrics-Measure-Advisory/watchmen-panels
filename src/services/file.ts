import { readFromCsv } from './file-reader/csv-reader';
import { readFromJson } from './file-reader/json-reader';
import { FileLike, ParsedFile } from './file-reader/types';

/**
 * Parse file context,<br>
 * Extension name must be '.json', otherwise, will be treated as csv file.<br>
 * <b>JSON Parse</b>
 * <ul>
 *  <li>Will wrap parsed data as array when it is not an array in json parsing,</li>
 *  <li>Will not detect type of parse data, except array detecting.</li>
 * </ul>
 * <b>CSV Parse</b>
 * <ul>
 *  <li>Splitted by comma,</li>
 *  <li>Use first line as column names,</li>
 *  <li>Will not detect empty column name,</li>
 *  <li>Duplicated column names will cause incorrect data parsing,</li>
 *  <li>Empty lines are ignored.</li>
 * </ul>
 * @param file
 */
export const parseFile = async (file: FileLike): Promise<ParsedFile> => {
	const files = await Promise.all([
		readFromCsv, readFromJson
	].map(async read => {
		try {
			return await read(file);
		} catch (e) {
			// console.error(e);
			return null;
		}
	}));
	const parsed = files.find(file => file != null);
	if (parsed) {
		return parsed;
	} else {
		throw new Error(`Given file[${file.name}] is not supported yet.`);
	}
};