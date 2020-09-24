const path = require('path')
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js')

//Merge with common configuration file
module.exports = merge(common, {
    devtool: 'inline-source-map',
    mode: 'none',

    //HTTP server configuration for debugging
    devServer: {
        //Location of source code during debugging
        contentBase: path.join(__dirname, 'src'),

        //Server port
        port: 8069,

        //Note that if the server address is configured as' 127.0.0.1 ', other machines in the LAN cannot access this server.
        host: 'localhost',

        //Listen to the local JS file and refresh the page automatically if there is any modification.
        hot: true
    }
})