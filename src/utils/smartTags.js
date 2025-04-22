const codePatterns = {
  loops: {
    patterns: {
      javascript: [/for\s*\(/, /while\s*\(/, /do\s*\{/, /forEach\s*\(/, /for\s+of\s+/, /for\s+in\s+/],
      python: [/for\s+\w+\s+in/, /while\s+\w+:/, /for\s+\w+\s+in\s+range/],
      java: [/for\s*\(/, /while\s*\(/, /do\s*\{/, /forEach\s*\(/, /for\s+\(.*:\s*\w+\s*\)/],
      cpp: [/for\s*\(/, /while\s*\(/, /do\s*\{/, /for\s+\(.*:\s*\w+\s*\)/],
      php: [/for\s*\(/, /while\s*\(/, /foreach\s*\(/, /do\s*\{/],
      ruby: [/for\s+\w+\s+in/, /while\s+\w+/, /each\s*do/, /each\s*\{/],
      html: [/<for\s+/, /<while\s+/, /<each\s+/],
      css: [/@for\s+/, /@while\s+/]
    },
    tag: 'loop'
  },
  api: {
    patterns: {
      javascript: [/fetch\s*\(/, /axios\./, /XMLHttpRequest/, /\.get\s*\(/, /\.post\s*\(/, /\.put\s*\(/, /\.delete\s*\(/, /\.patch\s*\(/],
      python: [/requests\./, /urllib\./, /http\./, /https\./, /aiohttp\./],
      java: [/HttpClient/, /HttpURLConnection/, /RestTemplate/, /WebClient/, /\.get\s*\(/, /\.post\s*\(/],
      cpp: [/curl_/, /httplib::/, /http::/, /https::/],
      php: [/curl_/, /file_get_contents\s*\(/, /http_build_query/],
      ruby: [/Net::HTTP/, /Faraday\./, /HTTParty\./],
      html: [/<form\s+action=/, /<a\s+href=/, /<img\s+src=/],
      css: [/@import/, /url\s*\(/]
    },
    tag: 'api'
  },
  errorHandling: {
    patterns: {
      javascript: [/try\s*\{/, /catch\s*\(/, /finally\s*\{/, /throw\s+/, /\.catch\s*\(/],
      python: [/try:/, /except\s+\w+:/, /finally:/, /raise\s+/],
      java: [/try\s*\{/, /catch\s*\(/, /finally\s*\{/, /throw\s+/, /throws\s+/],
      cpp: [/try\s*\{/, /catch\s*\(/, /throw\s+/],
      php: [/try\s*\{/, /catch\s*\(/, /throw\s+/],
      ruby: [/begin/, /rescue\s+\w+/, /ensure/, /raise\s+/],
      html: [/<error\s+/, /<exception\s+/],
      css: [/@error/, /@warn/]
    },
    tag: 'error-handling'
  },
  arrayOps: {
    patterns: {
      javascript: [/\.map\s*\(/, /\.filter\s*\(/, /\.reduce\s*\(/, /\.find\s*\(/, /\.some\s*\(/, /\.every\s*\(/, /\.sort\s*\(/, /\.slice\s*\(/, /\.splice\s*\(/],
      python: [/map\s*\(/, /filter\s*\(/, /reduce\s*\(/, /list\.append/, /list\.extend/, /list\.sort/, /list\.reverse/],
      java: [/stream\s*\(\s*\)\.map/, /stream\s*\(\s*\)\.filter/, /stream\s*\(\s*\)\.reduce/, /Arrays\./, /Collections\./],
      cpp: [/std::transform/, /std::for_each/, /std::accumulate/, /std::vector::push_back/, /std::sort/],
      php: [/array_map/, /array_filter/, /array_reduce/, /array_push/, /array_pop/],
      ruby: [/map\s*\{/, /select\s*\{/, /reduce\s*\{/, /each\s*\{/, /sort\s*\{/],
      html: [/<ul>/, /<ol>/, /<li>/],
      css: [/display:\s*flex/, /display:\s*grid/, /grid-template/]
    },
    tag: 'array-ops'
  },
  debugging: {
    patterns: {
      javascript: [/console\.log\s*\(/, /console\.error\s*\(/, /console\.warn\s*\(/, /console\.debug\s*\(/, /debugger;/],
      python: [/print\s*\(/, /logging\./, /pdb\.set_trace\s*\(/],
      java: [/System\.out\.println/, /Logger\./, /log\./],
      cpp: [/std::cout/, /std::cerr/, /printf\s*\(/],
      php: [/echo\s+/, /print_r\s*\(/, /var_dump\s*\(/],
      ruby: [/puts\s+/, /print\s+/, /p\s+/, /logger\./],
      html: [/<!--\s*debug/, /data-debug=/],
      css: [/outline:\s*/, /border:\s*red/]
    },
    tag: 'debugging'
  },
  async: {
    patterns: {
      javascript: [/async\s+function/, /await\s+/, /Promise\./, /\.then\s*\(/],
      python: [/async\s+def/, /await\s+/, /asyncio\./],
      java: [/CompletableFuture\./, /Future\./, /async\s+/],
      cpp: [/std::async/, /std::future/, /std::promise/],
      php: [/async\s+function/, /await\s+/, /Promise\./],
      ruby: [/async\s+def/, /await\s+/, /Concurrent::/],
      html: [/<script\s+async/, /<script\s+defer/],
      css: [/@keyframes/, /animation:/]
    },
    tag: 'async'
  },
  dom: {
    patterns: {
      javascript: [/document\./, /\.querySelector\s*\(/, /\.getElementById\s*\(/, /\.addEventListener\s*\(/, /\.innerHTML/, /\.appendChild\s*\(/],
      python: [/selenium\./, /beautifulsoup\./, /lxml\./],
      java: [/Document\./, /Element\./, /Node\./],
      cpp: [/DOMDocument/, /DOMElement/, /DOMNode/],
      php: [/DOMDocument/, /DOMElement/, /DOMNode/],
      ruby: [/Nokogiri::/, /Mechanize\./],
      html: [/<div>/, /<span>/, /<p>/, /<h[1-6]>/, /<a>/, /<img>/],
      css: [/\./, /#/, /\[/, /:/, /::/]
    },
    tag: 'dom'
  }
};

export const generateSmartTags = (code, language = 'javascript') => {
  const tags = new Set();
  
  // Check each pattern category
  Object.values(codePatterns).forEach(({ patterns, tag }) => {
    const languagePatterns = patterns[language] || patterns.javascript; // Fallback to JavaScript patterns if language not found
    const hasPattern = languagePatterns.some(pattern => pattern.test(code));
    if (hasPattern) {
      tags.add(tag);
    }
  });

  return Array.from(tags);
};

export const getTagColor = (tag) => {
  const tagColors = {
    'loop': 'blue',
    'api': 'green',
    'error-handling': 'red',
    'array-ops': 'purple',
    'debugging': 'yellow',
    'async': 'teal',
    'dom': 'orange'
  };

  return tagColors[tag] || 'gray';
}; 