import React from 'react';
import styled from 'styled-components';
import { v4 } from 'uuid';

const Label = styled.span`
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	flex-grow: 1;
	> span {
		color: var(--invert-color);
		background-color: var(--console-favorite-color);
		border-radius: var(--border-radius);
		padding: 0 1px;
	}
`;

export const PipelineNavigatorNodeLabel = (props: { name: string; filter: string }) => {
	const { name, filter } = props;

	const { length } = filter;
	if (length === 0) {
		return <Label>{name}</Label>;
	} else {
		const find = (text: string) => {
			const pos = text.toLowerCase().indexOf(filter);
			if (pos === -1) {
				return [ text, false, false ];
			} else {
				return [
					text.substr(0, pos),
					<span key={v4()}>{text.substr(pos, length)}</span>,
					text.substr(pos + length)
				];
			}
		};

		const content = [];
		let text = name;
		while (true) {
			const [ left, mid, right ] = find(text);
			left && content.push(left);
			if (mid === false) {
				// to end
				break;
			} else {
				content.push(mid);
				text = right as string;
			}
		}
		return <Label>{content}</Label>;
	}
};
