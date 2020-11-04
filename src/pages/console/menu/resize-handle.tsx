import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const handleWidth = 6;
const Handle = styled.div<{ left: number }>`
	display: block;
	position: fixed;
	top: 0;
	left: ${({ left }) => `${left - handleWidth / 2}px`};
	width: ${handleWidth}px;
	height: 100vh;
	z-index: 5000;
	background-color: transparent;
	&[data-resizing=true] {
		&:hover {
			left: 0;
			width: 100vw;
			padding-left: ${({ left }) => `${left - handleWidth / 2}px`};
		}
	}
	&:before {
		content: '';
		display: block;
		position: relative;
		width: ${handleWidth}px;
		height: 100%;
		background-color: var(--primary-hover-color);
		opacity: 0;
		transition: opacity 300ms ease-in-out;
		pointer-events: none;
	}
	&:hover {
		&:before {
			pointer-events: auto;
			opacity: 0.3;
		}
	}
`;

export const ResizeHandle = (props: {
	width: number;
	onResize: (width: number) => void;
}) => {
	const { width, onResize } = props;

	const handleRef = useRef<HTMLDivElement>(null);
	const [ resizing, setResizing ] = useState(false);
	useEffect(() => {
		if (handleRef.current) {
			const canStartResize = (x: number) => Math.abs(x - width) <= 3;
			const onMouseDown = (event: MouseEvent) => {
				if (event.button === 0 && canStartResize(event.clientX)) {
					setResizing(true);
				}
			};
			const onMouseMove = (event: MouseEvent) => {
				if (!resizing) {
					if (canStartResize(event.clientX)) {
						handleRef.current!.style.cursor = 'col-resize';
					} else {
						handleRef.current!.style.cursor = 'default';
					}
				} else {
					onResize(event.clientX);
				}
			};
			const onMouseUp = () => {
				setResizing(false);
			};
			handleRef.current.addEventListener('mousedown', onMouseDown);
			handleRef.current.addEventListener('mousemove', onMouseMove);
			handleRef.current.addEventListener('mouseup', onMouseUp);

			return () => {
				if (handleRef.current) {
					handleRef.current.removeEventListener('mousedown', onMouseDown);
					handleRef.current.removeEventListener('mousemove', onMouseMove);
					handleRef.current.removeEventListener('mouseup', onMouseUp);
				}
			};
		}
	});

	return <Handle left={width} data-resizing={resizing} ref={handleRef}/>;
};