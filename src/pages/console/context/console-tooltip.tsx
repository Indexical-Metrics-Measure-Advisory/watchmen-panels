import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import styled from 'styled-components';

export enum TooltipAlignment {
	LEFT = 'left',
	RIGHT = 'right',
	CENTER = 'center'
}

export interface ComputedTooltipRect {
	align: TooltipAlignment;
	maxWidth?: number;
	offsetX?: number;
	offsetY?: number;
}

export interface TooltipRect extends ComputedTooltipRect {
	trigger: DOMRect;
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


const TooltipContainer = styled.div.attrs<{ rect?: TooltipRect }>(({ rect: { align, maxWidth, offsetY = 0, offsetX = 0, trigger } = {} }) => {
	const { y = 0, x = 0, width = 0 } = trigger || {};
	return {
		'data-widget': 'console-tooltip',
		style: {
			maxWidth: maxWidth || 200,
			bottom: `calc(100vh - ${y - offsetY}px)`,
			left: align === TooltipAlignment.LEFT ? (x - offsetX) : (align === TooltipAlignment.CENTER ? (x + width / 2) : 'unset'),
			right: align === TooltipAlignment.RIGHT ? `calc(100vw - ${x + width - offsetX}px)` : 'unset',
			transform: `scale(0.91666667) ${align === TooltipAlignment.CENTER ? 'translateX(-50%)' : ''}`,
			transformOrigin: align === TooltipAlignment.LEFT ? 'bottom left' : (align === TooltipAlignment.RIGHT ? 'bottom right' : 'bottom left')
		}
	};
}) <{ rect?: TooltipRect }>`
	display: flex;
	position: fixed;
	min-height: ${({ theme }) => theme.consoleTooltipMinHeight}px;
	min-width: 120px;
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
	transition: opacity 300ms ease-in-out;
	z-index: 10000;
	&[data-show=true] {
		opacity: 1;
	}
`;

const Caret = styled(FontAwesomeIcon).attrs<{ rect?: TooltipRect }>(({ rect: { align, trigger: { width = 0 } = {} } = {} }) => {
	return {
		style: {
			left: align === TooltipAlignment.LEFT ? 16 : (align === TooltipAlignment.CENTER ? 'calc(50% - 4px)' : 'unset'),
			right: align === TooltipAlignment.RIGHT ? 16 : 'unset'
		}
	};
})<{ rect?: TooltipRect }>`
	display: block;
	position: absolute;
	color: var(--console-tooltip-bg-color);
	font-size: 1.2em;
	top: calc(100% - 6px);
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
		                  rect={content?.rect}>
			{content?.tooltip}
			<Caret icon={faCaretDown} rect={content?.rect}/>
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
	rect: (rect: DOMRect) => ComputedTooltipRect
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

		const trigger = ref.current.getBoundingClientRect();
		tooltipContext.show(tooltip, { ...rect(trigger), trigger });
	};

	return {
		context: tooltipContext,
		mouseEnter: onMouseEnter,
		mouseLeave: tooltipContext.hide,
		show: (tooltip: string) => {
			const trigger = ref.current!.getBoundingClientRect();
			tooltipContext.show(tooltip, { ...rect(trigger), trigger });
		},
		hide: tooltipContext.hide
	};
};

