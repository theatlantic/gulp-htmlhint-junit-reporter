'use strict';

module.exports = function xmlEscape(s, isCData) {
  if (isCData) {
    return (`${s}`).replace(/(<!\[CDATA\[|\]\]>)/g, (m) => {
      return `]]>${xmlEscape(m)}<![CDATA[`;
    });
  } else {
    /* eslint no-control-regex: 0 */
    return (`${s}`).replace(/[<>&"'\x00-\x1F\x7F\u0080-\uFFFF]/g, c => {
      switch (c) {
        case '<':
          return '&lt;';
        case '>':
          return '&gt;';
        case '&':
          return '&amp;';
        case '"':
          return '&quot;';
        case '\'':
          return '&apos;';
        default:
          return `&#${c.charCodeAt(0)};`;
      }
    });
  }
};
