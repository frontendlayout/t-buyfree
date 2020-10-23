// require svg for create svg-sprite

requireAll(require.context('../assets/svg-sprite', true, /\.svg$/));

function requireAll(r) {
	r.keys().forEach(r);
}