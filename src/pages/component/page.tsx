import React from 'react';
import styled from 'styled-components';
import PageFooter from './page-footer';
import PageHeader from './page-header';

const Page = styled.div`
	display: flex;
	flex-direction: column;
	min-height: 100vh;
`;
const PlaceHolder = styled.div`
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	padding: var(--page-margin) 0;
`;

export default (props: {
	className?: string,
	header?: false | ((props: any) => React.ReactElement) | React.ReactElement,
	footer?: false,
	children?: ((props: any) => React.ReactNode) | React.ReactNode
}) => {
	const { className, header = <PageHeader/>, children, footer = <PageFooter/> } = props;

	return <Page className={className}>
		{header || null}
		<PlaceHolder>
			{children}
		</PlaceHolder>
		{footer || null}
	</Page>;
}