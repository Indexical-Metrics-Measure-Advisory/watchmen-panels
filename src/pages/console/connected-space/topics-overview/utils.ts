export const findSvgRoot = (element: SVGGraphicsElement): SVGElement => {
	let parent = element.parentElement!;
	while (parent.tagName.toUpperCase() !== 'SVG') {
		parent = parent.parentElement!;
	}
	return parent as unknown as SVGElement;
};
