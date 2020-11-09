import React, { useState } from 'react';
import styled from 'styled-components';
import { ConsoleMail } from '../../../../services/console/types';
import { UserAvatar } from '../../component/user-avatar';
import { useConsoleContext } from '../../context/console-context';
import {
	ItemBody,
	MessageItemContainer,
	MessageItemHeader,
	MessageItemSender,
	MessageItemSubject
} from '../common/item';
import { Operators } from '../common/operators';
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
			<Operators>
				<ReadButton readable={readable} tooltip='Set as read'
				            onRead={() => setRead(true)}
				            readOne={() => context.mails.readOne(data)}/>
			</Operators>
			<MessageItemSender>
				<UserAvatar name={sender} showTooltip={true}/>
			</MessageItemSender>
		</MessageItemHeader>
		<Body body={body} createDate={createDate} image={image}/>
	</MessageItemContainer>;
};