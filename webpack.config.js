'use strict'

const webpack = require('webpack')
const path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

const DEBUG = true
const AUTOPREFIXER_BROWSERS = [
  'Android 2.3',
  'Android >= 4',
  'Chrome >= 35',
  'Firefox >= 31',
  'Explorer >= 9',
  'iOS >= 7',
  'Opera >= 12',
  'Safari >= 7.1',
];


function entry() {
  return {
    js: __dirname + "/client/index.js",
    vendor: [
      'react',
      'react-redux',
      'react-router',
      'redux'
    ]
  }
}

function output() {
  return {
    path: __dirname + "/build",
    filename: "[name]-[hash].js",
    publicPath: '/'
  }
}


function loaders() {
  return [{
    test: /\.txt$/,
    loader: 'raw',
  }, {
    test: /\.json$/,
    loader: "json"
  }, {
    test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
    loader: 'url-loader',
    query: {
      name: DEBUG ? '[path][name].[ext]?[hash]' : '[hash].[ext]',
      limit: 10000,
    },
  }, {
    test: /\.(eot|ttf|wav|mp3)$/,
    loader: 'file-loader',
    query: {
      name: DEBUG ? '[path][name].[ext]?[hash]' : '[hash].[ext]',
    },
  }, {
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'babel',
    query: {
      cacheDirectory: true,
      plugins: ['transform-runtime'],
      presets: ['es2015', 'react', 'stage-0']
    }
  }, {
    test: /\.css$/,
    // loader: ExtractTextPlugin.extract('style', 'css?modules!postcss?pack=default')   // css的class为随机字符串
    loader: ExtractTextPlugin.extract('style', `css!postcss?pack=default`) // css的class为用户定义的字符串
  }]
}

function plugins() {
  return [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production')
      }
    }),
    new HtmlWebpackPlugin({
      template: __dirname + "/client/index.html"
    }),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js'),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false, // remove all comments
      },
      compress: {
        warnings: false
      }
    }),
    new ExtractTextPlugin("[name]-[hash].css")
  ]
}



module.exports = {

  entry: entry(),
  output: output(),
  module: {
    loaders: loaders()
  },
  plugins: plugins(),
  postcss: function (bundler) {
    return {
      default: [
        // Transfer @import rule by inlining content, e.g. @import 'normalize.css'
        require('postcss-partial-import')({
          addDependencyTo: bundler
        }),
        // W3C variables, e.g. :root { --color: red; } div { background: var(--color); }
        // https://github.com/postcss/postcss-custom-properties
        require('postcss-custom-properties')(),
        // W3C CSS Custom Media Queries, e.g. @custom-media --small-viewport (max-width: 30em);
        // https://github.com/postcss/postcss-custom-media
        require('postcss-custom-media')(),
        // CSS4 Media Queries, e.g. @media screen and (width >= 500px) and (width <= 1200px) { }
        // https://github.com/postcss/postcss-media-minmax
        require('postcss-media-minmax')(),
        // W3C CSS Custom Selectors, e.g. @custom-selector :--heading h1, h2, h3, h4, h5, h6;
        // https://github.com/postcss/postcss-custom-selectors
        require('postcss-custom-selectors')(),
        // W3C calc() function, e.g. div { height: calc(100px - 2em); }
        // https://github.com/postcss/postcss-calc
        require('postcss-calc')(),
        // Allows you to nest one style rule inside another
        // https://github.com/jonathantneal/postcss-nesting
        require('postcss-nesting')(),
        // W3C color() function, e.g. div { background: color(red alpha(90%)); }
        // https://github.com/postcss/postcss-color-function
        require('postcss-color-function')(),
        // Convert CSS shorthand filters to SVG equivalent, e.g. .blur { filter: blur(4px); }
        // https://github.com/iamvdo/pleeease-filters
        require('pleeease-filters')(),
        // Generate pixel fallback for "rem" units, e.g. div { margin: 2.5rem 2px 3em 100%; }
        // https://github.com/robwierzbowski/node-pixrem
        require('pixrem')(),
        // W3C CSS Level4 :matches() pseudo class, e.g. p:matches(:first-child, .special) { }
        // https://github.com/postcss/postcss-selector-matches
        require('postcss-selector-matches')(),
        // Transforms :not() W3C CSS Level 4 pseudo class to :not() CSS Level 3 selectors
        // https://github.com/postcss/postcss-selector-not
        require('postcss-selector-not')(),
        // Postcss flexbox bug fixer
        // https://github.com/luisrudge/postcss-flexbugs-fixes
        require('postcss-flexbugs-fixes')(),
        // Add vendor prefixes to CSS rules using values from caniuse.com
        // https://github.com/postcss/autoprefixer
        require('autoprefixer')({
          browsers: AUTOPREFIXER_BROWSERS
        }),
        require('postcss-mixins')(),
        require('postcss-advanced-variables')(),
        require('postcss-nested')(),
        require('postcss-extend')()
      ]
    };
  },
  stats: {
    colors: true,
    timings: true,
  },
  resolve: {
    root: path.resolve(__dirname, './client'),
    modulesDirectories: ['node_modules'],
    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx', '.json'],
  }
}