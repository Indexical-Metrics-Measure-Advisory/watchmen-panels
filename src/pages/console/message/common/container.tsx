import styled from 'styled-components';
import { PageContainer } from '../../component/page-container';

export const MessagesContainer = styled(PageContainer).attrs({
	'data-widget': 'console-messages-container'
})`
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	position: relative;
	max-width: 1000px;
	min-width: 600px;
	margin: var(--margin) auto;
`;
