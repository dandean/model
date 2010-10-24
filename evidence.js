/*  evidence.js, version 0.6
 *
 *  Copyright (c) 2009 Tobie Langel (http://tobielangel.com)
 *
 *  evidence.js is freely distributable under the terms of an MIT-style license.
 *--------------------------------------------------------------------------*/

(function(global) {
  var originalEvidence = global.Evidence,
      originalOnload   = global.onload;

  function Evidence() {
    TestCase.extend.apply(TestCase, arguments);
  }

  function noConflict() {
    global.Evidence = originalEvidence;
    return Evidence;
  }

  Evidence.noConflict = noConflict;
  Evidence.VERSION    = '0.6';

var FILE_REGEXP = /.*?\/(\w+\.html)(.*)/;

function getNameFromFile() {
  return (global.location || '').toString().replace(FILE_REGEXP, '$1');
}

function chain(subclass, superclass) {
  function Subclass() {}
  Subclass.prototype = superclass.prototype;
  subclass.prototype = new Subclass();
  subclass.prototype.constructor = subclass;
  return subclass;
}

function defer(block, context) {
  if ('setTimeout' in global) {
    global.setTimeout(function() {
      block.call(context);
    }, 0);
  } else {
    block.call(context);
  }
}
function AssertionSkippedError(message) {
  this.message = message;
}

AssertionSkippedError.displayName = 'AssertionSkippedError';

(function(p) {
  p.name = 'AssertionSkippedError';
})(AssertionSkippedError.prototype);
Evidence.AssertionSkippedError = AssertionSkippedError;
function AssertionFailedError(message, template, args) {
  this.message = message;
  this.template = template || '';
  this.args = args;
}

AssertionFailedError.displayName = 'AssertionFailedError';

(function(p) {
  p.name = 'AssertionFailedError';
})(AssertionFailedError.prototype);
Evidence.AssertionFailedError = AssertionFailedError;
function AssertionMessage(message, template, args) {
  this.message = message.replace(/%/g, '%%');
  this.template = template || '';
  this.args = args;
}

AssertionMessage.displayName = 'AssertionMessage';

(function(p) {
  function toString() {
    return UI.printf(this.message + this.template, this.args);
  }
  p.toString = toString;
})(AssertionMessage.prototype);
Evidence.AssertionMessage = AssertionMessage;

var Assertions = (function() {
  function _assertExpression(expression, message, template) {
    if (expression) {
      this.addAssertion();
    } else {
      var args = Array.prototype.slice.call(arguments, 3);
      throw new AssertionFailedError(message, template, args);
    }
  }

  function skip(message) {
    throw new AssertionSkippedError(message || 'Skipped!');
  }

  function fail(message) {
    this._assertExpression(false, message || 'Flunked!');
  }

  function assert(test, message) {
    this._assertExpression(
      !!test,
      message || 'Failed assertion.',
      'Expected %o to evaluate to true.', test
    );
  }

  function refute(test, message) {
    this._assertExpression(
      !test,
      message || 'Failed refutation.',
      'Expected %o to evaluate to false.', test
    );
  }

  function assertTrue(test, message) {
    this._assertExpression(
      (test === true),
      message || 'Failed assertion.',
      'Expected %o to be true.', test
    );
  }

  function refuteTrue(test, message) {
    this._assertExpression(
      (test !== true),
      message || 'Failed refutation.',
      'Expected %o to not be true.', test
    );
  }

  function assertNull(test, message) {
    this._assertExpression(
      (test === null),
      message || 'Failed assertion.',
      'Expected %o to be null.', test
    );
  }

  function refuteNull(test, message) {
    this._assertExpression(
      (test !== null),
      message || 'Failed refutation.',
      'Expected %o to not be null.', test
    );
  }

  function assertUndefined(test, message) {
    this._assertExpression(
      (typeof test === 'undefined'),
      message || 'Failed assertion.',
      'Expected %o to be undefined.', test
    );
  }

  function refuteUndefined(test, message) {
    this._assertExpression(
      (typeof test !== 'undefined'),
      message || 'Failed refutation.',
      'Expected %o to not be undefined.', test
    );
  }

  function assertFalse(test, message) {
    this._assertExpression(
      (test === false),
      message || 'Failed assertion.',
      'Expected %o to be false.', test
    );
  }

  function refuteFalse(test, message) {
    this._assertExpression(
      (test !== false),
      message || 'Failed refutation.',
      'Expected %o to not be false.', test
    );
  }

  function assertEqual(expected, actual, message) {
    this._assertExpression(
      (expected == actual),
      message || 'Failed assertion.',
      'Expected %o to be == to %o.', actual, expected
    );
  }

  function refuteEqual(expected, actual, message) {
    this._assertExpression(
      (expected != actual),
      message || 'Failed refutation.',
      'Expected %o to be != to %o.', actual, expected
    );
  }

  function assertIdentical(expected, actual, message) {
    this._assertExpression(
      (expected === actual),
      message || 'Failed assertion.',
      'Expected %o to be === to %o.', actual, expected
    );
  }

  function refuteIdentical(expected, actual, message) {
    this._assertExpression(
      (expected !== actual),
      message || 'Failed refutation.',
      'Expected %o to be !== to %o.', actual, expected
    );
  }

  function assertIn(property, object, message) {
    this._assertExpression(
      (property in object),
      message || 'Failed assertion.',
      'Expected "%s" to be a property of %o.', property, object
    );
  }

  function refuteIn(property, object, message) {
    this._assertExpression(
      !(property in object),
      message || 'Failed refutation.',
      'Expected "%s" to not be a property of %o.', property, object
    );
  }

  function assertError(func, message) {
    var throwsError = false;
    try {
      func();
    } catch (e) {
      throwsError = true;
    }
    this._assertExpression(
      throwsError === true, message || 'Failed assertion.',
      'Expected function "%s" to throw an error.', func
    );
  }

  function assertNoError(func, message) {
    var throwsError = false;
    try {
      func();
    } catch (e) {
      throwsError = true;
    }
    this._assertExpression(
      throwsError === false, message || 'Failed assertion.',
      'Did not expect function "%s" to throw an error.', func
    );
  }

  return {
    _assertExpression: _assertExpression,
    skip: skip,
    assert: assert,
    refute: refute,
    assertNot: refute,
    assertTrue: assertTrue,
    assertNull: assertNull,
    assertUndefined: assertUndefined,
    assertFalse: assertFalse,
    assertIdentical: assertIdentical,
    refuteIdentical: refuteIdentical,
    assertEqual: assertEqual,
    refuteEqual: refuteEqual,
    assertIn: assertIn,
    refuteIn: refuteIn,
    fail: fail,
    flunk: fail,
    assertError: assertError,
    assertNoError: assertNoError
  };
})();
  Evidence.Assertions = Assertions;
function TestCase(methodName) {
  this._methodName = methodName;
  this.name = methodName;
}

(function() {
  function extend(name, methods) {
    function TestCaseSubclass(methodName) {
      TestCase.call(this, methodName);
    }

    if (!methods) {
      methods = name;
      name = getNameFromFile();
    }

    chain(TestCaseSubclass, this);
    TestCaseSubclass.displayName = name;
    TestCaseSubclass.extend = extend;

    for(var prop in methods) {
      TestCaseSubclass.prototype[prop] = methods[prop];
    }
    TestCase.subclasses.push(TestCaseSubclass);
    return TestCaseSubclass;
  }

  function AssertionsMixin() {}
  AssertionsMixin.prototype = Assertions;
  TestCase.prototype = new AssertionsMixin();
  TestCase.constructor = TestCase;

  TestCase.displayName = 'TestCase';
  TestCase.extend      = extend;
  TestCase.subclasses  = [];
  TestCase.defaultTimeout = 10000;
})();

(function(p) {

  function run(result, callback) {
    this._result = result;
    this._callback = callback || function() {};
    defer(function() { this.next(result); }, this);
  }

  function next(result) {
    try {
      if (this._nextAssertions) {
        result.resumeTest(this);
        this._nextAssertions(this);
      } else {
        result.startTest(this);
        this.setUp(this);
        this[this._methodName](this);
      }
    } catch(e) {
      this._filterException(e);
    } finally {
      if (this._paused) {
        result.pauseTest(this);
      } else {
        try {
          this.tearDown(this);
        } catch(e) {
          this._filterException(e);
        } finally {
          this._nextAssertions = null;
          result.stopTest(this);
          this._callback(result);
        }
      }
    }
  }

  function _filterException(e) {
    var name = e.name,
        result = this._result;
    switch(name) {
      case 'AssertionFailedError':
        result.addFailure(this, e);
        break;
      case 'AssertionSkippedError':
        result.addSkip(this, e);
        break;
      default:
        result.addError(this, e);
    }
  }

  function pause(assertions) {
    var self = this;
    this._paused = true;
    if (assertions) { self._nextAssertions = assertions; }
    self._timeoutId = global.setTimeout(function() {
      self.resume(function() {
        self.fail('Test timed out. Testing was not resumed after being paused.');
      });
    }, TestCase.defaultTimeout);
  }

  function resume(assertions) {
    if (this._paused) { // avoid race conditions
      this._paused = false;
      global.clearTimeout(this._timeoutId);
      if (assertions) { this._nextAssertions = assertions; }
      this.next(this._result);
    }
  }

  function size() {
    return 1;
  }

  function toString() {
    return this.constructor.displayName + '#' + this.name;
  }

  function addAssertion() {
    this._result.addAssertion();
  }

  p.run              = run;
  p.next             = next;
  p.addAssertion     = addAssertion;
  p._filterException = _filterException;
  p.pause            = pause;
  p.resume           = resume;
  p.size             = size;
  p.toString         = toString;
  p.setUp            = function() {};
  p.tearDown         = function() {};
})(TestCase.prototype);
  Evidence.TestCase = TestCase;
function TestSuite(name, tests) {
  this.name = name;
  this._tests = [];
  if (tests) {
    this.push.apply(this, tests);
  }
}

TestSuite.displayName = 'TestSuite';

(function(p) {
  function run(result, callback) {
    this._index = 0;
    this._callback = callback || function() {};
    result.startSuite(this);
    this.next(result);
    return result;
  }

  function next(result) {
    var self = this,
        next = self._tests[self._index];
    if (next) {
      self._index++;
      next.run(result, function(result) {
        self.next(result);
      });
    } else {
      result.stopSuite(self);
      self._callback(result);
    }
  }

  function push() {
    for (var i = 0, length = arguments.length; i < length; i++) {
      this._tests.push(arguments[i]);
    }
  }

  function addTest(test) {
    this._tests.push(test);
  }

  function addTests(tests) {
    for (var i = 0, length = tests.length; i < length; i++) {
      this._tests.push(tests[i]);
    }
  }

  function size() {
    var tests  = this._tests,
        length = tests.length,
        sum    = 0;

    for (var i = 0; i < length; i++) {
      sum += tests[i].size();
    }
    return sum;
  }

  function isEmpty() {
    return this.size() === 0;
  }

  function toString() {
    return this.name;
  }

  p.run  = run;
  p.next = next;
  p.push = push;
  p.size = size;
  p.isEmpty = isEmpty;
  p.toString = toString;
})(TestSuite.prototype);
  Evidence.TestSuite = TestSuite;
function TestRunner() {
}

TestRunner.displayName = 'TestRunner';

(function(p) {
  function run(suite) {
    var self = this,
        result = self._makeResult();
    Evidence.currentResult = result;
    this._suite = suite;
    self.start(result);
    suite.run(result, function(result) {
      self.stop(result);
    });
    return result;
  }

  function _makeResult() {
    return new TestResult();
  }

  function start(result) {
    result.start();
  }

  function stop(result) {
    result.stop();
  }

  p.start = start;
  p.stop = stop;
  p.run = run;
  p._makeResult = _makeResult;
})(TestRunner.prototype);
  Evidence.TestRunner = TestRunner;
function TestLoader() {
}

TestLoader.displayName = 'TestLoader';

(function(p) {
  function loadTestsFromTestCase(testcaseClass) {
    var suite = new TestSuite(testcaseClass.displayName),
        props = this.getTestCaseNames(testcaseClass);
    for (var i=0; i < props.length; i++) {
      suite.push(new testcaseClass(props[i]));
    }
    return suite;
  }

  function loadTestsFromTestCases(testcases) {
    var suite = new TestSuite(getNameFromFile());
    for (var i = 0; i < testcases.length; i++) {
      var testcase = testcases[i];
      var subSuite = defaultLoader.loadTestsFromTestCase(testcase);
      if (!subSuite.isEmpty()) { suite.push(subSuite); }
    }
    return suite;
  }

  function getTestCaseNames(testcaseClass) {
    var results = [],
        proto = testcaseClass.prototype,
        prefix = this.testMethodPrefix;

    for (var property in proto) {
      if (property.indexOf(prefix) === 0) {
        results.push(property);
      }
    }
    return results.sort();
  }

  function loadRegisteredTestCases() {
    return loadTestsFromTestCases(TestCase.subclasses);
  }

  p.loadTestsFromTestCase = loadTestsFromTestCase;
  p.loadRegisteredTestCases = loadRegisteredTestCases;
  p.loadTestsFromTestCases = loadTestsFromTestCases;
  p.testMethodPrefix = 'test';
  p.getTestCaseNames = getTestCaseNames;

})(TestLoader.prototype);
  Evidence.TestLoader = TestLoader;
function AutoRunner() {
  if (global.console && global.console.log) {
    this.logger = Logger;
  } else if (Object.prototype.toString.call(global.environment) === '[object Environment]' && global.print) {
    this.logger = CommandLineLogger;
  } else {
    this.logger = PopupLogger;
  }
  this.autoRun   = true;
  this.verbosity = Logger.INFO;
  this.runner    = ConsoleTestRunner;
}

(function() {
  function run(options) {
    var autoRunner = new this();
    options = options || autoRunner.retrieveOptions();
    autoRunner.processOptions(options);
    if (autoRunner.autoRun) { autoRunner.run() };
  }

  AutoRunner.run = run;
  AutoRunner.displayName = 'AutoRunner';
  AutoRunner.LOGGERS = {
    console:      Logger,
    popup:        PopupLogger,
    command_line: CommandLineLogger
  };

  AutoRunner.RUNNERS = {
    console: ConsoleTestRunner
  };
})();

(function(p) {
  function run() {
    var logger = new this.logger(this.verbosity),
        runner = new this.runner(logger),
        suite = defaultLoader.loadRegisteredTestCases();
    if (suite._tests.length <= 1) {
      suite = suite._tests[0];
    }
    return runner.run(suite);
  }

  function processQueryString(str) {
    var results = {};
    str = (str + '').match(/^(?:[^?#]*\?)([^#]+?)(?:#.*)?$/);
    str = str && str[1];

    if (!str) { return results; }

    var pairs = str.split('&'),
        length = pairs.length;
    if (!length) { return results; }

    for (var i = 0; i < length; i++) {
      var pair  = pairs[i].split('='),
          key   = decodeURIComponent(pair[0]),
          value = pair[1];
      value = value ? decodeURIComponent(value) : true;
      results[key] = value;
    }
    return results;
  }

  function processArguments(args) { // RHINO
    var results = {};

    for (var i = 0; i < args.length; i++) {
      var arg = args[i];
      if (arg.indexOf('-') === 0) {
        var value = args[i + 1];
        if (value && value.indexOf('-') !== 0) {
          i++;
        } else {
          value = true;
        }
        results[arg.substr(1)] = value;
      }
    }
    return results;
  }

  function retrieveOptions() {
    if (global.location) {
      return this.processQueryString(global.location);
    }
    if (global.arguments) {
      return this.processArguments(global.arguments);
    }
    return {};
  }

  function processOptions(options) {
    for(var key in options) {
      var value = options[key];
      switch(key) {
        case 'timeout':
          TestCase.defaultTimeout = global.parseFloat(value) * 1000;
          break;
        case 'run':
          this.autoRun = value === 'false' ? false : true;
          break;
        case 'logger':
          this.logger = AutoRunner.LOGGERS[value];
          break;
        case 'verbosity':
          var i = global.parseInt(value);
          this.verbosity = global.isNaN(i) ? Logger[value] : i;
          break;
        case 'runner':
          this.runner = AutoRunner.RUNNERS[value];
          break;
      }
    }
  }

  p.run = run;
  p.processQueryString = processQueryString;
  p.processArguments = processArguments;
  p.retrieveOptions = retrieveOptions;
  p.processOptions = processOptions;
})(AutoRunner.prototype);
  Evidence.AutoRunner = AutoRunner;
function TestResult() {
  this.testCount      = 0;
  this.assertionCount = 0;
  this.skipCount      = 0;
  this.skips          = [];
  this.failureCount   = 0;
  this.failures       = [];
  this.errors         = [];
  this.errorCount     = 0;
  this.testCount      = 0;
}

TestResult.displayName = 'TestResult';

(function(p) {
  function addAssertion() {
    this.assertionCount++;
  }

  function addSkip(testcase, reason) {
    this.skipCount++;
    this.skips.push(reason);
  }

  function addFailure(testcase, reason) {
    this.failureCount++;
    this.failures.push(reason);
  }

  function addError(testcase, error) {
    this.errorCount++;
    this.errors.push(error);
  }

  function startTest(testcase) {
    this.testCount++;
  }

  function stopTest(testcase) {}

  function pauseTest(testcase) {}

  function resumeTest(testcase) {}

  function startSuite(suite) {}

  function stopSuite(suite) {}

  function loadPage(win) {}

  function startPage(win, suite) {}

  function stopPage(win) {}

  function start(t0) {
    this.t0 = t0;
  }

  function stop(t1) {
    this.t1 = t1;
  }

  function toString() {
    return this.testCount      + ' tests, ' +
           this.assertionCount + ' assertions, ' +
           this.failureCount   + ' failures, ' +
           this.errorCount     + ' errors, ' +
           this.skipCount      + ' skips';
  }

  p.addAssertion  = addAssertion;
  p.addSkip       = addSkip;
  p.addFailure    = addFailure;
  p.addError      = addError;
  p.startTest     = startTest;
  p.stopTest      = stopTest;
  p.pauseTest     = pauseTest;
  p.resumeTest    = resumeTest;
  p.startSuite    = startSuite;
  p.stopSuite     = stopSuite;
  p.loadPage      = loadPage;
  p.startPage     = startPage;
  p.stopPage      = stopPage;
  p.start         = start;
  p.stop          = stop;
  p.toString      = toString;
})(TestResult.prototype);
  Evidence.TestResult = TestResult;
function TestResultTree(name) {
  this.testCount = 0;
  this.assertionCount = 0;
  this.skipCount = 0;
  this.skips = [];
  this.failureCount = 0;
  this.failures = [];
  this.errors = [];
  this.errorCount = 0;
  this.testCount = 0;
  this.name = name;
}

chain(TestResultTree, TestResult);
TestResultTree.displayName = 'TestResultTree';

(function(p) {
  function addAssertion() {
    var node = this.currentNode;
    do {
      node.assertionCount++;
    } while (node = node.parent);
  }

  function addSkip(testcase, reason) {
    var node = this.currentNode;
    do {
      node.skipCount++;
      node.skips.push(reason);
    } while (node = node.parent);
  }

  function addFailure(testcase, reason) {
    var node = this.currentNode;
    do {
      node.failureCount++;
      node.failures.push(reason);
    } while (node = node.parent);
  }

  function addError(testcase, error) {
    var node = this.currentNode;
    do {
      node.errorCount++;
      node.errors.push(error);
    } while (node = node.parent);
  }

  function startTest(testcase) {
    var node = this.createChildNode(testcase.name);
    do {
      node.testCount++;
    } while (node = node.parent);
  }

  function stopTest(testcase) {
    this.currentNode = this.currentNode.parent || this;
  }

  function startSuite(suite) {
    this.createChildNode(suite.name);
  }

  function stopSuite(suite) {
    this.currentNode = this.currentNode.parent || this;
  }

  function start() {
    this.t0 = new Date();
    this.currentNode = this;
  }

  function stop() {
    this.currentNode = null;
    this.t1 = new Date();
  }

  function toString() {
    var results = '';
    if (this.children) {
      results += this.testCount;
      results += ' tests, ';
    }
    return results +
           this.assertionCount + ' assertions, ' +
           this.failureCount   + ' failures, ' +
           this.errorCount     + ' errors, ' +
           this.skipCount      + ' skips';
  }

  function createChildNode(name) {
    var node = new this.constructor(name);
    this.currentNode.appendChild(node);
    this.currentNode = node;
    return node;
  }

  function appendChild(child) {
    this.children = this.children || [];
    this.children.push(child);
    child.parent = this;
  }

  p.createChildNode = createChildNode;
  p.appendChild = appendChild;
  p.addAssertion = addAssertion;
  p.addSkip = addSkip;
  p.addFailure = addFailure;
  p.addError = addError;
  p.startTest = startTest;
  p.stopTest = stopTest;
  p.startSuite = startSuite;
  p.stopSuite = stopSuite;
  p.start = start;
  p.stop = stop;
  p.toString = toString;
})(TestResultTree.prototype);
  Evidence.TestResultTree = TestResultTree;
var Console = {};

function Logger(level) {
  if (typeof level !== 'undefined') {
    this.level = level;
  }
}

Logger.displayName = 'Logger';
Logger.LEVELS = ['NOTSET', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'CRITICAL'];
Logger.CRITICAL = 5;
Logger.ERROR    = 4;
Logger.WARN     = 3;
Logger.INFO     = 2;
Logger.DEBUG    = 1;
Logger.NOTSET   = 0;

(function(p) {
  function critical(template, params) {
    this.log(Logger.CRITICAL, template, params);
  }

  function error(template, params) {
    this.log(Logger.ERROR, template, params);
  }

  function warn(template, params) {
    this.log(Logger.WARN, template, params);
  }

  function info(template, params) {
    this.log(Logger.INFO, template, params);
  }

  function debug(template, params) {
    this.log(Logger.DEBUG, template, params);
  }

  function group(title) {
    this.prefix += '    ';
  }

  function groupEnd() {
    this.prefix = this.prefix.substr(0, this.prefix.length - 4);
  }

  function log(level, template, params) {
    level = level || Logger.NOTSET;
    var c = global.console;

    var method = Logger.LEVELS[level].toLowerCase();
    if (method === 'critical') { method = 'error'; }
    method = (method in c) ? method : 'log';
    template = this.prefix + template;
    if (level >= this.level) {
      if (params) {
        params = params.slice(0);
        params.unshift(template);
        c[method].apply(c, params);
      } else {
        c[method](template);
      }
    }
  }

  p.prefix   = '';
  p.group    = group;
  p.groupEnd = groupEnd;
  p.log      = log;
  p.critical = critical;
  p.error    = error;
  p.warn     = warn;
  p.info     = info;
  p.debug    = debug;
  p.level    = 0;
})(Logger.prototype);
Console.Logger = Logger;
function PopupLogger(level) {
  Logger.call(this, level);
}

chain(PopupLogger, Logger);
PopupLogger.displayName = 'PopupLogger';

(function(p) {
  var BASIC_STYLES = 'color: #333; background-color: #fff; font-family: monospace; border-bottom: 1px solid #ccc;';
  var STYLES = {
    WARN:     'color: #000; background-color: #fc6;',
    ERROR:    'color: #f00; background-color: #fcc;',
    CRITICAL: 'color: #fff; background-color: #000;'
  };

  function _cleanup(html) {
    return html.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&').replace(/[\n\r]+/, '<br />');
  }

  function _makePopup() {
    var popup = global.open('','popup','height=400,width=400');
    var doc = popup.document;
    doc.write('<!doctype html>\
               <html lang="en">\
                 <head>\
                   <meta charset="utf-8">\
                   <title>Console</title>\
                 </head>\
                 <body><div id="evidence_console"></div></body>\
               </html>');
    doc.close();
    popup.focus();
    return popup;
  }

  function _appendLine(level, msg) {
    this.popup = this.popup || this._makePopup();
    var levelName = Logger.LEVELS[level];

    var html = '<div style="';
    html += BASIC_STYLES;
    html += STYLES[levelName] || '';
    html += '">';
    if (level > Logger.INFO) {
      html += '<span style="font-weight: bold;">';
      html += levelName;
      html += ':</span> ';
    }
    html += _cleanup(msg);
    html += '</div>';
    var doc = this.popup.document,
        div = doc.createElement('div');
    div.innerHTML = html;
    html = div.firstChild;
    div = null;
    doc.getElementById('evidence_console').appendChild(html);
  }

  function log(level, msg, params) {
    level = level || Logger.NOTSET;
    if (level >= this.level) {
      if (params) {
        msg = UI.printf(msg, params);
      }
      this._appendLine(level, msg);
    }
  }

  p.log = log;
  p._makePopup = _makePopup;
  p._appendLine = _appendLine;
})(PopupLogger.prototype);
Console.PopupLogger = PopupLogger;
function CommandLineLogger(level) {
  Logger.call(this, level);
}

chain(CommandLineLogger, Logger);
CommandLineLogger.displayName = 'CommandLineLogger';

(function(p) {

  function log(level, msg, params) {
    level = level || Logger.NOTSET;
    if (level >= this.level) {
      var prefix = this.prefix;
      if (level > Logger.INFO) {
        prefix += Logger.LEVELS[level]+ ': ';
      }
      if (params) {
        msg = UI.printf(msg, params);
      }
      global.print(prefix + msg);
    }
  }

  p.log = log;
})(CommandLineLogger.prototype);
Console.CommandLineLogger = CommandLineLogger;
function ConsoleTestRunner(logger) {
  TestRunner.call(this);
  this.logger = logger;
}

chain(ConsoleTestRunner, TestRunner);
ConsoleTestRunner.displayName = 'ConsoleTestRunner';

(function(p) {
  function _makeResult() {
    return new ConsoleTestResult(this.logger);
  }

  p._makeResult = _makeResult;
})(ConsoleTestRunner.prototype);
Console.TestRunner = ConsoleTestRunner;
function ConsoleTestResult(logger) {
  TestResult.call(this);
  this.logger = logger;
}

chain(ConsoleTestResult, TestResult);
ConsoleTestResult.displayName = 'ConsoleTestResult';

(function(p) {
  var _super = TestResult.prototype;

  function addAssertion() {
    this.assertionCount++;
  }

  function addSkip(testcase, msg) {
    _super.addSkip.call(this, testcase, msg);
    this.logger.warn('Skipping testcase ' + testcase + ': ' + msg.message);
  }

  function addFailure(testcase, msg) {
    _super.addFailure.call(this, testcase, msg);
    this.logger.error(testcase + ': ' + msg.message + ' ' + msg.template, msg.args);
  }

  function addError(testcase, error) {
    _super.addError.call(this, testcase, error);
    this.logger.error(testcase + ' threw an error. ' + error);
  }

  function startTest(testcase) {
    _super.startTest.call(this, testcase);
    this.logger.debug('Started testcase ' + testcase + '.');
  }

  function stopTest(testcase) {
    this.logger.debug('Completed testcase ' + testcase + '.');
  }

  function pauseTest(testcase) {
    this.logger.info('Paused testcase ' + testcase + '.');
  }

  function resumeTest(testcase) {
    this.logger.info('Restarted testcase ' + testcase + '.');
  }

  function startSuite(suite) {
    this.logger.info('Started suite ' + suite + '.');
    this.logger.group('Suite ' + suite);
  }

  function stopSuite(suite) {
    this.logger.groupEnd();
    this.logger.info('Completed suite ' + suite + '.');
  }

  function start(t0) {
    _super.start.call(this, t0);
    this.logger.info('Started tests.');
    this.logger.group('Tests');
  }

  function stop(t1) {
    _super.stop.call(this, t1);
    this.logger.groupEnd();
    this.logger.info('Completed tests in ' + ((t1 - this.t0)/1000) + 's.');
    this.logger.info(this.toString() + '.');
  }

  p.addAssertion  = addAssertion;
  p.addSkip       = addSkip;
  p.addFailure    = addFailure;
  p.addError      = addError;
  p.startTest     = startTest;
  p.stopTest      = stopTest;
  p.pauseTest     = pauseTest;
  p.resumeTest   = resumeTest;
  p.startSuite    = startSuite;
  p.stopSuite     = stopSuite;
  p.start         = start;
  p.stop          = stop;
})(ConsoleTestResult.prototype);


Console.TestResult = ConsoleTestResult;
var Web = {};
function AbstractWidget(doc) {
  this.doc = doc || document;
}

AbstractWidget.displayName = 'Widget';

(function(p) {
  function escapeHTML(html) {
    return (html + '').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
  }

  function toElement() {
    return this.element;
  }

  function appendChild(child) {
    var element = child && child.toElement ? child.toElement() : child;
    this.element.appendChild(element);
    return child;
  }
  p.draw = function() { return this; };
  p.redraw = function() { return this.draw() };
  p.appendChild = appendChild;
  p.escapeHTML = escapeHTML;
  p.toElement = toElement;
})(AbstractWidget.prototype);
Web.AbstractWidget = AbstractWidget;
function LabelledText(label, doc) {
  AbstractWidget.call(this, doc)
  this.label = label;
  this.element = this.doc.createElement('p');
}

chain(LabelledText, AbstractWidget);
LabelledText.displayName = 'LabelledText';

(function(p) {
  function setContent(content) {
    this._content = this.escapeHTML(content);
    this._content = TEMPLATE.replace('{{ label }}', this.label).replace('{{ content }}', content);
    return this;
  }

  function draw() {
    this.element.innerHTML = this._content;
    return this;
  }

  var TEMPLATE =  '<strong>{{ label }}:</strong> {{ content }}';

  p.setContent = setContent;
  p.draw = draw;
})(LabelledText.prototype);
Web.LabelledText = LabelledText;
function ProgressBar(width, doc) {
  this._width = width;
  this._level = 0;
  AbstractWidget.call(this, doc);
  this._build();
}

chain(ProgressBar, AbstractWidget);
ProgressBar.displayName = 'ProgressBar';

(function(p) {
  function _build() {
    this.element = this._createDiv(this.width);
    this.element.id = 'evidence_progress_bar_container';
    this.progressBar = this._createDiv(0);
    this.progressBar.id = 'evidence_progress_bar';
    this.element.appendChild(this.progressBar);
    return this;
  }

  function _createDiv(width) {
    var element = this.doc.createElement('div');
    element.style.width = width + 'px';
    return element;
  }

  function draw() {
    this.progressBar.style.width = this._value + 'px';
    var className = (Logger.LEVELS[this._level] || '').toLowerCase();
    this.progressBar.className = className;
    return this;
  }

  function setValue(ratio) {
    this._value = Math.floor(ratio * this._width);
    return this;
  }

  function setLevel(level) {
    if (level > this._level) {
      this._level = level;
    }
    return this;
  }

  p._build = _build;
  p._createDiv = _createDiv;
  p.draw = draw;
  p.setValue = setValue;
  p.setLevel = setLevel;
})(ProgressBar.prototype);
Web.ProgressBar = ProgressBar;
function WebGUI(doc) {
  AbstractWidget.call(this, doc);
  this._build();
}

chain(WebGUI, AbstractWidget);
WebGUI.displayName = 'WebGUI';

(function(p) {
  function _build() {
    this.element = this.doc.createElement('div');
    this.element.id = 'evidence';
    this.appendChild(new LabelledText('User agent string').setContent(global.navigator.userAgent).draw())
    this.status      = this.appendChild(new LabelledText('Status'));
    this.progressBar = this.appendChild(new ProgressBar(300));
    this.results     = this.appendChild(new LabelledText('Results'));
    return this;
  }

  function draw() {
    defer(function() {
      this.status.draw();
      this.progressBar.draw();
      this.results.draw();
    }, this);
  }

  function setResults(txt) {
    txt = this._appendFullStop(txt);
    this.results.setContent(txt);
    return this;
  }

  function setStatus(txt) {
    txt = this._appendFullStop(txt);
    this.status.setContent(txt);
    this.draw();
    return this;
  }

  function setProgress(ratio) {
    this.progressBar.setValue(ratio);
    return this;
  }

  function setLevel(level) {
    this.progressBar.setLevel(level);
    return this;
  }

  function _appendFullStop(txt) {
    return (txt + '').replace(/\.?\s*$/, '.');
  }

  p._build = _build;
  p.setResults = setResults;
  p.setStatus = setStatus;
  p.setProgress = setProgress;
  p.setLevel = setLevel;
  p._appendFullStop = _appendFullStop;
  p.draw = draw;
})(WebGUI.prototype);
Web.GUI = WebGUI;
function WebTestRunner(logger) {
  TestRunner.call(this);
  this.logger = logger;
}

chain(WebTestRunner, TestRunner);
WebTestRunner.displayName = 'WebTestRunner';

(function(p) {
  function _makeResult() {
    return new WebTestResult();
  }

  p._makeResult = _makeResult;
})(WebTestRunner.prototype);
Web.TestRunner = WebTestRunner;
function WebTestResult(name) {
  TestResultTree.call(this, name);
  this.pageCount = 0;
}

chain(WebTestResult, TestResultTree);
WebTestResult.displayName = 'WebTestResult';

(function(p) {
  var _super = TestResultTree.prototype;

  function addAssertion() {
    _super.addAssertion.call(this);
    this.gui.setResults(this);
  }

  function addSkip(testcase, msg) {
    _super.addSkip.call(this, testcase, msg);
    var gui = this.gui;
    gui.setResults(this);
    gui.setLevel(Logger.WARN);
    gui.setStatus('Skipping testcase ' + testcase + ': ' + msg.message);
  }

  function addFailure(testcase, msg) {
    _super.addFailure.call(this, testcase, msg);
    var gui = this.gui;
    gui.setResults(this);
    gui.setLevel(Logger.ERROR);
    gui.setStatus(testcase + ': ' + msg.message + ' ' + msg.template, msg.args);
  }

  function addError(testcase, error) {
    _super.addError.call(this, testcase, error);
    var gui = this.gui;
    gui.setResults(this);
    gui.setLevel(Logger.ERROR);
    gui.setStatus(testcase + ' threw an error. ' + error);
  }

  function startTest(testcase) {
    _super.startTest.call(this, testcase);
    this.gui.setStatus('Started testcase ' + testcase);
  }

  function stopTest(testcase) {
    _super.stopTest.call(this, testcase);
    var gui = this.gui;
    gui.setProgress(this.getRatio());
    gui.setStatus('Completed testcase ' + testcase);
  }

  function pauseTest(testcase) {
    this.gui.setStatus('Paused testcase ' + testcase + '...');
  }

  function resumeTest(testcase) {
    this.gui.setStatus('Resumed testcase ' + testcase);
  }

  function startSuite(suite) {
    _super.startSuite.call(this, suite);
    if (!this.size) { this.size = suite.size(); }
    this.gui.setStatus('Started suite ' + suite);
  }

  function stopSuite(suite) {
    _super.stopSuite.call(this, suite);
    this.gui.setStatus('Completed suite ' + suite);
  }

  function loadPage(page) {
    this.gui.setStatus('Loading page ' + page.location.pathname + '...');
  }

  function startPage(page, suite) {
    this.pageSize = suite.size();
    this.previousTestCount = this.testCount;
    this.gui.setStatus('Loaded page ' + page.location.pathname);
  }

  function stopPage(page) {
    this.pageCount++;
    this.gui.setStatus('Finished page ' + page.location.pathname);
  }

  function getRatio() {
    if (!this.pageSize) {
      return this.testCount / this.size;
    }
    var pageRatio = (this.testCount - this.previousTestCount) / this.pageSize;
    return (pageRatio + this.pageCount) / this.size;
  }

  function start() {
    _super.start.call(this);
    var gui = new WebGUI(document);
    this.gui = gui;
    document.body.appendChild(gui.toElement());
    gui.setResults(this);
  }

  function stop() {
    _super.stop.call(this);
    this.gui.setStatus('Completed tests in ' + ((this.t1 - this.t0)/1000) + 's');

    console.log(new AsciiViewBuilder(this).draw())
  }

  p.getRatio      = getRatio;
  p.addAssertion  = addAssertion;
  p.addSkip       = addSkip;
  p.addFailure    = addFailure;
  p.addError      = addError;
  p.startTest     = startTest;
  p.stopTest      = stopTest;
  p.pauseTest     = pauseTest;
  p.resumeTest    = resumeTest;
  p.startSuite    = startSuite;
  p.stopSuite     = stopSuite;
  p.loadPage      = loadPage;
  p.startPage     = startPage;
  p.stopPage      = stopPage;
  p.start         = start;
  p.stop          = stop;
})(WebTestResult.prototype);


Web.TestResult = WebTestResult;
function AsciiViewBuilder(result) {
  this.prefix = '';
  this._result = result;
}

AsciiViewBuilder.name = AsciiViewBuilder.displayName = 'AsciiViewBuilder';

(function(p) {

  function draw() {
     return this._build(this._result);
  }

  function _build(r) {
     var rString = r.toString(),
         max = 100 - rString.length - this.prefix.length,
         str = r.name || 'Anonymous TestSuite';

     str = this._truncate(str, max);
     str += ' ' + this._times('.', max - str.length) + ' ';
     str += rString;
     str += this._displayStatus(r)
     str += '\n';

     var length = r.children ? r.children.length : 0,
         i;
     for (i = 0; i < length; i++) {
       if (i === length - 1) { // last
         str += this._buildChild('    ', '\'-- ', r.children[i], this.prefix + '\n');
       } else {
         str += this._buildChild('|   ', '|-- ', r.children[i]);
       }
     }
     return str;
  }

  function _buildChild(modifier, prefix, child, suffix) {
    var str, original = this.prefix;
    suffix = suffix || '';
    this.prefix += modifier;
    str = original + prefix + this._build(child) + suffix;
    this.prefix = original;
    return str;
  }

  function _truncate(str, size) {
    size = Math.max(size, 0);
    if (str.length > size) {
      return '...' + str.substr(str.length - size + 3);
    }
    return str;
  }

  function _times(c, times) {
    var str = '';
    for (var i = 0; i < times; i++) { str += c; }
    return str;
  }

  function _displayStatus(r) {
    if (r.children) { return ''; }
    if (r.errorCount > 0) { return ' E'; }
    if (r.failureCount > 0) { return ' F'; }
    if (r.skipCount > 0) { return ' S'; }
    return '';
  }

  p.draw = draw;
  p._build = _build;
  p._buildChild = _buildChild;
  p._displayStatus = _displayStatus;
  p._times = _times;
  p._truncate = _truncate;
})(AsciiViewBuilder.prototype);

var UI = (function() {
  function printf(template, args, inspector) {
    var parts = [],
        regexp = /(^%|.%)([a-zA-Z])/,
        args = args.splice(0); // clone args

    inspector = inspector || String;

    if (template.length <= 0) {
      return '';
    }
    while (m = regexp.exec(template)) {
      var match = m[0], index = m.index, type, arg;

      if (match.indexOf('%%') === 0) {
        parts.push(template.substr(0, index));
        parts.push(match.substr(1));
      } else {
        parts.push(template.substr(0, match.indexOf('%' === 0) ? index + 1 : index));
        type = m[2];
        arg = args.shift();
        arg = inspector(arg, type);
        parts.push(arg);
      }
      template = template.substr(index + match.length);
    }
    parts.push(template);
    return parts.join('');
  }

   return {
     printf: printf,
     Console: Console,
     Web: Web
   };
})();
  Evidence.UI = UI;

  var defaultLoader = new TestLoader();
  Evidence.defaultLoader = defaultLoader;

  global.Evidence = Evidence;

  if (global.location) {
    global.onload = function() {
      if (typeof originalOnload === 'function') {
        originalOnload.call(global);
      }
      AutoRunner.run();
    };
  } else if (global.arguments) {
    var runtime = java.lang.Runtime.getRuntime();
    var thread = new java.lang.Thread(function() {
      AutoRunner.run();
    });
    runtime.addShutdownHook(thread);
  }

})(this);
