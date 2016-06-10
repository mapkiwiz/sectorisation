const path = require('path');
const webpack = require('webpack');
const argv = require('yargs').argv;

/*
 * Webpack Plugins
 */
// problem with copy-webpack-plugin
var CopyWebpackPlugin = (CopyWebpackPlugin = require('copy-webpack-plugin'), CopyWebpackPlugin.default || CopyWebpackPlugin);
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const ENV = argv['env'] || 'dev';

module.exports = {

  metadata: {
    title: 'Sectorisation',
    baseUrl: argv['base'] || '/'
  },

  entry: {
    polyfills: './src/client/polyfills/index',
    styles: './src/client/styles',
    vendor: './src/client/vendor',
    main: './src/client/main'
  },

  output: {
    path: path.resolve(__dirname, 'dist/' + ENV),
    publicPath: '/',
    filename: '[name].js'
  },

  resolve: {
    extensions: ['', '.js', '.jsx', '.ts', '.tsx']
  },

  devtool: 'source-map', // if we want a source map

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          cacheDirectory: true
        }
      },
      {
        test: /\.tsx?$/,
        loader: 'babel!awesome-typescript-loader',
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      { test: /\.css$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader")
      },
      {
        test: /\.rt$/,
        loader: "babel!react-templates-loader?modules=es6"
      },
      {
        test: [ /\.svg$/, /\.png$/, /\.jpg$/, /\.jpeg$/, /\.gif$/ ],
        loader: "file"
      },
      {
        test: [ /\.ttf$/, /\.eot$/, /\.woff2?$/ ],
        loader: "file"
      }
    ]
  },

  plugins: [

    /*
     * Plugin: ForkCheckerPlugin
     * Description: Do type checking in a separate process, so webpack don't need to wait.
     *
     * See: https://github.com/s-panferov/awesome-typescript-loader#forkchecker-boolean-defaultfalse
     */
    new ForkCheckerPlugin(),

    /*
     * Plugin: CopyWebpackPlugin
     * Description: Copy files and directories in webpack.
     *
     * Copies project static assets.
     *
     * See: https://www.npmjs.com/package/copy-webpack-plugin
     */
    new CopyWebpackPlugin([
      { from: 'src/client/data', to: 'data' },
      { from: 'node_modules/leaflet/dist/images', to: 'images' }
    ]),

    /*
     * Plugin: HtmlWebpackPlugin
     * Description: Simplifies creation of HTML files to serve your webpack bundles.
     * This is especially useful for webpack bundles that include a hash in the filename
     * which changes every compilation.
     *
     * See: https://github.com/ampedandwired/html-webpack-plugin
     */
    new HtmlWebpackPlugin({
      unsupportedBrowser: true,
      template: 'src/client/index.html',
      chunksSortMode: 'dependency',
      appMountId: 'main',
      devServer: true,
      mobile: true
    }),

    new webpack.optimize.OccurenceOrderPlugin(),

    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('dev')
      }
    }),

    new webpack.optimize.CommonsChunkPlugin({ name: [ 'polyfills', 'vendor'  ].reverse() }),

    new ExtractTextPlugin('[name].css')

  ]
}
