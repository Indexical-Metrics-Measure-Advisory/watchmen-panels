import { faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components';
import { LinkButton } from './link-button';

const TitleContainer = styled.div.attrs({
	'data-widget': 'console-narrow-page-title'
})`
	display: flex;
	align-items: baseline;
	> div:first-child {
		font-family: var(--console-title-font-family);
		font-size: 3em;
		letter-spacing: 1px;
	}
	> button {
		margin-left: calc(var(--margin) / 2);
		font-size: 1.4em;
		color: var(--console-primary-color);
	}
`;

export const NarrowPageTitle = (props: {
	title: string;
	onSettingsClicked?: () => void;
}) => {
	const { title, onSettingsClicked } = props;

	return <TitleContainer>
		<div>{title}</div>
		{onSettingsClicked
			? <LinkButton tooltip='Settings'
			              width={26}
			              center={true}
			              ignoreHorizontalPadding={true}
			              onClick={onSettingsClicked}>
				<FontAwesomeIcon icon={faCog}/>
			</LinkButton>
			: null}
	</TitleContainer>;
};
