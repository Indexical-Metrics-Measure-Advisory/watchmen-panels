import React, { useState } from 'react';
import styled from 'styled-components';
import { emptySetter } from '../../common/utils';
import Button, { ButtonType } from '../component/button';

export interface AlertContext {
	show: (content?: ((props: any) => React.ReactNode) | React.ReactNode) => void;
}

const Context = React.createContext<AlertContext>({ show: emptySetter });
Context.displayName = 'AlertContext';

interface AlertState {
	visible: boolean;
	content?: ((props: any) => React.ReactNode) | React.ReactNode
}

const AlertContainer = styled.div.attrs({
	'data-widget': 'alert'
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
const Alert = styled.div`
	margin-top: 25vh;
	width: 400px;
	margin-left: calc(50% - 200px);
	padding: var(--margin) var(--margin) calc(var(--margin) / 2) var(--margin);
	display: flex;
	flex-direction: column;
	background-color: var(--bg-color);
	border-radius: var(--border-radius);
	border: var(--border);
	box-shadow: var(--dialog-box-shadow);
	@media (max-width: ${({ theme }) => theme.maxMobileWidth}px) {
		width: 75vw;
		margin-left: 12.5vw;
	}
`;
const AlertContent = styled.div`
	flex-grow: 1;
	min-height: 60px;
`;
const AlertButtons = styled.div`
	display: flex;
`;
const Placeholder = styled.div`
	flex-grow: 1;
`;

export const AlertProvider = (props: { children?: ((props: any) => React.ReactNode) | React.ReactNode }) => {
	const { children } = props;

	const [ alert, setAlert ] = useState<AlertState>({ visible: false });
	const context = {
		show: (content?: ((props: any) => React.ReactNode) | React.ReactNode) => {
			if (alert.visible) {
				return;
			}
			const padding = window.innerWidth - document.body.clientWidth;
			if (padding > 0) {
				document.body.style.paddingRight = `${padding}px`;
			}
			document.body.style.overflowY = 'hidden';
			setAlert({ visible: true, content });
		}
	};
	const hide = () => {
		document.body.style.paddingRight = '';
		document.body.style.overflowY = '';
		setAlert({ visible: false, content: alert.content });
	};

	return <Context.Provider value={context}>
		{children}
		<AlertContainer data-visible={alert.visible}>
			<Alert>
				<AlertContent>
					{alert.content}
				</AlertContent>
				<AlertButtons>
					<Placeholder/>
					<Button inkType={ButtonType.PRIMARY} onClick={hide}>Got It</Button>
				</AlertButtons>
			</Alert>
		</AlertContainer>
	</Context.Provider>;
};

export const useAlert = () => {
	return React.useContext(Context);
};
