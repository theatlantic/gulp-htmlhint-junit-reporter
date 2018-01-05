/* eslint-env node, mocha */
'use strict';

const chai = require('chai');
const expect = chai.expect;
const DOMParser = require('xmldom').DOMParser;

const xmlEscape = require('../lib/xml-escape');

describe('xml-escape', function() {
  it('should escape xml properly', (done) => {
    expect(xmlEscape('<')).to.equal('&lt;');
    expect(xmlEscape('>')).to.equal('&gt;');
    expect(xmlEscape('&')).to.equal('&amp;');
    expect(xmlEscape('"')).to.equal('&quot;');
    expect(xmlEscape('\'')).to.equal('&apos;');
    expect(xmlEscape('\u00a9')).to.equal('&#169;');
    done();
  });

  it('should escape cdata', (done) => {
    expect(xmlEscape('<', true)).to.equal('<');
    const srcText = 'foo <![CDATA[bar]]> baz';
    const escaped = xmlEscape(srcText, true);
    // A simple equality comparison
    expect(escaped).to.equal('foo ]]>&lt;![CDATA[<![CDATA[bar]]>]]&gt;<![CDATA[ baz');
    done();
  });

  it('should escape cdata as valid xml', (done) => {
    const srcText = 'foo <![CDATA[bar]]> baz';
    const escaped = xmlEscape(srcText, true);
    // Test that the parsed dom text equals the original source text
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div><![CDATA[${escaped}]]></div>`, 'text/xml');
    expect(doc.getElementsByTagName('div').length).to.equal(1);
    const div = doc.getElementsByTagName('div')[0];
    expect(div.textContent).to.equal(srcText);
    done();
  });
});
