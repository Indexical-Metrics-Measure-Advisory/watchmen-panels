import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components';
import { LinkButton } from '../component/link-button';

export interface HeaderButton {
	icon: IconProp;
	label: string;
	onClick: () => void;
}

const Operators = styled.div`
	display: flex;
	flex-grow: 1;
	align-items: center;
	justify-content: flex-end;
	padding-left: calc(var(--margin) / 2);
	> button {
		font-size: 1.1em;
		margin-left: calc(var(--margin) / 5);
		padding: calc(var(--margin) / 5);
		> svg {
			opacity: 0.6;
		}
	}
`;

export const HeaderButtons = (props: {
	buttons: Array<HeaderButton>
}) => {
	const { buttons } = props;

	return <Operators>
		{buttons.map(button => {
			return <LinkButton ignoreHorizontalPadding={true} key={button.label}
			                   onClick={button.onClick}>
				<FontAwesomeIcon icon={button.icon}/>
			</LinkButton>;
		})}
	</Operators>;
};