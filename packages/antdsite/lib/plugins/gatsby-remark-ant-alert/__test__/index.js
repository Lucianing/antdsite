var unified = require('unified');
var reParse = require('remark-parse');
var remark2rehype = require('remark-rehype');

const render = (text, allowTitle) =>
  unified()
    .use(reParse)
    .use(remark2rehype)
    .use(stringify)
    .processSync(text);

render('`a`');
