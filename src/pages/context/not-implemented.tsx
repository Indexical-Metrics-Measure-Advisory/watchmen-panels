import React, { useState } from 'react';
import styled from 'styled-components';
import Button, { ButtonType } from '../component/button';

export interface NotImplemented {
	show: () => void;
}

const Context = React.createContext<NotImplemented>({
	show: () => {
	}
});
Context.displayName = 'NotImplementedContext';

const DialogContainer = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background-color: transparent;
	opacity: 0;
	pointer-events: none;
	user-select: none;
	transition: all 300ms ease-in-out;
	z-index: -1;
	&[data-visible=true] {
		opacity: 1;
		pointer-events: auto;
		z-index: 99999;
	}
`;
const Dialog = styled.div`
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
const DialogContent = styled.div`
	flex-grow: 1;
	min-height: 60px;
`;
const DialogButtons = styled.div`
	display: flex;
`;
const Placeholder = styled.div`
	flex-grow: 1;
`;

export const NotImplementedProvider = (props: { children?: ((props: any) => React.ReactNode) | React.ReactNode }) => {
	const { children } = props;

	const [ visible, setVisible ] = useState(false);
	const context = {
		show: () => {
			if (visible) {
				return;
			}
			const padding = window.innerWidth - document.body.clientWidth;
			if (padding > 0) {
				document.body.style.paddingRight = `${padding}px`;
			}
			document.body.style.overflowY = 'hidden';
			setVisible(true);
		}
	};
	const hide = () => {
		document.body.style.paddingRight = '';
		document.body.style.overflowY = '';
		setVisible(false);
	};

	return <Context.Provider value={context}>
		{children}
		<DialogContainer data-visible={visible}>
			<Dialog>
				<DialogContent>
					Not implemented yet.
				</DialogContent>
				<DialogButtons>
					<Placeholder/>
					<Button inkType={ButtonType.PRIMARY} onClick={hide}>Got It</Button>
				</DialogButtons>
			</Dialog>
		</DialogContainer>
	</Context.Provider>;
};

export const useNotImplemented = () => {
	return React.useContext(Context);
};
