const { GettextExtractor, JsExtractors } = require('gettext-extractor');

let extractor = new GettextExtractor();

extractor
    .createJsParser([
        JsExtractors.callExpression('t', {
            arguments: {
                text: 0,
            }
        }),
        JsExtractors.callExpression('n', {
            arguments: {
                text: 0,
                textPlural: 1,
            }
        }),
    ])
    .parseFilesGlob('./src/**/*.@(ts|js|vue)');

// remove references to avoid conflicts
extractor.getMessages().forEach((msg) => {
    msg.references = [];
});
      
extractor.savePotFile('./l10n/messages.pot');

extractor.printStats();
