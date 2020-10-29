import { Theme } from '../../../theme/types';

export const buildTitle = (options: { title?: string, theme: Theme }) => {
	const { title, theme } = options;

	if (!title) {
		return;
	}

	return {
		text: title,
		bottom: 32,
		left: '50%',
		textAlign: 'center',
		textStyle: {
			color: theme.fontColor,
			fontSize: theme.fontSize,
			lineHeight: theme.fontSize,
			fontWeight: theme.fontBold
		}
	};
};
