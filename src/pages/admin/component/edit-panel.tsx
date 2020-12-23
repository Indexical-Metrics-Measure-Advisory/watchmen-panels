import { EventEmitter } from 'events';
import React, { useEffect, useState } from "react";
import styled from 'styled-components';

const EditContainer = styled.div`
	display: grid;
	grid-template-columns: 30% calc(70% - var(--margin));
	grid-column-gap: var(--margin);
	min-height: 300px;
	margin-top: -50px;
	margin-bottom: 50px;
	padding-bottom: 50px;
	opacity: 1;
	pointer-events: auto;
	z-index: 1;
	transition: all 300ms ease-in-out;
	position: absolute;
	top: 230px;
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
const Image = styled.div.attrs<{ background: string, position: string }>(({ background, position }) => {
	return { style: { backgroundImage: `url(${background})`, backgroundPosition: position } };
})<{ background: string, position: string }>`
	background-repeat: no-repeat;
	background-size: 80%;
	filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.7)) grayscale(0.9);
	transition: all 300ms ease-in-out;
`;

export enum EditPanelEvent {
	BACKGROUND_POSITION_CHANGED = 'background-position-changed',
}

export type BackgroundPositionChangeListener = (position: string) => void;

export interface EditPanelContext {
	changeBackgroundPosition: (position: string) => void;
	addBackgroundPositionChangeListener: (listener: BackgroundPositionChangeListener) => void;
	removeBackgroundPositionChangeListener: (listener: BackgroundPositionChangeListener) => void;
}

const Context = React.createContext<EditPanelContext>({} as EditPanelContext);
Context.displayName = 'EditPanelContext';

export const EditPanelContextProvider = (props: {
	children?: ((props: any) => React.ReactNode) | React.ReactNode;
}) => {
	const { children } = props;

	const [ emitter ] = useState<EventEmitter>(() => {
		const emitter = new EventEmitter();
		emitter.setMaxListeners(1000);
		return emitter;
	});

	return <Context.Provider value={{
		changeBackgroundPosition: (position: string) => emitter.emit(EditPanelEvent.BACKGROUND_POSITION_CHANGED, position),
		addBackgroundPositionChangeListener: (listener: BackgroundPositionChangeListener) => emitter.on(EditPanelEvent.BACKGROUND_POSITION_CHANGED, listener),
		removeBackgroundPositionChangeListener: (listener: BackgroundPositionChangeListener) => emitter.off(EditPanelEvent.BACKGROUND_POSITION_CHANGED, listener)
	}}>{children}</Context.Provider>;
};
export const useEditPanelContext = () => {
	return React.useContext(Context);
};

export const EditImage = (props: { background: string }) => {
	const { background } = props;

	const { addBackgroundPositionChangeListener, removeBackgroundPositionChangeListener } = useEditPanelContext();
	const [ backgroundPosition, setBackgroundPosition ] = useState('left');

	useEffect(() => {
		addBackgroundPositionChangeListener(setBackgroundPosition);
		return () => removeBackgroundPositionChangeListener(setBackgroundPosition);
	}, [ addBackgroundPositionChangeListener, removeBackgroundPositionChangeListener ]);

	return <Image background={background} position={backgroundPosition}/>;
};
export const EditArea = (props: {
	title: string;
	background: string;
	visible: boolean;
	children?: ((props: any) => React.ReactNode) | React.ReactNode;
}) => {
	const { title, background, visible, children } = props;

	return <EditContainer data-visible={visible}>
		<EditImage background={background}/>
		<Editor>
			<EditorTitle>{title}</EditorTitle>
			{children}
		</Editor>
	</EditContainer>;
};

export const EditPanel = (props: {
	title: string;
	background: string;
	visible: boolean;
	children?: ((props: any) => React.ReactNode) | React.ReactNode;
}) => {
	const { title, background, visible, children } = props;

	return <EditPanelContextProvider>
		<EditArea title={title} background={background} visible={visible}>
			{children}
		</EditArea>
	</EditPanelContextProvider>;
};