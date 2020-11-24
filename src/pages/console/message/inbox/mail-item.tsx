import React, { useState } from 'react';
import styled from 'styled-components';
import { ConsoleMail } from '../../../../services/console/types';
import { UserAvatar } from '../../../component/console/user-avatar';
import { useConsoleContext } from '../../context/console-context';
import {
	ItemBody,
	MessageItemContainer,
	MessageItemHeader,
	MessageItemOperators,
	MessageItemSender,
	MessageItemSubject
} from '../common/item';
import { ReadButton } from '../common/read-button';

const Body = styled(ItemBody)`
    background-color: var(--console-mail-color);
`;

export const MailItem = (props: { data: ConsoleMail, readable: boolean }) => {
	const { data, readable } = props;
	const { subject, sender, body, image, createDate } = data;

	const context = useConsoleContext();
	const [ read, setRead ] = useState(false);

	return <MessageItemContainer data-read={read}>
		<MessageItemHeader>
			<MessageItemSubject>{subject}</MessageItemSubject>
			<MessageItemOperators>
				<ReadButton readable={readable} tooltip='Set as read'
				            onRead={() => setRead(true)}
				            readOne={() => context.mails.readOne(data)}/>
			</MessageItemOperators>
			<MessageItemSender>
				<UserAvatar name={sender} showTooltip={true}/>
			</MessageItemSender>
		</MessageItemHeader>
		<Body body={body} createDate={createDate} image={image}/>
	</MessageItemContainer>;
};