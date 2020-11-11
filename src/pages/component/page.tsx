import React from 'react';
import styled from 'styled-components';
import PageFooter from './page-footer';
import PageHeader from './page-header';

const PageContainer = styled.div`
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	align-items: center;
`;
export const Main = styled.main.attrs({
	'data-widget': 'page-body'
})`
	position: relative;
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	padding: var(--margin) 0;
`;

const Page = (props: {
	className?: string,
	header?: false | ((props: any) => React.ReactElement) | React.ReactElement,
	footer?: false,
	children?: ((props: any) => React.ReactNode) | React.ReactNode
}) => {
	const { className, header = <PageHeader/>, children, footer = <PageFooter/> } = props;

	return <PageContainer className={className}>
		{header || null}
		<Main>
			{children}
		</Main>
		{footer || null}
	</PageContainer>;
};

export default Page;