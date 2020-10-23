import { faCompressArrowsAlt, faExpandArrowsAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment } from 'react';
import Button from '../../component/button';
import { useChartContext } from './chart-context';

export const ResizeButtons = (props: { visible?: boolean }) => {
	const { visible = true } = props;
	const container = useChartContext();

	return <Fragment>
		<Button onClick={container.toggleExpanded} data-visible={visible && !container.expanded}
		        data-size-fixed-visible={false}>
			<FontAwesomeIcon icon={faExpandArrowsAlt}/>
		</Button>
		<Button onClick={container.toggleExpanded} data-visible={visible && container.expanded}
		        data-size-fixed-visible={false}>
			<FontAwesomeIcon icon={faCompressArrowsAlt}/>
		</Button>
	</Fragment>;
};