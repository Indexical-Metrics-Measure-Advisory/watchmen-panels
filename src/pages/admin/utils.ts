import { DataPage } from '../../services/admin/types';

export const createBlankDataPage = <T>(pageSize: number = 9): DataPage<T> => {
	return {
		pageNumber: 1,
		pageSize,
		pageCount: 1,
		itemCount: 0,
		data: []
	};
};