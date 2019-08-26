var unified = require('unified');
var reParse = require('remark-parse');
var remark2rehype = require('remark-rehype');
var stringify = require('rehype-stringify');

const render = (text, allowTitle) =>
  unified()
    .use(reParse)
    .use(remark2rehype)
    .use(stringify)
    .processSync(text);

var a = render(`
    # asdasd
> 232323    \`a\`
`);
console.log(a);
