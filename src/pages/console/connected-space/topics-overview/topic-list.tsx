import { faBook } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components';
import { ConnectedConsoleSpace } from '../../../../services/console/types';

const Container = styled.div`
	display: flex;
	flex-direction: column;
	width: 40px;
	border-left: var(--border);
	align-items: center;
	> svg {
		height: 40px;
		opacity: 0.7;
	}
	> div {
		position: relative;
		writing-mode: vertical-lr;
		padding: calc(var(--margin) / 2) 0;
		font-family: var(--console-title-font-family);
		transform: rotateZ(180deg);
		user-select: none;
		&:not(:last-child):after {
			content: '';
			display: block;
			position: absolute;
			top: 0;
			left: 10%;
			width: 80%;
			height: 1px;
			background-color: var(--border-color);
		}
		&:nth-child(2) > span:first-child {
			color: var(--console-primary-color);
		}
		&:last-child > span:first-child {
			color: var(--console-success-color);
		}
		> span:first-child {
			padding-bottom: calc(var(--margin) / 4);
			font-weight: var(--font-bold);
			font-size: 1.2em;
		}
		> span:last-child {
			opacity: 0.7;
		}
	}
`;

export const TopicList = (props: { space: ConnectedConsoleSpace }) => {
	const { space } = props;

	const { topics } = space;

	return <Container>
		<FontAwesomeIcon icon={faBook}/>
		<div><span>{topics.length}</span><span>Topics</span></div>
		<div><span>5</span><span>Reports</span></div>
	</Container>;
};