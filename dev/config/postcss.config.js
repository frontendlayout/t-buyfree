module.exports = {
    plugins: [
        require('autoprefixer'),
        require('css-mqpacker'),
        require('postcss-inline-svg'),
        require('postcss-svgo'),
        require('postcss-unique-selectors')
    ]
};
