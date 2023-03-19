export default function longpress(node, options) {
	let timer;

	function handleMousedown() {
		const { duratuion = 2000 } = options;

		timer = setTimeout(() => {
			node.dispatchEvent(new CustomEvent('longpress'));
		}, duratuion);
	}

	function handleMouseUp() {
		clearTimeout(timer);
	}

	node.addEventListener('mousedown', handleMousedown);
	node.addEventListener('mouseup', handleMouseUp);

	return {
		update(newOptions) {
			options = newOptions;
		},
		destroy() {
			console.log('destroyed');
      clearTimeout(timer);
      node.removeEventListener('mousedown', handleMousedown);
      node.removeEventListener('mouseup', handleMouseUp);
		}
	};
}
