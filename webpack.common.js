const path = require('path')
const HtmlPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ImageminPlugin = require('imagemin-webpack-plugin').default

module.exports = {
    //Game portal file
    context: path.join(__dirname, 'src'),
    entry: ['./js/main.js'],
    output: {
        //Which path is the JS file finally published to
        path: path.resolve(__dirname, 'dist'),

        //During the development and debugging phase, webpack will automatically process this file and let HTML reference it, although it will not be on disk.
        //However, when the project is finally released, this file will be generated and inserted into the index.html Medium.
        // [ hash:8 ]To generate a random eight bit hash value for cache update.
        filename: 'game.min.[hash:8].js',
    },
    target: 'web',
    // define babel loader
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-react']
                }
            }
        }
        ]
    },

    plugins: [
        //Copy all resources in the Src / assets directory to dist / assets
        new CopyWebpackPlugin({
            patterns: [
                { from: 'assets', to: 'assets' }
            ], options: {

            }
        }),

        //Optimize image resources and compress PNG.
        // new ImageminPlugin({
        //     test: /\.(jpe?g|png|gif|svg)$/i,

        //     //This method has better compression effect on MAC and has not been tested on windows.
        //     pngquant: {
        //         verbose: true,
        //         quality: '80-90',
        //     }
        // }),

        //Copy HTML and insert JS.
        new HtmlPlugin({
            file: path.join(__dirname, 'dist', 'index.html'),
            template: './index.html'
        })
    ]
}