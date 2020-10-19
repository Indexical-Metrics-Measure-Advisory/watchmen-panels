import { GuideDataColumn } from './guide-context';

export const asDisplayName = (column: GuideDataColumn): string => {
	const name = column.name || '';
	if (name.indexOf('.') !== -1) {
		return name.split('.').reverse()[0];
	} else {
		return name || 'Noname';
	}
};
export const asDisplayType = (column: GuideDataColumn): string => {
	return column.type;
};

export const gatherAsColumnMap = (columns: Array<GuideDataColumn>, column: GuideDataColumn, key: 'name' | 'label'): { [key in string]: GuideDataColumn } => {
	return columns.filter(existsColumn => existsColumn !== column)
		.reduce((map, column) => {
			map[column[key]] = column;
			return map;
		}, {} as { [key in string]: GuideDataColumn });
};
export const generateUniqueKey = (
	originKey: string,
	exists: { [key in string]: GuideDataColumn },
	regexp: RegExp,
	replacement: (index: number) => string
): string => {
	let key = originKey;
	let index = 1;
	while (exists[key]) {
		key = (originKey).replace(regexp, replacement(index));
		index += 1;
	}
	return key;
};
export const generateUniqueName = (columns: Array<GuideDataColumn>, column: GuideDataColumn, originName: string): string => {
	return generateUniqueKey(originName, gatherAsColumnMap(columns, column, 'name'), /^(.*)(_{\d}+)*$/, (index) => `$1_${index}`);
};
export const generateUniqueLabel = (columns: Array<GuideDataColumn>, column: GuideDataColumn, originLabel: string): string => {
	return generateUniqueKey(originLabel, gatherAsColumnMap(columns, column, 'label'), /^(.*)(\s{\d}+)*$/, (index) => `$1 ${index}`);
};
