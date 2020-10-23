const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");

const PATHS = {
    dev: path.join(__dirname, '..'),
    public: path.join(__dirname, '../../public'),
    assets: 'assets'
};

const PAGES_DIR = `${PATHS.dev}/view/pages/`;
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.pug'));

module.exports = {
    externals: {
        paths: PATHS
    },
    entry: {
        'script': `${PATHS.dev}/entry/script.js`,
        'svg-sprite--not-connect-templates': `${PATHS.dev}/entry/svg-sprite.js`,
        'style': [ `${PATHS.dev}/assets/scss/style.scss` ],
        'vendors-style': [ `${PATHS.dev}/assets/vendors-style/vendors-style.scss` ]
    },
    output: {
        filename: `${PATHS.assets}/script/[name].js`,
        path: PATHS.public,
        publicPath: '/'
    },
    module: {
        rules: [
        // .pug
        {
            test: /\.pug$/,
            include: [
                path.resolve(__dirname, "../view")
            ],
            oneOf: [
                {
                    use: ['pug-loader?pretty=true']
                }
            ]
        },
        // .js
        {
            test: /\.js$/,
            include: [
                path.resolve(__dirname, '../assets/script')
            ],
            use: [
                {
                    loader: 'babel-loader'
                }
            ]
        },
        // svg-sprite
        {
            test: /\.svg$/,
            include: [
                path.resolve(__dirname, '../assets/svg-sprite')
            ],
            use: [
                {
                    loader: 'svg-sprite-loader',
                    options: {
                        extract: true,
                        spriteFilename: `${PATHS.assets}/svg-sprite/svg-sprite.svg`,
                        runtimeCompat: true
                    }
                }, {
                    loader: 'svgo-loader',
                    options: {
                        plugins: [
                            {removeTitle: true},
                            {removeDesc: true},
                            {convertColors: {shorthex: false}},
                            {convertPathData: false}
                        ]
                    }
                }
            ]
        },
        // .sass | .scss
        {
            test: /\.(sa|sc)ss$/,
            include: [
                path.resolve(__dirname, '../assets/scss'),
                path.resolve(__dirname, '../assets/vendors-style'),
                path.resolve(__dirname, '../node_modules')
            ],
            use: [
                MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader',
                    options: { sourceMap: true }
                }, {
                    loader: 'postcss-loader',
                    options: { sourceMap: true, config: { path: `./config/postcss.config.js` } }
                }, {
                    loader: 'sass-loader',
                    options: { sourceMap: true }
                }
            ]
        },
        // .css
        {
            test: /\.css$/,
            include: [
                path.resolve(__dirname, '../assets/scss'),
                path.resolve(__dirname, '../assets/vendors-style'),
                path.resolve(__dirname, '../node_modules')
            ],
            use: [
                MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader',
                    options: { sourceMap: true }
                }
            ]
        },
        // .woff(2) | .ttf | .eot | .svg
        {
            test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
            include: [
                path.resolve(__dirname, '../assets/fonts')
            ],
            loader: 'file-loader',
            options: {
                name: '[path][name].[ext]'
            }
        },
        // .gif | .png | .jpe?g | .svg
        {
            test: /\.(gif|png|jpe?g|svg)$/i,
            include: [
                path.resolve(__dirname, '../assets/img/')
            ],
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]'
                    }
                },
                {
                    loader: 'image-webpack-loader'
                }
            ]
        }]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendorScript: {
                    name: 'vendors-script',
                    test: /([\\/]node_modules[\\/]|[\\/]vendor-script[\\/]).*\.js$/,
                    chunks: 'all',
                    enforce: true
                }
            }
        }
    },
    resolve: {
        alias: {
            '~': PATHS.dev
        }
    },
    plugins: [
    
        new FixStyleOnlyEntriesPlugin(),

        new MiniCssExtractPlugin({
            filename: `${PATHS.assets}/style/[name].css`,
            chunkFilename: `${PATHS.assets}/style/[id].css`
        }),

        new CopyWebpackPlugin(
            [
                { from: `${PATHS.dev}/${PATHS.assets}/img`, to: `${PATHS.assets}/img/`, ignore: [ 'not-copy/**/*.*', 'svg-load/**/*.*' ] },
                { from: `${PATHS.dev}/static`, to: '' },
            ]
        ),

        new SpriteLoaderPlugin({
            plainSprite: true
        }),

        ...PAGES.map(page => new HtmlWebpackPlugin({
            template: `${PAGES_DIR}/${page}`,
            filename: `./${page.replace(/\.pug/, '.html')}`,
            inject: false
        }))
    ],
};