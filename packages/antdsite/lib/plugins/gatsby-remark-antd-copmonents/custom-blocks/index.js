'use strict';

module.exports = function blockPlugin() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var regex = /\:\:\: (.*?)(?:\|(.*?))?\n([\s\S]*?)\n *?\:\:\:/;

  function findTypeAndTitle(option, type) {
    var primitiveType = '';
    var title = '';

    for (var key in option) {
      var value = option[key];
      for (var j = 0; j < value.length; j++) {
        if (value[j].alias == type) {
          primitiveType = key;
          title = value[j].defaultTitle;
          break;
        }
      }

      if (primitiveType && title) {
        return {
          type: primitiveType,
          title
        };
      }
    }

    return {
      type: primitiveType,
      title
    };
  }

  function blockTokenizer(eat, value, silent) {
    var now = eat.now();
    var keep = regex.exec(value);
    if (!keep) return;
    if (keep.index !== 0) return;

    var [eaten, blockType, blockTitle, blockContent] = keep;

    blockType = blockType.trim();
    var { type, title } = findTypeAndTitle(options, blockType);

    if (silent || !type) return !!type;

    var stringToEat = eaten;
    var add = eat(stringToEat);

    var exit = this.enterBlock();
    var contents = this.tokenizeBlock((blockContent || '').replace(/\n/g, '\n\n'), now);
    exit();

    return add({
      type: 'MdAlert',
      children: contents,
      hProperties: {
        className: 'md-alert'
      },
      data: {
        hName: 'MdAlert',
        hProperties: {
          message: blockTitle || title,
          type
        }
      }
    });
  }

  var Parser = this.Parser; // Inject blockTokenizer

  var blockTokenizers = Parser.prototype.blockTokenizers;
  var blockMethods = Parser.prototype.blockMethods;
  blockTokenizers.mdAlert = blockTokenizer;
  blockMethods.splice(blockMethods.indexOf('fencedCode') + 1, 0, 'mdAlert');

  var interruptParagraph = Parser.prototype.interruptParagraph;
  var interruptList = Parser.prototype.interruptList;
  var interruptBlockquote = Parser.prototype.interruptBlockquote;
  interruptParagraph.splice(interruptParagraph.indexOf('fencedCode') + 1, 0, ['mdAlert']);
  interruptList.splice(interruptList.indexOf('fencedCode') + 1, 0, ['mdAlert']);
  interruptBlockquote.splice(interruptBlockquote.indexOf('fencedCode') + 1, 0, ['mdAlert']);
};
