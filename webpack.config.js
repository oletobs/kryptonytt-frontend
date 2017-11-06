var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
    entry: ['./src/assets/scss/app.scss','./src/main.js'],
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/',
        filename: 'js/app.bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        'js': 'babel-loader',
                        'scss': ExtractTextPlugin.extract({
                            use: [
                                'css-loader',
                                'sass-loader',
                                {
                                    loader: 'sass-resources-loader',
                                    options: {
                                        resources: ['./src/assets/scss/resources/_resources.scss']
                                    }
                                },
                            ],
                            fallback: 'vue-style-loader'
                        }),
                        'sass': ExtractTextPlugin.extract({
                            use: [
                                'css-loader',
                                'sass-loader?indentedSyntax',
                                {
                                    loader: 'sass-resources-loader',
                                    options: {
                                        resources: ['./src/assets/scss/resources/_resources.scss']
                                    }
                                },
                            ],
                            fallback: 'vue-style-loader'
                        })
                    },

                    postcss: [
                        require('autoprefixer')
                    ]
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options : { autoprefixer: true, sourceMap: true, importLoaders: 1 }
                        },
                        'postcss-loader'
                    ]
                })
            },
            {
                test: /\.(sass|scss)$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options : { autoprefixer: true, sourceMap: true, importLoaders: 1 }
                        },
                        'postcss-loader',
                        'sass-loader',
                        {
                            loader: 'sass-resources-loader',
                            options: {
                                resources: ['./src/assets/scss/resources/_resources.scss']
                            }
                        },
                    ]
                })
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file-loader?name=fonts/[name].[ext]'
            },
        ]
    },
    plugins: [
        new ExtractTextPlugin("css/app.bundle.css"),
    ],
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true,
        overlay: true,
        port: 3000,
    },
    performance: {
        hints: false
    },
    devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map'
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ])
}
