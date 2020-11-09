import React, { useEffect, useState } from 'react';
import BackgroundImage from '../../../../assets/console-notifications-background.png';
import { useNotImplemented } from '../../../context/not-implemented';
import { NarrowPageTitle } from '../../component/narrow-page-title';
import { NarrowContainer } from '../../component/page-container';
import { useConsoleContext } from '../../context/console-context';
import { ItemList } from '../common/item';
import { Tabs } from '../common/tabs';
import { ActiveTab, State } from '../common/types';
import { NotificationItem } from './notification-item';

export const Notification = () => {
	const notImpl = useNotImplemented();
	const context = useConsoleContext();
	const [ state, setState ] = useState<State>({
		active: ActiveTab.UNREAD,
		readInitialized: false,
		unreadInitialized: false
	});
	// load data only when state change
	useEffect(() => {
		(async () => {
			if (state.active === ActiveTab.UNREAD && !state.unreadInitialized) {
				await context.notifications.fetchUnread();
				setState({ ...state, unreadInitialized: true });
			} else if (state.active === ActiveTab.READ && !state.readInitialized) {
				await context.notifications.fetchRead();
				setState({ ...state, readInitialized: true });
			}
		})();
		// eslint-disable-next-line
	}, [ state ]);

	const onTabClicked = (activeTab: ActiveTab) => () => {
		if (activeTab !== state.active) {
			setState({ ...state, active: activeTab });
		}
	};

	return <NarrowContainer background-image={BackgroundImage}>
		<NarrowPageTitle title='Notifications' onSettingsClicked={notImpl.show}/>
		<Tabs state={state}
		      onUnreadClicked={onTabClicked(ActiveTab.UNREAD)} onReadClicked={onTabClicked(ActiveTab.READ)}
		      onClearClicked={context.mails.readAll}/>
		<ItemList data={context.notifications.unread}
		          allLoaded={context.notifications.allUnreadLoaded}
		          visible={state.active === ActiveTab.UNREAD}
		          noData='No notifications.'>
			{context.notifications.unread.map((item: any, index: number) => {
				return <NotificationItem data={item} readable={true} key={`${item.createDate}-${index}`}/>;
			})}
		</ItemList>
		<ItemList data={context.notifications.read}
		          allLoaded={context.notifications.allReadLoaded}
		          visible={state.active === ActiveTab.READ}
		          noData='No notifications.'>
			{context.notifications.read.map((item: any, index: number) => {
				return <NotificationItem data={item} readable={false} key={`${item.createDate}-${index}`}/>;
			})}
		</ItemList>
	</NarrowContainer>;
};