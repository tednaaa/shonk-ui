export interface Point { x: number; y: number }

export function axisAngle(index: number, count: number) {
	return (index / count) * Math.PI * 2 - Math.PI / 2;
}

export function polar(center: number, radius: number, angle: number): Point {
	return { x: center + radius * Math.cos(angle), y: center + radius * Math.sin(angle) };
}

export function toPoints(points: Point[]) {
	return points.map(({ x, y }) => `${x},${y}`).join(' ');
}

export function labelStyle(center: number, radius: number, angle: number) {
	const point = polar(center, radius, angle);
	const cos = Math.cos(angle);
	const anchor = cos > 0.25 ? 'start' : cos < -0.25 ? 'end' : 'middle';
	const shiftX = { start: '0%', middle: '-50%', end: '-100%' }[anchor];
	const shiftY = anchor === 'middle' ? (point.y < center ? '-100%' : '0%') : '-50%';

	return {
		left: `${(point.x / (center * 2)) * 100}%`,
		top: `${(point.y / (center * 2)) * 100}%`,
		transform: `translate(${shiftX}, ${shiftY})`,
		textAlign: ({ start: 'left', middle: 'center', end: 'right' } as const)[anchor],
	};
}
