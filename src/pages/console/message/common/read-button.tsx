import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef } from 'react';
import styled from 'styled-components';
import { TooltipAlignment, useTooltip } from '../../../component/console/context/console-tooltip';
import { createLinkButtonBackgroundAnimation } from '../../component/link-button';

const Read = styled.div`
	display: flex;
	position: relative;
	align-items: center;
	justify-content: center;
	width: 24px;
	height: 24px;
	color: var(--console-primary-color);
	border-radius: var(--border-radius);
	cursor: pointer;
	transition: all 300ms ease-in-out;
	${createLinkButtonBackgroundAnimation({ opacity: 0.4 })}
`;

export const ReadButton = (props: {
	readable: boolean;
	onRead: () => void;
	readOne: () => void;
	tooltip: string;
}) => {
	const { readable, onRead, readOne, tooltip } = props;

	const readRef = useRef<HTMLDivElement>(null);
	const { mouseEnter, mouseLeave } = useTooltip({
		show: true,
		tooltip,
		rect: () => ({ align: TooltipAlignment.CENTER, offsetY: 10 }),
		ref: readRef
	});
	const onReadClicked = async () => {
		onRead();
		setTimeout(() => readOne(), 1000);
	};

	if (!readable) {
		return null;
	}

	return <Read ref={readRef}
	             onMouseEnter={mouseEnter} onMouseLeave={mouseLeave}
	             onClick={onReadClicked}>
		<FontAwesomeIcon icon={faCheck}/>
	</Read>;
};