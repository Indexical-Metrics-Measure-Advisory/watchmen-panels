import React from "react";
import styled from 'styled-components';
import BackgroundImage from '../../../assets/console-settings-background.png';
import { NarrowPageTitle } from '../component/narrow-page-title';
import { NarrowContainer } from '../component/page-container';
import { MailSettings } from './mail-settings';
import { NotificationSettings } from './notification-settings';

const Bottom = styled.div`
	margin-bottom: 100px;
`;

export const SettingsPanel = () => {
	return <NarrowContainer background-image={BackgroundImage}>
		<NarrowPageTitle title='Settings'/>
		<NotificationSettings/>
		<MailSettings/>
		<Bottom/>
	</NarrowContainer>;
};