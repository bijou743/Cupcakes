const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin'); // для работы с HTML
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // для очистки папки dist
const CopyWebpackPlugin = require('copy-webpack-plugin'); // для работы с файлами, которые нужно просто копировать

const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // для оптимизации css
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin'); // для минификации css
const TerserWebpackPlugin = require('terser-webpack-plugin'); // для минификации css

const ESLintPlugin = require('eslint-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all', // для оптимизации загрузки повторяющихся скриптов
    },
    runtimeChunk: 'single', // без этой строки web-dev-server не делает live reload
  };

  if (isProd) {
    config.minimizer = [new CssMinimizerPlugin(), new TerserWebpackPlugin()];
  }

  return config;
};

const filename = (ext) => (isProd ? `[name].${ext}` : `[name].[hash].${ext}`);

const cssLoaders = (extra) => {
  const loaders = [MiniCssExtractPlugin.loader, 'css-loader']; // здесь идет справа налево

  if (extra) {
    loaders.push(extra);
  }

  return loaders;
};

const babelOptions = (preset) => {
  const opts = {
    presets: ['@babel/preset-env'],
  };

  if (preset) {
    opts.presets.push(preset);
  }

  return opts;
};

const jsLoaders = () => {
  const loaders = [
    {
      loader: 'babel-loader',
      options: babelOptions(),
    },
  ];

  return loaders;
};

const plugins = () => {
  const base = [
    new HtmlWebpackPlugin({
      template: './index.html', // на каком шаблоне основываться
      minify: {
        collapseWhitespace: isProd, // для минификации html
      },
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/content'),
          to: path.resolve(__dirname, 'dist/content'),
        },
        {
          from: path.resolve(__dirname, 'src/favicon.ico'),
          to: path.resolve(__dirname, 'dist'),
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: filename('css'),
    }),
  ];

  if (isDev) {
    base.push(new ESLintPlugin());
  }

  return base;
};

module.exports = {
  context: path.resolve(__dirname, 'src'), // где лежат исходники приложения
  mode: 'development', // режим сборки по умолчанию
  entry: {
    // точка входа, их может быть несколько
    main: ['@babel/polyfill', './js/app.js'], // если указан context, можно его отсюда удалить
  },
  output: {
    // куда складывать результаты работы webpack
    filename: filename('js'), // сюда будут собираться все скрипты
    path: path.resolve(__dirname, 'dist'), // путь к папке
    // assetModuleFilename: 'assets/[name][ext]' // сюда отправлять файлы ресурсов
  },
  resolve: {
    extensions: ['.js', '.json', '.png'], // какие расширения понимать по умолчанию
    alias: {
      // псевдонимы для папок
      '@models': path.resolve(__dirname, 'src/models'),
      '@': path.resolve(__dirname, 'src'),
      '@css': path.resolve(__dirname, 'src/css'),
    },
  },
  optimization: optimization(),
  devServer: {
    port: 4200,
    hot: isDev,
    watchFiles: ['src/**/*'], // файлы, за которыми должен следить webpack-server и обновлять на лету
  },
  devtool: isDev ? 'source-map' : false, // доступ к исходному коду в devtools
  plugins: plugins(),
  module: {
    rules: [
      {
        test: /\.css$/,
        use: cssLoaders(),
      },
      {
        test: /\.less$/,
        use: cssLoaders('less-loader'),
      },
      {
        test: /\.s[a|c]ss$/,
        use: cssLoaders('sass-loader'),
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        type: 'asset/resource',
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        type: 'asset/resource',
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: jsLoaders(),
      },
      {
        test: /\.m?ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: babelOptions('@babel/preset-typescript'),
        },
      },
    ],
  },
};
