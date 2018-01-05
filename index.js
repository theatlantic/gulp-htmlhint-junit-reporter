/**
 * Shamelessly borrowed from eslint's junit formatter
 *
 * @author Jamund Ferguson
 */
'use strict';

const fs = require('fs');
const xmlEscape = require('./lib/xml-escape');
const gutil = require('gulp-util');


function formatError(error) {
  const line = error.line;
  const col = error.col;
  const {red, yellow, bold} = gutil.colors;
  let evidence = error.evidence;

  let detail = yellow('L' + line) + red(':') + yellow('C' + col);
  /* istanbul ignore if */
  if (col > evidence.length) {
    evidence = bold.red(evidence + ' ');
  } else {
    evidence = evidence.slice(0, col - 1) + bold.red(evidence[col - 1]) + evidence.slice(col);
  }

  return {
    error: `${red('[')}${detail}${red(']')} ${yellow(error.message)} (${error.rule.id})`,
    evidence: evidence
  };
}



module.exports = function htmlhintJunitFormatter(outFile) {
  return function(file) {
    let output = '';

    output += '<?xml version=\'1.0\' encoding=\'utf-8\'?>\n';
    output += '<testsuites>\n';

    const messages = file.htmlhint.messages;

    const errors = messages.reduce((group, msg) => {
      group[msg.file] = group[msg.file] || [];
      group[msg.file].push(msg.error);
      return group;
    }, {});

    Object.entries(errors).forEach(([file, errors]) => {
      output += `<testsuite package="org.htmlhint" time="0" tests="${errors.length}" errors="${errors.length}" name="${file}">\n`;
      errors.forEach((error) => {
        const msgType = (error.type === 'error') ? 'Error' : 'Warning';
        const formatted = formatError(error);
        gutil.log(formatted.error);
        gutil.log(formatted.evidence);
        output += `<testcase time="0" name="org.htmlhint.${error.rule.id}">`;
        output += `<failure message="${xmlEscape(error.message)}">`;
        output += '<![CDATA[';
        output += `line ${error.line}, col `;
        output += `${error.col}, ${msgType} - ${xmlEscape(error.message, true)}`;
        output += ` (${error.rule.id})`;
        output += `\n\n${xmlEscape(error.evidence, true)}`;
        output += ']]>';
        output += `</failure>`;
        output += '</testcase>\n';
      });
      output += '</testsuite>\n';
    });

    output += '</testsuites>\n';

    fs.writeFileSync(outFile, output);
  }
}
