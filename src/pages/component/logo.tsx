import React from "react";

export default (props: {
	className?: string;
	bgColor?: string;
	arrowColor?: string;
}) => {
	const { className, bgColor = '#333333', arrowColor = '#ffffff' } = props;

	return <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="541px" height="558px"
	            viewBox="-0.5 -0.5 541 558" className={className}>
		<defs/>
		<g>
			<ellipse cx="265" cy="265" rx="265" ry="265" fill={bgColor} stroke={bgColor} pointerEvents="none"/>
			<path d="M 64.8 508.8 Q 453.6 402.8 280.8 318 Q 108 233.2 300.05 149.43" fill="none" stroke={arrowColor}
			      strokeWidth="96" strokeMiterlimit="10" pointerEvents="none"/>
			<path d="M 321.02 199.19 L 398.42 106.51 L 277.84 100.2" fill="none" stroke={arrowColor} strokeWidth="96"
			      strokeMiterlimit="10" pointerEvents="none"/>
		</g>
	</svg>;
}