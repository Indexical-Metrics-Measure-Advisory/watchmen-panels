export const toReadableFileSize = (size: number) => {
	if (size < 1024) {
		return `${new Intl.NumberFormat().format(size)}b`;
	}

	size = size / 1024;
	if (size < 1024) {
		return `${new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(size)}kb`;
	}

	return `${new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(size / 1024)}mb`;
};