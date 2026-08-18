/** Scalloped disc: `bumps` outward arcs around a circle, in a 0 0 100 100 box. */
export function scallopPath(bumps = 16, radius = 42, arc = 8.6): string {
	const center = 50;
	const points = Array.from({ length: bumps }, (_, i) => {
		const angle = (i / bumps) * Math.PI * 2 - Math.PI / 2;
		return [center + radius * Math.cos(angle), center + radius * Math.sin(angle)].map((n) =>
			n.toFixed(2)
		);
	});

	return (
		`M${points[0][0]} ${points[0][1]}` +
		points
			.slice(1)
			.concat([points[0]])
			.map(([x, y]) => `A${arc} ${arc} 0 0 1 ${x} ${y}`)
			.join('') +
		'Z'
	);
}
