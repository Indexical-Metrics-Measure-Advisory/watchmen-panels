// use gpu
import dayjs from 'dayjs';
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { SeeAll } from './see-all';

const ReadAnimation = keyframes`
	0% {
		filter: blur(0);
		opacity: 1;
		transform: translateZ(0) scaleY(100%);
		transform-origin: top;
	}
	99% {
		filter: blur(100px);
		margin-top: 0;
		opacity: 0;
		transform: translateZ(0) scaleY(0);
		transform-origin: top;
	}
	100% {
		display: none;
	}
`;

export const MessageItemContainer = styled.div.attrs({
	'data-widget': 'console-messages-item'
})`
	display: flex;
	position: relative;
	flex-direction: column;
	border-radius: calc(var(--border-radius));
	margin-top: var(--margin);
	box-shadow: var(--console-shadow);
	transition: all 300ms ease-in-out;
	&[data-read=true] {
		animation: ${ReadAnimation} 1s ease-in-out forwards;
	}
	&:hover {
		box-shadow: var(--console-hover-shadow);
		div[data-widget='console-messages-item-operators'] {
			opacity: 1;
			pointer-events: auto;
		}
	}
`;

export const MessageItemHeader = styled.div`
	border-bottom: var(--border);
	margin-bottom: -1px;
	z-index: 1;
	display: grid;
	grid-template-columns: 1fr auto auto;
	grid-column-gap: calc(var(--margin) / 2);
	align-items: center;
	padding: calc(var(--margin) / 3) calc(var(--margin) / 2) calc(var(--margin) / 4);
	background-color: var(--console-message-header-bg-color);
	overflow: hidden;
`;
export const MessageItemSender = styled.div`
	justify-self: center;
	align-self: center;
`;
export const MessageItemSubject = styled.div`
	font-size: 1.4em;
	line-height: 1.8em;
	font-weight: var(--font-bold);
	opacity: 0.9;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	cursor: pointer;
	&:hover {
		color: var(--console-primary-color);
	}
`;
export const MessageItemOperators = styled.div.attrs({
	'data-widget': 'console-messages-item-operators'
})`
	opacity: 0;
	pointer-events: none;
	transition: all 300ms ease-in-out;
`;
const MessageItemBody = styled.div`
	display: grid;
	grid-template-columns: 1fr auto;
	grid-column-gap: calc(var(--margin) / 2);
	padding: 20px calc(var(--margin) / 2);
`;
const MessageItemBodyContent = styled.div`
	display: flex;
	flex-direction: column;
	line-height: 20px;
	word-break: break-word;
`;
const MessageItemBodyImage = styled.div`
`;
const MessageItemCreateAt = styled.div`
	grid-row: span 2;
	font-size: 0.8em;
	opacity: 0.4;
	align-self: start;
	font-weight: var(--font-bold);
`;
export const ItemBody = (props: {
	body: string;
	createDate: string;
	image?: string;
	className?: string;
}) => {
	const { body, createDate, image, className, ...rest } = props;

	return <MessageItemBody className={className} {...rest}>
		<MessageItemBodyContent>
			{(body || '').split('\n').map((line, index) => <span key={index}>{line}</span>)}
		</MessageItemBodyContent>
		<MessageItemCreateAt>{dayjs(createDate).format('MMM D [at] H:mm')}</MessageItemCreateAt>
		<MessageItemBodyImage>{image}</MessageItemBodyImage>
	</MessageItemBody>;
};

const ItemListContainer = styled.div`
	display: flex;
	position: relative;
	flex-direction: column;
	flex-grow: 1;
`;

export const ItemList = (props: {
	data: Array<any>;
	allLoaded: boolean;
	visible: boolean;
	noData: string;
	children: ((props: any) => React.ReactNode) | React.ReactNode;
}) => {
	const { data, allLoaded, visible, noData, children } = props;

	if (!visible) {
		return null;
	}

	return <ItemListContainer>
		{children}
		<SeeAll data-visible={allLoaded}>
			{data.length === 0 ? noData : ' You\'ve seen it all.'}
		</SeeAll>
	</ItemListContainer>;
};