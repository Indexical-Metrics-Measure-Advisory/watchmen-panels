import React from "react";
import BackgroundImage from '../../../assets/console-timeline-background.png';
import { NarrowPageTitle } from '../../component/console/narrow-page-title';
import { NarrowContainer } from '../../component/console/page-container';

export const Timeline = () => {
	return <NarrowContainer background-image={BackgroundImage}>
		<NarrowPageTitle title='Timeline'/>
		<div style={{ marginTop: 50, fontSize: '2em', opacity: 0.5 }}>
			Coming soon...
		</div>
	</NarrowContainer>;
};