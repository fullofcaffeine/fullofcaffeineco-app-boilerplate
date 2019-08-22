const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const generateSourceMap = process.env.OMIT_SOURCEMAP === 'true' ? false : true;
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');

const cssRegex = /\.css|\.scss|\.sass$/;
const cssModuleRegex = /\.module(\.css|\.scss|\.sass)$/;

// temporary wrapper function around getCSSModuleLocalIdent until this issue is resolved:
// https://github.com/webpack-contrib/css-loader/pull/965
const getLocalIdentWorkaround = (context, localIdentName, localName, options) => {
    if (options && options.context === null) {
        options.context = undefined;
    }
    return getCSSModuleLocalIdent(context, localIdentName, localName, options);
};

const babelLoader = {
    test: /\.(jsx|ts|tsx|mjs)$/,
    exclude: /node_modules/,
    loader: require.resolve('babel-loader'),
    options: {
        plugins: [
            [
                require.resolve('babel-plugin-named-asset-import'),
                {
                    loaderMap: {
                        svg: {
                            ReactComponent: '@svgr/webpack?-prettier,-svgo![path]',
                        },
                    },
                },
            ],
        ],
        cacheDirectory: true,
        cacheCompression: process.env.NODE_ENV === 'production',
        compact: process.env.NODE_ENV === 'production',
    },
};

const cssLoader = {
    test: cssRegex,
    use: [
        require.resolve('css-hot-loader'),
        MiniCssExtractPlugin.loader,
        require.resolve('css-modules-typescript-loader'),
        {loader: require.resolve('css-loader'), options: {modules: true}},
        {loader: require.resolve('postcss-loader'), options: {sourceMap: generateSourceMap}},
        require.resolve('sass-loader'),
    ],
};

const cssLoaderClient = {
    test: /\.css/,
    exclude: cssModuleRegex,
    use: [
        MiniCssExtractPlugin.loader,
        require.resolve('css-modules-typescript-loader'),
        require.resolve('css-loader'),
        {
            loader: require.resolve('postcss-loader'),
            options: {
                sourceMap: generateSourceMap,
            },
        },
        require.resolve('sass-loader'),
    ],
};

const cssModuleLoaderServer = {
    test: cssModuleRegex,
    use: [
        MiniCssExtractPlugin.loader, 
        require.resolve('css-modules-typescript-loader'),
        require.resolve('css-loader'),
        require.resolve('postcss-loader'),
        require.resolve('sass-loader')
    ],
};

const cssLoaderServer = {
    test: cssRegex,
    exclude: cssModuleRegex,
    use:  [
        MiniCssExtractPlugin.loader, 
        require.resolve('css-modules-typescript-loader'),
        require.resolve('css-loader'), 
        require.resolve('sass-loader')
    ],
};

const urlLoaderClient = {
    test: /\.(png|jpe?g|gif|svg)$/,
    loader: require.resolve('url-loader'),
    options: {
        limit: 2048,
        name: 'assets/[name].[hash:8].[ext]',
    },
};

const urlLoaderServer = {
    ...urlLoaderClient,
    options: {
        ...urlLoaderClient.options,
        emitFile: false,
    },
};

const fileLoaderClient = {
    exclude: [/\.(js|jsx|ts|tsx|css|mjs|html|ejs|json)$/],
    use: [
        {
            loader: require.resolve('file-loader'),
            options: {
                name: 'assets/[name].[hash:8].[ext]',
            },
        },
    ],
};

const fileLoaderServer = {
    exclude: [/\.(js|tsx|ts|tsx|css|mjs|html|ejs|json)$/],
    use: [
        {
            loader: require.resolve('file-loader'),
            options: {
                name: 'assets/[name].[hash:8].[ext]',
                emitFile: false,
            },
        },
    ],
};

const client = [
    {
        oneOf: [
            babelLoader,
        //    cssModuleLoaderClient,
        //    cssLoaderClient,
            cssLoader,
            urlLoaderClient,
            fileLoaderClient,
        ],
    },
];
const server = [
    {
        oneOf: [
            babelLoader,
//            cssModuleLoaderServer,
  //          cssLoaderServer,
            cssLoader,
            urlLoaderServer,
            fileLoaderServer,
        ],
    },
];

module.exports = {
    client,
    server,
};
