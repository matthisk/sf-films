module.exports = {
	context: __dirname + '/public/js',
	entry: {
	  main: './index.jsx',
	},

	output: {
	  path: __dirname + '/dist/public',
	  filename: '[name].bundle.js',
	  chunkFilename: '[id].bundle.js',
	},

	resolve: {
	  root: [
	    __dirname + '/public/js',
	  ],

	  extensions: ['', '.js', '.jsx'],
	},

	module: {
	  loaders: [
	    {
	      test: /\.jsx?$/,
	      exclude: /(node_modules|bower_components|vendor)/,
	      loader: 'babel',
	      query: {
	        presets: ['react', 'es2015'],
	        plugins: ['transform-object-rest-spread', 'transform-class-properties'],
	      }
	    },
	  ],
	},

	plugins: [],
};