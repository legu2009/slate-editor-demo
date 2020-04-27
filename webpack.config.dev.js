const webpack = require('webpack');
const path = require('path');
console.log(path.resolve(__dirname, './dist'));
module.exports = {
    devtool: 'source-map',
    entry: {
        app: './src/index.jsx'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js',
        publicPath: '/public/'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.less$/,
                loader: 'style-loader!css-loader!less-loader'
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.(png|jpg|gif|svg)(\?[a-z0-9\-=]+)?$/,
                loader: 'url-loader',
                options: {
                    limit: 8192
                }
            },
            {
                test: /\.(otf|ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                loader: 'file-loader'
            }
        ]
    },
    devServer: {
        stats: { chunks: false },
        port: 5998,
        hot: true
    }
};
