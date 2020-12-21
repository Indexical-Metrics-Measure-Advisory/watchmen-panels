import React from "react";
import styled from 'styled-components';

const EditContainer = styled.div`
	display: grid;
	grid-template-columns: 30% calc(70% - var(--margin));
	grid-column-gap: var(--margin);
	min-height: 300px;
	margin-top: -50px;
	margin-bottom: 50px;
	opacity: 1;
	pointer-events: auto;
	z-index: 1;
	transition: all 300ms ease-in-out;
	position: absolute;
	top: 200px;
	width: 100%;
	&[data-visible=false] {
		opacity: 0;
		pointer-events: none;
	}
`;
const Editor = styled.div`
	display: grid;
	grid-template-columns: 150px 1fr;
	grid-column-gap: var(--margin);
	grid-auto-rows: minmax(40px, auto);
	grid-row-gap: calc(var(--margin) / 4);
	align-items: center;
`;
const EditorTitle = styled.div`
	display: flex;
	align-items: center;
	grid-column: span 2;
	font-variant: petite-caps;
	font-weight: var(--font-demi-bold);
	font-size: 1.4em;
	border-bottom: var(--border);
	height: 44px;
	margin-bottom: calc(var(--margin) / 2);
`;
const Image = styled.div.attrs<{ background: string }>(({ background }) => {
	return { style: { backgroundImage: `url(${background})` } };
})<{ background: string }>`
	background-position: left;
	background-repeat: no-repeat;
	background-size: 80%;
	filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.7)) grayscale(0.9);
`;

export const EditPanel = (props: {
	title: string;
	background: string;
	visible: boolean;
	children?: ((props: any) => React.ReactNode) | React.ReactNode;
}) => {
	const { title, background, visible, children } = props;

	return <EditContainer data-visible={visible}>
		<Image background={background}/>
		<Editor>
			<EditorTitle>{title}</EditorTitle>
			{children}
		</Editor>
	</EditContainer>;
};