'use strict';

module.exports = {
    tags: {
        allowUnknownTags: true,
        dictionaries: ['jsdoc']
    },
    source: {
        include: ['src'],
        includePattern: '.(vue|js)$',
        excludePattern: '(node_modules/|docs)'
    },
    plugins: [
        'jsdoc-vuejs'
    ],
    opts: {
        destination: './docs/',
        encoding: 'utf8',
        private: true,
        recurse: true
    }
}