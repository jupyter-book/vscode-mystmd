// Forked from: https://github.com/microsoft/vscode-markdown-tm-grammar/blob/main/build.js
// Under the MIT license

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { load } from 'js-yaml';

const languages = [
  { name: 'css', language: 'css', identifiers: ['css', 'css.erb'], source: 'source.css' },
  {
    name: 'basic',
    language: 'html',
    identifiers: ['html', 'htm', 'shtml', 'xhtml', 'inc', 'tmpl', 'tpl'],
    source: 'text.html.basic',
  },
  { name: 'ini', language: 'ini', identifiers: ['ini', 'conf'], source: 'source.ini' },
  { name: 'java', language: 'java', identifiers: ['java', 'bsh'], source: 'source.java' },
  { name: 'lua', language: 'lua', identifiers: ['lua'], source: 'source.lua' },
  {
    name: 'makefile',
    language: 'makefile',
    identifiers: ['Makefile', 'makefile', 'GNUmakefile', 'OCamlMakefile'],
    source: 'source.makefile',
  },
  {
    name: 'perl',
    language: 'perl',
    identifiers: ['perl', 'pl', 'pm', 'pod', 't', 'PL', 'psgi', 'vcl'],
    source: 'source.perl',
  },
  {
    name: 'r',
    language: 'r',
    identifiers: ['R', 'r', 's', 'S', 'Rprofile', '\\{\\.r.+?\\}'],
    source: 'source.r',
  },
  {
    name: 'ruby',
    language: 'ruby',
    identifiers: [
      'ruby',
      'rb',
      'rbx',
      'rjs',
      'Rakefile',
      'rake',
      'cgi',
      'fcgi',
      'gemspec',
      'irbrc',
      'Capfile',
      'ru',
      'prawn',
      'Cheffile',
      'Gemfile',
      'Guardfile',
      'Hobofile',
      'Vagrantfile',
      'Appraisals',
      'Rantfile',
      'Berksfile',
      'Berksfile.lock',
      'Thorfile',
      'Puppetfile',
    ],
    source: 'source.ruby',
  },
  // 	Left to its own devices, the PHP grammar will match HTML as a combination of operators
  // and constants. Therefore, HTML must take precedence over PHP in order to get proper
  // syntax highlighting.
  {
    name: 'php',
    language: 'php',
    identifiers: ['php', 'php3', 'php4', 'php5', 'phpt', 'phtml', 'aw', 'ctp'],
    source: ['text.html.basic', 'source.php'],
  },
  { name: 'sql', language: 'sql', identifiers: ['sql', 'ddl', 'dml'], source: 'source.sql' },
  { name: 'vs_net', language: 'vs_net', identifiers: ['vb'], source: 'source.asp.vb.net' },
  {
    name: 'xml',
    language: 'xml',
    identifiers: ['xml', 'xsd', 'tld', 'jsp', 'pt', 'cpt', 'dtml', 'rss', 'opml'],
    source: 'text.xml',
  },
  { name: 'xsl', language: 'xsl', identifiers: ['xsl', 'xslt'], source: 'text.xml.xsl' },
  { name: 'yaml', language: 'yaml', identifiers: ['yaml', 'yml'], source: 'source.yaml' },
  {
    name: 'dosbatch',
    language: 'dosbatch',
    identifiers: ['bat', 'batch'],
    source: 'source.batchfile',
  },
  {
    name: 'clojure',
    language: 'clojure',
    identifiers: ['clj', 'cljs', 'clojure'],
    source: 'source.clojure',
  },
  {
    name: 'coffee',
    language: 'coffee',
    identifiers: ['coffee', 'Cakefile', 'coffee.erb'],
    source: 'source.coffee',
  },
  { name: 'c', language: 'c', identifiers: ['c', 'h'], source: 'source.c' },
  {
    name: 'cpp',
    language: 'cpp',
    identifiers: ['cpp', 'c\\+\\+', 'cxx'],
    source: 'source.cpp',
    additionalContentName: ['source.cpp'],
  },
  { name: 'diff', language: 'diff', identifiers: ['patch', 'diff', 'rej'], source: 'source.diff' },
  {
    name: 'dockerfile',
    language: 'dockerfile',
    identifiers: ['dockerfile', 'Dockerfile'],
    source: 'source.dockerfile',
  },
  { name: 'git_commit', identifiers: ['COMMIT_EDITMSG', 'MERGE_MSG'], source: 'text.git-commit' },
  { name: 'git_rebase', identifiers: ['git-rebase-todo'], source: 'text.git-rebase' },
  { name: 'go', language: 'go', identifiers: ['go', 'golang'], source: 'source.go' },
  { name: 'groovy', language: 'groovy', identifiers: ['groovy', 'gvy'], source: 'source.groovy' },
  { name: 'pug', language: 'pug', identifiers: ['jade', 'pug'], source: 'text.pug' },

  {
    name: 'js',
    language: 'javascript',
    identifiers: ['js', 'jsx', 'javascript', 'es6', 'mjs', 'cjs', 'dataviewjs', '\\{\\.js.+?\\}'],
    source: 'source.js',
  },
  { name: 'js_regexp', identifiers: ['regexp'], source: 'source.js.regexp' },
  {
    name: 'json',
    language: 'json',
    identifiers: [
      'json',
      'json5',
      'sublime-settings',
      'sublime-menu',
      'sublime-keymap',
      'sublime-mousemap',
      'sublime-theme',
      'sublime-build',
      'sublime-project',
      'sublime-completions',
    ],
    source: 'source.json',
  },
  { name: 'jsonc', language: 'jsonc', identifiers: ['jsonc'], source: 'source.json.comments' },
  { name: 'less', language: 'less', identifiers: ['less'], source: 'source.css.less' },
  {
    name: 'objc',
    language: 'objc',
    identifiers: ['objectivec', 'objective-c', 'mm', 'objc', 'obj-c', 'm', 'h'],
    source: 'source.objc',
  },
  { name: 'swift', language: 'swift', identifiers: ['swift'], source: 'source.swift' },
  { name: 'scss', language: 'scss', identifiers: ['scss'], source: 'source.css.scss' },

  {
    name: 'perl6',
    language: 'perl6',
    identifiers: ['perl6', 'p6', 'pl6', 'pm6', 'nqp'],
    source: 'source.perl.6',
  },
  {
    name: 'powershell',
    language: 'powershell',
    identifiers: ['powershell', 'ps1', 'psm1', 'psd1', 'pwsh'],
    source: 'source.powershell',
  },
  {
    name: 'python',
    language: 'python',
    identifiers: [
      'python',
      'py',
      'py3',
      'rpy',
      'pyw',
      'cpy',
      'SConstruct',
      'Sconstruct',
      'sconstruct',
      'SConscript',
      'gyp',
      'gypi',
      '\\{\\.python.+?\\}',
    ],
    source: 'source.python',
  },
  {
    name: 'julia',
    language: 'julia',
    identifiers: ['julia', '\\{\\.julia.+?\\}'],
    source: 'source.julia',
  },
  { name: 'regexp_python', identifiers: ['re'], source: 'source.regexp.python' },
  {
    name: 'rust',
    language: 'rust',
    identifiers: ['rust', 'rs', '\\{\\.rust.+?\\}'],
    source: 'source.rust',
  },
  { name: 'scala', language: 'scala', identifiers: ['scala', 'sbt'], source: 'source.scala' },
  {
    name: 'shell',
    language: 'shellscript',
    identifiers: [
      'shell',
      'sh',
      'bash',
      'zsh',
      'bashrc',
      'bash_profile',
      'bash_login',
      'profile',
      'bash_logout',
      '.textmate_init',
      '\\{\\.bash.+?\\}',
    ],
    source: 'source.shell',
  },
  { name: 'ts', language: 'typescript', identifiers: ['typescript', 'ts'], source: 'source.ts' },
  { name: 'tsx', language: 'typescriptreact', identifiers: ['tsx'], source: 'source.tsx' },
  { name: 'csharp', language: 'csharp', identifiers: ['cs', 'csharp', 'c#'], source: 'source.cs' },
  {
    name: 'fsharp',
    language: 'fsharp',
    identifiers: ['fs', 'fsharp', 'f#'],
    source: 'source.fsharp',
  },
  { name: 'dart', language: 'dart', identifiers: ['dart'], source: 'source.dart' },
  {
    name: 'handlebars',
    language: 'handlebars',
    identifiers: ['handlebars', 'hbs'],
    source: 'text.html.handlebars',
  },
  {
    name: 'markdown',
    language: 'markdown',
    identifiers: ['markdown', 'md'],
    source: 'text.html.markdown',
  },
  { name: 'log', language: 'log', identifiers: ['log'], source: 'text.log' },
  { name: 'erlang', language: 'erlang', identifiers: ['erlang'], source: 'source.erlang' },
  { name: 'elixir', language: 'elixir', identifiers: ['elixir'], source: 'source.elixir' },
  { name: 'latex', language: 'latex', identifiers: ['latex', 'tex'], source: 'text.tex.latex' },
  { name: 'bibtex', language: 'bibtex', identifiers: ['bibtex'], source: 'text.bibtex' },
  { name: 'twig', language: 'twig', identifiers: ['twig'], source: 'source.twig' },
];

const fencedCodeBlockDefinition = (
  name,
  identifiers,
  sourceScope,
  language,
  additionalContentName,
) => {
  if (!Array.isArray(sourceScope)) {
    sourceScope = [sourceScope];
  }

  language = language || name;

  const scopes = sourceScope.map((scope) => ({ include: scope }));

  let contentName = `meta.embedded.block.${language}`;
  if (additionalContentName) {
    contentName += ` ${additionalContentName.join(' ')}`;
  }

  return [
    `fenced_code_block_${name}`,
    {
      name: 'markup.fenced_code.block.markdown',
      begin: `(^|\\G)(\\s*)(\`{3,}|~{3,})\\s*(?i:(${identifiers.join(
        '|',
      )})((\\s+|:|,|\\{|\\?)[^\`]*)?$)`,
      beginCaptures: {
        3: { name: 'punctuation.definition.markdown' },
        4: { name: 'fenced_code.block.language.markdown' },
        5: { name: 'fenced_code.block.language.attributes.markdown' },
      },
      end: '(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$',
      endCaptures: {
        3: { name: 'punctuation.definition.markdown' },
      },
      patterns: [
        {
          begin: '(^|\\G)(\\s*)(.*)',
          while: '(^|\\G)(?!\\s*([`~]{3,})\\s*$)',
          contentName: `${contentName}`,
          patterns: scopes,
        },
      ],
    },
  ];
};

const fencedCodeBlockDefinitions = () =>
  Object.fromEntries(
    languages.map((language) =>
      fencedCodeBlockDefinition(
        language.name,
        language.identifiers,
        language.source,
        language.language,
        language.additionalContentName,
      ),
    ),
  );

const fencedCodeBlockIncludes = () =>
  languages.map((language) => ({ include: `#fenced_code_block_${language.name}` }));

const codeCellDefinition = (name, identifiers, sourceScope, language, additionalContentName) => {
  if (!Array.isArray(sourceScope)) {
    sourceScope = [sourceScope];
  }

  language = language || name;

  const scopes = sourceScope.map((scope) => ({ include: scope }));

  let contentName = `meta.embedded.block.${language}`;
  if (additionalContentName) {
    contentName += ` ${additionalContentName.join(' ')}`;
  }

  return [
    `code_cell_${name}`,
    {
      name: 'meta.block.code-cell.myst',
      begin: `(^|\\G)([ ]{0,3})([\`:]{3,})(\\{(?:code|code-cell|code-block|sourcecode)\\})\\s*(?i:(${identifiers.join('|')}))`,
      beginCaptures: {
        1: { name: 'punctuation.definition.block.myst' },
        4: { name: 'entity.name.function' },
        5: { name: 'string.unquoted.attribute.myst' },
      },
      end: '(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$',
      endCaptures: {
        3: { name: 'punctuation.definition.block.myst' },
      },
      patterns: [
        {
          name: 'meta.block.attribute.myst',
          match: '^\\s*:([a-zA-Z][\\:\\-\\_0-9a-zA-Z]*):\\s*(.*)$',
          captures: {
            1: { name: 'variable.parameter' },
            2: { name: 'string.unquoted.attribute.myst' },
          },
        },
        {
          begin: '(^|\\G)(\\s*)(.*)',
          while: '(^|\\G)(?!\\s*([`:]{3,})\\s*$)',
          contentName: `${contentName}`,
          patterns: scopes,
        },
      ],
    },
  ];
};

const codeCellDefinitions = () =>
  Object.fromEntries(
    languages.map((language) =>
      codeCellDefinition(
        language.name,
        language.identifiers,
        language.source,
        language.language,
        language.additionalContentName,
      ),
    ),
  );

const codeCellIncludes = () =>
  languages.map((language) => ({ include: `#code_cell_${language.name}` }));

const buildGrammar = () => {
  const syntaxDir = join(dirname(import.meta.url), 'syntaxes').replace('file:', '');
  const raw = load(readFileSync(join(syntaxDir, 'myst.tmLanguage.yml')).toString());
  const data = {
    $schema: 'https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json',
    ...raw,
    repository: {
      ...raw.repository,
      ...fencedCodeBlockDefinitions(),
      fenced_code_block: {
        patterns: [...fencedCodeBlockIncludes(), { include: '#fenced_code_block_unknown' }],
      },
      ...codeCellDefinitions(),
      code_cell: {
        patterns: [...codeCellIncludes(), { include: '#code_cell_unknown' }],
      },
    },
  };
  const out = JSON.stringify(data, null, 2);
  writeFileSync(join(syntaxDir, 'myst.tmLanguage.json'), out);
};

buildGrammar();
