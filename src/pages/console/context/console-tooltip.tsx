import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import styled from 'styled-components';

export interface TooltipRect {
	x: number;
	y: number;
	width?: number;
	height?: number;
	caretLeft?: number;
	center?: boolean;
}

export interface ConsoleTooltipContext {
	show: (tooltip: ((props: any) => React.ReactNode) | React.ReactNode, rect: TooltipRect) => void;
	hide: () => void;
}

interface TooltipContent {
	tooltip: ((props: any) => React.ReactNode) | React.ReactNode,
	rect: TooltipRect
}

const Context = React.createContext<ConsoleTooltipContext>({} as ConsoleTooltipContext);
Context.displayName = 'ConsoleTooltipContext';


const TooltipContainer = styled.div.attrs({
	'data-widget': 'console-tooltip'
})<{ x?: number; y?: number; width?: number; height?: number; caretLeft?: number; center?: boolean }>`
	display: flex;
	position: fixed;
	left: ${({ x }) => x != null ? `${x}px` : '-1000px'};
	top: ${({ y }) => y != null ? `${y}px` : '-1000px'};
	width: ${({ width }) => width != null ? `${width}px` : 'unset'};
	height: ${({ height }) => height != null ? `${height}px` : 'unset'};
	min-height: ${({ theme }) => theme.consoleTooltipMinHeight}px;
	align-items: center;
	font-size: 12px;
	font-weight: var(--font-bold);
	font-stretch: expanded;
	border-radius: var(--border-radius);
	padding: calc(var(--margin) / 6) calc(var(--margin) / 2);
	background-color: var(--console-tooltip-bg-color);
	color: var(--invert-color);
	opacity: 0;
	pointer-events: none;
	user-select: none;
	transform: scale(0.91666667) ${({ center }) => center ? 'translateX(-50%)' : ''};
	transform-origin: bottom left;
	transition: opacity 300ms ease-in-out;
	z-index: 10000;
	&[data-show=true] {
		opacity: 1;
	}
	> svg:last-child {
		display: block;
		position: absolute;
		color: var(--console-tooltip-bg-color);
		font-size: 1.2em;
		top: calc(100% - 6px);
		left: ${({ caretLeft, center }) => center ? 'calc(50% - 4px)' : `${(caretLeft || 16)}px`};
	}
`;

export const ConsoleTooltipContextProvider = (props: { children?: ((props: any) => React.ReactNode) | React.ReactNode }) => {
	const { children } = props;

	const [ content, setContent ] = useState<TooltipContent | null>(null);
	const [ functions ] = useState({
		show: (tooltip: ((props: any) => React.ReactNode) | React.ReactNode, rect: TooltipRect) => {
			setContent({ tooltip, rect });
		},
		hide: () => setContent(null)
	});

	return <Context.Provider value={functions}>
		{children}
		<TooltipContainer data-show={content != null}
		                  {...content?.rect}>
			{content?.tooltip}
			<FontAwesomeIcon icon={faCaretDown}/>
		</TooltipContainer>
	</Context.Provider>;
};

export const useTooltipContext = () => {
	return React.useContext(Context);
};

const notShow = () => {
};
export const useTooltip = <T extends HTMLElement>(options: {
	show: boolean,
	ref: React.RefObject<T>,
	tooltip?: string,
	rect: (rect: DOMRect) => TooltipRect
}) => {
	const { show, ref, tooltip, rect } = options;

	const tooltipContext = useTooltipContext();
	if (!show) {
		return {
			context: tooltipContext,
			mouseEnter: notShow,
			mouseLeave: notShow
		};
	}

	const onMouseEnter = () => {
		if (!ref.current || !tooltip) {
			return;
		}

		tooltipContext.show(tooltip, rect(ref.current.getBoundingClientRect()));
	};

	return {
		context: tooltipContext,
		mouseEnter: onMouseEnter,
		mouseLeave: tooltipContext.hide,
		show: (tooltip: string) => tooltipContext.show(tooltip, rect(ref.current!.getBoundingClientRect())),
		hide: tooltipContext.hide
	};
};

