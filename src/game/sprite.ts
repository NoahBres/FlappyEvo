export default interface Sprite {
	_x: number;
	_y: number;
	_width: number;
	_height: number;

	draw(ctx: CanvasRenderingContext2D);
}
