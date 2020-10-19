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
