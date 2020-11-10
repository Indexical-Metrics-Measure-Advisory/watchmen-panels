import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import styled from 'styled-components';

const HomeSectionContainer = styled.div.attrs({
	'data-widget': 'console-home-section'
})<{ itemCount: number }>`
	display: flex;
	flex-direction: column;
	margin-top: var(--margin);
	transition: all 300ms ease-in-out;
	&:not(:nth-child(2)) {
		margin-top: calc(var(--margin) / 2);
	}
	&:last-child {
		margin-bottom: var(--margin);
	}
	&[data-visible=false] {
		> div[data-widget='console-home-section-header'] {
			> div[data-widget='console-home-section-title'] {
				> svg:first-child {
					opacity: 1;
					transform: translateY(-50%) rotateZ(-90deg);
				}
			}
			> div[data-widget='console-home-section-header-operators'] {
				opacity: 0;
				pointer-events: none;
			}
		}
		> div[data-widget='console-home-section-body'] {
			padding-top: 0;
			padding-bottom: 0;
			height: 0;
		}
	}
	> div[data-widget='console-home-section-body'] {
		height: calc(var(--margin) / 3 * (2 + ${({ itemCount }) => Math.ceil(itemCount / 3) - 1}) + ${({ itemCount }) => Math.ceil(itemCount / 3) * 64}px);
		> div {
			height: 64px;
		}
	}
`;
const HomeSectionHeader = styled.div.attrs({
	'data-widget': 'console-home-section-header'
})`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;
const HomeSectionTitle = styled.div.attrs({
	'data-widget': 'console-home-section-title'
})`
	display: flex;
	position: relative;
	align-items: center;
	height: 3em;
	margin-left: calc(var(--margin) / 3 * -1);
	padding-left: calc(var(--margin) / 3);
	padding-right: var(--margin);
	font-family: var(--console-title-font-family);
	font-size: 1.2em;
	font-weight: var(--font-demi-bold);
	cursor: pointer;
	&:hover {
		> svg, > div:last-child {
			color: var(--console-primary-color);
		}
		> svg:first-child {
			pointer-events: auto;
			opacity: 1;
		}
	}
	> svg:nth-child(2) {
		margin-right: calc(var(--margin) / 3);
	}
	> svg:first-child {
		display: block;
		position: absolute;
		right: 100%;
		top: 50%;
		transform: translateY(-50%);
		opacity: 0;
		user-select: none;
		transition: all 300ms ease-in-out;
	}
`;
const HomeSectionBody = styled.div.attrs({
	'data-widget': 'console-home-section-body'
})`
	display: grid;
	position: relative;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	grid-gap: calc(var(--margin) / 3);
	background-color: var(--console-home-section-body-bg-color);
	overflow: hidden;
	padding: calc(var(--margin) / 3);
	border-radius: calc(var(--margin) / 2);
	transition: all 300ms ease-in-out;
`;

export const HomeSection = (props: {
	title: string;
	titleIcon: IconProp;
	itemCount: number;
	titleOperators?: ((props: any) => React.ReactNode) | React.ReactNode;
	children: ((props: any) => React.ReactNode) | React.ReactNode;
}) => {
	const { title, titleIcon, itemCount, titleOperators, children } = props;

	const [ collapsed, setCollapsed ] = useState(false);

	const toggleCollapsed = () => setCollapsed(!collapsed);

	return <HomeSectionContainer data-visible={!collapsed} itemCount={itemCount}>
		<HomeSectionHeader>
			<HomeSectionTitle onClick={toggleCollapsed}>
				<FontAwesomeIcon icon={faCaretDown}/>
				<FontAwesomeIcon icon={titleIcon}/>
				<div>{title}</div>
			</HomeSectionTitle>
			{titleOperators}
		</HomeSectionHeader>
		<HomeSectionBody>
			{children}
		</HomeSectionBody>
	</HomeSectionContainer>;
};