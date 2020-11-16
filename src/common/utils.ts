export const emptySetter = () => void 0;
export const emptyGetter = emptySetter;

/**
 * convert given size to human readable string.<br>
 * <ul>
 *  <li>use unit byte when [,1024);</li>
 *  <li>use unit kb when [1024, 1024\*1204), 1 fraction digit kept;</li>
 *  <li>use unit mb when [1024\*1024, ], 2 fraction digits kept.</li>
 * <ul>
 * @param size
 */
export const toReadableFileSize = (size: number): string => {
	if (size < 1024) {
		return `${new Intl.NumberFormat().format(size)}b`;
	}

	size = size / 1024;
	if (size < 1024) {
		return `${new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(size)}kb`;
	}

	return `${new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(size / 1024)}mb`;
};

export const notInMe = (me: HTMLOrSVGElement, target: EventTarget | null): boolean => {
	const body = document.body;
	if (target === window) {
		return true;
	}
	let parent: HTMLElement | null | undefined = target as HTMLElement;
	while (true) {
		if (parent === me) {
			return false;
		}
		if (parent === body || parent == null) {
			return true;
		}
		parent = parent?.parentElement;
	}
};