import React, { useState } from 'react';
import styled from 'styled-components';
import { emptySetter } from '../../common/utils';

export interface DialogContext {
	hide: () => void;
	show: (content?: ((props: any) => React.ReactNode) | React.ReactNode, buttons?: ((props: any) => React.ReactNode) | React.ReactNode) => void;
}

const Context = React.createContext<DialogContext>({ hide: emptySetter, show: emptySetter });
Context.displayName = 'DialogContext';

interface DialogState {
	visible: boolean;
	content?: ((props: any) => React.ReactNode) | React.ReactNode;
	buttons?: ((props: any) => React.ReactNode) | React.ReactNode;
}

const DialogContainer = styled.div.attrs({
	'data-widget': 'dialog'
})`
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background-color: transparent;
	opacity: 0;
	pointer-events: none;
	transition: all 300ms ease-in-out;
	z-index: 99999;
	&[data-visible=true] {
		opacity: 1;
		pointer-events: auto;
	}
`;
const Dialog = styled.div`
	margin-top: 25vh;
	margin-left: calc(50vw - 250px);
	width: 500px;
	padding: var(--margin) var(--margin) calc(var(--margin) / 2) var(--margin);
	display: flex;
	flex-direction: column;
	background-color: var(--bg-color);
	border-radius: var(--border-radius);
	border: var(--border);
	box-shadow: var(--dialog-box-shadow);
`;
const DialogContent = styled.div`
	flex-grow: 1;
	min-height: 60px;
`;
const DialogButtons = styled.div`
	display: flex;
	> button:not(:last-child) {
		margin-right: calc(var(--margin) / 3);
	}
`;

export const DialogProvider = (props: { children?: ((props: any) => React.ReactNode) | React.ReactNode }) => {
	const { children } = props;

	const [ dialog, setDialog ] = useState<DialogState>({ visible: false });
	const context = {
		hide: () => {
			document.body.style.paddingRight = '';
			document.body.style.overflowY = '';
			setDialog({ visible: false, content: dialog.content });
		},
		show: (content?: ((props: any) => React.ReactNode) | React.ReactNode, buttons?: ((props: any) => React.ReactNode) | React.ReactNode) => {
			const padding = window.innerWidth - document.body.clientWidth;
			if (padding > 0) {
				document.body.style.paddingRight = `${padding}px`;
			}
			document.body.style.overflowY = 'hidden';
			setDialog({ visible: true, content, buttons });
		}
	};

	return <Context.Provider value={context}>
		{children}
		<DialogContainer data-visible={dialog.visible}>
			<Dialog>
				<DialogContent>
					{dialog.content}
				</DialogContent>
				<DialogButtons>
					{dialog.buttons}
				</DialogButtons>
			</Dialog>
		</DialogContainer>
	</Context.Provider>;
};

export const useDialog = () => {
	return React.useContext(Context);
};
