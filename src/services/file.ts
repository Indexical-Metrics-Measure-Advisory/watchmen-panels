import crypto from 'crypto';

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
export const parseFile = async (file: File): Promise<{ hash: string, data: Array<any> }> => {
	const isJSON = file.name.endsWith('.json');
	const text = await file.text();
	const hash = crypto.createHash('md5').update(text).digest('hex');
	if (isJSON) {
		const data = JSON.parse(text);
		if (Array.isArray(data)) {
			return { hash, data };
		} else {
			return { hash, data: [ data ] };
		}
	} else {
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
				}, { columns: [] as Array<string>, data: [] as Array<any> }).data
		};
	}
};