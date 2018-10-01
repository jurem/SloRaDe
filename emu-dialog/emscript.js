
var Module;
if (typeof Module === 'undefined') Module = eval('(function() { try { return Module || {} } catch(e) { return {} } })()');
if (!Module.expectedDataFileDownloads) {
  Module.expectedDataFileDownloads = 0;
  Module.finishedDataFileDownloads = 0;
}
Module.expectedDataFileDownloads++;
(function() {

    var PACKAGE_PATH;
    if (typeof window === 'object') {
      PACKAGE_PATH = window['encodeURIComponent'](window.location.pathname.toString().substring(0, window.location.pathname.toString().lastIndexOf('/')) + '/');
    } else {
      // worker
      PACKAGE_PATH = encodeURIComponent(location.pathname.toString().substring(0, location.pathname.toString().lastIndexOf('/')) + '/');
    }
    var PACKAGE_NAME = 'emscript.data';
    var REMOTE_PACKAGE_NAME = (Module['filePackagePrefixURL'] || '') + 'emscript.data';
    var REMOTE_PACKAGE_SIZE = 819200;
    var PACKAGE_UUID = '56fb9603-1802-401a-ac6e-48391bdee354';
  
    function fetchRemotePackage(packageName, packageSize, callback, errback) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', packageName, true);
      xhr.responseType = 'arraybuffer';
      xhr.onprogress = function(event) {
        var url = packageName;
        var size = packageSize;
        if (event.total) size = event.total;
        if (event.loaded) {
          if (!xhr.addedTotal) {
            xhr.addedTotal = true;
            if (!Module.dataFileDownloads) Module.dataFileDownloads = {};
            Module.dataFileDownloads[url] = {
              loaded: event.loaded,
              total: size
            };
          } else {
            Module.dataFileDownloads[url].loaded = event.loaded;
          }
          var total = 0;
          var loaded = 0;
          var num = 0;
          for (var download in Module.dataFileDownloads) {
          var data = Module.dataFileDownloads[download];
            total += data.total;
            loaded += data.loaded;
            num++;
          }
          total = Math.ceil(total * Module.expectedDataFileDownloads/num);
          if (Module['setStatus']) Module['setStatus']('Downloading data... (' + loaded + '/' + total + ')');
        } else if (!Module.dataFileDownloads) {
          if (Module['setStatus']) Module['setStatus']('Downloading data...');
        }
      };
      xhr.onload = function(event) {
        var packageData = xhr.response;
        callback(packageData);
      };
      xhr.send(null);
    };

    function handleError(error) {
      console.error('package error:', error);
    };
  
      var fetched = null, fetchedCallback = null;
      fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE, function(data) {
        if (fetchedCallback) {
          fetchedCallback(data);
          fetchedCallback = null;
        } else {
          fetched = data;
        }
      }, handleError);
    
  function runWithFS() {

function assert(check, msg) {
  if (!check) throw msg + new Error().stack;
}

    function DataRequest(start, end, crunched, audio) {
      this.start = start;
      this.end = end;
      this.crunched = crunched;
      this.audio = audio;
    }
    DataRequest.prototype = {
      requests: {},
      open: function(mode, name) {
        this.name = name;
        this.requests[name] = this;
        Module['addRunDependency']('fp ' + this.name);
      },
      send: function() {},
      onload: function() {
        var byteArray = this.byteArray.subarray(this.start, this.end);

          this.finish(byteArray);

      },
      finish: function(byteArray) {
        var that = this;
        Module['FS_createPreloadedFile'](this.name, null, byteArray, true, true, function() {
          Module['removeRunDependency']('fp ' + that.name);
        }, function() {
          if (that.audio) {
            Module['removeRunDependency']('fp ' + that.name); // workaround for chromium bug 124926 (still no audio with this, but at least we don't hang)
          } else {
            Module.printErr('Preloading file ' + that.name + ' failed');
          }
        }, false, true); // canOwn this data in the filesystem, it is a slide into the heap that will never change
        this.requests[this.name] = null;
      },
    };
      new DataRequest(0, 819200, 0, 0).open('GET', '/Megadisk.img');

    function processPackageData(arrayBuffer) {
      Module.finishedDataFileDownloads++;
      assert(arrayBuffer, 'Loading data file failed.');
      var byteArray = new Uint8Array(arrayBuffer);
      var curr;
      
      // copy the entire loaded file into a spot in the heap. Files will refer to slices in that. They cannot be freed though.
      var ptr = Module['_malloc'](byteArray.length);
      Module['HEAPU8'].set(byteArray, ptr);
      DataRequest.prototype.byteArray = Module['HEAPU8'].subarray(ptr, ptr+byteArray.length);
          DataRequest.prototype.requests["/Megadisk.img"].onload();
          Module['removeRunDependency']('datafile_emscript.data');

    };
    Module['addRunDependency']('datafile_emscript.data');
  
    if (!Module.preloadResults) Module.preloadResults = {};
  
      Module.preloadResults[PACKAGE_NAME] = {fromCache: false};
      if (fetched) {
        processPackageData(fetched);
        fetched = null;
      } else {
        fetchedCallback = processPackageData;
      }
    
  }
  if (Module['calledRun']) {
    runWithFS();
  } else {
    if (!Module['preRun']) Module['preRun'] = [];
    Module["preRun"].push(runWithFS); // FS is not initialized yet, wait for it
  }

})();

// Note: Some Emscripten settings will significantly limit the speed of the generated code.
// Note: Some Emscripten settings may limit the speed of the generated code.
// The Module object: Our interface to the outside world. We import
// and export values on it, and do the work to get that through
// closure compiler if necessary. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(Module) { ..generated code.. }
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to do an eval in order to handle the closure compiler
// case, where this code here is minified but Module was defined
// elsewhere (e.g. case 4 above). We also need to check if Module
// already exists (e.g. case 3 above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
var Module;
if (!Module) Module = eval('(function() { try { return Module || {} } catch(e) { return {} } })()');

// Sometimes an existing Module object exists with properties
// meant to overwrite the default module functionality. Here
// we collect those properties and reapply _after_ we configure
// the current environment's defaults to avoid having to be so
// defensive during initialization.
var moduleOverrides = {};
for (var key in Module) {
  if (Module.hasOwnProperty(key)) {
    moduleOverrides[key] = Module[key];
  }
}

// The environment setup code below is customized to use Module.
// *** Environment setup code ***
var ENVIRONMENT_IS_NODE = typeof process === 'object' && typeof require === 'function';
var ENVIRONMENT_IS_WEB = typeof window === 'object';
var ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;

if (ENVIRONMENT_IS_NODE) {
  // Expose functionality in the same simple way that the shells work
  // Note that we pollute the global namespace here, otherwise we break in node
  if (!Module['print']) Module['print'] = function print(x) {
    process['stdout'].write(x + '\n');
  };
  if (!Module['printErr']) Module['printErr'] = function printErr(x) {
    process['stderr'].write(x + '\n');
  };

  var nodeFS = require('fs');
  var nodePath = require('path');

  Module['read'] = function read(filename, binary) {
    filename = nodePath['normalize'](filename);
    var ret = nodeFS['readFileSync'](filename);
    // The path is absolute if the normalized version is the same as the resolved.
    if (!ret && filename != nodePath['resolve'](filename)) {
      filename = path.join(__dirname, '..', 'src', filename);
      ret = nodeFS['readFileSync'](filename);
    }
    if (ret && !binary) ret = ret.toString();
    return ret;
  };

  Module['readBinary'] = function readBinary(filename) { return Module['read'](filename, true) };

  Module['load'] = function load(f) {
    globalEval(read(f));
  };

  Module['arguments'] = process['argv'].slice(2);

  module['exports'] = Module;
}
else if (ENVIRONMENT_IS_SHELL) {
  if (!Module['print']) Module['print'] = print;
  if (typeof printErr != 'undefined') Module['printErr'] = printErr; // not present in v8 or older sm

  if (typeof read != 'undefined') {
    Module['read'] = read;
  } else {
    Module['read'] = function read() { throw 'no read() available (jsc?)' };
  }

  Module['readBinary'] = function readBinary(f) {
    return read(f, 'binary');
  };

  if (typeof scriptArgs != 'undefined') {
    Module['arguments'] = scriptArgs;
  } else if (typeof arguments != 'undefined') {
    Module['arguments'] = arguments;
  }

  this['Module'] = Module;

  eval("if (typeof gc === 'function' && gc.toString().indexOf('[native code]') > 0) var gc = undefined"); // wipe out the SpiderMonkey shell 'gc' function, which can confuse closure (uses it as a minified name, and it is then initted to a non-falsey value unexpectedly)
}
else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  Module['read'] = function read(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send(null);
    return xhr.responseText;
  };

  if (typeof arguments != 'undefined') {
    Module['arguments'] = arguments;
  }

  if (typeof console !== 'undefined') {
    if (!Module['print']) Module['print'] = function print(x) {
      console.log(x);
    };
    if (!Module['printErr']) Module['printErr'] = function printErr(x) {
      console.log(x);
    };
  } else {
    // Probably a worker, and without console.log. We can do very little here...
    var TRY_USE_DUMP = false;
    if (!Module['print']) Module['print'] = (TRY_USE_DUMP && (typeof(dump) !== "undefined") ? (function(x) {
      dump(x);
    }) : (function(x) {
      // self.postMessage(x); // enable this if you want stdout to be sent as messages
    }));
  }

  if (ENVIRONMENT_IS_WEB) {
    this['Module'] = Module;
  } else {
    Module['load'] = importScripts;
  }
}
else {
  // Unreachable because SHELL is dependant on the others
  throw 'Unknown runtime environment. Where are we?';
}

function globalEval(x) {
  eval.call(null, x);
}
if (!Module['load'] == 'undefined' && Module['read']) {
  Module['load'] = function load(f) {
    globalEval(Module['read'](f));
  };
}
if (!Module['print']) {
  Module['print'] = function(){};
}
if (!Module['printErr']) {
  Module['printErr'] = Module['print'];
}
if (!Module['arguments']) {
  Module['arguments'] = [];
}
// *** Environment setup code ***

// Closure helpers
Module.print = Module['print'];
Module.printErr = Module['printErr'];

// Callbacks
Module['preRun'] = [];
Module['postRun'] = [];

// Merge back in the overrides
for (var key in moduleOverrides) {
  if (moduleOverrides.hasOwnProperty(key)) {
    Module[key] = moduleOverrides[key];
  }
}



// === Auto-generated preamble library stuff ===

//========================================
// Runtime code shared with compiler
//========================================

var Runtime = {
  stackSave: function () {
    return STACKTOP;
  },
  stackRestore: function (stackTop) {
    STACKTOP = stackTop;
  },
  forceAlign: function (target, quantum) {
    quantum = quantum || 4;
    if (quantum == 1) return target;
    if (isNumber(target) && isNumber(quantum)) {
      return Math.ceil(target/quantum)*quantum;
    } else if (isNumber(quantum) && isPowerOfTwo(quantum)) {
      return '(((' +target + ')+' + (quantum-1) + ')&' + -quantum + ')';
    }
    return 'Math.ceil((' + target + ')/' + quantum + ')*' + quantum;
  },
  isNumberType: function (type) {
    return type in Runtime.INT_TYPES || type in Runtime.FLOAT_TYPES;
  },
  isPointerType: function isPointerType(type) {
  return type[type.length-1] == '*';
},
  isStructType: function isStructType(type) {
  if (isPointerType(type)) return false;
  if (isArrayType(type)) return true;
  if (/<?\{ ?[^}]* ?\}>?/.test(type)) return true; // { i32, i8 } etc. - anonymous struct types
  // See comment in isStructPointerType()
  return type[0] == '%';
},
  INT_TYPES: {"i1":0,"i8":0,"i16":0,"i32":0,"i64":0},
  FLOAT_TYPES: {"float":0,"double":0},
  or64: function (x, y) {
    var l = (x | 0) | (y | 0);
    var h = (Math.round(x / 4294967296) | Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  and64: function (x, y) {
    var l = (x | 0) & (y | 0);
    var h = (Math.round(x / 4294967296) & Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  xor64: function (x, y) {
    var l = (x | 0) ^ (y | 0);
    var h = (Math.round(x / 4294967296) ^ Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  getNativeTypeSize: function (type) {
    switch (type) {
      case 'i1': case 'i8': return 1;
      case 'i16': return 2;
      case 'i32': return 4;
      case 'i64': return 8;
      case 'float': return 4;
      case 'double': return 8;
      default: {
        if (type[type.length-1] === '*') {
          return Runtime.QUANTUM_SIZE; // A pointer
        } else if (type[0] === 'i') {
          var bits = parseInt(type.substr(1));
          assert(bits % 8 === 0);
          return bits/8;
        } else {
          return 0;
        }
      }
    }
  },
  getNativeFieldSize: function (type) {
    return Math.max(Runtime.getNativeTypeSize(type), Runtime.QUANTUM_SIZE);
  },
  dedup: function dedup(items, ident) {
  var seen = {};
  if (ident) {
    return items.filter(function(item) {
      if (seen[item[ident]]) return false;
      seen[item[ident]] = true;
      return true;
    });
  } else {
    return items.filter(function(item) {
      if (seen[item]) return false;
      seen[item] = true;
      return true;
    });
  }
},
  set: function set() {
  var args = typeof arguments[0] === 'object' ? arguments[0] : arguments;
  var ret = {};
  for (var i = 0; i < args.length; i++) {
    ret[args[i]] = 0;
  }
  return ret;
},
  STACK_ALIGN: 8,
  getAlignSize: function (type, size, vararg) {
    // we align i64s and doubles on 64-bit boundaries, unlike x86
    if (vararg) return 8;
    if (!vararg && (type == 'i64' || type == 'double')) return 8;
    if (!type) return Math.min(size, 8); // align structures internally to 64 bits
    return Math.min(size || (type ? Runtime.getNativeFieldSize(type) : 0), Runtime.QUANTUM_SIZE);
  },
  calculateStructAlignment: function calculateStructAlignment(type) {
    type.flatSize = 0;
    type.alignSize = 0;
    var diffs = [];
    var prev = -1;
    var index = 0;
    type.flatIndexes = type.fields.map(function(field) {
      index++;
      var size, alignSize;
      if (Runtime.isNumberType(field) || Runtime.isPointerType(field)) {
        size = Runtime.getNativeTypeSize(field); // pack char; char; in structs, also char[X]s.
        alignSize = Runtime.getAlignSize(field, size);
      } else if (Runtime.isStructType(field)) {
        if (field[1] === '0') {
          // this is [0 x something]. When inside another structure like here, it must be at the end,
          // and it adds no size
          // XXX this happens in java-nbody for example... assert(index === type.fields.length, 'zero-length in the middle!');
          size = 0;
          if (Types.types[field]) {
            alignSize = Runtime.getAlignSize(null, Types.types[field].alignSize);
          } else {
            alignSize = type.alignSize || QUANTUM_SIZE;
          }
        } else {
          size = Types.types[field].flatSize;
          alignSize = Runtime.getAlignSize(null, Types.types[field].alignSize);
        }
      } else if (field[0] == 'b') {
        // bN, large number field, like a [N x i8]
        size = field.substr(1)|0;
        alignSize = 1;
      } else if (field[0] === '<') {
        // vector type
        size = alignSize = Types.types[field].flatSize; // fully aligned
      } else if (field[0] === 'i') {
        // illegal integer field, that could not be legalized because it is an internal structure field
        // it is ok to have such fields, if we just use them as markers of field size and nothing more complex
        size = alignSize = parseInt(field.substr(1))/8;
        assert(size % 1 === 0, 'cannot handle non-byte-size field ' + field);
      } else {
        assert(false, 'invalid type for calculateStructAlignment');
      }
      if (type.packed) alignSize = 1;
      type.alignSize = Math.max(type.alignSize, alignSize);
      var curr = Runtime.alignMemory(type.flatSize, alignSize); // if necessary, place this on aligned memory
      type.flatSize = curr + size;
      if (prev >= 0) {
        diffs.push(curr-prev);
      }
      prev = curr;
      return curr;
    });
    if (type.name_ && type.name_[0] === '[') {
      // arrays have 2 elements, so we get the proper difference. then we scale here. that way we avoid
      // allocating a potentially huge array for [999999 x i8] etc.
      type.flatSize = parseInt(type.name_.substr(1))*type.flatSize/2;
    }
    type.flatSize = Runtime.alignMemory(type.flatSize, type.alignSize);
    if (diffs.length == 0) {
      type.flatFactor = type.flatSize;
    } else if (Runtime.dedup(diffs).length == 1) {
      type.flatFactor = diffs[0];
    }
    type.needsFlattening = (type.flatFactor != 1);
    return type.flatIndexes;
  },
  generateStructInfo: function (struct, typeName, offset) {
    var type, alignment;
    if (typeName) {
      offset = offset || 0;
      type = (typeof Types === 'undefined' ? Runtime.typeInfo : Types.types)[typeName];
      if (!type) return null;
      if (type.fields.length != struct.length) {
        printErr('Number of named fields must match the type for ' + typeName + ': possibly duplicate struct names. Cannot return structInfo');
        return null;
      }
      alignment = type.flatIndexes;
    } else {
      var type = { fields: struct.map(function(item) { return item[0] }) };
      alignment = Runtime.calculateStructAlignment(type);
    }
    var ret = {
      __size__: type.flatSize
    };
    if (typeName) {
      struct.forEach(function(item, i) {
        if (typeof item === 'string') {
          ret[item] = alignment[i] + offset;
        } else {
          // embedded struct
          var key;
          for (var k in item) key = k;
          ret[key] = Runtime.generateStructInfo(item[key], type.fields[i], alignment[i]);
        }
      });
    } else {
      struct.forEach(function(item, i) {
        ret[item[1]] = alignment[i];
      });
    }
    return ret;
  },
  dynCall: function (sig, ptr, args) {
    if (args && args.length) {
      assert(args.length == sig.length-1);
      return FUNCTION_TABLE[ptr].apply(null, args);
    } else {
      assert(sig.length == 1);
      return FUNCTION_TABLE[ptr]();
    }
  },
  addFunction: function (func) {
    var table = FUNCTION_TABLE;
    var ret = table.length;
    assert(ret % 2 === 0);
    table.push(func);
    for (var i = 0; i < 2-1; i++) table.push(0);
    return ret;
  },
  removeFunction: function (index) {
    var table = FUNCTION_TABLE;
    table[index] = null;
  },
  getAsmConst: function (code, numArgs) {
    // code is a constant string on the heap, so we can cache these
    if (!Runtime.asmConstCache) Runtime.asmConstCache = {};
    var func = Runtime.asmConstCache[code];
    if (func) return func;
    var args = [];
    for (var i = 0; i < numArgs; i++) {
      args.push(String.fromCharCode(36) + i); // $0, $1 etc
    }
    code = Pointer_stringify(code);
    if (code[0] === '"') {
      // tolerate EM_ASM("..code..") even though EM_ASM(..code..) is correct
      if (code.indexOf('"', 1) === code.length-1) {
        code = code.substr(1, code.length-2);
      } else {
        // something invalid happened, e.g. EM_ASM("..code($0)..", input)
        abort('invalid EM_ASM input |' + code + '|. Please use EM_ASM(..code..) (no quotes) or EM_ASM({ ..code($0).. }, input) (to input values)');
      }
    }
    return Runtime.asmConstCache[code] = eval('(function(' + args.join(',') + '){ ' + code + ' })'); // new Function does not allow upvars in node
  },
  warnOnce: function (text) {
    if (!Runtime.warnOnce.shown) Runtime.warnOnce.shown = {};
    if (!Runtime.warnOnce.shown[text]) {
      Runtime.warnOnce.shown[text] = 1;
      Module.printErr(text);
    }
  },
  funcWrappers: {},
  getFuncWrapper: function (func, sig) {
    assert(sig);
    if (!Runtime.funcWrappers[func]) {
      Runtime.funcWrappers[func] = function dynCall_wrapper() {
        return Runtime.dynCall(sig, func, arguments);
      };
    }
    return Runtime.funcWrappers[func];
  },
  UTF8Processor: function () {
    var buffer = [];
    var needed = 0;
    this.processCChar = function (code) {
      code = code & 0xFF;

      if (buffer.length == 0) {
        if ((code & 0x80) == 0x00) {        // 0xxxxxxx
          return String.fromCharCode(code);
        }
        buffer.push(code);
        if ((code & 0xE0) == 0xC0) {        // 110xxxxx
          needed = 1;
        } else if ((code & 0xF0) == 0xE0) { // 1110xxxx
          needed = 2;
        } else {                            // 11110xxx
          needed = 3;
        }
        return '';
      }

      if (needed) {
        buffer.push(code);
        needed--;
        if (needed > 0) return '';
      }

      var c1 = buffer[0];
      var c2 = buffer[1];
      var c3 = buffer[2];
      var c4 = buffer[3];
      var ret;
      if (buffer.length == 2) {
        ret = String.fromCharCode(((c1 & 0x1F) << 6)  | (c2 & 0x3F));
      } else if (buffer.length == 3) {
        ret = String.fromCharCode(((c1 & 0x0F) << 12) | ((c2 & 0x3F) << 6)  | (c3 & 0x3F));
      } else {
        // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
        var codePoint = ((c1 & 0x07) << 18) | ((c2 & 0x3F) << 12) |
                        ((c3 & 0x3F) << 6)  | (c4 & 0x3F);
        ret = String.fromCharCode(
          Math.floor((codePoint - 0x10000) / 0x400) + 0xD800,
          (codePoint - 0x10000) % 0x400 + 0xDC00);
      }
      buffer.length = 0;
      return ret;
    }
    this.processJSString = function processJSString(string) {
      string = unescape(encodeURIComponent(string));
      var ret = [];
      for (var i = 0; i < string.length; i++) {
        ret.push(string.charCodeAt(i));
      }
      return ret;
    }
  },
  getCompilerSetting: function (name) {
    throw 'You must build with -s RETAIN_COMPILER_SETTINGS=1 for Runtime.getCompilerSetting or emscripten_get_compiler_setting to work';
  },
  stackAlloc: function (size) { var ret = STACKTOP;STACKTOP = (STACKTOP + size)|0;STACKTOP = (((STACKTOP)+7)&-8);(assert((STACKTOP|0) < (STACK_MAX|0))|0); return ret; },
  staticAlloc: function (size) { var ret = STATICTOP;STATICTOP = (STATICTOP + (assert(!staticSealed),size))|0;STATICTOP = (((STATICTOP)+7)&-8); return ret; },
  dynamicAlloc: function (size) { var ret = DYNAMICTOP;DYNAMICTOP = (DYNAMICTOP + (assert(DYNAMICTOP > 0),size))|0;DYNAMICTOP = (((DYNAMICTOP)+7)&-8); if (DYNAMICTOP >= TOTAL_MEMORY) enlargeMemory();; return ret; },
  alignMemory: function (size,quantum) { var ret = size = Math.ceil((size)/(quantum ? quantum : 8))*(quantum ? quantum : 8); return ret; },
  makeBigInt: function (low,high,unsigned) { var ret = (unsigned ? ((low>>>0)+((high>>>0)*4294967296)) : ((low>>>0)+((high|0)*4294967296))); return ret; },
  GLOBAL_BASE: 8,
  QUANTUM_SIZE: 4,
  __dummy__: 0
}


Module['Runtime'] = Runtime;









//========================================
// Runtime essentials
//========================================

var __THREW__ = 0; // Used in checking for thrown exceptions.
var setjmpId = 1; // Used in setjmp/longjmp
var setjmpLabels = {};

var ABORT = false; // whether we are quitting the application. no code should run after this. set in exit() and abort()
var EXITSTATUS = 0;

var undef = 0;
// tempInt is used for 32-bit signed values or smaller. tempBigInt is used
// for 32-bit unsigned values or more than 32 bits. TODO: audit all uses of tempInt
var tempValue, tempInt, tempBigInt, tempInt2, tempBigInt2, tempPair, tempBigIntI, tempBigIntR, tempBigIntS, tempBigIntP, tempBigIntD, tempDouble, tempFloat;
var tempI64, tempI64b;
var tempRet0, tempRet1, tempRet2, tempRet3, tempRet4, tempRet5, tempRet6, tempRet7, tempRet8, tempRet9;

function assert(condition, text) {
  if (!condition) {
    abort('Assertion failed: ' + text);
  }
}

var globalScope = this;

// C calling interface. A convenient way to call C functions (in C files, or
// defined with extern "C").
//
// Note: LLVM optimizations can inline and remove functions, after which you will not be
//       able to call them. Closure can also do so. To avoid that, add your function to
//       the exports using something like
//
//         -s EXPORTED_FUNCTIONS='["_main", "_myfunc"]'
//
// @param ident      The name of the C function (note that C++ functions will be name-mangled - use extern "C")
// @param returnType The return type of the function, one of the JS types 'number', 'string' or 'array' (use 'number' for any C pointer, and
//                   'array' for JavaScript arrays and typed arrays; note that arrays are 8-bit).
// @param argTypes   An array of the types of arguments for the function (if there are no arguments, this can be ommitted). Types are as in returnType,
//                   except that 'array' is not possible (there is no way for us to know the length of the array)
// @param args       An array of the arguments to the function, as native JS values (as in returnType)
//                   Note that string arguments will be stored on the stack (the JS string will become a C string on the stack).
// @return           The return value, as a native JS value (as in returnType)
function ccall(ident, returnType, argTypes, args) {
  return ccallFunc(getCFunc(ident), returnType, argTypes, args);
}
Module["ccall"] = ccall;

// Returns the C function with a specified identifier (for C++, you need to do manual name mangling)
function getCFunc(ident) {
  try {
    var func = Module['_' + ident]; // closure exported function
    if (!func) func = eval('_' + ident); // explicit lookup
  } catch(e) {
  }
  assert(func, 'Cannot call unknown function ' + ident + ' (perhaps LLVM optimizations or closure removed it?)');
  return func;
}

// Internal function that does a C call using a function, not an identifier
function ccallFunc(func, returnType, argTypes, args) {
  var stack = 0;
  function toC(value, type) {
    if (type == 'string') {
      if (value === null || value === undefined || value === 0) return 0; // null string
      value = intArrayFromString(value);
      type = 'array';
    }
    if (type == 'array') {
      if (!stack) stack = Runtime.stackSave();
      var ret = Runtime.stackAlloc(value.length);
      writeArrayToMemory(value, ret);
      return ret;
    }
    return value;
  }
  function fromC(value, type) {
    if (type == 'string') {
      return Pointer_stringify(value);
    }
    assert(type != 'array');
    return value;
  }
  var i = 0;
  var cArgs = args ? args.map(function(arg) {
    return toC(arg, argTypes[i++]);
  }) : [];
  var ret = fromC(func.apply(null, cArgs), returnType);
  if (stack) Runtime.stackRestore(stack);
  return ret;
}

// Returns a native JS wrapper for a C function. This is similar to ccall, but
// returns a function you can call repeatedly in a normal way. For example:
//
//   var my_function = cwrap('my_c_function', 'number', ['number', 'number']);
//   alert(my_function(5, 22));
//   alert(my_function(99, 12));
//
function cwrap(ident, returnType, argTypes) {
  var func = getCFunc(ident);
  return function() {
    return ccallFunc(func, returnType, argTypes, Array.prototype.slice.call(arguments));
  }
}
Module["cwrap"] = cwrap;

// Sets a value in memory in a dynamic way at run-time. Uses the
// type data. This is the same as makeSetValue, except that
// makeSetValue is done at compile-time and generates the needed
// code then, whereas this function picks the right code at
// run-time.
// Note that setValue and getValue only do *aligned* writes and reads!
// Note that ccall uses JS types as for defining types, while setValue and
// getValue need LLVM types ('i8', 'i32') - this is a lower-level operation
function setValue(ptr, value, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': HEAP8[(ptr)]=value; break;
      case 'i8': HEAP8[(ptr)]=value; break;
      case 'i16': HEAP16[((ptr)>>1)]=value; break;
      case 'i32': HEAP32[((ptr)>>2)]=value; break;
      case 'i64': (tempI64 = [value>>>0,(tempDouble=value,Math_abs(tempDouble) >= 1 ? (tempDouble > 0 ? Math_min(Math_floor((tempDouble)/4294967296), 4294967295)>>>0 : (~~(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296)))>>>0) : 0)],HEAP32[((ptr)>>2)]=tempI64[0],HEAP32[(((ptr)+(4))>>2)]=tempI64[1]); break;
      case 'float': HEAPF32[((ptr)>>2)]=value; break;
      case 'double': HEAPF64[((ptr)>>3)]=value; break;
      default: abort('invalid type for setValue: ' + type);
    }
}
Module['setValue'] = setValue;

// Parallel to setValue.
function getValue(ptr, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': return HEAP8[(ptr)];
      case 'i8': return HEAP8[(ptr)];
      case 'i16': return HEAP16[((ptr)>>1)];
      case 'i32': return HEAP32[((ptr)>>2)];
      case 'i64': return HEAP32[((ptr)>>2)];
      case 'float': return HEAPF32[((ptr)>>2)];
      case 'double': return HEAPF64[((ptr)>>3)];
      default: abort('invalid type for setValue: ' + type);
    }
  return null;
}
Module['getValue'] = getValue;

var ALLOC_NORMAL = 0; // Tries to use _malloc()
var ALLOC_STACK = 1; // Lives for the duration of the current function call
var ALLOC_STATIC = 2; // Cannot be freed
var ALLOC_DYNAMIC = 3; // Cannot be freed except through sbrk
var ALLOC_NONE = 4; // Do not allocate
Module['ALLOC_NORMAL'] = ALLOC_NORMAL;
Module['ALLOC_STACK'] = ALLOC_STACK;
Module['ALLOC_STATIC'] = ALLOC_STATIC;
Module['ALLOC_DYNAMIC'] = ALLOC_DYNAMIC;
Module['ALLOC_NONE'] = ALLOC_NONE;

// allocate(): This is for internal use. You can use it yourself as well, but the interface
//             is a little tricky (see docs right below). The reason is that it is optimized
//             for multiple syntaxes to save space in generated code. So you should
//             normally not use allocate(), and instead allocate memory using _malloc(),
//             initialize it with setValue(), and so forth.
// @slab: An array of data, or a number. If a number, then the size of the block to allocate,
//        in *bytes* (note that this is sometimes confusing: the next parameter does not
//        affect this!)
// @types: Either an array of types, one for each byte (or 0 if no type at that position),
//         or a single type which is used for the entire block. This only matters if there
//         is initial data - if @slab is a number, then this does not matter at all and is
//         ignored.
// @allocator: How to allocate memory, see ALLOC_*
function allocate(slab, types, allocator, ptr) {
  var zeroinit, size;
  if (typeof slab === 'number') {
    zeroinit = true;
    size = slab;
  } else {
    zeroinit = false;
    size = slab.length;
  }

  var singleType = typeof types === 'string' ? types : null;

  var ret;
  if (allocator == ALLOC_NONE) {
    ret = ptr;
  } else {
    ret = [_malloc, Runtime.stackAlloc, Runtime.staticAlloc, Runtime.dynamicAlloc][allocator === undefined ? ALLOC_STATIC : allocator](Math.max(size, singleType ? 1 : types.length));
  }

  if (zeroinit) {
    var ptr = ret, stop;
    assert((ret & 3) == 0);
    stop = ret + (size & ~3);
    for (; ptr < stop; ptr += 4) {
      HEAP32[((ptr)>>2)]=0;
    }
    stop = ret + size;
    while (ptr < stop) {
      HEAP8[((ptr++)|0)]=0;
    }
    return ret;
  }

  if (singleType === 'i8') {
    if (slab.subarray || slab.slice) {
      HEAPU8.set(slab, ret);
    } else {
      HEAPU8.set(new Uint8Array(slab), ret);
    }
    return ret;
  }

  var i = 0, type, typeSize, previousType;
  while (i < size) {
    var curr = slab[i];

    if (typeof curr === 'function') {
      curr = Runtime.getFunctionIndex(curr);
    }

    type = singleType || types[i];
    if (type === 0) {
      i++;
      continue;
    }
    assert(type, 'Must know what type to store in allocate!');

    if (type == 'i64') type = 'i32'; // special case: we have one i32 here, and one i32 later

    setValue(ret+i, curr, type);

    // no need to look up size unless type changes, so cache it
    if (previousType !== type) {
      typeSize = Runtime.getNativeTypeSize(type);
      previousType = type;
    }
    i += typeSize;
  }

  return ret;
}
Module['allocate'] = allocate;

function Pointer_stringify(ptr, /* optional */ length) {
  // TODO: use TextDecoder
  // Find the length, and check for UTF while doing so
  var hasUtf = false;
  var t;
  var i = 0;
  while (1) {
    assert(ptr + i < TOTAL_MEMORY);
    t = HEAPU8[(((ptr)+(i))|0)];
    if (t >= 128) hasUtf = true;
    else if (t == 0 && !length) break;
    i++;
    if (length && i == length) break;
  }
  if (!length) length = i;

  var ret = '';

  if (!hasUtf) {
    var MAX_CHUNK = 1024; // split up into chunks, because .apply on a huge string can overflow the stack
    var curr;
    while (length > 0) {
      curr = String.fromCharCode.apply(String, HEAPU8.subarray(ptr, ptr + Math.min(length, MAX_CHUNK)));
      ret = ret ? ret + curr : curr;
      ptr += MAX_CHUNK;
      length -= MAX_CHUNK;
    }
    return ret;
  }

  var utf8 = new Runtime.UTF8Processor();
  for (i = 0; i < length; i++) {
    assert(ptr + i < TOTAL_MEMORY);
    t = HEAPU8[(((ptr)+(i))|0)];
    ret += utf8.processCChar(t);
  }
  return ret;
}
Module['Pointer_stringify'] = Pointer_stringify;

// Given a pointer 'ptr' to a null-terminated UTF16LE-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.
function UTF16ToString(ptr) {
  var i = 0;

  var str = '';
  while (1) {
    var codeUnit = HEAP16[(((ptr)+(i*2))>>1)];
    if (codeUnit == 0)
      return str;
    ++i;
    // fromCharCode constructs a character from a UTF-16 code unit, so we can pass the UTF16 string right through.
    str += String.fromCharCode(codeUnit);
  }
}
Module['UTF16ToString'] = UTF16ToString;

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF16LE form. The copy will require at most (str.length*2+1)*2 bytes of space in the HEAP.
function stringToUTF16(str, outPtr) {
  for(var i = 0; i < str.length; ++i) {
    // charCodeAt returns a UTF-16 encoded code unit, so it can be directly written to the HEAP.
    var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
    HEAP16[(((outPtr)+(i*2))>>1)]=codeUnit;
  }
  // Null-terminate the pointer to the HEAP.
  HEAP16[(((outPtr)+(str.length*2))>>1)]=0;
}
Module['stringToUTF16'] = stringToUTF16;

// Given a pointer 'ptr' to a null-terminated UTF32LE-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.
function UTF32ToString(ptr) {
  var i = 0;

  var str = '';
  while (1) {
    var utf32 = HEAP32[(((ptr)+(i*4))>>2)];
    if (utf32 == 0)
      return str;
    ++i;
    // Gotcha: fromCharCode constructs a character from a UTF-16 encoded code (pair), not from a Unicode code point! So encode the code point to UTF-16 for constructing.
    if (utf32 >= 0x10000) {
      var ch = utf32 - 0x10000;
      str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
    } else {
      str += String.fromCharCode(utf32);
    }
  }
}
Module['UTF32ToString'] = UTF32ToString;

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF32LE form. The copy will require at most (str.length+1)*4 bytes of space in the HEAP,
// but can use less, since str.length does not return the number of characters in the string, but the number of UTF-16 code units in the string.
function stringToUTF32(str, outPtr) {
  var iChar = 0;
  for(var iCodeUnit = 0; iCodeUnit < str.length; ++iCodeUnit) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
    var codeUnit = str.charCodeAt(iCodeUnit); // possibly a lead surrogate
    if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) {
      var trailSurrogate = str.charCodeAt(++iCodeUnit);
      codeUnit = 0x10000 + ((codeUnit & 0x3FF) << 10) | (trailSurrogate & 0x3FF);
    }
    HEAP32[(((outPtr)+(iChar*4))>>2)]=codeUnit;
    ++iChar;
  }
  // Null-terminate the pointer to the HEAP.
  HEAP32[(((outPtr)+(iChar*4))>>2)]=0;
}
Module['stringToUTF32'] = stringToUTF32;

function demangle(func) {
  var i = 3;
  // params, etc.
  var basicTypes = {
    'v': 'void',
    'b': 'bool',
    'c': 'char',
    's': 'short',
    'i': 'int',
    'l': 'long',
    'f': 'float',
    'd': 'double',
    'w': 'wchar_t',
    'a': 'signed char',
    'h': 'unsigned char',
    't': 'unsigned short',
    'j': 'unsigned int',
    'm': 'unsigned long',
    'x': 'long long',
    'y': 'unsigned long long',
    'z': '...'
  };
  var subs = [];
  var first = true;
  function dump(x) {
    //return;
    if (x) Module.print(x);
    Module.print(func);
    var pre = '';
    for (var a = 0; a < i; a++) pre += ' ';
    Module.print (pre + '^');
  }
  function parseNested() {
    i++;
    if (func[i] === 'K') i++; // ignore const
    var parts = [];
    while (func[i] !== 'E') {
      if (func[i] === 'S') { // substitution
        i++;
        var next = func.indexOf('_', i);
        var num = func.substring(i, next) || 0;
        parts.push(subs[num] || '?');
        i = next+1;
        continue;
      }
      if (func[i] === 'C') { // constructor
        parts.push(parts[parts.length-1]);
        i += 2;
        continue;
      }
      var size = parseInt(func.substr(i));
      var pre = size.toString().length;
      if (!size || !pre) { i--; break; } // counter i++ below us
      var curr = func.substr(i + pre, size);
      parts.push(curr);
      subs.push(curr);
      i += pre + size;
    }
    i++; // skip E
    return parts;
  }
  function parse(rawList, limit, allowVoid) { // main parser
    limit = limit || Infinity;
    var ret = '', list = [];
    function flushList() {
      return '(' + list.join(', ') + ')';
    }
    var name;
    if (func[i] === 'N') {
      // namespaced N-E
      name = parseNested().join('::');
      limit--;
      if (limit === 0) return rawList ? [name] : name;
    } else {
      // not namespaced
      if (func[i] === 'K' || (first && func[i] === 'L')) i++; // ignore const and first 'L'
      var size = parseInt(func.substr(i));
      if (size) {
        var pre = size.toString().length;
        name = func.substr(i + pre, size);
        i += pre + size;
      }
    }
    first = false;
    if (func[i] === 'I') {
      i++;
      var iList = parse(true);
      var iRet = parse(true, 1, true);
      ret += iRet[0] + ' ' + name + '<' + iList.join(', ') + '>';
    } else {
      ret = name;
    }
    paramLoop: while (i < func.length && limit-- > 0) {
      //dump('paramLoop');
      var c = func[i++];
      if (c in basicTypes) {
        list.push(basicTypes[c]);
      } else {
        switch (c) {
          case 'P': list.push(parse(true, 1, true)[0] + '*'); break; // pointer
          case 'R': list.push(parse(true, 1, true)[0] + '&'); break; // reference
          case 'L': { // literal
            i++; // skip basic type
            var end = func.indexOf('E', i);
            var size = end - i;
            list.push(func.substr(i, size));
            i += size + 2; // size + 'EE'
            break;
          }
          case 'A': { // array
            var size = parseInt(func.substr(i));
            i += size.toString().length;
            if (func[i] !== '_') throw '?';
            i++; // skip _
            list.push(parse(true, 1, true)[0] + ' [' + size + ']');
            break;
          }
          case 'E': break paramLoop;
          default: ret += '?' + c; break paramLoop;
        }
      }
    }
    if (!allowVoid && list.length === 1 && list[0] === 'void') list = []; // avoid (void)
    return rawList ? list : ret + flushList();
  }
  try {
    // Special-case the entry point, since its name differs from other name mangling.
    if (func == 'Object._main' || func == '_main') {
      return 'main()';
    }
    if (typeof func === 'number') func = Pointer_stringify(func);
    if (func[0] !== '_') return func;
    if (func[1] !== '_') return func; // C function
    if (func[2] !== 'Z') return func;
    switch (func[3]) {
      case 'n': return 'operator new()';
      case 'd': return 'operator delete()';
    }
    return parse();
  } catch(e) {
    return func;
  }
}

function demangleAll(text) {
  return text.replace(/__Z[\w\d_]+/g, function(x) { var y = demangle(x); return x === y ? x : (x + ' [' + y + ']') });
}

function stackTrace() {
  var stack = new Error().stack;
  return stack ? demangleAll(stack) : '(no stack trace available)'; // Stack trace is not available at least on IE10 and Safari 6.
}

// Memory management

var PAGE_SIZE = 4096;
function alignMemoryPage(x) {
  return (x+4095)&-4096;
}

var HEAP;
var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;

var STATIC_BASE = 0, STATICTOP = 0, staticSealed = false; // static area
var STACK_BASE = 0, STACKTOP = 0, STACK_MAX = 0; // stack area
var DYNAMIC_BASE = 0, DYNAMICTOP = 0; // dynamic area handled by sbrk

function enlargeMemory() {
  abort('Cannot enlarge memory arrays. Either (1) compile with -s TOTAL_MEMORY=X with X higher than the current value ' + TOTAL_MEMORY + ', (2) compile with ALLOW_MEMORY_GROWTH which adjusts the size at runtime but prevents some optimizations, or (3) set Module.TOTAL_MEMORY before the program runs.');
}

var TOTAL_STACK = Module['TOTAL_STACK'] || 5242880;
var TOTAL_MEMORY = Module['TOTAL_MEMORY'] || 7500000;
var FAST_MEMORY = Module['FAST_MEMORY'] || 2097152;


// Initialize the runtime's memory
// check for full engine support (use string 'subarray' to avoid closure compiler confusion)
assert(typeof Int32Array !== 'undefined' && typeof Float64Array !== 'undefined' && !!(new Int32Array(1)['subarray']) && !!(new Int32Array(1)['set']),
       'JS engine does not provide full typed array support');

var buffer = new ArrayBuffer(TOTAL_MEMORY);
HEAP8 = new Int8Array(buffer);
HEAP16 = new Int16Array(buffer);
HEAP32 = new Int32Array(buffer);
HEAPU8 = new Uint8Array(buffer);
HEAPU16 = new Uint16Array(buffer);
HEAPU32 = new Uint32Array(buffer);
HEAPF32 = new Float32Array(buffer);
HEAPF64 = new Float64Array(buffer);

// Endianness check (note: assumes compiler arch was little-endian)
HEAP32[0] = 255;
assert(HEAPU8[0] === 255 && HEAPU8[3] === 0, 'Typed arrays 2 must be run on a little-endian system');

Module['HEAP'] = HEAP;
Module['HEAP8'] = HEAP8;
Module['HEAP16'] = HEAP16;
Module['HEAP32'] = HEAP32;
Module['HEAPU8'] = HEAPU8;
Module['HEAPU16'] = HEAPU16;
Module['HEAPU32'] = HEAPU32;
Module['HEAPF32'] = HEAPF32;
Module['HEAPF64'] = HEAPF64;

function callRuntimeCallbacks(callbacks) {
  while(callbacks.length > 0) {
    var callback = callbacks.shift();
    if (typeof callback == 'function') {
      callback();
      continue;
    }
    var func = callback.func;
    if (typeof func === 'number') {
      if (callback.arg === undefined) {
        Runtime.dynCall('v', func);
      } else {
        Runtime.dynCall('vi', func, [callback.arg]);
      }
    } else {
      func(callback.arg === undefined ? null : callback.arg);
    }
  }
}

var __ATPRERUN__  = []; // functions called before the runtime is initialized
var __ATINIT__    = []; // functions called during startup
var __ATMAIN__    = []; // functions called when main() is to be run
var __ATEXIT__    = []; // functions called during shutdown
var __ATPOSTRUN__ = []; // functions called after the runtime has exited

var runtimeInitialized = false;

function preRun() {
  // compatibility - merge in anything from Module['preRun'] at this time
  if (Module['preRun']) {
    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
    while (Module['preRun'].length) {
      addOnPreRun(Module['preRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPRERUN__);
}

function ensureInitRuntime() {
  if (runtimeInitialized) return;
  runtimeInitialized = true;
  callRuntimeCallbacks(__ATINIT__);
}

function preMain() {
  callRuntimeCallbacks(__ATMAIN__);
}

function exitRuntime() {
  if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
    Module.printErr('Exiting runtime. Any attempt to access the compiled C code may fail from now. If you want to keep the runtime alive, set Module["noExitRuntime"] = true or build with -s NO_EXIT_RUNTIME=1');
  }
  callRuntimeCallbacks(__ATEXIT__);
}

function postRun() {
  // compatibility - merge in anything from Module['postRun'] at this time
  if (Module['postRun']) {
    if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
    while (Module['postRun'].length) {
      addOnPostRun(Module['postRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPOSTRUN__);
}

function addOnPreRun(cb) {
  __ATPRERUN__.unshift(cb);
}
Module['addOnPreRun'] = Module.addOnPreRun = addOnPreRun;

function addOnInit(cb) {
  __ATINIT__.unshift(cb);
}
Module['addOnInit'] = Module.addOnInit = addOnInit;

function addOnPreMain(cb) {
  __ATMAIN__.unshift(cb);
}
Module['addOnPreMain'] = Module.addOnPreMain = addOnPreMain;

function addOnExit(cb) {
  __ATEXIT__.unshift(cb);
}
Module['addOnExit'] = Module.addOnExit = addOnExit;

function addOnPostRun(cb) {
  __ATPOSTRUN__.unshift(cb);
}
Module['addOnPostRun'] = Module.addOnPostRun = addOnPostRun;

// Tools

// This processes a JS string into a C-line array of numbers, 0-terminated.
// For LLVM-originating strings, see parser.js:parseLLVMString function
function intArrayFromString(stringy, dontAddNull, length /* optional */) {
  var ret = (new Runtime.UTF8Processor()).processJSString(stringy);
  if (length) {
    ret.length = length;
  }
  if (!dontAddNull) {
    ret.push(0);
  }
  return ret;
}
Module['intArrayFromString'] = intArrayFromString;

function intArrayToString(array) {
  var ret = [];
  for (var i = 0; i < array.length; i++) {
    var chr = array[i];
    if (chr > 0xFF) {
        assert(false, 'Character code ' + chr + ' (' + String.fromCharCode(chr) + ')  at offset ' + i + ' not in 0x00-0xFF.');
      chr &= 0xFF;
    }
    ret.push(String.fromCharCode(chr));
  }
  return ret.join('');
}
Module['intArrayToString'] = intArrayToString;

// Write a Javascript array to somewhere in the heap
function writeStringToMemory(string, buffer, dontAddNull) {
  var array = intArrayFromString(string, dontAddNull);
  var i = 0;
  while (i < array.length) {
    var chr = array[i];
    HEAP8[(((buffer)+(i))|0)]=chr;
    i = i + 1;
  }
}
Module['writeStringToMemory'] = writeStringToMemory;

function writeArrayToMemory(array, buffer) {
  for (var i = 0; i < array.length; i++) {
    HEAP8[(((buffer)+(i))|0)]=array[i];
  }
}
Module['writeArrayToMemory'] = writeArrayToMemory;

function writeAsciiToMemory(str, buffer, dontAddNull) {
  for (var i = 0; i < str.length; i++) {
    assert(str.charCodeAt(i) === str.charCodeAt(i)&0xff);
    HEAP8[(((buffer)+(i))|0)]=str.charCodeAt(i);
  }
  if (!dontAddNull) HEAP8[(((buffer)+(str.length))|0)]=0;
}
Module['writeAsciiToMemory'] = writeAsciiToMemory;

function unSign(value, bits, ignore) {
  if (value >= 0) {
    return value;
  }
  return bits <= 32 ? 2*Math.abs(1 << (bits-1)) + value // Need some trickery, since if bits == 32, we are right at the limit of the bits JS uses in bitshifts
                    : Math.pow(2, bits)         + value;
}
function reSign(value, bits, ignore) {
  if (value <= 0) {
    return value;
  }
  var half = bits <= 32 ? Math.abs(1 << (bits-1)) // abs is needed if bits == 32
                        : Math.pow(2, bits-1);
  if (value >= half && (bits <= 32 || value > half)) { // for huge values, we can hit the precision limit and always get true here. so don't do that
                                                       // but, in general there is no perfect solution here. With 64-bit ints, we get rounding and errors
                                                       // TODO: In i64 mode 1, resign the two parts separately and safely
    value = -2*half + value; // Cannot bitshift half, as it may be at the limit of the bits JS uses in bitshifts
  }
  return value;
}

// check for imul support, and also for correctness ( https://bugs.webkit.org/show_bug.cgi?id=126345 )
if (!Math['imul'] || Math['imul'](0xffffffff, 5) !== -5) Math['imul'] = function imul(a, b) {
  var ah  = a >>> 16;
  var al = a & 0xffff;
  var bh  = b >>> 16;
  var bl = b & 0xffff;
  return (al*bl + ((ah*bl + al*bh) << 16))|0;
};
Math.imul = Math['imul'];


var Math_abs = Math.abs;
var Math_cos = Math.cos;
var Math_sin = Math.sin;
var Math_tan = Math.tan;
var Math_acos = Math.acos;
var Math_asin = Math.asin;
var Math_atan = Math.atan;
var Math_atan2 = Math.atan2;
var Math_exp = Math.exp;
var Math_log = Math.log;
var Math_sqrt = Math.sqrt;
var Math_ceil = Math.ceil;
var Math_floor = Math.floor;
var Math_pow = Math.pow;
var Math_imul = Math.imul;
var Math_fround = Math.fround;
var Math_min = Math.min;

// A counter of dependencies for calling run(). If we need to
// do asynchronous work before running, increment this and
// decrement it. Incrementing must happen in a place like
// PRE_RUN_ADDITIONS (used by emcc to add file preloading).
// Note that you can add dependencies in preRun, even though
// it happens right before run - run will be postponed until
// the dependencies are met.
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null; // overridden to take different actions when all run dependencies are fulfilled
var runDependencyTracking = {};

function addRunDependency(id) {
  runDependencies++;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
  if (id) {
    assert(!runDependencyTracking[id]);
    runDependencyTracking[id] = 1;
    if (runDependencyWatcher === null && typeof setInterval !== 'undefined') {
      // Check for missing dependencies every few seconds
      runDependencyWatcher = setInterval(function() {
        var shown = false;
        for (var dep in runDependencyTracking) {
          if (!shown) {
            shown = true;
            Module.printErr('still waiting on run dependencies:');
          }
          Module.printErr('dependency: ' + dep);
        }
        if (shown) {
          Module.printErr('(end of list)');
        }
      }, 10000);
    }
  } else {
    Module.printErr('warning: run dependency added without ID');
  }
}
Module['addRunDependency'] = addRunDependency;
function removeRunDependency(id) {
  runDependencies--;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
  if (id) {
    assert(runDependencyTracking[id]);
    delete runDependencyTracking[id];
  } else {
    Module.printErr('warning: run dependency removed without ID');
  }
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    }
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback(); // can add another dependenciesFulfilled
    }
  }
}
Module['removeRunDependency'] = removeRunDependency;

Module["preloadedImages"] = {}; // maps url to image data
Module["preloadedAudios"] = {}; // maps url to audio data


var memoryInitializer = null;

// === Body ===



STATIC_BASE = 8;

STATICTOP = STATIC_BASE + 82504;


/* global initializers */ __ATINIT__.push({ func: function() { runPostSets() } });



var _stderr;
var _stderr=_stderr=allocate(1, "i32*", ALLOC_STATIC);































































































































































































































































































































































/* memory initializer */ allocate([0,0,0,0,0,0,112,0,64,64,64,64,64,64,191,64,64,64,64,64,64,64,64,64,0,8,0,0,0,0,0,0,0,0,0,0,1,0,0,0,11,0,0,0,19,0,0,0,30,0,0,0,36,0,0,0,47,0,0,0,55,0,0,0,66,0,0,0,77,0,0,0,88,0,0,0,99,0,0,0,100,0,0,0,101,0,0,0,102,0,0,0,103,0,0,0,104,0,0,0,105,0,0,0,106,0,0,0,107,0,0,0,108,0,0,0,109,0,0,0,110,0,0,0,111,0,0,0,112,0,0,0,113,0,0,0,114,0,0,0,115,0,0,0,116,0,0,0,117,0,0,0,118,0,0,0,119,0,0,0,120,0,0,0,121,0,0,0,132,0,0,0,143,0,0,0,154,0,0,0,165,0,0,0,176,0,0,0,187,0,0,0,198,0,0,0,209,0,0,0,220,0,0,0,229,0,0,0,239,0,0,0,245,0,0,0,252,0,0,0,2,1,0,0,12,1,0,0,23,1,0,0,34,1,0,0,45,1,0,0,56,1,0,0,67,1,0,0,78,1,0,0,89,1,0,0,100,1,0,0,111,1,0,0,122,1,0,0,131,1,0,0,140,1,0,0,149,1,0,0,157,1,0,0,166,1,0,0,177,1,0,0,188,1,0,0,199,1,0,0,210,1,0,0,221,1,0,0,232,1,0,0,243,1,0,0,254,1,0,0,9,2,0,0,20,2,0,0,31,2,0,0,42,2,0,0,53,2,0,0,64,2,0,0,75,2,0,0,86,2,0,0,97,2,0,0,108,2,0,0,119,2,0,0,130,2,0,0,141,2,0,0,152,2,0,0,163,2,0,0,174,2,0,0,185,2,0,0,196,2,0,0,207,2,0,0,218,2,0,0,229,2,0,0,240,2,0,0,251,2,0,0,6,3,0,0,10,3,0,0,20,3,0,0,29,3,0,0,40,3,0,0,49,3,0,0,60,3,0,0,69,3,0,0,80,3,0,0,89,3,0,0,100,3,0,0,111,3,0,0,122,3,0,0,133,3,0,0,144,3,0,0,153,3,0,0,162,3,0,0,171,3,0,0,180,3,0,0,189,3,0,0,198,3,0,0,207,3,0,0,218,3,0,0,227,3,0,0,236,3,0,0,245,3,0,0,254,3,0,0,7,4,0,0,16,4,0,0,26,4,0,0,37,4,0,0,47,4,0,0,57,4,0,0,66,4,0,0,67,4,0,0,78,4,0,0,89,4,0,0,100,4,0,0,106,4,0,0,117,4,0,0,128,4,0,0,139,4,0,0,145,4,0,0,156,4,0,0,167,4,0,0,178,4,0,0,184,4,0,0,195,4,0,0,206,4,0,0,217,4,0,0,228,4,0,0,231,4,0,0,242,4,0,0,253,4,0,0,8,5,0,0,10,5,0,0,21,5,0,0,32,5,0,0,43,5,0,0,54,5,0,0,65,5,0,0,76,5,0,0,87,5,0,0,98,5,0,0,105,5,0,0,10,1,255,255,192,0,0,0,0,9,0,3,255,255,192,0,0,0,11,0,255,255,255,252,0,0,0,0,7,0,5,255,255,255,252,11,0,255,255,192,0,5,106,86,160,9,0,3,255,255,213,169,90,128,11,0,130,8,56,28,129,129,56,0,11,0,0,146,79,36,145,241,4,16,0,11,0,0,130,8,56,60,131,136,32,0,11,0,0,138,40,148,33,241,4,16,0,3,0,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,0,48,195,12,0,195,0,0,0,11,0,0,219,100,164,0,0,0,0,0,11,0,0,81,79,148,249,69,0,0,0,11,0,0,33,234,28,43,194,0,0,0,11,0,0,66,148,132,41,88,128,0,0,11,0,0,33,66,20,142,39,64,0,0,11,0,0,48,193,8,0,0,0,0,0,11,0,0,16,132,16,64,129,0,0,0,11,0,0,64,129,4,16,132,0,0,0,9,0,2,169,194,28,168,0,0,10,0,1,32,143,136,32,0,0,0,7,0,5,48,193,8,0,8,4,120,0,0,0,0,7,5,48,192,0,0,10,1,4,33,8,66,0,0,0,11,0,0,114,41,170,202,39,0,0,0,11,0,0,33,130,8,32,135,0,0,0,11,0,0,114,32,156,130,15,128,0,0,11,0,0,248,66,4,10,39,0,0,0,11,0,0,16,197,36,248,65,0,0,0,11,0,0,242,15,2,10,39,0,0,0,11,0,0,57,8,60,138,39,0,0,0,11,0,0,248,32,132,33,8,0,0,0,11,0,0,114,40,156,138,39,0,0,0,11,0,0,114,40,158,8,78,0,0,0,9,0,2,48,192,12,48,0,0,9,0,2,48,192,12,48,66,0,9,0,2,16,132,8,16,0,0,9,0,3,120,7,128,0,0,0,9,2,64,129,8,64,0,0,11,0,0,114,32,132,32,2,0,0,0,11,0,0,35,224,132,33,15,128,0,0,11,0,0,33,72,162,250,40,128,0,0,11,0,0,242,40,188,138,47,0,0,0,11,0,0,114,40,32,130,39,0,0,0,11,0,0,242,40,162,138,47,0,0,0,11,0,0,250,8,60,130,15,128,0,0,11,0,0,250,8,60,130,8,0,0,0,11,0,0,114,8,38,138,39,128,0,0,11,0,0,138,40,190,138,40,128,0,0,11,0,0,112,130,8,32,135,0,0,0,11,0,0,56,65,4,18,70,0,0,0,11,0,0,138,74,48,162,72,128,0,0,11,0,0,130,8,32,130,15,128,0,0,11,0,0,139,106,162,138,40,128,0,0,11,0,0,139,42,166,138,40,128,0,0,11,0,0,114,40,162,138,39,0,0,0,11,0,0,242,40,188,130,8,0,0,0,11,0,0,114,40,162,154,39,128,0,0,11,0,0,242,40,188,162,72,128,0,0,11,0,0,114,40,28,10,39,0,0,0,11,0,0,248,130,8,32,130,0,0,0,11,0,0,138,40,162,138,39,0,0,0,11,0,0,138,40,162,137,66,0,0,0,11,0,0,138,40,162,170,165,0,0,0,11,0,0,137,66,8,33,72,128,0,0,11,0,0,137,66,8,32,130,0,0,0,11,0,0,248,33,8,66,15,128,0,0,11,0,0,33,200,28,10,39,0,0,0,11,0,0,242,40,186,138,47,0,0,0,11,0,0,33,200,160,130,39,0,0,0,11,0,0,49,200,160,130,39,0,0,0,6,0,7,248,0,0,1,115,225,8,67,224,0,0,9,0,2,112,39,162,120,0,0,11,0,0,130,15,34,138,47,0,0,0,9,0,2,114,40,34,112,0,0,11,0,0,8,39,162,138,39,128,0,0,9,0,2,114,47,160,112,0,0,11,0,0,24,130,28,32,130,0,0,0,9,0,2,122,40,158,10,39,0,11,0,0,130,11,50,138,40,128,0,0,11,0,0,32,2,8,32,130,0,0,0,11,0,0,16,3,4,16,65,36,96,0,11,0,0,65,4,148,97,68,128,0,0,11,0,0,96,130,8,32,135,0,0,0,9,0,2,242,170,170,168,0,0,9,0,2,226,73,36,144,0,0,9,0,2,114,40,162,112,0,0,9,0,2,242,40,162,242,8,0,9,0,2,122,40,162,120,32,128,9,0,2,179,8,32,128,0,0,9,0,2,114,7,2,240,0,0,11,0,0,65,7,16,65,3,0,0,0,9,0,2,138,40,162,112,0,0,9,0,2,138,40,148,32,0,0,9,0,2,170,170,170,112,0,0,9,0,2,137,66,20,136,0,0,9,0,2,138,36,140,16,140,0,9,0,2,248,66,16,248,0,0,10,0,1,81,200,28,11,192,0,0,11,0,0,8,112,158,138,39,128,0,0,10,0,1,33,200,160,137,192,0,0,10,0,1,81,200,160,137,192,0,0,9,0,2,82,165,42,82,160,0,3,0,10,0,227,142,56,224,0,0,0,0,11,0,0,28,113,199,28,0,0,0,0,11,0,0,255,255,255,252,0,0,0,0,7,0,5,227,142,56,224,11,0,227,142,56,227,142,56,227,128,11,0,0,28,113,199,31,142,56,227,128,11,0,0,255,255,255,255,142,56,227,128,7,0,5,28,113,199,28,11,0,227,142,56,224,113,199,28,112,11,0,0,28,113,199,28,113,199,28,112,11,0,0,255,255,255,252,113,199,28,112,7,0,5,255,255,255,252,11,0,227,142,56,227,255,255,255,240,11,0,0,28,113,199,31,255,255,255,240,11,0,0,255,255,255,255,255,255,255,240,11,0,0,255,240,0,0,0,0,0,0,5,0,8,255,240,0,195,12,48,195,12,48,195,0,11,0,0,12,48,195,12,48,195,12,48,11,0,0,252,0,0,0,0,0,0,0,4,0,9,252,0,130,8,32,130,8,32,130,0,11,0,0,4,16,65,4,16,65,4,16,11,0,0,113,4,16,65,7,0,0,0,11,0,0,112,65,4,16,71,0,0,0,11,0,0,16,130,16,32,129,0,0,0,11,0,0,64,130,4,32,132,0,0,0,11,0,0,4,16,130,16,66,8,65,0,11,0,0,130,4,16,32,129,4,8,32,8,0,4,48,192,0,0,0,9,3,49,231,140,0,0,0,3,0,0,0,0,0,0,0,44,0,0,0,0,0,0,0,9,0,0,0,0,0,0,0,37,117,0,0,0,0,0,0,35,37,48,50,88,0,0,0,68,66,9,37,115,0,0,0,37,117,44,37,117,0,0,0,35,37,48,50,88,44,35,37,48,50,88,0,0,0,0,0,42,42,42,32,66,73,79,83,32,83,69,84,83,69,67,32,37,100,10,0,0,0,0,0,77,0,0,0,0,0,0,0,80,0,0,0,0,0,0,0,67,80,73,0,0,0,0,0,80,69,0,0,0,0,0,0,80,79,0,0,0,0,0,0,78,67,0,0,0,0,0,0,90,0,0,0,0,0,0,0,78,90,0,0,0,0,0,0,65,70,0,0,0,0,0,0,83,80,0,0,0,0,0,0,72,76,0,0,0,0,0,0,42,42,42,32,66,73,79,83,32,83,69,84,84,82,75,32,37,100,10,0,0,0,0,0,68,69,0,0,0,0,0,0,66,67,0,0,0,0,0,0,67,80,68,82,0,0,0,0,65,0,0,0,0,0,0,0,40,72,76,41,0,0,0,0,76,0,0,0,0,0,0,0,72,0,0,0,0,0,0,0,69,0,0,0,0,0,0,0,68,0,0,0,0,0,0,0,67,0,0,0,0,0,0,0,66,0,0,0,0,0,0,0,42,42,42,32,66,73,79,83,32,83,69,76,68,83,75,32,37,100,10,0,0,0,0,0,78,79,80,89,0,0,0,0,78,79,80,88,0,0,0,0,67,80,68,0,0,0,0,0,88,83,76,84,0,0,0,0,88,79,82,0,0,0,0,0,83,85,66,0,0,0,0,0,83,82,76,0,0,0,0,0,83,82,65,0,0,0,0,0,83,76,76,0,0,0,0,0,83,76,73,0,0,0,0,0,83,76,65,0,0,0,0,0,42,42,42,32,66,73,79,83,32,67,79,78,79,85,84,32,37,100,10,0,0,0,0,0,83,69,84,0,0,0,0,0,83,67,70,0,0,0,0,0,67,80,0,0,0,0,0,0,83,66,67,0,0,0,0,0,82,83,84,0,0,0,0,0,82,82,68,0,0,0,0,0,82,82,67,65,0,0,0,0,82,82,67,0,0,0,0,0,82,82,65,0,0,0,0,0,82,82,0,0,0,0,0,0,82,76,68,0,0,0,0,0,42,42,42,32,73,78,32,37,115,32,61,32,37,88,10,0,82,76,67,65,0,0,0,0,82,76,67,0,0,0,0,0,67,67,70,0,0,0,0,0,82,76,65,0,0,0,0,0,82,76,0,0,0,0,0,0,82,69,84,78,0,0,0,0,82,69,84,73,0,0,0,0,82,69,84,0,0,0,0,0,82,69,83,0,0,0,0,0,80,85,83,72,0,0,0,0,80,79,80,0,0,0,0,0,79,85,84,73,0,0,0,0,79,85,84,68,0,0,0,0,67,65,76,76,0,0,0,0,79,85,84,0,0,0,0,0,79,84,73,82,0,0,0,0,79,84,68,82,0,0,0,0,79,82,0,0,0,0,0,0,78,79,80,0,0,0,0,0,78,69,71,0,0,0,0,0,76,68,73,82,0,0,0,0,76,68,73,0,0,0,0,0,42,42,42,32,79,85,84,32,37,115,32,61,32,37,88,10,0,0,0,0,0,0,0,0,76,68,68,82,0,0,0,0,76,68,68,0,0,0,0,0,66,73,84,0,0,0,0,0,76,68,0,0,0,0,0,0,74,82,0,0,0,0,0,0,74,80,0,0,0,0,0,0,73,78,73,82,0,0,0,0,73,78,73,0,0,0,0,0,73,78,68,82,0,0,0,0,73,78,68,0,0,0,0,0,73,78,67,0,0,0,0,0,66,114,97,110,106,101,32,122,97,103,111,110,115,107,101,32,115,108,101,100,105,32,105,122,32,115,108,105,107,101,32,100,105,115,107,101,116,101,32,110,105,32,117,115,112,101,108,111,46,0,0,0,0,0,0,0,68,105,97,108,111,103,69,109,0,0,0,0,0,0,0,0,73,78,0,0,0,0,0,0,73,77,0,0,0,0,0,0,65,78,68,0,0,0,0,0,72,65,76,84,0,0,0,0,69,88,88,0,0,0,0,0,69,88,0,0,0,0,0,0,69,73,0,0,0,0,0,0,68,74,78,90,0,0,0,0,42,42,42,32,79,102,102,115,101,116,58,32,37,88,10,0,68,73,0,0,0,0,0,0,77,101,103,97,100,105,115,107,46,105,109,103,0,0,0,0,62,62,62,32,37,88,9,0,68,69,67,0,0,0,0,0,73,110,105,99,105,97,108,105,122,97,99,105,106,97,32,83,68,76,32,110,105,32,117,115,112,101,108,97,46,0,0,0,41,0,0,0,0,0,0,0,50,0,0,0,0,0,0,0,49,0,0,0,0,0,0,0,48,0,0,0,0,0,0,0,40,73,89,37,99,37,100,41,0,0,0,0,0,0,0,0,40,73,88,37,99,37,100,41,0,0,0,0,0,0,0,0,40,73,89,41,0,0,0,0,42,42,42,32,66,73,79,83,32,87,82,73,84,69,10,0,40,73,88,41,0,0,0,0,40,68,69,41,0,0,0,0,68,65,65,0,0,0,0,0,40,66,67,41,0,0,0,0,40,83,80,41,0,0,0,0,73,89,0,0,0,0,0,0,73,88,0,0,0,0,0,0,65,70,39,0,0,0,0,0,73,0,0,0,0,0,0,0,114,98,0,0,0,0,0,0,73,110,105,99,105,97,108,105,122,97,99,105,106,97,32,103,114,97,102,105,107,101,32,110,105,32,117,115,112,101,108,97,46,0,0,0,0,0,0,0,82,0,0,0,0,0,0,0,89,76,0,0,0,0,0,0,42,42,42,32,66,73,79,83,32,82,69,65,68,10,0,0,89,72,0,0,0,0,0,0,88,76,0,0,0,0,0,0,67,80,76,0,0,0,0,0,88,72,0,0,0,0,0,0,40,37,117,41,0,0,0,0,40,35,37,48,50,88,41,0,40,67,41,0,0,0,0,0,40,0,0,0,0,0,0,0,37,115,43,50,0,0,0,0,37,115,43,49,0,0,0,0,37,115,45,50,0,0,0,0,42,42,42,32,66,73,79,83,32,83,69,84,68,77,65,32,37,88,10,0,0,0,0,0,37,115,45,49,0,0,0,0,35,37,48,52,88,0,0,0,67,80,73,82,0,0,0,0,65,68,68,0,0,0,0,0,65,68,67,0,0,0,0,0,0,16,16,16,0,0,0,16,56,9,0,0,48,9,0,0,40,9,0,0,32,9,0,0,24,9,0,0,16,9,0,0,8,9,0,0,0,9,0,0,240,8,0,0,232,8,0,0,200,8,0,0,184,8,0,0,240,8,0,0,232,8,0,0,200,8,0,0,192,8,0,0,176,8,0,0,168,8,0,0,160,8,0,0,48,9,0,0,152,8,0,0,144,8,0,0,128,8,0,0,120,8,0,0,176,13,0,0,168,13,0,0,168,11,0,0,8,11,0,0,152,10,0,0,64,10,0,0,216,9,0,0,104,9,0,0,248,8,0,0,136,8,0,0,160,13,0,0,48,13,0,0,152,12,0,0,8,12,0,0,232,11,0,0,208,11,0,0,200,11,0,0,192,11,0,0,184,11,0,0,176,11,0,0,160,11,0,0,152,11,0,0,72,11,0,0,64,11,0,0,56,11,0,0,48,11,0,0,40,11,0,0,32,11,0,0,24,11,0,0,16,11,0,0,0,11,0,0,248,10,0,0,216,10,0,0,208,10,0,0,200,10,0,0,192,10,0,0,184,10,0,0,176,10,0,0,168,10,0,0,160,10,0,0,144,10,0,0,136,10,0,0,128,10,0,0,120,10,0,0,112,10,0,0,104,10,0,0,96,10,0,0,88,10,0,0,80,10,0,0,72,10,0,0,56,10,0,0,48,10,0,0,24,10,0,0,16,10,0,0,8,10,0,0,0,10,0,0,248,9,0,0,240,9,0,0,232,9,0,0,224,9,0,0,208,9,0,0,200,9,0,0,168,9,0,0,160,9,0,0,152,9,0,0,144,9,0,0,136,9,0,0,128,9,0,0,120,9,0,0,112,9,0,0,96,9,0,0,88,9,0,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,1,1,1,0,0,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,70,0,0,0,221,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,71,0,0,0,253,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,50,0,0,0,221,203,0,6,255,255,0,255,33,0,0,0,0,0,0,0,0,0,0,0,55,0,0,0,221,203,0,14,255,255,0,255,33,0,0,0,0,0,0,0,0,0,0,0,48,0,0,0,221,203,0,22,255,255,0,255,33,0,0,0,0,0,0,0,0,0,0,0,53,0,0,0,221,203,0,30,255,255,0,255,33,0,0,0,0,0,0,0,0,0,0,0,62,0,0,0,221,203,0,38,255,255,0,255,33,0,0,0,0,0,0,0,0,0,0,0,65,0,0,0,221,203,0,46,255,255,0,255,33,0,0,0,0,0,0,0,0,0,0,0,64,0,0,0,221,203,0,54,255,255,0,255,33,0,0,0,0,0,0,0,0,0,0,0,63,0,0,0,221,203,0,54,255,255,0,255,33,0,0,0,0,0,0,0,0,0,0,0,66,0,0,0,221,203,0,62,255,255,0,255,33,0,0,0,0,0,0,0,0,0,0,0,44,0,0,0,221,203,0,134,255,255,0,199,39,0,0,0,33,0,0,0,0,0,0,0,61,0,0,0,221,203,0,198,255,255,0,199,39,0,0,0,33,0,0,0,0,0,0,0,50,0,0,0,253,203,0,6,255,255,0,255,34,0,0,0,0,0,0,0,0,0,0,0,55,0,0,0,253,203,0,14,255,255,0,255,34,0,0,0,0,0,0,0,0,0,0,0,48,0,0,0,253,203,0,22,255,255,0,255,34,0,0,0,0,0,0,0,0,0,0,0,53,0,0,0,253,203,0,30,255,255,0,255,34,0,0,0,0,0,0,0,0,0,0,0,62,0,0,0,253,203,0,38,255,255,0,255,34,0,0,0,0,0,0,0,0,0,0,0,65,0,0,0,253,203,0,46,255,255,0,255,34,0,0,0,0,0,0,0,0,0,0,0,64,0,0,0,253,203,0,54,255,255,0,255,34,0,0,0,0,0,0,0,0,0,0,0,63,0,0,0,253,203,0,54,255,255,0,255,34,0,0,0,0,0,0,0,0,0,0,0,66,0,0,0,253,203,0,62,255,255,0,255,34,0,0,0,0,0,0,0,0,0,0,0,44,0,0,0,253,203,0,134,255,255,0,199,39,0,0,0,34,0,0,0,0,0,0,0,61,0,0,0,253,203,0,198,255,255,0,199,39,0,0,0,34,0,0,0,0,0,0,0,50,0,0,0,221,203,0,0,255,255,0,248,33,0,0,0,7,0,0,0,0,0,0,0,55,0,0,0,221,203,0,8,255,255,0,248,33,0,0,0,7,0,0,0,0,0,0,0,48,0,0,0,221,203,0,16,255,255,0,248,33,0,0,0,7,0,0,0,0,0,0,0,53,0,0,0,221,203,0,24,255,255,0,248,33,0,0,0,7,0,0,0,0,0,0,0,62,0,0,0,221,203,0,32,255,255,0,248,33,0,0,0,7,0,0,0,0,0,0,0,65,0,0,0,221,203,0,40,255,255,0,248,33,0,0,0,7,0,0,0,0,0,0,0,64,0,0,0,221,203,0,48,255,255,0,248,33,0,0,0,7,0,0,0,0,0,0,0,63,0,0,0,221,203,0,48,255,255,0,248,33,0,0,0,7,0,0,0,0,0,0,0,66,0,0,0,221,203,0,56,255,255,0,248,33,0,0,0,7,0,0,0,0,0,0,0,3,0,0,0,221,203,0,70,255,255,0,199,39,0,0,0,33,0,0,0,0,0,0,0,3,0,0,0,221,203,0,64,255,255,0,192,39,0,0,0,33,0,0,0,7,0,0,0,44,0,0,0,221,203,0,128,255,255,0,192,39,0,0,0,33,0,0,0,7,0,0,0,61,0,0,0,221,203,0,192,255,255,0,192,39,0,0,0,33,0,0,0,7,0,0,0,50,0,0,0,253,203,0,0,255,255,0,248,34,0,0,0,7,0,0,0,0,0,0,0,55,0,0,0,253,203,0,8,255,255,0,248,34,0,0,0,7,0,0,0,0,0,0,0,48,0,0,0,253,203,0,16,255,255,0,248,34,0,0,0,7,0,0,0,0,0,0,0,53,0,0,0,253,203,0,24,255,255,0,248,34,0,0,0,7,0,0,0,0,0,0,0,62,0,0,0,253,203,0,32,255,255,0,248,34,0,0,0,7,0,0,0,0,0,0,0,65,0,0,0,253,203,0,40,255,255,0,248,34,0,0,0,7,0,0,0,0,0,0,0,64,0,0,0,253,203,0,48,255,255,0,248,34,0,0,0,7,0,0,0,0,0,0,0,63,0,0,0,253,203,0,48,255,255,0,248,34,0,0,0,7,0,0,0,0,0,0,0,66,0,0,0,253,203,0,56,255,255,0,248,34,0,0,0,7,0,0,0,0,0,0,0,3,0,0,0,253,203,0,70,255,255,0,199,39,0,0,0,34,0,0,0,0,0,0,0,3,0,0,0,253,203,0,64,255,255,0,192,39,0,0,0,34,0,0,0,7,0,0,0,44,0,0,0,253,203,0,128,255,255,0,192,39,0,0,0,34,0,0,0,7,0,0,0,61,0,0,0,253,203,0,192,255,255,0,192,39,0,0,0,34,0,0,0,7,0,0,0,50,0,0,0,203,0,0,0,255,248,0,0,6,0,0,0,0,0,0,0,0,0,0,0,55,0,0,0,203,8,0,0,255,248,0,0,6,0,0,0,0,0,0,0,0,0,0,0,48,0,0,0,203,16,0,0,255,248,0,0,6,0,0,0,0,0,0,0,0,0,0,0,53,0,0,0,203,24,0,0,255,248,0,0,6,0,0,0,0,0,0,0,0,0,0,0,62,0,0,0,203,32,0,0,255,248,0,0,6,0,0,0,0,0,0,0,0,0,0,0,65,0,0,0,203,40,0,0,255,248,0,0,6,0,0,0,0,0,0,0,0,0,0,0,64,0,0,0,203,48,0,0,255,248,0,0,6,0,0,0,0,0,0,0,0,0,0,0,63,0,0,0,203,48,0,0,255,248,0,0,6,0,0,0,0,0,0,0,0,0,0,0,66,0,0,0,203,56,0,0,255,248,0,0,6,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,203,64,0,0,255,192,0,0,39,0,0,0,6,0,0,0,0,0,0,0,44,0,0,0,203,128,0,0,255,192,0,0,39,0,0,0,6,0,0,0,0,0,0,0,61,0,0,0,203,192,0,0,255,192,0,0,39,0,0,0,6,0,0,0,0,0,0,0,69,0,0,0,237,251,0,0,255,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,32,0,0,0,237,160,0,0,255,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,33,0,0,0,237,176,0,0,255,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,9,0,0,0,237,161,0,0,255,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10,0,0,0,237,177,0,0,255,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,25,0,0,0,237,162,0,0,255,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,26,0,0,0,237,178,0,0,255,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,41,0,0,0,237,163,0,0,255,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,38,0,0,0,237,179,0,0,255,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,30,0,0,0,237,168,0,0,255,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,31,0,0,0,237,184,0,0,255,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,0,0,0,237,169,0,0,255,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,0,0,0,237,185,0,0,255,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,23,0,0,0,237,170,0,0,255,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,24,0,0,0,237,186,0,0,255,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,40,0,0,0,237,171,0,0,255,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,37,0,0,0,237,187,0,0,255,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,57,0,0,0,237,103,0,0,255,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,52,0,0,0,237,111,0,0,255,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,21,0,0,0,237,112,0,0,255,255,0,0,10,0,0,0,0,0,0,0,0,0,0,0,39,0,0,0,237,113,0,0,255,255,0,0,10,0,0,0,41,0,0,0,0,0,0,0,29,0,0,0,237,71,0,0,255,255,0,0,18,0,0,0,16,0,0,0,0,0,0,0,29,0,0,0,237,87,0,0,255,255,0,0,16,0,0,0,18,0,0,0,0,0,0,0,29,0,0,0,237,79,0,0,255,255,0,0,17,0,0,0,16,0,0,0,0,0,0,0,29,0,0,0,237,95,0,0,255,255,0,0,16,0,0,0,17,0,0,0,0,0,0,0,47,0,0,0,237,69,0,0,255,207,0,0,0,0,0,0,0,0,0,0,0,0,0,0,46,0,0,0,237,77,0,0,255,207,0,0,0,0,0,0,0,0,0,0,0,0,0,0,59,0,0,0,237,66,0,0,255,207,0,0,25,0,0,0,19,0,0,0,0,0,0,0,0,0,0,0,237,74,0,0,255,207,0,0,25,0,0,0,19,0,0,0,0,0,0,0,29,0,0,0,237,67,0,0,255,207,0,0,5,0,0,0,19,0,0,0,0,0,0,0,29,0,0,0,237,75,0,0,255,207,0,0,19,0,0,0,5,0,0,0,0,0,0,0,34,0,0,0,237,68,0,0,255,199,0,0,0,0,0,0,0,0,0,0,0,0,0,0,21,0,0,0,237,64,0,0,255,199,0,0,9,0,0,0,10,0,0,0,0,0,0,0,39,0,0,0,237,65,0,0,255,199,0,0,10,0,0,0,9,0,0,0,0,0,0,0,20,0,0,0,237,94,0,0,255,223,0,0,43,0,0,0,0,0,0,0,0,0,0,0,20,0,0,0,237,86,0,0,255,223,0,0,42,0,0,0,0,0,0,0,0,0,0,0,20,0,0,0,237,70,0,0,255,215,0,0,41,0,0,0,0,0,0,0,0,0,0,0,29,0,0,0,221,249,0,0,255,255,0,0,28,0,0,0,26,0,0,0,0,0,0,0,29,0,0,0,253,249,0,0,255,255,0,0,28,0,0,0,27,0,0,0,0,0,0,0,17,0,0,0,221,227,0,0,255,255,0,0,29,0,0,0,26,0,0,0,0,0,0,0,17,0,0,0,221,227,0,0,255,255,0,0,26,0,0,0,29,0,0,0,0,0,0,0,17,0,0,0,253,227,0,0,255,255,0,0,29,0,0,0,27,0,0,0,0,0,0,0,17,0,0,0,253,227,0,0,255,255,0,0,27,0,0,0,29,0,0,0,0,0,0,0,27,0,0,0,221,233,0,0,255,255,0,0,35,0,0,0,0,0,0,0,0,0,0,0,27,0,0,0,253,233,0,0,255,255,0,0,36,0,0,0,0,0,0,0,0,0,0,0,27,0,0,0,221,233,0,0,255,255,0,0,26,0,0,0,0,0,0,0,0,0,0,0,27,0,0,0,253,233,0,0,255,255,0,0,27,0,0,0,0,0,0,0,0,0,0,0,42,0,0,0,221,225,0,0,255,255,0,0,26,0,0,0,0,0,0,0,0,0,0,0,43,0,0,0,221,229,0,0,255,255,0,0,26,0,0,0,0,0,0,0,0,0,0,0,42,0,0,0,253,225,0,0,255,255,0,0,27,0,0,0,0,0,0,0,0,0,0,0,43,0,0,0,253,229,0,0,255,255,0,0,27,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,221,134,0,0,255,255,0,0,16,0,0,0,33,0,0,0,0,0,0,0,1,0,0,0,221,134,0,0,255,255,0,0,33,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,221,142,0,0,255,255,0,0,16,0,0,0,33,0,0,0,0,0,0,0,0,0,0,0,221,142,0,0,255,255,0,0,33,0,0,0,0,0,0,0,0,0,0,0,67,0,0,0,221,150,0,0,255,255,0,0,33,0,0,0,0,0,0,0,0,0,0,0,67,0,0,0,221,150,0,0,255,255,0,0,16,0,0,0,33,0,0,0,0,0,0,0,59,0,0,0,221,158,0,0,255,255,0,0,16,0,0,0,33,0,0,0,0,0,0,0,59,0,0,0,221,158,0,0,255,255,0,0,33,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,221,166,0,0,255,255,0,0,33,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,221,166,0,0,255,255,0,0,16,0,0,0,33,0,0,0,0,0,0,0,68,0,0,0,221,174,0,0,255,255,0,0,33,0,0,0,0,0,0,0,0,0,0,0,68,0,0,0,221,174,0,0,255,255,0,0,16,0,0,0,33,0,0,0,0,0,0,0,36,0,0,0,221,182,0,0,255,255,0,0,33,0,0,0,0,0,0,0,0,0,0,0,36,0,0,0,221,182,0,0,255,255,0,0,16,0,0,0,33,0,0,0,0,0,0,0,6,0,0,0,221,190,0,0,255,255,0,0,33,0,0,0,0,0,0,0,0,0,0,0,6,0,0,0,221,190,0,0,255,255,0,0,16,0,0,0,33,0,0,0,0,0,0,0,1,0,0,0,253,134,0,0,255,255,0,0,16,0,0,0,34,0,0,0,0,0,0,0,1,0,0,0,253,134,0,0,255,255,0,0,34,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,142,0,0,255,255,0,0,16,0,0,0,34,0,0,0,0,0,0,0,0,0,0,0,253,142,0,0,255,255,0,0,34,0,0,0,0,0,0,0,0,0,0,0,67,0,0,0,253,150,0,0,255,255,0,0,34,0,0,0,0,0,0,0,0,0,0,0,67,0,0,0,253,150,0,0,255,255,0,0,16,0,0,0,34,0,0,0,0,0,0,0,59,0,0,0,253,158,0,0,255,255,0,0,16,0,0,0,34,0,0,0,0,0,0,0,59,0,0,0,253,158,0,0,255,255,0,0,34,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,253,166,0,0,255,255,0,0,34,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,253,166,0,0,255,255,0,0,16,0,0,0,34,0,0,0,0,0,0,0,68,0,0,0,253,174,0,0,255,255,0,0,34,0,0,0,0,0,0,0,0,0,0,0,68,0,0,0,253,174,0,0,255,255,0,0,16,0,0,0,34,0,0,0,0,0,0,0,36,0,0,0,253,182,0,0,255,255,0,0,34,0,0,0,0,0,0,0,0,0,0,0,36,0,0,0,253,182,0,0,255,255,0,0,16,0,0,0,34,0,0,0,0,0,0,0,6,0,0,0,253,190,0,0,255,255,0,0,34,0,0,0,0,0,0,0,0,0,0,0,6,0,0,0,253,190,0,0,255,255,0,0,16,0,0,0,34,0,0,0,0,0,0,0,1,0,0,0,221,132,0,0,255,255,0,0,16,0,0,0,12,0,0,0,0,0,0,0,1,0,0,0,221,132,0,0,255,255,0,0,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,221,140,0,0,255,255,0,0,16,0,0,0,12,0,0,0,0,0,0,0,0,0,0,0,221,140,0,0,255,255,0,0,12,0,0,0,0,0,0,0,0,0,0,0,67,0,0,0,221,148,0,0,255,255,0,0,12,0,0,0,0,0,0,0,0,0,0,0,67,0,0,0,221,148,0,0,255,255,0,0,16,0,0,0,12,0,0,0,0,0,0,0,59,0,0,0,221,156,0,0,255,255,0,0,16,0,0,0,12,0,0,0,0,0,0,0,59,0,0,0,221,156,0,0,255,255,0,0,12,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,221,164,0,0,255,255,0,0,12,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,221,164,0,0,255,255,0,0,16,0,0,0,12,0,0,0,0,0,0,0,68,0,0,0,221,172,0,0,255,255,0,0,12,0,0,0,0,0,0,0,0,0,0,0,68,0,0,0,221,172,0,0,255,255,0,0,16,0,0,0,12,0,0,0,0,0,0,0,36,0,0,0,221,180,0,0,255,255,0,0,12,0,0,0,0,0,0,0,0,0,0,0,36,0,0,0,221,180,0,0,255,255,0,0,16,0,0,0,12,0,0,0,0,0,0,0,6,0,0,0,221,188,0,0,255,255,0,0,12,0,0,0,0,0,0,0,0,0,0,0,6,0,0,0,221,188,0,0,255,255,0,0,16,0,0,0,12,0,0,0,0,0,0,0,1,0,0,0,221,133,0,0,255,255,0,0,16,0,0,0,13,0,0,0,0,0,0,0,1,0,0,0,221,133,0,0,255,255,0,0,13,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,221,141,0,0,255,255,0,0,16,0,0,0,13,0,0,0,0,0,0,0,0,0,0,0,221,141,0,0,255,255,0,0,13,0,0,0,0,0,0,0,0,0,0,0,67,0,0,0,221,149,0,0,255,255,0,0,13,0,0,0,0,0,0,0,0,0,0,0,67,0,0,0,221,149,0,0,255,255,0,0,16,0,0,0,13,0,0,0,0,0,0,0,59,0,0,0,221,157,0,0,255,255,0,0,16,0,0,0,13,0,0,0,0,0,0,0,59,0,0,0,221,157,0,0,255,255,0,0,13,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,221,165,0,0,255,255,0,0,13,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,221,165,0,0,255,255,0,0,16,0,0,0,13,0,0,0,0,0,0,0,68,0,0,0,221,173,0,0,255,255,0,0,13,0,0,0,0,0,0,0,0,0,0,0,68,0,0,0,221,173,0,0,255,255,0,0,16,0,0,0,13,0,0,0,0,0,0,0,36,0,0,0,221,181,0,0,255,255,0,0,13,0,0,0,0,0,0,0,0,0,0,0,36,0,0,0,221,181,0,0,255,255,0,0,16,0,0,0,13,0,0,0,0,0,0,0,6,0,0,0,221,189,0,0,255,255,0,0,13,0,0,0,0,0,0,0,0,0,0,0,6,0,0,0,221,189,0,0,255,255,0,0,16,0,0,0,13,0,0,0,0,0,0,0,1,0,0,0,253,132,0,0,255,255,0,0,16,0,0,0,14,0,0,0,0,0,0,0,1,0,0,0,253,132,0,0,255,255,0,0,14,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,140,0,0,255,255,0,0,16,0,0,0,14,0,0,0,0,0,0,0,0,0,0,0,253,140,0,0,255,255,0,0,14,0,0,0,0,0,0,0,0,0,0,0,67,0,0,0,253,148,0,0,255,255,0,0,14,0,0,0,0,0,0,0,0,0,0,0,67,0,0,0,253,148,0,0,255,255,0,0,16,0,0,0,14,0,0,0,0,0,0,0,59,0,0,0,253,156,0,0,255,255,0,0,16,0,0,0,14,0,0,0,0,0,0,0,59,0,0,0,253,156,0,0,255,255,0,0,14,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,253,164,0,0,255,255,0,0,14,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,253,164,0,0,255,255,0,0,16,0,0,0,14,0,0,0,0,0,0,0,68,0,0,0,253,172,0,0,255,255,0,0,14,0,0,0,0,0,0,0,0,0,0,0,68,0,0,0,253,172,0,0,255,255,0,0,16,0,0,0,14,0,0,0,0,0,0,0,36,0,0,0,253,180,0,0,255,255,0,0,14,0,0,0,0,0,0,0,0,0,0,0,36,0,0,0,253,180,0,0,255,255,0,0,16,0,0,0,14,0,0,0,0,0,0,0,6,0,0,0,253,188,0,0,255,255,0,0,14,0,0,0,0,0,0,0,0,0,0,0,6,0,0,0,253,188,0,0,255,255,0,0,16,0,0,0,14,0,0,0,0,0,0,0,1,0,0,0,253,133,0,0,255,255,0,0,16,0,0,0,15,0,0,0,0,0,0,0,1,0,0,0,253,133,0,0,255,255,0,0,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,141,0,0,255,255,0,0,16,0,0,0,15,0,0,0,0,0,0,0,0,0,0,0,253,141,0,0,255,255,0,0,15,0,0,0,0,0,0,0,0,0,0,0,67,0,0,0,253,149,0,0,255,255,0,0,15,0,0,0,0,0,0,0,0,0,0,0,67,0,0,0,253,149,0,0,255,255,0,0,16,0,0,0,15,0,0,0,0,0,0,0,59,0,0,0,253,157,0,0,255,255,0,0,16,0,0,0,15,0,0,0,0,0,0,0,59,0,0,0,253,157,0,0,255,255,0,0,15,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,253,165,0,0,255,255,0,0,15,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,253,165,0,0,255,255,0,0,16,0,0,0,15,0,0,0,0,0,0,0,68,0,0,0,253,173,0,0,255,255,0,0,15,0,0,0,0,0,0,0,0,0,0,0,68,0,0,0,253,173,0,0,255,255,0,0,16,0,0,0,15,0,0,0,0,0,0,0,36,0,0,0,253,181,0,0,255,255,0,0,15,0,0,0,0,0,0,0,0,0,0,0,36,0,0,0,253,181,0,0,255,255,0,0,16,0,0,0,15,0,0,0,0,0,0,0,6,0,0,0,253,189,0,0,255,255,0,0,15,0,0,0,0,0,0,0,0,0,0,0,6,0,0,0,253,189,0,0,255,255,0,0,16,0,0,0,15,0,0,0,0,0,0,0,29,0,0,0,221,100,0,0,255,255,0,0,12,0,0,0,12,0,0,0,0,0,0,0,29,0,0,0,221,101,0,0,255,255,0,0,12,0,0,0,13,0,0,0,0,0,0,0,29,0,0,0,221,108,0,0,255,255,0,0,13,0,0,0,12,0,0,0,0,0,0,0,29,0,0,0,221,109,0,0,255,255,0,0,13,0,0,0,13,0,0,0,0,0,0,0,29,0,0,0,253,100,0,0,255,255,0,0,14,0,0,0,14,0,0,0,0,0,0,0,29,0,0,0,253,101,0,0,255,255,0,0,14,0,0,0,15,0,0,0,0,0,0,0,29,0,0,0,253,108,0,0,255,255,0,0,15,0,0,0,14,0,0,0,0,0,0,0,29,0,0,0,253,109,0,0,255,255,0,0,15,0,0,0,15,0,0,0,0,0,0,0,29,0,0,0,221,34,0,0,255,255,0,0,5,0,0,0,26,0,0,0,0,0,0,0,29,0,0,0,221,42,0,0,255,255,0,0,26,0,0,0,5,0,0,0,0,0,0,0,29,0,0,0,253,34,0,0,255,255,0,0,5,0,0,0,27,0,0,0,0,0,0,0,29,0,0,0,253,42,0,0,255,255,0,0,27,0,0,0,5,0,0,0,0,0,0,0,29,0,0,0,221,33,0,0,255,255,0,0,26,0,0,0,2,0,0,0,0,0,0,0,29,0,0,0,253,33,0,0,255,255,0,0,27,0,0,0,2,0,0,0,0,0,0,0,22,0,0,0,221,35,0,0,255,255,0,0,26,0,0,0,0,0,0,0,0,0,0,0,13,0,0,0,221,43,0,0,255,255,0,0,26,0,0,0,0,0,0,0,0,0,0,0,22,0,0,0,253,35,0,0,255,255,0,0,27,0,0,0,0,0,0,0,0,0,0,0,13,0,0,0,253,43,0,0,255,255,0,0,27,0,0,0,0,0,0,0,0,0,0,0,22,0,0,0,221,52,0,0,255,255,0,0,33,0,0,0,0,0,0,0,0,0,0,0,13,0,0,0,221,53,0,0,255,255,0,0,33,0,0,0,0,0,0,0,0,0,0,0,29,0,0,0,221,54,0,0,255,255,0,0,33,0,0,0,1,0,0,0,0,0,0,0,22,0,0,0,253,52,0,0,255,255,0,0,34,0,0,0,0,0,0,0,0,0,0,0,13,0,0,0,253,53,0,0,255,255,0,0,34,0,0,0,0,0,0,0,0,0,0,0,29,0,0,0,253,54,0,0,255,255,0,0,34,0,0,0,1,0,0,0,0,0,0,0,22,0,0,0,221,36,0,0,255,255,0,0,12,0,0,0,0,0,0,0,0,0,0,0,13,0,0,0,221,37,0,0,255,255,0,0,12,0,0,0,0,0,0,0,0,0,0,0,22,0,0,0,221,44,0,0,255,255,0,0,13,0,0,0,0,0,0,0,0,0,0,0,13,0,0,0,221,45,0,0,255,255,0,0,13,0,0,0,0,0,0,0,0,0,0,0,22,0,0,0,253,36,0,0,255,255,0,0,14,0,0,0,0,0,0,0,0,0,0,0,13,0,0,0,253,37,0,0,255,255,0,0,14,0,0,0,0,0,0,0,0,0,0,0,22,0,0,0,253,44,0,0,255,255,0,0,15,0,0,0,0,0,0,0,0,0,0,0,13,0,0,0,253,45,0,0,255,255,0,0,15,0,0,0,0,0,0,0,0,0,0,0,29,0,0,0,221,38,0,0,255,255,0,0,12,0,0,0,1,0,0,0,0,0,0,0,29,0,0,0,221,46,0,0,255,255,0,0,13,0,0,0,1,0,0,0,0,0,0,0,29,0,0,0,253,38,0,0,255,255,0,0,14,0,0,0,1,0,0,0,0,0,0,0,29,0,0,0,253,46,0,0,255,255,0,0,15,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,221,9,0,0,255,255,0,0,26,0,0,0,23,0,0,0,0,0,0,0,1,0,0,0,221,25,0,0,255,255,0,0,26,0,0,0,24,0,0,0,0,0,0,0,1,0,0,0,221,41,0,0,255,255,0,0,26,0,0,0,26,0,0,0,0,0,0,0,1,0,0,0,221,57,0,0,255,255,0,0,26,0,0,0,28,0,0,0,0,0,0,0,1,0,0,0,253,9,0,0,255,255,0,0,27,0,0,0,23,0,0,0,0,0,0,0,1,0,0,0,253,25,0,0,255,255,0,0,27,0,0,0,24,0,0,0,0,0,0,0,1,0,0,0,253,41,0,0,255,255,0,0,27,0,0,0,27,0,0,0,0,0,0,0,1,0,0,0,253,57,0,0,255,255,0,0,27,0,0,0,28,0,0,0,0,0,0,0,29,0,0,0,221,96,0,0,255,248,0,0,12], "i8", ALLOC_NONE, Runtime.GLOBAL_BASE);
/* memory initializer */ allocate([7,0,0,0,0,0,0,0,29,0,0,0,221,104,0,0,255,248,0,0,13,0,0,0,7,0,0,0,0,0,0,0,29,0,0,0,221,112,0,0,255,248,0,0,33,0,0,0,7,0,0,0,0,0,0,0,29,0,0,0,253,96,0,0,255,248,0,0,14,0,0,0,7,0,0,0,0,0,0,0,29,0,0,0,253,104,0,0,255,248,0,0,15,0,0,0,7,0,0,0,0,0,0,0,29,0,0,0,253,112,0,0,255,248,0,0,34,0,0,0,7,0,0,0,0,0,0,0,29,0,0,0,221,68,0,0,255,199,0,0,9,0,0,0,12,0,0,0,0,0,0,0,29,0,0,0,221,69,0,0,255,199,0,0,9,0,0,0,13,0,0,0,0,0,0,0,29,0,0,0,221,70,0,0,255,199,0,0,9,0,0,0,33,0,0,0,0,0,0,0,29,0,0,0,253,68,0,0,255,199,0,0,9,0,0,0,14,0,0,0,0,0,0,0,29,0,0,0,253,69,0,0,255,199,0,0,9,0,0,0,15,0,0,0,0,0,0,0,29,0,0,0,253,70,0,0,255,199,0,0,9,0,0,0,34,0,0,0,0,0,0,0,35,0,0,0,0,0,0,0,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,51,0,0,0,7,0,0,0,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,56,0,0,0,15,0,0,0,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,49,0,0,0,23,0,0,0,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,54,0,0,0,31,0,0,0,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,12,0,0,0,39,0,0,0,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,0,0,0,47,0,0,0,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,60,0,0,0,55,0,0,0,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,63,0,0,0,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,19,0,0,0,118,0,0,0,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,45,0,0,0,201,0,0,0,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,18,0,0,0,217,0,0,0,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,14,0,0,0,243,0,0,0,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,16,0,0,0,251,0,0,0,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,29,0,0,0,249,0,0,0,255,0,0,0,28,0,0,0,25,0,0,0,0,0,0,0,17,0,0,0,8,0,0,0,255,0,0,0,21,0,0,0,22,0,0,0,0,0,0,0,17,0,0,0,8,0,0,0,255,0,0,0,22,0,0,0,21,0,0,0,0,0,0,0,17,0,0,0,227,0,0,0,255,0,0,0,29,0,0,0,25,0,0,0,0,0,0,0,17,0,0,0,227,0,0,0,255,0,0,0,25,0,0,0,29,0,0,0,0,0,0,0,17,0,0,0,235,0,0,0,255,0,0,0,24,0,0,0,25,0,0,0,0,0,0,0,17,0,0,0,235,0,0,0,255,0,0,0,25,0,0,0,24,0,0,0,0,0,0,0,27,0,0,0,233,0,0,0,255,0,0,0,32,0,0,0,0,0,0,0,0,0,0,0,27,0,0,0,233,0,0,0,255,0,0,0,25,0,0,0,0,0,0,0,0,0,0,0,27,0,0,0,195,0,0,0,255,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,205,0,0,0,255,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,39,0,0,0,211,0,0,0,255,0,0,0,11,0,0,0,16,0,0,0,0,0,0,0,21,0,0,0,219,0,0,0,255,0,0,0,16,0,0,0,11,0,0,0,0,0,0,0,1,0,0,0,198,0,0,0,255,0,0,0,16,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,198,0,0,0,255,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,206,0,0,0,255,0,0,0,16,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,206,0,0,0,255,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,67,0,0,0,214,0,0,0,255,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,67,0,0,0,214,0,0,0,255,0,0,0,16,0,0,0,1,0,0,0,0,0,0,0,59,0,0,0,222,0,0,0,255,0,0,0,16,0,0,0,1,0,0,0,0,0,0,0,59,0,0,0,222,0,0,0,255,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,230,0,0,0,255,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,230,0,0,0,255,0,0,0,16,0,0,0,1,0,0,0,0,0,0,0,68,0,0,0,238,0,0,0,255,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,68,0,0,0,238,0,0,0,255,0,0,0,16,0,0,0,1,0,0,0,0,0,0,0,36,0,0,0,246,0,0,0,255,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,36,0,0,0,246,0,0,0,255,0,0,0,16,0,0,0,1,0,0,0,0,0,0,0,6,0,0,0,254,0,0,0,255,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,6,0,0,0,254,0,0,0,255,0,0,0,16,0,0,0,1,0,0,0,0,0,0,0,29,0,0,0,2,0,0,0,255,0,0,0,30,0,0,0,16,0,0,0,0,0,0,0,29,0,0,0,18,0,0,0,255,0,0,0,31,0,0,0,16,0,0,0,0,0,0,0,29,0,0,0,10,0,0,0,255,0,0,0,16,0,0,0,30,0,0,0,0,0,0,0,29,0,0,0,26,0,0,0,255,0,0,0,16,0,0,0,31,0,0,0,0,0,0,0,29,0,0,0,34,0,0,0,255,0,0,0,5,0,0,0,25,0,0,0,0,0,0,0,29,0,0,0,42,0,0,0,255,0,0,0,25,0,0,0,5,0,0,0,0,0,0,0,29,0,0,0,50,0,0,0,255,0,0,0,5,0,0,0,16,0,0,0,0,0,0,0,29,0,0,0,58,0,0,0,255,0,0,0,16,0,0,0,5,0,0,0,0,0,0,0,15,0,0,0,16,0,0,0,255,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,28,0,0,0,24,0,0,0,255,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,9,0,0,0,207,0,0,0,25,0,0,0,19,0,0,0,0,0,0,0,1,0,0,0,128,0,0,0,248,0,0,0,16,0,0,0,6,0,0,0,0,0,0,0,1,0,0,0,128,0,0,0,248,0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,136,0,0,0,248,0,0,0,16,0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,136,0,0,0,248,0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,67,0,0,0,144,0,0,0,248,0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,67,0,0,0,144,0,0,0,248,0,0,0,16,0,0,0,6,0,0,0,0,0,0,0,59,0,0,0,152,0,0,0,248,0,0,0,16,0,0,0,6,0,0,0,0,0,0,0,59,0,0,0,152,0,0,0,248,0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,160,0,0,0,248,0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,160,0,0,0,248,0,0,0,16,0,0,0,6,0,0,0,0,0,0,0,68,0,0,0,168,0,0,0,248,0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,68,0,0,0,168,0,0,0,248,0,0,0,16,0,0,0,6,0,0,0,0,0,0,0,36,0,0,0,176,0,0,0,248,0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,36,0,0,0,176,0,0,0,248,0,0,0,16,0,0,0,6,0,0,0,0,0,0,0,6,0,0,0,184,0,0,0,248,0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,6,0,0,0,184,0,0,0,248,0,0,0,16,0,0,0,6,0,0,0,0,0,0,0,28,0,0,0,32,0,0,0,231,0,0,0,37,0,0,0,4,0,0,0,0,0,0,0,42,0,0,0,193,0,0,0,207,0,0,0,20,0,0,0,0,0,0,0,0,0,0,0,43,0,0,0,197,0,0,0,207,0,0,0,20,0,0,0,0,0,0,0,0,0,0,0,45,0,0,0,192,0,0,0,199,0,0,0,38,0,0,0,0,0,0,0,0,0,0,0,27,0,0,0,194,0,0,0,199,0,0,0,38,0,0,0,3,0,0,0,0,0,0,0,4,0,0,0,196,0,0,0,199,0,0,0,38,0,0,0,3,0,0,0,0,0,0,0,58,0,0,0,199,0,0,0,199,0,0,0,40,0,0,0,0,0,0,0,0,0,0,0,22,0,0,0,4,0,0,0,199,0,0,0,8,0,0,0,0,0,0,0,0,0,0,0,13,0,0,0,5,0,0,0,199,0,0,0,8,0,0,0,0,0,0,0,0,0,0,0,29,0,0,0,6,0,0,0,199,0,0,0,8,0,0,0,1,0,0,0,0,0,0,0,29,0,0,0,1,0,0,0,207,0,0,0,19,0,0,0,2,0,0,0,0,0,0,0,22,0,0,0,3,0,0,0,207,0,0,0,19,0,0,0,0,0,0,0,0,0,0,0,13,0,0,0,11,0,0,0,207,0,0,0,19,0,0,0,0,0,0,0,0,0,0,0,29,0,0,0,64,0,0,0,192,0,0,0,8,0,0,0,6,0,0,0,0,0,0,0,29,0,0,0,64,73,0,0,255,255,0,0,23,0,0,0,23,0,0,0,0,0,0,0,29,0,0,0,66,75,0,0,255,255,0,0,23,0,0,0,24,0,0,0,0,0,0,0,29,0,0,0,68,77,0,0,255,255,0,0,23,0,0,0,25,0,0,0,0,0,0,0,29,0,0,0,80,89,0,0,255,255,0,0,24,0,0,0,23,0,0,0,0,0,0,0,29,0,0,0,82,91,0,0,255,255,0,0,24,0,0,0,24,0,0,0,0,0,0,0,29,0,0,0,84,93,0,0,255,255,0,0,24,0,0,0,25,0,0,0,0,0,0,0,29,0,0,0,96,105,0,0,255,255,0,0,25,0,0,0,23,0,0,0,0,0,0,0,29,0,0,0,98,107,0,0,255,255,0,0,25,0,0,0,24,0,0,0,0,0,0,0,29,0,0,0,100,109,0,0,255,255,0,0,25,0,0,0,25,0,0,0,0,0,0,0,255,255,255,255,110,0,0,0,99,0,0,0,118,0,0,0,255,255,255,255,32,0,0,0,98,0,0,0,109,0,0,0,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,225,4,0,0,255,255,255,255,120,0,0,0,102,0,0,0,103,0,0,0,255,255,255,255,100,0,0,0,121,0,0,0,96,0,0,0,78,4,0,0,98,4,0,0,255,255,255,255,99,4,0,0,255,255,255,255,44,0,0,0,46,0,0,0,92,0,0,0,255,255,255,255,101,0,0,0,114,0,0,0,115,0,0,0,116,0,0,0,255,255,255,255,97,0,0,0,57,4,0,0,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,224,4,0,0,255,255,255,255,72,4,0,0,51,0,0,0,52,0,0,0,50,0,0,0,49,0,0,0,27,0,0,0,53,0,0,0,255,255,255,255,13,0,0,0,39,0,0,0,255,255,255,255,91,4,0,0,89,4,0,0,90,4,0,0,255,255,255,255,88,4,0,0,54,0,0,0,55,0,0,0,255,255,255,255,113,0,0,0,9,0,0,0,255,255,255,255,56,0,0,0,119,0,0,0,62,4,0,0,255,255,255,255,63,4,0,0,57,0,0,0,48,0,0,0,45,0,0,0,61,0,0,0,255,255,255,255,47,0,0,0,8,0,0,0,86,4,0,0,255,255,255,255,97,4,0,0,96,4,0,0,255,255,255,255,95,4,0,0,64,4,0,0,65,4,0,0,69,4,0,0,255,255,255,255,68,4,0,0,67,4,0,0,255,255,255,255,66,4,0,0,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,122,0,0,0,255,255,255,255,117,0,0,0,105,0,0,0,111,0,0,0,255,255,255,255,112,0,0,0,91,0,0,0,75,4,0,0,127,0,0,0,87,4,0,0,255,255,255,255,92,4,0,0,93,4,0,0,255,255,255,255,94,4,0,0,104,0,0,0,255,255,255,255,106,0,0,0,107,0,0,0,108,0,0,0,255,255,255,255,59,0,0,0,93,0,0,0], "i8", ALLOC_NONE, Runtime.GLOBAL_BASE+10240);
function runPostSets() {


}

var tempDoublePtr = Runtime.alignMemory(allocate(12, "i8", ALLOC_STATIC), 8);

assert(tempDoublePtr % 8 == 0);

function copyTempFloat(ptr) { // functions, because inlining this code increases code size too much

  HEAP8[tempDoublePtr] = HEAP8[ptr];

  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];

  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];

  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];

}

function copyTempDouble(ptr) {

  HEAP8[tempDoublePtr] = HEAP8[ptr];

  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];

  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];

  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];

  HEAP8[tempDoublePtr+4] = HEAP8[ptr+4];

  HEAP8[tempDoublePtr+5] = HEAP8[ptr+5];

  HEAP8[tempDoublePtr+6] = HEAP8[ptr+6];

  HEAP8[tempDoublePtr+7] = HEAP8[ptr+7];

}


  function _strcpy(pdest, psrc) {
      pdest = pdest|0; psrc = psrc|0;
      var i = 0;
      do {
        HEAP8[(((pdest+i)|0)|0)]=HEAP8[(((psrc+i)|0)|0)];
        i = (i+1)|0;
      } while (HEAP8[(((psrc)+(i-1))|0)]);
      return pdest|0;
    }

  
  
  
  function _strlen(ptr) {
      ptr = ptr|0;
      var curr = 0;
      curr = ptr;
      while (HEAP8[(curr)]) {
        curr = (curr + 1)|0;
      }
      return (curr - ptr)|0;
    }
  
  function __reallyNegative(x) {
      return x < 0 || (x === 0 && (1/x) === -Infinity);
    }function __formatString(format, varargs) {
      var textIndex = format;
      var argIndex = 0;
      function getNextArg(type) {
        // NOTE: Explicitly ignoring type safety. Otherwise this fails:
        //       int x = 4; printf("%c\n", (char)x);
        var ret;
        if (type === 'double') {
          ret = HEAPF64[(((varargs)+(argIndex))>>3)];
        } else if (type == 'i64') {
          ret = [HEAP32[(((varargs)+(argIndex))>>2)],
                 HEAP32[(((varargs)+(argIndex+8))>>2)]];
          argIndex += 8; // each 32-bit chunk is in a 64-bit block
  
        } else {
          type = 'i32'; // varargs are always i32, i64, or double
          ret = HEAP32[(((varargs)+(argIndex))>>2)];
        }
        argIndex += Math.max(Runtime.getNativeFieldSize(type), Runtime.getAlignSize(type, null, true));
        return ret;
      }
  
      var ret = [];
      var curr, next, currArg;
      while(1) {
        var startTextIndex = textIndex;
        curr = HEAP8[(textIndex)];
        if (curr === 0) break;
        next = HEAP8[((textIndex+1)|0)];
        if (curr == 37) {
          // Handle flags.
          var flagAlwaysSigned = false;
          var flagLeftAlign = false;
          var flagAlternative = false;
          var flagZeroPad = false;
          var flagPadSign = false;
          flagsLoop: while (1) {
            switch (next) {
              case 43:
                flagAlwaysSigned = true;
                break;
              case 45:
                flagLeftAlign = true;
                break;
              case 35:
                flagAlternative = true;
                break;
              case 48:
                if (flagZeroPad) {
                  break flagsLoop;
                } else {
                  flagZeroPad = true;
                  break;
                }
              case 32:
                flagPadSign = true;
                break;
              default:
                break flagsLoop;
            }
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
          }
  
          // Handle width.
          var width = 0;
          if (next == 42) {
            width = getNextArg('i32');
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
          } else {
            while (next >= 48 && next <= 57) {
              width = width * 10 + (next - 48);
              textIndex++;
              next = HEAP8[((textIndex+1)|0)];
            }
          }
  
          // Handle precision.
          var precisionSet = false, precision = -1;
          if (next == 46) {
            precision = 0;
            precisionSet = true;
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
            if (next == 42) {
              precision = getNextArg('i32');
              textIndex++;
            } else {
              while(1) {
                var precisionChr = HEAP8[((textIndex+1)|0)];
                if (precisionChr < 48 ||
                    precisionChr > 57) break;
                precision = precision * 10 + (precisionChr - 48);
                textIndex++;
              }
            }
            next = HEAP8[((textIndex+1)|0)];
          }
          if (precision < 0) {
            precision = 6; // Standard default.
            precisionSet = false;
          }
  
          // Handle integer sizes. WARNING: These assume a 32-bit architecture!
          var argSize;
          switch (String.fromCharCode(next)) {
            case 'h':
              var nextNext = HEAP8[((textIndex+2)|0)];
              if (nextNext == 104) {
                textIndex++;
                argSize = 1; // char (actually i32 in varargs)
              } else {
                argSize = 2; // short (actually i32 in varargs)
              }
              break;
            case 'l':
              var nextNext = HEAP8[((textIndex+2)|0)];
              if (nextNext == 108) {
                textIndex++;
                argSize = 8; // long long
              } else {
                argSize = 4; // long
              }
              break;
            case 'L': // long long
            case 'q': // int64_t
            case 'j': // intmax_t
              argSize = 8;
              break;
            case 'z': // size_t
            case 't': // ptrdiff_t
            case 'I': // signed ptrdiff_t or unsigned size_t
              argSize = 4;
              break;
            default:
              argSize = null;
          }
          if (argSize) textIndex++;
          next = HEAP8[((textIndex+1)|0)];
  
          // Handle type specifier.
          switch (String.fromCharCode(next)) {
            case 'd': case 'i': case 'u': case 'o': case 'x': case 'X': case 'p': {
              // Integer.
              var signed = next == 100 || next == 105;
              argSize = argSize || 4;
              var currArg = getNextArg('i' + (argSize * 8));
              var origArg = currArg;
              var argText;
              // Flatten i64-1 [low, high] into a (slightly rounded) double
              if (argSize == 8) {
                currArg = Runtime.makeBigInt(currArg[0], currArg[1], next == 117);
              }
              // Truncate to requested size.
              if (argSize <= 4) {
                var limit = Math.pow(256, argSize) - 1;
                currArg = (signed ? reSign : unSign)(currArg & limit, argSize * 8);
              }
              // Format the number.
              var currAbsArg = Math.abs(currArg);
              var prefix = '';
              if (next == 100 || next == 105) {
                if (argSize == 8 && i64Math) argText = i64Math.stringify(origArg[0], origArg[1], null); else
                argText = reSign(currArg, 8 * argSize, 1).toString(10);
              } else if (next == 117) {
                if (argSize == 8 && i64Math) argText = i64Math.stringify(origArg[0], origArg[1], true); else
                argText = unSign(currArg, 8 * argSize, 1).toString(10);
                currArg = Math.abs(currArg);
              } else if (next == 111) {
                argText = (flagAlternative ? '0' : '') + currAbsArg.toString(8);
              } else if (next == 120 || next == 88) {
                prefix = (flagAlternative && currArg != 0) ? '0x' : '';
                if (argSize == 8 && i64Math) {
                  if (origArg[1]) {
                    argText = (origArg[1]>>>0).toString(16);
                    var lower = (origArg[0]>>>0).toString(16);
                    while (lower.length < 8) lower = '0' + lower;
                    argText += lower;
                  } else {
                    argText = (origArg[0]>>>0).toString(16);
                  }
                } else
                if (currArg < 0) {
                  // Represent negative numbers in hex as 2's complement.
                  currArg = -currArg;
                  argText = (currAbsArg - 1).toString(16);
                  var buffer = [];
                  for (var i = 0; i < argText.length; i++) {
                    buffer.push((0xF - parseInt(argText[i], 16)).toString(16));
                  }
                  argText = buffer.join('');
                  while (argText.length < argSize * 2) argText = 'f' + argText;
                } else {
                  argText = currAbsArg.toString(16);
                }
                if (next == 88) {
                  prefix = prefix.toUpperCase();
                  argText = argText.toUpperCase();
                }
              } else if (next == 112) {
                if (currAbsArg === 0) {
                  argText = '(nil)';
                } else {
                  prefix = '0x';
                  argText = currAbsArg.toString(16);
                }
              }
              if (precisionSet) {
                while (argText.length < precision) {
                  argText = '0' + argText;
                }
              }
  
              // Add sign if needed
              if (currArg >= 0) {
                if (flagAlwaysSigned) {
                  prefix = '+' + prefix;
                } else if (flagPadSign) {
                  prefix = ' ' + prefix;
                }
              }
  
              // Move sign to prefix so we zero-pad after the sign
              if (argText.charAt(0) == '-') {
                prefix = '-' + prefix;
                argText = argText.substr(1);
              }
  
              // Add padding.
              while (prefix.length + argText.length < width) {
                if (flagLeftAlign) {
                  argText += ' ';
                } else {
                  if (flagZeroPad) {
                    argText = '0' + argText;
                  } else {
                    prefix = ' ' + prefix;
                  }
                }
              }
  
              // Insert the result into the buffer.
              argText = prefix + argText;
              argText.split('').forEach(function(chr) {
                ret.push(chr.charCodeAt(0));
              });
              break;
            }
            case 'f': case 'F': case 'e': case 'E': case 'g': case 'G': {
              // Float.
              var currArg = getNextArg('double');
              var argText;
              if (isNaN(currArg)) {
                argText = 'nan';
                flagZeroPad = false;
              } else if (!isFinite(currArg)) {
                argText = (currArg < 0 ? '-' : '') + 'inf';
                flagZeroPad = false;
              } else {
                var isGeneral = false;
                var effectivePrecision = Math.min(precision, 20);
  
                // Convert g/G to f/F or e/E, as per:
                // http://pubs.opengroup.org/onlinepubs/9699919799/functions/printf.html
                if (next == 103 || next == 71) {
                  isGeneral = true;
                  precision = precision || 1;
                  var exponent = parseInt(currArg.toExponential(effectivePrecision).split('e')[1], 10);
                  if (precision > exponent && exponent >= -4) {
                    next = ((next == 103) ? 'f' : 'F').charCodeAt(0);
                    precision -= exponent + 1;
                  } else {
                    next = ((next == 103) ? 'e' : 'E').charCodeAt(0);
                    precision--;
                  }
                  effectivePrecision = Math.min(precision, 20);
                }
  
                if (next == 101 || next == 69) {
                  argText = currArg.toExponential(effectivePrecision);
                  // Make sure the exponent has at least 2 digits.
                  if (/[eE][-+]\d$/.test(argText)) {
                    argText = argText.slice(0, -1) + '0' + argText.slice(-1);
                  }
                } else if (next == 102 || next == 70) {
                  argText = currArg.toFixed(effectivePrecision);
                  if (currArg === 0 && __reallyNegative(currArg)) {
                    argText = '-' + argText;
                  }
                }
  
                var parts = argText.split('e');
                if (isGeneral && !flagAlternative) {
                  // Discard trailing zeros and periods.
                  while (parts[0].length > 1 && parts[0].indexOf('.') != -1 &&
                         (parts[0].slice(-1) == '0' || parts[0].slice(-1) == '.')) {
                    parts[0] = parts[0].slice(0, -1);
                  }
                } else {
                  // Make sure we have a period in alternative mode.
                  if (flagAlternative && argText.indexOf('.') == -1) parts[0] += '.';
                  // Zero pad until required precision.
                  while (precision > effectivePrecision++) parts[0] += '0';
                }
                argText = parts[0] + (parts.length > 1 ? 'e' + parts[1] : '');
  
                // Capitalize 'E' if needed.
                if (next == 69) argText = argText.toUpperCase();
  
                // Add sign.
                if (currArg >= 0) {
                  if (flagAlwaysSigned) {
                    argText = '+' + argText;
                  } else if (flagPadSign) {
                    argText = ' ' + argText;
                  }
                }
              }
  
              // Add padding.
              while (argText.length < width) {
                if (flagLeftAlign) {
                  argText += ' ';
                } else {
                  if (flagZeroPad && (argText[0] == '-' || argText[0] == '+')) {
                    argText = argText[0] + '0' + argText.slice(1);
                  } else {
                    argText = (flagZeroPad ? '0' : ' ') + argText;
                  }
                }
              }
  
              // Adjust case.
              if (next < 97) argText = argText.toUpperCase();
  
              // Insert the result into the buffer.
              argText.split('').forEach(function(chr) {
                ret.push(chr.charCodeAt(0));
              });
              break;
            }
            case 's': {
              // String.
              var arg = getNextArg('i8*');
              var argLength = arg ? _strlen(arg) : '(null)'.length;
              if (precisionSet) argLength = Math.min(argLength, precision);
              if (!flagLeftAlign) {
                while (argLength < width--) {
                  ret.push(32);
                }
              }
              if (arg) {
                for (var i = 0; i < argLength; i++) {
                  ret.push(HEAPU8[((arg++)|0)]);
                }
              } else {
                ret = ret.concat(intArrayFromString('(null)'.substr(0, argLength), true));
              }
              if (flagLeftAlign) {
                while (argLength < width--) {
                  ret.push(32);
                }
              }
              break;
            }
            case 'c': {
              // Character.
              if (flagLeftAlign) ret.push(getNextArg('i8'));
              while (--width > 0) {
                ret.push(32);
              }
              if (!flagLeftAlign) ret.push(getNextArg('i8'));
              break;
            }
            case 'n': {
              // Write the length written so far to the next parameter.
              var ptr = getNextArg('i32*');
              HEAP32[((ptr)>>2)]=ret.length;
              break;
            }
            case '%': {
              // Literal percent sign.
              ret.push(curr);
              break;
            }
            default: {
              // Unknown specifiers remain untouched.
              for (var i = startTextIndex; i < textIndex + 2; i++) {
                ret.push(HEAP8[(i)]);
              }
            }
          }
          textIndex += 2;
          // TODO: Support a/A (hex float) and m (last error) specifiers.
          // TODO: Support %1${specifier} for arg selection.
        } else {
          ret.push(curr);
          textIndex += 1;
        }
      }
      return ret;
    }function _snprintf(s, n, format, varargs) {
      // int snprintf(char *restrict s, size_t n, const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      var result = __formatString(format, varargs);
      var limit = (n === undefined) ? result.length
                                    : Math.min(result.length, Math.max(n - 1, 0));
      if (s < 0) {
        s = -s;
        var buf = _malloc(limit+1);
        HEAP32[((s)>>2)]=buf;
        s = buf;
      }
      for (var i = 0; i < limit; i++) {
        HEAP8[(((s)+(i))|0)]=result[i];
      }
      if (limit < n || (n === undefined)) HEAP8[(((s)+(i))|0)]=0;
      return result.length;
    }function _sprintf(s, format, varargs) {
      // int sprintf(char *restrict s, const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      return _snprintf(s, undefined, format, varargs);
    }

  function _strcat(pdest, psrc) {
      pdest = pdest|0; psrc = psrc|0;
      var i = 0;
      var pdestEnd = 0;
      pdestEnd = (pdest + (_strlen(pdest)|0))|0;
      do {
        HEAP8[((pdestEnd+i)|0)]=HEAP8[((psrc+i)|0)];
        i = (i+1)|0;
      } while (HEAP8[(((psrc)+(i-1))|0)]);
      return pdest|0;
    }

  
  function _memset(ptr, value, num) {
      ptr = ptr|0; value = value|0; num = num|0;
      var stop = 0, value4 = 0, stop4 = 0, unaligned = 0;
      stop = (ptr + num)|0;
      if ((num|0) >= 20) {
        // This is unaligned, but quite large, so work hard to get to aligned settings
        value = value & 0xff;
        unaligned = ptr & 3;
        value4 = value | (value << 8) | (value << 16) | (value << 24);
        stop4 = stop & ~3;
        if (unaligned) {
          unaligned = (ptr + 4 - unaligned)|0;
          while ((ptr|0) < (unaligned|0)) { // no need to check for stop, since we have large num
            HEAP8[(ptr)]=value;
            ptr = (ptr+1)|0;
          }
        }
        while ((ptr|0) < (stop4|0)) {
          HEAP32[((ptr)>>2)]=value4;
          ptr = (ptr+4)|0;
        }
      }
      while ((ptr|0) < (stop|0)) {
        HEAP8[(ptr)]=value;
        ptr = (ptr+1)|0;
      }
      return (ptr-num)|0;
    }var _llvm_memset_p0i8_i32=_memset;

  
  
  
  var ERRNO_CODES={EPERM:1,ENOENT:2,ESRCH:3,EINTR:4,EIO:5,ENXIO:6,E2BIG:7,ENOEXEC:8,EBADF:9,ECHILD:10,EAGAIN:11,EWOULDBLOCK:11,ENOMEM:12,EACCES:13,EFAULT:14,ENOTBLK:15,EBUSY:16,EEXIST:17,EXDEV:18,ENODEV:19,ENOTDIR:20,EISDIR:21,EINVAL:22,ENFILE:23,EMFILE:24,ENOTTY:25,ETXTBSY:26,EFBIG:27,ENOSPC:28,ESPIPE:29,EROFS:30,EMLINK:31,EPIPE:32,EDOM:33,ERANGE:34,ENOMSG:42,EIDRM:43,ECHRNG:44,EL2NSYNC:45,EL3HLT:46,EL3RST:47,ELNRNG:48,EUNATCH:49,ENOCSI:50,EL2HLT:51,EDEADLK:35,ENOLCK:37,EBADE:52,EBADR:53,EXFULL:54,ENOANO:55,EBADRQC:56,EBADSLT:57,EDEADLOCK:35,EBFONT:59,ENOSTR:60,ENODATA:61,ETIME:62,ENOSR:63,ENONET:64,ENOPKG:65,EREMOTE:66,ENOLINK:67,EADV:68,ESRMNT:69,ECOMM:70,EPROTO:71,EMULTIHOP:72,EDOTDOT:73,EBADMSG:74,ENOTUNIQ:76,EBADFD:77,EREMCHG:78,ELIBACC:79,ELIBBAD:80,ELIBSCN:81,ELIBMAX:82,ELIBEXEC:83,ENOSYS:38,ENOTEMPTY:39,ENAMETOOLONG:36,ELOOP:40,EOPNOTSUPP:95,EPFNOSUPPORT:96,ECONNRESET:104,ENOBUFS:105,EAFNOSUPPORT:97,EPROTOTYPE:91,ENOTSOCK:88,ENOPROTOOPT:92,ESHUTDOWN:108,ECONNREFUSED:111,EADDRINUSE:98,ECONNABORTED:103,ENETUNREACH:101,ENETDOWN:100,ETIMEDOUT:110,EHOSTDOWN:112,EHOSTUNREACH:113,EINPROGRESS:115,EALREADY:114,EDESTADDRREQ:89,EMSGSIZE:90,EPROTONOSUPPORT:93,ESOCKTNOSUPPORT:94,EADDRNOTAVAIL:99,ENETRESET:102,EISCONN:106,ENOTCONN:107,ETOOMANYREFS:109,EUSERS:87,EDQUOT:122,ESTALE:116,ENOTSUP:95,ENOMEDIUM:123,EILSEQ:84,EOVERFLOW:75,ECANCELED:125,ENOTRECOVERABLE:131,EOWNERDEAD:130,ESTRPIPE:86};
  
  var ERRNO_MESSAGES={0:"Success",1:"Not super-user",2:"No such file or directory",3:"No such process",4:"Interrupted system call",5:"I/O error",6:"No such device or address",7:"Arg list too long",8:"Exec format error",9:"Bad file number",10:"No children",11:"No more processes",12:"Not enough core",13:"Permission denied",14:"Bad address",15:"Block device required",16:"Mount device busy",17:"File exists",18:"Cross-device link",19:"No such device",20:"Not a directory",21:"Is a directory",22:"Invalid argument",23:"Too many open files in system",24:"Too many open files",25:"Not a typewriter",26:"Text file busy",27:"File too large",28:"No space left on device",29:"Illegal seek",30:"Read only file system",31:"Too many links",32:"Broken pipe",33:"Math arg out of domain of func",34:"Math result not representable",35:"File locking deadlock error",36:"File or path name too long",37:"No record locks available",38:"Function not implemented",39:"Directory not empty",40:"Too many symbolic links",42:"No message of desired type",43:"Identifier removed",44:"Channel number out of range",45:"Level 2 not synchronized",46:"Level 3 halted",47:"Level 3 reset",48:"Link number out of range",49:"Protocol driver not attached",50:"No CSI structure available",51:"Level 2 halted",52:"Invalid exchange",53:"Invalid request descriptor",54:"Exchange full",55:"No anode",56:"Invalid request code",57:"Invalid slot",59:"Bad font file fmt",60:"Device not a stream",61:"No data (for no delay io)",62:"Timer expired",63:"Out of streams resources",64:"Machine is not on the network",65:"Package not installed",66:"The object is remote",67:"The link has been severed",68:"Advertise error",69:"Srmount error",70:"Communication error on send",71:"Protocol error",72:"Multihop attempted",73:"Cross mount point (not really error)",74:"Trying to read unreadable message",75:"Value too large for defined data type",76:"Given log. name not unique",77:"f.d. invalid for this operation",78:"Remote address changed",79:"Can   access a needed shared lib",80:"Accessing a corrupted shared lib",81:".lib section in a.out corrupted",82:"Attempting to link in too many libs",83:"Attempting to exec a shared library",84:"Illegal byte sequence",86:"Streams pipe error",87:"Too many users",88:"Socket operation on non-socket",89:"Destination address required",90:"Message too long",91:"Protocol wrong type for socket",92:"Protocol not available",93:"Unknown protocol",94:"Socket type not supported",95:"Not supported",96:"Protocol family not supported",97:"Address family not supported by protocol family",98:"Address already in use",99:"Address not available",100:"Network interface is not configured",101:"Network is unreachable",102:"Connection reset by network",103:"Connection aborted",104:"Connection reset by peer",105:"No buffer space available",106:"Socket is already connected",107:"Socket is not connected",108:"Can't send after socket shutdown",109:"Too many references",110:"Connection timed out",111:"Connection refused",112:"Host is down",113:"Host is unreachable",114:"Socket already connected",115:"Connection already in progress",116:"Stale file handle",122:"Quota exceeded",123:"No medium (in tape drive)",125:"Operation canceled",130:"Previous owner died",131:"State not recoverable"};
  
  
  var ___errno_state=0;function ___setErrNo(value) {
      // For convenient setting and returning of errno.
      HEAP32[((___errno_state)>>2)]=value;
      return value;
    }
  
  var PATH={splitPath:function (filename) {
        var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return splitPathRe.exec(filename).slice(1);
      },normalizeArray:function (parts, allowAboveRoot) {
        // if the path tries to go above the root, `up` ends up > 0
        var up = 0;
        for (var i = parts.length - 1; i >= 0; i--) {
          var last = parts[i];
          if (last === '.') {
            parts.splice(i, 1);
          } else if (last === '..') {
            parts.splice(i, 1);
            up++;
          } else if (up) {
            parts.splice(i, 1);
            up--;
          }
        }
        // if the path is allowed to go above the root, restore leading ..s
        if (allowAboveRoot) {
          for (; up--; up) {
            parts.unshift('..');
          }
        }
        return parts;
      },normalize:function (path) {
        var isAbsolute = path.charAt(0) === '/',
            trailingSlash = path.substr(-1) === '/';
        // Normalize the path
        path = PATH.normalizeArray(path.split('/').filter(function(p) {
          return !!p;
        }), !isAbsolute).join('/');
        if (!path && !isAbsolute) {
          path = '.';
        }
        if (path && trailingSlash) {
          path += '/';
        }
        return (isAbsolute ? '/' : '') + path;
      },dirname:function (path) {
        var result = PATH.splitPath(path),
            root = result[0],
            dir = result[1];
        if (!root && !dir) {
          // No dirname whatsoever
          return '.';
        }
        if (dir) {
          // It has a dirname, strip trailing slash
          dir = dir.substr(0, dir.length - 1);
        }
        return root + dir;
      },basename:function (path) {
        // EMSCRIPTEN return '/'' for '/', not an empty string
        if (path === '/') return '/';
        var lastSlash = path.lastIndexOf('/');
        if (lastSlash === -1) return path;
        return path.substr(lastSlash+1);
      },extname:function (path) {
        return PATH.splitPath(path)[3];
      },join:function () {
        var paths = Array.prototype.slice.call(arguments, 0);
        return PATH.normalize(paths.join('/'));
      },join2:function (l, r) {
        return PATH.normalize(l + '/' + r);
      },resolve:function () {
        var resolvedPath = '',
          resolvedAbsolute = false;
        for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
          var path = (i >= 0) ? arguments[i] : FS.cwd();
          // Skip empty and invalid entries
          if (typeof path !== 'string') {
            throw new TypeError('Arguments to path.resolve must be strings');
          } else if (!path) {
            continue;
          }
          resolvedPath = path + '/' + resolvedPath;
          resolvedAbsolute = path.charAt(0) === '/';
        }
        // At this point the path should be resolved to a full absolute path, but
        // handle relative paths to be safe (might happen when process.cwd() fails)
        resolvedPath = PATH.normalizeArray(resolvedPath.split('/').filter(function(p) {
          return !!p;
        }), !resolvedAbsolute).join('/');
        return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
      },relative:function (from, to) {
        from = PATH.resolve(from).substr(1);
        to = PATH.resolve(to).substr(1);
        function trim(arr) {
          var start = 0;
          for (; start < arr.length; start++) {
            if (arr[start] !== '') break;
          }
          var end = arr.length - 1;
          for (; end >= 0; end--) {
            if (arr[end] !== '') break;
          }
          if (start > end) return [];
          return arr.slice(start, end - start + 1);
        }
        var fromParts = trim(from.split('/'));
        var toParts = trim(to.split('/'));
        var length = Math.min(fromParts.length, toParts.length);
        var samePartsLength = length;
        for (var i = 0; i < length; i++) {
          if (fromParts[i] !== toParts[i]) {
            samePartsLength = i;
            break;
          }
        }
        var outputParts = [];
        for (var i = samePartsLength; i < fromParts.length; i++) {
          outputParts.push('..');
        }
        outputParts = outputParts.concat(toParts.slice(samePartsLength));
        return outputParts.join('/');
      }};
  
  var TTY={ttys:[],init:function () {
        // https://github.com/kripken/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // currently, FS.init does not distinguish if process.stdin is a file or TTY
        //   // device, it always assumes it's a TTY device. because of this, we're forcing
        //   // process.stdin to UTF8 encoding to at least make stdin reading compatible
        //   // with text files until FS.init can be refactored.
        //   process['stdin']['setEncoding']('utf8');
        // }
      },shutdown:function () {
        // https://github.com/kripken/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // inolen: any idea as to why node -e 'process.stdin.read()' wouldn't exit immediately (with process.stdin being a tty)?
        //   // isaacs: because now it's reading from the stream, you've expressed interest in it, so that read() kicks off a _read() which creates a ReadReq operation
        //   // inolen: I thought read() in that case was a synchronous operation that just grabbed some amount of buffered data if it exists?
        //   // isaacs: it is. but it also triggers a _read() call, which calls readStart() on the handle
        //   // isaacs: do process.stdin.pause() and i'd think it'd probably close the pending call
        //   process['stdin']['pause']();
        // }
      },register:function (dev, ops) {
        TTY.ttys[dev] = { input: [], output: [], ops: ops };
        FS.registerDevice(dev, TTY.stream_ops);
      },stream_ops:{open:function (stream) {
          var tty = TTY.ttys[stream.node.rdev];
          if (!tty) {
            throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
          }
          stream.tty = tty;
          stream.seekable = false;
        },close:function (stream) {
          // flush any pending line data
          if (stream.tty.output.length) {
            stream.tty.ops.put_char(stream.tty, 10);
          }
        },read:function (stream, buffer, offset, length, pos /* ignored */) {
          if (!stream.tty || !stream.tty.ops.get_char) {
            throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
          }
          var bytesRead = 0;
          for (var i = 0; i < length; i++) {
            var result;
            try {
              result = stream.tty.ops.get_char(stream.tty);
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
            if (result === undefined && bytesRead === 0) {
              throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
            }
            if (result === null || result === undefined) break;
            bytesRead++;
            buffer[offset+i] = result;
          }
          if (bytesRead) {
            stream.node.timestamp = Date.now();
          }
          return bytesRead;
        },write:function (stream, buffer, offset, length, pos) {
          if (!stream.tty || !stream.tty.ops.put_char) {
            throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
          }
          for (var i = 0; i < length; i++) {
            try {
              stream.tty.ops.put_char(stream.tty, buffer[offset+i]);
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
          }
          if (length) {
            stream.node.timestamp = Date.now();
          }
          return i;
        }},default_tty_ops:{get_char:function (tty) {
          if (!tty.input.length) {
            var result = null;
            if (ENVIRONMENT_IS_NODE) {
              result = process['stdin']['read']();
              if (!result) {
                if (process['stdin']['_readableState'] && process['stdin']['_readableState']['ended']) {
                  return null;  // EOF
                }
                return undefined;  // no data available
              }
            } else if (typeof window != 'undefined' &&
              typeof window.prompt == 'function') {
              // Browser.
              result = window.prompt('Input: ');  // returns null on cancel
              if (result !== null) {
                result += '\n';
              }
            } else if (typeof readline == 'function') {
              // Command line.
              result = readline();
              if (result !== null) {
                result += '\n';
              }
            }
            if (!result) {
              return null;
            }
            tty.input = intArrayFromString(result, true);
          }
          return tty.input.shift();
        },put_char:function (tty, val) {
          if (val === null || val === 10) {
            Module['print'](tty.output.join(''));
            tty.output = [];
          } else {
            tty.output.push(TTY.utf8.processCChar(val));
          }
        }},default_tty1_ops:{put_char:function (tty, val) {
          if (val === null || val === 10) {
            Module['printErr'](tty.output.join(''));
            tty.output = [];
          } else {
            tty.output.push(TTY.utf8.processCChar(val));
          }
        }}};
  
  var MEMFS={ops_table:null,CONTENT_OWNING:1,CONTENT_FLEXIBLE:2,CONTENT_FIXED:3,mount:function (mount) {
        return MEMFS.createNode(null, '/', 16384 | 511 /* 0777 */, 0);
      },createNode:function (parent, name, mode, dev) {
        if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
          // no supported
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (!MEMFS.ops_table) {
          MEMFS.ops_table = {
            dir: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                lookup: MEMFS.node_ops.lookup,
                mknod: MEMFS.node_ops.mknod,
                rename: MEMFS.node_ops.rename,
                unlink: MEMFS.node_ops.unlink,
                rmdir: MEMFS.node_ops.rmdir,
                readdir: MEMFS.node_ops.readdir,
                symlink: MEMFS.node_ops.symlink
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek
              }
            },
            file: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek,
                read: MEMFS.stream_ops.read,
                write: MEMFS.stream_ops.write,
                allocate: MEMFS.stream_ops.allocate,
                mmap: MEMFS.stream_ops.mmap
              }
            },
            link: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                readlink: MEMFS.node_ops.readlink
              },
              stream: {}
            },
            chrdev: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: FS.chrdev_stream_ops
            },
          };
        }
        var node = FS.createNode(parent, name, mode, dev);
        if (FS.isDir(node.mode)) {
          node.node_ops = MEMFS.ops_table.dir.node;
          node.stream_ops = MEMFS.ops_table.dir.stream;
          node.contents = {};
        } else if (FS.isFile(node.mode)) {
          node.node_ops = MEMFS.ops_table.file.node;
          node.stream_ops = MEMFS.ops_table.file.stream;
          node.contents = [];
          node.contentMode = MEMFS.CONTENT_FLEXIBLE;
        } else if (FS.isLink(node.mode)) {
          node.node_ops = MEMFS.ops_table.link.node;
          node.stream_ops = MEMFS.ops_table.link.stream;
        } else if (FS.isChrdev(node.mode)) {
          node.node_ops = MEMFS.ops_table.chrdev.node;
          node.stream_ops = MEMFS.ops_table.chrdev.stream;
        }
        node.timestamp = Date.now();
        // add the new node to the parent
        if (parent) {
          parent.contents[name] = node;
        }
        return node;
      },ensureFlexible:function (node) {
        if (node.contentMode !== MEMFS.CONTENT_FLEXIBLE) {
          var contents = node.contents;
          node.contents = Array.prototype.slice.call(contents);
          node.contentMode = MEMFS.CONTENT_FLEXIBLE;
        }
      },node_ops:{getattr:function (node) {
          var attr = {};
          // device numbers reuse inode numbers.
          attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
          attr.ino = node.id;
          attr.mode = node.mode;
          attr.nlink = 1;
          attr.uid = 0;
          attr.gid = 0;
          attr.rdev = node.rdev;
          if (FS.isDir(node.mode)) {
            attr.size = 4096;
          } else if (FS.isFile(node.mode)) {
            attr.size = node.contents.length;
          } else if (FS.isLink(node.mode)) {
            attr.size = node.link.length;
          } else {
            attr.size = 0;
          }
          attr.atime = new Date(node.timestamp);
          attr.mtime = new Date(node.timestamp);
          attr.ctime = new Date(node.timestamp);
          // NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),
          //       but this is not required by the standard.
          attr.blksize = 4096;
          attr.blocks = Math.ceil(attr.size / attr.blksize);
          return attr;
        },setattr:function (node, attr) {
          if (attr.mode !== undefined) {
            node.mode = attr.mode;
          }
          if (attr.timestamp !== undefined) {
            node.timestamp = attr.timestamp;
          }
          if (attr.size !== undefined) {
            MEMFS.ensureFlexible(node);
            var contents = node.contents;
            if (attr.size < contents.length) contents.length = attr.size;
            else while (attr.size > contents.length) contents.push(0);
          }
        },lookup:function (parent, name) {
          throw FS.genericErrors[ERRNO_CODES.ENOENT];
        },mknod:function (parent, name, mode, dev) {
          return MEMFS.createNode(parent, name, mode, dev);
        },rename:function (old_node, new_dir, new_name) {
          // if we're overwriting a directory at new_name, make sure it's empty.
          if (FS.isDir(old_node.mode)) {
            var new_node;
            try {
              new_node = FS.lookupNode(new_dir, new_name);
            } catch (e) {
            }
            if (new_node) {
              for (var i in new_node.contents) {
                throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
              }
            }
          }
          // do the internal rewiring
          delete old_node.parent.contents[old_node.name];
          old_node.name = new_name;
          new_dir.contents[new_name] = old_node;
          old_node.parent = new_dir;
        },unlink:function (parent, name) {
          delete parent.contents[name];
        },rmdir:function (parent, name) {
          var node = FS.lookupNode(parent, name);
          for (var i in node.contents) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
          }
          delete parent.contents[name];
        },readdir:function (node) {
          var entries = ['.', '..']
          for (var key in node.contents) {
            if (!node.contents.hasOwnProperty(key)) {
              continue;
            }
            entries.push(key);
          }
          return entries;
        },symlink:function (parent, newname, oldpath) {
          var node = MEMFS.createNode(parent, newname, 511 /* 0777 */ | 40960, 0);
          node.link = oldpath;
          return node;
        },readlink:function (node) {
          if (!FS.isLink(node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          return node.link;
        }},stream_ops:{read:function (stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          if (position >= contents.length)
            return 0;
          var size = Math.min(contents.length - position, length);
          assert(size >= 0);
          if (size > 8 && contents.subarray) { // non-trivial, and typed array
            buffer.set(contents.subarray(position, position + size), offset);
          } else
          {
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i];
            }
          }
          return size;
        },write:function (stream, buffer, offset, length, position, canOwn) {
          var node = stream.node;
          node.timestamp = Date.now();
          var contents = node.contents;
          if (length && contents.length === 0 && position === 0 && buffer.subarray) {
            // just replace it with the new data
            assert(buffer.length);
            if (canOwn && offset === 0) {
              node.contents = buffer; // this could be a subarray of Emscripten HEAP, or allocated from some other source.
              node.contentMode = (buffer.buffer === HEAP8.buffer) ? MEMFS.CONTENT_OWNING : MEMFS.CONTENT_FIXED;
            } else {
              node.contents = new Uint8Array(buffer.subarray(offset, offset+length));
              node.contentMode = MEMFS.CONTENT_FIXED;
            }
            return length;
          }
          MEMFS.ensureFlexible(node);
          var contents = node.contents;
          while (contents.length < position) contents.push(0);
          for (var i = 0; i < length; i++) {
            contents[position + i] = buffer[offset + i];
          }
          return length;
        },llseek:function (stream, offset, whence) {
          var position = offset;
          if (whence === 1) {  // SEEK_CUR.
            position += stream.position;
          } else if (whence === 2) {  // SEEK_END.
            if (FS.isFile(stream.node.mode)) {
              position += stream.node.contents.length;
            }
          }
          if (position < 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          stream.ungotten = [];
          stream.position = position;
          return position;
        },allocate:function (stream, offset, length) {
          MEMFS.ensureFlexible(stream.node);
          var contents = stream.node.contents;
          var limit = offset + length;
          while (limit > contents.length) contents.push(0);
        },mmap:function (stream, buffer, offset, length, position, prot, flags) {
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
          }
          var ptr;
          var allocated;
          var contents = stream.node.contents;
          // Only make a new copy when MAP_PRIVATE is specified.
          if ( !(flags & 2) &&
                (contents.buffer === buffer || contents.buffer === buffer.buffer) ) {
            // We can't emulate MAP_SHARED when the file is not backed by the buffer
            // we're mapping to (e.g. the HEAP buffer).
            allocated = false;
            ptr = contents.byteOffset;
          } else {
            // Try to avoid unnecessary slices.
            if (position > 0 || position + length < contents.length) {
              if (contents.subarray) {
                contents = contents.subarray(position, position + length);
              } else {
                contents = Array.prototype.slice.call(contents, position, position + length);
              }
            }
            allocated = true;
            ptr = _malloc(length);
            if (!ptr) {
              throw new FS.ErrnoError(ERRNO_CODES.ENOMEM);
            }
            buffer.set(contents, ptr);
          }
          return { ptr: ptr, allocated: allocated };
        }}};
  
  var IDBFS={dbs:{},indexedDB:function () {
        return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
      },DB_VERSION:21,DB_STORE_NAME:"FILE_DATA",mount:function (mount) {
        // reuse all of the core MEMFS functionality
        return MEMFS.mount.apply(null, arguments);
      },syncfs:function (mount, populate, callback) {
        IDBFS.getLocalSet(mount, function(err, local) {
          if (err) return callback(err);
  
          IDBFS.getRemoteSet(mount, function(err, remote) {
            if (err) return callback(err);
  
            var src = populate ? remote : local;
            var dst = populate ? local : remote;
  
            IDBFS.reconcile(src, dst, callback);
          });
        });
      },getDB:function (name, callback) {
        // check the cache first
        var db = IDBFS.dbs[name];
        if (db) {
          return callback(null, db);
        }
  
        var req;
        try {
          req = IDBFS.indexedDB().open(name, IDBFS.DB_VERSION);
        } catch (e) {
          return callback(e);
        }
        req.onupgradeneeded = function(e) {
          var db = e.target.result;
          var transaction = e.target.transaction;
  
          var fileStore;
  
          if (db.objectStoreNames.contains(IDBFS.DB_STORE_NAME)) {
            fileStore = transaction.objectStore(IDBFS.DB_STORE_NAME);
          } else {
            fileStore = db.createObjectStore(IDBFS.DB_STORE_NAME);
          }
  
          fileStore.createIndex('timestamp', 'timestamp', { unique: false });
        };
        req.onsuccess = function() {
          db = req.result;
  
          // add to the cache
          IDBFS.dbs[name] = db;
          callback(null, db);
        };
        req.onerror = function() {
          callback(this.error);
        };
      },getLocalSet:function (mount, callback) {
        var entries = {};
  
        function isRealDir(p) {
          return p !== '.' && p !== '..';
        };
        function toAbsolute(root) {
          return function(p) {
            return PATH.join2(root, p);
          }
        };
  
        var check = FS.readdir(mount.mountpoint).filter(isRealDir).map(toAbsolute(mount.mountpoint));
  
        while (check.length) {
          var path = check.pop();
          var stat;
  
          try {
            stat = FS.stat(path);
          } catch (e) {
            return callback(e);
          }
  
          if (FS.isDir(stat.mode)) {
            check.push.apply(check, FS.readdir(path).filter(isRealDir).map(toAbsolute(path)));
          }
  
          entries[path] = { timestamp: stat.mtime };
        }
  
        return callback(null, { type: 'local', entries: entries });
      },getRemoteSet:function (mount, callback) {
        var entries = {};
  
        IDBFS.getDB(mount.mountpoint, function(err, db) {
          if (err) return callback(err);
  
          var transaction = db.transaction([IDBFS.DB_STORE_NAME], 'readonly');
          transaction.onerror = function() { callback(this.error); };
  
          var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
          var index = store.index('timestamp');
  
          index.openKeyCursor().onsuccess = function(event) {
            var cursor = event.target.result;
  
            if (!cursor) {
              return callback(null, { type: 'remote', db: db, entries: entries });
            }
  
            entries[cursor.primaryKey] = { timestamp: cursor.key };
  
            cursor.continue();
          };
        });
      },loadLocalEntry:function (path, callback) {
        var stat, node;
  
        try {
          var lookup = FS.lookupPath(path);
          node = lookup.node;
          stat = FS.stat(path);
        } catch (e) {
          return callback(e);
        }
  
        if (FS.isDir(stat.mode)) {
          return callback(null, { timestamp: stat.mtime, mode: stat.mode });
        } else if (FS.isFile(stat.mode)) {
          return callback(null, { timestamp: stat.mtime, mode: stat.mode, contents: node.contents });
        } else {
          return callback(new Error('node type not supported'));
        }
      },storeLocalEntry:function (path, entry, callback) {
        try {
          if (FS.isDir(entry.mode)) {
            FS.mkdir(path, entry.mode);
          } else if (FS.isFile(entry.mode)) {
            FS.writeFile(path, entry.contents, { encoding: 'binary', canOwn: true });
          } else {
            return callback(new Error('node type not supported'));
          }
  
          FS.utime(path, entry.timestamp, entry.timestamp);
        } catch (e) {
          return callback(e);
        }
  
        callback(null);
      },removeLocalEntry:function (path, callback) {
        try {
          var lookup = FS.lookupPath(path);
          var stat = FS.stat(path);
  
          if (FS.isDir(stat.mode)) {
            FS.rmdir(path);
          } else if (FS.isFile(stat.mode)) {
            FS.unlink(path);
          }
        } catch (e) {
          return callback(e);
        }
  
        callback(null);
      },loadRemoteEntry:function (store, path, callback) {
        var req = store.get(path);
        req.onsuccess = function(event) { callback(null, event.target.result); };
        req.onerror = function() { callback(this.error); };
      },storeRemoteEntry:function (store, path, entry, callback) {
        var req = store.put(entry, path);
        req.onsuccess = function() { callback(null); };
        req.onerror = function() { callback(this.error); };
      },removeRemoteEntry:function (store, path, callback) {
        var req = store.delete(path);
        req.onsuccess = function() { callback(null); };
        req.onerror = function() { callback(this.error); };
      },reconcile:function (src, dst, callback) {
        var total = 0;
  
        var create = [];
        Object.keys(src.entries).forEach(function (key) {
          var e = src.entries[key];
          var e2 = dst.entries[key];
          if (!e2 || e.timestamp > e2.timestamp) {
            create.push(key);
            total++;
          }
        });
  
        var remove = [];
        Object.keys(dst.entries).forEach(function (key) {
          var e = dst.entries[key];
          var e2 = src.entries[key];
          if (!e2) {
            remove.push(key);
            total++;
          }
        });
  
        if (!total) {
          return callback(null);
        }
  
        var errored = false;
        var completed = 0;
        var db = src.type === 'remote' ? src.db : dst.db;
        var transaction = db.transaction([IDBFS.DB_STORE_NAME], 'readwrite');
        var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
  
        function done(err) {
          if (err) {
            if (!done.errored) {
              done.errored = true;
              return callback(err);
            }
            return;
          }
          if (++completed >= total) {
            return callback(null);
          }
        };
  
        transaction.onerror = function() { done(this.error); };
  
        // sort paths in ascending order so directory entries are created
        // before the files inside them
        create.sort().forEach(function (path) {
          if (dst.type === 'local') {
            IDBFS.loadRemoteEntry(store, path, function (err, entry) {
              if (err) return done(err);
              IDBFS.storeLocalEntry(path, entry, done);
            });
          } else {
            IDBFS.loadLocalEntry(path, function (err, entry) {
              if (err) return done(err);
              IDBFS.storeRemoteEntry(store, path, entry, done);
            });
          }
        });
  
        // sort paths in descending order so files are deleted before their
        // parent directories
        remove.sort().reverse().forEach(function(path) {
          if (dst.type === 'local') {
            IDBFS.removeLocalEntry(path, done);
          } else {
            IDBFS.removeRemoteEntry(store, path, done);
          }
        });
      }};
  
  var NODEFS={isWindows:false,staticInit:function () {
        NODEFS.isWindows = !!process.platform.match(/^win/);
      },mount:function (mount) {
        assert(ENVIRONMENT_IS_NODE);
        return NODEFS.createNode(null, '/', NODEFS.getMode(mount.opts.root), 0);
      },createNode:function (parent, name, mode, dev) {
        if (!FS.isDir(mode) && !FS.isFile(mode) && !FS.isLink(mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var node = FS.createNode(parent, name, mode);
        node.node_ops = NODEFS.node_ops;
        node.stream_ops = NODEFS.stream_ops;
        return node;
      },getMode:function (path) {
        var stat;
        try {
          stat = fs.lstatSync(path);
          if (NODEFS.isWindows) {
            // On Windows, directories return permission bits 'rw-rw-rw-', even though they have 'rwxrwxrwx', so 
            // propagate write bits to execute bits.
            stat.mode = stat.mode | ((stat.mode & 146) >> 1);
          }
        } catch (e) {
          if (!e.code) throw e;
          throw new FS.ErrnoError(ERRNO_CODES[e.code]);
        }
        return stat.mode;
      },realPath:function (node) {
        var parts = [];
        while (node.parent !== node) {
          parts.push(node.name);
          node = node.parent;
        }
        parts.push(node.mount.opts.root);
        parts.reverse();
        return PATH.join.apply(null, parts);
      },flagsToPermissionStringMap:{0:"r",1:"r+",2:"r+",64:"r",65:"r+",66:"r+",129:"rx+",193:"rx+",514:"w+",577:"w",578:"w+",705:"wx",706:"wx+",1024:"a",1025:"a",1026:"a+",1089:"a",1090:"a+",1153:"ax",1154:"ax+",1217:"ax",1218:"ax+",4096:"rs",4098:"rs+"},flagsToPermissionString:function (flags) {
        if (flags in NODEFS.flagsToPermissionStringMap) {
          return NODEFS.flagsToPermissionStringMap[flags];
        } else {
          return flags;
        }
      },node_ops:{getattr:function (node) {
          var path = NODEFS.realPath(node);
          var stat;
          try {
            stat = fs.lstatSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          // node.js v0.10.20 doesn't report blksize and blocks on Windows. Fake them with default blksize of 4096.
          // See http://support.microsoft.com/kb/140365
          if (NODEFS.isWindows && !stat.blksize) {
            stat.blksize = 4096;
          }
          if (NODEFS.isWindows && !stat.blocks) {
            stat.blocks = (stat.size+stat.blksize-1)/stat.blksize|0;
          }
          return {
            dev: stat.dev,
            ino: stat.ino,
            mode: stat.mode,
            nlink: stat.nlink,
            uid: stat.uid,
            gid: stat.gid,
            rdev: stat.rdev,
            size: stat.size,
            atime: stat.atime,
            mtime: stat.mtime,
            ctime: stat.ctime,
            blksize: stat.blksize,
            blocks: stat.blocks
          };
        },setattr:function (node, attr) {
          var path = NODEFS.realPath(node);
          try {
            if (attr.mode !== undefined) {
              fs.chmodSync(path, attr.mode);
              // update the common node structure mode as well
              node.mode = attr.mode;
            }
            if (attr.timestamp !== undefined) {
              var date = new Date(attr.timestamp);
              fs.utimesSync(path, date, date);
            }
            if (attr.size !== undefined) {
              fs.truncateSync(path, attr.size);
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },lookup:function (parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          var mode = NODEFS.getMode(path);
          return NODEFS.createNode(parent, name, mode);
        },mknod:function (parent, name, mode, dev) {
          var node = NODEFS.createNode(parent, name, mode, dev);
          // create the backing node for this in the fs root as well
          var path = NODEFS.realPath(node);
          try {
            if (FS.isDir(node.mode)) {
              fs.mkdirSync(path, node.mode);
            } else {
              fs.writeFileSync(path, '', { mode: node.mode });
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          return node;
        },rename:function (oldNode, newDir, newName) {
          var oldPath = NODEFS.realPath(oldNode);
          var newPath = PATH.join2(NODEFS.realPath(newDir), newName);
          try {
            fs.renameSync(oldPath, newPath);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },unlink:function (parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          try {
            fs.unlinkSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },rmdir:function (parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          try {
            fs.rmdirSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },readdir:function (node) {
          var path = NODEFS.realPath(node);
          try {
            return fs.readdirSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },symlink:function (parent, newName, oldPath) {
          var newPath = PATH.join2(NODEFS.realPath(parent), newName);
          try {
            fs.symlinkSync(oldPath, newPath);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },readlink:function (node) {
          var path = NODEFS.realPath(node);
          try {
            return fs.readlinkSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        }},stream_ops:{open:function (stream) {
          var path = NODEFS.realPath(stream.node);
          try {
            if (FS.isFile(stream.node.mode)) {
              stream.nfd = fs.openSync(path, NODEFS.flagsToPermissionString(stream.flags));
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },close:function (stream) {
          try {
            if (FS.isFile(stream.node.mode) && stream.nfd) {
              fs.closeSync(stream.nfd);
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },read:function (stream, buffer, offset, length, position) {
          // FIXME this is terrible.
          var nbuffer = new Buffer(length);
          var res;
          try {
            res = fs.readSync(stream.nfd, nbuffer, 0, length, position);
          } catch (e) {
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          if (res > 0) {
            for (var i = 0; i < res; i++) {
              buffer[offset + i] = nbuffer[i];
            }
          }
          return res;
        },write:function (stream, buffer, offset, length, position) {
          // FIXME this is terrible.
          var nbuffer = new Buffer(buffer.subarray(offset, offset + length));
          var res;
          try {
            res = fs.writeSync(stream.nfd, nbuffer, 0, length, position);
          } catch (e) {
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          return res;
        },llseek:function (stream, offset, whence) {
          var position = offset;
          if (whence === 1) {  // SEEK_CUR.
            position += stream.position;
          } else if (whence === 2) {  // SEEK_END.
            if (FS.isFile(stream.node.mode)) {
              try {
                var stat = fs.fstatSync(stream.nfd);
                position += stat.size;
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES[e.code]);
              }
            }
          }
  
          if (position < 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
  
          stream.position = position;
          return position;
        }}};
  
  var _stdin=allocate(1, "i32*", ALLOC_STATIC);
  
  var _stdout=allocate(1, "i32*", ALLOC_STATIC);
  
  var _stderr=allocate(1, "i32*", ALLOC_STATIC);
  
  function _fflush(stream) {
      // int fflush(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fflush.html
      // we don't currently perform any user-space buffering of data
    }var FS={root:null,mounts:[],devices:[null],streams:[],nextInode:1,nameTable:null,currentPath:"/",initialized:false,ignorePermissions:true,ErrnoError:null,genericErrors:{},handleFSError:function (e) {
        if (!(e instanceof FS.ErrnoError)) throw e + ' : ' + stackTrace();
        return ___setErrNo(e.errno);
      },lookupPath:function (path, opts) {
        path = PATH.resolve(FS.cwd(), path);
        opts = opts || {};
  
        var defaults = {
          follow_mount: true,
          recurse_count: 0
        };
        for (var key in defaults) {
          if (opts[key] === undefined) {
            opts[key] = defaults[key];
          }
        }
  
        if (opts.recurse_count > 8) {  // max recursive lookup of 8
          throw new FS.ErrnoError(ERRNO_CODES.ELOOP);
        }
  
        // split the path
        var parts = PATH.normalizeArray(path.split('/').filter(function(p) {
          return !!p;
        }), false);
  
        // start at the root
        var current = FS.root;
        var current_path = '/';
  
        for (var i = 0; i < parts.length; i++) {
          var islast = (i === parts.length-1);
          if (islast && opts.parent) {
            // stop resolving
            break;
          }
  
          current = FS.lookupNode(current, parts[i]);
          current_path = PATH.join2(current_path, parts[i]);
  
          // jump to the mount's root node if this is a mountpoint
          if (FS.isMountpoint(current)) {
            if (!islast || (islast && opts.follow_mount)) {
              current = current.mounted.root;
            }
          }
  
          // by default, lookupPath will not follow a symlink if it is the final path component.
          // setting opts.follow = true will override this behavior.
          if (!islast || opts.follow) {
            var count = 0;
            while (FS.isLink(current.mode)) {
              var link = FS.readlink(current_path);
              current_path = PATH.resolve(PATH.dirname(current_path), link);
              
              var lookup = FS.lookupPath(current_path, { recurse_count: opts.recurse_count });
              current = lookup.node;
  
              if (count++ > 40) {  // limit max consecutive symlinks to 40 (SYMLOOP_MAX).
                throw new FS.ErrnoError(ERRNO_CODES.ELOOP);
              }
            }
          }
        }
  
        return { path: current_path, node: current };
      },getPath:function (node) {
        var path;
        while (true) {
          if (FS.isRoot(node)) {
            var mount = node.mount.mountpoint;
            if (!path) return mount;
            return mount[mount.length-1] !== '/' ? mount + '/' + path : mount + path;
          }
          path = path ? node.name + '/' + path : node.name;
          node = node.parent;
        }
      },hashName:function (parentid, name) {
        var hash = 0;
  
  
        for (var i = 0; i < name.length; i++) {
          hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
        }
        return ((parentid + hash) >>> 0) % FS.nameTable.length;
      },hashAddNode:function (node) {
        var hash = FS.hashName(node.parent.id, node.name);
        node.name_next = FS.nameTable[hash];
        FS.nameTable[hash] = node;
      },hashRemoveNode:function (node) {
        var hash = FS.hashName(node.parent.id, node.name);
        if (FS.nameTable[hash] === node) {
          FS.nameTable[hash] = node.name_next;
        } else {
          var current = FS.nameTable[hash];
          while (current) {
            if (current.name_next === node) {
              current.name_next = node.name_next;
              break;
            }
            current = current.name_next;
          }
        }
      },lookupNode:function (parent, name) {
        var err = FS.mayLookup(parent);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        var hash = FS.hashName(parent.id, name);
        for (var node = FS.nameTable[hash]; node; node = node.name_next) {
          var nodeName = node.name;
          if (node.parent.id === parent.id && nodeName === name) {
            return node;
          }
        }
        // if we failed to find it in the cache, call into the VFS
        return FS.lookup(parent, name);
      },createNode:function (parent, name, mode, rdev) {
        if (!FS.FSNode) {
          FS.FSNode = function(parent, name, mode, rdev) {
            if (!parent) {
              parent = this;  // root node sets parent to itself
            }
            this.parent = parent;
            this.mount = parent.mount;
            this.mounted = null;
            this.id = FS.nextInode++;
            this.name = name;
            this.mode = mode;
            this.node_ops = {};
            this.stream_ops = {};
            this.rdev = rdev;
          };
  
          FS.FSNode.prototype = {};
  
          // compatibility
          var readMode = 292 | 73;
          var writeMode = 146;
  
          // NOTE we must use Object.defineProperties instead of individual calls to
          // Object.defineProperty in order to make closure compiler happy
          Object.defineProperties(FS.FSNode.prototype, {
            read: {
              get: function() { return (this.mode & readMode) === readMode; },
              set: function(val) { val ? this.mode |= readMode : this.mode &= ~readMode; }
            },
            write: {
              get: function() { return (this.mode & writeMode) === writeMode; },
              set: function(val) { val ? this.mode |= writeMode : this.mode &= ~writeMode; }
            },
            isFolder: {
              get: function() { return FS.isDir(this.mode); },
            },
            isDevice: {
              get: function() { return FS.isChrdev(this.mode); },
            },
          });
        }
  
        var node = new FS.FSNode(parent, name, mode, rdev);
  
        FS.hashAddNode(node);
  
        return node;
      },destroyNode:function (node) {
        FS.hashRemoveNode(node);
      },isRoot:function (node) {
        return node === node.parent;
      },isMountpoint:function (node) {
        return !!node.mounted;
      },isFile:function (mode) {
        return (mode & 61440) === 32768;
      },isDir:function (mode) {
        return (mode & 61440) === 16384;
      },isLink:function (mode) {
        return (mode & 61440) === 40960;
      },isChrdev:function (mode) {
        return (mode & 61440) === 8192;
      },isBlkdev:function (mode) {
        return (mode & 61440) === 24576;
      },isFIFO:function (mode) {
        return (mode & 61440) === 4096;
      },isSocket:function (mode) {
        return (mode & 49152) === 49152;
      },flagModes:{"r":0,"rs":1052672,"r+":2,"w":577,"wx":705,"xw":705,"w+":578,"wx+":706,"xw+":706,"a":1089,"ax":1217,"xa":1217,"a+":1090,"ax+":1218,"xa+":1218},modeStringToFlags:function (str) {
        var flags = FS.flagModes[str];
        if (typeof flags === 'undefined') {
          throw new Error('Unknown file open mode: ' + str);
        }
        return flags;
      },flagsToPermissionString:function (flag) {
        var accmode = flag & 2097155;
        var perms = ['r', 'w', 'rw'][accmode];
        if ((flag & 512)) {
          perms += 'w';
        }
        return perms;
      },nodePermissions:function (node, perms) {
        if (FS.ignorePermissions) {
          return 0;
        }
        // return 0 if any user, group or owner bits are set.
        if (perms.indexOf('r') !== -1 && !(node.mode & 292)) {
          return ERRNO_CODES.EACCES;
        } else if (perms.indexOf('w') !== -1 && !(node.mode & 146)) {
          return ERRNO_CODES.EACCES;
        } else if (perms.indexOf('x') !== -1 && !(node.mode & 73)) {
          return ERRNO_CODES.EACCES;
        }
        return 0;
      },mayLookup:function (dir) {
        return FS.nodePermissions(dir, 'x');
      },mayCreate:function (dir, name) {
        try {
          var node = FS.lookupNode(dir, name);
          return ERRNO_CODES.EEXIST;
        } catch (e) {
        }
        return FS.nodePermissions(dir, 'wx');
      },mayDelete:function (dir, name, isdir) {
        var node;
        try {
          node = FS.lookupNode(dir, name);
        } catch (e) {
          return e.errno;
        }
        var err = FS.nodePermissions(dir, 'wx');
        if (err) {
          return err;
        }
        if (isdir) {
          if (!FS.isDir(node.mode)) {
            return ERRNO_CODES.ENOTDIR;
          }
          if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
            return ERRNO_CODES.EBUSY;
          }
        } else {
          if (FS.isDir(node.mode)) {
            return ERRNO_CODES.EISDIR;
          }
        }
        return 0;
      },mayOpen:function (node, flags) {
        if (!node) {
          return ERRNO_CODES.ENOENT;
        }
        if (FS.isLink(node.mode)) {
          return ERRNO_CODES.ELOOP;
        } else if (FS.isDir(node.mode)) {
          if ((flags & 2097155) !== 0 ||  // opening for write
              (flags & 512)) {
            return ERRNO_CODES.EISDIR;
          }
        }
        return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
      },MAX_OPEN_FDS:4096,nextfd:function (fd_start, fd_end) {
        fd_start = fd_start || 0;
        fd_end = fd_end || FS.MAX_OPEN_FDS;
        for (var fd = fd_start; fd <= fd_end; fd++) {
          if (!FS.streams[fd]) {
            return fd;
          }
        }
        throw new FS.ErrnoError(ERRNO_CODES.EMFILE);
      },getStream:function (fd) {
        return FS.streams[fd];
      },createStream:function (stream, fd_start, fd_end) {
        if (!FS.FSStream) {
          FS.FSStream = function(){};
          FS.FSStream.prototype = {};
          // compatibility
          Object.defineProperties(FS.FSStream.prototype, {
            object: {
              get: function() { return this.node; },
              set: function(val) { this.node = val; }
            },
            isRead: {
              get: function() { return (this.flags & 2097155) !== 1; }
            },
            isWrite: {
              get: function() { return (this.flags & 2097155) !== 0; }
            },
            isAppend: {
              get: function() { return (this.flags & 1024); }
            }
          });
        }
        if (stream.__proto__) {
          // reuse the object
          stream.__proto__ = FS.FSStream.prototype;
        } else {
          var newStream = new FS.FSStream();
          for (var p in stream) {
            newStream[p] = stream[p];
          }
          stream = newStream;
        }
        var fd = FS.nextfd(fd_start, fd_end);
        stream.fd = fd;
        FS.streams[fd] = stream;
        return stream;
      },closeStream:function (fd) {
        FS.streams[fd] = null;
      },getStreamFromPtr:function (ptr) {
        return FS.streams[ptr - 1];
      },getPtrForStream:function (stream) {
        return stream ? stream.fd + 1 : 0;
      },chrdev_stream_ops:{open:function (stream) {
          var device = FS.getDevice(stream.node.rdev);
          // override node's stream ops with the device's
          stream.stream_ops = device.stream_ops;
          // forward the open call
          if (stream.stream_ops.open) {
            stream.stream_ops.open(stream);
          }
        },llseek:function () {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }},major:function (dev) {
        return ((dev) >> 8);
      },minor:function (dev) {
        return ((dev) & 0xff);
      },makedev:function (ma, mi) {
        return ((ma) << 8 | (mi));
      },registerDevice:function (dev, ops) {
        FS.devices[dev] = { stream_ops: ops };
      },getDevice:function (dev) {
        return FS.devices[dev];
      },getMounts:function (mount) {
        var mounts = [];
        var check = [mount];
  
        while (check.length) {
          var m = check.pop();
  
          mounts.push(m);
  
          check.push.apply(check, m.mounts);
        }
  
        return mounts;
      },syncfs:function (populate, callback) {
        if (typeof(populate) === 'function') {
          callback = populate;
          populate = false;
        }
  
        var mounts = FS.getMounts(FS.root.mount);
        var completed = 0;
  
        function done(err) {
          if (err) {
            if (!done.errored) {
              done.errored = true;
              return callback(err);
            }
            return;
          }
          if (++completed >= mounts.length) {
            callback(null);
          }
        };
  
        // sync all mounts
        mounts.forEach(function (mount) {
          if (!mount.type.syncfs) {
            return done(null);
          }
          mount.type.syncfs(mount, populate, done);
        });
      },mount:function (type, opts, mountpoint) {
        var root = mountpoint === '/';
        var pseudo = !mountpoint;
        var node;
  
        if (root && FS.root) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        } else if (!root && !pseudo) {
          var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
  
          mountpoint = lookup.path;  // use the absolute path
          node = lookup.node;
  
          if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
          }
  
          if (!FS.isDir(node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
          }
        }
  
        var mount = {
          type: type,
          opts: opts,
          mountpoint: mountpoint,
          mounts: []
        };
  
        // create a root node for the fs
        var mountRoot = type.mount(mount);
        mountRoot.mount = mount;
        mount.root = mountRoot;
  
        if (root) {
          FS.root = mountRoot;
        } else if (node) {
          // set as a mountpoint
          node.mounted = mount;
  
          // add the new mount to the current mount's children
          if (node.mount) {
            node.mount.mounts.push(mount);
          }
        }
  
        return mountRoot;
      },unmount:function (mountpoint) {
        var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
  
        if (!FS.isMountpoint(lookup.node)) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
  
        // destroy the nodes for this mount, and all its child mounts
        var node = lookup.node;
        var mount = node.mounted;
        var mounts = FS.getMounts(mount);
  
        Object.keys(FS.nameTable).forEach(function (hash) {
          var current = FS.nameTable[hash];
  
          while (current) {
            var next = current.name_next;
  
            if (mounts.indexOf(current.mount) !== -1) {
              FS.destroyNode(current);
            }
  
            current = next;
          }
        });
  
        // no longer a mountpoint
        node.mounted = null;
  
        // remove this mount from the child mounts
        var idx = node.mount.mounts.indexOf(mount);
        assert(idx !== -1);
        node.mount.mounts.splice(idx, 1);
      },lookup:function (parent, name) {
        return parent.node_ops.lookup(parent, name);
      },mknod:function (path, mode, dev) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var err = FS.mayCreate(parent, name);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.mknod) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return parent.node_ops.mknod(parent, name, mode, dev);
      },create:function (path, mode) {
        mode = mode !== undefined ? mode : 438 /* 0666 */;
        mode &= 4095;
        mode |= 32768;
        return FS.mknod(path, mode, 0);
      },mkdir:function (path, mode) {
        mode = mode !== undefined ? mode : 511 /* 0777 */;
        mode &= 511 | 512;
        mode |= 16384;
        return FS.mknod(path, mode, 0);
      },mkdev:function (path, mode, dev) {
        if (typeof(dev) === 'undefined') {
          dev = mode;
          mode = 438 /* 0666 */;
        }
        mode |= 8192;
        return FS.mknod(path, mode, dev);
      },symlink:function (oldpath, newpath) {
        var lookup = FS.lookupPath(newpath, { parent: true });
        var parent = lookup.node;
        var newname = PATH.basename(newpath);
        var err = FS.mayCreate(parent, newname);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.symlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return parent.node_ops.symlink(parent, newname, oldpath);
      },rename:function (old_path, new_path) {
        var old_dirname = PATH.dirname(old_path);
        var new_dirname = PATH.dirname(new_path);
        var old_name = PATH.basename(old_path);
        var new_name = PATH.basename(new_path);
        // parents must exist
        var lookup, old_dir, new_dir;
        try {
          lookup = FS.lookupPath(old_path, { parent: true });
          old_dir = lookup.node;
          lookup = FS.lookupPath(new_path, { parent: true });
          new_dir = lookup.node;
        } catch (e) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        // need to be part of the same mount
        if (old_dir.mount !== new_dir.mount) {
          throw new FS.ErrnoError(ERRNO_CODES.EXDEV);
        }
        // source must exist
        var old_node = FS.lookupNode(old_dir, old_name);
        // old path should not be an ancestor of the new path
        var relative = PATH.relative(old_path, new_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        // new path should not be an ancestor of the old path
        relative = PATH.relative(new_path, old_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
        }
        // see if the new path already exists
        var new_node;
        try {
          new_node = FS.lookupNode(new_dir, new_name);
        } catch (e) {
          // not fatal
        }
        // early out if nothing needs to change
        if (old_node === new_node) {
          return;
        }
        // we'll need to delete the old entry
        var isdir = FS.isDir(old_node.mode);
        var err = FS.mayDelete(old_dir, old_name, isdir);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        // need delete permissions if we'll be overwriting.
        // need create permissions if new doesn't already exist.
        err = new_node ?
          FS.mayDelete(new_dir, new_name, isdir) :
          FS.mayCreate(new_dir, new_name);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!old_dir.node_ops.rename) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(old_node) || (new_node && FS.isMountpoint(new_node))) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        // if we are going to change the parent, check write permissions
        if (new_dir !== old_dir) {
          err = FS.nodePermissions(old_dir, 'w');
          if (err) {
            throw new FS.ErrnoError(err);
          }
        }
        // remove the node from the lookup hash
        FS.hashRemoveNode(old_node);
        // do the underlying fs rename
        try {
          old_dir.node_ops.rename(old_node, new_dir, new_name);
        } catch (e) {
          throw e;
        } finally {
          // add the node back to the hash (in case node_ops.rename
          // changed its name)
          FS.hashAddNode(old_node);
        }
      },rmdir:function (path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var err = FS.mayDelete(parent, name, true);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.rmdir) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        parent.node_ops.rmdir(parent, name);
        FS.destroyNode(node);
      },readdir:function (path) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        if (!node.node_ops.readdir) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
        }
        return node.node_ops.readdir(node);
      },unlink:function (path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var err = FS.mayDelete(parent, name, false);
        if (err) {
          // POSIX says unlink should set EPERM, not EISDIR
          if (err === ERRNO_CODES.EISDIR) err = ERRNO_CODES.EPERM;
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.unlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        parent.node_ops.unlink(parent, name);
        FS.destroyNode(node);
      },readlink:function (path) {
        var lookup = FS.lookupPath(path);
        var link = lookup.node;
        if (!link.node_ops.readlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        return link.node_ops.readlink(link);
      },stat:function (path, dontFollow) {
        var lookup = FS.lookupPath(path, { follow: !dontFollow });
        var node = lookup.node;
        if (!node.node_ops.getattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return node.node_ops.getattr(node);
      },lstat:function (path) {
        return FS.stat(path, true);
      },chmod:function (path, mode, dontFollow) {
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        node.node_ops.setattr(node, {
          mode: (mode & 4095) | (node.mode & ~4095),
          timestamp: Date.now()
        });
      },lchmod:function (path, mode) {
        FS.chmod(path, mode, true);
      },fchmod:function (fd, mode) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        FS.chmod(stream.node, mode);
      },chown:function (path, uid, gid, dontFollow) {
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        node.node_ops.setattr(node, {
          timestamp: Date.now()
          // we ignore the uid / gid for now
        });
      },lchown:function (path, uid, gid) {
        FS.chown(path, uid, gid, true);
      },fchown:function (fd, uid, gid) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        FS.chown(stream.node, uid, gid);
      },truncate:function (path, len) {
        if (len < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: true });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isDir(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!FS.isFile(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var err = FS.nodePermissions(node, 'w');
        if (err) {
          throw new FS.ErrnoError(err);
        }
        node.node_ops.setattr(node, {
          size: len,
          timestamp: Date.now()
        });
      },ftruncate:function (fd, len) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        FS.truncate(stream.node, len);
      },utime:function (path, atime, mtime) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        node.node_ops.setattr(node, {
          timestamp: Math.max(atime, mtime)
        });
      },open:function (path, flags, mode, fd_start, fd_end) {
        flags = typeof flags === 'string' ? FS.modeStringToFlags(flags) : flags;
        mode = typeof mode === 'undefined' ? 438 /* 0666 */ : mode;
        if ((flags & 64)) {
          mode = (mode & 4095) | 32768;
        } else {
          mode = 0;
        }
        var node;
        if (typeof path === 'object') {
          node = path;
        } else {
          path = PATH.normalize(path);
          try {
            var lookup = FS.lookupPath(path, {
              follow: !(flags & 131072)
            });
            node = lookup.node;
          } catch (e) {
            // ignore
          }
        }
        // perhaps we need to create the node
        if ((flags & 64)) {
          if (node) {
            // if O_CREAT and O_EXCL are set, error out if the node already exists
            if ((flags & 128)) {
              throw new FS.ErrnoError(ERRNO_CODES.EEXIST);
            }
          } else {
            // node doesn't exist, try to create it
            node = FS.mknod(path, mode, 0);
          }
        }
        if (!node) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        }
        // can't truncate a device
        if (FS.isChrdev(node.mode)) {
          flags &= ~512;
        }
        // check permissions
        var err = FS.mayOpen(node, flags);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        // do truncation if necessary
        if ((flags & 512)) {
          FS.truncate(node, 0);
        }
        // we've already handled these, don't pass down to the underlying vfs
        flags &= ~(128 | 512);
  
        // register the stream with the filesystem
        var stream = FS.createStream({
          node: node,
          path: FS.getPath(node),  // we want the absolute path to the node
          flags: flags,
          seekable: true,
          position: 0,
          stream_ops: node.stream_ops,
          // used by the file family libc calls (fopen, fwrite, ferror, etc.)
          ungotten: [],
          error: false
        }, fd_start, fd_end);
        // call the new stream's open function
        if (stream.stream_ops.open) {
          stream.stream_ops.open(stream);
        }
        if (Module['logReadFiles'] && !(flags & 1)) {
          if (!FS.readFiles) FS.readFiles = {};
          if (!(path in FS.readFiles)) {
            FS.readFiles[path] = 1;
            Module['printErr']('read file: ' + path);
          }
        }
        return stream;
      },close:function (stream) {
        try {
          if (stream.stream_ops.close) {
            stream.stream_ops.close(stream);
          }
        } catch (e) {
          throw e;
        } finally {
          FS.closeStream(stream.fd);
        }
      },llseek:function (stream, offset, whence) {
        if (!stream.seekable || !stream.stream_ops.llseek) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        return stream.stream_ops.llseek(stream, offset, whence);
      },read:function (stream, buffer, offset, length, position) {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!stream.stream_ops.read) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var seeking = true;
        if (typeof position === 'undefined') {
          position = stream.position;
          seeking = false;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
        if (!seeking) stream.position += bytesRead;
        return bytesRead;
      },write:function (stream, buffer, offset, length, position, canOwn) {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!stream.stream_ops.write) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var seeking = true;
        if (typeof position === 'undefined') {
          position = stream.position;
          seeking = false;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        if (stream.flags & 1024) {
          // seek to the end before writing in append mode
          FS.llseek(stream, 0, 2);
        }
        var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
        if (!seeking) stream.position += bytesWritten;
        return bytesWritten;
      },allocate:function (stream, offset, length) {
        if (offset < 0 || length <= 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (!FS.isFile(stream.node.mode) && !FS.isDir(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
        }
        if (!stream.stream_ops.allocate) {
          throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
        }
        stream.stream_ops.allocate(stream, offset, length);
      },mmap:function (stream, buffer, offset, length, position, prot, flags) {
        // TODO if PROT is PROT_WRITE, make sure we have write access
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(ERRNO_CODES.EACCES);
        }
        if (!stream.stream_ops.mmap) {
          throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
        }
        return stream.stream_ops.mmap(stream, buffer, offset, length, position, prot, flags);
      },ioctl:function (stream, cmd, arg) {
        if (!stream.stream_ops.ioctl) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTTY);
        }
        return stream.stream_ops.ioctl(stream, cmd, arg);
      },readFile:function (path, opts) {
        opts = opts || {};
        opts.flags = opts.flags || 'r';
        opts.encoding = opts.encoding || 'binary';
        if (opts.encoding !== 'utf8' && opts.encoding !== 'binary') {
          throw new Error('Invalid encoding type "' + opts.encoding + '"');
        }
        var ret;
        var stream = FS.open(path, opts.flags);
        var stat = FS.stat(path);
        var length = stat.size;
        var buf = new Uint8Array(length);
        FS.read(stream, buf, 0, length, 0);
        if (opts.encoding === 'utf8') {
          ret = '';
          var utf8 = new Runtime.UTF8Processor();
          for (var i = 0; i < length; i++) {
            ret += utf8.processCChar(buf[i]);
          }
        } else if (opts.encoding === 'binary') {
          ret = buf;
        }
        FS.close(stream);
        return ret;
      },writeFile:function (path, data, opts) {
        opts = opts || {};
        opts.flags = opts.flags || 'w';
        opts.encoding = opts.encoding || 'utf8';
        if (opts.encoding !== 'utf8' && opts.encoding !== 'binary') {
          throw new Error('Invalid encoding type "' + opts.encoding + '"');
        }
        var stream = FS.open(path, opts.flags, opts.mode);
        if (opts.encoding === 'utf8') {
          var utf8 = new Runtime.UTF8Processor();
          var buf = new Uint8Array(utf8.processJSString(data));
          FS.write(stream, buf, 0, buf.length, 0, opts.canOwn);
        } else if (opts.encoding === 'binary') {
          FS.write(stream, data, 0, data.length, 0, opts.canOwn);
        }
        FS.close(stream);
      },cwd:function () {
        return FS.currentPath;
      },chdir:function (path) {
        var lookup = FS.lookupPath(path, { follow: true });
        if (!FS.isDir(lookup.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
        }
        var err = FS.nodePermissions(lookup.node, 'x');
        if (err) {
          throw new FS.ErrnoError(err);
        }
        FS.currentPath = lookup.path;
      },createDefaultDirectories:function () {
        FS.mkdir('/tmp');
      },createDefaultDevices:function () {
        // create /dev
        FS.mkdir('/dev');
        // setup /dev/null
        FS.registerDevice(FS.makedev(1, 3), {
          read: function() { return 0; },
          write: function() { return 0; }
        });
        FS.mkdev('/dev/null', FS.makedev(1, 3));
        // setup /dev/tty and /dev/tty1
        // stderr needs to print output using Module['printErr']
        // so we register a second tty just for it.
        TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
        TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
        FS.mkdev('/dev/tty', FS.makedev(5, 0));
        FS.mkdev('/dev/tty1', FS.makedev(6, 0));
        // we're not going to emulate the actual shm device,
        // just create the tmp dirs that reside in it commonly
        FS.mkdir('/dev/shm');
        FS.mkdir('/dev/shm/tmp');
      },createStandardStreams:function () {
        // TODO deprecate the old functionality of a single
        // input / output callback and that utilizes FS.createDevice
        // and instead require a unique set of stream ops
  
        // by default, we symlink the standard streams to the
        // default tty devices. however, if the standard streams
        // have been overwritten we create a unique device for
        // them instead.
        if (Module['stdin']) {
          FS.createDevice('/dev', 'stdin', Module['stdin']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdin');
        }
        if (Module['stdout']) {
          FS.createDevice('/dev', 'stdout', null, Module['stdout']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdout');
        }
        if (Module['stderr']) {
          FS.createDevice('/dev', 'stderr', null, Module['stderr']);
        } else {
          FS.symlink('/dev/tty1', '/dev/stderr');
        }
  
        // open default streams for the stdin, stdout and stderr devices
        var stdin = FS.open('/dev/stdin', 'r');
        HEAP32[((_stdin)>>2)]=FS.getPtrForStream(stdin);
        assert(stdin.fd === 0, 'invalid handle for stdin (' + stdin.fd + ')');
  
        var stdout = FS.open('/dev/stdout', 'w');
        HEAP32[((_stdout)>>2)]=FS.getPtrForStream(stdout);
        assert(stdout.fd === 1, 'invalid handle for stdout (' + stdout.fd + ')');
  
        var stderr = FS.open('/dev/stderr', 'w');
        HEAP32[((_stderr)>>2)]=FS.getPtrForStream(stderr);
        assert(stderr.fd === 2, 'invalid handle for stderr (' + stderr.fd + ')');
      },ensureErrnoError:function () {
        if (FS.ErrnoError) return;
        FS.ErrnoError = function ErrnoError(errno) {
          this.errno = errno;
          for (var key in ERRNO_CODES) {
            if (ERRNO_CODES[key] === errno) {
              this.code = key;
              break;
            }
          }
          this.message = ERRNO_MESSAGES[errno];
          if (this.stack) this.stack = demangleAll(this.stack);
        };
        FS.ErrnoError.prototype = new Error();
        FS.ErrnoError.prototype.constructor = FS.ErrnoError;
        // Some errors may happen quite a bit, to avoid overhead we reuse them (and suffer a lack of stack info)
        [ERRNO_CODES.ENOENT].forEach(function(code) {
          FS.genericErrors[code] = new FS.ErrnoError(code);
          FS.genericErrors[code].stack = '<generic error, no stack>';
        });
      },staticInit:function () {
        FS.ensureErrnoError();
  
        FS.nameTable = new Array(4096);
  
        FS.mount(MEMFS, {}, '/');
  
        FS.createDefaultDirectories();
        FS.createDefaultDevices();
      },init:function (input, output, error) {
        assert(!FS.init.initialized, 'FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)');
        FS.init.initialized = true;
  
        FS.ensureErrnoError();
  
        // Allow Module.stdin etc. to provide defaults, if none explicitly passed to us here
        Module['stdin'] = input || Module['stdin'];
        Module['stdout'] = output || Module['stdout'];
        Module['stderr'] = error || Module['stderr'];
  
        FS.createStandardStreams();
      },quit:function () {
        FS.init.initialized = false;
        for (var i = 0; i < FS.streams.length; i++) {
          var stream = FS.streams[i];
          if (!stream) {
            continue;
          }
          FS.close(stream);
        }
      },getMode:function (canRead, canWrite) {
        var mode = 0;
        if (canRead) mode |= 292 | 73;
        if (canWrite) mode |= 146;
        return mode;
      },joinPath:function (parts, forceRelative) {
        var path = PATH.join.apply(null, parts);
        if (forceRelative && path[0] == '/') path = path.substr(1);
        return path;
      },absolutePath:function (relative, base) {
        return PATH.resolve(base, relative);
      },standardizePath:function (path) {
        return PATH.normalize(path);
      },findObject:function (path, dontResolveLastLink) {
        var ret = FS.analyzePath(path, dontResolveLastLink);
        if (ret.exists) {
          return ret.object;
        } else {
          ___setErrNo(ret.error);
          return null;
        }
      },analyzePath:function (path, dontResolveLastLink) {
        // operate from within the context of the symlink's target
        try {
          var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          path = lookup.path;
        } catch (e) {
        }
        var ret = {
          isRoot: false, exists: false, error: 0, name: null, path: null, object: null,
          parentExists: false, parentPath: null, parentObject: null
        };
        try {
          var lookup = FS.lookupPath(path, { parent: true });
          ret.parentExists = true;
          ret.parentPath = lookup.path;
          ret.parentObject = lookup.node;
          ret.name = PATH.basename(path);
          lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          ret.exists = true;
          ret.path = lookup.path;
          ret.object = lookup.node;
          ret.name = lookup.node.name;
          ret.isRoot = lookup.path === '/';
        } catch (e) {
          ret.error = e.errno;
        };
        return ret;
      },createFolder:function (parent, name, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.mkdir(path, mode);
      },createPath:function (parent, path, canRead, canWrite) {
        parent = typeof parent === 'string' ? parent : FS.getPath(parent);
        var parts = path.split('/').reverse();
        while (parts.length) {
          var part = parts.pop();
          if (!part) continue;
          var current = PATH.join2(parent, part);
          try {
            FS.mkdir(current);
          } catch (e) {
            // ignore EEXIST
          }
          parent = current;
        }
        return current;
      },createFile:function (parent, name, properties, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.create(path, mode);
      },createDataFile:function (parent, name, data, canRead, canWrite, canOwn) {
        var path = name ? PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name) : parent;
        var mode = FS.getMode(canRead, canWrite);
        var node = FS.create(path, mode);
        if (data) {
          if (typeof data === 'string') {
            var arr = new Array(data.length);
            for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
            data = arr;
          }
          // make sure we can write to the file
          FS.chmod(node, mode | 146);
          var stream = FS.open(node, 'w');
          FS.write(stream, data, 0, data.length, 0, canOwn);
          FS.close(stream);
          FS.chmod(node, mode);
        }
        return node;
      },createDevice:function (parent, name, input, output) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(!!input, !!output);
        if (!FS.createDevice.major) FS.createDevice.major = 64;
        var dev = FS.makedev(FS.createDevice.major++, 0);
        // Create a fake device that a set of stream ops to emulate
        // the old behavior.
        FS.registerDevice(dev, {
          open: function(stream) {
            stream.seekable = false;
          },
          close: function(stream) {
            // flush any pending line data
            if (output && output.buffer && output.buffer.length) {
              output(10);
            }
          },
          read: function(stream, buffer, offset, length, pos /* ignored */) {
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
              var result;
              try {
                result = input();
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES.EIO);
              }
              if (result === undefined && bytesRead === 0) {
                throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
              }
              if (result === null || result === undefined) break;
              bytesRead++;
              buffer[offset+i] = result;
            }
            if (bytesRead) {
              stream.node.timestamp = Date.now();
            }
            return bytesRead;
          },
          write: function(stream, buffer, offset, length, pos) {
            for (var i = 0; i < length; i++) {
              try {
                output(buffer[offset+i]);
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES.EIO);
              }
            }
            if (length) {
              stream.node.timestamp = Date.now();
            }
            return i;
          }
        });
        return FS.mkdev(path, mode, dev);
      },createLink:function (parent, name, target, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        return FS.symlink(target, path);
      },forceLoadFile:function (obj) {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
        var success = true;
        if (typeof XMLHttpRequest !== 'undefined') {
          throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
        } else if (Module['read']) {
          // Command-line.
          try {
            // WARNING: Can't read binary files in V8's d8 or tracemonkey's js, as
            //          read() will try to parse UTF8.
            obj.contents = intArrayFromString(Module['read'](obj.url), true);
          } catch (e) {
            success = false;
          }
        } else {
          throw new Error('Cannot load without read() or XMLHttpRequest.');
        }
        if (!success) ___setErrNo(ERRNO_CODES.EIO);
        return success;
      },createLazyFile:function (parent, name, url, canRead, canWrite) {
        if (typeof XMLHttpRequest !== 'undefined') {
          if (!ENVIRONMENT_IS_WORKER) throw 'Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc';
          // Lazy chunked Uint8Array (implements get and length from Uint8Array). Actual getting is abstracted away for eventual reuse.
          function LazyUint8Array() {
            this.lengthKnown = false;
            this.chunks = []; // Loaded chunks. Index is the chunk number
          }
          LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
            if (idx > this.length-1 || idx < 0) {
              return undefined;
            }
            var chunkOffset = idx % this.chunkSize;
            var chunkNum = Math.floor(idx / this.chunkSize);
            return this.getter(chunkNum)[chunkOffset];
          }
          LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
            this.getter = getter;
          }
          LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
              // Find length
              var xhr = new XMLHttpRequest();
              xhr.open('HEAD', url, false);
              xhr.send(null);
              if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
              var datalength = Number(xhr.getResponseHeader("Content-length"));
              var header;
              var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
              var chunkSize = 1024*1024; // Chunk size in bytes
  
              if (!hasByteServing) chunkSize = datalength;
  
              // Function to get a range from the remote URL.
              var doXHR = (function(from, to) {
                if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
                if (to > datalength-1) throw new Error("only " + datalength + " bytes available! programmer error!");
  
                // TODO: Use mozResponseArrayBuffer, responseStream, etc. if available.
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url, false);
                if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
  
                // Some hints to the browser that we want binary data.
                if (typeof Uint8Array != 'undefined') xhr.responseType = 'arraybuffer';
                if (xhr.overrideMimeType) {
                  xhr.overrideMimeType('text/plain; charset=x-user-defined');
                }
  
                xhr.send(null);
                if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
                if (xhr.response !== undefined) {
                  return new Uint8Array(xhr.response || []);
                } else {
                  return intArrayFromString(xhr.responseText || '', true);
                }
              });
              var lazyArray = this;
              lazyArray.setDataGetter(function(chunkNum) {
                var start = chunkNum * chunkSize;
                var end = (chunkNum+1) * chunkSize - 1; // including this byte
                end = Math.min(end, datalength-1); // if datalength-1 is selected, this is the last block
                if (typeof(lazyArray.chunks[chunkNum]) === "undefined") {
                  lazyArray.chunks[chunkNum] = doXHR(start, end);
                }
                if (typeof(lazyArray.chunks[chunkNum]) === "undefined") throw new Error("doXHR failed!");
                return lazyArray.chunks[chunkNum];
              });
  
              this._length = datalength;
              this._chunkSize = chunkSize;
              this.lengthKnown = true;
          }
  
          var lazyArray = new LazyUint8Array();
          Object.defineProperty(lazyArray, "length", {
              get: function() {
                  if(!this.lengthKnown) {
                      this.cacheLength();
                  }
                  return this._length;
              }
          });
          Object.defineProperty(lazyArray, "chunkSize", {
              get: function() {
                  if(!this.lengthKnown) {
                      this.cacheLength();
                  }
                  return this._chunkSize;
              }
          });
  
          var properties = { isDevice: false, contents: lazyArray };
        } else {
          var properties = { isDevice: false, url: url };
        }
  
        var node = FS.createFile(parent, name, properties, canRead, canWrite);
        // This is a total hack, but I want to get this lazy file code out of the
        // core of MEMFS. If we want to keep this lazy file concept I feel it should
        // be its own thin LAZYFS proxying calls to MEMFS.
        if (properties.contents) {
          node.contents = properties.contents;
        } else if (properties.url) {
          node.contents = null;
          node.url = properties.url;
        }
        // override each stream op with one that tries to force load the lazy file first
        var stream_ops = {};
        var keys = Object.keys(node.stream_ops);
        keys.forEach(function(key) {
          var fn = node.stream_ops[key];
          stream_ops[key] = function forceLoadLazyFile() {
            if (!FS.forceLoadFile(node)) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
            return fn.apply(null, arguments);
          };
        });
        // use a custom read function
        stream_ops.read = function stream_ops_read(stream, buffer, offset, length, position) {
          if (!FS.forceLoadFile(node)) {
            throw new FS.ErrnoError(ERRNO_CODES.EIO);
          }
          var contents = stream.node.contents;
          if (position >= contents.length)
            return 0;
          var size = Math.min(contents.length - position, length);
          assert(size >= 0);
          if (contents.slice) { // normal array
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i];
            }
          } else {
            for (var i = 0; i < size; i++) { // LazyUint8Array from sync binary XHR
              buffer[offset + i] = contents.get(position + i);
            }
          }
          return size;
        };
        node.stream_ops = stream_ops;
        return node;
      },createPreloadedFile:function (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn) {
        Browser.init();
        // TODO we should allow people to just pass in a complete filename instead
        // of parent and name being that we just join them anyways
        var fullname = name ? PATH.resolve(PATH.join2(parent, name)) : parent;
        function processData(byteArray) {
          function finish(byteArray) {
            if (!dontCreateFile) {
              FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
            }
            if (onload) onload();
            removeRunDependency('cp ' + fullname);
          }
          var handled = false;
          Module['preloadPlugins'].forEach(function(plugin) {
            if (handled) return;
            if (plugin['canHandle'](fullname)) {
              plugin['handle'](byteArray, fullname, finish, function() {
                if (onerror) onerror();
                removeRunDependency('cp ' + fullname);
              });
              handled = true;
            }
          });
          if (!handled) finish(byteArray);
        }
        addRunDependency('cp ' + fullname);
        if (typeof url == 'string') {
          Browser.asyncLoad(url, function(byteArray) {
            processData(byteArray);
          }, onerror);
        } else {
          processData(url);
        }
      },indexedDB:function () {
        return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
      },DB_NAME:function () {
        return 'EM_FS_' + window.location.pathname;
      },DB_VERSION:20,DB_STORE_NAME:"FILE_DATA",saveFilesToDB:function (paths, onload, onerror) {
        onload = onload || function(){};
        onerror = onerror || function(){};
        var indexedDB = FS.indexedDB();
        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        openRequest.onupgradeneeded = function openRequest_onupgradeneeded() {
          console.log('creating db');
          var db = openRequest.result;
          db.createObjectStore(FS.DB_STORE_NAME);
        };
        openRequest.onsuccess = function openRequest_onsuccess() {
          var db = openRequest.result;
          var transaction = db.transaction([FS.DB_STORE_NAME], 'readwrite');
          var files = transaction.objectStore(FS.DB_STORE_NAME);
          var ok = 0, fail = 0, total = paths.length;
          function finish() {
            if (fail == 0) onload(); else onerror();
          }
          paths.forEach(function(path) {
            var putRequest = files.put(FS.analyzePath(path).object.contents, path);
            putRequest.onsuccess = function putRequest_onsuccess() { ok++; if (ok + fail == total) finish() };
            putRequest.onerror = function putRequest_onerror() { fail++; if (ok + fail == total) finish() };
          });
          transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
      },loadFilesFromDB:function (paths, onload, onerror) {
        onload = onload || function(){};
        onerror = onerror || function(){};
        var indexedDB = FS.indexedDB();
        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        openRequest.onupgradeneeded = onerror; // no database to load from
        openRequest.onsuccess = function openRequest_onsuccess() {
          var db = openRequest.result;
          try {
            var transaction = db.transaction([FS.DB_STORE_NAME], 'readonly');
          } catch(e) {
            onerror(e);
            return;
          }
          var files = transaction.objectStore(FS.DB_STORE_NAME);
          var ok = 0, fail = 0, total = paths.length;
          function finish() {
            if (fail == 0) onload(); else onerror();
          }
          paths.forEach(function(path) {
            var getRequest = files.get(path);
            getRequest.onsuccess = function getRequest_onsuccess() {
              if (FS.analyzePath(path).exists) {
                FS.unlink(path);
              }
              FS.createDataFile(PATH.dirname(path), PATH.basename(path), getRequest.result, true, true, true);
              ok++;
              if (ok + fail == total) finish();
            };
            getRequest.onerror = function getRequest_onerror() { fail++; if (ok + fail == total) finish() };
          });
          transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
      }};
  
  var Browser={mainLoop:{scheduler:null,method:"",shouldPause:false,paused:false,queue:[],pause:function () {
          Browser.mainLoop.shouldPause = true;
        },resume:function () {
          if (Browser.mainLoop.paused) {
            Browser.mainLoop.paused = false;
            Browser.mainLoop.scheduler();
          }
          Browser.mainLoop.shouldPause = false;
        },updateStatus:function () {
          if (Module['setStatus']) {
            var message = Module['statusMessage'] || 'Please wait...';
            var remaining = Browser.mainLoop.remainingBlockers;
            var expected = Browser.mainLoop.expectedBlockers;
            if (remaining) {
              if (remaining < expected) {
                Module['setStatus'](message + ' (' + (expected - remaining) + '/' + expected + ')');
              } else {
                Module['setStatus'](message);
              }
            } else {
              Module['setStatus']('');
            }
          }
        }},isFullScreen:false,pointerLock:false,moduleContextCreatedCallbacks:[],workers:[],init:function () {
        if (!Module["preloadPlugins"]) Module["preloadPlugins"] = []; // needs to exist even in workers
  
        if (Browser.initted || ENVIRONMENT_IS_WORKER) return;
        Browser.initted = true;
  
        try {
          new Blob();
          Browser.hasBlobConstructor = true;
        } catch(e) {
          Browser.hasBlobConstructor = false;
          console.log("warning: no blob constructor, cannot create blobs with mimetypes");
        }
        Browser.BlobBuilder = typeof MozBlobBuilder != "undefined" ? MozBlobBuilder : (typeof WebKitBlobBuilder != "undefined" ? WebKitBlobBuilder : (!Browser.hasBlobConstructor ? console.log("warning: no BlobBuilder") : null));
        Browser.URLObject = typeof window != "undefined" ? (window.URL ? window.URL : window.webkitURL) : undefined;
        if (!Module.noImageDecoding && typeof Browser.URLObject === 'undefined') {
          console.log("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available.");
          Module.noImageDecoding = true;
        }
  
        // Support for plugins that can process preloaded files. You can add more of these to
        // your app by creating and appending to Module.preloadPlugins.
        //
        // Each plugin is asked if it can handle a file based on the file's name. If it can,
        // it is given the file's raw data. When it is done, it calls a callback with the file's
        // (possibly modified) data. For example, a plugin might decompress a file, or it
        // might create some side data structure for use later (like an Image element, etc.).
  
        var imagePlugin = {};
        imagePlugin['canHandle'] = function imagePlugin_canHandle(name) {
          return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(name);
        };
        imagePlugin['handle'] = function imagePlugin_handle(byteArray, name, onload, onerror) {
          var b = null;
          if (Browser.hasBlobConstructor) {
            try {
              b = new Blob([byteArray], { type: Browser.getMimetype(name) });
              if (b.size !== byteArray.length) { // Safari bug #118630
                // Safari's Blob can only take an ArrayBuffer
                b = new Blob([(new Uint8Array(byteArray)).buffer], { type: Browser.getMimetype(name) });
              }
            } catch(e) {
              Runtime.warnOnce('Blob constructor present but fails: ' + e + '; falling back to blob builder');
            }
          }
          if (!b) {
            var bb = new Browser.BlobBuilder();
            bb.append((new Uint8Array(byteArray)).buffer); // we need to pass a buffer, and must copy the array to get the right data range
            b = bb.getBlob();
          }
          var url = Browser.URLObject.createObjectURL(b);
          assert(typeof url == 'string', 'createObjectURL must return a url as a string');
          var img = new Image();
          img.onload = function img_onload() {
            assert(img.complete, 'Image ' + name + ' could not be decoded');
            var canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            Module["preloadedImages"][name] = canvas;
            Browser.URLObject.revokeObjectURL(url);
            if (onload) onload(byteArray);
          };
          img.onerror = function img_onerror(event) {
            console.log('Image ' + url + ' could not be decoded');
            if (onerror) onerror();
          };
          img.src = url;
        };
        Module['preloadPlugins'].push(imagePlugin);
  
        var audioPlugin = {};
        audioPlugin['canHandle'] = function audioPlugin_canHandle(name) {
          return !Module.noAudioDecoding && name.substr(-4) in { '.ogg': 1, '.wav': 1, '.mp3': 1 };
        };
        audioPlugin['handle'] = function audioPlugin_handle(byteArray, name, onload, onerror) {
          var done = false;
          function finish(audio) {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = audio;
            if (onload) onload(byteArray);
          }
          function fail() {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = new Audio(); // empty shim
            if (onerror) onerror();
          }
          if (Browser.hasBlobConstructor) {
            try {
              var b = new Blob([byteArray], { type: Browser.getMimetype(name) });
            } catch(e) {
              return fail();
            }
            var url = Browser.URLObject.createObjectURL(b); // XXX we never revoke this!
            assert(typeof url == 'string', 'createObjectURL must return a url as a string');
            var audio = new Audio();
            audio.addEventListener('canplaythrough', function() { finish(audio) }, false); // use addEventListener due to chromium bug 124926
            audio.onerror = function audio_onerror(event) {
              if (done) return;
              console.log('warning: browser could not fully decode audio ' + name + ', trying slower base64 approach');
              function encode64(data) {
                var BASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
                var PAD = '=';
                var ret = '';
                var leftchar = 0;
                var leftbits = 0;
                for (var i = 0; i < data.length; i++) {
                  leftchar = (leftchar << 8) | data[i];
                  leftbits += 8;
                  while (leftbits >= 6) {
                    var curr = (leftchar >> (leftbits-6)) & 0x3f;
                    leftbits -= 6;
                    ret += BASE[curr];
                  }
                }
                if (leftbits == 2) {
                  ret += BASE[(leftchar&3) << 4];
                  ret += PAD + PAD;
                } else if (leftbits == 4) {
                  ret += BASE[(leftchar&0xf) << 2];
                  ret += PAD;
                }
                return ret;
              }
              audio.src = 'data:audio/x-' + name.substr(-3) + ';base64,' + encode64(byteArray);
              finish(audio); // we don't wait for confirmation this worked - but it's worth trying
            };
            audio.src = url;
            // workaround for chrome bug 124926 - we do not always get oncanplaythrough or onerror
            Browser.safeSetTimeout(function() {
              finish(audio); // try to use it even though it is not necessarily ready to play
            }, 10000);
          } else {
            return fail();
          }
        };
        Module['preloadPlugins'].push(audioPlugin);
  
        // Canvas event setup
  
        var canvas = Module['canvas'];
        canvas.requestPointerLock = canvas['requestPointerLock'] ||
                                    canvas['mozRequestPointerLock'] ||
                                    canvas['webkitRequestPointerLock'];
        canvas.exitPointerLock = document['exitPointerLock'] ||
                                 document['mozExitPointerLock'] ||
                                 document['webkitExitPointerLock'] ||
                                 function(){}; // no-op if function does not exist
        canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
  
        function pointerLockChange() {
          Browser.pointerLock = document['pointerLockElement'] === canvas ||
                                document['mozPointerLockElement'] === canvas ||
                                document['webkitPointerLockElement'] === canvas;
        }
  
        document.addEventListener('pointerlockchange', pointerLockChange, false);
        document.addEventListener('mozpointerlockchange', pointerLockChange, false);
        document.addEventListener('webkitpointerlockchange', pointerLockChange, false);
  
        if (Module['elementPointerLock']) {
          canvas.addEventListener("click", function(ev) {
            if (!Browser.pointerLock && canvas.requestPointerLock) {
              canvas.requestPointerLock();
              ev.preventDefault();
            }
          }, false);
        }
      },createContext:function (canvas, useWebGL, setInModule, webGLContextAttributes) {
        var ctx;
        var errorInfo = '?';
        function onContextCreationError(event) {
          errorInfo = event.statusMessage || errorInfo;
        }
        try {
          if (useWebGL) {
            var contextAttributes = {
              antialias: false,
              alpha: false
            };
  
            if (webGLContextAttributes) {
              for (var attribute in webGLContextAttributes) {
                contextAttributes[attribute] = webGLContextAttributes[attribute];
              }
            }
  
  
            canvas.addEventListener('webglcontextcreationerror', onContextCreationError, false);
            try {
              ['experimental-webgl', 'webgl'].some(function(webglId) {
                return ctx = canvas.getContext(webglId, contextAttributes);
              });
            } finally {
              canvas.removeEventListener('webglcontextcreationerror', onContextCreationError, false);
            }
          } else {
            ctx = canvas.getContext('2d');
          }
          if (!ctx) throw ':(';
        } catch (e) {
          Module.print('Could not create canvas: ' + [errorInfo, e]);
          return null;
        }
        if (useWebGL) {
          // Set the background of the WebGL canvas to black
          canvas.style.backgroundColor = "black";
  
          // Warn on context loss
          canvas.addEventListener('webglcontextlost', function(event) {
            alert('WebGL context lost. You will need to reload the page.');
          }, false);
        }
        if (setInModule) {
          GLctx = Module.ctx = ctx;
          Module.useWebGL = useWebGL;
          Browser.moduleContextCreatedCallbacks.forEach(function(callback) { callback() });
          Browser.init();
        }
        return ctx;
      },destroyContext:function (canvas, useWebGL, setInModule) {},fullScreenHandlersInstalled:false,lockPointer:undefined,resizeCanvas:undefined,requestFullScreen:function (lockPointer, resizeCanvas) {
        Browser.lockPointer = lockPointer;
        Browser.resizeCanvas = resizeCanvas;
        if (typeof Browser.lockPointer === 'undefined') Browser.lockPointer = true;
        if (typeof Browser.resizeCanvas === 'undefined') Browser.resizeCanvas = false;
  
        var canvas = Module['canvas'];
        function fullScreenChange() {
          Browser.isFullScreen = false;
          if ((document['webkitFullScreenElement'] || document['webkitFullscreenElement'] ||
               document['mozFullScreenElement'] || document['mozFullscreenElement'] ||
               document['fullScreenElement'] || document['fullscreenElement']) === canvas) {
            canvas.cancelFullScreen = document['cancelFullScreen'] ||
                                      document['mozCancelFullScreen'] ||
                                      document['webkitCancelFullScreen'];
            canvas.cancelFullScreen = canvas.cancelFullScreen.bind(document);
            if (Browser.lockPointer) canvas.requestPointerLock();
            Browser.isFullScreen = true;
            if (Browser.resizeCanvas) Browser.setFullScreenCanvasSize();
          } else if (Browser.resizeCanvas){
            Browser.setWindowedCanvasSize();
          }
          if (Module['onFullScreen']) Module['onFullScreen'](Browser.isFullScreen);
        }
  
        if (!Browser.fullScreenHandlersInstalled) {
          Browser.fullScreenHandlersInstalled = true;
          document.addEventListener('fullscreenchange', fullScreenChange, false);
          document.addEventListener('mozfullscreenchange', fullScreenChange, false);
          document.addEventListener('webkitfullscreenchange', fullScreenChange, false);
        }
  
        canvas.requestFullScreen = canvas['requestFullScreen'] ||
                                   canvas['mozRequestFullScreen'] ||
                                   (canvas['webkitRequestFullScreen'] ? function() { canvas['webkitRequestFullScreen'](Element['ALLOW_KEYBOARD_INPUT']) } : null);
        canvas.requestFullScreen();
      },requestAnimationFrame:function requestAnimationFrame(func) {
        if (typeof window === 'undefined') { // Provide fallback to setTimeout if window is undefined (e.g. in Node.js)
          setTimeout(func, 1000/60);
        } else {
          if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = window['requestAnimationFrame'] ||
                                           window['mozRequestAnimationFrame'] ||
                                           window['webkitRequestAnimationFrame'] ||
                                           window['msRequestAnimationFrame'] ||
                                           window['oRequestAnimationFrame'] ||
                                           window['setTimeout'];
          }
          window.requestAnimationFrame(func);
        }
      },safeCallback:function (func) {
        return function() {
          if (!ABORT) return func.apply(null, arguments);
        };
      },safeRequestAnimationFrame:function (func) {
        return Browser.requestAnimationFrame(function() {
          if (!ABORT) func();
        });
      },safeSetTimeout:function (func, timeout) {
        return setTimeout(function() {
          if (!ABORT) func();
        }, timeout);
      },safeSetInterval:function (func, timeout) {
        return setInterval(function() {
          if (!ABORT) func();
        }, timeout);
      },getMimetype:function (name) {
        return {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'bmp': 'image/bmp',
          'ogg': 'audio/ogg',
          'wav': 'audio/wav',
          'mp3': 'audio/mpeg'
        }[name.substr(name.lastIndexOf('.')+1)];
      },getUserMedia:function (func) {
        if(!window.getUserMedia) {
          window.getUserMedia = navigator['getUserMedia'] ||
                                navigator['mozGetUserMedia'];
        }
        window.getUserMedia(func);
      },getMovementX:function (event) {
        return event['movementX'] ||
               event['mozMovementX'] ||
               event['webkitMovementX'] ||
               0;
      },getMovementY:function (event) {
        return event['movementY'] ||
               event['mozMovementY'] ||
               event['webkitMovementY'] ||
               0;
      },getMouseWheelDelta:function (event) {
        return Math.max(-1, Math.min(1, event.type === 'DOMMouseScroll' ? event.detail : -event.wheelDelta));
      },mouseX:0,mouseY:0,mouseMovementX:0,mouseMovementY:0,calculateMouseEvent:function (event) { // event should be mousemove, mousedown or mouseup
        if (Browser.pointerLock) {
          // When the pointer is locked, calculate the coordinates
          // based on the movement of the mouse.
          // Workaround for Firefox bug 764498
          if (event.type != 'mousemove' &&
              ('mozMovementX' in event)) {
            Browser.mouseMovementX = Browser.mouseMovementY = 0;
          } else {
            Browser.mouseMovementX = Browser.getMovementX(event);
            Browser.mouseMovementY = Browser.getMovementY(event);
          }
          
          // check if SDL is available
          if (typeof SDL != "undefined") {
          	Browser.mouseX = SDL.mouseX + Browser.mouseMovementX;
          	Browser.mouseY = SDL.mouseY + Browser.mouseMovementY;
          } else {
          	// just add the mouse delta to the current absolut mouse position
          	// FIXME: ideally this should be clamped against the canvas size and zero
          	Browser.mouseX += Browser.mouseMovementX;
          	Browser.mouseY += Browser.mouseMovementY;
          }        
        } else {
          // Otherwise, calculate the movement based on the changes
          // in the coordinates.
          var rect = Module["canvas"].getBoundingClientRect();
          var x, y;
          
          // Neither .scrollX or .pageXOffset are defined in a spec, but
          // we prefer .scrollX because it is currently in a spec draft.
          // (see: http://www.w3.org/TR/2013/WD-cssom-view-20131217/)
          var scrollX = ((typeof window.scrollX !== 'undefined') ? window.scrollX : window.pageXOffset);
          var scrollY = ((typeof window.scrollY !== 'undefined') ? window.scrollY : window.pageYOffset);
          // If this assert lands, it's likely because the browser doesn't support scrollX or pageXOffset
          // and we have no viable fallback.
          assert((typeof scrollX !== 'undefined') && (typeof scrollY !== 'undefined'), 'Unable to retrieve scroll position, mouse positions likely broken.');
          if (event.type == 'touchstart' ||
              event.type == 'touchend' ||
              event.type == 'touchmove') {
            var t = event.touches.item(0);
            if (t) {
              x = t.pageX - (scrollX + rect.left);
              y = t.pageY - (scrollY + rect.top);
            } else {
              return;
            }
          } else {
            x = event.pageX - (scrollX + rect.left);
            y = event.pageY - (scrollY + rect.top);
          }
  
          // the canvas might be CSS-scaled compared to its backbuffer;
          // SDL-using content will want mouse coordinates in terms
          // of backbuffer units.
          var cw = Module["canvas"].width;
          var ch = Module["canvas"].height;
          x = x * (cw / rect.width);
          y = y * (ch / rect.height);
  
          Browser.mouseMovementX = x - Browser.mouseX;
          Browser.mouseMovementY = y - Browser.mouseY;
          Browser.mouseX = x;
          Browser.mouseY = y;
        }
      },xhrLoad:function (url, onload, onerror) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function xhr_onload() {
          if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
            onload(xhr.response);
          } else {
            onerror();
          }
        };
        xhr.onerror = onerror;
        xhr.send(null);
      },asyncLoad:function (url, onload, onerror, noRunDep) {
        Browser.xhrLoad(url, function(arrayBuffer) {
          assert(arrayBuffer, 'Loading data file "' + url + '" failed (no arrayBuffer).');
          onload(new Uint8Array(arrayBuffer));
          if (!noRunDep) removeRunDependency('al ' + url);
        }, function(event) {
          if (onerror) {
            onerror();
          } else {
            throw 'Loading data file "' + url + '" failed.';
          }
        });
        if (!noRunDep) addRunDependency('al ' + url);
      },resizeListeners:[],updateResizeListeners:function () {
        var canvas = Module['canvas'];
        Browser.resizeListeners.forEach(function(listener) {
          listener(canvas.width, canvas.height);
        });
      },setCanvasSize:function (width, height, noUpdates) {
        var canvas = Module['canvas'];
        canvas.width = width;
        canvas.height = height;
        if (!noUpdates) Browser.updateResizeListeners();
      },windowedWidth:0,windowedHeight:0,setFullScreenCanvasSize:function () {
        var canvas = Module['canvas'];
        this.windowedWidth = canvas.width;
        this.windowedHeight = canvas.height;
        canvas.width = screen.width;
        canvas.height = screen.height;
        // check if SDL is available   
        if (typeof SDL != "undefined") {
        	var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
        	flags = flags | 0x00800000; // set SDL_FULLSCREEN flag
        	HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
        }
        Browser.updateResizeListeners();
      },setWindowedCanvasSize:function () {
        var canvas = Module['canvas'];
        canvas.width = this.windowedWidth;
        canvas.height = this.windowedHeight;
        // check if SDL is available       
        if (typeof SDL != "undefined") {
        	var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
        	flags = flags & ~0x00800000; // clear SDL_FULLSCREEN flag
        	HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
        }
        Browser.updateResizeListeners();
      }};var SDL={defaults:{width:320,height:200,copyOnLock:true},version:null,surfaces:{},canvasPool:[],events:[],fonts:[null],audios:[null],rwops:[null],music:{audio:null,volume:1},mixerFrequency:22050,mixerFormat:32784,mixerNumChannels:2,mixerChunkSize:1024,channelMinimumNumber:0,GL:false,glAttributes:{0:3,1:3,2:2,3:0,4:0,5:1,6:16,7:0,8:0,9:0,10:0,11:0,12:0,13:0,14:0,15:1,16:0,17:0,18:0},keyboardState:null,keyboardMap:{},canRequestFullscreen:false,isRequestingFullscreen:false,textInput:false,startTime:null,initFlags:0,buttonState:0,modState:0,DOMButtons:[0,0,0],DOMEventToSDLEvent:{},keyCodes:{16:1249,17:1248,18:1250,33:1099,34:1102,37:1104,38:1106,39:1103,40:1105,46:127,96:1112,97:1113,98:1114,99:1115,100:1116,101:1117,102:1118,103:1119,104:1120,105:1121,112:1082,113:1083,114:1084,115:1085,116:1086,117:1087,118:1088,119:1089,120:1090,121:1091,122:1092,123:1093,173:45,188:44,190:46,191:47,192:96},scanCodes:{8:42,9:43,13:40,27:41,32:44,44:54,46:55,47:56,48:39,49:30,50:31,51:32,52:33,53:34,54:35,55:36,56:37,57:38,59:51,61:46,91:47,92:49,93:48,96:52,97:4,98:5,99:6,100:7,101:8,102:9,103:10,104:11,105:12,106:13,107:14,108:15,109:16,110:17,111:18,112:19,113:20,114:21,115:22,116:23,117:24,118:25,119:26,120:27,121:28,122:29,305:224,308:226},loadRect:function (rect) {
        return {
          x: HEAP32[((rect + 0)>>2)],
          y: HEAP32[((rect + 4)>>2)],
          w: HEAP32[((rect + 8)>>2)],
          h: HEAP32[((rect + 12)>>2)]
        };
      },loadColorToCSSRGB:function (color) {
        var rgba = HEAP32[((color)>>2)];
        return 'rgb(' + (rgba&255) + ',' + ((rgba >> 8)&255) + ',' + ((rgba >> 16)&255) + ')';
      },loadColorToCSSRGBA:function (color) {
        var rgba = HEAP32[((color)>>2)];
        return 'rgba(' + (rgba&255) + ',' + ((rgba >> 8)&255) + ',' + ((rgba >> 16)&255) + ',' + (((rgba >> 24)&255)/255) + ')';
      },translateColorToCSSRGBA:function (rgba) {
        return 'rgba(' + (rgba&0xff) + ',' + (rgba>>8 & 0xff) + ',' + (rgba>>16 & 0xff) + ',' + (rgba>>>24)/0xff + ')';
      },translateRGBAToCSSRGBA:function (r, g, b, a) {
        return 'rgba(' + (r&0xff) + ',' + (g&0xff) + ',' + (b&0xff) + ',' + (a&0xff)/255 + ')';
      },translateRGBAToColor:function (r, g, b, a) {
        return r | g << 8 | b << 16 | a << 24;
      },makeSurface:function (width, height, flags, usePageCanvas, source, rmask, gmask, bmask, amask) {
        flags = flags || 0;
        var is_SDL_HWSURFACE = flags & 0x00000001;
        var is_SDL_HWPALETTE = flags & 0x00200000;
        var is_SDL_OPENGL = flags & 0x04000000;
  
        var surf = _malloc(60);
        var pixelFormat = _malloc(44);
        //surface with SDL_HWPALETTE flag is 8bpp surface (1 byte)
        var bpp = is_SDL_HWPALETTE ? 1 : 4;
        var buffer = 0;
  
        // preemptively initialize this for software surfaces,
        // otherwise it will be lazily initialized inside of SDL_LockSurface
        if (!is_SDL_HWSURFACE && !is_SDL_OPENGL) {
          buffer = _malloc(width * height * 4);
        }
  
        HEAP32[((surf)>>2)]=flags;
        HEAP32[(((surf)+(4))>>2)]=pixelFormat;
        HEAP32[(((surf)+(8))>>2)]=width;
        HEAP32[(((surf)+(12))>>2)]=height;
        HEAP32[(((surf)+(16))>>2)]=width * bpp;  // assuming RGBA or indexed for now,
                                                                                          // since that is what ImageData gives us in browsers
        HEAP32[(((surf)+(20))>>2)]=buffer;
        HEAP32[(((surf)+(36))>>2)]=0;
        HEAP32[(((surf)+(56))>>2)]=1;
  
        HEAP32[((pixelFormat)>>2)]=0 /* XXX missing C define SDL_PIXELFORMAT_RGBA8888 */;
        HEAP32[(((pixelFormat)+(4))>>2)]=0;// TODO
        HEAP8[(((pixelFormat)+(8))|0)]=bpp * 8;
        HEAP8[(((pixelFormat)+(9))|0)]=bpp;
  
        HEAP32[(((pixelFormat)+(12))>>2)]=rmask || 0x000000ff;
        HEAP32[(((pixelFormat)+(16))>>2)]=gmask || 0x0000ff00;
        HEAP32[(((pixelFormat)+(20))>>2)]=bmask || 0x00ff0000;
        HEAP32[(((pixelFormat)+(24))>>2)]=amask || 0xff000000;
  
        // Decide if we want to use WebGL or not
        SDL.GL = SDL.GL || is_SDL_OPENGL;
        var canvas;
        if (!usePageCanvas) {
          if (SDL.canvasPool.length > 0) {
            canvas = SDL.canvasPool.pop();
          } else {
            canvas = document.createElement('canvas');
          }
          canvas.width = width;
          canvas.height = height;
        } else {
          canvas = Module['canvas'];
        }
  
        var webGLContextAttributes = {
          antialias: ((SDL.glAttributes[13 /*SDL_GL_MULTISAMPLEBUFFERS*/] != 0) && (SDL.glAttributes[14 /*SDL_GL_MULTISAMPLESAMPLES*/] > 1)),
          depth: (SDL.glAttributes[6 /*SDL_GL_DEPTH_SIZE*/] > 0),
          stencil: (SDL.glAttributes[7 /*SDL_GL_STENCIL_SIZE*/] > 0)
        };
        
        var ctx = Browser.createContext(canvas, is_SDL_OPENGL, usePageCanvas, webGLContextAttributes);
              
        SDL.surfaces[surf] = {
          width: width,
          height: height,
          canvas: canvas,
          ctx: ctx,
          surf: surf,
          buffer: buffer,
          pixelFormat: pixelFormat,
          alpha: 255,
          flags: flags,
          locked: 0,
          usePageCanvas: usePageCanvas,
          source: source,
  
          isFlagSet: function(flag) {
            return flags & flag;
          }
        };
  
        return surf;
      },copyIndexedColorData:function (surfData, rX, rY, rW, rH) {
        // HWPALETTE works with palette
        // setted by SDL_SetColors
        if (!surfData.colors) {
          return;
        }
        
        var fullWidth  = Module['canvas'].width;
        var fullHeight = Module['canvas'].height;
  
        var startX  = rX || 0;
        var startY  = rY || 0;
        var endX    = (rW || (fullWidth - startX)) + startX;
        var endY    = (rH || (fullHeight - startY)) + startY;
        
        var buffer  = surfData.buffer;
        var data    = surfData.image.data;
        var colors  = surfData.colors;
  
        for (var y = startY; y < endY; ++y) {
          var indexBase = y * fullWidth;
          var colorBase = indexBase * 4;
          for (var x = startX; x < endX; ++x) {
            // HWPALETTE have only 256 colors (not rgba)
            var index = HEAPU8[((buffer + indexBase + x)|0)] * 3;
            var colorOffset = colorBase + x * 4;
  
            data[colorOffset   ] = colors[index   ];
            data[colorOffset +1] = colors[index +1];
            data[colorOffset +2] = colors[index +2];
            //unused: data[colorOffset +3] = color[index +3];
          }
        }
      },freeSurface:function (surf) {
        var refcountPointer = surf + 56;
        var refcount = HEAP32[((refcountPointer)>>2)];
        if (refcount > 1) {
          HEAP32[((refcountPointer)>>2)]=refcount - 1;
          return;
        }
  
        var info = SDL.surfaces[surf];
        if (!info.usePageCanvas && info.canvas) SDL.canvasPool.push(info.canvas);
        if (info.buffer) _free(info.buffer);
        _free(info.pixelFormat);
        _free(surf);
        SDL.surfaces[surf] = null;
      },touchX:0,touchY:0,savedKeydown:null,receiveEvent:function (event) {
        switch(event.type) {
          case 'touchstart':
            event.preventDefault();
            var touch = event.touches[0];
            touchX = touch.pageX;
            touchY = touch.pageY;
            var event = {
              type: 'mousedown',
              button: 0,
              pageX: touchX,
              pageY: touchY
            };
            SDL.DOMButtons[0] = 1;
            SDL.events.push(event);
            break;
          case 'touchmove':
            event.preventDefault();
            var touch = event.touches[0];
            touchX = touch.pageX;
            touchY = touch.pageY;
            event = {
              type: 'mousemove',
              button: 0,
              pageX: touchX,
              pageY: touchY
            };
            SDL.events.push(event);
            break;
          case 'touchend':
            event.preventDefault();
            event = {
              type: 'mouseup',
              button: 0,
              pageX: touchX,
              pageY: touchY
            };
            SDL.DOMButtons[0] = 0;
            SDL.events.push(event);
            break;
          case 'mousemove':
            if (Browser.pointerLock) {
              // workaround for firefox bug 750111
              if ('mozMovementX' in event) {
                event['movementX'] = event['mozMovementX'];
                event['movementY'] = event['mozMovementY'];
              }
              // workaround for Firefox bug 782777
              if (event['movementX'] == 0 && event['movementY'] == 0) {
                // ignore a mousemove event if it doesn't contain any movement info
                // (without pointer lock, we infer movement from pageX/pageY, so this check is unnecessary)
                event.preventDefault();
                return;
              }
            }
            // fall through
          case 'keydown': case 'keyup': case 'keypress': case 'mousedown': case 'mouseup': case 'DOMMouseScroll': case 'mousewheel':
            // If we preventDefault on keydown events, the subsequent keypress events
            // won't fire. However, it's fine (and in some cases necessary) to
            // preventDefault for keys that don't generate a character. Otherwise,
            // preventDefault is the right thing to do in general.
            if (event.type !== 'keydown' || (!SDL.unicode && !SDL.textInput) || (event.keyCode === 8 /* backspace */ || event.keyCode === 9 /* tab */)) {
              event.preventDefault();
            }
  
            if (event.type == 'DOMMouseScroll' || event.type == 'mousewheel') {
              var button = Browser.getMouseWheelDelta(event) > 0 ? 4 : 3;
              var event2 = {
                type: 'mousedown',
                button: button,
                pageX: event.pageX,
                pageY: event.pageY
              };
              SDL.events.push(event2);
              event = {
                type: 'mouseup',
                button: button,
                pageX: event.pageX,
                pageY: event.pageY
              };
            } else if (event.type == 'mousedown') {
              SDL.DOMButtons[event.button] = 1;
            } else if (event.type == 'mouseup') {
              // ignore extra ups, can happen if we leave the canvas while pressing down, then return,
              // since we add a mouseup in that case
              if (!SDL.DOMButtons[event.button]) {
                return;
              }
  
              SDL.DOMButtons[event.button] = 0;
            }
  
            // We can only request fullscreen as the result of user input.
            // Due to this limitation, we toggle a boolean on keydown which
            // SDL_WM_ToggleFullScreen will check and subsequently set another
            // flag indicating for us to request fullscreen on the following
            // keyup. This isn't perfect, but it enables SDL_WM_ToggleFullScreen
            // to work as the result of a keypress (which is an extremely
            // common use case).
            if (event.type === 'keydown') {
              SDL.canRequestFullscreen = true;
            } else if (event.type === 'keyup') {
              if (SDL.isRequestingFullscreen) {
                Module['requestFullScreen'](true, true);
                SDL.isRequestingFullscreen = false;
              }
              SDL.canRequestFullscreen = false;
            }
  
            // SDL expects a unicode character to be passed to its keydown events.
            // Unfortunately, the browser APIs only provide a charCode property on
            // keypress events, so we must backfill in keydown events with their
            // subsequent keypress event's charCode.
            if (event.type === 'keypress' && SDL.savedKeydown) {
              // charCode is read-only
              SDL.savedKeydown.keypressCharCode = event.charCode;
              SDL.savedKeydown = null;
            } else if (event.type === 'keydown') {
              SDL.savedKeydown = event;
            }
  
            // Don't push keypress events unless SDL_StartTextInput has been called.
            if (event.type !== 'keypress' || SDL.textInput) {
              SDL.events.push(event);
            }
            break;
          case 'mouseout':
            // Un-press all pressed mouse buttons, because we might miss the release outside of the canvas
            for (var i = 0; i < 3; i++) {
              if (SDL.DOMButtons[i]) {
                SDL.events.push({
                  type: 'mouseup',
                  button: i,
                  pageX: event.pageX,
                  pageY: event.pageY
                });
                SDL.DOMButtons[i] = 0;
              }
            }
            event.preventDefault();
            break;
          case 'blur':
          case 'visibilitychange': {
            // Un-press all pressed keys: TODO
            for (var code in SDL.keyboardMap) {
              SDL.events.push({
                type: 'keyup',
                keyCode: SDL.keyboardMap[code]
              });
            }
            event.preventDefault();
            break;
          }
          case 'unload':
            if (Browser.mainLoop.runner) {
              SDL.events.push(event);
              // Force-run a main event loop, since otherwise this event will never be caught!
              Browser.mainLoop.runner();
            }
            return;
          case 'resize':
            SDL.events.push(event);
            // manually triggered resize event doesn't have a preventDefault member
            if (event.preventDefault) {
              event.preventDefault();
            }
            break;
        }
        if (SDL.events.length >= 10000) {
          Module.printErr('SDL event queue full, dropping events');
          SDL.events = SDL.events.slice(0, 10000);
        }
        return;
      },handleEvent:function (event) {
        if (event.handled) return;
        event.handled = true;
  
        switch (event.type) {
          case 'keydown': case 'keyup': {
            var down = event.type === 'keydown';
            var code = event.keyCode;
            if (code >= 65 && code <= 90) {
              code += 32; // make lowercase for SDL
            } else {
              code = SDL.keyCodes[event.keyCode] || event.keyCode;
            }
  
            HEAP8[(((SDL.keyboardState)+(code))|0)]=down;
            // TODO: lmeta, rmeta, numlock, capslock, KMOD_MODE, KMOD_RESERVED
            SDL.modState = (HEAP8[(((SDL.keyboardState)+(1248))|0)] ? 0x0040 | 0x0080 : 0) | // KMOD_LCTRL & KMOD_RCTRL
              (HEAP8[(((SDL.keyboardState)+(1249))|0)] ? 0x0001 | 0x0002 : 0) | // KMOD_LSHIFT & KMOD_RSHIFT
              (HEAP8[(((SDL.keyboardState)+(1250))|0)] ? 0x0100 | 0x0200 : 0); // KMOD_LALT & KMOD_RALT
  
            if (down) {
              SDL.keyboardMap[code] = event.keyCode; // save the DOM input, which we can use to unpress it during blur
            } else {
              delete SDL.keyboardMap[code];
            }
  
            break;
          }
          case 'mousedown': case 'mouseup':
            if (event.type == 'mousedown') {
              // SDL_BUTTON(x) is defined as (1 << ((x)-1)).  SDL buttons are 1-3,
              // and DOM buttons are 0-2, so this means that the below formula is
              // correct.
              SDL.buttonState |= 1 << event.button;
            } else if (event.type == 'mouseup') {
              SDL.buttonState &= ~(1 << event.button);
            }
            // fall through
          case 'mousemove': {
            Browser.calculateMouseEvent(event);
            break;
          }
        }
      },makeCEvent:function (event, ptr) {
        if (typeof event === 'number') {
          // This is a pointer to a native C event that was SDL_PushEvent'ed
          _memcpy(ptr, event, 28); // XXX
          return;
        }
  
        SDL.handleEvent(event);
  
        switch (event.type) {
          case 'keydown': case 'keyup': {
            var down = event.type === 'keydown';
            //Module.print('Received key event: ' + event.keyCode);
            var key = event.keyCode;
            if (key >= 65 && key <= 90) {
              key += 32; // make lowercase for SDL
            } else {
              key = SDL.keyCodes[event.keyCode] || event.keyCode;
            }
            var scan;
            if (key >= 1024) {
              scan = key - 1024;
            } else {
              scan = SDL.scanCodes[key] || key;
            }
  
            HEAP32[((ptr)>>2)]=SDL.DOMEventToSDLEvent[event.type];
            HEAP8[(((ptr)+(8))|0)]=down ? 1 : 0;
            HEAP8[(((ptr)+(9))|0)]=0; // TODO
            HEAP32[(((ptr)+(12))>>2)]=scan;
            HEAP32[(((ptr)+(16))>>2)]=key;
            HEAP16[(((ptr)+(20))>>1)]=SDL.modState;
            // some non-character keys (e.g. backspace and tab) won't have keypressCharCode set, fill in with the keyCode.
            HEAP32[(((ptr)+(24))>>2)]=event.keypressCharCode || key;
  
            break;
          }
          case 'keypress': {
            HEAP32[((ptr)>>2)]=SDL.DOMEventToSDLEvent[event.type];
            // Not filling in windowID for now
            var cStr = intArrayFromString(String.fromCharCode(event.charCode));
            for (var i = 0; i < cStr.length; ++i) {
              HEAP8[(((ptr)+(8 + i))|0)]=cStr[i];
            }
            break;
          }
          case 'mousedown': case 'mouseup': case 'mousemove': {
            if (event.type != 'mousemove') {
              var down = event.type === 'mousedown';
              HEAP32[((ptr)>>2)]=SDL.DOMEventToSDLEvent[event.type];
              HEAP8[(((ptr)+(8))|0)]=event.button+1; // DOM buttons are 0-2, SDL 1-3
              HEAP8[(((ptr)+(9))|0)]=down ? 1 : 0;
              HEAP32[(((ptr)+(12))>>2)]=Browser.mouseX;
              HEAP32[(((ptr)+(16))>>2)]=Browser.mouseY;
            } else {
              HEAP32[((ptr)>>2)]=SDL.DOMEventToSDLEvent[event.type];
              HEAP8[(((ptr)+(8))|0)]=SDL.buttonState;
              HEAP32[(((ptr)+(12))>>2)]=Browser.mouseX;
              HEAP32[(((ptr)+(16))>>2)]=Browser.mouseY;
              HEAP32[(((ptr)+(20))>>2)]=Browser.mouseMovementX;
              HEAP32[(((ptr)+(24))>>2)]=Browser.mouseMovementY;
            }
            break;
          }
          case 'unload': {
            HEAP32[((ptr)>>2)]=SDL.DOMEventToSDLEvent[event.type];
            break;
          }
          case 'resize': {
            HEAP32[((ptr)>>2)]=SDL.DOMEventToSDLEvent[event.type];
            HEAP32[(((ptr)+(4))>>2)]=event.w;
            HEAP32[(((ptr)+(8))>>2)]=event.h;
            break;
          }
          case 'joystick_button_up': case 'joystick_button_down': {
            var state = event.type === 'joystick_button_up' ? 0 : 1;
            HEAP32[((ptr)>>2)]=SDL.DOMEventToSDLEvent[event.type];
            HEAP8[(((ptr)+(4))|0)]=event.index;
            HEAP8[(((ptr)+(5))|0)]=event.button;
            HEAP8[(((ptr)+(6))|0)]=state;
            break;
          }
          case 'joystick_axis_motion': {
            HEAP32[((ptr)>>2)]=SDL.DOMEventToSDLEvent[event.type];
            HEAP8[(((ptr)+(4))|0)]=event.index;
            HEAP8[(((ptr)+(5))|0)]=event.axis;
            HEAP32[(((ptr)+(8))>>2)]=SDL.joystickAxisValueConversion(event.value);
            break;
          }
          default: throw 'Unhandled SDL event: ' + event.type;
        }
      },estimateTextWidth:function (fontData, text) {
        var h = fontData.size;
        var fontString = h + 'px ' + fontData.name;
        var tempCtx = SDL.ttfContext;
        assert(tempCtx, 'TTF_Init must have been called');
        tempCtx.save();
        tempCtx.font = fontString;
        var ret = tempCtx.measureText(text).width | 0;
        tempCtx.restore();
        return ret;
      },allocateChannels:function (num) { // called from Mix_AllocateChannels and init
        if (SDL.numChannels && SDL.numChannels >= num && num != 0) return;
        SDL.numChannels = num;
        SDL.channels = [];
        for (var i = 0; i < num; i++) {
          SDL.channels[i] = {
            audio: null,
            volume: 1.0
          };
        }
      },setGetVolume:function (info, volume) {
        if (!info) return 0;
        var ret = info.volume * 128; // MIX_MAX_VOLUME
        if (volume != -1) {
          info.volume = volume / 128;
          if (info.audio) info.audio.volume = info.volume;
        }
        return ret;
      },fillWebAudioBufferFromHeap:function (heapPtr, sizeSamplesPerChannel, dstAudioBuffer) {
        // The input audio data is interleaved across the channels, i.e. [L, R, L, R, L, R, ...] and is either 8-bit or 16-bit as
        // supported by the SDL API. The output audio wave data for Web Audio API must be in planar buffers of [-1,1]-normalized Float32 data,
        // so perform a buffer conversion for the data.
        var numChannels = SDL.audio.channels;
        for(var c = 0; c < numChannels; ++c) {
          var channelData = dstAudioBuffer['getChannelData'](c);
          if (channelData.length != sizeSamplesPerChannel) {
            throw 'Web Audio output buffer length mismatch! Destination size: ' + channelData.length + ' samples vs expected ' + sizeSamplesPerChannel + ' samples!';
          }
          if (SDL.audio.format == 0x8010 /*AUDIO_S16LSB*/) {
            for(var j = 0; j < sizeSamplesPerChannel; ++j) {
              channelData[j] = (HEAP16[(((heapPtr)+((j*numChannels + c)*2))>>1)]) / 0x8000;
            }
          } else if (SDL.audio.format == 0x0008 /*AUDIO_U8*/) {
            for(var j = 0; j < sizeSamplesPerChannel; ++j) {
              var v = (HEAP8[(((heapPtr)+(j*numChannels + c))|0)]);
              channelData[j] = ((v >= 0) ? v-128 : v+128) /128;
            }
          }
        }
      },debugSurface:function (surfData) {
        console.log('dumping surface ' + [surfData.surf, surfData.source, surfData.width, surfData.height]);
        var image = surfData.ctx.getImageData(0, 0, surfData.width, surfData.height);
        var data = image.data;
        var num = Math.min(surfData.width, surfData.height);
        for (var i = 0; i < num; i++) {
          console.log('   diagonal ' + i + ':' + [data[i*surfData.width*4 + i*4 + 0], data[i*surfData.width*4 + i*4 + 1], data[i*surfData.width*4 + i*4 + 2], data[i*surfData.width*4 + i*4 + 3]]);
        }
      },joystickEventState:1,lastJoystickState:{},joystickNamePool:{},recordJoystickState:function (joystick, state) {
        // Standardize button state.
        var buttons = new Array(state.buttons.length);
        for (var i = 0; i < state.buttons.length; i++) {
          buttons[i] = SDL.getJoystickButtonState(state.buttons[i]);
        }
  
        SDL.lastJoystickState[joystick] = {
          buttons: buttons,
          axes: state.axes.slice(0),
          timestamp: state.timestamp,
          index: state.index,
          id: state.id
        };
      },getJoystickButtonState:function (button) {
        if (typeof button === 'object') {
          // Current gamepad API editor's draft (Firefox Nightly)
          // https://dvcs.w3.org/hg/gamepad/raw-file/default/gamepad.html#idl-def-GamepadButton
          return button.pressed;
        } else {
          // Current gamepad API working draft (Firefox / Chrome Stable)
          // http://www.w3.org/TR/2012/WD-gamepad-20120529/#gamepad-interface
          return button > 0;
        }
      },queryJoysticks:function () {
        for (var joystick in SDL.lastJoystickState) {
          var state = SDL.getGamepad(joystick - 1);
          var prevState = SDL.lastJoystickState[joystick];
          // Check only if the timestamp has differed.
          // NOTE: Timestamp is not available in Firefox.
          if (typeof state.timestamp !== 'number' || state.timestamp !== prevState.timestamp) {
            var i;
            for (i = 0; i < state.buttons.length; i++) {
              var buttonState = SDL.getJoystickButtonState(state.buttons[i]);
              // NOTE: The previous state already has a boolean representation of
              //       its button, so no need to standardize its button state here.
              if (buttonState !== prevState.buttons[i]) {
                // Insert button-press event.
                SDL.events.push({
                  type: buttonState ? 'joystick_button_down' : 'joystick_button_up',
                  joystick: joystick,
                  index: joystick - 1,
                  button: i
                });
              }
            }
            for (i = 0; i < state.axes.length; i++) {
              if (state.axes[i] !== prevState.axes[i]) {
                // Insert axes-change event.
                SDL.events.push({
                  type: 'joystick_axis_motion',
                  joystick: joystick,
                  index: joystick - 1,
                  axis: i,
                  value: state.axes[i]
                });
              }
            }
  
            SDL.recordJoystickState(joystick, state);
          }
        }
      },joystickAxisValueConversion:function (value) {
        // Ensures that 0 is 0, 1 is 32767, and -1 is 32768.
        return Math.ceil(((value+1) * 32767.5) - 32768);
      },getGamepads:function () {
        var fcn = navigator.getGamepads || navigator.webkitGamepads || navigator.mozGamepads || navigator.gamepads || navigator.webkitGetGamepads;
        if (fcn !== undefined) {
          // The function must be applied on the navigator object.
          return fcn.apply(navigator);
        } else {
          return [];
        }
      },getGamepad:function (deviceIndex) {
        var gamepads = SDL.getGamepads();
        if (gamepads.length > deviceIndex && deviceIndex >= 0) {
          return gamepads[deviceIndex];
        }
        return null;
      }};function _SDL_Quit() {
      for (var i = 0; i < SDL.numChannels; ++i) {
        if (SDL.channels[i].audio) {
          SDL.channels[i].audio.pause();
        }
      }
      if (SDL.music.audio) {
        SDL.music.audio.pause();
      }
      Module.print('SDL_Quit called (and ignored)');
    }

  
  function __exit(status) {
      // void _exit(int status);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/exit.html
      Module['exit'](status);
    }function _exit(status) {
      __exit(status);
    }

  function _SDL_Init(initFlags) {
      SDL.startTime = Date.now();
      SDL.initFlags = initFlags;
  
      // capture all key events. we just keep down and up, but also capture press to prevent default actions
      if (!Module['doNotCaptureKeyboard']) {
        document.addEventListener("keydown", SDL.receiveEvent);
        document.addEventListener("keyup", SDL.receiveEvent);
        document.addEventListener("keypress", SDL.receiveEvent);
        window.addEventListener("blur", SDL.receiveEvent);
        document.addEventListener("visibilitychange", SDL.receiveEvent);
      }
  
      if (initFlags & 0x200) {
        // SDL_INIT_JOYSTICK
        // Firefox will not give us Joystick data unless we register this NOP
        // callback.
        // https://bugzilla.mozilla.org/show_bug.cgi?id=936104
        addEventListener("gamepadconnected", function() {});
      }
  
      window.addEventListener("unload", SDL.receiveEvent);
      SDL.keyboardState = _malloc(0x10000); // Our SDL needs 512, but 64K is safe for older SDLs
      _memset(SDL.keyboardState, 0, 0x10000);
      // Initialize this structure carefully for closure
      SDL.DOMEventToSDLEvent['keydown'] = 0x300 /* SDL_KEYDOWN */;
      SDL.DOMEventToSDLEvent['keyup'] = 0x301 /* SDL_KEYUP */;
      SDL.DOMEventToSDLEvent['keypress'] = 0x303 /* SDL_TEXTINPUT */;
      SDL.DOMEventToSDLEvent['mousedown'] = 0x401 /* SDL_MOUSEBUTTONDOWN */;
      SDL.DOMEventToSDLEvent['mouseup'] = 0x402 /* SDL_MOUSEBUTTONUP */;
      SDL.DOMEventToSDLEvent['mousemove'] = 0x400 /* SDL_MOUSEMOTION */;
      SDL.DOMEventToSDLEvent['unload'] = 0x100 /* SDL_QUIT */;
      SDL.DOMEventToSDLEvent['resize'] = 0x7001 /* SDL_VIDEORESIZE/SDL_EVENT_COMPAT2 */;
      // These are not technically DOM events; the HTML gamepad API is poll-based.
      // However, we define them here, as the rest of the SDL code assumes that
      // all SDL events originate as DOM events.
      SDL.DOMEventToSDLEvent['joystick_axis_motion'] = 0x600 /* SDL_JOYAXISMOTION */;
      SDL.DOMEventToSDLEvent['joystick_button_down'] = 0x603 /* SDL_JOYBUTTONDOWN */;
      SDL.DOMEventToSDLEvent['joystick_button_up'] = 0x604 /* SDL_JOYBUTTONUP */;
      return 0; // success
    }

  function _SDL_SetVideoMode(width, height, depth, flags) {
      ['mousedown', 'mouseup', 'mousemove', 'DOMMouseScroll', 'mousewheel', 'mouseout'].forEach(function(event) {
        Module['canvas'].addEventListener(event, SDL.receiveEvent, true);
      });
  
      // (0,0) means 'use fullscreen' in native; in Emscripten, use the current canvas size.
      if (width == 0 && height == 0) {
        var canvas = Module['canvas'];
        width = canvas.width;
        height = canvas.height;
      }
  
      Browser.setCanvasSize(width, height, true);
      // Free the old surface first.
      if (SDL.screen) {
        SDL.freeSurface(SDL.screen);
        SDL.screen = null;
      }
      SDL.screen = SDL.makeSurface(width, height, flags, true, 'screen');
      if (!SDL.addedResizeListener) {
        SDL.addedResizeListener = true;
        Browser.resizeListeners.push(function(w, h) {
          SDL.receiveEvent({
            type: 'resize',
            w: w,
            h: h
          });
        });
      }
      return SDL.screen;
    }

  function _SDL_WM_SetCaption(title, icon) {
      title = title && Pointer_stringify(title);
      icon = icon && Pointer_stringify(icon);
    }

  
  
  
  
  
  function _mkport() { throw 'TODO' }var SOCKFS={mount:function (mount) {
        return FS.createNode(null, '/', 16384 | 511 /* 0777 */, 0);
      },createSocket:function (family, type, protocol) {
        var streaming = type == 1;
        if (protocol) {
          assert(streaming == (protocol == 6)); // if SOCK_STREAM, must be tcp
        }
  
        // create our internal socket structure
        var sock = {
          family: family,
          type: type,
          protocol: protocol,
          server: null,
          peers: {},
          pending: [],
          recv_queue: [],
          sock_ops: SOCKFS.websocket_sock_ops
        };
  
        // create the filesystem node to store the socket structure
        var name = SOCKFS.nextname();
        var node = FS.createNode(SOCKFS.root, name, 49152, 0);
        node.sock = sock;
  
        // and the wrapping stream that enables library functions such
        // as read and write to indirectly interact with the socket
        var stream = FS.createStream({
          path: name,
          node: node,
          flags: FS.modeStringToFlags('r+'),
          seekable: false,
          stream_ops: SOCKFS.stream_ops
        });
  
        // map the new stream to the socket structure (sockets have a 1:1
        // relationship with a stream)
        sock.stream = stream;
  
        return sock;
      },getSocket:function (fd) {
        var stream = FS.getStream(fd);
        if (!stream || !FS.isSocket(stream.node.mode)) {
          return null;
        }
        return stream.node.sock;
      },stream_ops:{poll:function (stream) {
          var sock = stream.node.sock;
          return sock.sock_ops.poll(sock);
        },ioctl:function (stream, request, varargs) {
          var sock = stream.node.sock;
          return sock.sock_ops.ioctl(sock, request, varargs);
        },read:function (stream, buffer, offset, length, position /* ignored */) {
          var sock = stream.node.sock;
          var msg = sock.sock_ops.recvmsg(sock, length);
          if (!msg) {
            // socket is closed
            return 0;
          }
          buffer.set(msg.buffer, offset);
          return msg.buffer.length;
        },write:function (stream, buffer, offset, length, position /* ignored */) {
          var sock = stream.node.sock;
          return sock.sock_ops.sendmsg(sock, buffer, offset, length);
        },close:function (stream) {
          var sock = stream.node.sock;
          sock.sock_ops.close(sock);
        }},nextname:function () {
        if (!SOCKFS.nextname.current) {
          SOCKFS.nextname.current = 0;
        }
        return 'socket[' + (SOCKFS.nextname.current++) + ']';
      },websocket_sock_ops:{createPeer:function (sock, addr, port) {
          var ws;
  
          if (typeof addr === 'object') {
            ws = addr;
            addr = null;
            port = null;
          }
  
          if (ws) {
            // for sockets that've already connected (e.g. we're the server)
            // we can inspect the _socket property for the address
            if (ws._socket) {
              addr = ws._socket.remoteAddress;
              port = ws._socket.remotePort;
            }
            // if we're just now initializing a connection to the remote,
            // inspect the url property
            else {
              var result = /ws[s]?:\/\/([^:]+):(\d+)/.exec(ws.url);
              if (!result) {
                throw new Error('WebSocket URL must be in the format ws(s)://address:port');
              }
              addr = result[1];
              port = parseInt(result[2], 10);
            }
          } else {
            // create the actual websocket object and connect
            try {
              var url = 'ws://' + addr + ':' + port;
              // the node ws library API is slightly different than the browser's
              var opts = ENVIRONMENT_IS_NODE ? {headers: {'websocket-protocol': ['binary']}} : ['binary'];
              // If node we use the ws library.
              var WebSocket = ENVIRONMENT_IS_NODE ? require('ws') : window['WebSocket'];
              ws = new WebSocket(url, opts);
              ws.binaryType = 'arraybuffer';
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EHOSTUNREACH);
            }
          }
  
  
          var peer = {
            addr: addr,
            port: port,
            socket: ws,
            dgram_send_queue: []
          };
  
          SOCKFS.websocket_sock_ops.addPeer(sock, peer);
          SOCKFS.websocket_sock_ops.handlePeerEvents(sock, peer);
  
          // if this is a bound dgram socket, send the port number first to allow
          // us to override the ephemeral port reported to us by remotePort on the
          // remote end.
          if (sock.type === 2 && typeof sock.sport !== 'undefined') {
            peer.dgram_send_queue.push(new Uint8Array([
                255, 255, 255, 255,
                'p'.charCodeAt(0), 'o'.charCodeAt(0), 'r'.charCodeAt(0), 't'.charCodeAt(0),
                ((sock.sport & 0xff00) >> 8) , (sock.sport & 0xff)
            ]));
          }
  
          return peer;
        },getPeer:function (sock, addr, port) {
          return sock.peers[addr + ':' + port];
        },addPeer:function (sock, peer) {
          sock.peers[peer.addr + ':' + peer.port] = peer;
        },removePeer:function (sock, peer) {
          delete sock.peers[peer.addr + ':' + peer.port];
        },handlePeerEvents:function (sock, peer) {
          var first = true;
  
          var handleOpen = function () {
            try {
              var queued = peer.dgram_send_queue.shift();
              while (queued) {
                peer.socket.send(queued);
                queued = peer.dgram_send_queue.shift();
              }
            } catch (e) {
              // not much we can do here in the way of proper error handling as we've already
              // lied and said this data was sent. shut it down.
              peer.socket.close();
            }
          };
  
          function handleMessage(data) {
            assert(typeof data !== 'string' && data.byteLength !== undefined);  // must receive an ArrayBuffer
            data = new Uint8Array(data);  // make a typed array view on the array buffer
  
  
            // if this is the port message, override the peer's port with it
            var wasfirst = first;
            first = false;
            if (wasfirst &&
                data.length === 10 &&
                data[0] === 255 && data[1] === 255 && data[2] === 255 && data[3] === 255 &&
                data[4] === 'p'.charCodeAt(0) && data[5] === 'o'.charCodeAt(0) && data[6] === 'r'.charCodeAt(0) && data[7] === 't'.charCodeAt(0)) {
              // update the peer's port and it's key in the peer map
              var newport = ((data[8] << 8) | data[9]);
              SOCKFS.websocket_sock_ops.removePeer(sock, peer);
              peer.port = newport;
              SOCKFS.websocket_sock_ops.addPeer(sock, peer);
              return;
            }
  
            sock.recv_queue.push({ addr: peer.addr, port: peer.port, data: data });
          };
  
          if (ENVIRONMENT_IS_NODE) {
            peer.socket.on('open', handleOpen);
            peer.socket.on('message', function(data, flags) {
              if (!flags.binary) {
                return;
              }
              handleMessage((new Uint8Array(data)).buffer);  // copy from node Buffer -> ArrayBuffer
            });
            peer.socket.on('error', function() {
              // don't throw
            });
          } else {
            peer.socket.onopen = handleOpen;
            peer.socket.onmessage = function peer_socket_onmessage(event) {
              handleMessage(event.data);
            };
          }
        },poll:function (sock) {
          if (sock.type === 1 && sock.server) {
            // listen sockets should only say they're available for reading
            // if there are pending clients.
            return sock.pending.length ? (64 | 1) : 0;
          }
  
          var mask = 0;
          var dest = sock.type === 1 ?  // we only care about the socket state for connection-based sockets
            SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport) :
            null;
  
          if (sock.recv_queue.length ||
              !dest ||  // connection-less sockets are always ready to read
              (dest && dest.socket.readyState === dest.socket.CLOSING) ||
              (dest && dest.socket.readyState === dest.socket.CLOSED)) {  // let recv return 0 once closed
            mask |= (64 | 1);
          }
  
          if (!dest ||  // connection-less sockets are always ready to write
              (dest && dest.socket.readyState === dest.socket.OPEN)) {
            mask |= 4;
          }
  
          if ((dest && dest.socket.readyState === dest.socket.CLOSING) ||
              (dest && dest.socket.readyState === dest.socket.CLOSED)) {
            mask |= 16;
          }
  
          return mask;
        },ioctl:function (sock, request, arg) {
          switch (request) {
            case 21531:
              var bytes = 0;
              if (sock.recv_queue.length) {
                bytes = sock.recv_queue[0].data.length;
              }
              HEAP32[((arg)>>2)]=bytes;
              return 0;
            default:
              return ERRNO_CODES.EINVAL;
          }
        },close:function (sock) {
          // if we've spawned a listen server, close it
          if (sock.server) {
            try {
              sock.server.close();
            } catch (e) {
            }
            sock.server = null;
          }
          // close any peer connections
          var peers = Object.keys(sock.peers);
          for (var i = 0; i < peers.length; i++) {
            var peer = sock.peers[peers[i]];
            try {
              peer.socket.close();
            } catch (e) {
            }
            SOCKFS.websocket_sock_ops.removePeer(sock, peer);
          }
          return 0;
        },bind:function (sock, addr, port) {
          if (typeof sock.saddr !== 'undefined' || typeof sock.sport !== 'undefined') {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);  // already bound
          }
          sock.saddr = addr;
          sock.sport = port || _mkport();
          // in order to emulate dgram sockets, we need to launch a listen server when
          // binding on a connection-less socket
          // note: this is only required on the server side
          if (sock.type === 2) {
            // close the existing server if it exists
            if (sock.server) {
              sock.server.close();
              sock.server = null;
            }
            // swallow error operation not supported error that occurs when binding in the
            // browser where this isn't supported
            try {
              sock.sock_ops.listen(sock, 0);
            } catch (e) {
              if (!(e instanceof FS.ErrnoError)) throw e;
              if (e.errno !== ERRNO_CODES.EOPNOTSUPP) throw e;
            }
          }
        },connect:function (sock, addr, port) {
          if (sock.server) {
            throw new FS.ErrnoError(ERRNO_CODS.EOPNOTSUPP);
          }
  
          // TODO autobind
          // if (!sock.addr && sock.type == 2) {
          // }
  
          // early out if we're already connected / in the middle of connecting
          if (typeof sock.daddr !== 'undefined' && typeof sock.dport !== 'undefined') {
            var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
            if (dest) {
              if (dest.socket.readyState === dest.socket.CONNECTING) {
                throw new FS.ErrnoError(ERRNO_CODES.EALREADY);
              } else {
                throw new FS.ErrnoError(ERRNO_CODES.EISCONN);
              }
            }
          }
  
          // add the socket to our peer list and set our
          // destination address / port to match
          var peer = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
          sock.daddr = peer.addr;
          sock.dport = peer.port;
  
          // always "fail" in non-blocking mode
          throw new FS.ErrnoError(ERRNO_CODES.EINPROGRESS);
        },listen:function (sock, backlog) {
          if (!ENVIRONMENT_IS_NODE) {
            throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
          }
          if (sock.server) {
             throw new FS.ErrnoError(ERRNO_CODES.EINVAL);  // already listening
          }
          var WebSocketServer = require('ws').Server;
          var host = sock.saddr;
          sock.server = new WebSocketServer({
            host: host,
            port: sock.sport
            // TODO support backlog
          });
  
          sock.server.on('connection', function(ws) {
            if (sock.type === 1) {
              var newsock = SOCKFS.createSocket(sock.family, sock.type, sock.protocol);
  
              // create a peer on the new socket
              var peer = SOCKFS.websocket_sock_ops.createPeer(newsock, ws);
              newsock.daddr = peer.addr;
              newsock.dport = peer.port;
  
              // push to queue for accept to pick up
              sock.pending.push(newsock);
            } else {
              // create a peer on the listen socket so calling sendto
              // with the listen socket and an address will resolve
              // to the correct client
              SOCKFS.websocket_sock_ops.createPeer(sock, ws);
            }
          });
          sock.server.on('closed', function() {
            sock.server = null;
          });
          sock.server.on('error', function() {
            // don't throw
          });
        },accept:function (listensock) {
          if (!listensock.server) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          var newsock = listensock.pending.shift();
          newsock.stream.flags = listensock.stream.flags;
          return newsock;
        },getname:function (sock, peer) {
          var addr, port;
          if (peer) {
            if (sock.daddr === undefined || sock.dport === undefined) {
              throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
            }
            addr = sock.daddr;
            port = sock.dport;
          } else {
            // TODO saddr and sport will be set for bind()'d UDP sockets, but what
            // should we be returning for TCP sockets that've been connect()'d?
            addr = sock.saddr || 0;
            port = sock.sport || 0;
          }
          return { addr: addr, port: port };
        },sendmsg:function (sock, buffer, offset, length, addr, port) {
          if (sock.type === 2) {
            // connection-less sockets will honor the message address,
            // and otherwise fall back to the bound destination address
            if (addr === undefined || port === undefined) {
              addr = sock.daddr;
              port = sock.dport;
            }
            // if there was no address to fall back to, error out
            if (addr === undefined || port === undefined) {
              throw new FS.ErrnoError(ERRNO_CODES.EDESTADDRREQ);
            }
          } else {
            // connection-based sockets will only use the bound
            addr = sock.daddr;
            port = sock.dport;
          }
  
          // find the peer for the destination address
          var dest = SOCKFS.websocket_sock_ops.getPeer(sock, addr, port);
  
          // early out if not connected with a connection-based socket
          if (sock.type === 1) {
            if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
              throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
            } else if (dest.socket.readyState === dest.socket.CONNECTING) {
              throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
            }
          }
  
          // create a copy of the incoming data to send, as the WebSocket API
          // doesn't work entirely with an ArrayBufferView, it'll just send
          // the entire underlying buffer
          var data;
          if (buffer instanceof Array || buffer instanceof ArrayBuffer) {
            data = buffer.slice(offset, offset + length);
          } else {  // ArrayBufferView
            data = buffer.buffer.slice(buffer.byteOffset + offset, buffer.byteOffset + offset + length);
          }
  
          // if we're emulating a connection-less dgram socket and don't have
          // a cached connection, queue the buffer to send upon connect and
          // lie, saying the data was sent now.
          if (sock.type === 2) {
            if (!dest || dest.socket.readyState !== dest.socket.OPEN) {
              // if we're not connected, open a new connection
              if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                dest = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
              }
              dest.dgram_send_queue.push(data);
              return length;
            }
          }
  
          try {
            // send the actual data
            dest.socket.send(data);
            return length;
          } catch (e) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
        },recvmsg:function (sock, length) {
          // http://pubs.opengroup.org/onlinepubs/7908799/xns/recvmsg.html
          if (sock.type === 1 && sock.server) {
            // tcp servers should not be recv()'ing on the listen socket
            throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
          }
  
          var queued = sock.recv_queue.shift();
          if (!queued) {
            if (sock.type === 1) {
              var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
  
              if (!dest) {
                // if we have a destination address but are not connected, error out
                throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
              }
              else if (dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                // return null if the socket has closed
                return null;
              }
              else {
                // else, our socket is in a valid state but truly has nothing available
                throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
              }
            } else {
              throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
            }
          }
  
          // queued.data will be an ArrayBuffer if it's unadulterated, but if it's
          // requeued TCP data it'll be an ArrayBufferView
          var queuedLength = queued.data.byteLength || queued.data.length;
          var queuedOffset = queued.data.byteOffset || 0;
          var queuedBuffer = queued.data.buffer || queued.data;
          var bytesRead = Math.min(length, queuedLength);
          var res = {
            buffer: new Uint8Array(queuedBuffer, queuedOffset, bytesRead),
            addr: queued.addr,
            port: queued.port
          };
  
  
          // push back any unread data for TCP connections
          if (sock.type === 1 && bytesRead < queuedLength) {
            var bytesRemaining = queuedLength - bytesRead;
            queued.data = new Uint8Array(queuedBuffer, queuedOffset + bytesRead, bytesRemaining);
            sock.recv_queue.unshift(queued);
          }
  
          return res;
        }}};function _send(fd, buf, len, flags) {
      var sock = SOCKFS.getSocket(fd);
      if (!sock) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      // TODO honor flags
      return _write(fd, buf, len);
    }
  
  function _pwrite(fildes, buf, nbyte, offset) {
      // ssize_t pwrite(int fildes, const void *buf, size_t nbyte, off_t offset);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/write.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        var slab = HEAP8;
        return FS.write(stream, slab, buf, nbyte, offset);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _write(fildes, buf, nbyte) {
      // ssize_t write(int fildes, const void *buf, size_t nbyte);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/write.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
  
  
      try {
        var slab = HEAP8;
        return FS.write(stream, slab, buf, nbyte);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }
  
  function _fileno(stream) {
      // int fileno(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fileno.html
      return FS.getStreamFromPtr(stream).fd;
    }function _fputs(s, stream) {
      // int fputs(const char *restrict s, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fputs.html
      var fd = _fileno(stream);
      return _write(fd, s, _strlen(s));
    }
  
  function _fputc(c, stream) {
      // int fputc(int c, FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fputc.html
      var chr = unSign(c & 0xFF);
      HEAP8[((_fputc.ret)|0)]=chr;
      var fd = _fileno(stream);
      var ret = _write(fd, _fputc.ret, 1);
      if (ret == -1) {
        var streamObj = FS.getStreamFromPtr(stream);
        if (streamObj) streamObj.error = true;
        return -1;
      } else {
        return chr;
      }
    }function _puts(s) {
      // int puts(const char *s);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/puts.html
      // NOTE: puts() always writes an extra newline.
      var stdout = HEAP32[((_stdout)>>2)];
      var ret = _fputs(s, stdout);
      if (ret < 0) {
        return ret;
      } else {
        var newlineRet = _fputc(10, stdout);
        return (newlineRet < 0) ? -1 : ret + 1;
      }
    }

  function _SDL_MapRGB(fmt, r, g, b) {
      // Canvas screens are always RGBA. We assume the machine is little-endian.
      return r&0xff|(g&0xff)<<8|(b&0xff)<<16|0xff000000;
    }

  function _SDL_PollEvent(ptr) {
      if (SDL.initFlags & 0x200 && SDL.joystickEventState) {
        // If SDL_INIT_JOYSTICK was supplied AND the joystick system is configured
        // to automatically query for events, query for joystick events.
        SDL.queryJoysticks();
      }
      if (SDL.events.length === 0) return 0;
      if (ptr) {
        SDL.makeCEvent(SDL.events.shift(), ptr);
      }
      return 1;
    }

  function _emscripten_set_main_loop(func, fps, simulateInfiniteLoop, arg) {
      Module['noExitRuntime'] = true;
  
      Browser.mainLoop.runner = function Browser_mainLoop_runner() {
        if (ABORT) return;
        if (Browser.mainLoop.queue.length > 0) {
          var start = Date.now();
          var blocker = Browser.mainLoop.queue.shift();
          blocker.func(blocker.arg);
          if (Browser.mainLoop.remainingBlockers) {
            var remaining = Browser.mainLoop.remainingBlockers;
            var next = remaining%1 == 0 ? remaining-1 : Math.floor(remaining);
            if (blocker.counted) {
              Browser.mainLoop.remainingBlockers = next;
            } else {
              // not counted, but move the progress along a tiny bit
              next = next + 0.5; // do not steal all the next one's progress
              Browser.mainLoop.remainingBlockers = (8*remaining + next)/9;
            }
          }
          console.log('main loop blocker "' + blocker.name + '" took ' + (Date.now() - start) + ' ms'); //, left: ' + Browser.mainLoop.remainingBlockers);
          Browser.mainLoop.updateStatus();
          setTimeout(Browser.mainLoop.runner, 0);
          return;
        }
        if (Browser.mainLoop.shouldPause) {
          // catch pauses from non-main loop sources
          Browser.mainLoop.paused = true;
          Browser.mainLoop.shouldPause = false;
          return;
        }
  
        // Signal GL rendering layer that processing of a new frame is about to start. This helps it optimize
        // VBO double-buffering and reduce GPU stalls.
  
        if (Browser.mainLoop.method === 'timeout' && Module.ctx) {
          Module.printErr('Looks like you are rendering without using requestAnimationFrame for the main loop. You should use 0 for the frame rate in emscripten_set_main_loop in order to use requestAnimationFrame, as that can greatly improve your frame rates!');
          Browser.mainLoop.method = ''; // just warn once per call to set main loop
        }
  
        if (Module['preMainLoop']) {
          Module['preMainLoop']();
        }
  
        try {
          if (typeof arg !== 'undefined') {
            Runtime.dynCall('vi', func, [arg]);
          } else {
            Runtime.dynCall('v', func);
          }
        } catch (e) {
          if (e instanceof ExitStatus) {
            return;
          } else {
            if (e && typeof e === 'object' && e.stack) Module.printErr('exception thrown: ' + [e, e.stack]);
            throw e;
          }
        }
  
        if (Module['postMainLoop']) {
          Module['postMainLoop']();
        }
  
        if (Browser.mainLoop.shouldPause) {
          // catch pauses from the main loop itself
          Browser.mainLoop.paused = true;
          Browser.mainLoop.shouldPause = false;
          return;
        }
        Browser.mainLoop.scheduler();
      }
      if (fps && fps > 0) {
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler() {
          setTimeout(Browser.mainLoop.runner, 1000/fps); // doing this each time means that on exception, we stop
        };
        Browser.mainLoop.method = 'timeout';
      } else {
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler() {
          Browser.requestAnimationFrame(Browser.mainLoop.runner);
        };
        Browser.mainLoop.method = 'rAF';
      }
      Browser.mainLoop.scheduler();
  
      if (simulateInfiniteLoop) {
        throw 'SimulateInfiniteLoop';
      }
    }

  
  function _open(path, oflag, varargs) {
      // int open(const char *path, int oflag, ...);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/open.html
      var mode = HEAP32[((varargs)>>2)];
      path = Pointer_stringify(path);
      try {
        var stream = FS.open(path, oflag, mode);
        return stream.fd;
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _fopen(filename, mode) {
      // FILE *fopen(const char *restrict filename, const char *restrict mode);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fopen.html
      var flags;
      mode = Pointer_stringify(mode);
      if (mode[0] == 'r') {
        if (mode.indexOf('+') != -1) {
          flags = 2;
        } else {
          flags = 0;
        }
      } else if (mode[0] == 'w') {
        if (mode.indexOf('+') != -1) {
          flags = 2;
        } else {
          flags = 1;
        }
        flags |= 64;
        flags |= 512;
      } else if (mode[0] == 'a') {
        if (mode.indexOf('+') != -1) {
          flags = 2;
        } else {
          flags = 1;
        }
        flags |= 64;
        flags |= 1024;
      } else {
        ___setErrNo(ERRNO_CODES.EINVAL);
        return 0;
      }
      var fd = _open(filename, flags, allocate([0x1FF, 0, 0, 0], 'i32', ALLOC_STACK));  // All creation permissions.
      return fd === -1 ? 0 : FS.getPtrForStream(FS.getStream(fd));
    }

  
  
  function _recv(fd, buf, len, flags) {
      var sock = SOCKFS.getSocket(fd);
      if (!sock) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      // TODO honor flags
      return _read(fd, buf, len);
    }
  
  function _pread(fildes, buf, nbyte, offset) {
      // ssize_t pread(int fildes, void *buf, size_t nbyte, off_t offset);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/read.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        var slab = HEAP8;
        return FS.read(stream, slab, buf, nbyte, offset);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _read(fildes, buf, nbyte) {
      // ssize_t read(int fildes, void *buf, size_t nbyte);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/read.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
  
  
      try {
        var slab = HEAP8;
        return FS.read(stream, slab, buf, nbyte);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _fread(ptr, size, nitems, stream) {
      // size_t fread(void *restrict ptr, size_t size, size_t nitems, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fread.html
      var bytesToRead = nitems * size;
      if (bytesToRead == 0) {
        return 0;
      }
      var bytesRead = 0;
      var streamObj = FS.getStreamFromPtr(stream);
      if (!streamObj) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return 0;
      }
      while (streamObj.ungotten.length && bytesToRead > 0) {
        HEAP8[((ptr++)|0)]=streamObj.ungotten.pop();
        bytesToRead--;
        bytesRead++;
      }
      var err = _read(streamObj.fd, ptr, bytesToRead);
      if (err == -1) {
        if (streamObj) streamObj.error = true;
        return 0;
      }
      bytesRead += err;
      if (bytesRead < bytesToRead) streamObj.eof = true;
      return Math.floor(bytesRead / size);
    }

  
  function _fwrite(ptr, size, nitems, stream) {
      // size_t fwrite(const void *restrict ptr, size_t size, size_t nitems, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fwrite.html
      var bytesToWrite = nitems * size;
      if (bytesToWrite == 0) return 0;
      var fd = _fileno(stream);
      var bytesWritten = _write(fd, ptr, bytesToWrite);
      if (bytesWritten == -1) {
        var streamObj = FS.getStreamFromPtr(stream);
        if (streamObj) streamObj.error = true;
        return 0;
      } else {
        return Math.floor(bytesWritten / size);
      }
    }function _fprintf(stream, format, varargs) {
      // int fprintf(FILE *restrict stream, const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      var result = __formatString(format, varargs);
      var stack = Runtime.stackSave();
      var ret = _fwrite(allocate(result, 'i8', ALLOC_STACK), 1, result.length, stream);
      Runtime.stackRestore(stack);
      return ret;
    }



  function _ftell(stream) {
      // long ftell(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/ftell.html
      stream = FS.getStreamFromPtr(stream);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      if (FS.isChrdev(stream.node.mode)) {
        ___setErrNo(ERRNO_CODES.ESPIPE);
        return -1;
      } else {
        return stream.position;
      }
    }

  function _fgetc(stream) {
      // int fgetc(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fgetc.html
      var streamObj = FS.getStreamFromPtr(stream);
      if (!streamObj) return -1;
      if (streamObj.eof || streamObj.error) return -1;
      var ret = _fread(_fgetc.ret, 1, 1, stream);
      if (ret == 0) {
        return -1;
      } else if (ret == -1) {
        streamObj.error = true;
        return -1;
      } else {
        return HEAPU8[((_fgetc.ret)|0)];
      }
    }

  
  function _lseek(fildes, offset, whence) {
      // off_t lseek(int fildes, off_t offset, int whence);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/lseek.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        return FS.llseek(stream, offset, whence);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _fseek(stream, offset, whence) {
      // int fseek(FILE *stream, long offset, int whence);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fseek.html
      var fd = _fileno(stream);
      var ret = _lseek(fd, offset, whence);
      if (ret == -1) {
        return -1;
      }
      stream = FS.getStreamFromPtr(stream);
      stream.eof = false;
      return 0;
    }

  function _SDL_GetAppState() {
      var state = 0;
  
      if (Browser.pointerLock) {
        state |= 0x01;  // SDL_APPMOUSEFOCUS
      }
      if (document.hasFocus()) {
        state |= 0x02;  // SDL_APPINPUTFOCUS
      }
      state |= 0x04;  // SDL_APPACTIVE
  
      return state;
    }

  function _SDL_FillRect(surf, rect, color) {
      var surfData = SDL.surfaces[surf];
      assert(!surfData.locked); // but we could unlock and re-lock if we must..
      
      if (surfData.isFlagSet(0x00200000 /* SDL_HWPALETTE */)) {
        //in SDL_HWPALETTE color is index (0..255)
        //so we should translate 1 byte value to
        //32 bit canvas
        var index = color * 3;
        color = SDL.translateRGBAToColor(surfData.colors[index], surfData.colors[index +1], surfData.colors[index +2], 255);
      }
  
      var r = rect ? SDL.loadRect(rect) : { x: 0, y: 0, w: surfData.width, h: surfData.height };
      surfData.ctx.save();
      surfData.ctx.fillStyle = SDL.translateColorToCSSRGBA(color);
      surfData.ctx.fillRect(r.x, r.y, r.w, r.h);
      surfData.ctx.restore();
      return 0;
    }

  function _SDL_LockSurface(surf) {
      var surfData = SDL.surfaces[surf];
  
      surfData.locked++;
      if (surfData.locked > 1) return 0;
  
      if (!surfData.buffer) {
        surfData.buffer = _malloc(surfData.width * surfData.height * 4);
        HEAP32[(((surf)+(20))>>2)]=surfData.buffer;
      }
  
      // Mark in C/C++-accessible SDL structure
      // SDL_Surface has the following fields: Uint32 flags, SDL_PixelFormat *format; int w, h; Uint16 pitch; void *pixels; ...
      // So we have fields all of the same size, and 5 of them before us.
      // TODO: Use macros like in library.js
      HEAP32[(((surf)+(20))>>2)]=surfData.buffer;
  
      if (surf == SDL.screen && Module.screenIsReadOnly && surfData.image) return 0;
  
      surfData.image = surfData.ctx.getImageData(0, 0, surfData.width, surfData.height);
      if (surf == SDL.screen) {
        var data = surfData.image.data;
        var num = data.length;
        for (var i = 0; i < num/4; i++) {
          data[i*4+3] = 255; // opacity, as canvases blend alpha
        }
      }
  
      if (SDL.defaults.copyOnLock) {
        // Copy pixel data to somewhere accessible to 'C/C++'
        if (surfData.isFlagSet(0x00200000 /* SDL_HWPALETTE */)) {
          // If this is neaded then
          // we should compact the data from 32bpp to 8bpp index.
          // I think best way to implement this is use
          // additional colorMap hash (color->index).
          // Something like this:
          //
          // var size = surfData.width * surfData.height;
          // var data = '';
          // for (var i = 0; i<size; i++) {
          //   var color = SDL.translateRGBAToColor(
          //     surfData.image.data[i*4   ], 
          //     surfData.image.data[i*4 +1], 
          //     surfData.image.data[i*4 +2], 
          //     255);
          //   var index = surfData.colorMap[color];
          //   HEAP8[(((surfData.buffer)+(i))|0)]=index;
          // }
          throw 'CopyOnLock is not supported for SDL_LockSurface with SDL_HWPALETTE flag set' + new Error().stack;
        } else {
        HEAPU8.set(surfData.image.data, surfData.buffer);
        }
      }
  
      return 0;
    }

  function _SDL_UnlockSurface(surf) {
      assert(!SDL.GL); // in GL mode we do not keep around 2D canvases and contexts
  
      var surfData = SDL.surfaces[surf];
  
      if (!surfData.locked || --surfData.locked > 0) {
        return;
      }
  
      // Copy pixel data to image
      if (surfData.isFlagSet(0x00200000 /* SDL_HWPALETTE */)) {
        SDL.copyIndexedColorData(surfData);
      } else if (!surfData.colors) {
        var data = surfData.image.data;
        var buffer = surfData.buffer;
        assert(buffer % 4 == 0, 'Invalid buffer offset: ' + buffer);
        var src = buffer >> 2;
        var dst = 0;
        var isScreen = surf == SDL.screen;
        var num;
        if (typeof CanvasPixelArray !== 'undefined' && data instanceof CanvasPixelArray) {
          // IE10/IE11: ImageData objects are backed by the deprecated CanvasPixelArray,
          // not UInt8ClampedArray. These don't have buffers, so we need to revert
          // to copying a byte at a time. We do the undefined check because modern
          // browsers do not define CanvasPixelArray anymore.
          num = data.length;
          while (dst < num) {
            var val = HEAP32[src]; // This is optimized. Instead, we could do HEAP32[(((buffer)+(dst))>>2)];
            data[dst  ] = val & 0xff;
            data[dst+1] = (val >> 8) & 0xff;
            data[dst+2] = (val >> 16) & 0xff;
            data[dst+3] = isScreen ? 0xff : ((val >> 24) & 0xff);
            src++;
            dst += 4;
          }
        } else {
          var data32 = new Uint32Array(data.buffer);
          num = data32.length;
          if (isScreen) {
            while (dst < num) {
              // HEAP32[src++] is an optimization. Instead, we could do HEAP32[(((buffer)+(dst))>>2)];
              data32[dst++] = HEAP32[src++] | 0xff000000;
            }
          } else {
            while (dst < num) {
              data32[dst++] = HEAP32[src++];
            }
          }
        }
      } else {
        var width = Module['canvas'].width;
        var height = Module['canvas'].height;
        var s = surfData.buffer;
        var data = surfData.image.data;
        var colors = surfData.colors;
        for (var y = 0; y < height; y++) {
          var base = y*width*4;
          for (var x = 0; x < width; x++) {
            // See comment above about signs
            var val = HEAPU8[((s++)|0)] * 3;
            var start = base + x*4;
            data[start]   = colors[val];
            data[start+1] = colors[val+1];
            data[start+2] = colors[val+2];
          }
          s += width*3;
        }
      }
      // Copy to canvas
      surfData.ctx.putImageData(surfData.image, 0, 0);
      // Note that we save the image, so future writes are fast. But, memory is not yet released
    }

  function _SDL_UpdateRect(surf, x, y, w, h) {
      // We actually do the whole screen in Unlock...
    }

  
  function _close(fildes) {
      // int close(int fildes);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/close.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        FS.close(stream);
        return 0;
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }
  
  function _fsync(fildes) {
      // int fsync(int fildes);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fsync.html
      var stream = FS.getStream(fildes);
      if (stream) {
        // We write directly to the file system, so there's nothing to do here.
        return 0;
      } else {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
    }function _fclose(stream) {
      // int fclose(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fclose.html
      var fd = _fileno(stream);
      _fsync(fd);
      return _close(fd);
    }

  function _abort() {
      Module['abort']();
    }

  function ___errno_location() {
      return ___errno_state;
    }

  
  
  function _emscripten_memcpy_big(dest, src, num) {
      HEAPU8.set(HEAPU8.subarray(src, src+num), dest);
      return dest;
    }function _memcpy(dest, src, num) {
      dest = dest|0; src = src|0; num = num|0;
      var ret = 0;
      if ((num|0) >= 4096) return _emscripten_memcpy_big(dest|0, src|0, num|0)|0;
      ret = dest|0;
      if ((dest&3) == (src&3)) {
        while (dest & 3) {
          if ((num|0) == 0) return ret|0;
          HEAP8[(dest)]=HEAP8[(src)];
          dest = (dest+1)|0;
          src = (src+1)|0;
          num = (num-1)|0;
        }
        while ((num|0) >= 4) {
          HEAP32[((dest)>>2)]=HEAP32[((src)>>2)];
          dest = (dest+4)|0;
          src = (src+4)|0;
          num = (num-4)|0;
        }
      }
      while ((num|0) > 0) {
        HEAP8[(dest)]=HEAP8[(src)];
        dest = (dest+1)|0;
        src = (src+1)|0;
        num = (num-1)|0;
      }
      return ret|0;
    }var _llvm_memcpy_p0i8_p0i8_i32=_memcpy;

  function _sbrk(bytes) {
      // Implement a Linux-like 'memory area' for our 'process'.
      // Changes the size of the memory area by |bytes|; returns the
      // address of the previous top ('break') of the memory area
      // We control the "dynamic" memory - DYNAMIC_BASE to DYNAMICTOP
      var self = _sbrk;
      if (!self.called) {
        DYNAMICTOP = alignMemoryPage(DYNAMICTOP); // make sure we start out aligned
        self.called = true;
        assert(Runtime.dynamicAlloc);
        self.alloc = Runtime.dynamicAlloc;
        Runtime.dynamicAlloc = function() { abort('cannot dynamically allocate, sbrk now has control') };
      }
      var ret = DYNAMICTOP;
      if (bytes != 0) self.alloc(bytes);
      return ret;  // Previous break location.
    }

  function _sysconf(name) {
      // long sysconf(int name);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/sysconf.html
      switch(name) {
        case 30: return PAGE_SIZE;
        case 132:
        case 133:
        case 12:
        case 137:
        case 138:
        case 15:
        case 235:
        case 16:
        case 17:
        case 18:
        case 19:
        case 20:
        case 149:
        case 13:
        case 10:
        case 236:
        case 153:
        case 9:
        case 21:
        case 22:
        case 159:
        case 154:
        case 14:
        case 77:
        case 78:
        case 139:
        case 80:
        case 81:
        case 79:
        case 82:
        case 68:
        case 67:
        case 164:
        case 11:
        case 29:
        case 47:
        case 48:
        case 95:
        case 52:
        case 51:
        case 46:
          return 200809;
        case 27:
        case 246:
        case 127:
        case 128:
        case 23:
        case 24:
        case 160:
        case 161:
        case 181:
        case 182:
        case 242:
        case 183:
        case 184:
        case 243:
        case 244:
        case 245:
        case 165:
        case 178:
        case 179:
        case 49:
        case 50:
        case 168:
        case 169:
        case 175:
        case 170:
        case 171:
        case 172:
        case 97:
        case 76:
        case 32:
        case 173:
        case 35:
          return -1;
        case 176:
        case 177:
        case 7:
        case 155:
        case 8:
        case 157:
        case 125:
        case 126:
        case 92:
        case 93:
        case 129:
        case 130:
        case 131:
        case 94:
        case 91:
          return 1;
        case 74:
        case 60:
        case 69:
        case 70:
        case 4:
          return 1024;
        case 31:
        case 42:
        case 72:
          return 32;
        case 87:
        case 26:
        case 33:
          return 2147483647;
        case 34:
        case 1:
          return 47839;
        case 38:
        case 36:
          return 99;
        case 43:
        case 37:
          return 2048;
        case 0: return 2097152;
        case 3: return 65536;
        case 28: return 32768;
        case 44: return 32767;
        case 75: return 16384;
        case 39: return 1000;
        case 89: return 700;
        case 71: return 256;
        case 40: return 255;
        case 2: return 100;
        case 180: return 64;
        case 25: return 20;
        case 5: return 16;
        case 6: return 6;
        case 73: return 4;
        case 84: return 1;
      }
      ___setErrNo(ERRNO_CODES.EINVAL);
      return -1;
    }

  function _time(ptr) {
      var ret = Math.floor(Date.now()/1000);
      if (ptr) {
        HEAP32[((ptr)>>2)]=ret;
      }
      return ret;
    }






FS.staticInit();__ATINIT__.unshift({ func: function() { if (!Module["noFSInit"] && !FS.init.initialized) FS.init() } });__ATMAIN__.push({ func: function() { FS.ignorePermissions = false } });__ATEXIT__.push({ func: function() { FS.quit() } });Module["FS_createFolder"] = FS.createFolder;Module["FS_createPath"] = FS.createPath;Module["FS_createDataFile"] = FS.createDataFile;Module["FS_createPreloadedFile"] = FS.createPreloadedFile;Module["FS_createLazyFile"] = FS.createLazyFile;Module["FS_createLink"] = FS.createLink;Module["FS_createDevice"] = FS.createDevice;
___errno_state = Runtime.staticAlloc(4); HEAP32[((___errno_state)>>2)]=0;
__ATINIT__.unshift({ func: function() { TTY.init() } });__ATEXIT__.push({ func: function() { TTY.shutdown() } });TTY.utf8 = new Runtime.UTF8Processor();
if (ENVIRONMENT_IS_NODE) { var fs = require("fs"); NODEFS.staticInit(); }
Module["requestFullScreen"] = function Module_requestFullScreen(lockPointer, resizeCanvas) { Browser.requestFullScreen(lockPointer, resizeCanvas) };
  Module["requestAnimationFrame"] = function Module_requestAnimationFrame(func) { Browser.requestAnimationFrame(func) };
  Module["setCanvasSize"] = function Module_setCanvasSize(width, height, noUpdates) { Browser.setCanvasSize(width, height, noUpdates) };
  Module["pauseMainLoop"] = function Module_pauseMainLoop() { Browser.mainLoop.pause() };
  Module["resumeMainLoop"] = function Module_resumeMainLoop() { Browser.mainLoop.resume() };
  Module["getUserMedia"] = function Module_getUserMedia() { Browser.getUserMedia() }
__ATINIT__.push({ func: function() { SOCKFS.root = FS.mount(SOCKFS, {}, null); } });
_fputc.ret = allocate([0], "i8", ALLOC_STATIC);
_fgetc.ret = allocate([0], "i8", ALLOC_STATIC);
STACK_BASE = STACKTOP = Runtime.alignMemory(STATICTOP);

staticSealed = true; // seal the static portion of memory

STACK_MAX = STACK_BASE + 5242880;

DYNAMIC_BASE = DYNAMICTOP = Runtime.alignMemory(STACK_MAX);

assert(DYNAMIC_BASE < TOTAL_MEMORY, "TOTAL_MEMORY not big enough for stack");



var FUNCTION_TABLE = [0,0,_ZapisiPort,0,_ZapisiBajt,0,_BeriPort,0,_BeriBajt,0,_Emuliraj,0,_BeriBajtExec,0];

// EMSCRIPTEN_START_FUNCS

function _urDisassembleOne($dstr,$addr){
 var label=0;
 var tempVarArgs=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+144)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1;
 var $2;
 var $3;
 var $buf=sp;
 var $res;
 var $idx;
 var $ci;
 var $f;
 var $c;
 var $opc;
 var $bpos;
 var $opn;
 var $op;
 var $nextW;
 var $opstr=(sp)+(8);
 var $b;
 $2=$dstr;
 $3=$addr;
 $idx=0;
 var $4=HEAP32[((13264)>>2)];
 var $5=($4|0)!=0;
 if($5){label=3;break;}else{label=2;break;}
 case 2: 
 $1=-1;
 label=87;break;
 case 3: 
 $f=0;
 label=4;break;
 case 4: 
 var $9=$f;
 var $10=($9>>>0)<8;
 if($10){label=5;break;}else{label=7;break;}
 case 5: 
 var $12=HEAP32[((13264)>>2)];
 var $13=$3;
 var $14=($13&65535);
 var $15=$f;
 var $16=((($14)+($15))|0);
 var $17=(($16)&65535);
 var $18=FUNCTION_TABLE[$12]($17);
 var $19=$f;
 var $20=(($buf+$19)|0);
 HEAP8[($20)]=$18;
 label=6;break;
 case 6: 
 var $22=$f;
 var $23=((($22)+(1))|0);
 $f=$23;
 label=4;break;
 case 7: 
 var $25=(($buf)|0);
 var $26=HEAP8[($25)];
 var $27=($26&255);
 var $28=($27|0)==221;
 if($28){label=9;break;}else{label=8;break;}
 case 8: 
 var $30=(($buf)|0);
 var $31=HEAP8[($30)];
 var $32=($31&255);
 var $33=($32|0)==253;
 if($33){label=9;break;}else{label=12;break;}
 case 9: 
 var $35=(($buf+1)|0);
 var $36=HEAP8[($35)];
 var $37=($36&255);
 var $38=$37&255;
 var $39=((3904+$38)|0);
 var $40=HEAP8[($39)];
 var $41=(($40<<24)>>24)!=0;
 if($41){label=10;break;}else{label=11;break;}
 case 10: 
 var $43=$2;
 var $44=(($buf)|0);
 var $45=HEAP8[($44)];
 var $46=($45&255);
 var $47=($46|0)==221;
 var $48=($47?70:71);
 var $49=((3616+($48<<2))|0);
 var $50=HEAP32[(($49)>>2)];
 var $51=_strcpy($43,$50);
 $1=1;
 label=87;break;
 case 11: 
 var $53=(($buf+2)|0);
 var $54=HEAP8[($53)];
 var $55=(($54<<24)>>24);
 $idx=$55;
 label=12;break;
 case 12: 
 var $57=(($buf)|0);
 var $58=HEAP8[($57)];
 var $59=($58&255);
 var $60=(($buf+1)|0);
 var $61=HEAP8[($60)];
 var $62=($61&255);
 var $63=$62<<8;
 var $64=$59|$63;
 var $65=(($buf+2)|0);
 var $66=HEAP8[($65)];
 var $67=($66&255);
 var $68=$67<<16;
 var $69=$64|$68;
 var $70=(($buf+3)|0);
 var $71=HEAP8[($70)];
 var $72=($71&255);
 var $73=$72<<24;
 var $74=$69|$73;
 $ci=$74;
 $opn=0;
 label=13;break;
 case 13: 
 var $76=$opn;
 var $77=($76|0)<=357;
 if($77){label=14;break;}else{label=86;break;}
 case 14: 
 $res=0;
 var $79=$2;
 var $80=(($79)|0);
 HEAP8[($80)]=0;
 label=15;break;
 case 15: 
 var $82=$opn;
 var $83=($82|0)<=357;
 if($83){label=16;break;}else{var $97=0;label=17;break;}
 case 16: 
 var $85=$ci;
 var $86=$opn;
 var $87=((4160+((($86)*(24))&-1))|0);
 var $88=(($87+8)|0);
 var $89=HEAP32[(($88)>>2)];
 var $90=$85&$89;
 var $91=$opn;
 var $92=((4160+((($91)*(24))&-1))|0);
 var $93=(($92+4)|0);
 var $94=HEAP32[(($93)>>2)];
 var $95=($90|0)!=($94|0);
 var $97=$95;label=17;break;
 case 17: 
 var $97;
 if($97){label=18;break;}else{label=20;break;}
 case 18: 
 label=19;break;
 case 19: 
 var $100=$opn;
 var $101=((($100)+(1))|0);
 $opn=$101;
 label=15;break;
 case 20: 
 var $103=$opn;
 var $104=($103|0)>357;
 if($104){label=21;break;}else{label=30;break;}
 case 21: 
 var $106=(($buf)|0);
 var $107=HEAP8[($106)];
 var $108=($107&255);
 var $109=($108|0)==237;
 if($109){label=22;break;}else{label=26;break;}
 case 22: 
 var $111=HEAP32[((13280)>>2)];
 var $112=($111|0)!=0;
 if($112){label=24;break;}else{label=23;break;}
 case 23: 
 var $114=(($opstr)|0);
 var $115=(($buf)|0);
 var $116=HEAP8[($115)];
 var $117=($116&255);
 var $118=(($buf+1)|0);
 var $119=HEAP8[($118)];
 var $120=($119&255);
 var $121=_sprintf($114,2128,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 16)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$117,HEAP32[(((tempVarArgs)+(8))>>2)]=$120,tempVarArgs)); STACKTOP=tempVarArgs;
 label=25;break;
 case 24: 
 var $123=(($opstr)|0);
 var $124=(($buf)|0);
 var $125=HEAP8[($124)];
 var $126=($125&255);
 var $127=(($buf+1)|0);
 var $128=HEAP8[($127)];
 var $129=($128&255);
 var $130=_sprintf($123,2120,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 16)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$126,HEAP32[(((tempVarArgs)+(8))>>2)]=$129,tempVarArgs)); STACKTOP=tempVarArgs;
 label=25;break;
 case 25: 
 var $132=$2;
 var $133=(($opstr)|0);
 var $134=_sprintf($132,2112,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$133,tempVarArgs)); STACKTOP=tempVarArgs;
 $1=2;
 label=87;break;
 case 26: 
 var $136=HEAP32[((13280)>>2)];
 var $137=($136|0)!=0;
 if($137){label=28;break;}else{label=27;break;}
 case 27: 
 var $139=(($opstr)|0);
 var $140=(($buf)|0);
 var $141=HEAP8[($140)];
 var $142=($141&255);
 var $143=_sprintf($139,2104,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$142,tempVarArgs)); STACKTOP=tempVarArgs;
 label=29;break;
 case 28: 
 var $145=(($opstr)|0);
 var $146=(($buf)|0);
 var $147=HEAP8[($146)];
 var $148=($147&255);
 var $149=_sprintf($145,2096,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$148,tempVarArgs)); STACKTOP=tempVarArgs;
 label=29;break;
 case 29: 
 var $151=$2;
 var $152=(($opstr)|0);
 var $153=_sprintf($151,2112,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$152,tempVarArgs)); STACKTOP=tempVarArgs;
 $1=1;
 label=87;break;
 case 30: 
 var $155=$opn;
 var $156=((4160+((($155)*(24))&-1))|0);
 var $157=(($156+8)|0);
 var $158=HEAP32[(($157)>>2)];
 $f=$158;
 var $159=$opn;
 var $160=((4160+((($159)*(24))&-1))|0);
 var $161=(($160+4)|0);
 var $162=HEAP32[(($161)>>2)];
 $c=$162;
 $bpos=0;
 label=31;break;
 case 31: 
 var $164=$f;
 var $165=$164&255;
 var $166=($165|0)!=255;
 if($166){label=32;break;}else{label=33;break;}
 case 32: 
 label=40;break;
 case 33: 
 var $169=$c;
 var $170=$169&255;
 var $171=(($170)&255);
 $b=$171;
 var $172=$b;
 var $173=($172&255);
 var $174=($173|0)!=253;
 if($174){label=34;break;}else{label=38;break;}
 case 34: 
 var $176=$b;
 var $177=($176&255);
 var $178=($177|0)!=221;
 if($178){label=35;break;}else{label=38;break;}
 case 35: 
 var $180=$b;
 var $181=($180&255);
 var $182=($181|0)!=237;
 if($182){label=36;break;}else{label=38;break;}
 case 36: 
 var $184=$b;
 var $185=($184&255);
 var $186=($185|0)!=203;
 if($186){label=37;break;}else{label=38;break;}
 case 37: 
 label=40;break;
 case 38: 
 var $189=$f;
 var $190=$189>>>8;
 $f=$190;
 var $191=$c;
 var $192=$191>>>8;
 $c=$192;
 var $193=$res;
 var $194=((($193)+(1))|0);
 $res=$194;
 label=39;break;
 case 39: 
 var $196=$bpos;
 var $197=((($196)+(1))|0);
 $bpos=$197;
 label=31;break;
 case 40: 
 var $199=$opn;
 var $200=((4160+((($199)*(24))&-1))|0);
 var $201=(($200+4)|0);
 var $202=HEAP32[(($201)>>2)];
 var $203=$202&65535;
 var $204=($203|0)==52189;
 if($204){label=42;break;}else{label=41;break;}
 case 41: 
 var $206=$opn;
 var $207=((4160+((($206)*(24))&-1))|0);
 var $208=(($207+4)|0);
 var $209=HEAP32[(($208)>>2)];
 var $210=$209&65535;
 var $211=($210|0)==52221;
 if($211){label=42;break;}else{label=43;break;}
 case 42: 
 var $213=$f;
 var $214=$213>>>8;
 $f=$214;
 label=43;break;
 case 43: 
 label=44;break;
 case 44: 
 var $217=$f;
 var $218=($217|0)!=0;
 if($218){label=45;break;}else{label=46;break;}
 case 45: 
 var $220=$f;
 var $221=$220>>>8;
 $f=$221;
 var $222=$res;
 var $223=((($222)+(1))|0);
 $res=$223;
 label=44;break;
 case 46: 
 var $225=$2;
 var $226=$opn;
 var $227=((4160+((($226)*(24))&-1))|0);
 var $228=(($227)|0);
 var $229=HEAP32[(($228)>>2)];
 var $230=((3616+($229<<2))|0);
 var $231=HEAP32[(($230)>>2)];
 var $232=_strcpy($225,$231);
 var $233=$opn;
 var $234=((4160+((($233)*(24))&-1))|0);
 var $235=(($234+12)|0);
 var $236=(($235)|0);
 var $237=HEAP32[(($236)>>2)];
 var $238=($237|0)==0;
 if($238){label=47;break;}else{label=48;break;}
 case 47: 
 var $240=$res;
 $1=$240;
 label=87;break;
 case 48: 
 var $242=$opn;
 var $243=((4160+((($242)*(24))&-1))|0);
 var $244=(($243+4)|0);
 var $245=HEAP32[(($244)>>2)];
 var $246=$245&65535;
 var $247=($246|0)==52189;
 if($247){label=50;break;}else{label=49;break;}
 case 49: 
 var $249=$opn;
 var $250=((4160+((($249)*(24))&-1))|0);
 var $251=(($250+4)|0);
 var $252=HEAP32[(($251)>>2)];
 var $253=$252&65535;
 var $254=($253|0)==52221;
 if($254){label=50;break;}else{label=51;break;}
 case 50: 
 var $256=$bpos;
 var $257=((($256)+(1))|0);
 $bpos=$257;
 label=57;break;
 case 51: 
 var $259=$opn;
 var $260=((4160+((($259)*(24))&-1))|0);
 var $261=(($260+12)|0);
 var $262=(($261)|0);
 var $263=HEAP32[(($262)>>2)];
 var $264=($263|0)==33;
 if($264){label=53;break;}else{label=52;break;}
 case 52: 
 var $266=$opn;
 var $267=((4160+((($266)*(24))&-1))|0);
 var $268=(($267+12)|0);
 var $269=(($268)|0);
 var $270=HEAP32[(($269)>>2)];
 var $271=($270|0)==34;
 if($271){label=53;break;}else{label=56;break;}
 case 53: 
 var $273=$opn;
 var $274=((4160+((($273)*(24))&-1))|0);
 var $275=(($274+12)|0);
 var $276=(($275+4)|0);
 var $277=HEAP32[(($276)>>2)];
 var $278=($277|0)==1;
 if($278){label=54;break;}else{label=56;break;}
 case 54: 
 var $280=$opn;
 var $281=((4160+((($280)*(24))&-1))|0);
 var $282=(($281+12)|0);
 var $283=(($282+8)|0);
 var $284=HEAP32[(($283)>>2)];
 var $285=($284|0)==0;
 if($285){label=55;break;}else{label=56;break;}
 case 55: 
 var $287=$bpos;
 var $288=((($287)+(1))|0);
 $bpos=$288;
 label=56;break;
 case 56: 
 label=57;break;
 case 57: 
 var $291=$bpos;
 var $292=((($291)+(1))|0);
 $bpos=$292;
 var $293=(($buf+$291)|0);
 var $294=HEAP8[($293)];
 $opc=$294;
 var $295=$bpos;
 var $296=(($buf+$295)|0);
 var $297=HEAP8[($296)];
 var $298=($297&255);
 var $299=($298&65535);
 var $300=$bpos;
 var $301=((($300)+(1))|0);
 var $302=(($buf+$301)|0);
 var $303=HEAP8[($302)];
 var $304=($303&255);
 var $305=($304&65535);
 var $306=$305<<8;
 var $307=$299|$306;
 var $308=(($307)&65535);
 $nextW=$308;
 $f=0;
 label=58;break;
 case 58: 
 var $310=$f;
 var $311=($310>>>0)<=3;
 if($311){label=59;break;}else{label=84;break;}
 case 59: 
 var $313=$f;
 var $314=($313|0)==3;
 if($314){label=60;break;}else{label=61;break;}
 case 60: 
 var $316=$res;
 $1=$316;
 label=87;break;
 case 61: 
 var $318=$f;
 var $319=$opn;
 var $320=((4160+((($319)*(24))&-1))|0);
 var $321=(($320+12)|0);
 var $322=(($321+($318<<2))|0);
 var $323=HEAP32[(($322)>>2)];
 $op=$323;
 var $324=$op;
 var $325=($324|0)==0;
 if($325){label=62;break;}else{label=63;break;}
 case 62: 
 var $327=$res;
 $1=$327;
 label=87;break;
 case 63: 
 var $329=$op;
 var $330=($329|0)==7;
 if($330){label=64;break;}else{label=67;break;}
 case 64: 
 var $332=$opc;
 var $333=($332&255);
 var $334=$333&7;
 var $335=($334|0)==6;
 if($335){label=65;break;}else{label=66;break;}
 case 65: 
 label=84;break;
 case 66: 
 label=67;break;
 case 67: 
 var $339=$op;
 var $340=($339|0)==9;
 if($340){label=68;break;}else{label=71;break;}
 case 68: 
 var $342=$opc;
 var $343=($342&255);
 var $344=$343>>3;
 var $345=$344&7;
 var $346=($345|0)==6;
 if($346){label=69;break;}else{label=70;break;}
 case 69: 
 label=84;break;
 case 70: 
 label=71;break;
 case 71: 
 var $350=$op;
 var $351=($350|0)==33;
 if($351){label=73;break;}else{label=72;break;}
 case 72: 
 var $353=$op;
 var $354=($353|0)==34;
 if($354){label=73;break;}else{label=74;break;}
 case 73: 
 var $356=$res;
 var $357=((($356)+(1))|0);
 $res=$357;
 label=74;break;
 case 74: 
 var $359=$op;
 var $360=($359|0)==1;
 if($360){label=77;break;}else{label=75;break;}
 case 75: 
 var $362=$op;
 var $363=($362|0)==4;
 if($363){label=77;break;}else{label=76;break;}
 case 76: 
 var $365=$op;
 var $366=($365|0)==11;
 if($366){label=77;break;}else{label=78;break;}
 case 77: 
 var $368=$res;
 var $369=((($368)+(1))|0);
 $res=$369;
 label=78;break;
 case 78: 
 var $371=$op;
 var $372=($371|0)==2;
 if($372){label=81;break;}else{label=79;break;}
 case 79: 
 var $374=$op;
 var $375=($374|0)==3;
 if($375){label=81;break;}else{label=80;break;}
 case 80: 
 var $377=$op;
 var $378=($377|0)==5;
 if($378){label=81;break;}else{label=82;break;}
 case 81: 
 var $380=$res;
 var $381=((($380)+(2))|0);
 $res=$381;
 label=82;break;
 case 82: 
 var $383=$2;
 var $384=$f;
 var $385=($384|0)==0;
 var $386=($385?2088:2080);
 var $387=_strcat($383,$386);
 var $388=(($opstr)|0);
 var $389=$op;
 var $390=$3;
 var $391=$opc;
 var $392=$nextW;
 var $393=$idx;
 _uaOp2Str($388,$389,$390,$391,$392,$393);
 var $394=$2;
 var $395=(($opstr)|0);
 var $396=_strcat($394,$395);
 label=83;break;
 case 83: 
 var $398=$f;
 var $399=((($398)+(1))|0);
 $f=$399;
 label=58;break;
 case 84: 
 label=85;break;
 case 85: 
 var $402=$opn;
 var $403=((($402)+(1))|0);
 $opn=$403;
 label=13;break;
 case 86: 
 $1=-1;
 label=87;break;
 case 87: 
 var $406=$1;
 STACKTOP=sp;return $406;
  default: assert(0, "bad label: " + label);
 }

}


function _uaOp2Str($res,$op,$addr,$opc,$nextW,$idx){
 var label=0;
 var tempVarArgs=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1;
 var $2;
 var $3;
 var $4;
 var $5;
 var $6;
 var $lbl;
 var $add;
 var $ismem;
 $1=$res;
 $2=$op;
 $3=$addr;
 $4=$opc;
 $5=$nextW;
 $6=$idx;
 $ismem=0;
 var $7=$2;
 switch(($7|0)){case 4:{ label=11;break;}case 3:{ label=15;break;}case 0:{ label=2;break;}case 1:{ label=3;break;}case 5:{ label=30;break;}case 6:case 7:{ label=31;break;}case 8:case 9:{ label=32;break;}case 10:{ label=33;break;}case 11:{ label=34;break;}case 12:{ label=38;break;}case 13:{ label=39;break;}case 14:{ label=40;break;}case 15:{ label=41;break;}case 16:{ label=42;break;}case 17:{ label=43;break;}case 18:{ label=44;break;}case 19:{ label=45;break;}case 20:{ label=46;break;}case 21:{ label=47;break;}case 22:{ label=48;break;}case 23:{ label=49;break;}case 24:{ label=50;break;}case 25:{ label=51;break;}case 26:{ label=52;break;}case 27:{ label=53;break;}case 28:{ label=54;break;}case 29:{ label=55;break;}case 30:{ label=56;break;}case 31:{ label=57;break;}case 32:{ label=58;break;}case 35:{ label=59;break;}case 36:{ label=60;break;}case 33:{ label=61;break;}case 34:{ label=62;break;}case 37:{ label=63;break;}case 38:{ label=64;break;}case 39:{ label=65;break;}case 40:{ label=66;break;}case 2:{ label=7;break;}case 41:{ label=70;break;}case 42:{ label=71;break;}case 43:{ label=72;break;}default:{label=73;break;}}break;
 case 2: 
 var $9=$1;
 var $10=_strcpy($9,14088);
 label=74;break;
 case 3: 
 var $12=HEAP32[((13280)>>2)];
 var $13=($12|0)!=0;
 if($13){label=5;break;}else{label=4;break;}
 case 4: 
 var $15=$1;
 var $16=$5;
 var $17=($16&65535);
 var $18=$17&255;
 var $19=_sprintf($15,2104,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$18,tempVarArgs)); STACKTOP=tempVarArgs;
 label=6;break;
 case 5: 
 var $21=$1;
 var $22=$5;
 var $23=($22&65535);
 var $24=$23&255;
 var $25=_sprintf($21,2096,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$24,tempVarArgs)); STACKTOP=tempVarArgs;
 label=6;break;
 case 6: 
 label=74;break;
 case 7: 
 var $28=HEAP32[((13280)>>2)];
 var $29=($28|0)!=0;
 if($29){label=9;break;}else{label=8;break;}
 case 8: 
 var $31=$1;
 var $32=$5;
 var $33=($32&65535);
 var $34=_sprintf($31,3480,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$33,tempVarArgs)); STACKTOP=tempVarArgs;
 label=10;break;
 case 9: 
 var $36=$1;
 var $37=$5;
 var $38=($37&65535);
 var $39=_sprintf($36,2096,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$38,tempVarArgs)); STACKTOP=tempVarArgs;
 label=10;break;
 case 10: 
 label=74;break;
 case 11: 
 var $42=$3;
 var $43=($42&65535);
 var $44=((($43)+(2))|0);
 var $45=(($44)&65535);
 $3=$45;
 var $46=$5;
 var $47=($46&65535);
 var $48=$47&255;
 var $49=(($48)&65535);
 $5=$49;
 var $50=$5;
 var $51=($50&65535);
 var $52=($51|0)<128;
 if($52){label=12;break;}else{label=13;break;}
 case 12: 
 var $54=$5;
 var $55=($54&65535);
 var $61=$55;label=14;break;
 case 13: 
 var $57=$5;
 var $58=($57&65535);
 var $59=((($58)-(256))|0);
 var $61=$59;label=14;break;
 case 14: 
 var $61;
 $add=$61;
 var $62=$add;
 var $63=$3;
 var $64=($63&65535);
 var $65=((($64)+($62))|0);
 var $66=(($65)&65535);
 $3=$66;
 var $67=$3;
 $5=$67;
 label=15;break;
 case 15: 
 label=16;break;
 case 16: 
 var $70=$5;
 var $71=_findLabelByAddr($70);
 $lbl=$71;
 var $72=$lbl;
 var $73=($72|0)!=0;
 if($73){label=17;break;}else{label=18;break;}
 case 17: 
 var $75=$1;
 var $76=$lbl;
 var $77=_strcpy($75,$76);
 label=74;break;
 case 18: 
 var $79=$5;
 var $80=($79&65535);
 var $81=((($80)-(1))|0);
 var $82=(($81)&65535);
 var $83=_findLabelByAddr($82);
 $lbl=$83;
 var $84=$lbl;
 var $85=($84|0)!=0;
 if($85){label=19;break;}else{label=20;break;}
 case 19: 
 var $87=$1;
 var $88=$lbl;
 var $89=_sprintf($87,3472,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$88,tempVarArgs)); STACKTOP=tempVarArgs;
 label=74;break;
 case 20: 
 var $91=$5;
 var $92=($91&65535);
 var $93=((($92)-(2))|0);
 var $94=(($93)&65535);
 var $95=_findLabelByAddr($94);
 $lbl=$95;
 var $96=$lbl;
 var $97=($96|0)!=0;
 if($97){label=21;break;}else{label=22;break;}
 case 21: 
 var $99=$1;
 var $100=$lbl;
 var $101=_sprintf($99,3440,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$100,tempVarArgs)); STACKTOP=tempVarArgs;
 label=74;break;
 case 22: 
 var $103=$5;
 var $104=($103&65535);
 var $105=((($104)+(1))|0);
 var $106=(($105)&65535);
 var $107=_findLabelByAddr($106);
 $lbl=$107;
 var $108=$lbl;
 var $109=($108|0)!=0;
 if($109){label=23;break;}else{label=24;break;}
 case 23: 
 var $111=$1;
 var $112=$lbl;
 var $113=_sprintf($111,3432,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$112,tempVarArgs)); STACKTOP=tempVarArgs;
 label=74;break;
 case 24: 
 var $115=$5;
 var $116=($115&65535);
 var $117=((($116)+(2))|0);
 var $118=(($117)&65535);
 var $119=_findLabelByAddr($118);
 $lbl=$119;
 var $120=$lbl;
 var $121=($120|0)!=0;
 if($121){label=25;break;}else{label=26;break;}
 case 25: 
 var $123=$1;
 var $124=$lbl;
 var $125=_sprintf($123,3424,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$124,tempVarArgs)); STACKTOP=tempVarArgs;
 label=74;break;
 case 26: 
 var $127=HEAP32[((13280)>>2)];
 var $128=($127|0)!=0;
 if($128){label=28;break;}else{label=27;break;}
 case 27: 
 var $130=$1;
 var $131=$5;
 var $132=($131&65535);
 var $133=_sprintf($130,3480,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$132,tempVarArgs)); STACKTOP=tempVarArgs;
 label=29;break;
 case 28: 
 var $135=$1;
 var $136=$5;
 var $137=($136&65535);
 var $138=_sprintf($135,2096,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$137,tempVarArgs)); STACKTOP=tempVarArgs;
 label=29;break;
 case 29: 
 label=74;break;
 case 30: 
 $ismem=1;
 var $141=$1;
 var $142=_strcpy($141,3416);
 var $143=$1;
 var $144=(($143+1)|0);
 $1=$144;
 label=16;break;
 case 31: 
 var $146=$1;
 var $147=$4;
 var $148=($147&255);
 var $149=$148&7;
 var $150=((3520+($149<<2))|0);
 var $151=HEAP32[(($150)>>2)];
 var $152=_strcpy($146,$151);
 label=74;break;
 case 32: 
 var $154=$1;
 var $155=$4;
 var $156=($155&255);
 var $157=$156>>3;
 var $158=$157&7;
 var $159=((3520+($158<<2))|0);
 var $160=HEAP32[(($159)>>2)];
 var $161=_strcpy($154,$160);
 label=74;break;
 case 33: 
 var $163=$1;
 var $164=_strcpy($163,3408);
 label=74;break;
 case 34: 
 var $166=HEAP32[((13280)>>2)];
 var $167=($166|0)!=0;
 if($167){label=36;break;}else{label=35;break;}
 case 35: 
 var $169=$1;
 var $170=$5;
 var $171=($170&65535);
 var $172=$171&255;
 var $173=_sprintf($169,3400,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$172,tempVarArgs)); STACKTOP=tempVarArgs;
 label=37;break;
 case 36: 
 var $175=$1;
 var $176=$5;
 var $177=($176&65535);
 var $178=$177&255;
 var $179=_sprintf($175,3392,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$178,tempVarArgs)); STACKTOP=tempVarArgs;
 label=37;break;
 case 37: 
 label=74;break;
 case 38: 
 var $182=$1;
 var $183=_strcpy($182,3384);
 label=74;break;
 case 39: 
 var $185=$1;
 var $186=_strcpy($185,3368);
 label=74;break;
 case 40: 
 var $188=$1;
 var $189=_strcpy($188,3360);
 label=74;break;
 case 41: 
 var $191=$1;
 var $192=_strcpy($191,3336);
 label=74;break;
 case 42: 
 var $194=$1;
 var $195=_strcpy($194,2304);
 label=74;break;
 case 43: 
 var $197=$1;
 var $198=_strcpy($197,3328);
 label=74;break;
 case 44: 
 var $200=$1;
 var $201=_strcpy($200,3272);
 label=74;break;
 case 45: 
 var $203=$1;
 var $204=$4;
 var $205=($204&255);
 var $206=$205>>4;
 var $207=$206&3;
 var $208=((3568+($207<<2))|0);
 var $209=HEAP32[(($208)>>2)];
 var $210=_strcpy($203,$209);
 label=74;break;
 case 46: 
 var $212=$1;
 var $213=$4;
 var $214=($213&255);
 var $215=$214>>4;
 var $216=$215&3;
 var $217=((3552+($216<<2))|0);
 var $218=HEAP32[(($217)>>2)];
 var $219=_strcpy($212,$218);
 label=74;break;
 case 47: 
 var $221=$1;
 var $222=_strcpy($221,2232);
 label=74;break;
 case 48: 
 var $224=$1;
 var $225=_strcpy($224,3264);
 label=74;break;
 case 49: 
 var $227=$1;
 var $228=_strcpy($227,2288);
 label=74;break;
 case 50: 
 var $230=$1;
 var $231=_strcpy($230,2280);
 label=74;break;
 case 51: 
 var $233=$1;
 var $234=_strcpy($233,2248);
 label=74;break;
 case 52: 
 var $236=$1;
 var $237=_strcpy($236,3256);
 label=74;break;
 case 53: 
 var $239=$1;
 var $240=_strcpy($239,3248);
 label=74;break;
 case 54: 
 var $242=$1;
 var $243=_strcpy($242,2240);
 label=74;break;
 case 55: 
 var $245=$1;
 var $246=_strcpy($245,3240);
 label=74;break;
 case 56: 
 var $248=$1;
 var $249=_strcpy($248,3232);
 label=74;break;
 case 57: 
 var $251=$1;
 var $252=_strcpy($251,3216);
 label=74;break;
 case 58: 
 var $254=$1;
 var $255=_strcpy($254,2312);
 label=74;break;
 case 59: 
 var $257=$1;
 var $258=_strcpy($257,3208);
 label=74;break;
 case 60: 
 var $260=$1;
 var $261=_strcpy($260,3184);
 label=74;break;
 case 61: 
 var $263=$1;
 var $264=$6;
 var $265=($264|0)<0;
 var $266=($265?45:43);
 var $267=$6;
 var $268=_sprintf($263,3168,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 16)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$266,HEAP32[(((tempVarArgs)+(8))>>2)]=$267,tempVarArgs)); STACKTOP=tempVarArgs;
 label=74;break;
 case 62: 
 var $270=$1;
 var $271=$6;
 var $272=($271|0)<0;
 var $273=($272?45:43);
 var $274=$6;
 var $275=_sprintf($270,3152,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 16)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$273,HEAP32[(((tempVarArgs)+(8))>>2)]=$274,tempVarArgs)); STACKTOP=tempVarArgs;
 label=74;break;
 case 63: 
 var $277=$1;
 var $278=$4;
 var $279=($278&255);
 var $280=$279>>3;
 var $281=$280&3;
 var $282=((3584+($281<<2))|0);
 var $283=HEAP32[(($282)>>2)];
 var $284=_strcpy($277,$283);
 label=74;break;
 case 64: 
 var $286=$1;
 var $287=$4;
 var $288=($287&255);
 var $289=$288>>3;
 var $290=$289&7;
 var $291=((3584+($290<<2))|0);
 var $292=HEAP32[(($291)>>2)];
 var $293=_strcpy($286,$292);
 label=74;break;
 case 65: 
 var $295=$1;
 var $296=$4;
 var $297=($296&255);
 var $298=$297>>3;
 var $299=$298&7;
 var $300=_sprintf($295,2096,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$299,tempVarArgs)); STACKTOP=tempVarArgs;
 label=74;break;
 case 66: 
 var $302=HEAP32[((13280)>>2)];
 var $303=($302|0)!=0;
 if($303){label=68;break;}else{label=67;break;}
 case 67: 
 var $305=$1;
 var $306=$4;
 var $307=($306&255);
 var $308=$307&56;
 var $309=_sprintf($305,2104,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$308,tempVarArgs)); STACKTOP=tempVarArgs;
 label=69;break;
 case 68: 
 var $311=$1;
 var $312=$4;
 var $313=($312&255);
 var $314=$313&56;
 var $315=_sprintf($311,2096,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$314,tempVarArgs)); STACKTOP=tempVarArgs;
 label=69;break;
 case 69: 
 label=74;break;
 case 70: 
 var $318=$1;
 var $319=_strcpy($318,3144);
 label=74;break;
 case 71: 
 var $321=$1;
 var $322=_strcpy($321,3136);
 label=74;break;
 case 72: 
 var $324=$1;
 var $325=_strcpy($324,3128);
 label=74;break;
 case 73: 
 var $327=$1;
 var $328=_strcpy($327,14088);
 label=74;break;
 case 74: 
 var $330=$ismem;
 var $331=($330|0)!=0;
 if($331){label=75;break;}else{label=76;break;}
 case 75: 
 var $333=$1;
 var $334=_strcat($333,3120);
 label=76;break;
 case 76: 
 STACKTOP=sp;return;
  default: assert(0, "bad label: " + label);
 }

}


function _findLabelByAddr($addr){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1;
 var $2;
 $2=$addr;
 var $3=HEAP32[((13272)>>2)];
 var $4=($3|0)!=0;
 if($4){label=3;break;}else{label=2;break;}
 case 2: 
 $1=0;
 label=4;break;
 case 3: 
 var $7=HEAP32[((13272)>>2)];
 var $8=$2;
 var $9=FUNCTION_TABLE[$7]($8);
 $1=$9;
 label=4;break;
 case 4: 
 var $11=$1;
 STACKTOP=sp;return $11;
  default: assert(0, "bad label: " + label);
 }

}


function _zym_init_tables(){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $ff;
 var $n;
 var $p;
 var $1=HEAP32[((13288)>>2)];
 var $2=($1|0)!=0;
 if($2){label=11;break;}else{label=2;break;}
 case 2: 
 $ff=0;
 label=3;break;
 case 3: 
 var $5=$ff;
 var $6=($5|0)<=255;
 if($6){label=4;break;}else{label=10;break;}
 case 4: 
 var $8=$ff;
 var $9=$8&168;
 var $10=(($9)&255);
 var $11=$ff;
 var $12=((13552+$11)|0);
 HEAP8[($12)]=$10;
 var $13=$ff;
 $n=$13;
 $p=0;
 label=5;break;
 case 5: 
 var $15=$n;
 var $16=($15|0)!=0;
 if($16){label=6;break;}else{label=8;break;}
 case 6: 
 var $18=$n;
 var $19=$18&1;
 var $20=$p;
 var $21=$20^$19;
 $p=$21;
 label=7;break;
 case 7: 
 var $23=$n;
 var $24=$23>>1;
 $n=$24;
 label=5;break;
 case 8: 
 var $26=$p;
 var $27=($26|0)!=0;
 var $28=($27?0:4);
 var $29=(($28)&255);
 var $30=$ff;
 var $31=((13808+$30)|0);
 HEAP8[($31)]=$29;
 var $32=$ff;
 var $33=((13552+$32)|0);
 var $34=HEAP8[($33)];
 var $35=($34&255);
 var $36=$ff;
 var $37=((13808+$36)|0);
 var $38=HEAP8[($37)];
 var $39=($38&255);
 var $40=$35|$39;
 var $41=(($40)&255);
 var $42=$ff;
 var $43=((13296+$42)|0);
 HEAP8[($43)]=$41;
 label=9;break;
 case 9: 
 var $45=$ff;
 var $46=((($45)+(1))|0);
 $ff=$46;
 label=3;break;
 case 10: 
 var $48=HEAP8[(13552)];
 var $49=($48&255);
 var $50=$49|64;
 var $51=(($50)&255);
 HEAP8[(13552)]=$51;
 var $52=HEAP8[(13296)];
 var $53=($52&255);
 var $54=$53|64;
 var $55=(($54)&255);
 HEAP8[(13296)]=$55;
 HEAP32[((13288)>>2)]=1;
 label=11;break;
 case 11: 
 STACKTOP=sp;return;
  default: assert(0, "bad label: " + label);
 }

}


function _zym_init($z80){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);

 var $1;
 $1=$z80;
 _zym_init_tables();
 var $2=$1;
 var $3=$2;
 _memset($3, 0, 128)|0;
 var $4=$1;
 var $5=(($4+60)|0);
 HEAP32[(($5)>>2)]=-1;
 STACKTOP=sp;return;
}


function _zym_clear_callbacks($z80){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);

 var $1;
 $1=$z80;
 _zym_init_tables();
 var $2=$1;
 var $3=(($2+72)|0);
 HEAP32[(($3)>>2)]=0;
 var $4=$1;
 var $5=(($4+76)|0);
 HEAP32[(($5)>>2)]=0;
 var $6=$1;
 var $7=(($6+80)|0);
 HEAP32[(($7)>>2)]=0;
 var $8=$1;
 var $9=(($8+84)|0);
 HEAP32[(($9)>>2)]=0;
 var $10=$1;
 var $11=(($10+88)|0);
 HEAP32[(($11)>>2)]=0;
 var $12=$1;
 var $13=(($12+92)|0);
 HEAP32[(($13)>>2)]=0;
 var $14=$1;
 var $15=(($14+96)|0);
 HEAP32[(($15)>>2)]=0;
 var $16=$1;
 var $17=(($16+100)|0);
 HEAP32[(($17)>>2)]=0;
 var $18=$1;
 var $19=(($18+104)|0);
 HEAP32[(($19)>>2)]=0;
 STACKTOP=sp;return;
}


function _zym_reset($z80){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);

 var $1;
 $1=$z80;
 _zym_init_tables();
 var $2=$1;
 var $3=(($2+12)|0);
 var $4=$3;
 HEAP16[(($4)>>1)]=0;
 var $5=$1;
 var $6=(($5+10)|0);
 var $7=$6;
 HEAP16[(($7)>>1)]=0;
 var $8=$1;
 var $9=(($8+8)|0);
 var $10=$9;
 HEAP16[(($10)>>1)]=0;
 var $11=$1;
 var $12=(($11+6)|0);
 var $13=$12;
 HEAP16[(($13)>>1)]=0;
 var $14=$1;
 var $15=(($14+4)|0);
 var $16=$15;
 HEAP16[(($16)>>1)]=0;
 var $17=$1;
 var $18=(($17+2)|0);
 var $19=$18;
 HEAP16[(($19)>>1)]=0;
 var $20=$1;
 var $21=(($20)|0);
 var $22=$21;
 HEAP16[(($22)>>1)]=0;
 var $23=$1;
 var $24=(($23+20)|0);
 var $25=$24;
 HEAP16[(($25)>>1)]=0;
 var $26=$1;
 var $27=(($26+18)|0);
 var $28=$27;
 HEAP16[(($28)>>1)]=0;
 var $29=$1;
 var $30=(($29+16)|0);
 var $31=$30;
 HEAP16[(($31)>>1)]=0;
 var $32=$1;
 var $33=(($32+14)|0);
 var $34=$33;
 HEAP16[(($34)>>1)]=0;
 var $35=$1;
 var $36=(($35+34)|0);
 HEAP16[(($36)>>1)]=0;
 var $37=$1;
 var $38=(($37+32)|0);
 HEAP16[(($38)>>1)]=0;
 var $39=$1;
 var $40=(($39+30)|0);
 HEAP16[(($40)>>1)]=0;
 var $41=$1;
 var $42=(($41+28)|0);
 var $43=$42;
 HEAP16[(($43)>>1)]=0;
 var $44=$1;
 var $45=(($44+37)|0);
 HEAP8[($45)]=0;
 var $46=$1;
 var $47=(($46+36)|0);
 HEAP8[($47)]=0;
 var $48=$1;
 var $49=(($48+44)|0);
 HEAP32[(($49)>>2)]=0;
 var $50=$1;
 var $51=(($50+40)|0);
 HEAP32[(($51)>>2)]=0;
 var $52=$1;
 var $53=(($52+48)|0);
 HEAP8[($53)]=0;
 var $54=$1;
 var $55=(($54+52)|0);
 HEAP32[(($55)>>2)]=0;
 var $56=$1;
 var $57=(($56+64)|0);
 HEAP32[(($57)>>2)]=0;
 var $58=$1;
 var $59=(($58+56)|0);
 HEAP32[(($59)>>2)]=0;
 var $60=$1;
 var $61=(($60+4)|0);
 var $62=$1;
 var $63=(($62+24)|0);
 HEAP32[(($63)>>2)]=$61;
 var $64=$1;
 var $65=(($64+6)|0);
 var $66=$65;
 var $67=(($66)|0);
 var $68=HEAP8[($67)];
 var $69=$1;
 var $70=(($69+120)|0);
 HEAP8[($70)]=$68;
 STACKTOP=sp;return;
}


function _zym_exec_ex($z80,$tscount){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1;
 var $2;
 var $3;
 var $opcode;
 var $gotDD;
 var $trueCC;
 var $disp;
 var $tstart;
 var $tmpB;
 var $tmpC;
 var $rsrc;
 var $rdst;
 var $tmpW;
 var $oldflagsq;
 var $ots;
 var $_f;
 var $_f1;
 var $_f2;
 var $_f3;
 var $_f4;
 var $aa;
 var $_f5;
 var $_f6;
 var $_f7;
 var $_f8;
 var $_f9;
 var $_f10;
 var $_f11;
 var $_f12;
 var $t;
 var $_f13;
 var $_f14;
 var $_f15;
 var $_f16;
 var $_f17;
 var $_f18;
 var $_f19;
 var $_f20;
 var $_f21;
 var $_f22;
 var $_f23;
 var $t24;
 var $_f25;
 var $_f26;
 var $_f27;
 var $_f28;
 var $_f29;
 $2=$z80;
 $3=$tscount;
 var $4=$2;
 var $5=(($4+56)|0);
 var $6=HEAP32[(($5)>>2)];
 $tstart=$6;
 $tmpW=0;
 label=2;break;
 case 2: 
 var $8=$2;
 var $9=(($8+60)|0);
 var $10=HEAP32[(($9)>>2)];
 var $11=($10|0)<0;
 if($11){label=4;break;}else{label=3;break;}
 case 3: 
 var $13=$2;
 var $14=(($13+56)|0);
 var $15=HEAP32[(($14)>>2)];
 var $16=$2;
 var $17=(($16+60)|0);
 var $18=HEAP32[(($17)>>2)];
 var $19=($15|0)<($18|0);
 if($19){label=4;break;}else{var $34=0;label=7;break;}
 case 4: 
 var $21=$3;
 var $22=($21|0)<0;
 if($22){var $32=1;label=6;break;}else{label=5;break;}
 case 5: 
 var $24=$2;
 var $25=(($24+56)|0);
 var $26=HEAP32[(($25)>>2)];
 var $27=$tstart;
 var $28=((($26)-($27))|0);
 var $29=$3;
 var $30=($28|0)<=($29|0);
 var $32=$30;label=6;break;
 case 6: 
 var $32;
 var $34=$32;label=7;break;
 case 7: 
 var $34;
 if($34){label=8;break;}else{label=834;break;}
 case 8: 
 var $36=$2;
 var $37=(($36+34)|0);
 var $38=HEAP16[(($37)>>1)];
 var $39=$2;
 var $40=(($39+32)|0);
 HEAP16[(($40)>>1)]=$38;
 label=9;break;
 case 9: 
 var $42=$2;
 var $43=(($42+116)|0);
 HEAP32[(($43)>>2)]=0;
 var $44=$2;
 var $45=(($44+108)|0);
 var $46=HEAP32[(($45)>>2)];
 var $47=($46|0)!=0;
 if($47){label=10;break;}else{label=11;break;}
 case 10: 
 var $49=$2;
 var $50=(($49+112)|0);
 HEAP32[(($50)>>2)]=1;
 var $51=$2;
 var $52=(($51+108)|0);
 HEAP32[(($52)>>2)]=0;
 var $53=$2;
 var $54=(($53+56)|0);
 var $55=HEAP32[(($54)>>2)];
 var $56=$tstart;
 var $57=((($55)-($56))|0);
 $1=$57;
 label=835;break;
 case 11: 
 var $59=$2;
 var $60=(($59+30)|0);
 var $61=HEAP16[(($60)>>1)];
 var $62=$2;
 var $63=(($62+34)|0);
 HEAP16[(($63)>>1)]=$61;
 var $64=$2;
 var $65=(($64+56)|0);
 var $66=HEAP32[(($65)>>2)];
 $ots=$66;
 label=12;break;
 case 12: 
 var $68=$2;
 var $69=(($68+80)|0);
 var $70=HEAP32[(($69)>>2)];
 var $71=($70|0)!=0;
 if($71){label=13;break;}else{label=14;break;}
 case 13: 
 var $73=$2;
 var $74=(($73+80)|0);
 var $75=HEAP32[(($74)>>2)];
 var $76=$2;
 var $77=$2;
 var $78=(($77+30)|0);
 var $79=HEAP16[(($78)>>1)];
 FUNCTION_TABLE[$75]($76,$79,4,0,32);
 label=15;break;
 case 14: 
 var $81=$2;
 var $82=(($81+56)|0);
 var $83=HEAP32[(($82)>>2)];
 var $84=((($83)+(4))|0);
 HEAP32[(($82)>>2)]=$84;
 label=15;break;
 case 15: 
 label=16;break;
 case 16: 
 var $87=$2;
 var $88=(($87+30)|0);
 var $89=HEAP16[(($88)>>1)];
 var $90=$2;
 var $91=(($90+34)|0);
 HEAP16[(($91)>>1)]=$89;
 var $92=$2;
 var $93=(($92+68)|0);
 var $94=HEAP32[(($93)>>2)];
 var $95=($94|0)!=0;
 if($95){label=17;break;}else{label=19;break;}
 case 17: 
 var $97=$2;
 var $98=(($97+56)|0);
 var $99=HEAP32[(($98)>>2)];
 var $100=$99&1;
 var $101=($100|0)!=0;
 if($101){label=18;break;}else{label=19;break;}
 case 18: 
 var $103=$2;
 var $104=(($103+56)|0);
 var $105=HEAP32[(($104)>>2)];
 var $106=((($105)+(1))|0);
 HEAP32[(($104)>>2)]=$106;
 label=19;break;
 case 19: 
 var $108=$2;
 var $109=(($108+72)|0);
 var $110=HEAP32[(($109)>>2)];
 var $111=$2;
 var $112=$2;
 var $113=(($112+30)|0);
 var $114=HEAP16[(($113)>>1)];
 var $115=FUNCTION_TABLE[$110]($111,$114,0);
 $opcode=$115;
 var $116=$2;
 var $117=(($116+30)|0);
 var $118=HEAP16[(($117)>>1)];
 var $119=$2;
 var $120=(($119+34)|0);
 HEAP16[(($120)>>1)]=$118;
 var $121=$2;
 var $122=(($121+108)|0);
 var $123=HEAP32[(($122)>>2)];
 var $124=($123|0)!=0;
 if($124){label=22;break;}else{label=20;break;}
 case 20: 
 var $126=$2;
 var $127=(($126+116)|0);
 var $128=HEAP32[(($127)>>2)];
 var $129=($128|0)!=0;
 if($129){label=22;break;}else{label=21;break;}
 case 21: 
 var $131=$2;
 var $132=(($131+30)|0);
 var $133=HEAP16[(($132)>>1)];
 var $134=$2;
 var $135=(($134+34)|0);
 HEAP16[(($135)>>1)]=$133;
 var $136=$2;
 var $137=(($136+30)|0);
 var $138=HEAP16[(($137)>>1)];
 var $139=($138&65535);
 var $140=((($139)+(1))|0);
 var $141=$140&65535;
 var $142=(($141)&65535);
 var $143=$2;
 var $144=(($143+30)|0);
 HEAP16[(($144)>>1)]=$142;
 var $145=$2;
 var $146=(($145+37)|0);
 var $147=HEAP8[($146)];
 var $148=($147&255);
 var $149=((($148)+(1))|0);
 var $150=$149&127;
 var $151=$2;
 var $152=(($151+37)|0);
 var $153=HEAP8[($152)];
 var $154=($153&255);
 var $155=$154&128;
 var $156=$150|$155;
 var $157=(($156)&255);
 var $158=$2;
 var $159=(($158+37)|0);
 HEAP8[($159)]=$157;
 label=23;break;
 case 22: 
 var $161=$ots;
 var $162=$2;
 var $163=(($162+56)|0);
 HEAP32[(($163)>>2)]=$161;
 label=9;break;
 case 23: 
 var $165=$2;
 var $166=(($165+120)|0);
 var $167=HEAP8[($166)];
 $oldflagsq=$167;
 var $168=$2;
 var $169=(($168+6)|0);
 var $170=$169;
 var $171=(($170)|0);
 var $172=HEAP8[($171)];
 var $173=$2;
 var $174=(($173+120)|0);
 HEAP8[($174)]=$172;
 var $175=$2;
 var $176=(($175+64)|0);
 HEAP32[(($176)>>2)]=0;
 $gotDD=0;
 $disp=0;
 var $177=$2;
 var $178=(($177+4)|0);
 var $179=$2;
 var $180=(($179+24)|0);
 HEAP32[(($180)>>2)]=$178;
 var $181=$2;
 var $182=(($181+52)|0);
 var $183=HEAP32[(($182)>>2)];
 var $184=($183|0)!=0;
 if($184){label=24;break;}else{label=25;break;}
 case 24: 
 var $186=$2;
 var $187=(($186+30)|0);
 var $188=HEAP16[(($187)>>1)];
 var $189=($188&65535);
 var $190=((($189)-(1))|0);
 var $191=$190&65535;
 var $192=(($191)&65535);
 var $193=$2;
 var $194=(($193+30)|0);
 HEAP16[(($194)>>1)]=$192;
 label=2;break;
 case 25: 
 var $196=$opcode;
 var $197=($196&255);
 var $198=($197|0)==221;
 if($198){label=27;break;}else{label=26;break;}
 case 26: 
 var $200=$opcode;
 var $201=($200&255);
 var $202=($201|0)==253;
 if($202){label=27;break;}else{label=46;break;}
 case 27: 
 var $204=$opcode;
 var $205=($204&255);
 var $206=($205|0)==221;
 if($206){label=28;break;}else{label=29;break;}
 case 28: 
 var $208=$2;
 var $209=(($208+10)|0);
 var $214=$209;label=30;break;
 case 29: 
 var $211=$2;
 var $212=(($211+12)|0);
 var $214=$212;label=30;break;
 case 30: 
 var $214;
 var $215=$2;
 var $216=(($215+24)|0);
 HEAP32[(($216)>>2)]=$214;
 label=31;break;
 case 31: 
 label=32;break;
 case 32: 
 var $219=$2;
 var $220=(($219+80)|0);
 var $221=HEAP32[(($220)>>2)];
 var $222=($221|0)!=0;
 if($222){label=33;break;}else{label=34;break;}
 case 33: 
 var $224=$2;
 var $225=(($224+80)|0);
 var $226=HEAP32[(($225)>>2)];
 var $227=$2;
 var $228=$2;
 var $229=(($228+30)|0);
 var $230=HEAP16[(($229)>>1)];
 FUNCTION_TABLE[$226]($227,$230,4,1,32);
 label=35;break;
 case 34: 
 var $232=$2;
 var $233=(($232+56)|0);
 var $234=HEAP32[(($233)>>2)];
 var $235=((($234)+(4))|0);
 HEAP32[(($233)>>2)]=$235;
 label=35;break;
 case 35: 
 label=36;break;
 case 36: 
 var $238=$2;
 var $239=(($238+72)|0);
 var $240=HEAP32[(($239)>>2)];
 var $241=$2;
 var $242=$2;
 var $243=(($242+30)|0);
 var $244=HEAP16[(($243)>>1)];
 var $245=FUNCTION_TABLE[$240]($241,$244,1);
 $opcode=$245;
 var $246=$2;
 var $247=(($246+30)|0);
 var $248=HEAP16[(($247)>>1)];
 var $249=($248&65535);
 var $250=((($249)+(1))|0);
 var $251=$250&65535;
 var $252=(($251)&65535);
 var $253=$2;
 var $254=(($253+30)|0);
 HEAP16[(($254)>>1)]=$252;
 var $255=$2;
 var $256=(($255+37)|0);
 var $257=HEAP8[($256)];
 var $258=($257&255);
 var $259=((($258)+(1))|0);
 var $260=$259&127;
 var $261=$2;
 var $262=(($261+37)|0);
 var $263=HEAP8[($262)];
 var $264=($263&255);
 var $265=$264&128;
 var $266=$260|$265;
 var $267=(($266)&255);
 var $268=$2;
 var $269=(($268+37)|0);
 HEAP8[($269)]=$267;
 label=37;break;
 case 37: 
 var $271=$opcode;
 var $272=($271&255);
 var $273=$272>>5;
 var $274=((8+($273<<2))|0);
 var $275=HEAP32[(($274)>>2)];
 var $276=$opcode;
 var $277=($276&255);
 var $278=$277&31;
 var $279=1<<$278;
 var $280=$275&$279;
 var $281=($280|0)!=0;
 if($281){label=38;break;}else{label=41;break;}
 case 38: 
 var $283=$2;
 var $284=$2;
 var $285=(($284+30)|0);
 var $286=HEAP16[(($285)>>1)];
 var $287=_z80_peekb_3ts_args($283,$286);
 var $288=($287&255);
 $disp=$288;
 var $289=$disp;
 var $290=($289|0)>127;
 if($290){label=39;break;}else{label=40;break;}
 case 39: 
 var $292=$disp;
 var $293=((($292)-(256))|0);
 $disp=$293;
 label=40;break;
 case 40: 
 var $295=$2;
 var $296=(($295+30)|0);
 var $297=HEAP16[(($296)>>1)];
 var $298=($297&65535);
 var $299=((($298)+(1))|0);
 var $300=$299&65535;
 var $301=(($300)&65535);
 var $302=$2;
 var $303=(($302+30)|0);
 HEAP16[(($303)>>1)]=$301;
 var $304=$2;
 var $305=(($304+24)|0);
 var $306=HEAP32[(($305)>>2)];
 var $307=$306;
 var $308=HEAP16[(($307)>>1)];
 var $309=($308&65535);
 var $310=$disp;
 var $311=((($309)+($310))|0);
 var $312=$311&65535;
 var $313=(($312)&65535);
 var $314=$2;
 var $315=(($314+28)|0);
 var $316=$315;
 HEAP16[(($316)>>1)]=$313;
 label=45;break;
 case 41: 
 var $318=$opcode;
 var $319=($318&255);
 var $320=($319|0)==221;
 if($320){label=42;break;}else{label=44;break;}
 case 42: 
 var $322=$opcode;
 var $323=($322&255);
 var $324=($323|0)==253;
 if($324){label=43;break;}else{label=44;break;}
 case 43: 
 var $326=$2;
 var $327=(($326+64)|0);
 HEAP32[(($327)>>2)]=1;
 var $328=$oldflagsq;
 var $329=$2;
 var $330=(($329+120)|0);
 HEAP8[($330)]=$328;
 label=2;break;
 case 44: 
 label=45;break;
 case 45: 
 $gotDD=1;
 label=46;break;
 case 46: 
 var $334=$opcode;
 var $335=($334&255);
 var $336=($335|0)==237;
 if($336){label=47;break;}else{label=266;break;}
 case 47: 
 var $338=$2;
 var $339=(($338+4)|0);
 var $340=$2;
 var $341=(($340+24)|0);
 HEAP32[(($341)>>2)]=$339;
 label=48;break;
 case 48: 
 label=49;break;
 case 49: 
 var $344=$2;
 var $345=(($344+80)|0);
 var $346=HEAP32[(($345)>>2)];
 var $347=($346|0)!=0;
 if($347){label=50;break;}else{label=51;break;}
 case 50: 
 var $349=$2;
 var $350=(($349+80)|0);
 var $351=HEAP32[(($350)>>2)];
 var $352=$2;
 var $353=$2;
 var $354=(($353+30)|0);
 var $355=HEAP16[(($354)>>1)];
 FUNCTION_TABLE[$351]($352,$355,4,1,32);
 label=52;break;
 case 51: 
 var $357=$2;
 var $358=(($357+56)|0);
 var $359=HEAP32[(($358)>>2)];
 var $360=((($359)+(4))|0);
 HEAP32[(($358)>>2)]=$360;
 label=52;break;
 case 52: 
 label=53;break;
 case 53: 
 var $363=$2;
 var $364=(($363+72)|0);
 var $365=HEAP32[(($364)>>2)];
 var $366=$2;
 var $367=$2;
 var $368=(($367+30)|0);
 var $369=HEAP16[(($368)>>1)];
 var $370=FUNCTION_TABLE[$365]($366,$369,1);
 $opcode=$370;
 var $371=$2;
 var $372=(($371+30)|0);
 var $373=HEAP16[(($372)>>1)];
 var $374=($373&65535);
 var $375=((($374)+(1))|0);
 var $376=$375&65535;
 var $377=(($376)&65535);
 var $378=$2;
 var $379=(($378+30)|0);
 HEAP16[(($379)>>1)]=$377;
 var $380=$2;
 var $381=(($380+37)|0);
 var $382=HEAP8[($381)];
 var $383=($382&255);
 var $384=((($383)+(1))|0);
 var $385=$384&127;
 var $386=$2;
 var $387=(($386+37)|0);
 var $388=HEAP8[($387)];
 var $389=($388&255);
 var $390=$389&128;
 var $391=$385|$390;
 var $392=(($391)&255);
 var $393=$2;
 var $394=(($393+37)|0);
 HEAP8[($394)]=$392;
 label=54;break;
 case 54: 
 var $396=$opcode;
 var $397=($396&255);
 switch(($397|0)){case 163:case 179:case 171:case 187:{ label=121;break;}case 162:case 178:case 170:case 186:{ label=122;break;}case 160:case 176:case 168:case 184:{ label=55;break;}case 161:case 177:case 169:case 185:{ label=88;break;}default:{label=164;break;}}break;
 case 55: 
 var $399=$2;
 var $400=$2;
 var $401=(($400+4)|0);
 var $402=$401;
 var $403=HEAP16[(($402)>>1)];
 var $404=_z80_peekb_3ts($399,$403);
 $tmpB=$404;
 label=56;break;
 case 56: 
 label=57;break;
 case 57: 
 var $407=$2;
 var $408=(($407+80)|0);
 var $409=HEAP32[(($408)>>2)];
 var $410=($409|0)!=0;
 if($410){label=58;break;}else{label=59;break;}
 case 58: 
 var $412=$2;
 var $413=(($412+80)|0);
 var $414=HEAP32[(($413)>>2)];
 var $415=$2;
 var $416=$2;
 var $417=(($416+2)|0);
 var $418=$417;
 var $419=HEAP16[(($418)>>1)];
 FUNCTION_TABLE[$414]($415,$419,3,3,16);
 label=60;break;
 case 59: 
 var $421=$2;
 var $422=(($421+56)|0);
 var $423=HEAP32[(($422)>>2)];
 var $424=((($423)+(3))|0);
 HEAP32[(($422)>>2)]=$424;
 label=60;break;
 case 60: 
 label=61;break;
 case 61: 
 var $427=$2;
 var $428=(($427+76)|0);
 var $429=HEAP32[(($428)>>2)];
 var $430=$2;
 var $431=$2;
 var $432=(($431+2)|0);
 var $433=$432;
 var $434=HEAP16[(($433)>>1)];
 var $435=$tmpB;
 FUNCTION_TABLE[$429]($430,$434,$435,3);
 label=62;break;
 case 62: 
 label=63;break;
 case 63: 
 var $438=$2;
 var $439=(($438+80)|0);
 var $440=HEAP32[(($439)>>2)];
 var $441=($440|0)!=0;
 if($441){label=64;break;}else{label=69;break;}
 case 64: 
 $_f=2;
 label=65;break;
 case 65: 
 var $444=$_f;
 var $445=((($444)-(1))|0);
 $_f=$445;
 var $446=($444|0)>0;
 if($446){label=66;break;}else{label=68;break;}
 case 66: 
 label=67;break;
 case 67: 
 var $449=$2;
 var $450=(($449+80)|0);
 var $451=HEAP32[(($450)>>2)];
 var $452=$2;
 var $453=$2;
 var $454=(($453+2)|0);
 var $455=$454;
 var $456=HEAP16[(($455)>>1)];
 FUNCTION_TABLE[$451]($452,$456,1,4,0);
 label=65;break;
 case 68: 
 label=70;break;
 case 69: 
 var $459=$2;
 var $460=(($459+56)|0);
 var $461=HEAP32[(($460)>>2)];
 var $462=((($461)+(2))|0);
 HEAP32[(($460)>>2)]=$462;
 label=70;break;
 case 70: 
 label=71;break;
 case 71: 
 var $465=$2;
 var $466=(($465)|0);
 var $467=$466;
 var $468=HEAP16[(($467)>>1)];
 var $469=($468&65535);
 var $470=((($469)-(1))|0);
 var $471=$470&65535;
 var $472=(($471)&65535);
 var $473=$2;
 var $474=(($473)|0);
 var $475=$474;
 HEAP16[(($475)>>1)]=$472;
 var $476=$tmpB;
 var $477=($476&255);
 var $478=$2;
 var $479=(($478+6)|0);
 var $480=$479;
 var $481=(($480+1)|0);
 var $482=HEAP8[($481)];
 var $483=($482&255);
 var $484=((($477)+($483))|0);
 var $485=$484&255;
 var $486=(($485)&255);
 $tmpB=$486;
 var $487=$2;
 var $488=(($487+120)|0);
 HEAP8[($488)]=0;
 var $489=$tmpB;
 var $490=($489&255);
 var $491=$490&8;
 var $492=$2;
 var $493=(($492+6)|0);
 var $494=$493;
 var $495=(($494)|0);
 var $496=HEAP8[($495)];
 var $497=($496&255);
 var $498=$497&193;
 var $499=$491|$498;
 var $500=$2;
 var $501=(($500)|0);
 var $502=$501;
 var $503=HEAP16[(($502)>>1)];
 var $504=($503&65535);
 var $505=($504|0)!=0;
 var $506=($505?4:0);
 var $507=$499|$506;
 var $508=$tmpB;
 var $509=($508&255);
 var $510=$509&2;
 var $511=($510|0)!=0;
 var $512=($511?32:0);
 var $513=$507|$512;
 var $514=(($513)&255);
 var $515=$2;
 var $516=(($515+6)|0);
 var $517=$516;
 var $518=(($517)|0);
 HEAP8[($518)]=$514;
 var $519=$opcode;
 var $520=($519&255);
 var $521=$520&16;
 var $522=($521|0)!=0;
 if($522){label=72;break;}else{label=84;break;}
 case 72: 
 var $524=$2;
 var $525=(($524)|0);
 var $526=$525;
 var $527=HEAP16[(($526)>>1)];
 var $528=($527&65535);
 var $529=($528|0)!=0;
 if($529){label=73;break;}else{label=83;break;}
 case 73: 
 label=74;break;
 case 74: 
 var $532=$2;
 var $533=(($532+80)|0);
 var $534=HEAP32[(($533)>>2)];
 var $535=($534|0)!=0;
 if($535){label=75;break;}else{label=80;break;}
 case 75: 
 $_f1=5;
 label=76;break;
 case 76: 
 var $538=$_f1;
 var $539=((($538)-(1))|0);
 $_f1=$539;
 var $540=($538|0)>0;
 if($540){label=77;break;}else{label=79;break;}
 case 77: 
 label=78;break;
 case 78: 
 var $543=$2;
 var $544=(($543+80)|0);
 var $545=HEAP32[(($544)>>2)];
 var $546=$2;
 var $547=$2;
 var $548=(($547+2)|0);
 var $549=$548;
 var $550=HEAP16[(($549)>>1)];
 FUNCTION_TABLE[$545]($546,$550,1,4,0);
 label=76;break;
 case 79: 
 label=81;break;
 case 80: 
 var $553=$2;
 var $554=(($553+56)|0);
 var $555=HEAP32[(($554)>>2)];
 var $556=((($555)+(5))|0);
 HEAP32[(($554)>>2)]=$556;
 label=81;break;
 case 81: 
 label=82;break;
 case 82: 
 var $559=$2;
 var $560=(($559+30)|0);
 var $561=HEAP16[(($560)>>1)];
 var $562=($561&65535);
 var $563=((($562)-(2))|0);
 var $564=$563&65535;
 var $565=(($564)&65535);
 var $566=$2;
 var $567=(($566+30)|0);
 HEAP16[(($567)>>1)]=$565;
 var $568=$2;
 var $569=(($568+30)|0);
 var $570=HEAP16[(($569)>>1)];
 var $571=($570&65535);
 var $572=((($571)+(1))|0);
 var $573=$572&65535;
 var $574=(($573)&65535);
 var $575=$2;
 var $576=(($575+28)|0);
 var $577=$576;
 HEAP16[(($577)>>1)]=$574;
 label=83;break;
 case 83: 
 label=84;break;
 case 84: 
 var $580=$opcode;
 var $581=($580&255);
 var $582=$581&8;
 var $583=($582|0)!=0;
 if($583){label=86;break;}else{label=85;break;}
 case 85: 
 var $585=$2;
 var $586=(($585+4)|0);
 var $587=$586;
 var $588=HEAP16[(($587)>>1)];
 var $589=($588&65535);
 var $590=((($589)+(1))|0);
 var $591=$590&65535;
 var $592=(($591)&65535);
 var $593=$2;
 var $594=(($593+4)|0);
 var $595=$594;
 HEAP16[(($595)>>1)]=$592;
 var $596=$2;
 var $597=(($596+2)|0);
 var $598=$597;
 var $599=HEAP16[(($598)>>1)];
 var $600=($599&65535);
 var $601=((($600)+(1))|0);
 var $602=$601&65535;
 var $603=(($602)&65535);
 var $604=$2;
 var $605=(($604+2)|0);
 var $606=$605;
 HEAP16[(($606)>>1)]=$603;
 label=87;break;
 case 86: 
 var $608=$2;
 var $609=(($608+4)|0);
 var $610=$609;
 var $611=HEAP16[(($610)>>1)];
 var $612=($611&65535);
 var $613=((($612)-(1))|0);
 var $614=$613&65535;
 var $615=(($614)&65535);
 var $616=$2;
 var $617=(($616+4)|0);
 var $618=$617;
 HEAP16[(($618)>>1)]=$615;
 var $619=$2;
 var $620=(($619+2)|0);
 var $621=$620;
 var $622=HEAP16[(($621)>>1)];
 var $623=($622&65535);
 var $624=((($623)-(1))|0);
 var $625=$624&65535;
 var $626=(($625)&65535);
 var $627=$2;
 var $628=(($627+2)|0);
 var $629=$628;
 HEAP16[(($629)>>1)]=$626;
 label=87;break;
 case 87: 
 label=265;break;
 case 88: 
 var $632=$opcode;
 var $633=($632&255);
 var $634=$633&16;
 var $635=($634|0)!=0;
 if($635){label=89;break;}else{label=92;break;}
 case 89: 
 var $637=$2;
 var $638=(($637)|0);
 var $639=$638;
 var $640=HEAP16[(($639)>>1)];
 var $641=($640&65535);
 var $642=($641|0)==1;
 if($642){label=92;break;}else{label=90;break;}
 case 90: 
 var $644=$2;
 var $645=(($644+72)|0);
 var $646=HEAP32[(($645)>>2)];
 var $647=$2;
 var $648=$2;
 var $649=(($648+4)|0);
 var $650=$649;
 var $651=HEAP16[(($650)>>1)];
 var $652=FUNCTION_TABLE[$646]($647,$651,4);
 var $653=($652&255);
 var $654=$2;
 var $655=(($654+6)|0);
 var $656=$655;
 var $657=(($656+1)|0);
 var $658=HEAP8[($657)];
 var $659=($658&255);
 var $660=($653|0)==($659|0);
 if($660){label=92;break;}else{label=91;break;}
 case 91: 
 var $662=$2;
 var $663=(($662+34)|0);
 var $664=HEAP16[(($663)>>1)];
 var $665=($664&65535);
 var $666=((($665)+(1))|0);
 var $667=$666&65535;
 var $668=(($667)&65535);
 var $669=$2;
 var $670=(($669+28)|0);
 var $671=$670;
 HEAP16[(($671)>>1)]=$668;
 label=93;break;
 case 92: 
 var $673=$2;
 var $674=(($673+28)|0);
 var $675=$674;
 var $676=HEAP16[(($675)>>1)];
 var $677=($676&65535);
 var $678=$opcode;
 var $679=($678&255);
 var $680=$679&8;
 var $681=($680|0)!=0;
 var $682=($681?-1:1);
 var $683=((($677)+($682))|0);
 var $684=$683&65535;
 var $685=(($684)&65535);
 var $686=$2;
 var $687=(($686+28)|0);
 var $688=$687;
 HEAP16[(($688)>>1)]=$685;
 label=93;break;
 case 93: 
 var $690=$2;
 var $691=$2;
 var $692=(($691+4)|0);
 var $693=$692;
 var $694=HEAP16[(($693)>>1)];
 var $695=_z80_peekb_3ts($690,$694);
 $tmpB=$695;
 label=94;break;
 case 94: 
 var $697=$2;
 var $698=(($697+80)|0);
 var $699=HEAP32[(($698)>>2)];
 var $700=($699|0)!=0;
 if($700){label=95;break;}else{label=100;break;}
 case 95: 
 $_f2=5;
 label=96;break;
 case 96: 
 var $703=$_f2;
 var $704=((($703)-(1))|0);
 $_f2=$704;
 var $705=($703|0)>0;
 if($705){label=97;break;}else{label=99;break;}
 case 97: 
 label=98;break;
 case 98: 
 var $708=$2;
 var $709=(($708+80)|0);
 var $710=HEAP32[(($709)>>2)];
 var $711=$2;
 var $712=$2;
 var $713=(($712+4)|0);
 var $714=$713;
 var $715=HEAP16[(($714)>>1)];
 FUNCTION_TABLE[$710]($711,$715,1,4,0);
 label=96;break;
 case 99: 
 label=101;break;
 case 100: 
 var $718=$2;
 var $719=(($718+56)|0);
 var $720=HEAP32[(($719)>>2)];
 var $721=((($720)+(5))|0);
 HEAP32[(($719)>>2)]=$721;
 label=101;break;
 case 101: 
 label=102;break;
 case 102: 
 var $724=$2;
 var $725=(($724)|0);
 var $726=$725;
 var $727=HEAP16[(($726)>>1)];
 var $728=($727&65535);
 var $729=((($728)-(1))|0);
 var $730=$729&65535;
 var $731=(($730)&65535);
 var $732=$2;
 var $733=(($732)|0);
 var $734=$733;
 HEAP16[(($734)>>1)]=$731;
 var $735=$2;
 var $736=(($735+120)|0);
 HEAP8[($736)]=0;
 var $737=$2;
 var $738=(($737+6)|0);
 var $739=$738;
 var $740=(($739)|0);
 var $741=HEAP8[($740)];
 var $742=($741&255);
 var $743=$742&1;
 var $744=2|$743;
 var $745=$2;
 var $746=(($745)|0);
 var $747=$746;
 var $748=HEAP16[(($747)>>1)];
 var $749=($748&65535);
 var $750=($749|0)!=0;
 var $751=($750?4:0);
 var $752=$744|$751;
 var $753=$2;
 var $754=(($753+6)|0);
 var $755=$754;
 var $756=(($755+1)|0);
 var $757=HEAP8[($756)];
 var $758=($757&255);
 var $759=$758&15;
 var $760=$tmpB;
 var $761=($760&255);
 var $762=$761&15;
 var $763=((($759)-($762))|0);
 var $764=($763|0)<0;
 var $765=($764?16:0);
 var $766=$752|$765;
 var $767=(($766)&255);
 var $768=$2;
 var $769=(($768+6)|0);
 var $770=$769;
 var $771=(($770)|0);
 HEAP8[($771)]=$767;
 var $772=$2;
 var $773=(($772+6)|0);
 var $774=$773;
 var $775=(($774+1)|0);
 var $776=HEAP8[($775)];
 var $777=($776&255);
 var $778=$tmpB;
 var $779=($778&255);
 var $780=((($777)-($779))|0);
 var $781=$780&255;
 var $782=(($781)&255);
 $tmpB=$782;
 var $783=$tmpB;
 var $784=($783&255);
 var $785=($784|0)==0;
 var $786=($785?64:0);
 var $787=$tmpB;
 var $788=($787&255);
 var $789=$788&128;
 var $790=$786|$789;
 var $791=$2;
 var $792=(($791+6)|0);
 var $793=$792;
 var $794=(($793)|0);
 var $795=HEAP8[($794)];
 var $796=($795&255);
 var $797=$796|$790;
 var $798=(($797)&255);
 HEAP8[($794)]=$798;
 var $799=$2;
 var $800=(($799+6)|0);
 var $801=$800;
 var $802=(($801)|0);
 var $803=HEAP8[($802)];
 var $804=($803&255);
 var $805=$804&16;
 var $806=($805|0)!=0;
 if($806){label=103;break;}else{label=104;break;}
 case 103: 
 var $808=$tmpB;
 var $809=($808&255);
 var $810=($809&65535);
 var $811=((($810)-(1))|0);
 var $812=$811&255;
 var $813=(($812)&255);
 $tmpB=$813;
 label=104;break;
 case 104: 
 var $815=$tmpB;
 var $816=($815&255);
 var $817=$816&8;
 var $818=$tmpB;
 var $819=($818&255);
 var $820=$819&2;
 var $821=($820|0)!=0;
 var $822=($821?32:0);
 var $823=$817|$822;
 var $824=$2;
 var $825=(($824+6)|0);
 var $826=$825;
 var $827=(($826)|0);
 var $828=HEAP8[($827)];
 var $829=($828&255);
 var $830=$829|$823;
 var $831=(($830)&255);
 HEAP8[($827)]=$831;
 var $832=$opcode;
 var $833=($832&255);
 var $834=$833&16;
 var $835=($834|0)!=0;
 if($835){label=105;break;}else{label=117;break;}
 case 105: 
 var $837=$2;
 var $838=(($837+6)|0);
 var $839=$838;
 var $840=(($839)|0);
 var $841=HEAP8[($840)];
 var $842=($841&255);
 var $843=$842&68;
 var $844=($843|0)==4;
 if($844){label=106;break;}else{label=116;break;}
 case 106: 
 label=107;break;
 case 107: 
 var $847=$2;
 var $848=(($847+80)|0);
 var $849=HEAP32[(($848)>>2)];
 var $850=($849|0)!=0;
 if($850){label=108;break;}else{label=113;break;}
 case 108: 
 $_f3=5;
 label=109;break;
 case 109: 
 var $853=$_f3;
 var $854=((($853)-(1))|0);
 $_f3=$854;
 var $855=($853|0)>0;
 if($855){label=110;break;}else{label=112;break;}
 case 110: 
 label=111;break;
 case 111: 
 var $858=$2;
 var $859=(($858+80)|0);
 var $860=HEAP32[(($859)>>2)];
 var $861=$2;
 var $862=$2;
 var $863=(($862+4)|0);
 var $864=$863;
 var $865=HEAP16[(($864)>>1)];
 FUNCTION_TABLE[$860]($861,$865,1,4,0);
 label=109;break;
 case 112: 
 label=114;break;
 case 113: 
 var $868=$2;
 var $869=(($868+56)|0);
 var $870=HEAP32[(($869)>>2)];
 var $871=((($870)+(5))|0);
 HEAP32[(($869)>>2)]=$871;
 label=114;break;
 case 114: 
 label=115;break;
 case 115: 
 var $874=$2;
 var $875=(($874+30)|0);
 var $876=HEAP16[(($875)>>1)];
 var $877=($876&65535);
 var $878=((($877)-(2))|0);
 var $879=$878&65535;
 var $880=(($879)&65535);
 var $881=$2;
 var $882=(($881+30)|0);
 HEAP16[(($882)>>1)]=$880;
 label=116;break;
 case 116: 
 label=117;break;
 case 117: 
 var $885=$opcode;
 var $886=($885&255);
 var $887=$886&8;
 var $888=($887|0)!=0;
 if($888){label=118;break;}else{label=119;break;}
 case 118: 
 var $890=$2;
 var $891=(($890+4)|0);
 var $892=$891;
 var $893=HEAP16[(($892)>>1)];
 var $894=($893&65535);
 var $895=((($894)-(1))|0);
 var $896=$895&65535;
 var $897=(($896)&65535);
 var $898=$2;
 var $899=(($898+4)|0);
 var $900=$899;
 HEAP16[(($900)>>1)]=$897;
 label=120;break;
 case 119: 
 var $902=$2;
 var $903=(($902+4)|0);
 var $904=$903;
 var $905=HEAP16[(($904)>>1)];
 var $906=($905&65535);
 var $907=((($906)+(1))|0);
 var $908=$907&65535;
 var $909=(($908)&65535);
 var $910=$2;
 var $911=(($910+4)|0);
 var $912=$911;
 HEAP16[(($912)>>1)]=$909;
 label=120;break;
 case 120: 
 label=265;break;
 case 121: 
 var $915=$2;
 var $916=(($915)|0);
 var $917=$916;
 var $918=(($917+1)|0);
 var $919=HEAP8[($918)];
 var $920=($919&255);
 var $921=((($920)-(1))|0);
 var $922=$921&255;
 var $923=(($922)&255);
 var $924=$2;
 var $925=(($924)|0);
 var $926=$925;
 var $927=(($926+1)|0);
 HEAP8[($927)]=$923;
 label=122;break;
 case 122: 
 var $929=$2;
 var $930=(($929)|0);
 var $931=$930;
 var $932=HEAP16[(($931)>>1)];
 var $933=($932&65535);
 var $934=$opcode;
 var $935=($934&255);
 var $936=$935&8;
 var $937=($936|0)!=0;
 var $938=($937?-1:1);
 var $939=((($933)+($938))|0);
 var $940=$939&65535;
 var $941=(($940)&65535);
 var $942=$2;
 var $943=(($942+28)|0);
 var $944=$943;
 HEAP16[(($944)>>1)]=$941;
 label=123;break;
 case 123: 
 var $946=$2;
 var $947=(($946+80)|0);
 var $948=HEAP32[(($947)>>2)];
 var $949=($948|0)!=0;
 if($949){label=124;break;}else{label=129;break;}
 case 124: 
 $_f4=1;
 label=125;break;
 case 125: 
 var $952=$_f4;
 var $953=((($952)-(1))|0);
 $_f4=$953;
 var $954=($952|0)>0;
 if($954){label=126;break;}else{label=128;break;}
 case 126: 
 label=127;break;
 case 127: 
 var $957=$2;
 var $958=(($957+80)|0);
 var $959=HEAP32[(($958)>>2)];
 var $960=$2;
 var $961=$2;
 var $962=(($961+36)|0);
 var $963=HEAP8[($962)];
 var $964=($963&255);
 var $965=($964&65535);
 var $966=$965<<8;
 var $967=$2;
 var $968=(($967+37)|0);
 var $969=HEAP8[($968)];
 var $970=($969&255);
 var $971=$966|$970;
 var $972=(($971)&65535);
 FUNCTION_TABLE[$959]($960,$972,1,4,0);
 label=125;break;
 case 128: 
 label=130;break;
 case 129: 
 var $975=$2;
 var $976=(($975+56)|0);
 var $977=HEAP32[(($976)>>2)];
 var $978=((($977)+(1))|0);
 HEAP32[(($976)>>2)]=$978;
 label=130;break;
 case 130: 
 label=131;break;
 case 131: 
 var $981=$opcode;
 var $982=($981&255);
 var $983=$982&1;
 var $984=($983|0)!=0;
 if($984){label=132;break;}else{label=133;break;}
 case 132: 
 var $986=$2;
 var $987=$2;
 var $988=(($987+4)|0);
 var $989=$988;
 var $990=HEAP16[(($989)>>1)];
 var $991=_z80_peekb_3ts($986,$990);
 $tmpB=$991;
 var $992=$2;
 var $993=$2;
 var $994=(($993)|0);
 var $995=$994;
 var $996=HEAP16[(($995)>>1)];
 var $997=$tmpB;
 _z80_port_write($992,$996,$997);
 var $998=$2;
 var $999=(($998+4)|0);
 var $1000=$999;
 var $1001=HEAP16[(($1000)>>1)];
 var $1002=($1001&65535);
 var $1003=$opcode;
 var $1004=($1003&255);
 var $1005=$1004&8;
 var $1006=($1005|0)!=0;
 var $1007=($1006?-1:1);
 var $1008=((($1002)+($1007))|0);
 var $1009=$1008&65535;
 var $1010=(($1009)&65535);
 $tmpW=$1010;
 var $1011=$tmpB;
 var $1012=($1011&255);
 var $1013=$tmpW;
 var $1014=($1013&65535);
 var $1015=((($1012)+($1014))|0);
 var $1016=$1015&255;
 var $1017=(($1016)&255);
 $tmpC=$1017;
 label=144;break;
 case 133: 
 var $1019=$2;
 var $1020=$2;
 var $1021=(($1020)|0);
 var $1022=$1021;
 var $1023=HEAP16[(($1022)>>1)];
 var $1024=_z80_port_read($1019,$1023);
 $tmpB=$1024;
 label=134;break;
 case 134: 
 label=135;break;
 case 135: 
 var $1027=$2;
 var $1028=(($1027+80)|0);
 var $1029=HEAP32[(($1028)>>2)];
 var $1030=($1029|0)!=0;
 if($1030){label=136;break;}else{label=137;break;}
 case 136: 
 var $1032=$2;
 var $1033=(($1032+80)|0);
 var $1034=HEAP32[(($1033)>>2)];
 var $1035=$2;
 var $1036=$2;
 var $1037=(($1036+4)|0);
 var $1038=$1037;
 var $1039=HEAP16[(($1038)>>1)];
 FUNCTION_TABLE[$1034]($1035,$1039,3,3,16);
 label=138;break;
 case 137: 
 var $1041=$2;
 var $1042=(($1041+56)|0);
 var $1043=HEAP32[(($1042)>>2)];
 var $1044=((($1043)+(3))|0);
 HEAP32[(($1042)>>2)]=$1044;
 label=138;break;
 case 138: 
 label=139;break;
 case 139: 
 var $1047=$2;
 var $1048=(($1047+76)|0);
 var $1049=HEAP32[(($1048)>>2)];
 var $1050=$2;
 var $1051=$2;
 var $1052=(($1051+4)|0);
 var $1053=$1052;
 var $1054=HEAP16[(($1053)>>1)];
 var $1055=$tmpB;
 FUNCTION_TABLE[$1049]($1050,$1054,$1055,3);
 label=140;break;
 case 140: 
 var $1057=$2;
 var $1058=(($1057)|0);
 var $1059=$1058;
 var $1060=(($1059+1)|0);
 var $1061=HEAP8[($1060)];
 var $1062=($1061&255);
 var $1063=((($1062)-(1))|0);
 var $1064=$1063&255;
 var $1065=(($1064)&255);
 var $1066=$2;
 var $1067=(($1066)|0);
 var $1068=$1067;
 var $1069=(($1068+1)|0);
 HEAP8[($1069)]=$1065;
 var $1070=$opcode;
 var $1071=($1070&255);
 var $1072=$1071&8;
 var $1073=($1072|0)!=0;
 if($1073){label=141;break;}else{label=142;break;}
 case 141: 
 var $1075=$tmpB;
 var $1076=($1075&255);
 var $1077=$2;
 var $1078=(($1077)|0);
 var $1079=$1078;
 var $1080=(($1079)|0);
 var $1081=HEAP8[($1080)];
 var $1082=($1081&255);
 var $1083=((($1076)+($1082))|0);
 var $1084=((($1083)-(1))|0);
 var $1085=$1084&255;
 var $1086=(($1085)&255);
 $tmpC=$1086;
 label=143;break;
 case 142: 
 var $1088=$tmpB;
 var $1089=($1088&255);
 var $1090=$2;
 var $1091=(($1090)|0);
 var $1092=$1091;
 var $1093=(($1092)|0);
 var $1094=HEAP8[($1093)];
 var $1095=($1094&255);
 var $1096=((($1089)+($1095))|0);
 var $1097=((($1096)+(1))|0);
 var $1098=$1097&255;
 var $1099=(($1098)&255);
 $tmpC=$1099;
 label=143;break;
 case 143: 
 label=144;break;
 case 144: 
 var $1102=$2;
 var $1103=(($1102+120)|0);
 HEAP8[($1103)]=0;
 var $1104=$tmpB;
 var $1105=($1104&255);
 var $1106=$1105&128;
 var $1107=($1106|0)!=0;
 var $1108=($1107?2:0);
 var $1109=$tmpC;
 var $1110=($1109&255);
 var $1111=$tmpB;
 var $1112=($1111&255);
 var $1113=($1110|0)<($1112|0);
 var $1114=($1113?17:0);
 var $1115=$1108|$1114;
 var $1116=$tmpC;
 var $1117=($1116&255);
 var $1118=$1117&7;
 var $1119=$2;
 var $1120=(($1119)|0);
 var $1121=$1120;
 var $1122=(($1121+1)|0);
 var $1123=HEAP8[($1122)];
 var $1124=($1123&255);
 var $1125=$1118^$1124;
 var $1126=((13808+$1125)|0);
 var $1127=HEAP8[($1126)];
 var $1128=($1127&255);
 var $1129=$1115|$1128;
 var $1130=$2;
 var $1131=(($1130)|0);
 var $1132=$1131;
 var $1133=(($1132+1)|0);
 var $1134=HEAP8[($1133)];
 var $1135=($1134&255);
 var $1136=((13552+$1135)|0);
 var $1137=HEAP8[($1136)];
 var $1138=($1137&255);
 var $1139=$1129|$1138;
 var $1140=(($1139)&255);
 var $1141=$2;
 var $1142=(($1141+6)|0);
 var $1143=$1142;
 var $1144=(($1143)|0);
 HEAP8[($1144)]=$1140;
 var $1145=$opcode;
 var $1146=($1145&255);
 var $1147=$1146&16;
 var $1148=($1147|0)!=0;
 if($1148){label=145;break;}else{label=160;break;}
 case 145: 
 var $1150=$2;
 var $1151=(($1150)|0);
 var $1152=$1151;
 var $1153=(($1152+1)|0);
 var $1154=HEAP8[($1153)];
 var $1155=($1154&255);
 var $1156=($1155|0)!=0;
 if($1156){label=146;break;}else{label=159;break;}
 case 146: 
 var $1158=$opcode;
 var $1159=($1158&255);
 var $1160=$1159&1;
 var $1161=($1160|0)!=0;
 if($1161){label=147;break;}else{label=148;break;}
 case 147: 
 var $1163=$2;
 var $1164=(($1163)|0);
 var $1165=$1164;
 var $1166=HEAP16[(($1165)>>1)];
 var $1167=($1166&65535);
 var $1175=$1167;label=149;break;
 case 148: 
 var $1169=$2;
 var $1170=(($1169+4)|0);
 var $1171=$1170;
 var $1172=HEAP16[(($1171)>>1)];
 var $1173=($1172&65535);
 var $1175=$1173;label=149;break;
 case 149: 
 var $1175;
 var $1176=(($1175)&65535);
 $aa=$1176;
 label=150;break;
 case 150: 
 var $1178=$2;
 var $1179=(($1178+80)|0);
 var $1180=HEAP32[(($1179)>>2)];
 var $1181=($1180|0)!=0;
 if($1181){label=151;break;}else{label=156;break;}
 case 151: 
 $_f5=5;
 label=152;break;
 case 152: 
 var $1184=$_f5;
 var $1185=((($1184)-(1))|0);
 $_f5=$1185;
 var $1186=($1184|0)>0;
 if($1186){label=153;break;}else{label=155;break;}
 case 153: 
 label=154;break;
 case 154: 
 var $1189=$2;
 var $1190=(($1189+80)|0);
 var $1191=HEAP32[(($1190)>>2)];
 var $1192=$2;
 var $1193=$aa;
 FUNCTION_TABLE[$1191]($1192,$1193,1,4,0);
 label=152;break;
 case 155: 
 label=157;break;
 case 156: 
 var $1196=$2;
 var $1197=(($1196+56)|0);
 var $1198=HEAP32[(($1197)>>2)];
 var $1199=((($1198)+(5))|0);
 HEAP32[(($1197)>>2)]=$1199;
 label=157;break;
 case 157: 
 label=158;break;
 case 158: 
 var $1202=$2;
 var $1203=(($1202+30)|0);
 var $1204=HEAP16[(($1203)>>1)];
 var $1205=($1204&65535);
 var $1206=((($1205)-(2))|0);
 var $1207=$1206&65535;
 var $1208=(($1207)&65535);
 var $1209=$2;
 var $1210=(($1209+30)|0);
 HEAP16[(($1210)>>1)]=$1208;
 label=159;break;
 case 159: 
 label=160;break;
 case 160: 
 var $1213=$opcode;
 var $1214=($1213&255);
 var $1215=$1214&8;
 var $1216=($1215|0)!=0;
 if($1216){label=161;break;}else{label=162;break;}
 case 161: 
 var $1218=$2;
 var $1219=(($1218+4)|0);
 var $1220=$1219;
 var $1221=HEAP16[(($1220)>>1)];
 var $1222=($1221&65535);
 var $1223=((($1222)-(1))|0);
 var $1224=$1223&65535;
 var $1225=(($1224)&65535);
 var $1226=$2;
 var $1227=(($1226+4)|0);
 var $1228=$1227;
 HEAP16[(($1228)>>1)]=$1225;
 label=163;break;
 case 162: 
 var $1230=$2;
 var $1231=(($1230+4)|0);
 var $1232=$1231;
 var $1233=HEAP16[(($1232)>>1)];
 var $1234=($1233&65535);
 var $1235=((($1234)+(1))|0);
 var $1236=$1235&65535;
 var $1237=(($1236)&65535);
 var $1238=$2;
 var $1239=(($1238+4)|0);
 var $1240=$1239;
 HEAP16[(($1240)>>1)]=$1237;
 label=163;break;
 case 163: 
 label=265;break;
 case 164: 
 var $1243=$opcode;
 var $1244=($1243&255);
 var $1245=$1244&192;
 var $1246=($1245|0)==64;
 if($1246){label=165;break;}else{label=260;break;}
 case 165: 
 var $1248=$opcode;
 var $1249=($1248&255);
 var $1250=$1249&7;
 switch(($1250|0)){case 0:{ label=166;break;}case 1:{ label=175;break;}case 2:{ label=185;break;}case 3:{ label=203;break;}case 4:{ label=217;break;}case 5:{ label=218;break;}case 6:{ label=228;break;}case 7:{ label=233;break;}default:{label=259;break;}}break;
 case 166: 
 var $1252=$2;
 var $1253=(($1252)|0);
 var $1254=$1253;
 var $1255=HEAP16[(($1254)>>1)];
 var $1256=($1255&65535);
 var $1257=((($1256)+(1))|0);
 var $1258=$1257&65535;
 var $1259=(($1258)&65535);
 var $1260=$2;
 var $1261=(($1260+28)|0);
 var $1262=$1261;
 HEAP16[(($1262)>>1)]=$1259;
 var $1263=$2;
 var $1264=$2;
 var $1265=(($1264)|0);
 var $1266=$1265;
 var $1267=HEAP16[(($1266)>>1)];
 var $1268=_z80_port_read($1263,$1267);
 $tmpB=$1268;
 var $1269=$2;
 var $1270=(($1269+120)|0);
 HEAP8[($1270)]=0;
 var $1271=$tmpB;
 var $1272=($1271&255);
 var $1273=((13296+$1272)|0);
 var $1274=HEAP8[($1273)];
 var $1275=($1274&255);
 var $1276=$2;
 var $1277=(($1276+6)|0);
 var $1278=$1277;
 var $1279=(($1278)|0);
 var $1280=HEAP8[($1279)];
 var $1281=($1280&255);
 var $1282=$1281&1;
 var $1283=$1275|$1282;
 var $1284=(($1283)&255);
 var $1285=$2;
 var $1286=(($1285+6)|0);
 var $1287=$1286;
 var $1288=(($1287)|0);
 HEAP8[($1288)]=$1284;
 var $1289=$opcode;
 var $1290=($1289&255);
 var $1291=$1290>>3;
 var $1292=$1291&7;
 switch(($1292|0)){case 0:{ label=167;break;}case 1:{ label=168;break;}case 2:{ label=169;break;}case 3:{ label=170;break;}case 4:{ label=171;break;}case 5:{ label=172;break;}case 7:{ label=173;break;}default:{label=174;break;}}break;
 case 167: 
 var $1294=$tmpB;
 var $1295=$2;
 var $1296=(($1295)|0);
 var $1297=$1296;
 var $1298=(($1297+1)|0);
 HEAP8[($1298)]=$1294;
 label=174;break;
 case 168: 
 var $1300=$tmpB;
 var $1301=$2;
 var $1302=(($1301)|0);
 var $1303=$1302;
 var $1304=(($1303)|0);
 HEAP8[($1304)]=$1300;
 label=174;break;
 case 169: 
 var $1306=$tmpB;
 var $1307=$2;
 var $1308=(($1307+2)|0);
 var $1309=$1308;
 var $1310=(($1309+1)|0);
 HEAP8[($1310)]=$1306;
 label=174;break;
 case 170: 
 var $1312=$tmpB;
 var $1313=$2;
 var $1314=(($1313+2)|0);
 var $1315=$1314;
 var $1316=(($1315)|0);
 HEAP8[($1316)]=$1312;
 label=174;break;
 case 171: 
 var $1318=$tmpB;
 var $1319=$2;
 var $1320=(($1319+4)|0);
 var $1321=$1320;
 var $1322=(($1321+1)|0);
 HEAP8[($1322)]=$1318;
 label=174;break;
 case 172: 
 var $1324=$tmpB;
 var $1325=$2;
 var $1326=(($1325+4)|0);
 var $1327=$1326;
 var $1328=(($1327)|0);
 HEAP8[($1328)]=$1324;
 label=174;break;
 case 173: 
 var $1330=$tmpB;
 var $1331=$2;
 var $1332=(($1331+6)|0);
 var $1333=$1332;
 var $1334=(($1333+1)|0);
 HEAP8[($1334)]=$1330;
 label=174;break;
 case 174: 
 label=259;break;
 case 175: 
 var $1337=$2;
 var $1338=(($1337)|0);
 var $1339=$1338;
 var $1340=HEAP16[(($1339)>>1)];
 var $1341=($1340&65535);
 var $1342=((($1341)+(1))|0);
 var $1343=$1342&65535;
 var $1344=(($1343)&65535);
 var $1345=$2;
 var $1346=(($1345+28)|0);
 var $1347=$1346;
 HEAP16[(($1347)>>1)]=$1344;
 var $1348=$opcode;
 var $1349=($1348&255);
 var $1350=$1349>>3;
 var $1351=$1350&7;
 switch(($1351|0)){case 0:{ label=176;break;}case 1:{ label=177;break;}case 2:{ label=178;break;}case 3:{ label=179;break;}case 4:{ label=180;break;}case 5:{ label=181;break;}case 7:{ label=182;break;}default:{label=183;break;}}break;
 case 176: 
 var $1353=$2;
 var $1354=(($1353)|0);
 var $1355=$1354;
 var $1356=(($1355+1)|0);
 var $1357=HEAP8[($1356)];
 $tmpB=$1357;
 label=184;break;
 case 177: 
 var $1359=$2;
 var $1360=(($1359)|0);
 var $1361=$1360;
 var $1362=(($1361)|0);
 var $1363=HEAP8[($1362)];
 $tmpB=$1363;
 label=184;break;
 case 178: 
 var $1365=$2;
 var $1366=(($1365+2)|0);
 var $1367=$1366;
 var $1368=(($1367+1)|0);
 var $1369=HEAP8[($1368)];
 $tmpB=$1369;
 label=184;break;
 case 179: 
 var $1371=$2;
 var $1372=(($1371+2)|0);
 var $1373=$1372;
 var $1374=(($1373)|0);
 var $1375=HEAP8[($1374)];
 $tmpB=$1375;
 label=184;break;
 case 180: 
 var $1377=$2;
 var $1378=(($1377+4)|0);
 var $1379=$1378;
 var $1380=(($1379+1)|0);
 var $1381=HEAP8[($1380)];
 $tmpB=$1381;
 label=184;break;
 case 181: 
 var $1383=$2;
 var $1384=(($1383+4)|0);
 var $1385=$1384;
 var $1386=(($1385)|0);
 var $1387=HEAP8[($1386)];
 $tmpB=$1387;
 label=184;break;
 case 182: 
 var $1389=$2;
 var $1390=(($1389+6)|0);
 var $1391=$1390;
 var $1392=(($1391+1)|0);
 var $1393=HEAP8[($1392)];
 $tmpB=$1393;
 label=184;break;
 case 183: 
 $tmpB=0;
 label=184;break;
 case 184: 
 var $1396=$2;
 var $1397=$2;
 var $1398=(($1397)|0);
 var $1399=$1398;
 var $1400=HEAP16[(($1399)>>1)];
 var $1401=$tmpB;
 _z80_port_write($1396,$1400,$1401);
 label=259;break;
 case 185: 
 label=186;break;
 case 186: 
 var $1404=$2;
 var $1405=(($1404+80)|0);
 var $1406=HEAP32[(($1405)>>2)];
 var $1407=($1406|0)!=0;
 if($1407){label=187;break;}else{label=192;break;}
 case 187: 
 $_f6=7;
 label=188;break;
 case 188: 
 var $1410=$_f6;
 var $1411=((($1410)-(1))|0);
 $_f6=$1411;
 var $1412=($1410|0)>0;
 if($1412){label=189;break;}else{label=191;break;}
 case 189: 
 label=190;break;
 case 190: 
 var $1415=$2;
 var $1416=(($1415+80)|0);
 var $1417=HEAP32[(($1416)>>2)];
 var $1418=$2;
 var $1419=$2;
 var $1420=(($1419+36)|0);
 var $1421=HEAP8[($1420)];
 var $1422=($1421&255);
 var $1423=($1422&65535);
 var $1424=$1423<<8;
 var $1425=$2;
 var $1426=(($1425+37)|0);
 var $1427=HEAP8[($1426)];
 var $1428=($1427&255);
 var $1429=$1424|$1428;
 var $1430=(($1429)&65535);
 FUNCTION_TABLE[$1417]($1418,$1430,1,4,0);
 label=188;break;
 case 191: 
 label=193;break;
 case 192: 
 var $1433=$2;
 var $1434=(($1433+56)|0);
 var $1435=HEAP32[(($1434)>>2)];
 var $1436=((($1435)+(7))|0);
 HEAP32[(($1434)>>2)]=$1436;
 label=193;break;
 case 193: 
 label=194;break;
 case 194: 
 var $1439=$opcode;
 var $1440=($1439&255);
 var $1441=$1440>>4;
 var $1442=$1441&3;
 if(($1442|0)==0){ label=195;break;}else if(($1442|0)==1){ label=196;break;}else if(($1442|0)==2){ label=197;break;}else{label=198;break;}
 case 195: 
 var $1444=$2;
 var $1445=(($1444)|0);
 var $1446=$1445;
 var $1447=HEAP16[(($1446)>>1)];
 $tmpW=$1447;
 label=199;break;
 case 196: 
 var $1449=$2;
 var $1450=(($1449+2)|0);
 var $1451=$1450;
 var $1452=HEAP16[(($1451)>>1)];
 $tmpW=$1452;
 label=199;break;
 case 197: 
 var $1454=$2;
 var $1455=(($1454+4)|0);
 var $1456=$1455;
 var $1457=HEAP16[(($1456)>>1)];
 $tmpW=$1457;
 label=199;break;
 case 198: 
 var $1459=$2;
 var $1460=(($1459+8)|0);
 var $1461=$1460;
 var $1462=HEAP16[(($1461)>>1)];
 $tmpW=$1462;
 label=199;break;
 case 199: 
 var $1464=$opcode;
 var $1465=($1464&255);
 var $1466=$1465&8;
 var $1467=($1466|0)!=0;
 if($1467){label=200;break;}else{label=201;break;}
 case 200: 
 var $1469=$2;
 var $1470=$tmpW;
 var $1471=$2;
 var $1472=(($1471+4)|0);
 var $1473=$1472;
 var $1474=HEAP16[(($1473)>>1)];
 var $1475=_ZYM_ADC_DD($1469,$1470,$1474);
 var $1476=($1475&65535);
 var $1487=$1476;label=202;break;
 case 201: 
 var $1478=$2;
 var $1479=$tmpW;
 var $1480=$2;
 var $1481=(($1480+4)|0);
 var $1482=$1481;
 var $1483=HEAP16[(($1482)>>1)];
 var $1484=_ZYM_SBC_DD($1478,$1479,$1483);
 var $1485=($1484&65535);
 var $1487=$1485;label=202;break;
 case 202: 
 var $1487;
 var $1488=(($1487)&65535);
 var $1489=$2;
 var $1490=(($1489+4)|0);
 var $1491=$1490;
 HEAP16[(($1491)>>1)]=$1488;
 label=259;break;
 case 203: 
 var $1493=$2;
 var $1494=_z80_getpcw($1493,0);
 $tmpW=$1494;
 var $1495=$tmpW;
 var $1496=($1495&65535);
 var $1497=((($1496)+(1))|0);
 var $1498=$1497&65535;
 var $1499=(($1498)&65535);
 var $1500=$2;
 var $1501=(($1500+28)|0);
 var $1502=$1501;
 HEAP16[(($1502)>>1)]=$1499;
 var $1503=$opcode;
 var $1504=($1503&255);
 var $1505=$1504&8;
 var $1506=($1505|0)!=0;
 if($1506){label=204;break;}else{label=210;break;}
 case 204: 
 var $1508=$opcode;
 var $1509=($1508&255);
 var $1510=$1509>>4;
 var $1511=$1510&3;
 if(($1511|0)==0){ label=205;break;}else if(($1511|0)==1){ label=206;break;}else if(($1511|0)==2){ label=207;break;}else if(($1511|0)==3){ label=208;break;}else{label=209;break;}
 case 205: 
 var $1513=$2;
 var $1514=$tmpW;
 var $1515=_z80_peekw_6ts($1513,$1514);
 var $1516=$2;
 var $1517=(($1516)|0);
 var $1518=$1517;
 HEAP16[(($1518)>>1)]=$1515;
 label=209;break;
 case 206: 
 var $1520=$2;
 var $1521=$tmpW;
 var $1522=_z80_peekw_6ts($1520,$1521);
 var $1523=$2;
 var $1524=(($1523+2)|0);
 var $1525=$1524;
 HEAP16[(($1525)>>1)]=$1522;
 label=209;break;
 case 207: 
 var $1527=$2;
 var $1528=$tmpW;
 var $1529=_z80_peekw_6ts($1527,$1528);
 var $1530=$2;
 var $1531=(($1530+4)|0);
 var $1532=$1531;
 HEAP16[(($1532)>>1)]=$1529;
 label=209;break;
 case 208: 
 var $1534=$2;
 var $1535=$tmpW;
 var $1536=_z80_peekw_6ts($1534,$1535);
 var $1537=$2;
 var $1538=(($1537+8)|0);
 var $1539=$1538;
 HEAP16[(($1539)>>1)]=$1536;
 label=209;break;
 case 209: 
 label=216;break;
 case 210: 
 var $1542=$opcode;
 var $1543=($1542&255);
 var $1544=$1543>>4;
 var $1545=$1544&3;
 if(($1545|0)==0){ label=211;break;}else if(($1545|0)==1){ label=212;break;}else if(($1545|0)==2){ label=213;break;}else if(($1545|0)==3){ label=214;break;}else{label=215;break;}
 case 211: 
 var $1547=$2;
 var $1548=$tmpW;
 var $1549=$2;
 var $1550=(($1549)|0);
 var $1551=$1550;
 var $1552=HEAP16[(($1551)>>1)];
 _z80_pokew_6ts($1547,$1548,$1552);
 label=215;break;
 case 212: 
 var $1554=$2;
 var $1555=$tmpW;
 var $1556=$2;
 var $1557=(($1556+2)|0);
 var $1558=$1557;
 var $1559=HEAP16[(($1558)>>1)];
 _z80_pokew_6ts($1554,$1555,$1559);
 label=215;break;
 case 213: 
 var $1561=$2;
 var $1562=$tmpW;
 var $1563=$2;
 var $1564=(($1563+4)|0);
 var $1565=$1564;
 var $1566=HEAP16[(($1565)>>1)];
 _z80_pokew_6ts($1561,$1562,$1566);
 label=215;break;
 case 214: 
 var $1568=$2;
 var $1569=$tmpW;
 var $1570=$2;
 var $1571=(($1570+8)|0);
 var $1572=$1571;
 var $1573=HEAP16[(($1572)>>1)];
 _z80_pokew_6ts($1568,$1569,$1573);
 label=215;break;
 case 215: 
 label=216;break;
 case 216: 
 label=259;break;
 case 217: 
 var $1577=$2;
 var $1578=(($1577+6)|0);
 var $1579=$1578;
 var $1580=(($1579+1)|0);
 var $1581=HEAP8[($1580)];
 $tmpB=$1581;
 var $1582=$2;
 var $1583=(($1582+6)|0);
 var $1584=$1583;
 var $1585=(($1584+1)|0);
 HEAP8[($1585)]=0;
 var $1586=$2;
 var $1587=$tmpB;
 _ZYM_SUB_A($1586,$1587);
 label=259;break;
 case 218: 
 var $1589=$2;
 var $1590=(($1589+44)|0);
 var $1591=HEAP32[(($1590)>>2)];
 var $1592=$2;
 var $1593=(($1592+40)|0);
 HEAP32[(($1593)>>2)]=$1591;
 var $1594=$2;
 var $1595=_z80_pop_6ts($1594);
 var $1596=$2;
 var $1597=(($1596+30)|0);
 HEAP16[(($1597)>>1)]=$1595;
 var $1598=$2;
 var $1599=(($1598+28)|0);
 var $1600=$1599;
 HEAP16[(($1600)>>1)]=$1595;
 var $1601=$opcode;
 var $1602=($1601&255);
 var $1603=$1602&8;
 var $1604=($1603|0)!=0;
 if($1604){label=219;break;}else{label=223;break;}
 case 219: 
 var $1606=$2;
 var $1607=(($1606+96)|0);
 var $1608=HEAP32[(($1607)>>2)];
 var $1609=($1608|0)!=0;
 if($1609){label=220;break;}else{label=222;break;}
 case 220: 
 var $1611=$2;
 var $1612=(($1611+96)|0);
 var $1613=HEAP32[(($1612)>>2)];
 var $1614=$2;
 var $1615=$opcode;
 var $1616=FUNCTION_TABLE[$1613]($1614,$1615);
 var $1617=($1616|0)!=0;
 if($1617){label=221;break;}else{label=222;break;}
 case 221: 
 var $1619=$2;
 var $1620=(($1619+56)|0);
 var $1621=HEAP32[(($1620)>>2)];
 var $1622=$tstart;
 var $1623=((($1621)-($1622))|0);
 $1=$1623;
 label=835;break;
 case 222: 
 label=227;break;
 case 223: 
 var $1626=$2;
 var $1627=(($1626+100)|0);
 var $1628=HEAP32[(($1627)>>2)];
 var $1629=($1628|0)!=0;
 if($1629){label=224;break;}else{label=226;break;}
 case 224: 
 var $1631=$2;
 var $1632=(($1631+100)|0);
 var $1633=HEAP32[(($1632)>>2)];
 var $1634=$2;
 var $1635=$opcode;
 var $1636=FUNCTION_TABLE[$1633]($1634,$1635);
 var $1637=($1636|0)!=0;
 if($1637){label=225;break;}else{label=226;break;}
 case 225: 
 var $1639=$2;
 var $1640=(($1639+56)|0);
 var $1641=HEAP32[(($1640)>>2)];
 var $1642=$tstart;
 var $1643=((($1641)-($1642))|0);
 $1=$1643;
 label=835;break;
 case 226: 
 label=227;break;
 case 227: 
 label=259;break;
 case 228: 
 var $1647=$opcode;
 var $1648=($1647&255);
 if(($1648|0)==86|($1648|0)==118){ label=229;break;}else if(($1648|0)==94|($1648|0)==126){ label=230;break;}else{label=231;break;}
 case 229: 
 var $1650=$2;
 var $1651=(($1650+48)|0);
 HEAP8[($1651)]=1;
 label=232;break;
 case 230: 
 var $1653=$2;
 var $1654=(($1653+48)|0);
 HEAP8[($1654)]=2;
 label=232;break;
 case 231: 
 var $1656=$2;
 var $1657=(($1656+48)|0);
 HEAP8[($1657)]=0;
 label=232;break;
 case 232: 
 label=259;break;
 case 233: 
 var $1660=$opcode;
 var $1661=($1660&255);
 switch(($1661|0)){case 71:{ label=234;break;}case 79:{ label=244;break;}case 87:{ label=254;break;}case 95:{ label=255;break;}case 103:{ label=256;break;}case 111:{ label=257;break;}default:{label=258;break;}}break;
 case 234: 
 label=235;break;
 case 235: 
 var $1664=$2;
 var $1665=(($1664+80)|0);
 var $1666=HEAP32[(($1665)>>2)];
 var $1667=($1666|0)!=0;
 if($1667){label=236;break;}else{label=241;break;}
 case 236: 
 $_f7=1;
 label=237;break;
 case 237: 
 var $1670=$_f7;
 var $1671=((($1670)-(1))|0);
 $_f7=$1671;
 var $1672=($1670|0)>0;
 if($1672){label=238;break;}else{label=240;break;}
 case 238: 
 label=239;break;
 case 239: 
 var $1675=$2;
 var $1676=(($1675+80)|0);
 var $1677=HEAP32[(($1676)>>2)];
 var $1678=$2;
 var $1679=$2;
 var $1680=(($1679+36)|0);
 var $1681=HEAP8[($1680)];
 var $1682=($1681&255);
 var $1683=($1682&65535);
 var $1684=$1683<<8;
 var $1685=$2;
 var $1686=(($1685+37)|0);
 var $1687=HEAP8[($1686)];
 var $1688=($1687&255);
 var $1689=$1684|$1688;
 var $1690=(($1689)&65535);
 FUNCTION_TABLE[$1677]($1678,$1690,1,4,0);
 label=237;break;
 case 240: 
 label=242;break;
 case 241: 
 var $1693=$2;
 var $1694=(($1693+56)|0);
 var $1695=HEAP32[(($1694)>>2)];
 var $1696=((($1695)+(1))|0);
 HEAP32[(($1694)>>2)]=$1696;
 label=242;break;
 case 242: 
 label=243;break;
 case 243: 
 var $1699=$2;
 var $1700=(($1699+6)|0);
 var $1701=$1700;
 var $1702=(($1701+1)|0);
 var $1703=HEAP8[($1702)];
 var $1704=$2;
 var $1705=(($1704+36)|0);
 HEAP8[($1705)]=$1703;
 label=258;break;
 case 244: 
 label=245;break;
 case 245: 
 var $1708=$2;
 var $1709=(($1708+80)|0);
 var $1710=HEAP32[(($1709)>>2)];
 var $1711=($1710|0)!=0;
 if($1711){label=246;break;}else{label=251;break;}
 case 246: 
 $_f8=1;
 label=247;break;
 case 247: 
 var $1714=$_f8;
 var $1715=((($1714)-(1))|0);
 $_f8=$1715;
 var $1716=($1714|0)>0;
 if($1716){label=248;break;}else{label=250;break;}
 case 248: 
 label=249;break;
 case 249: 
 var $1719=$2;
 var $1720=(($1719+80)|0);
 var $1721=HEAP32[(($1720)>>2)];
 var $1722=$2;
 var $1723=$2;
 var $1724=(($1723+36)|0);
 var $1725=HEAP8[($1724)];
 var $1726=($1725&255);
 var $1727=($1726&65535);
 var $1728=$1727<<8;
 var $1729=$2;
 var $1730=(($1729+37)|0);
 var $1731=HEAP8[($1730)];
 var $1732=($1731&255);
 var $1733=$1728|$1732;
 var $1734=(($1733)&65535);
 FUNCTION_TABLE[$1721]($1722,$1734,1,4,0);
 label=247;break;
 case 250: 
 label=252;break;
 case 251: 
 var $1737=$2;
 var $1738=(($1737+56)|0);
 var $1739=HEAP32[(($1738)>>2)];
 var $1740=((($1739)+(1))|0);
 HEAP32[(($1738)>>2)]=$1740;
 label=252;break;
 case 252: 
 label=253;break;
 case 253: 
 var $1743=$2;
 var $1744=(($1743+6)|0);
 var $1745=$1744;
 var $1746=(($1745+1)|0);
 var $1747=HEAP8[($1746)];
 var $1748=$2;
 var $1749=(($1748+37)|0);
 HEAP8[($1749)]=$1747;
 label=258;break;
 case 254: 
 var $1751=$2;
 var $1752=$2;
 var $1753=(($1752+36)|0);
 var $1754=HEAP8[($1753)];
 _ZYM_LD_A_IR($1751,$1754);
 label=258;break;
 case 255: 
 var $1756=$2;
 var $1757=$2;
 var $1758=(($1757+37)|0);
 var $1759=HEAP8[($1758)];
 _ZYM_LD_A_IR($1756,$1759);
 label=258;break;
 case 256: 
 var $1761=$2;
 _ZYM_RRD_A($1761);
 label=258;break;
 case 257: 
 var $1763=$2;
 _ZYM_RLD_A($1763);
 label=258;break;
 case 258: 
 label=259;break;
 case 259: 
 label=264;break;
 case 260: 
 var $1767=$2;
 var $1768=(($1767+104)|0);
 var $1769=HEAP32[(($1768)>>2)];
 var $1770=($1769|0)!=0;
 if($1770){label=261;break;}else{label=263;break;}
 case 261: 
 var $1772=$2;
 var $1773=(($1772+104)|0);
 var $1774=HEAP32[(($1773)>>2)];
 var $1775=$2;
 var $1776=$opcode;
 var $1777=FUNCTION_TABLE[$1774]($1775,$1776);
 var $1778=($1777|0)!=0;
 if($1778){label=262;break;}else{label=263;break;}
 case 262: 
 var $1780=$2;
 var $1781=(($1780+56)|0);
 var $1782=HEAP32[(($1781)>>2)];
 var $1783=$tstart;
 var $1784=((($1782)-($1783))|0);
 $1=$1784;
 label=835;break;
 case 263: 
 label=264;break;
 case 264: 
 label=265;break;
 case 265: 
 label=2;break;
 case 266: 
 var $1789=$opcode;
 var $1790=($1789&255);
 var $1791=($1790|0)==203;
 if($1791){label=267;break;}else{label=363;break;}
 case 267: 
 var $1793=$gotDD;
 var $1794=($1793|0)!=0;
 if($1794){label=276;break;}else{label=268;break;}
 case 268: 
 label=269;break;
 case 269: 
 label=270;break;
 case 270: 
 var $1798=$2;
 var $1799=(($1798+80)|0);
 var $1800=HEAP32[(($1799)>>2)];
 var $1801=($1800|0)!=0;
 if($1801){label=271;break;}else{label=272;break;}
 case 271: 
 var $1803=$2;
 var $1804=(($1803+80)|0);
 var $1805=HEAP32[(($1804)>>2)];
 var $1806=$2;
 var $1807=$2;
 var $1808=(($1807+30)|0);
 var $1809=HEAP16[(($1808)>>1)];
 FUNCTION_TABLE[$1805]($1806,$1809,4,1,32);
 label=273;break;
 case 272: 
 var $1811=$2;
 var $1812=(($1811+56)|0);
 var $1813=HEAP32[(($1812)>>2)];
 var $1814=((($1813)+(4))|0);
 HEAP32[(($1812)>>2)]=$1814;
 label=273;break;
 case 273: 
 label=274;break;
 case 274: 
 var $1817=$2;
 var $1818=(($1817+72)|0);
 var $1819=HEAP32[(($1818)>>2)];
 var $1820=$2;
 var $1821=$2;
 var $1822=(($1821+30)|0);
 var $1823=HEAP16[(($1822)>>1)];
 var $1824=FUNCTION_TABLE[$1819]($1820,$1823,1);
 $opcode=$1824;
 var $1825=$2;
 var $1826=(($1825+30)|0);
 var $1827=HEAP16[(($1826)>>1)];
 var $1828=($1827&65535);
 var $1829=((($1828)+(1))|0);
 var $1830=$1829&65535;
 var $1831=(($1830)&65535);
 var $1832=$2;
 var $1833=(($1832+30)|0);
 HEAP16[(($1833)>>1)]=$1831;
 var $1834=$2;
 var $1835=(($1834+37)|0);
 var $1836=HEAP8[($1835)];
 var $1837=($1836&255);
 var $1838=((($1837)+(1))|0);
 var $1839=$1838&127;
 var $1840=$2;
 var $1841=(($1840+37)|0);
 var $1842=HEAP8[($1841)];
 var $1843=($1842&255);
 var $1844=$1843&128;
 var $1845=$1839|$1844;
 var $1846=(($1845)&255);
 var $1847=$2;
 var $1848=(($1847+37)|0);
 HEAP8[($1848)]=$1846;
 label=275;break;
 case 275: 
 label=291;break;
 case 276: 
 label=277;break;
 case 277: 
 var $1852=$2;
 var $1853=(($1852+80)|0);
 var $1854=HEAP32[(($1853)>>2)];
 var $1855=($1854|0)!=0;
 if($1855){label=278;break;}else{label=279;break;}
 case 278: 
 var $1857=$2;
 var $1858=(($1857+80)|0);
 var $1859=HEAP32[(($1858)>>2)];
 var $1860=$2;
 var $1861=$2;
 var $1862=(($1861+30)|0);
 var $1863=HEAP16[(($1862)>>1)];
 FUNCTION_TABLE[$1859]($1860,$1863,3,1,32);
 label=280;break;
 case 279: 
 var $1865=$2;
 var $1866=(($1865+56)|0);
 var $1867=HEAP32[(($1866)>>2)];
 var $1868=((($1867)+(3))|0);
 HEAP32[(($1866)>>2)]=$1868;
 label=280;break;
 case 280: 
 label=281;break;
 case 281: 
 var $1871=$2;
 var $1872=(($1871+72)|0);
 var $1873=HEAP32[(($1872)>>2)];
 var $1874=$2;
 var $1875=$2;
 var $1876=(($1875+30)|0);
 var $1877=HEAP16[(($1876)>>1)];
 var $1878=FUNCTION_TABLE[$1873]($1874,$1877,1);
 $opcode=$1878;
 label=282;break;
 case 282: 
 var $1880=$2;
 var $1881=(($1880+80)|0);
 var $1882=HEAP32[(($1881)>>2)];
 var $1883=($1882|0)!=0;
 if($1883){label=283;break;}else{label=288;break;}
 case 283: 
 $_f9=2;
 label=284;break;
 case 284: 
 var $1886=$_f9;
 var $1887=((($1886)-(1))|0);
 $_f9=$1887;
 var $1888=($1886|0)>0;
 if($1888){label=285;break;}else{label=287;break;}
 case 285: 
 label=286;break;
 case 286: 
 var $1891=$2;
 var $1892=(($1891+80)|0);
 var $1893=HEAP32[(($1892)>>2)];
 var $1894=$2;
 var $1895=$2;
 var $1896=(($1895+30)|0);
 var $1897=HEAP16[(($1896)>>1)];
 FUNCTION_TABLE[$1893]($1894,$1897,1,4,0);
 label=284;break;
 case 287: 
 label=289;break;
 case 288: 
 var $1900=$2;
 var $1901=(($1900+56)|0);
 var $1902=HEAP32[(($1901)>>2)];
 var $1903=((($1902)+(2))|0);
 HEAP32[(($1901)>>2)]=$1903;
 label=289;break;
 case 289: 
 label=290;break;
 case 290: 
 var $1906=$2;
 var $1907=(($1906+30)|0);
 var $1908=HEAP16[(($1907)>>1)];
 var $1909=($1908&65535);
 var $1910=((($1909)+(1))|0);
 var $1911=$1910&65535;
 var $1912=(($1911)&65535);
 var $1913=$2;
 var $1914=(($1913+30)|0);
 HEAP16[(($1914)>>1)]=$1912;
 label=291;break;
 case 291: 
 var $1916=$gotDD;
 var $1917=($1916|0)!=0;
 if($1917){label=292;break;}else{label=302;break;}
 case 292: 
 var $1919=$2;
 var $1920=(($1919+24)|0);
 var $1921=HEAP32[(($1920)>>2)];
 var $1922=$1921;
 var $1923=HEAP16[(($1922)>>1)];
 var $1924=($1923&65535);
 var $1925=$disp;
 var $1926=((($1924)+($1925))|0);
 var $1927=$1926&65535;
 var $1928=(($1927)&65535);
 $tmpW=$1928;
 var $1929=$2;
 var $1930=$tmpW;
 var $1931=_z80_peekb_3ts($1929,$1930);
 $tmpB=$1931;
 label=293;break;
 case 293: 
 var $1933=$2;
 var $1934=(($1933+80)|0);
 var $1935=HEAP32[(($1934)>>2)];
 var $1936=($1935|0)!=0;
 if($1936){label=294;break;}else{label=299;break;}
 case 294: 
 $_f10=1;
 label=295;break;
 case 295: 
 var $1939=$_f10;
 var $1940=((($1939)-(1))|0);
 $_f10=$1940;
 var $1941=($1939|0)>0;
 if($1941){label=296;break;}else{label=298;break;}
 case 296: 
 label=297;break;
 case 297: 
 var $1944=$2;
 var $1945=(($1944+80)|0);
 var $1946=HEAP32[(($1945)>>2)];
 var $1947=$2;
 var $1948=$tmpW;
 FUNCTION_TABLE[$1946]($1947,$1948,1,4,0);
 label=295;break;
 case 298: 
 label=300;break;
 case 299: 
 var $1951=$2;
 var $1952=(($1951+56)|0);
 var $1953=HEAP32[(($1952)>>2)];
 var $1954=((($1953)+(1))|0);
 HEAP32[(($1952)>>2)]=$1954;
 label=300;break;
 case 300: 
 label=301;break;
 case 301: 
 label=317;break;
 case 302: 
 var $1958=$opcode;
 var $1959=($1958&255);
 var $1960=$1959&7;
 switch(($1960|0)){case 0:{ label=303;break;}case 1:{ label=304;break;}case 2:{ label=305;break;}case 3:{ label=306;break;}case 4:{ label=307;break;}case 5:{ label=308;break;}case 6:{ label=309;break;}case 7:{ label=315;break;}default:{label=316;break;}}break;
 case 303: 
 var $1962=$2;
 var $1963=(($1962)|0);
 var $1964=$1963;
 var $1965=(($1964+1)|0);
 var $1966=HEAP8[($1965)];
 $tmpB=$1966;
 label=316;break;
 case 304: 
 var $1968=$2;
 var $1969=(($1968)|0);
 var $1970=$1969;
 var $1971=(($1970)|0);
 var $1972=HEAP8[($1971)];
 $tmpB=$1972;
 label=316;break;
 case 305: 
 var $1974=$2;
 var $1975=(($1974+2)|0);
 var $1976=$1975;
 var $1977=(($1976+1)|0);
 var $1978=HEAP8[($1977)];
 $tmpB=$1978;
 label=316;break;
 case 306: 
 var $1980=$2;
 var $1981=(($1980+2)|0);
 var $1982=$1981;
 var $1983=(($1982)|0);
 var $1984=HEAP8[($1983)];
 $tmpB=$1984;
 label=316;break;
 case 307: 
 var $1986=$2;
 var $1987=(($1986+4)|0);
 var $1988=$1987;
 var $1989=(($1988+1)|0);
 var $1990=HEAP8[($1989)];
 $tmpB=$1990;
 label=316;break;
 case 308: 
 var $1992=$2;
 var $1993=(($1992+4)|0);
 var $1994=$1993;
 var $1995=(($1994)|0);
 var $1996=HEAP8[($1995)];
 $tmpB=$1996;
 label=316;break;
 case 309: 
 var $1998=$2;
 var $1999=$2;
 var $2000=(($1999+4)|0);
 var $2001=$2000;
 var $2002=HEAP16[(($2001)>>1)];
 var $2003=_z80_peekb_3ts($1998,$2002);
 $tmpB=$2003;
 label=310;break;
 case 310: 
 var $2005=$2;
 var $2006=(($2005+80)|0);
 var $2007=HEAP32[(($2006)>>2)];
 var $2008=($2007|0)!=0;
 if($2008){label=311;break;}else{label=312;break;}
 case 311: 
 var $2010=$2;
 var $2011=(($2010+80)|0);
 var $2012=HEAP32[(($2011)>>2)];
 var $2013=$2;
 var $2014=$2;
 var $2015=(($2014+4)|0);
 var $2016=$2015;
 var $2017=HEAP16[(($2016)>>1)];
 FUNCTION_TABLE[$2012]($2013,$2017,1,3,32);
 label=313;break;
 case 312: 
 var $2019=$2;
 var $2020=(($2019+56)|0);
 var $2021=HEAP32[(($2020)>>2)];
 var $2022=((($2021)+(1))|0);
 HEAP32[(($2020)>>2)]=$2022;
 label=313;break;
 case 313: 
 label=314;break;
 case 314: 
 label=316;break;
 case 315: 
 var $2026=$2;
 var $2027=(($2026+6)|0);
 var $2028=$2027;
 var $2029=(($2028+1)|0);
 var $2030=HEAP8[($2029)];
 $tmpB=$2030;
 label=316;break;
 case 316: 
 label=317;break;
 case 317: 
 var $2033=$opcode;
 var $2034=($2033&255);
 var $2035=$2034>>3;
 var $2036=$2035&31;
 switch(($2036|0)){case 0:{ label=318;break;}case 1:{ label=319;break;}case 2:{ label=320;break;}case 3:{ label=321;break;}case 4:{ label=322;break;}case 5:{ label=323;break;}case 6:{ label=324;break;}case 7:{ label=325;break;}default:{label=326;break;}}break;
 case 318: 
 var $2038=$2;
 var $2039=$tmpB;
 var $2040=_ZYM_RLC($2038,$2039);
 $tmpB=$2040;
 label=333;break;
 case 319: 
 var $2042=$2;
 var $2043=$tmpB;
 var $2044=_ZYM_RRC($2042,$2043);
 $tmpB=$2044;
 label=333;break;
 case 320: 
 var $2046=$2;
 var $2047=$tmpB;
 var $2048=_ZYM_RL($2046,$2047);
 $tmpB=$2048;
 label=333;break;
 case 321: 
 var $2050=$2;
 var $2051=$tmpB;
 var $2052=_ZYM_RR($2050,$2051);
 $tmpB=$2052;
 label=333;break;
 case 322: 
 var $2054=$2;
 var $2055=$tmpB;
 var $2056=_ZYM_SLA($2054,$2055);
 $tmpB=$2056;
 label=333;break;
 case 323: 
 var $2058=$2;
 var $2059=$tmpB;
 var $2060=_ZYM_SRA($2058,$2059);
 $tmpB=$2060;
 label=333;break;
 case 324: 
 var $2062=$2;
 var $2063=$tmpB;
 var $2064=_ZYM_SLL($2062,$2063);
 $tmpB=$2064;
 label=333;break;
 case 325: 
 var $2066=$2;
 var $2067=$tmpB;
 var $2068=_ZYM_SLR($2066,$2067);
 $tmpB=$2068;
 label=333;break;
 case 326: 
 var $2070=$opcode;
 var $2071=($2070&255);
 var $2072=$2071>>6;
 var $2073=$2072&3;
 if(($2073|0)==1){ label=327;break;}else if(($2073|0)==2){ label=330;break;}else if(($2073|0)==3){ label=331;break;}else{label=332;break;}
 case 327: 
 var $2075=$2;
 var $2076=$opcode;
 var $2077=($2076&255);
 var $2078=$2077>>3;
 var $2079=$2078&7;
 var $2080=(($2079)&255);
 var $2081=$tmpB;
 var $2082=$gotDD;
 var $2083=($2082|0)!=0;
 if($2083){var $2090=1;label=329;break;}else{label=328;break;}
 case 328: 
 var $2085=$opcode;
 var $2086=($2085&255);
 var $2087=$2086&7;
 var $2088=($2087|0)==6;
 var $2090=$2088;label=329;break;
 case 329: 
 var $2090;
 var $2091=($2090&1);
 _ZYM_BIT($2075,$2080,$2081,$2091);
 label=332;break;
 case 330: 
 var $2093=$opcode;
 var $2094=($2093&255);
 var $2095=$2094>>3;
 var $2096=$2095&7;
 var $2097=1<<$2096;
 var $2098=$2097^-1;
 var $2099=$tmpB;
 var $2100=($2099&255);
 var $2101=$2100&$2098;
 var $2102=(($2101)&255);
 $tmpB=$2102;
 label=332;break;
 case 331: 
 var $2104=$opcode;
 var $2105=($2104&255);
 var $2106=$2105>>3;
 var $2107=$2106&7;
 var $2108=1<<$2107;
 var $2109=$tmpB;
 var $2110=($2109&255);
 var $2111=$2110|$2108;
 var $2112=(($2111)&255);
 $tmpB=$2112;
 label=332;break;
 case 332: 
 label=333;break;
 case 333: 
 var $2115=$opcode;
 var $2116=($2115&255);
 var $2117=$2116&192;
 var $2118=($2117|0)!=64;
 if($2118){label=334;break;}else{label=362;break;}
 case 334: 
 var $2120=$gotDD;
 var $2121=($2120|0)!=0;
 if($2121){label=335;break;}else{label=345;break;}
 case 335: 
 var $2123=$opcode;
 var $2124=($2123&255);
 var $2125=$2124&7;
 var $2126=($2125|0)!=6;
 if($2126){label=336;break;}else{label=344;break;}
 case 336: 
 label=337;break;
 case 337: 
 label=338;break;
 case 338: 
 var $2130=$2;
 var $2131=(($2130+80)|0);
 var $2132=HEAP32[(($2131)>>2)];
 var $2133=($2132|0)!=0;
 if($2133){label=339;break;}else{label=340;break;}
 case 339: 
 var $2135=$2;
 var $2136=(($2135+80)|0);
 var $2137=HEAP32[(($2136)>>2)];
 var $2138=$2;
 var $2139=$tmpW;
 FUNCTION_TABLE[$2137]($2138,$2139,3,3,16);
 label=341;break;
 case 340: 
 var $2141=$2;
 var $2142=(($2141+56)|0);
 var $2143=HEAP32[(($2142)>>2)];
 var $2144=((($2143)+(3))|0);
 HEAP32[(($2142)>>2)]=$2144;
 label=341;break;
 case 341: 
 label=342;break;
 case 342: 
 var $2147=$2;
 var $2148=(($2147+76)|0);
 var $2149=HEAP32[(($2148)>>2)];
 var $2150=$2;
 var $2151=$tmpW;
 var $2152=$tmpB;
 FUNCTION_TABLE[$2149]($2150,$2151,$2152,3);
 label=343;break;
 case 343: 
 label=344;break;
 case 344: 
 label=345;break;
 case 345: 
 var $2156=$opcode;
 var $2157=($2156&255);
 var $2158=$2157&7;
 switch(($2158|0)){case 0:{ label=346;break;}case 1:{ label=347;break;}case 2:{ label=348;break;}case 3:{ label=349;break;}case 4:{ label=350;break;}case 5:{ label=351;break;}case 6:{ label=352;break;}case 7:{ label=360;break;}default:{label=361;break;}}break;
 case 346: 
 var $2160=$tmpB;
 var $2161=$2;
 var $2162=(($2161)|0);
 var $2163=$2162;
 var $2164=(($2163+1)|0);
 HEAP8[($2164)]=$2160;
 label=361;break;
 case 347: 
 var $2166=$tmpB;
 var $2167=$2;
 var $2168=(($2167)|0);
 var $2169=$2168;
 var $2170=(($2169)|0);
 HEAP8[($2170)]=$2166;
 label=361;break;
 case 348: 
 var $2172=$tmpB;
 var $2173=$2;
 var $2174=(($2173+2)|0);
 var $2175=$2174;
 var $2176=(($2175+1)|0);
 HEAP8[($2176)]=$2172;
 label=361;break;
 case 349: 
 var $2178=$tmpB;
 var $2179=$2;
 var $2180=(($2179+2)|0);
 var $2181=$2180;
 var $2182=(($2181)|0);
 HEAP8[($2182)]=$2178;
 label=361;break;
 case 350: 
 var $2184=$tmpB;
 var $2185=$2;
 var $2186=(($2185+4)|0);
 var $2187=$2186;
 var $2188=(($2187+1)|0);
 HEAP8[($2188)]=$2184;
 label=361;break;
 case 351: 
 var $2190=$tmpB;
 var $2191=$2;
 var $2192=(($2191+4)|0);
 var $2193=$2192;
 var $2194=(($2193)|0);
 HEAP8[($2194)]=$2190;
 label=361;break;
 case 352: 
 label=353;break;
 case 353: 
 label=354;break;
 case 354: 
 var $2198=$2;
 var $2199=(($2198+80)|0);
 var $2200=HEAP32[(($2199)>>2)];
 var $2201=($2200|0)!=0;
 if($2201){label=355;break;}else{label=356;break;}
 case 355: 
 var $2203=$2;
 var $2204=(($2203+80)|0);
 var $2205=HEAP32[(($2204)>>2)];
 var $2206=$2;
 var $2207=$2;
 var $2208=(($2207+24)|0);
 var $2209=HEAP32[(($2208)>>2)];
 var $2210=$2209;
 var $2211=HEAP16[(($2210)>>1)];
 var $2212=($2211&65535);
 var $2213=$disp;
 var $2214=((($2212)+($2213))|0);
 var $2215=$2214&65535;
 var $2216=(($2215)&65535);
 FUNCTION_TABLE[$2205]($2206,$2216,3,3,16);
 label=357;break;
 case 356: 
 var $2218=$2;
 var $2219=(($2218+56)|0);
 var $2220=HEAP32[(($2219)>>2)];
 var $2221=((($2220)+(3))|0);
 HEAP32[(($2219)>>2)]=$2221;
 label=357;break;
 case 357: 
 label=358;break;
 case 358: 
 var $2224=$2;
 var $2225=(($2224+76)|0);
 var $2226=HEAP32[(($2225)>>2)];
 var $2227=$2;
 var $2228=$2;
 var $2229=(($2228+24)|0);
 var $2230=HEAP32[(($2229)>>2)];
 var $2231=$2230;
 var $2232=HEAP16[(($2231)>>1)];
 var $2233=($2232&65535);
 var $2234=$disp;
 var $2235=((($2233)+($2234))|0);
 var $2236=$2235&65535;
 var $2237=(($2236)&65535);
 var $2238=$tmpB;
 FUNCTION_TABLE[$2226]($2227,$2237,$2238,3);
 label=359;break;
 case 359: 
 label=361;break;
 case 360: 
 var $2241=$tmpB;
 var $2242=$2;
 var $2243=(($2242+6)|0);
 var $2244=$2243;
 var $2245=(($2244+1)|0);
 HEAP8[($2245)]=$2241;
 label=361;break;
 case 361: 
 label=362;break;
 case 362: 
 label=2;break;
 case 363: 
 var $2249=$opcode;
 var $2250=($2249&255);
 var $2251=$2250&192;
 if(($2251|0)==0){ label=364;break;}else if(($2251|0)==64){ label=598;break;}else if(($2251|0)==128){ label=664;break;}else if(($2251|0)==192){ label=694;break;}else{label=833;break;}
 case 364: 
 var $2253=$opcode;
 var $2254=($2253&255);
 var $2255=$2254&7;
 switch(($2255|0)){case 0:{ label=365;break;}case 1:{ label=408;break;}case 2:{ label=431;break;}case 3:{ label=462;break;}case 4:{ label=485;break;}case 5:{ label=522;break;}case 6:{ label=559;break;}case 7:{ label=587;break;}default:{label=597;break;}}break;
 case 365: 
 var $2257=$opcode;
 var $2258=($2257&255);
 var $2259=$2258&48;
 var $2260=($2259|0)!=0;
 if($2260){label=366;break;}else{label=402;break;}
 case 366: 
 var $2262=$opcode;
 var $2263=($2262&255);
 var $2264=$2263&32;
 var $2265=($2264|0)!=0;
 if($2265){label=367;break;}else{label=374;break;}
 case 367: 
 var $2267=$opcode;
 var $2268=($2267&255);
 var $2269=$2268>>3;
 var $2270=$2269&3;
 if(($2270|0)==0){ label=368;break;}else if(($2270|0)==1){ label=369;break;}else if(($2270|0)==2){ label=370;break;}else if(($2270|0)==3){ label=371;break;}else{label=372;break;}
 case 368: 
 var $2272=$2;
 var $2273=(($2272+6)|0);
 var $2274=$2273;
 var $2275=(($2274)|0);
 var $2276=HEAP8[($2275)];
 var $2277=($2276&255);
 var $2278=$2277&64;
 var $2279=($2278|0)==0;
 var $2280=($2279&1);
 $trueCC=$2280;
 label=373;break;
 case 369: 
 var $2282=$2;
 var $2283=(($2282+6)|0);
 var $2284=$2283;
 var $2285=(($2284)|0);
 var $2286=HEAP8[($2285)];
 var $2287=($2286&255);
 var $2288=$2287&64;
 var $2289=($2288|0)!=0;
 var $2290=($2289&1);
 $trueCC=$2290;
 label=373;break;
 case 370: 
 var $2292=$2;
 var $2293=(($2292+6)|0);
 var $2294=$2293;
 var $2295=(($2294)|0);
 var $2296=HEAP8[($2295)];
 var $2297=($2296&255);
 var $2298=$2297&1;
 var $2299=($2298|0)==0;
 var $2300=($2299&1);
 $trueCC=$2300;
 label=373;break;
 case 371: 
 var $2302=$2;
 var $2303=(($2302+6)|0);
 var $2304=$2303;
 var $2305=(($2304)|0);
 var $2306=HEAP8[($2305)];
 var $2307=($2306&255);
 var $2308=$2307&1;
 var $2309=($2308|0)!=0;
 var $2310=($2309&1);
 $trueCC=$2310;
 label=373;break;
 case 372: 
 $trueCC=0;
 label=373;break;
 case 373: 
 label=387;break;
 case 374: 
 var $2314=$opcode;
 var $2315=($2314&255);
 var $2316=$2315&8;
 var $2317=($2316|0)==0;
 if($2317){label=375;break;}else{label=385;break;}
 case 375: 
 label=376;break;
 case 376: 
 var $2320=$2;
 var $2321=(($2320+80)|0);
 var $2322=HEAP32[(($2321)>>2)];
 var $2323=($2322|0)!=0;
 if($2323){label=377;break;}else{label=382;break;}
 case 377: 
 $_f11=1;
 label=378;break;
 case 378: 
 var $2326=$_f11;
 var $2327=((($2326)-(1))|0);
 $_f11=$2327;
 var $2328=($2326|0)>0;
 if($2328){label=379;break;}else{label=381;break;}
 case 379: 
 label=380;break;
 case 380: 
 var $2331=$2;
 var $2332=(($2331+80)|0);
 var $2333=HEAP32[(($2332)>>2)];
 var $2334=$2;
 var $2335=$2;
 var $2336=(($2335+36)|0);
 var $2337=HEAP8[($2336)];
 var $2338=($2337&255);
 var $2339=($2338&65535);
 var $2340=$2339<<8;
 var $2341=$2;
 var $2342=(($2341+37)|0);
 var $2343=HEAP8[($2342)];
 var $2344=($2343&255);
 var $2345=$2340|$2344;
 var $2346=(($2345)&65535);
 FUNCTION_TABLE[$2333]($2334,$2346,1,4,0);
 label=378;break;
 case 381: 
 label=383;break;
 case 382: 
 var $2349=$2;
 var $2350=(($2349+56)|0);
 var $2351=HEAP32[(($2350)>>2)];
 var $2352=((($2351)+(1))|0);
 HEAP32[(($2350)>>2)]=$2352;
 label=383;break;
 case 383: 
 label=384;break;
 case 384: 
 var $2355=$2;
 var $2356=(($2355)|0);
 var $2357=$2356;
 var $2358=(($2357+1)|0);
 var $2359=HEAP8[($2358)];
 var $2360=($2359&255);
 var $2361=((($2360)-(1))|0);
 var $2362=$2361&255;
 var $2363=(($2362)&255);
 var $2364=$2;
 var $2365=(($2364)|0);
 var $2366=$2365;
 var $2367=(($2366+1)|0);
 HEAP8[($2367)]=$2363;
 var $2368=$2;
 var $2369=(($2368)|0);
 var $2370=$2369;
 var $2371=(($2370+1)|0);
 var $2372=HEAP8[($2371)];
 var $2373=($2372&255);
 var $2374=($2373|0)!=0;
 var $2375=($2374&1);
 $trueCC=$2375;
 label=386;break;
 case 385: 
 $trueCC=1;
 label=386;break;
 case 386: 
 label=387;break;
 case 387: 
 var $2379=$2;
 var $2380=$2;
 var $2381=(($2380+30)|0);
 var $2382=HEAP16[(($2381)>>1)];
 var $2383=_z80_peekb_3ts_args($2379,$2382);
 var $2384=($2383&255);
 $disp=$2384;
 var $2385=$trueCC;
 var $2386=($2385|0)!=0;
 if($2386){label=388;break;}else{label=400;break;}
 case 388: 
 var $2388=$disp;
 var $2389=($2388|0)>127;
 if($2389){label=389;break;}else{label=390;break;}
 case 389: 
 var $2391=$disp;
 var $2392=((($2391)-(256))|0);
 $disp=$2392;
 label=390;break;
 case 390: 
 label=391;break;
 case 391: 
 var $2395=$2;
 var $2396=(($2395+80)|0);
 var $2397=HEAP32[(($2396)>>2)];
 var $2398=($2397|0)!=0;
 if($2398){label=392;break;}else{label=397;break;}
 case 392: 
 $_f12=5;
 label=393;break;
 case 393: 
 var $2401=$_f12;
 var $2402=((($2401)-(1))|0);
 $_f12=$2402;
 var $2403=($2401|0)>0;
 if($2403){label=394;break;}else{label=396;break;}
 case 394: 
 label=395;break;
 case 395: 
 var $2406=$2;
 var $2407=(($2406+80)|0);
 var $2408=HEAP32[(($2407)>>2)];
 var $2409=$2;
 var $2410=$2;
 var $2411=(($2410+30)|0);
 var $2412=HEAP16[(($2411)>>1)];
 FUNCTION_TABLE[$2408]($2409,$2412,1,4,0);
 label=393;break;
 case 396: 
 label=398;break;
 case 397: 
 var $2415=$2;
 var $2416=(($2415+56)|0);
 var $2417=HEAP32[(($2416)>>2)];
 var $2418=((($2417)+(5))|0);
 HEAP32[(($2416)>>2)]=$2418;
 label=398;break;
 case 398: 
 label=399;break;
 case 399: 
 var $2421=$2;
 var $2422=(($2421+30)|0);
 var $2423=HEAP16[(($2422)>>1)];
 var $2424=($2423&65535);
 var $2425=((($2424)+(1))|0);
 var $2426=$2425&65535;
 var $2427=(($2426)&65535);
 var $2428=$2;
 var $2429=(($2428+30)|0);
 HEAP16[(($2429)>>1)]=$2427;
 var $2430=$2;
 var $2431=(($2430+30)|0);
 var $2432=HEAP16[(($2431)>>1)];
 var $2433=($2432&65535);
 var $2434=$disp;
 var $2435=((($2433)+($2434))|0);
 var $2436=$2435&65535;
 var $2437=(($2436)&65535);
 var $2438=$2;
 var $2439=(($2438+30)|0);
 HEAP16[(($2439)>>1)]=$2437;
 var $2440=$2;
 var $2441=(($2440+30)|0);
 var $2442=HEAP16[(($2441)>>1)];
 var $2443=$2;
 var $2444=(($2443+28)|0);
 var $2445=$2444;
 HEAP16[(($2445)>>1)]=$2442;
 label=401;break;
 case 400: 
 var $2447=$2;
 var $2448=(($2447+30)|0);
 var $2449=HEAP16[(($2448)>>1)];
 var $2450=($2449&65535);
 var $2451=((($2450)+(1))|0);
 var $2452=$2451&65535;
 var $2453=(($2452)&65535);
 var $2454=$2;
 var $2455=(($2454+30)|0);
 HEAP16[(($2455)>>1)]=$2453;
 label=401;break;
 case 401: 
 label=407;break;
 case 402: 
 var $2458=$opcode;
 var $2459=($2458&255);
 var $2460=($2459|0)!=0;
 if($2460){label=403;break;}else{label=406;break;}
 case 403: 
 label=404;break;
 case 404: 
 var $2463=$2;
 var $2464=(($2463+6)|0);
 var $2465=$2464;
 var $2466=HEAP16[(($2465)>>1)];
 $t=$2466;
 var $2467=$2;
 var $2468=(($2467+20)|0);
 var $2469=$2468;
 var $2470=HEAP16[(($2469)>>1)];
 var $2471=$2;
 var $2472=(($2471+6)|0);
 var $2473=$2472;
 HEAP16[(($2473)>>1)]=$2470;
 var $2474=$t;
 var $2475=$2;
 var $2476=(($2475+20)|0);
 var $2477=$2476;
 HEAP16[(($2477)>>1)]=$2474;
 var $2478=$2;
 var $2479=(($2478+6)|0);
 var $2480=$2479;
 var $2481=(($2480)|0);
 var $2482=HEAP8[($2481)];
 var $2483=$2;
 var $2484=(($2483+120)|0);
 HEAP8[($2484)]=$2482;
 label=405;break;
 case 405: 
 label=406;break;
 case 406: 
 label=407;break;
 case 407: 
 label=597;break;
 case 408: 
 var $2489=$opcode;
 var $2490=($2489&255);
 var $2491=$2490&8;
 var $2492=($2491|0)!=0;
 if($2492){label=409;break;}else{label=424;break;}
 case 409: 
 label=410;break;
 case 410: 
 var $2495=$2;
 var $2496=(($2495+80)|0);
 var $2497=HEAP32[(($2496)>>2)];
 var $2498=($2497|0)!=0;
 if($2498){label=411;break;}else{label=416;break;}
 case 411: 
 $_f13=7;
 label=412;break;
 case 412: 
 var $2501=$_f13;
 var $2502=((($2501)-(1))|0);
 $_f13=$2502;
 var $2503=($2501|0)>0;
 if($2503){label=413;break;}else{label=415;break;}
 case 413: 
 label=414;break;
 case 414: 
 var $2506=$2;
 var $2507=(($2506+80)|0);
 var $2508=HEAP32[(($2507)>>2)];
 var $2509=$2;
 var $2510=$2;
 var $2511=(($2510+36)|0);
 var $2512=HEAP8[($2511)];
 var $2513=($2512&255);
 var $2514=($2513&65535);
 var $2515=$2514<<8;
 var $2516=$2;
 var $2517=(($2516+37)|0);
 var $2518=HEAP8[($2517)];
 var $2519=($2518&255);
 var $2520=$2515|$2519;
 var $2521=(($2520)&65535);
 FUNCTION_TABLE[$2508]($2509,$2521,1,4,0);
 label=412;break;
 case 415: 
 label=417;break;
 case 416: 
 var $2524=$2;
 var $2525=(($2524+56)|0);
 var $2526=HEAP32[(($2525)>>2)];
 var $2527=((($2526)+(7))|0);
 HEAP32[(($2525)>>2)]=$2527;
 label=417;break;
 case 417: 
 label=418;break;
 case 418: 
 var $2530=$opcode;
 var $2531=($2530&255);
 var $2532=$2531>>4;
 var $2533=$2532&3;
 if(($2533|0)==0){ label=419;break;}else if(($2533|0)==1){ label=420;break;}else if(($2533|0)==2){ label=421;break;}else if(($2533|0)==3){ label=422;break;}else{label=423;break;}
 case 419: 
 var $2535=$2;
 var $2536=$2;
 var $2537=(($2536)|0);
 var $2538=$2537;
 var $2539=HEAP16[(($2538)>>1)];
 var $2540=$2;
 var $2541=(($2540+24)|0);
 var $2542=HEAP32[(($2541)>>2)];
 var $2543=$2542;
 var $2544=HEAP16[(($2543)>>1)];
 var $2545=_ZYM_ADD_DD($2535,$2539,$2544);
 var $2546=$2;
 var $2547=(($2546+24)|0);
 var $2548=HEAP32[(($2547)>>2)];
 var $2549=$2548;
 HEAP16[(($2549)>>1)]=$2545;
 label=423;break;
 case 420: 
 var $2551=$2;
 var $2552=$2;
 var $2553=(($2552+2)|0);
 var $2554=$2553;
 var $2555=HEAP16[(($2554)>>1)];
 var $2556=$2;
 var $2557=(($2556+24)|0);
 var $2558=HEAP32[(($2557)>>2)];
 var $2559=$2558;
 var $2560=HEAP16[(($2559)>>1)];
 var $2561=_ZYM_ADD_DD($2551,$2555,$2560);
 var $2562=$2;
 var $2563=(($2562+24)|0);
 var $2564=HEAP32[(($2563)>>2)];
 var $2565=$2564;
 HEAP16[(($2565)>>1)]=$2561;
 label=423;break;
 case 421: 
 var $2567=$2;
 var $2568=$2;
 var $2569=(($2568+24)|0);
 var $2570=HEAP32[(($2569)>>2)];
 var $2571=$2570;
 var $2572=HEAP16[(($2571)>>1)];
 var $2573=$2;
 var $2574=(($2573+24)|0);
 var $2575=HEAP32[(($2574)>>2)];
 var $2576=$2575;
 var $2577=HEAP16[(($2576)>>1)];
 var $2578=_ZYM_ADD_DD($2567,$2572,$2577);
 var $2579=$2;
 var $2580=(($2579+24)|0);
 var $2581=HEAP32[(($2580)>>2)];
 var $2582=$2581;
 HEAP16[(($2582)>>1)]=$2578;
 label=423;break;
 case 422: 
 var $2584=$2;
 var $2585=$2;
 var $2586=(($2585+8)|0);
 var $2587=$2586;
 var $2588=HEAP16[(($2587)>>1)];
 var $2589=$2;
 var $2590=(($2589+24)|0);
 var $2591=HEAP32[(($2590)>>2)];
 var $2592=$2591;
 var $2593=HEAP16[(($2592)>>1)];
 var $2594=_ZYM_ADD_DD($2584,$2588,$2593);
 var $2595=$2;
 var $2596=(($2595+24)|0);
 var $2597=HEAP32[(($2596)>>2)];
 var $2598=$2597;
 HEAP16[(($2598)>>1)]=$2594;
 label=423;break;
 case 423: 
 label=430;break;
 case 424: 
 var $2601=$2;
 var $2602=_z80_getpcw($2601,0);
 $tmpW=$2602;
 var $2603=$opcode;
 var $2604=($2603&255);
 var $2605=$2604>>4;
 var $2606=$2605&3;
 if(($2606|0)==0){ label=425;break;}else if(($2606|0)==1){ label=426;break;}else if(($2606|0)==2){ label=427;break;}else if(($2606|0)==3){ label=428;break;}else{label=429;break;}
 case 425: 
 var $2608=$tmpW;
 var $2609=$2;
 var $2610=(($2609)|0);
 var $2611=$2610;
 HEAP16[(($2611)>>1)]=$2608;
 label=429;break;
 case 426: 
 var $2613=$tmpW;
 var $2614=$2;
 var $2615=(($2614+2)|0);
 var $2616=$2615;
 HEAP16[(($2616)>>1)]=$2613;
 label=429;break;
 case 427: 
 var $2618=$tmpW;
 var $2619=$2;
 var $2620=(($2619+24)|0);
 var $2621=HEAP32[(($2620)>>2)];
 var $2622=$2621;
 HEAP16[(($2622)>>1)]=$2618;
 label=429;break;
 case 428: 
 var $2624=$tmpW;
 var $2625=$2;
 var $2626=(($2625+8)|0);
 var $2627=$2626;
 HEAP16[(($2627)>>1)]=$2624;
 label=429;break;
 case 429: 
 label=430;break;
 case 430: 
 label=597;break;
 case 431: 
 var $2631=$opcode;
 var $2632=($2631&255);
 var $2633=$2632>>3;
 var $2634=$2633&7;
 switch(($2634|0)){case 0:{ label=432;break;}case 1:{ label=440;break;}case 2:{ label=441;break;}case 3:{ label=449;break;}case 4:{ label=450;break;}case 5:{ label=451;break;}case 6:{ label=452;break;}case 7:{ label=460;break;}default:{label=461;break;}}break;
 case 432: 
 label=433;break;
 case 433: 
 label=434;break;
 case 434: 
 var $2638=$2;
 var $2639=(($2638+80)|0);
 var $2640=HEAP32[(($2639)>>2)];
 var $2641=($2640|0)!=0;
 if($2641){label=435;break;}else{label=436;break;}
 case 435: 
 var $2643=$2;
 var $2644=(($2643+80)|0);
 var $2645=HEAP32[(($2644)>>2)];
 var $2646=$2;
 var $2647=$2;
 var $2648=(($2647)|0);
 var $2649=$2648;
 var $2650=HEAP16[(($2649)>>1)];
 FUNCTION_TABLE[$2645]($2646,$2650,3,3,16);
 label=437;break;
 case 436: 
 var $2652=$2;
 var $2653=(($2652+56)|0);
 var $2654=HEAP32[(($2653)>>2)];
 var $2655=((($2654)+(3))|0);
 HEAP32[(($2653)>>2)]=$2655;
 label=437;break;
 case 437: 
 label=438;break;
 case 438: 
 var $2658=$2;
 var $2659=(($2658+76)|0);
 var $2660=HEAP32[(($2659)>>2)];
 var $2661=$2;
 var $2662=$2;
 var $2663=(($2662)|0);
 var $2664=$2663;
 var $2665=HEAP16[(($2664)>>1)];
 var $2666=$2;
 var $2667=(($2666+6)|0);
 var $2668=$2667;
 var $2669=(($2668+1)|0);
 var $2670=HEAP8[($2669)];
 FUNCTION_TABLE[$2660]($2661,$2665,$2670,3);
 label=439;break;
 case 439: 
 var $2672=$2;
 var $2673=(($2672)|0);
 var $2674=$2673;
 var $2675=(($2674)|0);
 var $2676=HEAP8[($2675)];
 var $2677=($2676&255);
 var $2678=((($2677)+(1))|0);
 var $2679=$2678&255;
 var $2680=(($2679)&255);
 var $2681=$2;
 var $2682=(($2681+28)|0);
 var $2683=$2682;
 var $2684=(($2683)|0);
 HEAP8[($2684)]=$2680;
 var $2685=$2;
 var $2686=(($2685+6)|0);
 var $2687=$2686;
 var $2688=(($2687+1)|0);
 var $2689=HEAP8[($2688)];
 var $2690=$2;
 var $2691=(($2690+28)|0);
 var $2692=$2691;
 var $2693=(($2692+1)|0);
 HEAP8[($2693)]=$2689;
 label=461;break;
 case 440: 
 var $2695=$2;
 var $2696=$2;
 var $2697=(($2696)|0);
 var $2698=$2697;
 var $2699=HEAP16[(($2698)>>1)];
 var $2700=_z80_peekb_3ts($2695,$2699);
 var $2701=$2;
 var $2702=(($2701+6)|0);
 var $2703=$2702;
 var $2704=(($2703+1)|0);
 HEAP8[($2704)]=$2700;
 var $2705=$2;
 var $2706=(($2705)|0);
 var $2707=$2706;
 var $2708=HEAP16[(($2707)>>1)];
 var $2709=($2708&65535);
 var $2710=((($2709)+(1))|0);
 var $2711=$2710&65535;
 var $2712=(($2711)&65535);
 var $2713=$2;
 var $2714=(($2713+28)|0);
 var $2715=$2714;
 HEAP16[(($2715)>>1)]=$2712;
 label=461;break;
 case 441: 
 label=442;break;
 case 442: 
 label=443;break;
 case 443: 
 var $2719=$2;
 var $2720=(($2719+80)|0);
 var $2721=HEAP32[(($2720)>>2)];
 var $2722=($2721|0)!=0;
 if($2722){label=444;break;}else{label=445;break;}
 case 444: 
 var $2724=$2;
 var $2725=(($2724+80)|0);
 var $2726=HEAP32[(($2725)>>2)];
 var $2727=$2;
 var $2728=$2;
 var $2729=(($2728+2)|0);
 var $2730=$2729;
 var $2731=HEAP16[(($2730)>>1)];
 FUNCTION_TABLE[$2726]($2727,$2731,3,3,16);
 label=446;break;
 case 445: 
 var $2733=$2;
 var $2734=(($2733+56)|0);
 var $2735=HEAP32[(($2734)>>2)];
 var $2736=((($2735)+(3))|0);
 HEAP32[(($2734)>>2)]=$2736;
 label=446;break;
 case 446: 
 label=447;break;
 case 447: 
 var $2739=$2;
 var $2740=(($2739+76)|0);
 var $2741=HEAP32[(($2740)>>2)];
 var $2742=$2;
 var $2743=$2;
 var $2744=(($2743+2)|0);
 var $2745=$2744;
 var $2746=HEAP16[(($2745)>>1)];
 var $2747=$2;
 var $2748=(($2747+6)|0);
 var $2749=$2748;
 var $2750=(($2749+1)|0);
 var $2751=HEAP8[($2750)];
 FUNCTION_TABLE[$2741]($2742,$2746,$2751,3);
 label=448;break;
 case 448: 
 var $2753=$2;
 var $2754=(($2753+2)|0);
 var $2755=$2754;
 var $2756=(($2755)|0);
 var $2757=HEAP8[($2756)];
 var $2758=($2757&255);
 var $2759=((($2758)+(1))|0);
 var $2760=$2759&255;
 var $2761=(($2760)&255);
 var $2762=$2;
 var $2763=(($2762+28)|0);
 var $2764=$2763;
 var $2765=(($2764)|0);
 HEAP8[($2765)]=$2761;
 var $2766=$2;
 var $2767=(($2766+6)|0);
 var $2768=$2767;
 var $2769=(($2768+1)|0);
 var $2770=HEAP8[($2769)];
 var $2771=$2;
 var $2772=(($2771+28)|0);
 var $2773=$2772;
 var $2774=(($2773+1)|0);
 HEAP8[($2774)]=$2770;
 label=461;break;
 case 449: 
 var $2776=$2;
 var $2777=$2;
 var $2778=(($2777+2)|0);
 var $2779=$2778;
 var $2780=HEAP16[(($2779)>>1)];
 var $2781=_z80_peekb_3ts($2776,$2780);
 var $2782=$2;
 var $2783=(($2782+6)|0);
 var $2784=$2783;
 var $2785=(($2784+1)|0);
 HEAP8[($2785)]=$2781;
 var $2786=$2;
 var $2787=(($2786+2)|0);
 var $2788=$2787;
 var $2789=HEAP16[(($2788)>>1)];
 var $2790=($2789&65535);
 var $2791=((($2790)+(1))|0);
 var $2792=$2791&65535;
 var $2793=(($2792)&65535);
 var $2794=$2;
 var $2795=(($2794+28)|0);
 var $2796=$2795;
 HEAP16[(($2796)>>1)]=$2793;
 label=461;break;
 case 450: 
 var $2798=$2;
 var $2799=_z80_getpcw($2798,0);
 $tmpW=$2799;
 var $2800=$tmpW;
 var $2801=($2800&65535);
 var $2802=((($2801)+(1))|0);
 var $2803=$2802&65535;
 var $2804=(($2803)&65535);
 var $2805=$2;
 var $2806=(($2805+28)|0);
 var $2807=$2806;
 HEAP16[(($2807)>>1)]=$2804;
 var $2808=$2;
 var $2809=$tmpW;
 var $2810=$2;
 var $2811=(($2810+24)|0);
 var $2812=HEAP32[(($2811)>>2)];
 var $2813=$2812;
 var $2814=HEAP16[(($2813)>>1)];
 _z80_pokew_6ts($2808,$2809,$2814);
 label=461;break;
 case 451: 
 var $2816=$2;
 var $2817=_z80_getpcw($2816,0);
 $tmpW=$2817;
 var $2818=$tmpW;
 var $2819=($2818&65535);
 var $2820=((($2819)+(1))|0);
 var $2821=$2820&65535;
 var $2822=(($2821)&65535);
 var $2823=$2;
 var $2824=(($2823+28)|0);
 var $2825=$2824;
 HEAP16[(($2825)>>1)]=$2822;
 var $2826=$2;
 var $2827=$tmpW;
 var $2828=_z80_peekw_6ts($2826,$2827);
 var $2829=$2;
 var $2830=(($2829+24)|0);
 var $2831=HEAP32[(($2830)>>2)];
 var $2832=$2831;
 HEAP16[(($2832)>>1)]=$2828;
 label=461;break;
 case 452: 
 var $2834=$2;
 var $2835=_z80_getpcw($2834,0);
 $tmpW=$2835;
 var $2836=$tmpW;
 var $2837=($2836&65535);
 var $2838=((($2837)+(1))|0);
 var $2839=$2838&255;
 var $2840=(($2839)&255);
 var $2841=$2;
 var $2842=(($2841+28)|0);
 var $2843=$2842;
 var $2844=(($2843)|0);
 HEAP8[($2844)]=$2840;
 var $2845=$2;
 var $2846=(($2845+6)|0);
 var $2847=$2846;
 var $2848=(($2847+1)|0);
 var $2849=HEAP8[($2848)];
 var $2850=$2;
 var $2851=(($2850+28)|0);
 var $2852=$2851;
 var $2853=(($2852+1)|0);
 HEAP8[($2853)]=$2849;
 label=453;break;
 case 453: 
 label=454;break;
 case 454: 
 var $2856=$2;
 var $2857=(($2856+80)|0);
 var $2858=HEAP32[(($2857)>>2)];
 var $2859=($2858|0)!=0;
 if($2859){label=455;break;}else{label=456;break;}
 case 455: 
 var $2861=$2;
 var $2862=(($2861+80)|0);
 var $2863=HEAP32[(($2862)>>2)];
 var $2864=$2;
 var $2865=$tmpW;
 FUNCTION_TABLE[$2863]($2864,$2865,3,3,16);
 label=457;break;
 case 456: 
 var $2867=$2;
 var $2868=(($2867+56)|0);
 var $2869=HEAP32[(($2868)>>2)];
 var $2870=((($2869)+(3))|0);
 HEAP32[(($2868)>>2)]=$2870;
 label=457;break;
 case 457: 
 label=458;break;
 case 458: 
 var $2873=$2;
 var $2874=(($2873+76)|0);
 var $2875=HEAP32[(($2874)>>2)];
 var $2876=$2;
 var $2877=$tmpW;
 var $2878=$2;
 var $2879=(($2878+6)|0);
 var $2880=$2879;
 var $2881=(($2880+1)|0);
 var $2882=HEAP8[($2881)];
 FUNCTION_TABLE[$2875]($2876,$2877,$2882,3);
 label=459;break;
 case 459: 
 label=461;break;
 case 460: 
 var $2885=$2;
 var $2886=_z80_getpcw($2885,0);
 $tmpW=$2886;
 var $2887=$tmpW;
 var $2888=($2887&65535);
 var $2889=((($2888)+(1))|0);
 var $2890=$2889&65535;
 var $2891=(($2890)&65535);
 var $2892=$2;
 var $2893=(($2892+28)|0);
 var $2894=$2893;
 HEAP16[(($2894)>>1)]=$2891;
 var $2895=$2;
 var $2896=$tmpW;
 var $2897=_z80_peekb_3ts($2895,$2896);
 var $2898=$2;
 var $2899=(($2898+6)|0);
 var $2900=$2899;
 var $2901=(($2900+1)|0);
 HEAP8[($2901)]=$2897;
 label=461;break;
 case 461: 
 label=597;break;
 case 462: 
 label=463;break;
 case 463: 
 var $2905=$2;
 var $2906=(($2905+80)|0);
 var $2907=HEAP32[(($2906)>>2)];
 var $2908=($2907|0)!=0;
 if($2908){label=464;break;}else{label=469;break;}
 case 464: 
 $_f14=2;
 label=465;break;
 case 465: 
 var $2911=$_f14;
 var $2912=((($2911)-(1))|0);
 $_f14=$2912;
 var $2913=($2911|0)>0;
 if($2913){label=466;break;}else{label=468;break;}
 case 466: 
 label=467;break;
 case 467: 
 var $2916=$2;
 var $2917=(($2916+80)|0);
 var $2918=HEAP32[(($2917)>>2)];
 var $2919=$2;
 var $2920=$2;
 var $2921=(($2920+36)|0);
 var $2922=HEAP8[($2921)];
 var $2923=($2922&255);
 var $2924=($2923&65535);
 var $2925=$2924<<8;
 var $2926=$2;
 var $2927=(($2926+37)|0);
 var $2928=HEAP8[($2927)];
 var $2929=($2928&255);
 var $2930=$2925|$2929;
 var $2931=(($2930)&65535);
 FUNCTION_TABLE[$2918]($2919,$2931,1,4,0);
 label=465;break;
 case 468: 
 label=470;break;
 case 469: 
 var $2934=$2;
 var $2935=(($2934+56)|0);
 var $2936=HEAP32[(($2935)>>2)];
 var $2937=((($2936)+(2))|0);
 HEAP32[(($2935)>>2)]=$2937;
 label=470;break;
 case 470: 
 label=471;break;
 case 471: 
 var $2940=$opcode;
 var $2941=($2940&255);
 var $2942=$2941&8;
 var $2943=($2942|0)!=0;
 if($2943){label=472;break;}else{label=478;break;}
 case 472: 
 var $2945=$opcode;
 var $2946=($2945&255);
 var $2947=$2946>>4;
 var $2948=$2947&3;
 if(($2948|0)==0){ label=473;break;}else if(($2948|0)==1){ label=474;break;}else if(($2948|0)==2){ label=475;break;}else if(($2948|0)==3){ label=476;break;}else{label=477;break;}
 case 473: 
 var $2950=$2;
 var $2951=(($2950)|0);
 var $2952=$2951;
 var $2953=HEAP16[(($2952)>>1)];
 var $2954=($2953&65535);
 var $2955=((($2954)-(1))|0);
 var $2956=$2955&65535;
 var $2957=(($2956)&65535);
 var $2958=$2;
 var $2959=(($2958)|0);
 var $2960=$2959;
 HEAP16[(($2960)>>1)]=$2957;
 label=477;break;
 case 474: 
 var $2962=$2;
 var $2963=(($2962+2)|0);
 var $2964=$2963;
 var $2965=HEAP16[(($2964)>>1)];
 var $2966=($2965&65535);
 var $2967=((($2966)-(1))|0);
 var $2968=$2967&65535;
 var $2969=(($2968)&65535);
 var $2970=$2;
 var $2971=(($2970+2)|0);
 var $2972=$2971;
 HEAP16[(($2972)>>1)]=$2969;
 label=477;break;
 case 475: 
 var $2974=$2;
 var $2975=(($2974+24)|0);
 var $2976=HEAP32[(($2975)>>2)];
 var $2977=$2976;
 var $2978=HEAP16[(($2977)>>1)];
 var $2979=($2978&65535);
 var $2980=((($2979)-(1))|0);
 var $2981=$2980&65535;
 var $2982=(($2981)&65535);
 var $2983=$2;
 var $2984=(($2983+24)|0);
 var $2985=HEAP32[(($2984)>>2)];
 var $2986=$2985;
 HEAP16[(($2986)>>1)]=$2982;
 label=477;break;
 case 476: 
 var $2988=$2;
 var $2989=(($2988+8)|0);
 var $2990=$2989;
 var $2991=HEAP16[(($2990)>>1)];
 var $2992=($2991&65535);
 var $2993=((($2992)-(1))|0);
 var $2994=$2993&65535;
 var $2995=(($2994)&65535);
 var $2996=$2;
 var $2997=(($2996+8)|0);
 var $2998=$2997;
 HEAP16[(($2998)>>1)]=$2995;
 label=477;break;
 case 477: 
 label=484;break;
 case 478: 
 var $3001=$opcode;
 var $3002=($3001&255);
 var $3003=$3002>>4;
 var $3004=$3003&3;
 if(($3004|0)==0){ label=479;break;}else if(($3004|0)==1){ label=480;break;}else if(($3004|0)==2){ label=481;break;}else if(($3004|0)==3){ label=482;break;}else{label=483;break;}
 case 479: 
 var $3006=$2;
 var $3007=(($3006)|0);
 var $3008=$3007;
 var $3009=HEAP16[(($3008)>>1)];
 var $3010=($3009&65535);
 var $3011=((($3010)+(1))|0);
 var $3012=$3011&65535;
 var $3013=(($3012)&65535);
 var $3014=$2;
 var $3015=(($3014)|0);
 var $3016=$3015;
 HEAP16[(($3016)>>1)]=$3013;
 label=483;break;
 case 480: 
 var $3018=$2;
 var $3019=(($3018+2)|0);
 var $3020=$3019;
 var $3021=HEAP16[(($3020)>>1)];
 var $3022=($3021&65535);
 var $3023=((($3022)+(1))|0);
 var $3024=$3023&65535;
 var $3025=(($3024)&65535);
 var $3026=$2;
 var $3027=(($3026+2)|0);
 var $3028=$3027;
 HEAP16[(($3028)>>1)]=$3025;
 label=483;break;
 case 481: 
 var $3030=$2;
 var $3031=(($3030+24)|0);
 var $3032=HEAP32[(($3031)>>2)];
 var $3033=$3032;
 var $3034=HEAP16[(($3033)>>1)];
 var $3035=($3034&65535);
 var $3036=((($3035)+(1))|0);
 var $3037=$3036&65535;
 var $3038=(($3037)&65535);
 var $3039=$2;
 var $3040=(($3039+24)|0);
 var $3041=HEAP32[(($3040)>>2)];
 var $3042=$3041;
 HEAP16[(($3042)>>1)]=$3038;
 label=483;break;
 case 482: 
 var $3044=$2;
 var $3045=(($3044+8)|0);
 var $3046=$3045;
 var $3047=HEAP16[(($3046)>>1)];
 var $3048=($3047&65535);
 var $3049=((($3048)+(1))|0);
 var $3050=$3049&65535;
 var $3051=(($3050)&65535);
 var $3052=$2;
 var $3053=(($3052+8)|0);
 var $3054=$3053;
 HEAP16[(($3054)>>1)]=$3051;
 label=483;break;
 case 483: 
 label=484;break;
 case 484: 
 label=597;break;
 case 485: 
 var $3058=$opcode;
 var $3059=($3058&255);
 var $3060=$3059>>3;
 var $3061=$3060&7;
 switch(($3061|0)){case 0:{ label=486;break;}case 1:{ label=487;break;}case 2:{ label=488;break;}case 3:{ label=489;break;}case 4:{ label=490;break;}case 5:{ label=491;break;}case 6:{ label=492;break;}case 7:{ label=520;break;}default:{label=521;break;}}break;
 case 486: 
 var $3063=$2;
 var $3064=$2;
 var $3065=(($3064)|0);
 var $3066=$3065;
 var $3067=(($3066+1)|0);
 var $3068=HEAP8[($3067)];
 var $3069=_ZYM_INC8($3063,$3068);
 var $3070=$2;
 var $3071=(($3070)|0);
 var $3072=$3071;
 var $3073=(($3072+1)|0);
 HEAP8[($3073)]=$3069;
 label=521;break;
 case 487: 
 var $3075=$2;
 var $3076=$2;
 var $3077=(($3076)|0);
 var $3078=$3077;
 var $3079=(($3078)|0);
 var $3080=HEAP8[($3079)];
 var $3081=_ZYM_INC8($3075,$3080);
 var $3082=$2;
 var $3083=(($3082)|0);
 var $3084=$3083;
 var $3085=(($3084)|0);
 HEAP8[($3085)]=$3081;
 label=521;break;
 case 488: 
 var $3087=$2;
 var $3088=$2;
 var $3089=(($3088+2)|0);
 var $3090=$3089;
 var $3091=(($3090+1)|0);
 var $3092=HEAP8[($3091)];
 var $3093=_ZYM_INC8($3087,$3092);
 var $3094=$2;
 var $3095=(($3094+2)|0);
 var $3096=$3095;
 var $3097=(($3096+1)|0);
 HEAP8[($3097)]=$3093;
 label=521;break;
 case 489: 
 var $3099=$2;
 var $3100=$2;
 var $3101=(($3100+2)|0);
 var $3102=$3101;
 var $3103=(($3102)|0);
 var $3104=HEAP8[($3103)];
 var $3105=_ZYM_INC8($3099,$3104);
 var $3106=$2;
 var $3107=(($3106+2)|0);
 var $3108=$3107;
 var $3109=(($3108)|0);
 HEAP8[($3109)]=$3105;
 label=521;break;
 case 490: 
 var $3111=$2;
 var $3112=$2;
 var $3113=(($3112+24)|0);
 var $3114=HEAP32[(($3113)>>2)];
 var $3115=$3114;
 var $3116=(($3115+1)|0);
 var $3117=HEAP8[($3116)];
 var $3118=_ZYM_INC8($3111,$3117);
 var $3119=$2;
 var $3120=(($3119+24)|0);
 var $3121=HEAP32[(($3120)>>2)];
 var $3122=$3121;
 var $3123=(($3122+1)|0);
 HEAP8[($3123)]=$3118;
 label=521;break;
 case 491: 
 var $3125=$2;
 var $3126=$2;
 var $3127=(($3126+24)|0);
 var $3128=HEAP32[(($3127)>>2)];
 var $3129=$3128;
 var $3130=(($3129)|0);
 var $3131=HEAP8[($3130)];
 var $3132=_ZYM_INC8($3125,$3131);
 var $3133=$2;
 var $3134=(($3133+24)|0);
 var $3135=HEAP32[(($3134)>>2)];
 var $3136=$3135;
 var $3137=(($3136)|0);
 HEAP8[($3137)]=$3132;
 label=521;break;
 case 492: 
 var $3139=$gotDD;
 var $3140=($3139|0)!=0;
 if($3140){label=493;break;}else{label=503;break;}
 case 493: 
 var $3142=$2;
 var $3143=(($3142+30)|0);
 var $3144=HEAP16[(($3143)>>1)];
 var $3145=($3144&65535);
 var $3146=((($3145)-(1))|0);
 var $3147=$3146&65535;
 var $3148=(($3147)&65535);
 var $3149=$2;
 var $3150=(($3149+30)|0);
 HEAP16[(($3150)>>1)]=$3148;
 label=494;break;
 case 494: 
 var $3152=$2;
 var $3153=(($3152+80)|0);
 var $3154=HEAP32[(($3153)>>2)];
 var $3155=($3154|0)!=0;
 if($3155){label=495;break;}else{label=500;break;}
 case 495: 
 $_f15=5;
 label=496;break;
 case 496: 
 var $3158=$_f15;
 var $3159=((($3158)-(1))|0);
 $_f15=$3159;
 var $3160=($3158|0)>0;
 if($3160){label=497;break;}else{label=499;break;}
 case 497: 
 label=498;break;
 case 498: 
 var $3163=$2;
 var $3164=(($3163+80)|0);
 var $3165=HEAP32[(($3164)>>2)];
 var $3166=$2;
 var $3167=$2;
 var $3168=(($3167+30)|0);
 var $3169=HEAP16[(($3168)>>1)];
 FUNCTION_TABLE[$3165]($3166,$3169,1,4,0);
 label=496;break;
 case 499: 
 label=501;break;
 case 500: 
 var $3172=$2;
 var $3173=(($3172+56)|0);
 var $3174=HEAP32[(($3173)>>2)];
 var $3175=((($3174)+(5))|0);
 HEAP32[(($3173)>>2)]=$3175;
 label=501;break;
 case 501: 
 label=502;break;
 case 502: 
 var $3178=$2;
 var $3179=(($3178+30)|0);
 var $3180=HEAP16[(($3179)>>1)];
 var $3181=($3180&65535);
 var $3182=((($3181)+(1))|0);
 var $3183=$3182&65535;
 var $3184=(($3183)&65535);
 var $3185=$2;
 var $3186=(($3185+30)|0);
 HEAP16[(($3186)>>1)]=$3184;
 label=503;break;
 case 503: 
 var $3188=$2;
 var $3189=(($3188+24)|0);
 var $3190=HEAP32[(($3189)>>2)];
 var $3191=$3190;
 var $3192=HEAP16[(($3191)>>1)];
 var $3193=($3192&65535);
 var $3194=$disp;
 var $3195=((($3193)+($3194))|0);
 var $3196=$3195&65535;
 var $3197=(($3196)&65535);
 $tmpW=$3197;
 var $3198=$2;
 var $3199=$tmpW;
 var $3200=_z80_peekb_3ts($3198,$3199);
 $tmpB=$3200;
 label=504;break;
 case 504: 
 var $3202=$2;
 var $3203=(($3202+80)|0);
 var $3204=HEAP32[(($3203)>>2)];
 var $3205=($3204|0)!=0;
 if($3205){label=505;break;}else{label=510;break;}
 case 505: 
 $_f16=1;
 label=506;break;
 case 506: 
 var $3208=$_f16;
 var $3209=((($3208)-(1))|0);
 $_f16=$3209;
 var $3210=($3208|0)>0;
 if($3210){label=507;break;}else{label=509;break;}
 case 507: 
 label=508;break;
 case 508: 
 var $3213=$2;
 var $3214=(($3213+80)|0);
 var $3215=HEAP32[(($3214)>>2)];
 var $3216=$2;
 var $3217=$tmpW;
 FUNCTION_TABLE[$3215]($3216,$3217,1,4,0);
 label=506;break;
 case 509: 
 label=511;break;
 case 510: 
 var $3220=$2;
 var $3221=(($3220+56)|0);
 var $3222=HEAP32[(($3221)>>2)];
 var $3223=((($3222)+(1))|0);
 HEAP32[(($3221)>>2)]=$3223;
 label=511;break;
 case 511: 
 label=512;break;
 case 512: 
 var $3226=$2;
 var $3227=$tmpB;
 var $3228=_ZYM_INC8($3226,$3227);
 $tmpB=$3228;
 label=513;break;
 case 513: 
 label=514;break;
 case 514: 
 var $3231=$2;
 var $3232=(($3231+80)|0);
 var $3233=HEAP32[(($3232)>>2)];
 var $3234=($3233|0)!=0;
 if($3234){label=515;break;}else{label=516;break;}
 case 515: 
 var $3236=$2;
 var $3237=(($3236+80)|0);
 var $3238=HEAP32[(($3237)>>2)];
 var $3239=$2;
 var $3240=$tmpW;
 FUNCTION_TABLE[$3238]($3239,$3240,3,3,16);
 label=517;break;
 case 516: 
 var $3242=$2;
 var $3243=(($3242+56)|0);
 var $3244=HEAP32[(($3243)>>2)];
 var $3245=((($3244)+(3))|0);
 HEAP32[(($3243)>>2)]=$3245;
 label=517;break;
 case 517: 
 label=518;break;
 case 518: 
 var $3248=$2;
 var $3249=(($3248+76)|0);
 var $3250=HEAP32[(($3249)>>2)];
 var $3251=$2;
 var $3252=$tmpW;
 var $3253=$tmpB;
 FUNCTION_TABLE[$3250]($3251,$3252,$3253,3);
 label=519;break;
 case 519: 
 label=521;break;
 case 520: 
 var $3256=$2;
 var $3257=$2;
 var $3258=(($3257+6)|0);
 var $3259=$3258;
 var $3260=(($3259+1)|0);
 var $3261=HEAP8[($3260)];
 var $3262=_ZYM_INC8($3256,$3261);
 var $3263=$2;
 var $3264=(($3263+6)|0);
 var $3265=$3264;
 var $3266=(($3265+1)|0);
 HEAP8[($3266)]=$3262;
 label=521;break;
 case 521: 
 label=597;break;
 case 522: 
 var $3269=$opcode;
 var $3270=($3269&255);
 var $3271=$3270>>3;
 var $3272=$3271&7;
 switch(($3272|0)){case 0:{ label=523;break;}case 1:{ label=524;break;}case 2:{ label=525;break;}case 3:{ label=526;break;}case 4:{ label=527;break;}case 5:{ label=528;break;}case 6:{ label=529;break;}case 7:{ label=557;break;}default:{label=558;break;}}break;
 case 523: 
 var $3274=$2;
 var $3275=$2;
 var $3276=(($3275)|0);
 var $3277=$3276;
 var $3278=(($3277+1)|0);
 var $3279=HEAP8[($3278)];
 var $3280=_ZYM_DEC8($3274,$3279);
 var $3281=$2;
 var $3282=(($3281)|0);
 var $3283=$3282;
 var $3284=(($3283+1)|0);
 HEAP8[($3284)]=$3280;
 label=558;break;
 case 524: 
 var $3286=$2;
 var $3287=$2;
 var $3288=(($3287)|0);
 var $3289=$3288;
 var $3290=(($3289)|0);
 var $3291=HEAP8[($3290)];
 var $3292=_ZYM_DEC8($3286,$3291);
 var $3293=$2;
 var $3294=(($3293)|0);
 var $3295=$3294;
 var $3296=(($3295)|0);
 HEAP8[($3296)]=$3292;
 label=558;break;
 case 525: 
 var $3298=$2;
 var $3299=$2;
 var $3300=(($3299+2)|0);
 var $3301=$3300;
 var $3302=(($3301+1)|0);
 var $3303=HEAP8[($3302)];
 var $3304=_ZYM_DEC8($3298,$3303);
 var $3305=$2;
 var $3306=(($3305+2)|0);
 var $3307=$3306;
 var $3308=(($3307+1)|0);
 HEAP8[($3308)]=$3304;
 label=558;break;
 case 526: 
 var $3310=$2;
 var $3311=$2;
 var $3312=(($3311+2)|0);
 var $3313=$3312;
 var $3314=(($3313)|0);
 var $3315=HEAP8[($3314)];
 var $3316=_ZYM_DEC8($3310,$3315);
 var $3317=$2;
 var $3318=(($3317+2)|0);
 var $3319=$3318;
 var $3320=(($3319)|0);
 HEAP8[($3320)]=$3316;
 label=558;break;
 case 527: 
 var $3322=$2;
 var $3323=$2;
 var $3324=(($3323+24)|0);
 var $3325=HEAP32[(($3324)>>2)];
 var $3326=$3325;
 var $3327=(($3326+1)|0);
 var $3328=HEAP8[($3327)];
 var $3329=_ZYM_DEC8($3322,$3328);
 var $3330=$2;
 var $3331=(($3330+24)|0);
 var $3332=HEAP32[(($3331)>>2)];
 var $3333=$3332;
 var $3334=(($3333+1)|0);
 HEAP8[($3334)]=$3329;
 label=558;break;
 case 528: 
 var $3336=$2;
 var $3337=$2;
 var $3338=(($3337+24)|0);
 var $3339=HEAP32[(($3338)>>2)];
 var $3340=$3339;
 var $3341=(($3340)|0);
 var $3342=HEAP8[($3341)];
 var $3343=_ZYM_DEC8($3336,$3342);
 var $3344=$2;
 var $3345=(($3344+24)|0);
 var $3346=HEAP32[(($3345)>>2)];
 var $3347=$3346;
 var $3348=(($3347)|0);
 HEAP8[($3348)]=$3343;
 label=558;break;
 case 529: 
 var $3350=$gotDD;
 var $3351=($3350|0)!=0;
 if($3351){label=530;break;}else{label=540;break;}
 case 530: 
 var $3353=$2;
 var $3354=(($3353+30)|0);
 var $3355=HEAP16[(($3354)>>1)];
 var $3356=($3355&65535);
 var $3357=((($3356)-(1))|0);
 var $3358=$3357&65535;
 var $3359=(($3358)&65535);
 var $3360=$2;
 var $3361=(($3360+30)|0);
 HEAP16[(($3361)>>1)]=$3359;
 label=531;break;
 case 531: 
 var $3363=$2;
 var $3364=(($3363+80)|0);
 var $3365=HEAP32[(($3364)>>2)];
 var $3366=($3365|0)!=0;
 if($3366){label=532;break;}else{label=537;break;}
 case 532: 
 $_f17=5;
 label=533;break;
 case 533: 
 var $3369=$_f17;
 var $3370=((($3369)-(1))|0);
 $_f17=$3370;
 var $3371=($3369|0)>0;
 if($3371){label=534;break;}else{label=536;break;}
 case 534: 
 label=535;break;
 case 535: 
 var $3374=$2;
 var $3375=(($3374+80)|0);
 var $3376=HEAP32[(($3375)>>2)];
 var $3377=$2;
 var $3378=$2;
 var $3379=(($3378+30)|0);
 var $3380=HEAP16[(($3379)>>1)];
 FUNCTION_TABLE[$3376]($3377,$3380,1,4,0);
 label=533;break;
 case 536: 
 label=538;break;
 case 537: 
 var $3383=$2;
 var $3384=(($3383+56)|0);
 var $3385=HEAP32[(($3384)>>2)];
 var $3386=((($3385)+(5))|0);
 HEAP32[(($3384)>>2)]=$3386;
 label=538;break;
 case 538: 
 label=539;break;
 case 539: 
 var $3389=$2;
 var $3390=(($3389+30)|0);
 var $3391=HEAP16[(($3390)>>1)];
 var $3392=($3391&65535);
 var $3393=((($3392)+(1))|0);
 var $3394=$3393&65535;
 var $3395=(($3394)&65535);
 var $3396=$2;
 var $3397=(($3396+30)|0);
 HEAP16[(($3397)>>1)]=$3395;
 label=540;break;
 case 540: 
 var $3399=$2;
 var $3400=(($3399+24)|0);
 var $3401=HEAP32[(($3400)>>2)];
 var $3402=$3401;
 var $3403=HEAP16[(($3402)>>1)];
 var $3404=($3403&65535);
 var $3405=$disp;
 var $3406=((($3404)+($3405))|0);
 var $3407=$3406&65535;
 var $3408=(($3407)&65535);
 $tmpW=$3408;
 var $3409=$2;
 var $3410=$tmpW;
 var $3411=_z80_peekb_3ts($3409,$3410);
 $tmpB=$3411;
 label=541;break;
 case 541: 
 var $3413=$2;
 var $3414=(($3413+80)|0);
 var $3415=HEAP32[(($3414)>>2)];
 var $3416=($3415|0)!=0;
 if($3416){label=542;break;}else{label=547;break;}
 case 542: 
 $_f18=1;
 label=543;break;
 case 543: 
 var $3419=$_f18;
 var $3420=((($3419)-(1))|0);
 $_f18=$3420;
 var $3421=($3419|0)>0;
 if($3421){label=544;break;}else{label=546;break;}
 case 544: 
 label=545;break;
 case 545: 
 var $3424=$2;
 var $3425=(($3424+80)|0);
 var $3426=HEAP32[(($3425)>>2)];
 var $3427=$2;
 var $3428=$tmpW;
 FUNCTION_TABLE[$3426]($3427,$3428,1,4,0);
 label=543;break;
 case 546: 
 label=548;break;
 case 547: 
 var $3431=$2;
 var $3432=(($3431+56)|0);
 var $3433=HEAP32[(($3432)>>2)];
 var $3434=((($3433)+(1))|0);
 HEAP32[(($3432)>>2)]=$3434;
 label=548;break;
 case 548: 
 label=549;break;
 case 549: 
 var $3437=$2;
 var $3438=$tmpB;
 var $3439=_ZYM_DEC8($3437,$3438);
 $tmpB=$3439;
 label=550;break;
 case 550: 
 label=551;break;
 case 551: 
 var $3442=$2;
 var $3443=(($3442+80)|0);
 var $3444=HEAP32[(($3443)>>2)];
 var $3445=($3444|0)!=0;
 if($3445){label=552;break;}else{label=553;break;}
 case 552: 
 var $3447=$2;
 var $3448=(($3447+80)|0);
 var $3449=HEAP32[(($3448)>>2)];
 var $3450=$2;
 var $3451=$tmpW;
 FUNCTION_TABLE[$3449]($3450,$3451,3,3,16);
 label=554;break;
 case 553: 
 var $3453=$2;
 var $3454=(($3453+56)|0);
 var $3455=HEAP32[(($3454)>>2)];
 var $3456=((($3455)+(3))|0);
 HEAP32[(($3454)>>2)]=$3456;
 label=554;break;
 case 554: 
 label=555;break;
 case 555: 
 var $3459=$2;
 var $3460=(($3459+76)|0);
 var $3461=HEAP32[(($3460)>>2)];
 var $3462=$2;
 var $3463=$tmpW;
 var $3464=$tmpB;
 FUNCTION_TABLE[$3461]($3462,$3463,$3464,3);
 label=556;break;
 case 556: 
 label=558;break;
 case 557: 
 var $3467=$2;
 var $3468=$2;
 var $3469=(($3468+6)|0);
 var $3470=$3469;
 var $3471=(($3470+1)|0);
 var $3472=HEAP8[($3471)];
 var $3473=_ZYM_DEC8($3467,$3472);
 var $3474=$2;
 var $3475=(($3474+6)|0);
 var $3476=$3475;
 var $3477=(($3476+1)|0);
 HEAP8[($3477)]=$3473;
 label=558;break;
 case 558: 
 label=597;break;
 case 559: 
 var $3480=$2;
 var $3481=$2;
 var $3482=(($3481+30)|0);
 var $3483=HEAP16[(($3482)>>1)];
 var $3484=_z80_peekb_3ts_args($3480,$3483);
 $tmpB=$3484;
 var $3485=$2;
 var $3486=(($3485+30)|0);
 var $3487=HEAP16[(($3486)>>1)];
 var $3488=($3487&65535);
 var $3489=((($3488)+(1))|0);
 var $3490=$3489&65535;
 var $3491=(($3490)&65535);
 var $3492=$2;
 var $3493=(($3492+30)|0);
 HEAP16[(($3493)>>1)]=$3491;
 var $3494=$opcode;
 var $3495=($3494&255);
 var $3496=$3495>>3;
 var $3497=$3496&7;
 switch(($3497|0)){case 0:{ label=560;break;}case 1:{ label=561;break;}case 2:{ label=562;break;}case 3:{ label=563;break;}case 4:{ label=564;break;}case 5:{ label=565;break;}case 6:{ label=566;break;}case 7:{ label=585;break;}default:{label=586;break;}}break;
 case 560: 
 var $3499=$tmpB;
 var $3500=$2;
 var $3501=(($3500)|0);
 var $3502=$3501;
 var $3503=(($3502+1)|0);
 HEAP8[($3503)]=$3499;
 label=586;break;
 case 561: 
 var $3505=$tmpB;
 var $3506=$2;
 var $3507=(($3506)|0);
 var $3508=$3507;
 var $3509=(($3508)|0);
 HEAP8[($3509)]=$3505;
 label=586;break;
 case 562: 
 var $3511=$tmpB;
 var $3512=$2;
 var $3513=(($3512+2)|0);
 var $3514=$3513;
 var $3515=(($3514+1)|0);
 HEAP8[($3515)]=$3511;
 label=586;break;
 case 563: 
 var $3517=$tmpB;
 var $3518=$2;
 var $3519=(($3518+2)|0);
 var $3520=$3519;
 var $3521=(($3520)|0);
 HEAP8[($3521)]=$3517;
 label=586;break;
 case 564: 
 var $3523=$tmpB;
 var $3524=$2;
 var $3525=(($3524+24)|0);
 var $3526=HEAP32[(($3525)>>2)];
 var $3527=$3526;
 var $3528=(($3527+1)|0);
 HEAP8[($3528)]=$3523;
 label=586;break;
 case 565: 
 var $3530=$tmpB;
 var $3531=$2;
 var $3532=(($3531+24)|0);
 var $3533=HEAP32[(($3532)>>2)];
 var $3534=$3533;
 var $3535=(($3534)|0);
 HEAP8[($3535)]=$3530;
 label=586;break;
 case 566: 
 var $3537=$gotDD;
 var $3538=($3537|0)!=0;
 if($3538){label=567;break;}else{label=577;break;}
 case 567: 
 var $3540=$2;
 var $3541=(($3540+30)|0);
 var $3542=HEAP16[(($3541)>>1)];
 var $3543=($3542&65535);
 var $3544=((($3543)-(1))|0);
 var $3545=$3544&65535;
 var $3546=(($3545)&65535);
 var $3547=$2;
 var $3548=(($3547+30)|0);
 HEAP16[(($3548)>>1)]=$3546;
 label=568;break;
 case 568: 
 var $3550=$2;
 var $3551=(($3550+80)|0);
 var $3552=HEAP32[(($3551)>>2)];
 var $3553=($3552|0)!=0;
 if($3553){label=569;break;}else{label=574;break;}
 case 569: 
 $_f19=2;
 label=570;break;
 case 570: 
 var $3556=$_f19;
 var $3557=((($3556)-(1))|0);
 $_f19=$3557;
 var $3558=($3556|0)>0;
 if($3558){label=571;break;}else{label=573;break;}
 case 571: 
 label=572;break;
 case 572: 
 var $3561=$2;
 var $3562=(($3561+80)|0);
 var $3563=HEAP32[(($3562)>>2)];
 var $3564=$2;
 var $3565=$2;
 var $3566=(($3565+30)|0);
 var $3567=HEAP16[(($3566)>>1)];
 FUNCTION_TABLE[$3563]($3564,$3567,1,4,0);
 label=570;break;
 case 573: 
 label=575;break;
 case 574: 
 var $3570=$2;
 var $3571=(($3570+56)|0);
 var $3572=HEAP32[(($3571)>>2)];
 var $3573=((($3572)+(2))|0);
 HEAP32[(($3571)>>2)]=$3573;
 label=575;break;
 case 575: 
 label=576;break;
 case 576: 
 var $3576=$2;
 var $3577=(($3576+30)|0);
 var $3578=HEAP16[(($3577)>>1)];
 var $3579=($3578&65535);
 var $3580=((($3579)+(1))|0);
 var $3581=$3580&65535;
 var $3582=(($3581)&65535);
 var $3583=$2;
 var $3584=(($3583+30)|0);
 HEAP16[(($3584)>>1)]=$3582;
 label=577;break;
 case 577: 
 var $3586=$2;
 var $3587=(($3586+24)|0);
 var $3588=HEAP32[(($3587)>>2)];
 var $3589=$3588;
 var $3590=HEAP16[(($3589)>>1)];
 var $3591=($3590&65535);
 var $3592=$disp;
 var $3593=((($3591)+($3592))|0);
 var $3594=$3593&65535;
 var $3595=(($3594)&65535);
 $tmpW=$3595;
 label=578;break;
 case 578: 
 label=579;break;
 case 579: 
 var $3598=$2;
 var $3599=(($3598+80)|0);
 var $3600=HEAP32[(($3599)>>2)];
 var $3601=($3600|0)!=0;
 if($3601){label=580;break;}else{label=581;break;}
 case 580: 
 var $3603=$2;
 var $3604=(($3603+80)|0);
 var $3605=HEAP32[(($3604)>>2)];
 var $3606=$2;
 var $3607=$tmpW;
 FUNCTION_TABLE[$3605]($3606,$3607,3,3,16);
 label=582;break;
 case 581: 
 var $3609=$2;
 var $3610=(($3609+56)|0);
 var $3611=HEAP32[(($3610)>>2)];
 var $3612=((($3611)+(3))|0);
 HEAP32[(($3610)>>2)]=$3612;
 label=582;break;
 case 582: 
 label=583;break;
 case 583: 
 var $3615=$2;
 var $3616=(($3615+76)|0);
 var $3617=HEAP32[(($3616)>>2)];
 var $3618=$2;
 var $3619=$tmpW;
 var $3620=$tmpB;
 FUNCTION_TABLE[$3617]($3618,$3619,$3620,3);
 label=584;break;
 case 584: 
 label=586;break;
 case 585: 
 var $3623=$tmpB;
 var $3624=$2;
 var $3625=(($3624+6)|0);
 var $3626=$3625;
 var $3627=(($3626+1)|0);
 HEAP8[($3627)]=$3623;
 label=586;break;
 case 586: 
 label=597;break;
 case 587: 
 var $3630=$opcode;
 var $3631=($3630&255);
 var $3632=$3631>>3;
 var $3633=$3632&7;
 switch(($3633|0)){case 0:{ label=588;break;}case 1:{ label=589;break;}case 2:{ label=590;break;}case 3:{ label=591;break;}case 4:{ label=592;break;}case 5:{ label=593;break;}case 6:{ label=594;break;}case 7:{ label=595;break;}default:{label=596;break;}}break;
 case 588: 
 var $3635=$2;
 _ZYM_RLCA($3635);
 label=596;break;
 case 589: 
 var $3637=$2;
 _ZYM_RRCA($3637);
 label=596;break;
 case 590: 
 var $3639=$2;
 _ZYM_RLA($3639);
 label=596;break;
 case 591: 
 var $3641=$2;
 _ZYM_RRA($3641);
 label=596;break;
 case 592: 
 var $3643=$2;
 _ZYM_DAA($3643);
 label=596;break;
 case 593: 
 var $3645=$2;
 var $3646=(($3645+6)|0);
 var $3647=$3646;
 var $3648=(($3647+1)|0);
 var $3649=HEAP8[($3648)];
 var $3650=($3649&255);
 var $3651=$3650^255;
 var $3652=(($3651)&255);
 HEAP8[($3648)]=$3652;
 var $3653=$2;
 var $3654=(($3653+6)|0);
 var $3655=$3654;
 var $3656=(($3655+1)|0);
 var $3657=HEAP8[($3656)];
 var $3658=($3657&255);
 var $3659=$3658&40;
 var $3660=$3659|18;
 var $3661=$2;
 var $3662=(($3661+6)|0);
 var $3663=$3662;
 var $3664=(($3663)|0);
 var $3665=HEAP8[($3664)];
 var $3666=($3665&255);
 var $3667=$3666&197;
 var $3668=$3660|$3667;
 var $3669=(($3668)&255);
 var $3670=$2;
 var $3671=(($3670+6)|0);
 var $3672=$3671;
 var $3673=(($3672)|0);
 HEAP8[($3673)]=$3669;
 var $3674=$2;
 var $3675=(($3674+120)|0);
 HEAP8[($3675)]=0;
 label=596;break;
 case 594: 
 var $3677=$2;
 var $3678=(($3677+6)|0);
 var $3679=$3678;
 var $3680=(($3679)|0);
 var $3681=HEAP8[($3680)];
 var $3682=($3681&255);
 var $3683=$3682&196;
 var $3684=$2;
 var $3685=(($3684+6)|0);
 var $3686=$3685;
 var $3687=(($3686+1)|0);
 var $3688=HEAP8[($3687)];
 var $3689=($3688&255);
 var $3690=$oldflagsq;
 var $3691=($3690&255);
 var $3692=$3689|$3691;
 var $3693=$3692&40;
 var $3694=$3683|$3693;
 var $3695=$3694|1;
 var $3696=(($3695)&255);
 var $3697=$2;
 var $3698=(($3697+6)|0);
 var $3699=$3698;
 var $3700=(($3699)|0);
 HEAP8[($3700)]=$3696;
 var $3701=$2;
 var $3702=(($3701+120)|0);
 HEAP8[($3702)]=0;
 label=596;break;
 case 595: 
 var $3704=$2;
 var $3705=(($3704+6)|0);
 var $3706=$3705;
 var $3707=(($3706)|0);
 var $3708=HEAP8[($3707)];
 var $3709=($3708&255);
 var $3710=$3709&1;
 var $3711=(($3710)&255);
 $tmpB=$3711;
 var $3712=$2;
 var $3713=(($3712+6)|0);
 var $3714=$3713;
 var $3715=(($3714)|0);
 var $3716=HEAP8[($3715)];
 var $3717=($3716&255);
 var $3718=$3717&196;
 var $3719=$2;
 var $3720=(($3719+6)|0);
 var $3721=$3720;
 var $3722=(($3721+1)|0);
 var $3723=HEAP8[($3722)];
 var $3724=($3723&255);
 var $3725=$oldflagsq;
 var $3726=($3725&255);
 var $3727=$3724|$3726;
 var $3728=$3727&40;
 var $3729=$3718|$3728;
 var $3730=(($3729)&255);
 var $3731=$2;
 var $3732=(($3731+6)|0);
 var $3733=$3732;
 var $3734=(($3733)|0);
 HEAP8[($3734)]=$3730;
 var $3735=$tmpB;
 var $3736=($3735&255);
 var $3737=($3736|0)!=0;
 var $3738=($3737?16:1);
 var $3739=$2;
 var $3740=(($3739+6)|0);
 var $3741=$3740;
 var $3742=(($3741)|0);
 var $3743=HEAP8[($3742)];
 var $3744=($3743&255);
 var $3745=$3744|$3738;
 var $3746=(($3745)&255);
 HEAP8[($3742)]=$3746;
 var $3747=$2;
 var $3748=(($3747+120)|0);
 HEAP8[($3748)]=0;
 label=596;break;
 case 596: 
 label=597;break;
 case 597: 
 label=833;break;
 case 598: 
 var $3752=$opcode;
 var $3753=($3752&255);
 var $3754=($3753|0)==118;
 if($3754){label=599;break;}else{label=600;break;}
 case 599: 
 var $3756=$2;
 var $3757=(($3756+52)|0);
 HEAP32[(($3757)>>2)]=1;
 var $3758=$2;
 var $3759=(($3758+30)|0);
 var $3760=HEAP16[(($3759)>>1)];
 var $3761=($3760&65535);
 var $3762=((($3761)-(1))|0);
 var $3763=$3762&65535;
 var $3764=(($3763)&65535);
 var $3765=$2;
 var $3766=(($3765+30)|0);
 HEAP16[(($3766)>>1)]=$3764;
 label=2;break;
 case 600: 
 var $3768=$opcode;
 var $3769=($3768&255);
 var $3770=$3769&7;
 var $3771=(($3770)&255);
 $rsrc=$3771;
 var $3772=$opcode;
 var $3773=($3772&255);
 var $3774=$3773>>3;
 var $3775=$3774&7;
 var $3776=(($3775)&255);
 $rdst=$3776;
 var $3777=$rsrc;
 var $3778=($3777&255);
 switch(($3778|0)){case 0:{ label=601;break;}case 1:{ label=602;break;}case 2:{ label=603;break;}case 3:{ label=604;break;}case 4:{ label=605;break;}case 5:{ label=610;break;}case 6:{ label=615;break;}case 7:{ label=627;break;}default:{label=628;break;}}break;
 case 601: 
 var $3780=$2;
 var $3781=(($3780)|0);
 var $3782=$3781;
 var $3783=(($3782+1)|0);
 var $3784=HEAP8[($3783)];
 $tmpB=$3784;
 label=628;break;
 case 602: 
 var $3786=$2;
 var $3787=(($3786)|0);
 var $3788=$3787;
 var $3789=(($3788)|0);
 var $3790=HEAP8[($3789)];
 $tmpB=$3790;
 label=628;break;
 case 603: 
 var $3792=$2;
 var $3793=(($3792+2)|0);
 var $3794=$3793;
 var $3795=(($3794+1)|0);
 var $3796=HEAP8[($3795)];
 $tmpB=$3796;
 label=628;break;
 case 604: 
 var $3798=$2;
 var $3799=(($3798+2)|0);
 var $3800=$3799;
 var $3801=(($3800)|0);
 var $3802=HEAP8[($3801)];
 $tmpB=$3802;
 label=628;break;
 case 605: 
 var $3804=$gotDD;
 var $3805=($3804|0)!=0;
 if($3805){label=606;break;}else{label=608;break;}
 case 606: 
 var $3807=$rdst;
 var $3808=($3807&255);
 var $3809=($3808|0)==6;
 if($3809){label=607;break;}else{label=608;break;}
 case 607: 
 var $3811=$2;
 var $3812=(($3811+4)|0);
 var $3813=$3812;
 var $3814=(($3813+1)|0);
 var $3815=HEAP8[($3814)];
 var $3816=($3815&255);
 var $3826=$3816;label=609;break;
 case 608: 
 var $3818=$2;
 var $3819=(($3818+24)|0);
 var $3820=HEAP32[(($3819)>>2)];
 var $3821=$3820;
 var $3822=(($3821+1)|0);
 var $3823=HEAP8[($3822)];
 var $3824=($3823&255);
 var $3826=$3824;label=609;break;
 case 609: 
 var $3826;
 var $3827=(($3826)&255);
 $tmpB=$3827;
 label=628;break;
 case 610: 
 var $3829=$gotDD;
 var $3830=($3829|0)!=0;
 if($3830){label=611;break;}else{label=613;break;}
 case 611: 
 var $3832=$rdst;
 var $3833=($3832&255);
 var $3834=($3833|0)==6;
 if($3834){label=612;break;}else{label=613;break;}
 case 612: 
 var $3836=$2;
 var $3837=(($3836+4)|0);
 var $3838=$3837;
 var $3839=(($3838)|0);
 var $3840=HEAP8[($3839)];
 var $3841=($3840&255);
 var $3851=$3841;label=614;break;
 case 613: 
 var $3843=$2;
 var $3844=(($3843+24)|0);
 var $3845=HEAP32[(($3844)>>2)];
 var $3846=$3845;
 var $3847=(($3846)|0);
 var $3848=HEAP8[($3847)];
 var $3849=($3848&255);
 var $3851=$3849;label=614;break;
 case 614: 
 var $3851;
 var $3852=(($3851)&255);
 $tmpB=$3852;
 label=628;break;
 case 615: 
 var $3854=$gotDD;
 var $3855=($3854|0)!=0;
 if($3855){label=616;break;}else{label=626;break;}
 case 616: 
 var $3857=$2;
 var $3858=(($3857+30)|0);
 var $3859=HEAP16[(($3858)>>1)];
 var $3860=($3859&65535);
 var $3861=((($3860)-(1))|0);
 var $3862=$3861&65535;
 var $3863=(($3862)&65535);
 var $3864=$2;
 var $3865=(($3864+30)|0);
 HEAP16[(($3865)>>1)]=$3863;
 label=617;break;
 case 617: 
 var $3867=$2;
 var $3868=(($3867+80)|0);
 var $3869=HEAP32[(($3868)>>2)];
 var $3870=($3869|0)!=0;
 if($3870){label=618;break;}else{label=623;break;}
 case 618: 
 $_f20=5;
 label=619;break;
 case 619: 
 var $3873=$_f20;
 var $3874=((($3873)-(1))|0);
 $_f20=$3874;
 var $3875=($3873|0)>0;
 if($3875){label=620;break;}else{label=622;break;}
 case 620: 
 label=621;break;
 case 621: 
 var $3878=$2;
 var $3879=(($3878+80)|0);
 var $3880=HEAP32[(($3879)>>2)];
 var $3881=$2;
 var $3882=$2;
 var $3883=(($3882+30)|0);
 var $3884=HEAP16[(($3883)>>1)];
 FUNCTION_TABLE[$3880]($3881,$3884,1,4,0);
 label=619;break;
 case 622: 
 label=624;break;
 case 623: 
 var $3887=$2;
 var $3888=(($3887+56)|0);
 var $3889=HEAP32[(($3888)>>2)];
 var $3890=((($3889)+(5))|0);
 HEAP32[(($3888)>>2)]=$3890;
 label=624;break;
 case 624: 
 label=625;break;
 case 625: 
 var $3893=$2;
 var $3894=(($3893+30)|0);
 var $3895=HEAP16[(($3894)>>1)];
 var $3896=($3895&65535);
 var $3897=((($3896)+(1))|0);
 var $3898=$3897&65535;
 var $3899=(($3898)&65535);
 var $3900=$2;
 var $3901=(($3900+30)|0);
 HEAP16[(($3901)>>1)]=$3899;
 label=626;break;
 case 626: 
 var $3903=$2;
 var $3904=(($3903+24)|0);
 var $3905=HEAP32[(($3904)>>2)];
 var $3906=$3905;
 var $3907=HEAP16[(($3906)>>1)];
 var $3908=($3907&65535);
 var $3909=$disp;
 var $3910=((($3908)+($3909))|0);
 var $3911=$3910&65535;
 var $3912=(($3911)&65535);
 $tmpW=$3912;
 var $3913=$2;
 var $3914=$tmpW;
 var $3915=_z80_peekb_3ts($3913,$3914);
 $tmpB=$3915;
 label=628;break;
 case 627: 
 var $3917=$2;
 var $3918=(($3917+6)|0);
 var $3919=$3918;
 var $3920=(($3919+1)|0);
 var $3921=HEAP8[($3920)];
 $tmpB=$3921;
 label=628;break;
 case 628: 
 var $3923=$rdst;
 var $3924=($3923&255);
 switch(($3924|0)){case 0:{ label=629;break;}case 1:{ label=630;break;}case 2:{ label=631;break;}case 3:{ label=632;break;}case 4:{ label=633;break;}case 5:{ label=638;break;}case 6:{ label=643;break;}case 7:{ label=662;break;}default:{label=663;break;}}break;
 case 629: 
 var $3926=$tmpB;
 var $3927=$2;
 var $3928=(($3927)|0);
 var $3929=$3928;
 var $3930=(($3929+1)|0);
 HEAP8[($3930)]=$3926;
 label=663;break;
 case 630: 
 var $3932=$tmpB;
 var $3933=$2;
 var $3934=(($3933)|0);
 var $3935=$3934;
 var $3936=(($3935)|0);
 HEAP8[($3936)]=$3932;
 label=663;break;
 case 631: 
 var $3938=$tmpB;
 var $3939=$2;
 var $3940=(($3939+2)|0);
 var $3941=$3940;
 var $3942=(($3941+1)|0);
 HEAP8[($3942)]=$3938;
 label=663;break;
 case 632: 
 var $3944=$tmpB;
 var $3945=$2;
 var $3946=(($3945+2)|0);
 var $3947=$3946;
 var $3948=(($3947)|0);
 HEAP8[($3948)]=$3944;
 label=663;break;
 case 633: 
 var $3950=$gotDD;
 var $3951=($3950|0)!=0;
 if($3951){label=634;break;}else{label=636;break;}
 case 634: 
 var $3953=$rsrc;
 var $3954=($3953&255);
 var $3955=($3954|0)==6;
 if($3955){label=635;break;}else{label=636;break;}
 case 635: 
 var $3957=$tmpB;
 var $3958=$2;
 var $3959=(($3958+4)|0);
 var $3960=$3959;
 var $3961=(($3960+1)|0);
 HEAP8[($3961)]=$3957;
 label=637;break;
 case 636: 
 var $3963=$tmpB;
 var $3964=$2;
 var $3965=(($3964+24)|0);
 var $3966=HEAP32[(($3965)>>2)];
 var $3967=$3966;
 var $3968=(($3967+1)|0);
 HEAP8[($3968)]=$3963;
 label=637;break;
 case 637: 
 label=663;break;
 case 638: 
 var $3971=$gotDD;
 var $3972=($3971|0)!=0;
 if($3972){label=639;break;}else{label=641;break;}
 case 639: 
 var $3974=$rsrc;
 var $3975=($3974&255);
 var $3976=($3975|0)==6;
 if($3976){label=640;break;}else{label=641;break;}
 case 640: 
 var $3978=$tmpB;
 var $3979=$2;
 var $3980=(($3979+4)|0);
 var $3981=$3980;
 var $3982=(($3981)|0);
 HEAP8[($3982)]=$3978;
 label=642;break;
 case 641: 
 var $3984=$tmpB;
 var $3985=$2;
 var $3986=(($3985+24)|0);
 var $3987=HEAP32[(($3986)>>2)];
 var $3988=$3987;
 var $3989=(($3988)|0);
 HEAP8[($3989)]=$3984;
 label=642;break;
 case 642: 
 label=663;break;
 case 643: 
 var $3992=$gotDD;
 var $3993=($3992|0)!=0;
 if($3993){label=644;break;}else{label=654;break;}
 case 644: 
 var $3995=$2;
 var $3996=(($3995+30)|0);
 var $3997=HEAP16[(($3996)>>1)];
 var $3998=($3997&65535);
 var $3999=((($3998)-(1))|0);
 var $4000=$3999&65535;
 var $4001=(($4000)&65535);
 var $4002=$2;
 var $4003=(($4002+30)|0);
 HEAP16[(($4003)>>1)]=$4001;
 label=645;break;
 case 645: 
 var $4005=$2;
 var $4006=(($4005+80)|0);
 var $4007=HEAP32[(($4006)>>2)];
 var $4008=($4007|0)!=0;
 if($4008){label=646;break;}else{label=651;break;}
 case 646: 
 $_f21=5;
 label=647;break;
 case 647: 
 var $4011=$_f21;
 var $4012=((($4011)-(1))|0);
 $_f21=$4012;
 var $4013=($4011|0)>0;
 if($4013){label=648;break;}else{label=650;break;}
 case 648: 
 label=649;break;
 case 649: 
 var $4016=$2;
 var $4017=(($4016+80)|0);
 var $4018=HEAP32[(($4017)>>2)];
 var $4019=$2;
 var $4020=$2;
 var $4021=(($4020+30)|0);
 var $4022=HEAP16[(($4021)>>1)];
 FUNCTION_TABLE[$4018]($4019,$4022,1,4,0);
 label=647;break;
 case 650: 
 label=652;break;
 case 651: 
 var $4025=$2;
 var $4026=(($4025+56)|0);
 var $4027=HEAP32[(($4026)>>2)];
 var $4028=((($4027)+(5))|0);
 HEAP32[(($4026)>>2)]=$4028;
 label=652;break;
 case 652: 
 label=653;break;
 case 653: 
 var $4031=$2;
 var $4032=(($4031+30)|0);
 var $4033=HEAP16[(($4032)>>1)];
 var $4034=($4033&65535);
 var $4035=((($4034)+(1))|0);
 var $4036=$4035&65535;
 var $4037=(($4036)&65535);
 var $4038=$2;
 var $4039=(($4038+30)|0);
 HEAP16[(($4039)>>1)]=$4037;
 label=654;break;
 case 654: 
 var $4041=$2;
 var $4042=(($4041+24)|0);
 var $4043=HEAP32[(($4042)>>2)];
 var $4044=$4043;
 var $4045=HEAP16[(($4044)>>1)];
 var $4046=($4045&65535);
 var $4047=$disp;
 var $4048=((($4046)+($4047))|0);
 var $4049=$4048&65535;
 var $4050=(($4049)&65535);
 $tmpW=$4050;
 label=655;break;
 case 655: 
 label=656;break;
 case 656: 
 var $4053=$2;
 var $4054=(($4053+80)|0);
 var $4055=HEAP32[(($4054)>>2)];
 var $4056=($4055|0)!=0;
 if($4056){label=657;break;}else{label=658;break;}
 case 657: 
 var $4058=$2;
 var $4059=(($4058+80)|0);
 var $4060=HEAP32[(($4059)>>2)];
 var $4061=$2;
 var $4062=$tmpW;
 FUNCTION_TABLE[$4060]($4061,$4062,3,3,16);
 label=659;break;
 case 658: 
 var $4064=$2;
 var $4065=(($4064+56)|0);
 var $4066=HEAP32[(($4065)>>2)];
 var $4067=((($4066)+(3))|0);
 HEAP32[(($4065)>>2)]=$4067;
 label=659;break;
 case 659: 
 label=660;break;
 case 660: 
 var $4070=$2;
 var $4071=(($4070+76)|0);
 var $4072=HEAP32[(($4071)>>2)];
 var $4073=$2;
 var $4074=$tmpW;
 var $4075=$tmpB;
 FUNCTION_TABLE[$4072]($4073,$4074,$4075,3);
 label=661;break;
 case 661: 
 label=663;break;
 case 662: 
 var $4078=$tmpB;
 var $4079=$2;
 var $4080=(($4079+6)|0);
 var $4081=$4080;
 var $4082=(($4081+1)|0);
 HEAP8[($4082)]=$4078;
 label=663;break;
 case 663: 
 label=833;break;
 case 664: 
 var $4085=$opcode;
 var $4086=($4085&255);
 var $4087=$4086&7;
 switch(($4087|0)){case 0:{ label=665;break;}case 1:{ label=666;break;}case 2:{ label=667;break;}case 3:{ label=668;break;}case 4:{ label=669;break;}case 5:{ label=670;break;}case 6:{ label=671;break;}case 7:{ label=683;break;}default:{label=684;break;}}break;
 case 665: 
 var $4089=$2;
 var $4090=(($4089)|0);
 var $4091=$4090;
 var $4092=(($4091+1)|0);
 var $4093=HEAP8[($4092)];
 $tmpB=$4093;
 label=684;break;
 case 666: 
 var $4095=$2;
 var $4096=(($4095)|0);
 var $4097=$4096;
 var $4098=(($4097)|0);
 var $4099=HEAP8[($4098)];
 $tmpB=$4099;
 label=684;break;
 case 667: 
 var $4101=$2;
 var $4102=(($4101+2)|0);
 var $4103=$4102;
 var $4104=(($4103+1)|0);
 var $4105=HEAP8[($4104)];
 $tmpB=$4105;
 label=684;break;
 case 668: 
 var $4107=$2;
 var $4108=(($4107+2)|0);
 var $4109=$4108;
 var $4110=(($4109)|0);
 var $4111=HEAP8[($4110)];
 $tmpB=$4111;
 label=684;break;
 case 669: 
 var $4113=$2;
 var $4114=(($4113+24)|0);
 var $4115=HEAP32[(($4114)>>2)];
 var $4116=$4115;
 var $4117=(($4116+1)|0);
 var $4118=HEAP8[($4117)];
 $tmpB=$4118;
 label=684;break;
 case 670: 
 var $4120=$2;
 var $4121=(($4120+24)|0);
 var $4122=HEAP32[(($4121)>>2)];
 var $4123=$4122;
 var $4124=(($4123)|0);
 var $4125=HEAP8[($4124)];
 $tmpB=$4125;
 label=684;break;
 case 671: 
 var $4127=$gotDD;
 var $4128=($4127|0)!=0;
 if($4128){label=672;break;}else{label=682;break;}
 case 672: 
 var $4130=$2;
 var $4131=(($4130+30)|0);
 var $4132=HEAP16[(($4131)>>1)];
 var $4133=($4132&65535);
 var $4134=((($4133)-(1))|0);
 var $4135=$4134&65535;
 var $4136=(($4135)&65535);
 var $4137=$2;
 var $4138=(($4137+30)|0);
 HEAP16[(($4138)>>1)]=$4136;
 label=673;break;
 case 673: 
 var $4140=$2;
 var $4141=(($4140+80)|0);
 var $4142=HEAP32[(($4141)>>2)];
 var $4143=($4142|0)!=0;
 if($4143){label=674;break;}else{label=679;break;}
 case 674: 
 $_f22=5;
 label=675;break;
 case 675: 
 var $4146=$_f22;
 var $4147=((($4146)-(1))|0);
 $_f22=$4147;
 var $4148=($4146|0)>0;
 if($4148){label=676;break;}else{label=678;break;}
 case 676: 
 label=677;break;
 case 677: 
 var $4151=$2;
 var $4152=(($4151+80)|0);
 var $4153=HEAP32[(($4152)>>2)];
 var $4154=$2;
 var $4155=$2;
 var $4156=(($4155+30)|0);
 var $4157=HEAP16[(($4156)>>1)];
 FUNCTION_TABLE[$4153]($4154,$4157,1,4,0);
 label=675;break;
 case 678: 
 label=680;break;
 case 679: 
 var $4160=$2;
 var $4161=(($4160+56)|0);
 var $4162=HEAP32[(($4161)>>2)];
 var $4163=((($4162)+(5))|0);
 HEAP32[(($4161)>>2)]=$4163;
 label=680;break;
 case 680: 
 label=681;break;
 case 681: 
 var $4166=$2;
 var $4167=(($4166+30)|0);
 var $4168=HEAP16[(($4167)>>1)];
 var $4169=($4168&65535);
 var $4170=((($4169)+(1))|0);
 var $4171=$4170&65535;
 var $4172=(($4171)&65535);
 var $4173=$2;
 var $4174=(($4173+30)|0);
 HEAP16[(($4174)>>1)]=$4172;
 label=682;break;
 case 682: 
 var $4176=$2;
 var $4177=(($4176+24)|0);
 var $4178=HEAP32[(($4177)>>2)];
 var $4179=$4178;
 var $4180=HEAP16[(($4179)>>1)];
 var $4181=($4180&65535);
 var $4182=$disp;
 var $4183=((($4181)+($4182))|0);
 var $4184=$4183&65535;
 var $4185=(($4184)&65535);
 $tmpW=$4185;
 var $4186=$2;
 var $4187=$tmpW;
 var $4188=_z80_peekb_3ts($4186,$4187);
 $tmpB=$4188;
 label=684;break;
 case 683: 
 var $4190=$2;
 var $4191=(($4190+6)|0);
 var $4192=$4191;
 var $4193=(($4192+1)|0);
 var $4194=HEAP8[($4193)];
 $tmpB=$4194;
 label=684;break;
 case 684: 
 var $4196=$opcode;
 var $4197=($4196&255);
 var $4198=$4197>>3;
 var $4199=$4198&7;
 switch(($4199|0)){case 0:{ label=685;break;}case 1:{ label=686;break;}case 2:{ label=687;break;}case 3:{ label=688;break;}case 4:{ label=689;break;}case 5:{ label=690;break;}case 6:{ label=691;break;}case 7:{ label=692;break;}default:{label=693;break;}}break;
 case 685: 
 var $4201=$2;
 var $4202=$tmpB;
 _ZYM_ADD_A($4201,$4202);
 label=693;break;
 case 686: 
 var $4204=$2;
 var $4205=$tmpB;
 _ZYM_ADC_A($4204,$4205);
 label=693;break;
 case 687: 
 var $4207=$2;
 var $4208=$tmpB;
 _ZYM_SUB_A($4207,$4208);
 label=693;break;
 case 688: 
 var $4210=$2;
 var $4211=$tmpB;
 _ZYM_SBC_A($4210,$4211);
 label=693;break;
 case 689: 
 var $4213=$tmpB;
 var $4214=($4213&255);
 var $4215=$2;
 var $4216=(($4215+6)|0);
 var $4217=$4216;
 var $4218=(($4217+1)|0);
 var $4219=HEAP8[($4218)];
 var $4220=($4219&255);
 var $4221=$4220&$4214;
 var $4222=(($4221)&255);
 HEAP8[($4218)]=$4222;
 var $4223=($4222&255);
 var $4224=((13296+$4223)|0);
 var $4225=HEAP8[($4224)];
 var $4226=($4225&255);
 var $4227=$4226|16;
 var $4228=(($4227)&255);
 var $4229=$2;
 var $4230=(($4229+6)|0);
 var $4231=$4230;
 var $4232=(($4231)|0);
 HEAP8[($4232)]=$4228;
 var $4233=$2;
 var $4234=(($4233+120)|0);
 HEAP8[($4234)]=0;
 label=693;break;
 case 690: 
 var $4236=$tmpB;
 var $4237=($4236&255);
 var $4238=$2;
 var $4239=(($4238+6)|0);
 var $4240=$4239;
 var $4241=(($4240+1)|0);
 var $4242=HEAP8[($4241)];
 var $4243=($4242&255);
 var $4244=$4243^$4237;
 var $4245=(($4244)&255);
 HEAP8[($4241)]=$4245;
 var $4246=($4245&255);
 var $4247=((13296+$4246)|0);
 var $4248=HEAP8[($4247)];
 var $4249=$2;
 var $4250=(($4249+6)|0);
 var $4251=$4250;
 var $4252=(($4251)|0);
 HEAP8[($4252)]=$4248;
 var $4253=$2;
 var $4254=(($4253+120)|0);
 HEAP8[($4254)]=0;
 label=693;break;
 case 691: 
 var $4256=$tmpB;
 var $4257=($4256&255);
 var $4258=$2;
 var $4259=(($4258+6)|0);
 var $4260=$4259;
 var $4261=(($4260+1)|0);
 var $4262=HEAP8[($4261)];
 var $4263=($4262&255);
 var $4264=$4263|$4257;
 var $4265=(($4264)&255);
 HEAP8[($4261)]=$4265;
 var $4266=($4265&255);
 var $4267=((13296+$4266)|0);
 var $4268=HEAP8[($4267)];
 var $4269=$2;
 var $4270=(($4269+6)|0);
 var $4271=$4270;
 var $4272=(($4271)|0);
 HEAP8[($4272)]=$4268;
 var $4273=$2;
 var $4274=(($4273+120)|0);
 HEAP8[($4274)]=0;
 label=693;break;
 case 692: 
 var $4276=$2;
 var $4277=$tmpB;
 _ZYM_CP_A($4276,$4277);
 label=693;break;
 case 693: 
 label=833;break;
 case 694: 
 var $4280=$opcode;
 var $4281=($4280&255);
 var $4282=$4281&7;
 switch(($4282|0)){case 0:{ label=695;break;}case 1:{ label=716;break;}case 2:{ label=741;break;}case 3:{ label=753;break;}case 4:{ label=780;break;}case 5:{ label=792;break;}case 6:{ label=812;break;}case 7:{ label=822;break;}default:{label=832;break;}}break;
 case 695: 
 label=696;break;
 case 696: 
 var $4285=$2;
 var $4286=(($4285+80)|0);
 var $4287=HEAP32[(($4286)>>2)];
 var $4288=($4287|0)!=0;
 if($4288){label=697;break;}else{label=702;break;}
 case 697: 
 $_f23=1;
 label=698;break;
 case 698: 
 var $4291=$_f23;
 var $4292=((($4291)-(1))|0);
 $_f23=$4292;
 var $4293=($4291|0)>0;
 if($4293){label=699;break;}else{label=701;break;}
 case 699: 
 label=700;break;
 case 700: 
 var $4296=$2;
 var $4297=(($4296+80)|0);
 var $4298=HEAP32[(($4297)>>2)];
 var $4299=$2;
 var $4300=$2;
 var $4301=(($4300+36)|0);
 var $4302=HEAP8[($4301)];
 var $4303=($4302&255);
 var $4304=($4303&65535);
 var $4305=$4304<<8;
 var $4306=$2;
 var $4307=(($4306+37)|0);
 var $4308=HEAP8[($4307)];
 var $4309=($4308&255);
 var $4310=$4305|$4309;
 var $4311=(($4310)&65535);
 FUNCTION_TABLE[$4298]($4299,$4311,1,4,0);
 label=698;break;
 case 701: 
 label=703;break;
 case 702: 
 var $4314=$2;
 var $4315=(($4314+56)|0);
 var $4316=HEAP32[(($4315)>>2)];
 var $4317=((($4316)+(1))|0);
 HEAP32[(($4315)>>2)]=$4317;
 label=703;break;
 case 703: 
 label=704;break;
 case 704: 
 var $4320=$opcode;
 var $4321=($4320&255);
 var $4322=$4321>>3;
 var $4323=$4322&7;
 switch(($4323|0)){case 0:{ label=705;break;}case 1:{ label=706;break;}case 2:{ label=707;break;}case 3:{ label=708;break;}case 4:{ label=709;break;}case 5:{ label=710;break;}case 6:{ label=711;break;}case 7:{ label=712;break;}default:{label=713;break;}}break;
 case 705: 
 var $4325=$2;
 var $4326=(($4325+6)|0);
 var $4327=$4326;
 var $4328=(($4327)|0);
 var $4329=HEAP8[($4328)];
 var $4330=($4329&255);
 var $4331=$4330&64;
 var $4332=($4331|0)==0;
 var $4333=($4332&1);
 $trueCC=$4333;
 label=713;break;
 case 706: 
 var $4335=$2;
 var $4336=(($4335+6)|0);
 var $4337=$4336;
 var $4338=(($4337)|0);
 var $4339=HEAP8[($4338)];
 var $4340=($4339&255);
 var $4341=$4340&64;
 var $4342=($4341|0)!=0;
 var $4343=($4342&1);
 $trueCC=$4343;
 label=713;break;
 case 707: 
 var $4345=$2;
 var $4346=(($4345+6)|0);
 var $4347=$4346;
 var $4348=(($4347)|0);
 var $4349=HEAP8[($4348)];
 var $4350=($4349&255);
 var $4351=$4350&1;
 var $4352=($4351|0)==0;
 var $4353=($4352&1);
 $trueCC=$4353;
 label=713;break;
 case 708: 
 var $4355=$2;
 var $4356=(($4355+6)|0);
 var $4357=$4356;
 var $4358=(($4357)|0);
 var $4359=HEAP8[($4358)];
 var $4360=($4359&255);
 var $4361=$4360&1;
 var $4362=($4361|0)!=0;
 var $4363=($4362&1);
 $trueCC=$4363;
 label=713;break;
 case 709: 
 var $4365=$2;
 var $4366=(($4365+6)|0);
 var $4367=$4366;
 var $4368=(($4367)|0);
 var $4369=HEAP8[($4368)];
 var $4370=($4369&255);
 var $4371=$4370&4;
 var $4372=($4371|0)==0;
 var $4373=($4372&1);
 $trueCC=$4373;
 label=713;break;
 case 710: 
 var $4375=$2;
 var $4376=(($4375+6)|0);
 var $4377=$4376;
 var $4378=(($4377)|0);
 var $4379=HEAP8[($4378)];
 var $4380=($4379&255);
 var $4381=$4380&4;
 var $4382=($4381|0)!=0;
 var $4383=($4382&1);
 $trueCC=$4383;
 label=713;break;
 case 711: 
 var $4385=$2;
 var $4386=(($4385+6)|0);
 var $4387=$4386;
 var $4388=(($4387)|0);
 var $4389=HEAP8[($4388)];
 var $4390=($4389&255);
 var $4391=$4390&128;
 var $4392=($4391|0)==0;
 var $4393=($4392&1);
 $trueCC=$4393;
 label=713;break;
 case 712: 
 var $4395=$2;
 var $4396=(($4395+6)|0);
 var $4397=$4396;
 var $4398=(($4397)|0);
 var $4399=HEAP8[($4398)];
 var $4400=($4399&255);
 var $4401=$4400&128;
 var $4402=($4401|0)!=0;
 var $4403=($4402&1);
 $trueCC=$4403;
 label=713;break;
 case 713: 
 var $4405=$trueCC;
 var $4406=($4405|0)!=0;
 if($4406){label=714;break;}else{label=715;break;}
 case 714: 
 var $4408=$2;
 var $4409=_z80_pop_6ts($4408);
 var $4410=$2;
 var $4411=(($4410+30)|0);
 HEAP16[(($4411)>>1)]=$4409;
 var $4412=$2;
 var $4413=(($4412+28)|0);
 var $4414=$4413;
 HEAP16[(($4414)>>1)]=$4409;
 label=715;break;
 case 715: 
 label=832;break;
 case 716: 
 var $4417=$opcode;
 var $4418=($4417&255);
 var $4419=$4418&8;
 var $4420=($4419|0)!=0;
 if($4420){label=717;break;}else{label=734;break;}
 case 717: 
 var $4422=$opcode;
 var $4423=($4422&255);
 var $4424=$4423>>4;
 var $4425=$4424&3;
 if(($4425|0)==0){ label=718;break;}else if(($4425|0)==1){ label=719;break;}else if(($4425|0)==2){ label=722;break;}else if(($4425|0)==3){ label=723;break;}else{label=733;break;}
 case 718: 
 var $4427=$2;
 var $4428=_z80_pop_6ts($4427);
 var $4429=$2;
 var $4430=(($4429+30)|0);
 HEAP16[(($4430)>>1)]=$4428;
 var $4431=$2;
 var $4432=(($4431+28)|0);
 var $4433=$4432;
 HEAP16[(($4433)>>1)]=$4428;
 label=733;break;
 case 719: 
 label=720;break;
 case 720: 
 var $4436=$2;
 var $4437=(($4436)|0);
 var $4438=$4437;
 var $4439=HEAP16[(($4438)>>1)];
 $t24=$4439;
 var $4440=$2;
 var $4441=(($4440+14)|0);
 var $4442=$4441;
 var $4443=HEAP16[(($4442)>>1)];
 var $4444=$2;
 var $4445=(($4444)|0);
 var $4446=$4445;
 HEAP16[(($4446)>>1)]=$4443;
 var $4447=$t24;
 var $4448=$2;
 var $4449=(($4448+14)|0);
 var $4450=$4449;
 HEAP16[(($4450)>>1)]=$4447;
 var $4451=$2;
 var $4452=(($4451+2)|0);
 var $4453=$4452;
 var $4454=HEAP16[(($4453)>>1)];
 $t24=$4454;
 var $4455=$2;
 var $4456=(($4455+16)|0);
 var $4457=$4456;
 var $4458=HEAP16[(($4457)>>1)];
 var $4459=$2;
 var $4460=(($4459+2)|0);
 var $4461=$4460;
 HEAP16[(($4461)>>1)]=$4458;
 var $4462=$t24;
 var $4463=$2;
 var $4464=(($4463+16)|0);
 var $4465=$4464;
 HEAP16[(($4465)>>1)]=$4462;
 var $4466=$2;
 var $4467=(($4466+4)|0);
 var $4468=$4467;
 var $4469=HEAP16[(($4468)>>1)];
 $t24=$4469;
 var $4470=$2;
 var $4471=(($4470+18)|0);
 var $4472=$4471;
 var $4473=HEAP16[(($4472)>>1)];
 var $4474=$2;
 var $4475=(($4474+4)|0);
 var $4476=$4475;
 HEAP16[(($4476)>>1)]=$4473;
 var $4477=$t24;
 var $4478=$2;
 var $4479=(($4478+18)|0);
 var $4480=$4479;
 HEAP16[(($4480)>>1)]=$4477;
 label=721;break;
 case 721: 
 label=733;break;
 case 722: 
 var $4483=$2;
 var $4484=(($4483+24)|0);
 var $4485=HEAP32[(($4484)>>2)];
 var $4486=$4485;
 var $4487=HEAP16[(($4486)>>1)];
 var $4488=$2;
 var $4489=(($4488+30)|0);
 HEAP16[(($4489)>>1)]=$4487;
 label=733;break;
 case 723: 
 label=724;break;
 case 724: 
 var $4492=$2;
 var $4493=(($4492+80)|0);
 var $4494=HEAP32[(($4493)>>2)];
 var $4495=($4494|0)!=0;
 if($4495){label=725;break;}else{label=730;break;}
 case 725: 
 $_f25=2;
 label=726;break;
 case 726: 
 var $4498=$_f25;
 var $4499=((($4498)-(1))|0);
 $_f25=$4499;
 var $4500=($4498|0)>0;
 if($4500){label=727;break;}else{label=729;break;}
 case 727: 
 label=728;break;
 case 728: 
 var $4503=$2;
 var $4504=(($4503+80)|0);
 var $4505=HEAP32[(($4504)>>2)];
 var $4506=$2;
 var $4507=$2;
 var $4508=(($4507+36)|0);
 var $4509=HEAP8[($4508)];
 var $4510=($4509&255);
 var $4511=($4510&65535);
 var $4512=$4511<<8;
 var $4513=$2;
 var $4514=(($4513+37)|0);
 var $4515=HEAP8[($4514)];
 var $4516=($4515&255);
 var $4517=$4512|$4516;
 var $4518=(($4517)&65535);
 FUNCTION_TABLE[$4505]($4506,$4518,1,4,0);
 label=726;break;
 case 729: 
 label=731;break;
 case 730: 
 var $4521=$2;
 var $4522=(($4521+56)|0);
 var $4523=HEAP32[(($4522)>>2)];
 var $4524=((($4523)+(2))|0);
 HEAP32[(($4522)>>2)]=$4524;
 label=731;break;
 case 731: 
 label=732;break;
 case 732: 
 var $4527=$2;
 var $4528=(($4527+24)|0);
 var $4529=HEAP32[(($4528)>>2)];
 var $4530=$4529;
 var $4531=HEAP16[(($4530)>>1)];
 var $4532=$2;
 var $4533=(($4532+8)|0);
 var $4534=$4533;
 HEAP16[(($4534)>>1)]=$4531;
 label=733;break;
 case 733: 
 label=740;break;
 case 734: 
 var $4537=$2;
 var $4538=_z80_pop_6ts($4537);
 $tmpW=$4538;
 var $4539=$opcode;
 var $4540=($4539&255);
 var $4541=$4540>>4;
 var $4542=$4541&3;
 if(($4542|0)==0){ label=735;break;}else if(($4542|0)==1){ label=736;break;}else if(($4542|0)==2){ label=737;break;}else if(($4542|0)==3){ label=738;break;}else{label=739;break;}
 case 735: 
 var $4544=$tmpW;
 var $4545=$2;
 var $4546=(($4545)|0);
 var $4547=$4546;
 HEAP16[(($4547)>>1)]=$4544;
 label=739;break;
 case 736: 
 var $4549=$tmpW;
 var $4550=$2;
 var $4551=(($4550+2)|0);
 var $4552=$4551;
 HEAP16[(($4552)>>1)]=$4549;
 label=739;break;
 case 737: 
 var $4554=$tmpW;
 var $4555=$2;
 var $4556=(($4555+24)|0);
 var $4557=HEAP32[(($4556)>>2)];
 var $4558=$4557;
 HEAP16[(($4558)>>1)]=$4554;
 label=739;break;
 case 738: 
 var $4560=$tmpW;
 var $4561=$2;
 var $4562=(($4561+6)|0);
 var $4563=$4562;
 HEAP16[(($4563)>>1)]=$4560;
 var $4564=$2;
 var $4565=(($4564+6)|0);
 var $4566=$4565;
 var $4567=(($4566)|0);
 var $4568=HEAP8[($4567)];
 var $4569=$2;
 var $4570=(($4569+120)|0);
 HEAP8[($4570)]=$4568;
 label=739;break;
 case 739: 
 label=740;break;
 case 740: 
 label=832;break;
 case 741: 
 var $4574=$opcode;
 var $4575=($4574&255);
 var $4576=$4575>>3;
 var $4577=$4576&7;
 switch(($4577|0)){case 0:{ label=742;break;}case 1:{ label=743;break;}case 2:{ label=744;break;}case 3:{ label=745;break;}case 4:{ label=746;break;}case 5:{ label=747;break;}case 6:{ label=748;break;}case 7:{ label=749;break;}default:{label=750;break;}}break;
 case 742: 
 var $4579=$2;
 var $4580=(($4579+6)|0);
 var $4581=$4580;
 var $4582=(($4581)|0);
 var $4583=HEAP8[($4582)];
 var $4584=($4583&255);
 var $4585=$4584&64;
 var $4586=($4585|0)==0;
 var $4587=($4586&1);
 $trueCC=$4587;
 label=750;break;
 case 743: 
 var $4589=$2;
 var $4590=(($4589+6)|0);
 var $4591=$4590;
 var $4592=(($4591)|0);
 var $4593=HEAP8[($4592)];
 var $4594=($4593&255);
 var $4595=$4594&64;
 var $4596=($4595|0)!=0;
 var $4597=($4596&1);
 $trueCC=$4597;
 label=750;break;
 case 744: 
 var $4599=$2;
 var $4600=(($4599+6)|0);
 var $4601=$4600;
 var $4602=(($4601)|0);
 var $4603=HEAP8[($4602)];
 var $4604=($4603&255);
 var $4605=$4604&1;
 var $4606=($4605|0)==0;
 var $4607=($4606&1);
 $trueCC=$4607;
 label=750;break;
 case 745: 
 var $4609=$2;
 var $4610=(($4609+6)|0);
 var $4611=$4610;
 var $4612=(($4611)|0);
 var $4613=HEAP8[($4612)];
 var $4614=($4613&255);
 var $4615=$4614&1;
 var $4616=($4615|0)!=0;
 var $4617=($4616&1);
 $trueCC=$4617;
 label=750;break;
 case 746: 
 var $4619=$2;
 var $4620=(($4619+6)|0);
 var $4621=$4620;
 var $4622=(($4621)|0);
 var $4623=HEAP8[($4622)];
 var $4624=($4623&255);
 var $4625=$4624&4;
 var $4626=($4625|0)==0;
 var $4627=($4626&1);
 $trueCC=$4627;
 label=750;break;
 case 747: 
 var $4629=$2;
 var $4630=(($4629+6)|0);
 var $4631=$4630;
 var $4632=(($4631)|0);
 var $4633=HEAP8[($4632)];
 var $4634=($4633&255);
 var $4635=$4634&4;
 var $4636=($4635|0)!=0;
 var $4637=($4636&1);
 $trueCC=$4637;
 label=750;break;
 case 748: 
 var $4639=$2;
 var $4640=(($4639+6)|0);
 var $4641=$4640;
 var $4642=(($4641)|0);
 var $4643=HEAP8[($4642)];
 var $4644=($4643&255);
 var $4645=$4644&128;
 var $4646=($4645|0)==0;
 var $4647=($4646&1);
 $trueCC=$4647;
 label=750;break;
 case 749: 
 var $4649=$2;
 var $4650=(($4649+6)|0);
 var $4651=$4650;
 var $4652=(($4651)|0);
 var $4653=HEAP8[($4652)];
 var $4654=($4653&255);
 var $4655=$4654&128;
 var $4656=($4655|0)!=0;
 var $4657=($4656&1);
 $trueCC=$4657;
 label=750;break;
 case 750: 
 var $4659=$2;
 var $4660=_z80_getpcw($4659,0);
 var $4661=$2;
 var $4662=(($4661+28)|0);
 var $4663=$4662;
 HEAP16[(($4663)>>1)]=$4660;
 var $4664=$trueCC;
 var $4665=($4664|0)!=0;
 if($4665){label=751;break;}else{label=752;break;}
 case 751: 
 var $4667=$2;
 var $4668=(($4667+28)|0);
 var $4669=$4668;
 var $4670=HEAP16[(($4669)>>1)];
 var $4671=$2;
 var $4672=(($4671+30)|0);
 HEAP16[(($4672)>>1)]=$4670;
 label=752;break;
 case 752: 
 label=832;break;
 case 753: 
 var $4675=$opcode;
 var $4676=($4675&255);
 var $4677=$4676>>3;
 var $4678=$4677&7;
 switch(($4678|0)){case 0:{ label=754;break;}case 2:{ label=755;break;}case 3:{ label=756;break;}case 4:{ label=757;break;}case 5:{ label=776;break;}case 6:{ label=777;break;}case 7:{ label=778;break;}default:{label=779;break;}}break;
 case 754: 
 var $4680=$2;
 var $4681=_z80_getpcw($4680,0);
 var $4682=$2;
 var $4683=(($4682+30)|0);
 HEAP16[(($4683)>>1)]=$4681;
 var $4684=$2;
 var $4685=(($4684+28)|0);
 var $4686=$4685;
 HEAP16[(($4686)>>1)]=$4681;
 label=779;break;
 case 755: 
 var $4688=$2;
 var $4689=$2;
 var $4690=(($4689+30)|0);
 var $4691=HEAP16[(($4690)>>1)];
 var $4692=_z80_peekb_3ts_args($4688,$4691);
 var $4693=($4692&255);
 $tmpW=$4693;
 var $4694=$2;
 var $4695=(($4694+30)|0);
 var $4696=HEAP16[(($4695)>>1)];
 var $4697=($4696&65535);
 var $4698=((($4697)+(1))|0);
 var $4699=$4698&65535;
 var $4700=(($4699)&65535);
 var $4701=$2;
 var $4702=(($4701+30)|0);
 HEAP16[(($4702)>>1)]=$4700;
 var $4703=$tmpW;
 var $4704=($4703&65535);
 var $4705=((($4704)+(1))|0);
 var $4706=$4705&255;
 var $4707=(($4706)&255);
 var $4708=$2;
 var $4709=(($4708+28)|0);
 var $4710=$4709;
 var $4711=(($4710)|0);
 HEAP8[($4711)]=$4707;
 var $4712=$2;
 var $4713=(($4712+6)|0);
 var $4714=$4713;
 var $4715=(($4714+1)|0);
 var $4716=HEAP8[($4715)];
 var $4717=$2;
 var $4718=(($4717+28)|0);
 var $4719=$4718;
 var $4720=(($4719+1)|0);
 HEAP8[($4720)]=$4716;
 var $4721=$2;
 var $4722=(($4721+6)|0);
 var $4723=$4722;
 var $4724=(($4723+1)|0);
 var $4725=HEAP8[($4724)];
 var $4726=($4725&255);
 var $4727=($4726&65535);
 var $4728=$4727<<8;
 var $4729=$tmpW;
 var $4730=($4729&65535);
 var $4731=$4730|$4728;
 var $4732=(($4731)&65535);
 $tmpW=$4732;
 var $4733=$2;
 var $4734=$tmpW;
 var $4735=$2;
 var $4736=(($4735+6)|0);
 var $4737=$4736;
 var $4738=(($4737+1)|0);
 var $4739=HEAP8[($4738)];
 _z80_port_write($4733,$4734,$4739);
 label=779;break;
 case 756: 
 var $4741=$2;
 var $4742=(($4741+6)|0);
 var $4743=$4742;
 var $4744=(($4743+1)|0);
 var $4745=HEAP8[($4744)];
 var $4746=($4745&255);
 var $4747=($4746&65535);
 var $4748=$4747<<8;
 var $4749=$2;
 var $4750=$2;
 var $4751=(($4750+30)|0);
 var $4752=HEAP16[(($4751)>>1)];
 var $4753=_z80_peekb_3ts_args($4749,$4752);
 var $4754=($4753&255);
 var $4755=$4748|$4754;
 var $4756=(($4755)&65535);
 $tmpW=$4756;
 var $4757=$2;
 var $4758=(($4757+30)|0);
 var $4759=HEAP16[(($4758)>>1)];
 var $4760=($4759&65535);
 var $4761=((($4760)+(1))|0);
 var $4762=$4761&65535;
 var $4763=(($4762)&65535);
 var $4764=$2;
 var $4765=(($4764+30)|0);
 HEAP16[(($4765)>>1)]=$4763;
 var $4766=$tmpW;
 var $4767=($4766&65535);
 var $4768=((($4767)+(1))|0);
 var $4769=$4768&65535;
 var $4770=(($4769)&65535);
 var $4771=$2;
 var $4772=(($4771+28)|0);
 var $4773=$4772;
 HEAP16[(($4773)>>1)]=$4770;
 var $4774=$2;
 var $4775=$tmpW;
 var $4776=_z80_port_read($4774,$4775);
 var $4777=$2;
 var $4778=(($4777+6)|0);
 var $4779=$4778;
 var $4780=(($4779+1)|0);
 HEAP8[($4780)]=$4776;
 label=779;break;
 case 757: 
 var $4782=$2;
 var $4783=$2;
 var $4784=(($4783+8)|0);
 var $4785=$4784;
 var $4786=HEAP16[(($4785)>>1)];
 var $4787=_z80_peekw_6ts($4782,$4786);
 $tmpW=$4787;
 label=758;break;
 case 758: 
 var $4789=$2;
 var $4790=(($4789+80)|0);
 var $4791=HEAP32[(($4790)>>2)];
 var $4792=($4791|0)!=0;
 if($4792){label=759;break;}else{label=764;break;}
 case 759: 
 $_f26=1;
 label=760;break;
 case 760: 
 var $4795=$_f26;
 var $4796=((($4795)-(1))|0);
 $_f26=$4796;
 var $4797=($4795|0)>0;
 if($4797){label=761;break;}else{label=763;break;}
 case 761: 
 label=762;break;
 case 762: 
 var $4800=$2;
 var $4801=(($4800+80)|0);
 var $4802=HEAP32[(($4801)>>2)];
 var $4803=$2;
 var $4804=$2;
 var $4805=(($4804+8)|0);
 var $4806=$4805;
 var $4807=HEAP16[(($4806)>>1)];
 var $4808=($4807&65535);
 var $4809=((($4808)+(1))|0);
 var $4810=$4809&65535;
 var $4811=(($4810)&65535);
 FUNCTION_TABLE[$4802]($4803,$4811,1,4,0);
 label=760;break;
 case 763: 
 label=765;break;
 case 764: 
 var $4814=$2;
 var $4815=(($4814+56)|0);
 var $4816=HEAP32[(($4815)>>2)];
 var $4817=((($4816)+(1))|0);
 HEAP32[(($4815)>>2)]=$4817;
 label=765;break;
 case 765: 
 label=766;break;
 case 766: 
 var $4820=$2;
 var $4821=$2;
 var $4822=(($4821+8)|0);
 var $4823=$4822;
 var $4824=HEAP16[(($4823)>>1)];
 var $4825=$2;
 var $4826=(($4825+24)|0);
 var $4827=HEAP32[(($4826)>>2)];
 var $4828=$4827;
 var $4829=HEAP16[(($4828)>>1)];
 _z80_pokew_6ts_inverted($4820,$4824,$4829);
 label=767;break;
 case 767: 
 var $4831=$2;
 var $4832=(($4831+80)|0);
 var $4833=HEAP32[(($4832)>>2)];
 var $4834=($4833|0)!=0;
 if($4834){label=768;break;}else{label=773;break;}
 case 768: 
 $_f27=2;
 label=769;break;
 case 769: 
 var $4837=$_f27;
 var $4838=((($4837)-(1))|0);
 $_f27=$4838;
 var $4839=($4837|0)>0;
 if($4839){label=770;break;}else{label=772;break;}
 case 770: 
 label=771;break;
 case 771: 
 var $4842=$2;
 var $4843=(($4842+80)|0);
 var $4844=HEAP32[(($4843)>>2)];
 var $4845=$2;
 var $4846=$2;
 var $4847=(($4846+8)|0);
 var $4848=$4847;
 var $4849=HEAP16[(($4848)>>1)];
 FUNCTION_TABLE[$4844]($4845,$4849,1,4,0);
 label=769;break;
 case 772: 
 label=774;break;
 case 773: 
 var $4852=$2;
 var $4853=(($4852+56)|0);
 var $4854=HEAP32[(($4853)>>2)];
 var $4855=((($4854)+(2))|0);
 HEAP32[(($4853)>>2)]=$4855;
 label=774;break;
 case 774: 
 label=775;break;
 case 775: 
 var $4858=$tmpW;
 var $4859=$2;
 var $4860=(($4859+24)|0);
 var $4861=HEAP32[(($4860)>>2)];
 var $4862=$4861;
 HEAP16[(($4862)>>1)]=$4858;
 var $4863=$2;
 var $4864=(($4863+28)|0);
 var $4865=$4864;
 HEAP16[(($4865)>>1)]=$4858;
 label=779;break;
 case 776: 
 var $4867=$2;
 var $4868=(($4867+2)|0);
 var $4869=$4868;
 var $4870=HEAP16[(($4869)>>1)];
 $tmpW=$4870;
 var $4871=$2;
 var $4872=(($4871+4)|0);
 var $4873=$4872;
 var $4874=HEAP16[(($4873)>>1)];
 var $4875=$2;
 var $4876=(($4875+2)|0);
 var $4877=$4876;
 HEAP16[(($4877)>>1)]=$4874;
 var $4878=$tmpW;
 var $4879=$2;
 var $4880=(($4879+4)|0);
 var $4881=$4880;
 HEAP16[(($4881)>>1)]=$4878;
 label=779;break;
 case 777: 
 var $4883=$2;
 var $4884=(($4883+44)|0);
 HEAP32[(($4884)>>2)]=0;
 var $4885=$2;
 var $4886=(($4885+40)|0);
 HEAP32[(($4886)>>2)]=0;
 label=779;break;
 case 778: 
 var $4888=$2;
 var $4889=(($4888+44)|0);
 HEAP32[(($4889)>>2)]=1;
 var $4890=$2;
 var $4891=(($4890+40)|0);
 HEAP32[(($4891)>>2)]=1;
 var $4892=$2;
 var $4893=(($4892+64)|0);
 HEAP32[(($4893)>>2)]=1;
 label=779;break;
 case 779: 
 label=832;break;
 case 780: 
 var $4896=$opcode;
 var $4897=($4896&255);
 var $4898=$4897>>3;
 var $4899=$4898&7;
 switch(($4899|0)){case 0:{ label=781;break;}case 1:{ label=782;break;}case 2:{ label=783;break;}case 3:{ label=784;break;}case 4:{ label=785;break;}case 5:{ label=786;break;}case 6:{ label=787;break;}case 7:{ label=788;break;}default:{label=789;break;}}break;
 case 781: 
 var $4901=$2;
 var $4902=(($4901+6)|0);
 var $4903=$4902;
 var $4904=(($4903)|0);
 var $4905=HEAP8[($4904)];
 var $4906=($4905&255);
 var $4907=$4906&64;
 var $4908=($4907|0)==0;
 var $4909=($4908&1);
 $trueCC=$4909;
 label=789;break;
 case 782: 
 var $4911=$2;
 var $4912=(($4911+6)|0);
 var $4913=$4912;
 var $4914=(($4913)|0);
 var $4915=HEAP8[($4914)];
 var $4916=($4915&255);
 var $4917=$4916&64;
 var $4918=($4917|0)!=0;
 var $4919=($4918&1);
 $trueCC=$4919;
 label=789;break;
 case 783: 
 var $4921=$2;
 var $4922=(($4921+6)|0);
 var $4923=$4922;
 var $4924=(($4923)|0);
 var $4925=HEAP8[($4924)];
 var $4926=($4925&255);
 var $4927=$4926&1;
 var $4928=($4927|0)==0;
 var $4929=($4928&1);
 $trueCC=$4929;
 label=789;break;
 case 784: 
 var $4931=$2;
 var $4932=(($4931+6)|0);
 var $4933=$4932;
 var $4934=(($4933)|0);
 var $4935=HEAP8[($4934)];
 var $4936=($4935&255);
 var $4937=$4936&1;
 var $4938=($4937|0)!=0;
 var $4939=($4938&1);
 $trueCC=$4939;
 label=789;break;
 case 785: 
 var $4941=$2;
 var $4942=(($4941+6)|0);
 var $4943=$4942;
 var $4944=(($4943)|0);
 var $4945=HEAP8[($4944)];
 var $4946=($4945&255);
 var $4947=$4946&4;
 var $4948=($4947|0)==0;
 var $4949=($4948&1);
 $trueCC=$4949;
 label=789;break;
 case 786: 
 var $4951=$2;
 var $4952=(($4951+6)|0);
 var $4953=$4952;
 var $4954=(($4953)|0);
 var $4955=HEAP8[($4954)];
 var $4956=($4955&255);
 var $4957=$4956&4;
 var $4958=($4957|0)!=0;
 var $4959=($4958&1);
 $trueCC=$4959;
 label=789;break;
 case 787: 
 var $4961=$2;
 var $4962=(($4961+6)|0);
 var $4963=$4962;
 var $4964=(($4963)|0);
 var $4965=HEAP8[($4964)];
 var $4966=($4965&255);
 var $4967=$4966&128;
 var $4968=($4967|0)==0;
 var $4969=($4968&1);
 $trueCC=$4969;
 label=789;break;
 case 788: 
 var $4971=$2;
 var $4972=(($4971+6)|0);
 var $4973=$4972;
 var $4974=(($4973)|0);
 var $4975=HEAP8[($4974)];
 var $4976=($4975&255);
 var $4977=$4976&128;
 var $4978=($4977|0)!=0;
 var $4979=($4978&1);
 $trueCC=$4979;
 label=789;break;
 case 789: 
 var $4981=$2;
 var $4982=$trueCC;
 var $4983=_z80_getpcw($4981,$4982);
 var $4984=$2;
 var $4985=(($4984+28)|0);
 var $4986=$4985;
 HEAP16[(($4986)>>1)]=$4983;
 var $4987=$trueCC;
 var $4988=($4987|0)!=0;
 if($4988){label=790;break;}else{label=791;break;}
 case 790: 
 var $4990=$2;
 var $4991=$2;
 var $4992=(($4991+30)|0);
 var $4993=HEAP16[(($4992)>>1)];
 _z80_push_6ts($4990,$4993);
 var $4994=$2;
 var $4995=(($4994+28)|0);
 var $4996=$4995;
 var $4997=HEAP16[(($4996)>>1)];
 var $4998=$2;
 var $4999=(($4998+30)|0);
 HEAP16[(($4999)>>1)]=$4997;
 label=791;break;
 case 791: 
 label=832;break;
 case 792: 
 var $5002=$opcode;
 var $5003=($5002&255);
 var $5004=$5003&8;
 var $5005=($5004|0)!=0;
 if($5005){label=793;break;}else{label=796;break;}
 case 793: 
 var $5007=$opcode;
 var $5008=($5007&255);
 var $5009=$5008>>4;
 var $5010=$5009&3;
 var $5011=($5010|0)==0;
 if($5011){label=794;break;}else{label=795;break;}
 case 794: 
 var $5013=$2;
 var $5014=_z80_getpcw($5013,1);
 $tmpW=$5014;
 var $5015=$2;
 var $5016=(($5015+28)|0);
 var $5017=$5016;
 HEAP16[(($5017)>>1)]=$5014;
 var $5018=$2;
 var $5019=$2;
 var $5020=(($5019+30)|0);
 var $5021=HEAP16[(($5020)>>1)];
 _z80_push_6ts($5018,$5021);
 var $5022=$tmpW;
 var $5023=$2;
 var $5024=(($5023+30)|0);
 HEAP16[(($5024)>>1)]=$5022;
 label=795;break;
 case 795: 
 label=811;break;
 case 796: 
 label=797;break;
 case 797: 
 var $5028=$2;
 var $5029=(($5028+80)|0);
 var $5030=HEAP32[(($5029)>>2)];
 var $5031=($5030|0)!=0;
 if($5031){label=798;break;}else{label=803;break;}
 case 798: 
 $_f28=1;
 label=799;break;
 case 799: 
 var $5034=$_f28;
 var $5035=((($5034)-(1))|0);
 $_f28=$5035;
 var $5036=($5034|0)>0;
 if($5036){label=800;break;}else{label=802;break;}
 case 800: 
 label=801;break;
 case 801: 
 var $5039=$2;
 var $5040=(($5039+80)|0);
 var $5041=HEAP32[(($5040)>>2)];
 var $5042=$2;
 var $5043=$2;
 var $5044=(($5043+36)|0);
 var $5045=HEAP8[($5044)];
 var $5046=($5045&255);
 var $5047=($5046&65535);
 var $5048=$5047<<8;
 var $5049=$2;
 var $5050=(($5049+37)|0);
 var $5051=HEAP8[($5050)];
 var $5052=($5051&255);
 var $5053=$5048|$5052;
 var $5054=(($5053)&65535);
 FUNCTION_TABLE[$5041]($5042,$5054,1,4,0);
 label=799;break;
 case 802: 
 label=804;break;
 case 803: 
 var $5057=$2;
 var $5058=(($5057+56)|0);
 var $5059=HEAP32[(($5058)>>2)];
 var $5060=((($5059)+(1))|0);
 HEAP32[(($5058)>>2)]=$5060;
 label=804;break;
 case 804: 
 label=805;break;
 case 805: 
 var $5063=$opcode;
 var $5064=($5063&255);
 var $5065=$5064>>4;
 var $5066=$5065&3;
 if(($5066|0)==0){ label=806;break;}else if(($5066|0)==1){ label=807;break;}else if(($5066|0)==2){ label=808;break;}else{label=809;break;}
 case 806: 
 var $5068=$2;
 var $5069=(($5068)|0);
 var $5070=$5069;
 var $5071=HEAP16[(($5070)>>1)];
 $tmpW=$5071;
 label=810;break;
 case 807: 
 var $5073=$2;
 var $5074=(($5073+2)|0);
 var $5075=$5074;
 var $5076=HEAP16[(($5075)>>1)];
 $tmpW=$5076;
 label=810;break;
 case 808: 
 var $5078=$2;
 var $5079=(($5078+24)|0);
 var $5080=HEAP32[(($5079)>>2)];
 var $5081=$5080;
 var $5082=HEAP16[(($5081)>>1)];
 $tmpW=$5082;
 label=810;break;
 case 809: 
 var $5084=$2;
 var $5085=(($5084+6)|0);
 var $5086=$5085;
 var $5087=HEAP16[(($5086)>>1)];
 $tmpW=$5087;
 label=810;break;
 case 810: 
 var $5089=$2;
 var $5090=$tmpW;
 _z80_push_6ts($5089,$5090);
 label=811;break;
 case 811: 
 label=832;break;
 case 812: 
 var $5093=$2;
 var $5094=$2;
 var $5095=(($5094+30)|0);
 var $5096=HEAP16[(($5095)>>1)];
 var $5097=_z80_peekb_3ts_args($5093,$5096);
 $tmpB=$5097;
 var $5098=$2;
 var $5099=(($5098+30)|0);
 var $5100=HEAP16[(($5099)>>1)];
 var $5101=($5100&65535);
 var $5102=((($5101)+(1))|0);
 var $5103=$5102&65535;
 var $5104=(($5103)&65535);
 var $5105=$2;
 var $5106=(($5105+30)|0);
 HEAP16[(($5106)>>1)]=$5104;
 var $5107=$opcode;
 var $5108=($5107&255);
 var $5109=$5108>>3;
 var $5110=$5109&7;
 switch(($5110|0)){case 0:{ label=813;break;}case 1:{ label=814;break;}case 2:{ label=815;break;}case 3:{ label=816;break;}case 4:{ label=817;break;}case 5:{ label=818;break;}case 6:{ label=819;break;}case 7:{ label=820;break;}default:{label=821;break;}}break;
 case 813: 
 var $5112=$2;
 var $5113=$tmpB;
 _ZYM_ADD_A($5112,$5113);
 label=821;break;
 case 814: 
 var $5115=$2;
 var $5116=$tmpB;
 _ZYM_ADC_A($5115,$5116);
 label=821;break;
 case 815: 
 var $5118=$2;
 var $5119=$tmpB;
 _ZYM_SUB_A($5118,$5119);
 label=821;break;
 case 816: 
 var $5121=$2;
 var $5122=$tmpB;
 _ZYM_SBC_A($5121,$5122);
 label=821;break;
 case 817: 
 var $5124=$tmpB;
 var $5125=($5124&255);
 var $5126=$2;
 var $5127=(($5126+6)|0);
 var $5128=$5127;
 var $5129=(($5128+1)|0);
 var $5130=HEAP8[($5129)];
 var $5131=($5130&255);
 var $5132=$5131&$5125;
 var $5133=(($5132)&255);
 HEAP8[($5129)]=$5133;
 var $5134=($5133&255);
 var $5135=((13296+$5134)|0);
 var $5136=HEAP8[($5135)];
 var $5137=($5136&255);
 var $5138=$5137|16;
 var $5139=(($5138)&255);
 var $5140=$2;
 var $5141=(($5140+6)|0);
 var $5142=$5141;
 var $5143=(($5142)|0);
 HEAP8[($5143)]=$5139;
 var $5144=$2;
 var $5145=(($5144+120)|0);
 HEAP8[($5145)]=0;
 label=821;break;
 case 818: 
 var $5147=$tmpB;
 var $5148=($5147&255);
 var $5149=$2;
 var $5150=(($5149+6)|0);
 var $5151=$5150;
 var $5152=(($5151+1)|0);
 var $5153=HEAP8[($5152)];
 var $5154=($5153&255);
 var $5155=$5154^$5148;
 var $5156=(($5155)&255);
 HEAP8[($5152)]=$5156;
 var $5157=($5156&255);
 var $5158=((13296+$5157)|0);
 var $5159=HEAP8[($5158)];
 var $5160=$2;
 var $5161=(($5160+6)|0);
 var $5162=$5161;
 var $5163=(($5162)|0);
 HEAP8[($5163)]=$5159;
 var $5164=$2;
 var $5165=(($5164+120)|0);
 HEAP8[($5165)]=0;
 label=821;break;
 case 819: 
 var $5167=$tmpB;
 var $5168=($5167&255);
 var $5169=$2;
 var $5170=(($5169+6)|0);
 var $5171=$5170;
 var $5172=(($5171+1)|0);
 var $5173=HEAP8[($5172)];
 var $5174=($5173&255);
 var $5175=$5174|$5168;
 var $5176=(($5175)&255);
 HEAP8[($5172)]=$5176;
 var $5177=($5176&255);
 var $5178=((13296+$5177)|0);
 var $5179=HEAP8[($5178)];
 var $5180=$2;
 var $5181=(($5180+6)|0);
 var $5182=$5181;
 var $5183=(($5182)|0);
 HEAP8[($5183)]=$5179;
 var $5184=$2;
 var $5185=(($5184+120)|0);
 HEAP8[($5185)]=0;
 label=821;break;
 case 820: 
 var $5187=$2;
 var $5188=$tmpB;
 _ZYM_CP_A($5187,$5188);
 label=821;break;
 case 821: 
 label=832;break;
 case 822: 
 label=823;break;
 case 823: 
 var $5192=$2;
 var $5193=(($5192+80)|0);
 var $5194=HEAP32[(($5193)>>2)];
 var $5195=($5194|0)!=0;
 if($5195){label=824;break;}else{label=829;break;}
 case 824: 
 $_f29=1;
 label=825;break;
 case 825: 
 var $5198=$_f29;
 var $5199=((($5198)-(1))|0);
 $_f29=$5199;
 var $5200=($5198|0)>0;
 if($5200){label=826;break;}else{label=828;break;}
 case 826: 
 label=827;break;
 case 827: 
 var $5203=$2;
 var $5204=(($5203+80)|0);
 var $5205=HEAP32[(($5204)>>2)];
 var $5206=$2;
 var $5207=$2;
 var $5208=(($5207+36)|0);
 var $5209=HEAP8[($5208)];
 var $5210=($5209&255);
 var $5211=($5210&65535);
 var $5212=$5211<<8;
 var $5213=$2;
 var $5214=(($5213+37)|0);
 var $5215=HEAP8[($5214)];
 var $5216=($5215&255);
 var $5217=$5212|$5216;
 var $5218=(($5217)&65535);
 FUNCTION_TABLE[$5205]($5206,$5218,1,4,0);
 label=825;break;
 case 828: 
 label=830;break;
 case 829: 
 var $5221=$2;
 var $5222=(($5221+56)|0);
 var $5223=HEAP32[(($5222)>>2)];
 var $5224=((($5223)+(1))|0);
 HEAP32[(($5222)>>2)]=$5224;
 label=830;break;
 case 830: 
 label=831;break;
 case 831: 
 var $5227=$2;
 var $5228=$2;
 var $5229=(($5228+30)|0);
 var $5230=HEAP16[(($5229)>>1)];
 _z80_push_6ts($5227,$5230);
 var $5231=$opcode;
 var $5232=($5231&255);
 var $5233=$5232&56;
 var $5234=(($5233)&65535);
 var $5235=$2;
 var $5236=(($5235+30)|0);
 HEAP16[(($5236)>>1)]=$5234;
 var $5237=$2;
 var $5238=(($5237+28)|0);
 var $5239=$5238;
 HEAP16[(($5239)>>1)]=$5234;
 label=832;break;
 case 832: 
 label=833;break;
 case 833: 
 label=2;break;
 case 834: 
 var $5243=$2;
 var $5244=(($5243+56)|0);
 var $5245=HEAP32[(($5244)>>2)];
 var $5246=$tstart;
 var $5247=((($5245)-($5246))|0);
 $1=$5247;
 label=835;break;
 case 835: 
 var $5249=$1;
 STACKTOP=sp;return $5249;
  default: assert(0, "bad label: " + label);
 }

}


function _z80_peekb_3ts_args($z80,$addr){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1;
 var $2;
 $1=$z80;
 $2=$addr;
 label=2;break;
 case 2: 
 var $4=$1;
 var $5=(($4+80)|0);
 var $6=HEAP32[(($5)>>2)];
 var $7=($6|0)!=0;
 if($7){label=3;break;}else{label=4;break;}
 case 3: 
 var $9=$1;
 var $10=(($9+80)|0);
 var $11=HEAP32[(($10)>>2)];
 var $12=$1;
 var $13=$2;
 FUNCTION_TABLE[$11]($12,$13,3,2,32);
 label=5;break;
 case 4: 
 var $15=$1;
 var $16=(($15+56)|0);
 var $17=HEAP32[(($16)>>2)];
 var $18=((($17)+(3))|0);
 HEAP32[(($16)>>2)]=$18;
 label=5;break;
 case 5: 
 label=6;break;
 case 6: 
 var $21=$1;
 var $22=(($21+72)|0);
 var $23=HEAP32[(($22)>>2)];
 var $24=$1;
 var $25=$2;
 var $26=FUNCTION_TABLE[$23]($24,$25,3);
 STACKTOP=sp;return $26;
  default: assert(0, "bad label: " + label);
 }

}


function _z80_peekb_3ts($z80,$addr){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1;
 var $2;
 $1=$z80;
 $2=$addr;
 label=2;break;
 case 2: 
 var $4=$1;
 var $5=(($4+80)|0);
 var $6=HEAP32[(($5)>>2)];
 var $7=($6|0)!=0;
 if($7){label=3;break;}else{label=4;break;}
 case 3: 
 var $9=$1;
 var $10=(($9+80)|0);
 var $11=HEAP32[(($10)>>2)];
 var $12=$1;
 var $13=$2;
 FUNCTION_TABLE[$11]($12,$13,3,3,32);
 label=5;break;
 case 4: 
 var $15=$1;
 var $16=(($15+56)|0);
 var $17=HEAP32[(($16)>>2)];
 var $18=((($17)+(3))|0);
 HEAP32[(($16)>>2)]=$18;
 label=5;break;
 case 5: 
 label=6;break;
 case 6: 
 var $21=$1;
 var $22=(($21+72)|0);
 var $23=HEAP32[(($22)>>2)];
 var $24=$1;
 var $25=$2;
 var $26=FUNCTION_TABLE[$23]($24,$25,3);
 STACKTOP=sp;return $26;
  default: assert(0, "bad label: " + label);
 }

}


function _z80_port_write($z80,$port,$value){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1;
 var $2;
 var $3;
 $1=$z80;
 $2=$port;
 $3=$value;
 var $4=$1;
 var $5=(($4+92)|0);
 var $6=HEAP32[(($5)>>2)];
 var $7=($6|0)!=0;
 if($7){label=2;break;}else{label=3;break;}
 case 2: 
 var $9=$1;
 var $10=(($9+92)|0);
 var $11=HEAP32[(($10)>>2)];
 var $12=$1;
 var $13=$2;
 FUNCTION_TABLE[$11]($12,$13,1,32);
 label=4;break;
 case 3: 
 var $15=$1;
 var $16=(($15+56)|0);
 var $17=HEAP32[(($16)>>2)];
 var $18=((($17)+(1))|0);
 HEAP32[(($16)>>2)]=$18;
 label=4;break;
 case 4: 
 var $20=$1;
 var $21=(($20+88)|0);
 var $22=HEAP32[(($21)>>2)];
 var $23=$1;
 var $24=$2;
 var $25=$3;
 FUNCTION_TABLE[$22]($23,$24,$25,0);
 var $26=$1;
 var $27=(($26+92)|0);
 var $28=HEAP32[(($27)>>2)];
 var $29=($28|0)!=0;
 if($29){label=5;break;}else{label=6;break;}
 case 5: 
 var $31=$1;
 var $32=(($31+92)|0);
 var $33=HEAP32[(($32)>>2)];
 var $34=$1;
 var $35=$2;
 FUNCTION_TABLE[$33]($34,$35,2,0);
 var $36=$1;
 var $37=(($36+56)|0);
 var $38=HEAP32[(($37)>>2)];
 var $39=((($38)+(1))|0);
 HEAP32[(($37)>>2)]=$39;
 label=7;break;
 case 6: 
 var $41=$1;
 var $42=(($41+56)|0);
 var $43=HEAP32[(($42)>>2)];
 var $44=((($43)+(3))|0);
 HEAP32[(($42)>>2)]=$44;
 label=7;break;
 case 7: 
 STACKTOP=sp;return;
  default: assert(0, "bad label: " + label);
 }

}


function _z80_port_read($z80,$port){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1;
 var $2;
 var $value;
 $1=$z80;
 $2=$port;
 var $3=$1;
 var $4=(($3+92)|0);
 var $5=HEAP32[(($4)>>2)];
 var $6=($5|0)!=0;
 if($6){label=2;break;}else{label=3;break;}
 case 2: 
 var $8=$1;
 var $9=(($8+92)|0);
 var $10=HEAP32[(($9)>>2)];
 var $11=$1;
 var $12=$2;
 FUNCTION_TABLE[$10]($11,$12,1,48);
 var $13=$1;
 var $14=(($13+92)|0);
 var $15=HEAP32[(($14)>>2)];
 var $16=$1;
 var $17=$2;
 FUNCTION_TABLE[$15]($16,$17,2,16);
 label=4;break;
 case 3: 
 var $19=$1;
 var $20=(($19+56)|0);
 var $21=HEAP32[(($20)>>2)];
 var $22=((($21)+(3))|0);
 HEAP32[(($20)>>2)]=$22;
 label=4;break;
 case 4: 
 var $24=$1;
 var $25=(($24+84)|0);
 var $26=HEAP32[(($25)>>2)];
 var $27=$1;
 var $28=$2;
 var $29=FUNCTION_TABLE[$26]($27,$28,0);
 $value=$29;
 var $30=$1;
 var $31=(($30+56)|0);
 var $32=HEAP32[(($31)>>2)];
 var $33=((($32)+(1))|0);
 HEAP32[(($31)>>2)]=$33;
 var $34=$value;
 STACKTOP=sp;return $34;
  default: assert(0, "bad label: " + label);
 }

}


function _ZYM_ADC_DD($z80,$value,$ddvalue){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);

 var $1;
 var $2;
 var $3;
 var $cy;
 var $new;
 var $res;
 $1=$z80;
 $2=$value;
 $3=$ddvalue;
 var $4=$1;
 var $5=(($4+6)|0);
 var $6=$5;
 var $7=(($6)|0);
 var $8=HEAP8[($7)];
 var $9=($8&255);
 var $10=$9&1;
 var $11=(($10)&255);
 $cy=$11;
 var $12=$2;
 var $13=($12&65535);
 var $14=$3;
 var $15=($14&65535);
 var $16=((($13)+($15))|0);
 var $17=$cy;
 var $18=($17&255);
 var $19=((($16)+($18))|0);
 $new=$19;
 var $20=$new;
 var $21=$20&65535;
 var $22=(($21)&65535);
 $res=$22;
 var $23=$3;
 var $24=($23&65535);
 var $25=((($24)+(1))|0);
 var $26=$25&65535;
 var $27=(($26)&65535);
 var $28=$1;
 var $29=(($28+28)|0);
 var $30=$29;
 HEAP16[(($30)>>1)]=$27;
 var $31=$1;
 var $32=(($31+120)|0);
 HEAP8[($32)]=0;
 var $33=$res;
 var $34=($33&65535);
 var $35=$34>>8;
 var $36=$35&168;
 var $37=$res;
 var $38=($37&65535);
 var $39=($38|0)==0;
 var $40=($39?64:0);
 var $41=$36|$40;
 var $42=$new;
 var $43=($42>>>0)>65535;
 var $44=($43?1:0);
 var $45=$41|$44;
 var $46=$2;
 var $47=($46&65535);
 var $48=$3;
 var $49=($48&65535);
 var $50=$49^-1;
 var $51=$50&65535;
 var $52=$47^$51;
 var $53=$2;
 var $54=($53&65535);
 var $55=$new;
 var $56=$54^$55;
 var $57=$52&$56;
 var $58=$57&32768;
 var $59=($58|0)!=0;
 var $60=($59?4:0);
 var $61=$45|$60;
 var $62=$2;
 var $63=($62&65535);
 var $64=$63&4095;
 var $65=$3;
 var $66=($65&65535);
 var $67=$66&4095;
 var $68=((($64)+($67))|0);
 var $69=$cy;
 var $70=($69&255);
 var $71=((($68)+($70))|0);
 var $72=($71|0)>=4096;
 var $73=($72?16:0);
 var $74=$61|$73;
 var $75=(($74)&255);
 var $76=$1;
 var $77=(($76+6)|0);
 var $78=$77;
 var $79=(($78)|0);
 HEAP8[($79)]=$75;
 var $80=$res;
 STACKTOP=sp;return $80;
}


function _ZYM_SBC_DD($z80,$value,$ddvalue){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1;
 var $2;
 var $3;
 var $res;
 var $tmpB;
 $1=$z80;
 $2=$value;
 $3=$ddvalue;
 var $4=$1;
 var $5=(($4+6)|0);
 var $6=$5;
 var $7=(($6+1)|0);
 var $8=HEAP8[($7)];
 $tmpB=$8;
 var $9=$3;
 var $10=($9&65535);
 var $11=((($10)+(1))|0);
 var $12=$11&65535;
 var $13=(($12)&65535);
 var $14=$1;
 var $15=(($14+28)|0);
 var $16=$15;
 HEAP16[(($16)>>1)]=$13;
 var $17=$3;
 var $18=($17&65535);
 var $19=$18&255;
 var $20=(($19)&255);
 var $21=$1;
 var $22=(($21+6)|0);
 var $23=$22;
 var $24=(($23+1)|0);
 HEAP8[($24)]=$20;
 var $25=$1;
 var $26=$2;
 var $27=($26&65535);
 var $28=$27&255;
 var $29=(($28)&255);
 _ZYM_SBC_A($25,$29);
 var $30=$1;
 var $31=(($30+6)|0);
 var $32=$31;
 var $33=(($32+1)|0);
 var $34=HEAP8[($33)];
 var $35=($34&255);
 $res=$35;
 var $36=$3;
 var $37=($36&65535);
 var $38=$37>>8;
 var $39=$38&255;
 var $40=(($39)&255);
 var $41=$1;
 var $42=(($41+6)|0);
 var $43=$42;
 var $44=(($43+1)|0);
 HEAP8[($44)]=$40;
 var $45=$1;
 var $46=$2;
 var $47=($46&65535);
 var $48=$47>>8;
 var $49=$48&255;
 var $50=(($49)&255);
 _ZYM_SBC_A($45,$50);
 var $51=$1;
 var $52=(($51+6)|0);
 var $53=$52;
 var $54=(($53+1)|0);
 var $55=HEAP8[($54)];
 var $56=($55&255);
 var $57=$56<<8;
 var $58=$res;
 var $59=($58&65535);
 var $60=$59|$57;
 var $61=(($60)&65535);
 $res=$61;
 var $62=$tmpB;
 var $63=$1;
 var $64=(($63+6)|0);
 var $65=$64;
 var $66=(($65+1)|0);
 HEAP8[($66)]=$62;
 var $67=$res;
 var $68=($67&65535);
 var $69=($68|0)!=0;
 if($69){label=2;break;}else{label=3;break;}
 case 2: 
 var $71=$1;
 var $72=(($71+6)|0);
 var $73=$72;
 var $74=(($73)|0);
 var $75=HEAP8[($74)];
 var $76=($75&255);
 var $77=$76&-65;
 var $87=$77;label=4;break;
 case 3: 
 var $79=$1;
 var $80=(($79+6)|0);
 var $81=$80;
 var $82=(($81)|0);
 var $83=HEAP8[($82)];
 var $84=($83&255);
 var $85=$84|64;
 var $87=$85;label=4;break;
 case 4: 
 var $87;
 var $88=(($87)&255);
 var $89=$1;
 var $90=(($89+6)|0);
 var $91=$90;
 var $92=(($91)|0);
 HEAP8[($92)]=$88;
 var $93=$res;
 STACKTOP=sp;return $93;
  default: assert(0, "bad label: " + label);
 }

}


function _z80_getpcw($z80,$wait1){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1;
 var $2;
 var $res;
 var $_f;
 $1=$z80;
 $2=$wait1;
 var $3=$1;
 var $4=$1;
 var $5=(($4+30)|0);
 var $6=HEAP16[(($5)>>1)];
 var $7=_z80_peekb_3ts_args($3,$6);
 var $8=($7&255);
 $res=$8;
 var $9=$1;
 var $10=(($9+30)|0);
 var $11=HEAP16[(($10)>>1)];
 var $12=($11&65535);
 var $13=((($12)+(1))|0);
 var $14=$13&65535;
 var $15=(($14)&65535);
 var $16=$1;
 var $17=(($16+30)|0);
 HEAP16[(($17)>>1)]=$15;
 var $18=$1;
 var $19=$1;
 var $20=(($19+30)|0);
 var $21=HEAP16[(($20)>>1)];
 var $22=_z80_peekb_3ts_args($18,$21);
 var $23=($22&255);
 var $24=($23&65535);
 var $25=$24<<8;
 var $26=$res;
 var $27=($26&65535);
 var $28=$27|$25;
 var $29=(($28)&65535);
 $res=$29;
 var $30=$2;
 var $31=($30|0)!=0;
 if($31){label=2;break;}else{label=12;break;}
 case 2: 
 label=3;break;
 case 3: 
 var $34=$1;
 var $35=(($34+80)|0);
 var $36=HEAP32[(($35)>>2)];
 var $37=($36|0)!=0;
 if($37){label=4;break;}else{label=9;break;}
 case 4: 
 var $39=$2;
 $_f=$39;
 label=5;break;
 case 5: 
 var $41=$_f;
 var $42=((($41)-(1))|0);
 $_f=$42;
 var $43=($41|0)>0;
 if($43){label=6;break;}else{label=8;break;}
 case 6: 
 label=7;break;
 case 7: 
 var $46=$1;
 var $47=(($46+80)|0);
 var $48=HEAP32[(($47)>>2)];
 var $49=$1;
 var $50=$1;
 var $51=(($50+30)|0);
 var $52=HEAP16[(($51)>>1)];
 FUNCTION_TABLE[$48]($49,$52,1,4,0);
 label=5;break;
 case 8: 
 label=10;break;
 case 9: 
 var $55=$2;
 var $56=$1;
 var $57=(($56+56)|0);
 var $58=HEAP32[(($57)>>2)];
 var $59=((($58)+($55))|0);
 HEAP32[(($57)>>2)]=$59;
 label=10;break;
 case 10: 
 label=11;break;
 case 11: 
 label=12;break;
 case 12: 
 var $63=$1;
 var $64=(($63+30)|0);
 var $65=HEAP16[(($64)>>1)];
 var $66=($65&65535);
 var $67=((($66)+(1))|0);
 var $68=$67&65535;
 var $69=(($68)&65535);
 var $70=$1;
 var $71=(($70+30)|0);
 HEAP16[(($71)>>1)]=$69;
 var $72=$res;
 STACKTOP=sp;return $72;
  default: assert(0, "bad label: " + label);
 }

}


function _z80_peekw_6ts($z80,$addr){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);

 var $1;
 var $2;
 var $res;
 $1=$z80;
 $2=$addr;
 var $3=$1;
 var $4=$2;
 var $5=_z80_peekb_3ts($3,$4);
 var $6=($5&255);
 $res=$6;
 var $7=$res;
 var $8=($7&65535);
 var $9=$1;
 var $10=$2;
 var $11=($10&65535);
 var $12=((($11)+(1))|0);
 var $13=$12&65535;
 var $14=(($13)&65535);
 var $15=_z80_peekb_3ts($9,$14);
 var $16=($15&255);
 var $17=($16&65535);
 var $18=$17<<8;
 var $19=$8|$18;
 var $20=(($19)&65535);
 STACKTOP=sp;return $20;
}


function _z80_pokew_6ts($z80,$addr,$value){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1;
 var $2;
 var $3;
 $1=$z80;
 $2=$addr;
 $3=$value;
 label=2;break;
 case 2: 
 label=3;break;
 case 3: 
 var $6=$1;
 var $7=(($6+80)|0);
 var $8=HEAP32[(($7)>>2)];
 var $9=($8|0)!=0;
 if($9){label=4;break;}else{label=5;break;}
 case 4: 
 var $11=$1;
 var $12=(($11+80)|0);
 var $13=HEAP32[(($12)>>2)];
 var $14=$1;
 var $15=$2;
 FUNCTION_TABLE[$13]($14,$15,3,3,16);
 label=6;break;
 case 5: 
 var $17=$1;
 var $18=(($17+56)|0);
 var $19=HEAP32[(($18)>>2)];
 var $20=((($19)+(3))|0);
 HEAP32[(($18)>>2)]=$20;
 label=6;break;
 case 6: 
 label=7;break;
 case 7: 
 var $23=$1;
 var $24=(($23+76)|0);
 var $25=HEAP32[(($24)>>2)];
 var $26=$1;
 var $27=$2;
 var $28=$3;
 var $29=($28&65535);
 var $30=$29&255;
 var $31=(($30)&255);
 FUNCTION_TABLE[$25]($26,$27,$31,3);
 label=8;break;
 case 8: 
 label=9;break;
 case 9: 
 label=10;break;
 case 10: 
 var $35=$1;
 var $36=(($35+80)|0);
 var $37=HEAP32[(($36)>>2)];
 var $38=($37|0)!=0;
 if($38){label=11;break;}else{label=12;break;}
 case 11: 
 var $40=$1;
 var $41=(($40+80)|0);
 var $42=HEAP32[(($41)>>2)];
 var $43=$1;
 var $44=$2;
 var $45=($44&65535);
 var $46=((($45)+(1))|0);
 var $47=$46&65535;
 var $48=(($47)&65535);
 FUNCTION_TABLE[$42]($43,$48,3,3,16);
 label=13;break;
 case 12: 
 var $50=$1;
 var $51=(($50+56)|0);
 var $52=HEAP32[(($51)>>2)];
 var $53=((($52)+(3))|0);
 HEAP32[(($51)>>2)]=$53;
 label=13;break;
 case 13: 
 label=14;break;
 case 14: 
 var $56=$1;
 var $57=(($56+76)|0);
 var $58=HEAP32[(($57)>>2)];
 var $59=$1;
 var $60=$2;
 var $61=($60&65535);
 var $62=((($61)+(1))|0);
 var $63=$62&65535;
 var $64=(($63)&65535);
 var $65=$3;
 var $66=($65&65535);
 var $67=$66>>8;
 var $68=$67&255;
 var $69=(($68)&255);
 FUNCTION_TABLE[$58]($59,$64,$69,3);
 label=15;break;
 case 15: 
 STACKTOP=sp;return;
  default: assert(0, "bad label: " + label);
 }

}


function _ZYM_SUB_A($z80,$bb){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);

 var $1;
 var $2;
 $1=$z80;
 $2=$bb;
 var $3=$1;
 var $4=(($3+6)|0);
 var $5=$4;
 var $6=(($5)|0);
 var $7=HEAP8[($6)];
 var $8=($7&255);
 var $9=$8&-2;
 var $10=(($9)&255);
 HEAP8[($6)]=$10;
 var $11=$1;
 var $12=$2;
 _ZYM_SBC_A($11,$12);
 STACKTOP=sp;return;
}


function _z80_pop_6ts($z80){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);

 var $1;
 var $res;
 $1=$z80;
 var $2=$1;
 var $3=$1;
 var $4=(($3+8)|0);
 var $5=$4;
 var $6=HEAP16[(($5)>>1)];
 var $7=_z80_peekb_3ts($2,$6);
 var $8=($7&255);
 $res=$8;
 var $9=$1;
 var $10=(($9+8)|0);
 var $11=$10;
 var $12=HEAP16[(($11)>>1)];
 var $13=($12&65535);
 var $14=((($13)+(1))|0);
 var $15=$14&65535;
 var $16=(($15)&65535);
 var $17=$1;
 var $18=(($17+8)|0);
 var $19=$18;
 HEAP16[(($19)>>1)]=$16;
 var $20=$1;
 var $21=$1;
 var $22=(($21+8)|0);
 var $23=$22;
 var $24=HEAP16[(($23)>>1)];
 var $25=_z80_peekb_3ts($20,$24);
 var $26=($25&255);
 var $27=($26&65535);
 var $28=$27<<8;
 var $29=$res;
 var $30=($29&65535);
 var $31=$30|$28;
 var $32=(($31)&65535);
 $res=$32;
 var $33=$1;
 var $34=(($33+8)|0);
 var $35=$34;
 var $36=HEAP16[(($35)>>1)];
 var $37=($36&65535);
 var $38=((($37)+(1))|0);
 var $39=$38&65535;
 var $40=(($39)&65535);
 var $41=$1;
 var $42=(($41+8)|0);
 var $43=$42;
 HEAP16[(($43)>>1)]=$40;
 var $44=$res;
 STACKTOP=sp;return $44;
}


function _ZYM_LD_A_IR($z80,$ir){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1;
 var $2;
 var $_f;
 $1=$z80;
 $2=$ir;
 var $3=$2;
 var $4=$1;
 var $5=(($4+6)|0);
 var $6=$5;
 var $7=(($6+1)|0);
 HEAP8[($7)]=$3;
 var $8=$1;
 var $9=(($8+64)|0);
 HEAP32[(($9)>>2)]=-1;
 label=2;break;
 case 2: 
 var $11=$1;
 var $12=(($11+80)|0);
 var $13=HEAP32[(($12)>>2)];
 var $14=($13|0)!=0;
 if($14){label=3;break;}else{label=8;break;}
 case 3: 
 $_f=1;
 label=4;break;
 case 4: 
 var $17=$_f;
 var $18=((($17)-(1))|0);
 $_f=$18;
 var $19=($17|0)>0;
 if($19){label=5;break;}else{label=7;break;}
 case 5: 
 label=6;break;
 case 6: 
 var $22=$1;
 var $23=(($22+80)|0);
 var $24=HEAP32[(($23)>>2)];
 var $25=$1;
 var $26=$1;
 var $27=(($26+36)|0);
 var $28=HEAP8[($27)];
 var $29=($28&255);
 var $30=($29&65535);
 var $31=$30<<8;
 var $32=$1;
 var $33=(($32+37)|0);
 var $34=HEAP8[($33)];
 var $35=($34&255);
 var $36=$31|$35;
 var $37=(($36)&65535);
 FUNCTION_TABLE[$24]($25,$37,1,4,0);
 label=4;break;
 case 7: 
 label=9;break;
 case 8: 
 var $40=$1;
 var $41=(($40+56)|0);
 var $42=HEAP32[(($41)>>2)];
 var $43=((($42)+(1))|0);
 HEAP32[(($41)>>2)]=$43;
 label=9;break;
 case 9: 
 label=10;break;
 case 10: 
 var $46=$1;
 var $47=(($46+120)|0);
 HEAP8[($47)]=0;
 var $48=$1;
 var $49=(($48+6)|0);
 var $50=$49;
 var $51=(($50+1)|0);
 var $52=HEAP8[($51)];
 var $53=($52&255);
 var $54=((13552+$53)|0);
 var $55=HEAP8[($54)];
 var $56=($55&255);
 var $57=$1;
 var $58=(($57+6)|0);
 var $59=$58;
 var $60=(($59)|0);
 var $61=HEAP8[($60)];
 var $62=($61&255);
 var $63=$62&1;
 var $64=$56|$63;
 var $65=$1;
 var $66=(($65+44)|0);
 var $67=HEAP32[(($66)>>2)];
 var $68=($67|0)!=0;
 var $69=($68?4:0);
 var $70=$64|$69;
 var $71=(($70)&255);
 var $72=$1;
 var $73=(($72+6)|0);
 var $74=$73;
 var $75=(($74)|0);
 HEAP8[($75)]=$71;
 STACKTOP=sp;return;
  default: assert(0, "bad label: " + label);
 }

}


function _ZYM_RRD_A($z80){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1;
 var $tmpB;
 var $_f;
 $1=$z80;
 var $2=$1;
 var $3=$1;
 var $4=(($3+4)|0);
 var $5=$4;
 var $6=HEAP16[(($5)>>1)];
 var $7=_z80_peekb_3ts($2,$6);
 $tmpB=$7;
 var $8=$1;
 var $9=(($8+4)|0);
 var $10=$9;
 var $11=HEAP16[(($10)>>1)];
 var $12=($11&65535);
 var $13=((($12)+(1))|0);
 var $14=$13&65535;
 var $15=(($14)&65535);
 var $16=$1;
 var $17=(($16+28)|0);
 var $18=$17;
 HEAP16[(($18)>>1)]=$15;
 label=2;break;
 case 2: 
 var $20=$1;
 var $21=(($20+80)|0);
 var $22=HEAP32[(($21)>>2)];
 var $23=($22|0)!=0;
 if($23){label=3;break;}else{label=8;break;}
 case 3: 
 $_f=4;
 label=4;break;
 case 4: 
 var $26=$_f;
 var $27=((($26)-(1))|0);
 $_f=$27;
 var $28=($26|0)>0;
 if($28){label=5;break;}else{label=7;break;}
 case 5: 
 label=6;break;
 case 6: 
 var $31=$1;
 var $32=(($31+80)|0);
 var $33=HEAP32[(($32)>>2)];
 var $34=$1;
 var $35=$1;
 var $36=(($35+4)|0);
 var $37=$36;
 var $38=HEAP16[(($37)>>1)];
 FUNCTION_TABLE[$33]($34,$38,1,4,0);
 label=4;break;
 case 7: 
 label=9;break;
 case 8: 
 var $41=$1;
 var $42=(($41+56)|0);
 var $43=HEAP32[(($42)>>2)];
 var $44=((($43)+(4))|0);
 HEAP32[(($42)>>2)]=$44;
 label=9;break;
 case 9: 
 label=10;break;
 case 10: 
 label=11;break;
 case 11: 
 label=12;break;
 case 12: 
 var $49=$1;
 var $50=(($49+80)|0);
 var $51=HEAP32[(($50)>>2)];
 var $52=($51|0)!=0;
 if($52){label=13;break;}else{label=14;break;}
 case 13: 
 var $54=$1;
 var $55=(($54+80)|0);
 var $56=HEAP32[(($55)>>2)];
 var $57=$1;
 var $58=$1;
 var $59=(($58+4)|0);
 var $60=$59;
 var $61=HEAP16[(($60)>>1)];
 FUNCTION_TABLE[$56]($57,$61,3,3,16);
 label=15;break;
 case 14: 
 var $63=$1;
 var $64=(($63+56)|0);
 var $65=HEAP32[(($64)>>2)];
 var $66=((($65)+(3))|0);
 HEAP32[(($64)>>2)]=$66;
 label=15;break;
 case 15: 
 label=16;break;
 case 16: 
 var $69=$1;
 var $70=(($69+76)|0);
 var $71=HEAP32[(($70)>>2)];
 var $72=$1;
 var $73=$1;
 var $74=(($73+4)|0);
 var $75=$74;
 var $76=HEAP16[(($75)>>1)];
 var $77=$1;
 var $78=(($77+6)|0);
 var $79=$78;
 var $80=(($79+1)|0);
 var $81=HEAP8[($80)];
 var $82=($81&255);
 var $83=$82<<4;
 var $84=$tmpB;
 var $85=($84&255);
 var $86=$85>>4;
 var $87=$83|$86;
 var $88=(($87)&255);
 FUNCTION_TABLE[$71]($72,$76,$88,3);
 label=17;break;
 case 17: 
 var $90=$1;
 var $91=(($90+6)|0);
 var $92=$91;
 var $93=(($92+1)|0);
 var $94=HEAP8[($93)];
 var $95=($94&255);
 var $96=$95&240;
 var $97=$tmpB;
 var $98=($97&255);
 var $99=$98&15;
 var $100=$96|$99;
 var $101=(($100)&255);
 var $102=$1;
 var $103=(($102+6)|0);
 var $104=$103;
 var $105=(($104+1)|0);
 HEAP8[($105)]=$101;
 var $106=$1;
 var $107=(($106+120)|0);
 HEAP8[($107)]=0;
 var $108=$1;
 var $109=(($108+6)|0);
 var $110=$109;
 var $111=(($110)|0);
 var $112=HEAP8[($111)];
 var $113=($112&255);
 var $114=$113&1;
 var $115=$1;
 var $116=(($115+6)|0);
 var $117=$116;
 var $118=(($117+1)|0);
 var $119=HEAP8[($118)];
 var $120=($119&255);
 var $121=((13296+$120)|0);
 var $122=HEAP8[($121)];
 var $123=($122&255);
 var $124=$114|$123;
 var $125=(($124)&255);
 var $126=$1;
 var $127=(($126+6)|0);
 var $128=$127;
 var $129=(($128)|0);
 HEAP8[($129)]=$125;
 STACKTOP=sp;return;
  default: assert(0, "bad label: " + label);
 }

}


function _ZYM_RLD_A($z80){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1;
 var $tmpB;
 var $_f;
 $1=$z80;
 var $2=$1;
 var $3=$1;
 var $4=(($3+4)|0);
 var $5=$4;
 var $6=HEAP16[(($5)>>1)];
 var $7=_z80_peekb_3ts($2,$6);
 $tmpB=$7;
 var $8=$1;
 var $9=(($8+4)|0);
 var $10=$9;
 var $11=HEAP16[(($10)>>1)];
 var $12=($11&65535);
 var $13=((($12)+(1))|0);
 var $14=$13&65535;
 var $15=(($14)&65535);
 var $16=$1;
 var $17=(($16+28)|0);
 var $18=$17;
 HEAP16[(($18)>>1)]=$15;
 label=2;break;
 case 2: 
 var $20=$1;
 var $21=(($20+80)|0);
 var $22=HEAP32[(($21)>>2)];
 var $23=($22|0)!=0;
 if($23){label=3;break;}else{label=8;break;}
 case 3: 
 $_f=4;
 label=4;break;
 case 4: 
 var $26=$_f;
 var $27=((($26)-(1))|0);
 $_f=$27;
 var $28=($26|0)>0;
 if($28){label=5;break;}else{label=7;break;}
 case 5: 
 label=6;break;
 case 6: 
 var $31=$1;
 var $32=(($31+80)|0);
 var $33=HEAP32[(($32)>>2)];
 var $34=$1;
 var $35=$1;
 var $36=(($35+4)|0);
 var $37=$36;
 var $38=HEAP16[(($37)>>1)];
 FUNCTION_TABLE[$33]($34,$38,1,4,0);
 label=4;break;
 case 7: 
 label=9;break;
 case 8: 
 var $41=$1;
 var $42=(($41+56)|0);
 var $43=HEAP32[(($42)>>2)];
 var $44=((($43)+(4))|0);
 HEAP32[(($42)>>2)]=$44;
 label=9;break;
 case 9: 
 label=10;break;
 case 10: 
 label=11;break;
 case 11: 
 label=12;break;
 case 12: 
 var $49=$1;
 var $50=(($49+80)|0);
 var $51=HEAP32[(($50)>>2)];
 var $52=($51|0)!=0;
 if($52){label=13;break;}else{label=14;break;}
 case 13: 
 var $54=$1;
 var $55=(($54+80)|0);
 var $56=HEAP32[(($55)>>2)];
 var $57=$1;
 var $58=$1;
 var $59=(($58+4)|0);
 var $60=$59;
 var $61=HEAP16[(($60)>>1)];
 FUNCTION_TABLE[$56]($57,$61,3,3,16);
 label=15;break;
 case 14: 
 var $63=$1;
 var $64=(($63+56)|0);
 var $65=HEAP32[(($64)>>2)];
 var $66=((($65)+(3))|0);
 HEAP32[(($64)>>2)]=$66;
 label=15;break;
 case 15: 
 label=16;break;
 case 16: 
 var $69=$1;
 var $70=(($69+76)|0);
 var $71=HEAP32[(($70)>>2)];
 var $72=$1;
 var $73=$1;
 var $74=(($73+4)|0);
 var $75=$74;
 var $76=HEAP16[(($75)>>1)];
 var $77=$tmpB;
 var $78=($77&255);
 var $79=$78<<4;
 var $80=$1;
 var $81=(($80+6)|0);
 var $82=$81;
 var $83=(($82+1)|0);
 var $84=HEAP8[($83)];
 var $85=($84&255);
 var $86=$85&15;
 var $87=$79|$86;
 var $88=(($87)&255);
 FUNCTION_TABLE[$71]($72,$76,$88,3);
 label=17;break;
 case 17: 
 var $90=$1;
 var $91=(($90+6)|0);
 var $92=$91;
 var $93=(($92+1)|0);
 var $94=HEAP8[($93)];
 var $95=($94&255);
 var $96=$95&240;
 var $97=$tmpB;
 var $98=($97&255);
 var $99=$98>>4;
 var $100=$96|$99;
 var $101=(($100)&255);
 var $102=$1;
 var $103=(($102+6)|0);
 var $104=$103;
 var $105=(($104+1)|0);
 HEAP8[($105)]=$101;
 var $106=$1;
 var $107=(($106+120)|0);
 HEAP8[($107)]=0;
 var $108=$1;
 var $109=(($108+6)|0);
 var $110=$109;
 var $111=(($110)|0);
 var $112=HEAP8[($111)];
 var $113=($112&255);
 var $114=$113&1;
 var $115=$1;
 var $116=(($115+6)|0);
 var $117=$116;
 var $118=(($117+1)|0);
 var $119=HEAP8[($118)];
 var $120=($119&255);
 var $121=((13296+$120)|0);
 var $122=HEAP8[($121)];
 var $123=($122&255);
 var $124=$114|$123;
 var $125=(($124)&255);
 var $126=$1;
 var $127=(($126+6)|0);
 var $128=$127;
 var $129=(($128)|0);
 HEAP8[($129)]=$125;
 STACKTOP=sp;return;
  default: assert(0, "bad label: " + label);
 }

}


function _ZYM_RLC($z80,$bb){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);

 var $1;
 var $2;
 var $cy;
 $1=$z80;
 $2=$bb;
 var $3=$2;
 var $4=($3&255);
 var $5=$4>>7;
 var $6=$5&1;
 var $7=(($6)&255);
 $cy=$7;
 var $8=$1;
 var $9=(($8+120)|0);
 HEAP8[($9)]=0;
 var $10=$2;
 var $11=($10&255);
 var $12=$11<<1;
 var $13=$12&255;
 var $14=$cy;
 var $15=($14&255);
 var $16=$13|$15;
 var $17=(($16)&255);
 $2=$17;
 var $18=($17&255);
 var $19=((13296+$18)|0);
 var $20=HEAP8[($19)];
 var $21=($20&255);
 var $22=$cy;
 var $23=($22&255);
 var $24=$21|$23;
 var $25=(($24)&255);
 var $26=$1;
 var $27=(($26+6)|0);
 var $28=$27;
 var $29=(($28)|0);
 HEAP8[($29)]=$25;
 var $30=$2;
 STACKTOP=sp;return $30;
}


function _ZYM_RRC($z80,$bb){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);

 var $1;
 var $2;
 var $cy;
 $1=$z80;
 $2=$bb;
 var $3=$2;
 var $4=($3&255);
 var $5=$4&1;
 var $6=(($5)&255);
 $cy=$6;
 var $7=$1;
 var $8=(($7+120)|0);
 HEAP8[($8)]=0;
 var $9=$2;
 var $10=($9&255);
 var $11=$10>>1;
 var $12=$cy;
 var $13=($12&255);
 var $14=$13<<7;
 var $15=$11|$14;
 var $16=(($15)&255);
 $2=$16;
 var $17=($16&255);
 var $18=((13296+$17)|0);
 var $19=HEAP8[($18)];
 var $20=($19&255);
 var $21=$cy;
 var $22=($21&255);
 var $23=$20|$22;
 var $24=(($23)&255);
 var $25=$1;
 var $26=(($25+6)|0);
 var $27=$26;
 var $28=(($27)|0);
 HEAP8[($28)]=$24;
 var $29=$2;
 STACKTOP=sp;return $29;
}


function _ZYM_RL($z80,$bb){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);

 var $1;
 var $2;
 var $cy;
 $1=$z80;
 $2=$bb;
 var $3=$2;
 var $4=($3&255);
 var $5=$4>>7;
 var $6=$5&1;
 var $7=(($6)&255);
 $cy=$7;
 var $8=$1;
 var $9=(($8+120)|0);
 HEAP8[($9)]=0;
 var $10=$2;
 var $11=($10&255);
 var $12=$11<<1;
 var $13=$12&255;
 var $14=$1;
 var $15=(($14+6)|0);
 var $16=$15;
 var $17=(($16)|0);
 var $18=HEAP8[($17)];
 var $19=($18&255);
 var $20=$19&1;
 var $21=$13|$20;
 var $22=(($21)&255);
 $2=$22;
 var $23=($22&255);
 var $24=((13296+$23)|0);
 var $25=HEAP8[($24)];
 var $26=($25&255);
 var $27=$cy;
 var $28=($27&255);
 var $29=$26|$28;
 var $30=(($29)&255);
 var $31=$1;
 var $32=(($31+6)|0);
 var $33=$32;
 var $34=(($33)|0);
 HEAP8[($34)]=$30;
 var $35=$2;
 STACKTOP=sp;return $35;
}


function _ZYM_RR($z80,$bb){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);

 var $1;
 var $2;
 var $cy;
 $1=$z80;
 $2=$bb;
 var $3=$2;
 var $4=($3&255);
 var $5=$4&1;
 var $6=(($5)&255);
 $cy=$6;
 var $7=$1;
 var $8=(($7+120)|0);
 HEAP8[($8)]=0;
 var $9=$2;
 var $10=($9&255);
 var $11=$10>>1;
 var $12=$1;
 var $13=(($12+6)|0);
 var $14=$13;
 var $15=(($14)|0);
 var $16=HEAP8[($15)];
 var $17=($16&255);
 var $18=$17&1;
 var $19=$18<<7;
 var $20=$11|$19;
 var $21=(($20)&255);
 $2=$21;
 var $22=($21&255);
 var $23=((13296+$22)|0);
 var $24=HEAP8[($23)];
 var $25=($24&255);
 var $26=$cy;
 var $27=($26&255);
 var $28=$25|$27;
 var $29=(($28)&255);
 var $30=$1;
 var $31=(($30+6)|0);
 var $32=$31;
 var $33=(($32)|0);
 HEAP8[($33)]=$29;
 var $34=$2;
 STACKTOP=sp;return $34;
}


function _ZYM_SLA($z80,$bb){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);

 var $1;
 var $2;
 var $cy;
 $1=$z80;
 $2=$bb;
 var $3=$2;
 var $4=($3&255);
 var $5=$4>>7;
 var $6=$5&1;
 var $7=(($6)&255);
 $cy=$7;
 var $8=$1;
 var $9=(($8+120)|0);
 HEAP8[($9)]=0;
 var $10=$2;
 var $11=($10&255);
 var $12=$11<<1;
 var $13=(($12)&255);
 $2=$13;
 var $14=($13&255);
 var $15=((13296+$14)|0);
 var $16=HEAP8[($15)];
 var $17=($16&255);
 var $18=$cy;
 var $19=($18&255);
 var $20=$17|$19;
 var $21=(($20)&255);
 var $22=$1;
 var $23=(($22+6)|0);
 var $24=$23;
 var $25=(($24)|0);
 HEAP8[($25)]=$21;
 var $26=$2;
 STACKTOP=sp;return $26;
}


function _ZYM_SRA($z80,$bb){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);

 var $1;
 var $2;
 var $cy;
 $1=$z80;
 $2=$bb;
 var $3=$2;
 var $4=($3&255);
 var $5=$4&1;
 var $6=(($5)&255);
 $cy=$6;
 var $7=$1;
 var $8=(($7+120)|0);
 HEAP8[($8)]=0;
 var $9=$2;
 var $10=($9&255);
 var $11=$10>>1;
 var $12=$2;
 var $13=($12&255);
 var $14=$13&128;
 var $15=$11|$14;
 var $16=(($15)&255);
 $2=$16;
 var $17=($16&255);
 var $18=((13296+$17)|0);
 var $19=HEAP8[($18)];
 var $20=($19&255);
 var $21=$cy;
 var $22=($21&255);
 var $23=$20|$22;
 var $24=(($23)&255);
 var $25=$1;
 var $26=(($25+6)|0);
 var $27=$26;
 var $28=(($27)|0);
 HEAP8[($28)]=$24;
 var $29=$2;
 STACKTOP=sp;return $29;
}


function _ZYM_SLL($z80,$bb){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);

 var $1;
 var $2;
 var $cy;
 $1=$z80;
 $2=$bb;
 var $3=$2;
 var $4=($3&255);
 var $5=$4>>7;
 var $6=$5&1;
 var $7=(($6)&255);
 $cy=$7;
 var $8=$1;
 var $9=(($8+120)|0);
 HEAP8[($9)]=0;
 var $10=$2;
 var $11=($10&255);
 var $12=$11<<1;
 var $13=$12|1;
 var $14=(($13)&255);
 $2=$14;
 var $15=($14&255);
 var $16=((13296+$15)|0);
 var $17=HEAP8[($16)];
 var $18=($17&255);
 var $19=$cy;
 var $20=($19&255);
 var $21=$18|$20;
 var $22=(($21)&255);
 var $23=$1;
 var $24=(($23+6)|0);
 var $25=$24;
 var $26=(($25)|0);
 HEAP8[($26)]=$22;
 var $27=$2;
 STACKTOP=sp;return $27;
}


function _ZYM_SLR($z80,$bb){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);

 var $1;
 var $2;
 var $cy;
 $1=$z80;
 $2=$bb;
 var $3=$2;
 var $4=($3&255);
 var $5=$4&1;
 var $6=(($5)&255);
 $cy=$6;
 var $7=$1;
 var $8=(($7+120)|0);
 HEAP8[($8)]=0;
 var $9=$2;
 var $10=($9&255);
 var $11=$10>>1;
 var $12=(($11)&255);
 $2=$12;
 var $13=($12&255);
 var $14=((13296+$13)|0);
 var $15=HEAP8[($14)];
 var $16=($15&255);
 var $17=$cy;
 var $18=($17&255);
 var $19=$16|$18;
 var $20=(($19)&255);
 var $21=$1;
 var $22=(($21+6)|0);
 var $23=$22;
 var $24=(($23)|0);
 HEAP8[($24)]=$20;
 var $25=$2;
 STACKTOP=sp;return $25;
}


function _ZYM_BIT($z80,$bit,$num,$mptr){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1;
 var $2;
 var $3;
 var $4;
 $1=$z80;
 $2=$bit;
 $3=$num;
 $4=$mptr;
 var $5=$1;
 var $6=(($5+120)|0);
 HEAP8[($6)]=0;
 var $7=$1;
 var $8=(($7+6)|0);
 var $9=$8;
 var $10=(($9)|0);
 var $11=HEAP8[($10)];
 var $12=($11&255);
 var $13=$12&1;
 var $14=16|$13;
 var $15=$3;
 var $16=($15&255);
 var $17=$16&40;
 var $18=$14|$17;
 var $19=$3;
 var $20=($19&255);
 var $21=$2;
 var $22=($21&255);
 var $23=1<<$22;
 var $24=$20&$23;
 var $25=($24|0)!=0;
 var $26=($25?0:68);
 var $27=$18|$26;
 var $28=$2;
 var $29=($28&255);
 var $30=($29|0)==7;
 if($30){label=2;break;}else{label=3;break;}
 case 2: 
 var $32=$3;
 var $33=($32&255);
 var $34=$33&128;
 var $37=$34;label=4;break;
 case 3: 
 var $37=0;label=4;break;
 case 4: 
 var $37;
 var $38=$27|$37;
 var $39=(($38)&255);
 var $40=$1;
 var $41=(($40+6)|0);
 var $42=$41;
 var $43=(($42)|0);
 HEAP8[($43)]=$39;
 var $44=$4;
 var $45=($44|0)!=0;
 if($45){label=5;break;}else{label=6;break;}
 case 5: 
 var $47=$1;
 var $48=(($47+6)|0);
 var $49=$48;
 var $50=(($49)|0);
 var $51=HEAP8[($50)];
 var $52=($51&255);
 var $53=$52&-41;
 var $54=$1;
 var $55=(($54+28)|0);
 var $56=$55;
 var $57=(($56+1)|0);
 var $58=HEAP8[($57)];
 var $59=($58&255);
 var $60=$59&40;
 var $61=$53|$60;
 var $62=(($61)&255);
 var $63=$1;
 var $64=(($63+6)|0);
 var $65=$64;
 var $66=(($65)|0);
 HEAP8[($66)]=$62;
 label=6;break;
 case 6: 
 STACKTOP=sp;return;
  default: assert(0, "bad label: " + label);
 }

}


function _ZYM_ADD_DD($z80,$value,$ddvalue){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);

 var $1;
 var $2;
 var $3;
 var $res;
 var $bb;
 $1=$z80;
 $2=$value;
 $3=$ddvalue;
 var $4=$2;
 var $5=($4&65535);
 var $6=$3;
 var $7=($6&65535);
 var $8=((($5)+($7))|0);
 $res=$8;
 var $9=$2;
 var $10=($9&65535);
 var $11=$10&2048;
 var $12=$11>>11;
 var $13=$3;
 var $14=($13&65535);
 var $15=$14&2048;
 var $16=$15>>10;
 var $17=$12|$16;
 var $18=$res;
 var $19=$18&2048;
 var $20=$19>>>9;
 var $21=$17|$20;
 var $22=(($21)&255);
 $bb=$22;
 var $23=$3;
 var $24=($23&65535);
 var $25=((($24)+(1))|0);
 var $26=$25&65535;
 var $27=(($26)&65535);
 var $28=$1;
 var $29=(($28+28)|0);
 var $30=$29;
 HEAP16[(($30)>>1)]=$27;
 var $31=$1;
 var $32=(($31+120)|0);
 HEAP8[($32)]=0;
 var $33=$1;
 var $34=(($33+6)|0);
 var $35=$34;
 var $36=(($35)|0);
 var $37=HEAP8[($36)];
 var $38=($37&255);
 var $39=$38&196;
 var $40=$res;
 var $41=($40>>>0)>65535;
 var $42=($41?1:0);
 var $43=$39|$42;
 var $44=$res;
 var $45=$44>>>8;
 var $46=$45&40;
 var $47=$43|$46;
 var $48=$bb;
 var $49=($48&255);
 var $50=((3512+$49)|0);
 var $51=HEAP8[($50)];
 var $52=($51&255);
 var $53=$47|$52;
 var $54=(($53)&255);
 var $55=$1;
 var $56=(($55+6)|0);
 var $57=$56;
 var $58=(($57)|0);
 HEAP8[($58)]=$54;
 var $59=$res;
 var $60=(($59)&65535);
 STACKTOP=sp;return $60;
}


function _ZYM_INC8($z80,$bb){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);

 var $1;
 var $2;
 $1=$z80;
 $2=$bb;
 var $3=$1;
 var $4=(($3+120)|0);
 HEAP8[($4)]=0;
 var $5=$1;
 var $6=(($5+6)|0);
 var $7=$6;
 var $8=(($7)|0);
 var $9=HEAP8[($8)];
 var $10=($9&255);
 var $11=$10&1;
 var $12=(($11)&255);
 HEAP8[($8)]=$12;
 var $13=$2;
 var $14=($13&255);
 var $15=($14|0)==127;
 var $16=($15?4:0);
 var $17=$2;
 var $18=($17&255);
 var $19=((($18)+(1))|0);
 var $20=$19&15;
 var $21=($20|0)!=0;
 var $22=($21?0:16);
 var $23=$16|$22;
 var $24=$2;
 var $25=($24&255);
 var $26=((($25)+(1))|0);
 var $27=$26&255;
 var $28=((13552+$27)|0);
 var $29=HEAP8[($28)];
 var $30=($29&255);
 var $31=$23|$30;
 var $32=$1;
 var $33=(($32+6)|0);
 var $34=$33;
 var $35=(($34)|0);
 var $36=HEAP8[($35)];
 var $37=($36&255);
 var $38=$37|$31;
 var $39=(($38)&255);
 HEAP8[($35)]=$39;
 var $40=$2;
 var $41=($40&255);
 var $42=((($41)+(1))|0);
 var $43=$42&255;
 var $44=(($43)&255);
 STACKTOP=sp;return $44;
}


function _ZYM_DEC8($z80,$bb){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);

 var $1;
 var $2;
 $1=$z80;
 $2=$bb;
 var $3=$1;
 var $4=(($3+120)|0);
 HEAP8[($4)]=0;
 var $5=$1;
 var $6=(($5+6)|0);
 var $7=$6;
 var $8=(($7)|0);
 var $9=HEAP8[($8)];
 var $10=($9&255);
 var $11=$10&1;
 var $12=(($11)&255);
 HEAP8[($8)]=$12;
 var $13=$2;
 var $14=($13&255);
 var $15=($14|0)==128;
 var $16=($15?4:0);
 var $17=2|$16;
 var $18=$2;
 var $19=($18&255);
 var $20=$19&15;
 var $21=($20|0)!=0;
 var $22=($21?0:16);
 var $23=$17|$22;
 var $24=$2;
 var $25=($24&255);
 var $26=((($25)-(1))|0);
 var $27=$26&255;
 var $28=((13552+$27)|0);
 var $29=HEAP8[($28)];
 var $30=($29&255);
 var $31=$23|$30;
 var $32=$1;
 var $33=(($32+6)|0);
 var $34=$33;
 var $35=(($34)|0);
 var $36=HEAP8[($35)];
 var $37=($36&255);
 var $38=$37|$31;
 var $39=(($38)&255);
 HEAP8[($35)]=$39;
 var $40=$2;
 var $41=($40&255);
 var $42=((($41)-(1))|0);
 var $43=$42&255;
 var $44=(($43)&255);
 STACKTOP=sp;return $44;
}


function _ZYM_RLCA($z80){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);

 var $1;
 var $cy;
 $1=$z80;
 var $2=$1;
 var $3=(($2+6)|0);
 var $4=$3;
 var $5=(($4+1)|0);
 var $6=HEAP8[($5)];
 var $7=($6&255);
 var $8=$7>>7;
 var $9=$8&1;
 var $10=(($9)&255);
 $cy=$10;
 var $11=$1;
 var $12=(($11+6)|0);
 var $13=$12;
 var $14=(($13+1)|0);
 var $15=HEAP8[($14)];
 var $16=($15&255);
 var $17=$16<<1;
 var $18=$cy;
 var $19=($18&255);
 var $20=$17|$19;
 var $21=(($20)&255);
 var $22=$1;
 var $23=(($22+6)|0);
 var $24=$23;
 var $25=(($24+1)|0);
 HEAP8[($25)]=$21;
 var $26=$1;
 var $27=(($26+120)|0);
 HEAP8[($27)]=0;
 var $28=$cy;
 var $29=($28&255);
 var $30=$1;
 var $31=(($30+6)|0);
 var $32=$31;
 var $33=(($32+1)|0);
 var $34=HEAP8[($33)];
 var $35=($34&255);
 var $36=$35&40;
 var $37=$29|$36;
 var $38=$1;
 var $39=(($38+6)|0);
 var $40=$39;
 var $41=(($40)|0);
 var $42=HEAP8[($41)];
 var $43=($42&255);
 var $44=$43&196;
 var $45=$37|$44;
 var $46=(($45)&255);
 var $47=$1;
 var $48=(($47+6)|0);
 var $49=$48;
 var $50=(($49)|0);
 HEAP8[($50)]=$46;
 STACKTOP=sp;return;
}


function _ZYM_RRCA($z80){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);

 var $1;
 var $cy;
 $1=$z80;
 var $2=$1;
 var $3=(($2+6)|0);
 var $4=$3;
 var $5=(($4+1)|0);
 var $6=HEAP8[($5)];
 var $7=($6&255);
 var $8=$7&1;
 var $9=(($8)&255);
 $cy=$9;
 var $10=$1;
 var $11=(($10+6)|0);
 var $12=$11;
 var $13=(($12+1)|0);
 var $14=HEAP8[($13)];
 var $15=($14&255);
 var $16=$15>>1;
 var $17=$cy;
 var $18=($17&255);
 var $19=$18<<7;
 var $20=$16|$19;
 var $21=(($20)&255);
 var $22=$1;
 var $23=(($22+6)|0);
 var $24=$23;
 var $25=(($24+1)|0);
 HEAP8[($25)]=$21;
 var $26=$1;
 var $27=(($26+120)|0);
 HEAP8[($27)]=0;
 var $28=$cy;
 var $29=($28&255);
 var $30=$1;
 var $31=(($30+6)|0);
 var $32=$31;
 var $33=(($32+1)|0);
 var $34=HEAP8[($33)];
 var $35=($34&255);
 var $36=$35&40;
 var $37=$29|$36;
 var $38=$1;
 var $39=(($38+6)|0);
 var $40=$39;
 var $41=(($40)|0);
 var $42=HEAP8[($41)];
 var $43=($42&255);
 var $44=$43&196;
 var $45=$37|$44;
 var $46=(($45)&255);
 var $47=$1;
 var $48=(($47+6)|0);
 var $49=$48;
 var $50=(($49)|0);
 HEAP8[($50)]=$46;
 STACKTOP=sp;return;
}


function _ZYM_RLA($z80){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);

 var $1;
 var $cy;
 $1=$z80;
 var $2=$1;
 var $3=(($2+6)|0);
 var $4=$3;
 var $5=(($4+1)|0);
 var $6=HEAP8[($5)];
 var $7=($6&255);
 var $8=$7>>7;
 var $9=$8&1;
 var $10=(($9)&255);
 $cy=$10;
 var $11=$1;
 var $12=(($11+6)|0);
 var $13=$12;
 var $14=(($13+1)|0);
 var $15=HEAP8[($14)];
 var $16=($15&255);
 var $17=$16<<1;
 var $18=$1;
 var $19=(($18+6)|0);
 var $20=$19;
 var $21=(($20)|0);
 var $22=HEAP8[($21)];
 var $23=($22&255);
 var $24=$23&1;
 var $25=$17|$24;
 var $26=(($25)&255);
 var $27=$1;
 var $28=(($27+6)|0);
 var $29=$28;
 var $30=(($29+1)|0);
 HEAP8[($30)]=$26;
 var $31=$1;
 var $32=(($31+120)|0);
 HEAP8[($32)]=0;
 var $33=$cy;
 var $34=($33&255);
 var $35=$1;
 var $36=(($35+6)|0);
 var $37=$36;
 var $38=(($37+1)|0);
 var $39=HEAP8[($38)];
 var $40=($39&255);
 var $41=$40&40;
 var $42=$34|$41;
 var $43=$1;
 var $44=(($43+6)|0);
 var $45=$44;
 var $46=(($45)|0);
 var $47=HEAP8[($46)];
 var $48=($47&255);
 var $49=$48&196;
 var $50=$42|$49;
 var $51=(($50)&255);
 var $52=$1;
 var $53=(($52+6)|0);
 var $54=$53;
 var $55=(($54)|0);
 HEAP8[($55)]=$51;
 STACKTOP=sp;return;
}


function _ZYM_RRA($z80){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);

 var $1;
 var $cy;
 $1=$z80;
 var $2=$1;
 var $3=(($2+6)|0);
 var $4=$3;
 var $5=(($4+1)|0);
 var $6=HEAP8[($5)];
 var $7=($6&255);
 var $8=$7&1;
 var $9=(($8)&255);
 $cy=$9;
 var $10=$1;
 var $11=(($10+6)|0);
 var $12=$11;
 var $13=(($12+1)|0);
 var $14=HEAP8[($13)];
 var $15=($14&255);
 var $16=$15>>1;
 var $17=$1;
 var $18=(($17+6)|0);
 var $19=$18;
 var $20=(($19)|0);
 var $21=HEAP8[($20)];
 var $22=($21&255);
 var $23=$22&1;
 var $24=$23<<7;
 var $25=$16|$24;
 var $26=(($25)&255);
 var $27=$1;
 var $28=(($27+6)|0);
 var $29=$28;
 var $30=(($29+1)|0);
 HEAP8[($30)]=$26;
 var $31=$1;
 var $32=(($31+120)|0);
 HEAP8[($32)]=0;
 var $33=$cy;
 var $34=($33&255);
 var $35=$1;
 var $36=(($35+6)|0);
 var $37=$36;
 var $38=(($37+1)|0);
 var $39=HEAP8[($38)];
 var $40=($39&255);
 var $41=$40&40;
 var $42=$34|$41;
 var $43=$1;
 var $44=(($43+6)|0);
 var $45=$44;
 var $46=(($45)|0);
 var $47=HEAP8[($46)];
 var $48=($47&255);
 var $49=$48&196;
 var $50=$42|$49;
 var $51=(($50)&255);
 var $52=$1;
 var $53=(($52+6)|0);
 var $54=$53;
 var $55=(($54)|0);
 HEAP8[($55)]=$51;
 STACKTOP=sp;return;
}


function _ZYM_DAA($z80){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1;
 var $tmpI;
 var $tmpC;
 var $tmpA;
 $1=$z80;
 $tmpI=0;
 var $2=$1;
 var $3=(($2+6)|0);
 var $4=$3;
 var $5=(($4)|0);
 var $6=HEAP8[($5)];
 var $7=($6&255);
 var $8=$7&1;
 var $9=(($8)&255);
 $tmpC=$9;
 var $10=$1;
 var $11=(($10+6)|0);
 var $12=$11;
 var $13=(($12+1)|0);
 var $14=HEAP8[($13)];
 $tmpA=$14;
 var $15=$1;
 var $16=(($15+6)|0);
 var $17=$16;
 var $18=(($17)|0);
 var $19=HEAP8[($18)];
 var $20=($19&255);
 var $21=$20&16;
 var $22=($21|0)!=0;
 if($22){label=3;break;}else{label=2;break;}
 case 2: 
 var $24=$tmpA;
 var $25=($24&255);
 var $26=$25&15;
 var $27=($26|0)>9;
 if($27){label=3;break;}else{label=4;break;}
 case 3: 
 $tmpI=6;
 label=4;break;
 case 4: 
 var $30=$tmpC;
 var $31=($30&255);
 var $32=($31|0)!=0;
 if($32){label=6;break;}else{label=5;break;}
 case 5: 
 var $34=$tmpA;
 var $35=($34&255);
 var $36=($35|0)>153;
 if($36){label=6;break;}else{label=7;break;}
 case 6: 
 var $38=$tmpI;
 var $39=($38&255);
 var $40=$39|96;
 var $41=(($40)&255);
 $tmpI=$41;
 label=7;break;
 case 7: 
 var $43=$tmpA;
 var $44=($43&255);
 var $45=($44|0)>153;
 if($45){label=8;break;}else{label=9;break;}
 case 8: 
 $tmpC=1;
 label=9;break;
 case 9: 
 var $48=$1;
 var $49=(($48+6)|0);
 var $50=$49;
 var $51=(($50)|0);
 var $52=HEAP8[($51)];
 var $53=($52&255);
 var $54=$53&2;
 var $55=($54|0)!=0;
 if($55){label=10;break;}else{label=11;break;}
 case 10: 
 var $57=$1;
 var $58=$tmpI;
 _ZYM_SUB_A($57,$58);
 label=12;break;
 case 11: 
 var $60=$1;
 var $61=$tmpI;
 _ZYM_ADD_A($60,$61);
 label=12;break;
 case 12: 
 var $63=$1;
 var $64=(($63+6)|0);
 var $65=$64;
 var $66=(($65)|0);
 var $67=HEAP8[($66)];
 var $68=($67&255);
 var $69=$68&-6;
 var $70=$tmpC;
 var $71=($70&255);
 var $72=$69|$71;
 var $73=$1;
 var $74=(($73+6)|0);
 var $75=$74;
 var $76=(($75+1)|0);
 var $77=HEAP8[($76)];
 var $78=($77&255);
 var $79=((13808+$78)|0);
 var $80=HEAP8[($79)];
 var $81=($80&255);
 var $82=$72|$81;
 var $83=(($82)&255);
 var $84=$1;
 var $85=(($84+6)|0);
 var $86=$85;
 var $87=(($86)|0);
 HEAP8[($87)]=$83;
 STACKTOP=sp;return;
  default: assert(0, "bad label: " + label);
 }

}


function _ZYM_ADD_A($z80,$bb){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);

 var $1;
 var $2;
 $1=$z80;
 $2=$bb;
 var $3=$1;
 var $4=(($3+6)|0);
 var $5=$4;
 var $6=(($5)|0);
 var $7=HEAP8[($6)];
 var $8=($7&255);
 var $9=$8&-2;
 var $10=(($9)&255);
 HEAP8[($6)]=$10;
 var $11=$1;
 var $12=$2;
 _ZYM_ADC_A($11,$12);
 STACKTOP=sp;return;
}


function _ZYM_ADC_A($z80,$bb){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);

 var $1;
 var $2;
 var $new;
 var $o;
 $1=$z80;
 $2=$bb;
 var $3=$1;
 var $4=(($3+6)|0);
 var $5=$4;
 var $6=(($5+1)|0);
 var $7=HEAP8[($6)];
 var $8=($7&255);
 $o=$8;
 var $9=$o;
 var $10=($9&65535);
 var $11=$2;
 var $12=($11&255);
 var $13=((($10)+($12))|0);
 var $14=$1;
 var $15=(($14+6)|0);
 var $16=$15;
 var $17=(($16)|0);
 var $18=HEAP8[($17)];
 var $19=($18&255);
 var $20=$19&1;
 var $21=((($13)+($20))|0);
 var $22=(($21)&65535);
 $new=$22;
 var $23=($22&65535);
 var $24=$23&255;
 var $25=(($24)&255);
 var $26=$1;
 var $27=(($26+6)|0);
 var $28=$27;
 var $29=(($28+1)|0);
 HEAP8[($29)]=$25;
 var $30=$1;
 var $31=(($30+120)|0);
 HEAP8[($31)]=0;
 var $32=$new;
 var $33=($32&65535);
 var $34=$33&255;
 var $35=((13552+$34)|0);
 var $36=HEAP8[($35)];
 var $37=($36&255);
 var $38=$new;
 var $39=($38&65535);
 var $40=($39|0)>255;
 var $41=($40?1:0);
 var $42=$37|$41;
 var $43=$o;
 var $44=($43&65535);
 var $45=$2;
 var $46=($45&255);
 var $47=$46^-1;
 var $48=$44^$47;
 var $49=$o;
 var $50=($49&65535);
 var $51=$new;
 var $52=($51&65535);
 var $53=$50^$52;
 var $54=$48&$53;
 var $55=$54&128;
 var $56=($55|0)!=0;
 var $57=($56?4:0);
 var $58=$42|$57;
 var $59=$o;
 var $60=($59&65535);
 var $61=$60&15;
 var $62=$2;
 var $63=($62&255);
 var $64=$63&15;
 var $65=((($61)+($64))|0);
 var $66=$1;
 var $67=(($66+6)|0);
 var $68=$67;
 var $69=(($68)|0);
 var $70=HEAP8[($69)];
 var $71=($70&255);
 var $72=$71&1;
 var $73=((($65)+($72))|0);
 var $74=($73|0)>=16;
 var $75=($74?16:0);
 var $76=$58|$75;
 var $77=(($76)&255);
 var $78=$1;
 var $79=(($78+6)|0);
 var $80=$79;
 var $81=(($80)|0);
 HEAP8[($81)]=$77;
 STACKTOP=sp;return;
}


function _ZYM_SBC_A($z80,$bb){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);

 var $1;
 var $2;
 var $new;
 var $o;
 $1=$z80;
 $2=$bb;
 var $3=$1;
 var $4=(($3+6)|0);
 var $5=$4;
 var $6=(($5+1)|0);
 var $7=HEAP8[($6)];
 var $8=($7&255);
 $o=$8;
 var $9=$o;
 var $10=($9&65535);
 var $11=$2;
 var $12=($11&255);
 var $13=((($10)-($12))|0);
 var $14=$1;
 var $15=(($14+6)|0);
 var $16=$15;
 var $17=(($16)|0);
 var $18=HEAP8[($17)];
 var $19=($18&255);
 var $20=$19&1;
 var $21=((($13)-($20))|0);
 var $22=$21&65535;
 var $23=(($22)&65535);
 $new=$23;
 var $24=($23&65535);
 var $25=$24&255;
 var $26=(($25)&255);
 var $27=$1;
 var $28=(($27+6)|0);
 var $29=$28;
 var $30=(($29+1)|0);
 HEAP8[($30)]=$26;
 var $31=$1;
 var $32=(($31+120)|0);
 HEAP8[($32)]=0;
 var $33=$new;
 var $34=($33&65535);
 var $35=$34&255;
 var $36=((13552+$35)|0);
 var $37=HEAP8[($36)];
 var $38=($37&255);
 var $39=2|$38;
 var $40=$new;
 var $41=($40&65535);
 var $42=($41|0)>255;
 var $43=($42?1:0);
 var $44=$39|$43;
 var $45=$o;
 var $46=($45&65535);
 var $47=$2;
 var $48=($47&255);
 var $49=$46^$48;
 var $50=$o;
 var $51=($50&65535);
 var $52=$new;
 var $53=($52&65535);
 var $54=$51^$53;
 var $55=$49&$54;
 var $56=$55&128;
 var $57=($56|0)!=0;
 var $58=($57?4:0);
 var $59=$44|$58;
 var $60=$o;
 var $61=($60&65535);
 var $62=$61&15;
 var $63=$2;
 var $64=($63&255);
 var $65=$64&15;
 var $66=((($62)-($65))|0);
 var $67=$1;
 var $68=(($67+6)|0);
 var $69=$68;
 var $70=(($69)|0);
 var $71=HEAP8[($70)];
 var $72=($71&255);
 var $73=$72&1;
 var $74=((($66)-($73))|0);
 var $75=($74|0)<0;
 var $76=($75?16:0);
 var $77=$59|$76;
 var $78=(($77)&255);
 var $79=$1;
 var $80=(($79+6)|0);
 var $81=$80;
 var $82=(($81)|0);
 HEAP8[($82)]=$78;
 STACKTOP=sp;return;
}


function _ZYM_CP_A($z80,$bb){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);

 var $1;
 var $2;
 var $o;
 var $new;
 $1=$z80;
 $2=$bb;
 var $3=$1;
 var $4=(($3+6)|0);
 var $5=$4;
 var $6=(($5+1)|0);
 var $7=HEAP8[($6)];
 $o=$7;
 var $8=$o;
 var $9=($8&255);
 var $10=$2;
 var $11=($10&255);
 var $12=((($9)-($11))|0);
 var $13=$12&255;
 var $14=(($13)&255);
 $new=$14;
 var $15=$1;
 var $16=(($15+120)|0);
 HEAP8[($16)]=0;
 var $17=$new;
 var $18=($17&255);
 var $19=$18&128;
 var $20=2|$19;
 var $21=$2;
 var $22=($21&255);
 var $23=$22&40;
 var $24=$20|$23;
 var $25=$new;
 var $26=($25&255);
 var $27=($26|0)==0;
 var $28=($27?64:0);
 var $29=$24|$28;
 var $30=$o;
 var $31=($30&255);
 var $32=$2;
 var $33=($32&255);
 var $34=($31|0)<($33|0);
 var $35=($34?1:0);
 var $36=$29|$35;
 var $37=$o;
 var $38=($37&255);
 var $39=$2;
 var $40=($39&255);
 var $41=$38^$40;
 var $42=$o;
 var $43=($42&255);
 var $44=$new;
 var $45=($44&255);
 var $46=$43^$45;
 var $47=$41&$46;
 var $48=$47&128;
 var $49=($48|0)!=0;
 var $50=($49?4:0);
 var $51=$36|$50;
 var $52=$o;
 var $53=($52&255);
 var $54=$53&15;
 var $55=$2;
 var $56=($55&255);
 var $57=$56&15;
 var $58=((($54)-($57))|0);
 var $59=($58|0)<0;
 var $60=($59?16:0);
 var $61=$51|$60;
 var $62=(($61)&255);
 var $63=$1;
 var $64=(($63+6)|0);
 var $65=$64;
 var $66=(($65)|0);
 HEAP8[($66)]=$62;
 STACKTOP=sp;return;
}


function _z80_pokew_6ts_inverted($z80,$addr,$value){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1;
 var $2;
 var $3;
 $1=$z80;
 $2=$addr;
 $3=$value;
 label=2;break;
 case 2: 
 label=3;break;
 case 3: 
 var $6=$1;
 var $7=(($6+80)|0);
 var $8=HEAP32[(($7)>>2)];
 var $9=($8|0)!=0;
 if($9){label=4;break;}else{label=5;break;}
 case 4: 
 var $11=$1;
 var $12=(($11+80)|0);
 var $13=HEAP32[(($12)>>2)];
 var $14=$1;
 var $15=$2;
 var $16=($15&65535);
 var $17=((($16)+(1))|0);
 var $18=$17&65535;
 var $19=(($18)&65535);
 FUNCTION_TABLE[$13]($14,$19,3,3,16);
 label=6;break;
 case 5: 
 var $21=$1;
 var $22=(($21+56)|0);
 var $23=HEAP32[(($22)>>2)];
 var $24=((($23)+(3))|0);
 HEAP32[(($22)>>2)]=$24;
 label=6;break;
 case 6: 
 label=7;break;
 case 7: 
 var $27=$1;
 var $28=(($27+76)|0);
 var $29=HEAP32[(($28)>>2)];
 var $30=$1;
 var $31=$2;
 var $32=($31&65535);
 var $33=((($32)+(1))|0);
 var $34=$33&65535;
 var $35=(($34)&65535);
 var $36=$3;
 var $37=($36&65535);
 var $38=$37>>8;
 var $39=$38&255;
 var $40=(($39)&255);
 FUNCTION_TABLE[$29]($30,$35,$40,3);
 label=8;break;
 case 8: 
 label=9;break;
 case 9: 
 label=10;break;
 case 10: 
 var $44=$1;
 var $45=(($44+80)|0);
 var $46=HEAP32[(($45)>>2)];
 var $47=($46|0)!=0;
 if($47){label=11;break;}else{label=12;break;}
 case 11: 
 var $49=$1;
 var $50=(($49+80)|0);
 var $51=HEAP32[(($50)>>2)];
 var $52=$1;
 var $53=$2;
 FUNCTION_TABLE[$51]($52,$53,3,3,16);
 label=13;break;
 case 12: 
 var $55=$1;
 var $56=(($55+56)|0);
 var $57=HEAP32[(($56)>>2)];
 var $58=((($57)+(3))|0);
 HEAP32[(($56)>>2)]=$58;
 label=13;break;
 case 13: 
 label=14;break;
 case 14: 
 var $61=$1;
 var $62=(($61+76)|0);
 var $63=HEAP32[(($62)>>2)];
 var $64=$1;
 var $65=$2;
 var $66=$3;
 var $67=($66&65535);
 var $68=$67&255;
 var $69=(($68)&255);
 FUNCTION_TABLE[$63]($64,$65,$69,3);
 label=15;break;
 case 15: 
 STACKTOP=sp;return;
  default: assert(0, "bad label: " + label);
 }

}


function _z80_push_6ts($z80,$value){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1;
 var $2;
 $1=$z80;
 $2=$value;
 var $3=$1;
 var $4=(($3+8)|0);
 var $5=$4;
 var $6=HEAP16[(($5)>>1)];
 var $7=($6&65535);
 var $8=((($7)-(1))|0);
 var $9=$8&65535;
 var $10=(($9)&65535);
 var $11=$1;
 var $12=(($11+8)|0);
 var $13=$12;
 HEAP16[(($13)>>1)]=$10;
 label=2;break;
 case 2: 
 label=3;break;
 case 3: 
 var $16=$1;
 var $17=(($16+80)|0);
 var $18=HEAP32[(($17)>>2)];
 var $19=($18|0)!=0;
 if($19){label=4;break;}else{label=5;break;}
 case 4: 
 var $21=$1;
 var $22=(($21+80)|0);
 var $23=HEAP32[(($22)>>2)];
 var $24=$1;
 var $25=$1;
 var $26=(($25+8)|0);
 var $27=$26;
 var $28=HEAP16[(($27)>>1)];
 FUNCTION_TABLE[$23]($24,$28,3,3,16);
 label=6;break;
 case 5: 
 var $30=$1;
 var $31=(($30+56)|0);
 var $32=HEAP32[(($31)>>2)];
 var $33=((($32)+(3))|0);
 HEAP32[(($31)>>2)]=$33;
 label=6;break;
 case 6: 
 label=7;break;
 case 7: 
 var $36=$1;
 var $37=(($36+76)|0);
 var $38=HEAP32[(($37)>>2)];
 var $39=$1;
 var $40=$1;
 var $41=(($40+8)|0);
 var $42=$41;
 var $43=HEAP16[(($42)>>1)];
 var $44=$2;
 var $45=($44&65535);
 var $46=$45>>8;
 var $47=$46&255;
 var $48=(($47)&255);
 FUNCTION_TABLE[$38]($39,$43,$48,3);
 label=8;break;
 case 8: 
 var $50=$1;
 var $51=(($50+8)|0);
 var $52=$51;
 var $53=HEAP16[(($52)>>1)];
 var $54=($53&65535);
 var $55=((($54)-(1))|0);
 var $56=$55&65535;
 var $57=(($56)&65535);
 var $58=$1;
 var $59=(($58+8)|0);
 var $60=$59;
 HEAP16[(($60)>>1)]=$57;
 label=9;break;
 case 9: 
 label=10;break;
 case 10: 
 var $63=$1;
 var $64=(($63+80)|0);
 var $65=HEAP32[(($64)>>2)];
 var $66=($65|0)!=0;
 if($66){label=11;break;}else{label=12;break;}
 case 11: 
 var $68=$1;
 var $69=(($68+80)|0);
 var $70=HEAP32[(($69)>>2)];
 var $71=$1;
 var $72=$1;
 var $73=(($72+8)|0);
 var $74=$73;
 var $75=HEAP16[(($74)>>1)];
 FUNCTION_TABLE[$70]($71,$75,3,3,16);
 label=13;break;
 case 12: 
 var $77=$1;
 var $78=(($77+56)|0);
 var $79=HEAP32[(($78)>>2)];
 var $80=((($79)+(3))|0);
 HEAP32[(($78)>>2)]=$80;
 label=13;break;
 case 13: 
 label=14;break;
 case 14: 
 var $83=$1;
 var $84=(($83+76)|0);
 var $85=HEAP32[(($84)>>2)];
 var $86=$1;
 var $87=$1;
 var $88=(($87+8)|0);
 var $89=$88;
 var $90=HEAP16[(($89)>>1)];
 var $91=$2;
 var $92=($91&65535);
 var $93=$92&255;
 var $94=(($93)&255);
 FUNCTION_TABLE[$85]($86,$90,$94,3);
 label=15;break;
 case 15: 
 STACKTOP=sp;return;
  default: assert(0, "bad label: " + label);
 }

}


function _Konec(){
 var label=0;


 _Deinicializiraj();
 _SDL_Quit();
 _exit(0);
 throw "Reached an unreachable!";
 return;
}


function _PrikaziSporocilo($Sporocilo,$Situacija){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);

 var $1;
 var $2;
 $1=$Sporocilo;
 $2=$Situacija;
 var $3=$2;
 var $4=$1;
 var $5=_puts($4);
 STACKTOP=sp;return;
}


function _Napaka($Sporocilo){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);

 var $1;
 $1=$Sporocilo;
 var $2=$1;
 _PrikaziSporocilo($2,2);
 _Konec();
 STACKTOP=sp;return;
}


function _main($argc,$argv){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1;
 var $2;
 var $3;
 $1=0;
 $2=$argc;
 $3=$argv;
 var $4=$2;
 var $5=$3;
 var $6=_SDL_Init(33);
 var $7=($6|0)!=0;
 if($7){label=2;break;}else{label=3;break;}
 case 2: 
 _Napaka(3088);
 label=3;break;
 case 3: 
 var $10=_SDL_SetVideoMode(480,480,8,0);
 HEAP32[((14584)>>2)]=$10;
 var $11=HEAP32[((14584)>>2)];
 var $12=($11|0)!=0;
 if($12){label=5;break;}else{label=4;break;}
 case 4: 
 _Napaka(3288);
 label=5;break;
 case 5: 
 _SDL_WM_SetCaption(2952,2952);
 _Inicializiraj();
 STACKTOP=sp;return 0;
  default: assert(0, "bad label: " + label);
 }

}
Module["_main"] = _main;

function _CRTCBeriPort($Naslov){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1;
 var $2;
 $2=$Naslov;
 var $3=$2;
 var $4=($3&65535);
 var $5=($4|0)<32768;
 if($5){label=2;break;}else{label=3;break;}
 case 2: 
 var $7=$2;
 var $8=($7&65535);
 var $9=$8&2047;
 var $10=((80400+$9)|0);
 var $11=HEAP8[($10)];
 $1=$11;
 label=7;break;
 case 3: 
 var $13=$2;
 var $14=($13&65535);
 var $15=($14|0)==32785;
 if($15){label=4;break;}else{label=6;break;}
 case 4: 
 var $17=HEAP8[(80392)];
 var $18=($17&255);
 var $19=($18|0)>=14;
 if($19){label=5;break;}else{label=6;break;}
 case 5: 
 var $21=HEAP8[(80392)];
 var $22=($21&255);
 var $23=((82448+$22)|0);
 var $24=HEAP8[($23)];
 $1=$24;
 label=7;break;
 case 6: 
 $1=0;
 label=7;break;
 case 7: 
 var $27=$1;
 STACKTOP=sp;return $27;
  default: assert(0, "bad label: " + label);
 }

}


function _CRTCIzrisiFrame(){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $X;
 var $Y;
 var $i;
 var $j;
 var $Ptr;
 var $Kurzor;
 $Y=0;
 var $1=HEAP8[(82461)];
 var $2=($1&255);
 var $3=HEAP8[(82460)];
 var $4=($3&255);
 var $5=$4<<8;
 var $6=(($5)&65535);
 var $7=($6&65535);
 var $8=$2|$7;
 var $9=(($8)&65535);
 $Ptr=$9;
 var $10=HEAP8[(82463)];
 var $11=($10&255);
 var $12=HEAP8[(82462)];
 var $13=($12&255);
 var $14=$13<<8;
 var $15=(($14)&65535);
 var $16=($15&65535);
 var $17=$11|$16;
 var $18=(($17)&65535);
 $Kurzor=$18;
 $i=0;
 label=2;break;
 case 2: 
 var $20=$i;
 var $21=($20&255);
 var $22=($21|0)<24;
 if($22){label=3;break;}else{label=15;break;}
 case 3: 
 $X=0;
 $j=0;
 label=4;break;
 case 4: 
 var $25=$j;
 var $26=($25&255);
 var $27=($26|0)<80;
 if($27){label=5;break;}else{label=13;break;}
 case 5: 
 var $29=$X;
 var $30=$Y;
 var $31=$Ptr;
 var $32=($31&65535);
 var $33=$32&2047;
 var $34=((80400+$33)|0);
 var $35=HEAP8[($34)];
 _IzrisiZnak($29,$30,$35);
 var $36=$Ptr;
 var $37=($36&65535);
 var $38=$Kurzor;
 var $39=($38&65535);
 var $40=($37|0)==($39|0);
 if($40){label=6;break;}else{label=11;break;}
 case 6: 
 var $42=HEAP8[(80336)];
 var $43=(($42)&1);
 if($43){label=7;break;}else{label=11;break;}
 case 7: 
 var $45=$X;
 var $46=$Y;
 var $47=HEAP8[(14736)];
 var $48=(($47)&1);
 if($48){label=8;break;}else{label=9;break;}
 case 8: 
 var $50=HEAP32[((80384)>>2)];
 var $54=$50;label=10;break;
 case 9: 
 var $52=HEAP32[((82480)>>2)];
 var $54=$52;label=10;break;
 case 10: 
 var $54;
 _NarisiPravokotnik($45,$46,$54);
 label=11;break;
 case 11: 
 var $56=$Ptr;
 var $57=((($56)+(1))&65535);
 $Ptr=$57;
 var $58=$X;
 var $59=((($58)+(6))|0);
 $X=$59;
 label=12;break;
 case 12: 
 var $61=$j;
 var $62=((($61)+(1))&255);
 $j=$62;
 label=4;break;
 case 13: 
 var $64=$Y;
 var $65=((($64)+(20))|0);
 $Y=$65;
 label=14;break;
 case 14: 
 var $67=$i;
 var $68=((($67)+(1))&255);
 $i=$68;
 label=2;break;
 case 15: 
 STACKTOP=sp;return;
  default: assert(0, "bad label: " + label);
 }

}


function _IzrisiZnak($X,$Y,$Znak){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1;
 var $2;
 var $3;
 var $JeInverz;
 var $Barva;
 var $FontPtr;
 var $ZaslonPtr;
 var $Vrstica;
 var $Stolpec;
 var $Maska;
 var $Komp;
 $1=$X;
 $2=$Y;
 $3=$Znak;
 var $4=$3;
 var $5=($4&255);
 var $6=($5|0)>=160;
 var $7=($6&1);
 $JeInverz=$7;
 var $8=HEAP8[(14736)];
 var $9=(($8)&1);
 var $10=($9&1);
 var $11=$JeInverz;
 var $12=(($11)&1);
 var $13=($12&1);
 var $14=($10|0)==($13|0);
 if($14){label=2;break;}else{label=3;break;}
 case 2: 
 var $16=HEAP32[((82480)>>2)];
 var $20=$16;label=4;break;
 case 3: 
 var $18=HEAP32[((80384)>>2)];
 var $20=$18;label=4;break;
 case 4: 
 var $20;
 $Barva=$20;
 var $21=$JeInverz;
 var $22=(($21)&1);
 if($22){label=5;break;}else{label=9;break;}
 case 5: 
 var $24=$3;
 var $25=($24&255);
 var $26=((($25)-(128))|0);
 var $27=(($26)&255);
 $3=$27;
 var $28=$1;
 var $29=$2;
 var $30=HEAP8[(14736)];
 var $31=(($30)&1);
 if($31){label=6;break;}else{label=7;break;}
 case 6: 
 var $33=HEAP32[((80384)>>2)];
 var $37=$33;label=8;break;
 case 7: 
 var $35=HEAP32[((82480)>>2)];
 var $37=$35;label=8;break;
 case 8: 
 var $37;
 _NarisiPravokotnik($28,$29,$37);
 label=9;break;
 case 9: 
 var $39=$3;
 var $40=($39&255);
 var $41=((40+($40<<2))|0);
 var $42=HEAP32[(($41)>>2)];
 var $43=((680+$42)|0);
 $FontPtr=$43;
 var $44=$FontPtr;
 var $45=(($44+1)|0);
 $FontPtr=$45;
 var $46=HEAP8[($44)];
 $Komp=$46;
 var $47=HEAP32[((14584)>>2)];
 var $48=(($47+20)|0);
 var $49=HEAP32[(($48)>>2)];
 var $50=$49;
 var $51=$2;
 var $52=$Komp;
 var $53=($52&255);
 var $54=($53<<1);
 var $55=((($51)+($54))|0);
 var $56=HEAP32[((14584)>>2)];
 var $57=(($56+16)|0);
 var $58=HEAP32[(($57)>>2)];
 var $59=(((($58>>>0))/(4))&-1);
 var $60=(Math_imul($55,$59)|0);
 var $61=(($50+($60<<2))|0);
 var $62=$1;
 var $63=(($61+($62<<2))|0);
 $ZaslonPtr=$63;
 $Maska=-128;
 var $64=$Komp;
 $Vrstica=$64;
 label=10;break;
 case 10: 
 var $66=$Vrstica;
 var $67=($66&255);
 var $68=($67|0)<10;
 if($68){label=11;break;}else{label=21;break;}
 case 11: 
 $Stolpec=0;
 label=12;break;
 case 12: 
 var $71=$Stolpec;
 var $72=($71&255);
 var $73=($72|0)<6;
 if($73){label=13;break;}else{label=19;break;}
 case 13: 
 var $75=$FontPtr;
 var $76=HEAP8[($75)];
 var $77=($76&255);
 var $78=$Maska;
 var $79=($78&255);
 var $80=$77&$79;
 var $81=($80|0)!=0;
 if($81){label=14;break;}else{label=15;break;}
 case 14: 
 var $83=$Barva;
 var $84=HEAP32[((14584)>>2)];
 var $85=(($84+16)|0);
 var $86=HEAP32[(($85)>>2)];
 var $87=(((($86>>>0))/(4))&-1);
 var $88=$ZaslonPtr;
 var $89=(($88+($87<<2))|0);
 HEAP32[(($89)>>2)]=$83;
 var $90=$ZaslonPtr;
 var $91=(($90)|0);
 HEAP32[(($91)>>2)]=$83;
 label=15;break;
 case 15: 
 var $93=$ZaslonPtr;
 var $94=(($93+4)|0);
 $ZaslonPtr=$94;
 var $95=$Maska;
 var $96=($95&255);
 var $97=$96>>1;
 var $98=(($97)&255);
 $Maska=$98;
 var $99=$Maska;
 var $100=(($99<<24)>>24)!=0;
 if($100){label=17;break;}else{label=16;break;}
 case 16: 
 var $102=$FontPtr;
 var $103=(($102+1)|0);
 $FontPtr=$103;
 $Maska=-128;
 label=17;break;
 case 17: 
 label=18;break;
 case 18: 
 var $106=$Stolpec;
 var $107=((($106)+(1))&255);
 $Stolpec=$107;
 label=12;break;
 case 19: 
 var $109=HEAP32[((14584)>>2)];
 var $110=(($109+16)|0);
 var $111=HEAP32[(($110)>>2)];
 var $112=(((($111>>>0))/(4))&-1);
 var $113=($112<<1);
 var $114=((($113)-(6))|0);
 var $115=$ZaslonPtr;
 var $116=(($115+($114<<2))|0);
 $ZaslonPtr=$116;
 label=20;break;
 case 20: 
 var $118=$Vrstica;
 var $119=((($118)+(1))&255);
 $Vrstica=$119;
 label=10;break;
 case 21: 
 STACKTOP=sp;return;
  default: assert(0, "bad label: " + label);
 }

}


function _NarisiPravokotnik($X,$Y,$Barva){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1;
 var $2;
 var $3;
 var $i;
 var $j;
 var $Ptr;
 $1=$X;
 $2=$Y;
 $3=$Barva;
 var $4=HEAP32[((14584)>>2)];
 var $5=(($4+20)|0);
 var $6=HEAP32[(($5)>>2)];
 var $7=$6;
 var $8=HEAP32[((14584)>>2)];
 var $9=(($8+8)|0);
 var $10=HEAP32[(($9)>>2)];
 var $11=$2;
 var $12=(Math_imul($10,$11)|0);
 var $13=(($7+($12<<2))|0);
 var $14=$1;
 var $15=(($13+($14<<2))|0);
 $Ptr=$15;
 $i=20;
 label=2;break;
 case 2: 
 var $17=$i;
 var $18=((($17)-(1))&255);
 $i=$18;
 var $19=(($17<<24)>>24)!=0;
 if($19){label=3;break;}else{label=7;break;}
 case 3: 
 $j=6;
 label=4;break;
 case 4: 
 var $22=$j;
 var $23=((($22)-(1))&255);
 $j=$23;
 var $24=(($22<<24)>>24)!=0;
 if($24){label=5;break;}else{label=6;break;}
 case 5: 
 var $26=$3;
 var $27=$Ptr;
 var $28=(($27+4)|0);
 $Ptr=$28;
 HEAP32[(($27)>>2)]=$26;
 label=4;break;
 case 6: 
 var $30=HEAP32[((14584)>>2)];
 var $31=(($30+8)|0);
 var $32=HEAP32[(($31)>>2)];
 var $33=((($32)-(6))|0);
 var $34=$Ptr;
 var $35=(($34+($33<<2))|0);
 $Ptr=$35;
 label=2;break;
 case 7: 
 STACKTOP=sp;return;
  default: assert(0, "bad label: " + label);
 }

}


function _CRTCReset(){
 var label=0;


 _memset(80400, 0, 2048)|0;
 HEAP8[(14736)]=0;
 HEAP8[(80336)]=0;
 HEAP8[(80328)]=1;
 var $1=HEAP32[((14584)>>2)];
 var $2=(($1+4)|0);
 var $3=HEAP32[(($2)>>2)];
 var $4=_SDL_MapRGB($3,0,0,0);
 HEAP32[((80384)>>2)]=$4;
 var $5=HEAP32[((14584)>>2)];
 var $6=(($5+4)|0);
 var $7=HEAP32[(($6)>>2)];
 var $8=_SDL_MapRGB($7,-1,-1,-1);
 HEAP32[((82480)>>2)]=$8;
 return;
}


function _CRTCVerticalBlanking(){
 var label=0;

 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=HEAP8[(80320)];
 var $2=(($1)&1);
 if($2){label=2;break;}else{label=4;break;}
 case 2: 
 var $4=HEAP8[(80328)];
 var $5=((($4)-(1))&255);
 HEAP8[(80328)]=$5;
 var $6=(($5<<24)>>24)!=0;
 if($6){label=4;break;}else{label=3;break;}
 case 3: 
 HEAP8[(14576)]=1;
 var $8=HEAP8[(80336)];
 var $9=(($8)&1);
 var $10=$9^1;
 var $11=($10&1);
 HEAP8[(80336)]=$11;
 HEAP8[(80328)]=16;
 label=4;break;
 case 4: 
 return;
  default: assert(0, "bad label: " + label);
 }

}


function _CRTCZapisiPort($Naslov,$Vrednost){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1;
 var $2;
 $1=$Naslov;
 $2=$Vrednost;
 var $3=$1;
 var $4=($3&65535);
 var $5=($4|0)<32768;
 if($5){label=2;break;}else{label=3;break;}
 case 2: 
 var $7=$2;
 var $8=$1;
 var $9=($8&65535);
 var $10=$9&2047;
 var $11=((80400+$10)|0);
 HEAP8[($11)]=$7;
 HEAP8[(14576)]=1;
 label=14;break;
 case 3: 
 var $13=$1;
 var $14=($13&65535);
 if(($14|0)==32832|($14|0)==32833){ label=12;break;}else if(($14|0)==32784){ label=4;break;}else if(($14|0)==32785){ label=7;break;}else{label=13;break;}
 case 4: 
 var $16=$2;
 var $17=($16&255);
 var $18=($17>>>0)>=18;
 if($18){label=5;break;}else{label=6;break;}
 case 5: 
 $2=0;
 label=6;break;
 case 6: 
 var $21=$2;
 HEAP8[(80392)]=$21;
 label=13;break;
 case 7: 
 var $23=HEAP8[(80392)];
 var $24=($23&255);
 if(($24|0)==15){ label=10;break;}else if(($24|0)==10){ label=8;break;}else if(($24|0)==14){ label=9;break;}else{label=11;break;}
 case 8: 
 var $26=$2;
 var $27=($26&255);
 var $28=$27&64;
 var $29=($28|0)!=0;
 var $30=($29&1);
 HEAP8[(80320)]=$30;
 HEAP8[(80336)]=1;
 HEAP8[(14576)]=1;
 label=11;break;
 case 9: 
 var $32=$2;
 var $33=($32&255);
 var $34=$33&63;
 var $35=(($34)&255);
 $2=$35;
 label=10;break;
 case 10: 
 HEAP8[(80336)]=0;
 HEAP8[(80328)]=1;
 label=11;break;
 case 11: 
 var $38=$2;
 var $39=HEAP8[(80392)];
 var $40=($39&255);
 var $41=((82448+$40)|0);
 HEAP8[($41)]=$38;
 label=13;break;
 case 12: 
 var $43=$1;
 var $44=($43&65535);
 var $45=$44&1;
 var $46=($45|0)!=0;
 var $47=$46^1;
 var $48=($47&1);
 HEAP8[(14736)]=$48;
 HEAP8[(14576)]=1;
 label=13;break;
 case 13: 
 label=14;break;
 case 14: 
 STACKTOP=sp;return;
  default: assert(0, "bad label: " + label);
 }

}


function _Deinicializiraj(){
 var label=0;


 _OdstraniDisketo(0);
 _OdstraniDisketo(1);
 return;
}


function _OdstraniDisketo($Katero){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1;
 $1=$Katero;
 var $2=$1;
 var $3=($2&255);
 var $4=((80344+($3<<2))|0);
 var $5=HEAP32[(($4)>>2)];
 var $6=($5|0)!=0;
 if($6){label=2;break;}else{label=3;break;}
 case 2: 
 var $8=$1;
 var $9=($8&255);
 var $10=((80344+($9<<2))|0);
 var $11=HEAP32[(($10)>>2)];
 var $12=_fclose($11);
 var $13=$1;
 var $14=($13&255);
 var $15=((80344+($14<<2))|0);
 HEAP32[(($15)>>2)]=0;
 label=3;break;
 case 3: 
 STACKTOP=sp;return;
  default: assert(0, "bad label: " + label);
 }

}


function _Emuliraj(){
 var label=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+48)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $Dogodek=sp;
 var $Cas;
 var $1=_SDL_PollEvent($Dogodek);
 var $2=($1|0)!=0;
 if($2){label=2;break;}else{label=12;break;}
 case 2: 
 var $4=$Dogodek;
 var $5=HEAP32[(($4)>>2)];
 if(($5|0)==769){ label=3;break;}else if(($5|0)==768){ label=4;break;}else{label=11;break;}
 case 3: 
 var $7=$Dogodek;
 var $8=(($7+12)|0);
 var $9=(($8+4)|0);
 var $10=HEAP32[(($9)>>2)];
 _TipDogodek($10,0);
 label=11;break;
 case 4: 
 var $12=$Dogodek;
 var $13=(($12+12)|0);
 var $14=(($13+8)|0);
 var $15=HEAP16[(($14)>>1)];
 var $16=($15&65535);
 var $17=$16&768;
 var $18=($17|0)!=0;
 if($18){label=5;break;}else{label=9;break;}
 case 5: 
 var $20=$Dogodek;
 var $21=(($20+12)|0);
 var $22=(($21+4)|0);
 var $23=HEAP32[(($22)>>2)];
 if(($23|0)==114){ label=6;break;}else{label=7;break;}
 case 6: 
 _Resetiraj();
 label=8;break;
 case 7: 
 label=8;break;
 case 8: 
 label=10;break;
 case 9: 
 var $28=$Dogodek;
 var $29=(($28+12)|0);
 var $30=(($29+4)|0);
 var $31=HEAP32[(($30)>>2)];
 _TipDogodek($31,1);
 label=10;break;
 case 10: 
 label=11;break;
 case 11: 
 label=12;break;
 case 12: 
 _IzrisiFrame();
 _CRTCVerticalBlanking();
 var $35=_zym_exec_ex(14592,80000);
 STACKTOP=sp;return;
  default: assert(0, "bad label: " + label);
 }

}


function _Resetiraj(){
 var label=0;


 var $1=_fopen(3056,3280);
 HEAP32[((80344)>>2)]=$1;
 _zym_reset(14592);
 _memset(14776, 0, 65536)|0;
 HEAP8[(82488)]=0;
 HEAP8[(82472)]=0;
 HEAP8[(80312)]=1;
 var $2=_PripraviCPMLDR();
 _CRTCReset();
 _TipReset();
 HEAP8[(14576)]=1;
 return;
}


function _IzrisiFrame(){
 var label=0;

 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=HEAP8[(14576)];
 var $2=(($1)&1);
 if($2){label=2;break;}else{label=3;break;}
 case 2: 
 var $4=_SDL_GetAppState();
 var $5=($4&255);
 var $6=$5&4;
 var $7=($6|0)!=0;
 if($7){label=4;break;}else{label=3;break;}
 case 3: 
 label=8;break;
 case 4: 
 var $10=HEAP32[((14584)>>2)];
 var $11=HEAP8[(14736)];
 var $12=(($11)&1);
 if($12){label=5;break;}else{label=6;break;}
 case 5: 
 var $14=HEAP32[((82480)>>2)];
 var $18=$14;label=7;break;
 case 6: 
 var $16=HEAP32[((80384)>>2)];
 var $18=$16;label=7;break;
 case 7: 
 var $18;
 var $19=_SDL_FillRect($10,0,$18);
 var $20=HEAP32[((14584)>>2)];
 var $21=_SDL_LockSurface($20);
 _CRTCIzrisiFrame();
 var $22=HEAP32[((14584)>>2)];
 _SDL_UnlockSurface($22);
 var $23=HEAP32[((14584)>>2)];
 _SDL_UpdateRect($23,0,0,0,0);
 HEAP8[(14576)]=0;
 label=8;break;
 case 8: 
 return;
  default: assert(0, "bad label: " + label);
 }

}


function _Inicializiraj(){
 var label=0;


 HEAP32[((13272)>>2)]=0;
 HEAP32[((13264)>>2)]=12;
 _zym_init(14592);
 _zym_clear_callbacks(14592);
 HEAP32[((14664)>>2)]=8;
 HEAP32[((14668)>>2)]=4;
 HEAP32[((14676)>>2)]=6;
 HEAP32[((14680)>>2)]=2;
 HEAP32[((80344)>>2)]=0;
 HEAP32[((80348)>>2)]=0;
 HEAP8[(80312)]=0;
 HEAP8[(14728)]=0;
 _Resetiraj();
 _emscripten_set_main_loop((10),50,1);
 return;
}


function _BeriBajtExec($Naslov){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);

 var $1;
 $1=$Naslov;
 var $2=$1;
 var $3=_PrevediNaslov($2);
 var $4=HEAP8[($3)];
 STACKTOP=sp;return $4;
}


function _BeriBajt($tZ80,$Naslov,$Kaj){
 var label=0;
 var tempVarArgs=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+32)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1;
 var $2;
 var $3;
 var $4;
 var $Vrstica=sp;
 var $BIOSOdmik;
 var $Kvocient=(sp)+(24);
 $2=$tZ80;
 $3=$Naslov;
 $4=$Kaj;
 var $5=$2;
 var $6=$4;
 var $7=$4;
 var $8=($7|0)==0;
 if($8){label=2;break;}else{label=14;break;}
 case 2: 
 var $10=$3;
 var $11=($10&65535);
 switch(($11|0)){case 60863:{ label=10;break;}case 60700:{ label=3;break;}case 60714:{ label=4;break;}case 60817:{ label=5;break;}case 60839:{ label=6;break;}case 60845:{ label=7;break;}case 60854:{ label=8;break;}case 60860:{ label=9;break;}default:{label=11;break;}}break;
 case 3: 
 label=11;break;
 case 4: 
 var $14=HEAP32[((_stderr)>>2)];
 var $15=HEAP8[(14592)];
 var $16=($15&255);
 var $17=_fprintf($14,2480,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$16,tempVarArgs)); STACKTOP=tempVarArgs;
 label=11;break;
 case 5: 
 var $19=HEAP32[((_stderr)>>2)];
 var $20=HEAP8[(14592)];
 var $21=($20&255);
 var $22=_fprintf($19,2368,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$21,tempVarArgs)); STACKTOP=tempVarArgs;
 var $23=HEAP8[(14592)];
 var $24=($23&255);
 var $25=($24|0)!=0;
 var $26=($25&1);
 var $27=(($26)&255);
 HEAP8[(14720)]=$27;
 label=11;break;
 case 6: 
 var $29=HEAP32[((_stderr)>>2)];
 var $30=HEAP16[((14592)>>1)];
 var $31=($30&65535);
 var $32=_fprintf($29,2256,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$31,tempVarArgs)); STACKTOP=tempVarArgs;
 var $33=HEAP16[((14592)>>1)];
 HEAP16[((80352)>>1)]=$33;
 label=11;break;
 case 7: 
 var $35=HEAP32[((_stderr)>>2)];
 var $36=HEAP16[((14592)>>1)];
 var $37=($36&65535);
 var $38=_fprintf($35,2144,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$37,tempVarArgs)); STACKTOP=tempVarArgs;
 var $39=HEAP16[((14592)>>1)];
 HEAP16[((80360)>>1)]=$39;
 label=11;break;
 case 8: 
 var $41=HEAP32[((_stderr)>>2)];
 var $42=HEAP16[((14592)>>1)];
 var $43=($42&65535);
 var $44=_fprintf($41,3448,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$43,tempVarArgs)); STACKTOP=tempVarArgs;
 var $45=HEAP16[((14592)>>1)];
 HEAP16[((80368)>>1)]=$45;
 label=11;break;
 case 9: 
 var $47=HEAP32[((_stderr)>>2)];
 var $48=_fputs(3344,$47);
 var $49=_DiskIO(0);
 HEAP8[(14599)]=$49;
 $1=-55;
 label=15;break;
 case 10: 
 var $51=HEAP32[((_stderr)>>2)];
 var $52=_fputs(3192,$51);
 var $53=_DiskIO(1);
 HEAP8[(14599)]=$53;
 $1=-55;
 label=15;break;
 case 11: 
 var $55=HEAP8[(14728)];
 var $56=(($55)&1);
 if($56){label=12;break;}else{label=13;break;}
 case 12: 
 var $58=(($Vrstica)|0);
 var $59=$3;
 var $60=_urDisassembleOne($58,$59);
 var $61=HEAP32[((_stderr)>>2)];
 var $62=$3;
 var $63=($62&65535);
 var $64=_fprintf($61,3072,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$63,tempVarArgs)); STACKTOP=tempVarArgs;
 var $65=(($Vrstica)|0);
 var $66=HEAP32[((_stderr)>>2)];
 var $67=_fputs($65,$66);
 var $68=HEAP32[((_stderr)>>2)];
 var $69=_fputc(10,$68);
 label=13;break;
 case 13: 
 label=14;break;
 case 14: 
 var $72=$3;
 var $73=_BeriBajtExec($72);
 $1=$73;
 label=15;break;
 case 15: 
 var $75=$1;
 STACKTOP=sp;return $75;
  default: assert(0, "bad label: " + label);
 }

}


function _ZapisiBajt($tZ80,$Naslov,$Vrednost,$Kaj){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1;
 var $2;
 var $3;
 var $4;
 $1=$tZ80;
 $2=$Naslov;
 $3=$Vrednost;
 $4=$Kaj;
 var $5=$1;
 var $6=$4;
 var $7=HEAP8[(14768)];
 var $8=(($7)&1);
 if($8){label=2;break;}else{label=3;break;}
 case 2: 
 var $10=$2;
 var $11=($10&65535);
 var $12=($11|0)>=16384;
 if($12){label=3;break;}else{label=4;break;}
 case 3: 
 var $14=$3;
 var $15=$2;
 var $16=_PrevediNaslov($15);
 HEAP8[($16)]=$14;
 label=4;break;
 case 4: 
 STACKTOP=sp;return;
  default: assert(0, "bad label: " + label);
 }

}


function _BeriPort($tZ80,$Naslov,$Kaj){
 var label=0;
 var tempVarArgs=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1;
 var $2;
 var $3;
 var $Rezultat;
 $1=$tZ80;
 $2=$Naslov;
 $3=$Kaj;
 var $4=$1;
 var $5=$3;
 var $6=$2;
 var $7=($6&65535);
 switch(($7|0)){case 32784:case 32785:case 32832:case 32833:{ label=2;break;}case 32800:case 32816:{ label=3;break;}case 34816:{ label=4;break;}default:{label=5;break;}}break;
 case 2: 
 var $9=$2;
 var $10=_CRTCBeriPort($9);
 $Rezultat=$10;
 label=9;break;
 case 3: 
 var $12=$2;
 var $13=_TipBeriPort($12);
 $Rezultat=$13;
 label=9;break;
 case 4: 
 $Rezultat=-86;
 label=9;break;
 case 5: 
 var $16=$2;
 var $17=($16&65535);
 var $18=($17|0)<32768;
 if($18){label=6;break;}else{label=7;break;}
 case 6: 
 var $20=$2;
 var $21=_CRTCBeriPort($20);
 $Rezultat=$21;
 label=8;break;
 case 7: 
 $Rezultat=0;
 label=8;break;
 case 8: 
 label=9;break;
 case 9: 
 var $25=HEAP8[(80312)];
 var $26=(($25)&1);
 if($26){label=10;break;}else{label=12;break;}
 case 10: 
 var $28=$2;
 var $29=($28&65535);
 var $30=($29|0)!=32816;
 if($30){label=11;break;}else{label=12;break;}
 case 11: 
 var $32=HEAP32[((_stderr)>>2)];
 var $33=$2;
 var $34=_DebugPortStr($33);
 var $35=$Rezultat;
 var $36=($35&255);
 var $37=_fprintf($32,2592,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 16)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$34,HEAP32[(((tempVarArgs)+(8))>>2)]=$36,tempVarArgs)); STACKTOP=tempVarArgs;
 label=12;break;
 case 12: 
 var $39=$Rezultat;
 STACKTOP=sp;return $39;
  default: assert(0, "bad label: " + label);
 }

}


function _ZapisiPort($tZ80,$Naslov,$Vrednost,$Kaj){
 var label=0;
 var tempVarArgs=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1;
 var $2;
 var $3;
 var $4;
 $1=$tZ80;
 $2=$Naslov;
 $3=$Vrednost;
 $4=$Kaj;
 var $5=$1;
 var $6=$4;
 var $7=HEAP8[(80312)];
 var $8=(($7)&1);
 if($8){label=2;break;}else{label=4;break;}
 case 2: 
 var $10=$2;
 var $11=($10&65535);
 var $12=($11|0)!=32816;
 if($12){label=3;break;}else{label=4;break;}
 case 3: 
 var $14=HEAP32[((_stderr)>>2)];
 var $15=$2;
 var $16=_DebugPortStr($15);
 var $17=$3;
 var $18=($17&255);
 var $19=_fprintf($14,2784,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 16)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$16,HEAP32[(((tempVarArgs)+(8))>>2)]=$18,tempVarArgs)); STACKTOP=tempVarArgs;
 label=4;break;
 case 4: 
 var $21=$2;
 var $22=($21&65535);
 switch(($22|0)){case 32784:case 32785:case 32832:case 32833:{ label=5;break;}case 32800:case 32816:{ label=6;break;}default:{label=7;break;}}break;
 case 5: 
 var $24=$2;
 var $25=$3;
 _CRTCZapisiPort($24,$25);
 label=10;break;
 case 6: 
 var $27=$2;
 var $28=$3;
 _TipZapisiPort($27,$28);
 label=10;break;
 case 7: 
 var $30=$2;
 var $31=($30&65535);
 var $32=($31|0)<32768;
 if($32){label=8;break;}else{label=9;break;}
 case 8: 
 var $34=$2;
 var $35=$3;
 _CRTCZapisiPort($34,$35);
 label=9;break;
 case 9: 
 label=10;break;
 case 10: 
 STACKTOP=sp;return;
  default: assert(0, "bad label: " + label);
 }

}


function _PripraviCPMLDR(){
 var label=0;

 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=HEAP32[((80344)>>2)];
 var $2=_fread(69560,10240,1,$1);
 var $3=($2|0)!=0;
 if($3){label=3;break;}else{label=2;break;}
 case 2: 
 _Napaka(2896);
 label=3;break;
 case 3: 
 HEAP16[((82496)>>1)]=-5632;
 HEAP16[((82504)>>1)]=-9210;
 HEAP8[(80376)]=0;
 HEAP8[(14640)]=2;
 HEAP16[((14622)>>1)]=-10752;
 return 0;
  default: assert(0, "bad label: " + label);
 }

}


function _DebugPortStr($Naslov){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);

 var $1;
 $1=$Naslov;
 STACKTOP=sp;return 14096;
}


function _PrevediNaslov($Naslov){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);

 var $1;
 $1=$Naslov;
 var $2=$1;
 var $3=($2&65535);
 var $4=((14776+$3)|0);
 STACKTOP=sp;return $4;
}


function _DiskIO($Zapisi){
 var label=0;
 var tempVarArgs=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1;
 var $2;
 var $tBanka;
 var $StBajtov;
 var $Naslov;
 var $Disk;
 var $Bajt;
 var $3=($Zapisi&1);
 $2=$3;
 var $4=HEAP8[(14720)];
 var $5=($4&255);
 var $6=((80344+($5<<2))|0);
 var $7=HEAP32[(($6)>>2)];
 $Disk=$7;
 var $8=$Disk;
 var $9=_PojdiNaSektor($8);
 if($9){label=2;break;}else{label=3;break;}
 case 2: 
 $1=1;
 label=16;break;
 case 3: 
 var $12=HEAP8[(80312)];
 var $13=(($12)&1);
 if($13){label=4;break;}else{label=5;break;}
 case 4: 
 var $15=HEAP32[((_stderr)>>2)];
 var $16=$Disk;
 var $17=_ftell($16);
 var $18=_fprintf($15,3032,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$17,tempVarArgs)); STACKTOP=tempVarArgs;
 label=5;break;
 case 5: 
 var $20=HEAP8[(82488)];
 $tBanka=$20;
 var $21=HEAP8[(80376)];
 HEAP8[(82488)]=$21;
 $StBajtov=128;
 var $22=HEAP16[((80368)>>1)];
 $Naslov=$22;
 label=6;break;
 case 6: 
 var $24=$StBajtov;
 var $25=($24|0)!=0;
 if($25){label=7;break;}else{label=15;break;}
 case 7: 
 var $27=$2;
 var $28=(($27)&1);
 if($28){label=8;break;}else{label=11;break;}
 case 8: 
 var $30=$Naslov;
 var $31=((($30)+(1))&65535);
 $Naslov=$31;
 var $32=_PrevediNaslov($30);
 var $33=HEAP8[($32)];
 var $34=($33&255);
 var $35=$Disk;
 var $36=_fputc($34,$35);
 var $37=($36|0)==-1;
 if($37){label=9;break;}else{label=10;break;}
 case 9: 
 label=15;break;
 case 10: 
 label=14;break;
 case 11: 
 var $41=$Disk;
 var $42=_fgetc($41);
 $Bajt=$42;
 var $43=$Bajt;
 var $44=($43|0)==-1;
 if($44){label=12;break;}else{label=13;break;}
 case 12: 
 label=15;break;
 case 13: 
 var $47=$Bajt;
 var $48=(($47)&255);
 var $49=$Naslov;
 var $50=((($49)+(1))&65535);
 $Naslov=$50;
 var $51=_PrevediNaslov($49);
 HEAP8[($51)]=$48;
 label=14;break;
 case 14: 
 var $53=$StBajtov;
 var $54=((($53)-(1))|0);
 $StBajtov=$54;
 label=6;break;
 case 15: 
 var $56=$tBanka;
 HEAP8[(82488)]=$56;
 var $57=$StBajtov;
 var $58=($57|0)!=0;
 var $59=($58?1:0);
 var $60=(($59)&255);
 $1=$60;
 label=16;break;
 case 16: 
 var $62=$1;
 STACKTOP=sp;return $62;
  default: assert(0, "bad label: " + label);
 }

}


function _PojdiNaSektor($Disk){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1;
 var $2;
 var $SektorjevNaSled;
 $2=$Disk;
 var $3=$2;
 var $4=($3|0)!=0;
 if($4){label=3;break;}else{label=2;break;}
 case 2: 
 $1=1;
 label=8;break;
 case 3: 
 $SektorjevNaSled=80;
 var $7=HEAP16[((80352)>>1)];
 var $8=($7&65535);
 var $9=($8|0)>80;
 if($9){label=4;break;}else{label=5;break;}
 case 4: 
 $1=1;
 label=8;break;
 case 5: 
 var $12=HEAP16[((80360)>>1)];
 var $13=($12&65535);
 var $14=$SektorjevNaSled;
 var $15=($13|0)>=($14|0);
 if($15){label=6;break;}else{label=7;break;}
 case 6: 
 $1=1;
 label=8;break;
 case 7: 
 var $18=$2;
 var $19=HEAP16[((80352)>>1)];
 var $20=($19&65535);
 var $21=$SektorjevNaSled;
 var $22=(Math_imul($20,$21)|0);
 var $23=HEAP16[((80360)>>1)];
 var $24=($23&65535);
 var $25=((($22)+($24))|0);
 var $26=($25<<7);
 var $27=_fseek($18,$26,0);
 var $28=($27|0)!=0;
 $1=$28;
 label=8;break;
 case 8: 
 var $30=$1;
 STACKTOP=sp;return $30;
  default: assert(0, "bad label: " + label);
 }

}


function _TipBeriPort($Naslov){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1;
 var $2;
 $2=$Naslov;
 var $3=$2;
 var $4=($3&65535);
 if(($4|0)==32816){ label=2;break;}else{label=3;break;}
 case 2: 
 var $6=HEAP8[(14744)];
 var $7=($6&255);
 var $8=((14752+$7)|0);
 var $9=HEAP8[($8)];
 $1=$9;
 label=4;break;
 case 3: 
 $1=0;
 label=4;break;
 case 4: 
 var $12=$1;
 STACKTOP=sp;return $12;
  default: assert(0, "bad label: " + label);
 }

}


function _TipDogodek($Tipka,$Stanje){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1;
 var $2;
 var $i;
 var $j;
 $1=$Tipka;
 var $3=($Stanje&1);
 $2=$3;
 var $4=$1;
 switch(($4|0)){case 1253:{ label=2;break;}case 1252:{ label=3;break;}case 1106:{ label=4;break;}case 1105:{ label=5;break;}case 1104:{ label=6;break;}case 1103:{ label=7;break;}default:{label=8;break;}}break;
 case 2: 
 $1=1249;
 label=8;break;
 case 3: 
 $1=1248;
 label=8;break;
 case 4: 
 $1=1086;
 label=8;break;
 case 5: 
 $1=1087;
 label=8;break;
 case 6: 
 $1=1088;
 label=8;break;
 case 7: 
 $1=1089;
 label=8;break;
 case 8: 
 $i=0;
 label=9;break;
 case 9: 
 var $13=$i;
 var $14=($13&255);
 var $15=($14|0)<16;
 if($15){label=10;break;}else{label=21;break;}
 case 10: 
 $j=0;
 label=11;break;
 case 11: 
 var $18=$j;
 var $19=($18&255);
 var $20=($19|0)<8;
 if($20){label=12;break;}else{label=19;break;}
 case 12: 
 var $22=$1;
 var $23=$j;
 var $24=($23&255);
 var $25=$i;
 var $26=($25&255);
 var $27=((12752+($26<<5))|0);
 var $28=(($27+($24<<2))|0);
 var $29=HEAP32[(($28)>>2)];
 var $30=($22|0)==($29|0);
 if($30){label=13;break;}else{label=17;break;}
 case 13: 
 var $32=$2;
 var $33=(($32)&1);
 if($33){label=14;break;}else{label=15;break;}
 case 14: 
 var $35=$j;
 var $36=($35&255);
 var $37=(((7)-($36))|0);
 var $38=1<<$37;
 var $39=$38^-1;
 var $40=$i;
 var $41=($40&255);
 var $42=((14752+$41)|0);
 var $43=HEAP8[($42)];
 var $44=($43&255);
 var $45=$44&$39;
 var $46=(($45)&255);
 HEAP8[($42)]=$46;
 label=16;break;
 case 15: 
 var $48=$j;
 var $49=($48&255);
 var $50=(((7)-($49))|0);
 var $51=1<<$50;
 var $52=$i;
 var $53=($52&255);
 var $54=((14752+$53)|0);
 var $55=HEAP8[($54)];
 var $56=($55&255);
 var $57=$56|$51;
 var $58=(($57)&255);
 HEAP8[($54)]=$58;
 label=16;break;
 case 16: 
 label=21;break;
 case 17: 
 label=18;break;
 case 18: 
 var $62=$j;
 var $63=((($62)+(1))&255);
 $j=$63;
 label=11;break;
 case 19: 
 label=20;break;
 case 20: 
 var $66=$i;
 var $67=((($66)+(1))&255);
 $i=$67;
 label=9;break;
 case 21: 
 STACKTOP=sp;return;
  default: assert(0, "bad label: " + label);
 }

}


function _TipReset(){
 var label=0;


 _memset(14752, -1, 16)|0;
 HEAP8[(14744)]=0;
 return;
}


function _TipZapisiPort($Naslov,$Vrednost){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1;
 var $2;
 $1=$Naslov;
 $2=$Vrednost;
 var $3=$1;
 var $4=($3&65535);
 if(($4|0)==32816){ label=2;break;}else{label=3;break;}
 case 2: 
 var $6=$2;
 var $7=($6&255);
 var $8=$7&15;
 var $9=(($8)&255);
 HEAP8[(14744)]=$9;
 label=3;break;
 case 3: 
 STACKTOP=sp;return;
  default: assert(0, "bad label: " + label);
 }

}


function _malloc($bytes){
 var label=0;

 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=($bytes>>>0)<245;
 if($1){label=2;break;}else{label=78;break;}
 case 2: 
 var $3=($bytes>>>0)<11;
 if($3){var $8=16;label=4;break;}else{label=3;break;}
 case 3: 
 var $5=((($bytes)+(11))|0);
 var $6=$5&-8;
 var $8=$6;label=4;break;
 case 4: 
 var $8;
 var $9=$8>>>3;
 var $10=HEAP32[((14104)>>2)];
 var $11=$10>>>($9>>>0);
 var $12=$11&3;
 var $13=($12|0)==0;
 if($13){label=12;break;}else{label=5;break;}
 case 5: 
 var $15=$11&1;
 var $16=$15^1;
 var $17=((($16)+($9))|0);
 var $18=$17<<1;
 var $19=((14144+($18<<2))|0);
 var $20=$19;
 var $_sum111=((($18)+(2))|0);
 var $21=((14144+($_sum111<<2))|0);
 var $22=HEAP32[(($21)>>2)];
 var $23=(($22+8)|0);
 var $24=HEAP32[(($23)>>2)];
 var $25=($20|0)==($24|0);
 if($25){label=6;break;}else{label=7;break;}
 case 6: 
 var $27=1<<$17;
 var $28=$27^-1;
 var $29=$10&$28;
 HEAP32[((14104)>>2)]=$29;
 label=11;break;
 case 7: 
 var $31=$24;
 var $32=HEAP32[((14120)>>2)];
 var $33=($31>>>0)<($32>>>0);
 if($33){label=10;break;}else{label=8;break;}
 case 8: 
 var $35=(($24+12)|0);
 var $36=HEAP32[(($35)>>2)];
 var $37=($36|0)==($22|0);
 if($37){label=9;break;}else{label=10;break;}
 case 9: 
 HEAP32[(($35)>>2)]=$20;
 HEAP32[(($21)>>2)]=$24;
 label=11;break;
 case 10: 
 _abort();
 throw "Reached an unreachable!";
 case 11: 
 var $40=$17<<3;
 var $41=$40|3;
 var $42=(($22+4)|0);
 HEAP32[(($42)>>2)]=$41;
 var $43=$22;
 var $_sum113114=$40|4;
 var $44=(($43+$_sum113114)|0);
 var $45=$44;
 var $46=HEAP32[(($45)>>2)];
 var $47=$46|1;
 HEAP32[(($45)>>2)]=$47;
 var $48=$23;
 var $mem_0=$48;label=341;break;
 case 12: 
 var $50=HEAP32[((14112)>>2)];
 var $51=($8>>>0)>($50>>>0);
 if($51){label=13;break;}else{var $nb_0=$8;label=160;break;}
 case 13: 
 var $53=($11|0)==0;
 if($53){label=27;break;}else{label=14;break;}
 case 14: 
 var $55=$11<<$9;
 var $56=2<<$9;
 var $57=(((-$56))|0);
 var $58=$56|$57;
 var $59=$55&$58;
 var $60=(((-$59))|0);
 var $61=$59&$60;
 var $62=((($61)-(1))|0);
 var $63=$62>>>12;
 var $64=$63&16;
 var $65=$62>>>($64>>>0);
 var $66=$65>>>5;
 var $67=$66&8;
 var $68=$67|$64;
 var $69=$65>>>($67>>>0);
 var $70=$69>>>2;
 var $71=$70&4;
 var $72=$68|$71;
 var $73=$69>>>($71>>>0);
 var $74=$73>>>1;
 var $75=$74&2;
 var $76=$72|$75;
 var $77=$73>>>($75>>>0);
 var $78=$77>>>1;
 var $79=$78&1;
 var $80=$76|$79;
 var $81=$77>>>($79>>>0);
 var $82=((($80)+($81))|0);
 var $83=$82<<1;
 var $84=((14144+($83<<2))|0);
 var $85=$84;
 var $_sum104=((($83)+(2))|0);
 var $86=((14144+($_sum104<<2))|0);
 var $87=HEAP32[(($86)>>2)];
 var $88=(($87+8)|0);
 var $89=HEAP32[(($88)>>2)];
 var $90=($85|0)==($89|0);
 if($90){label=15;break;}else{label=16;break;}
 case 15: 
 var $92=1<<$82;
 var $93=$92^-1;
 var $94=$10&$93;
 HEAP32[((14104)>>2)]=$94;
 label=20;break;
 case 16: 
 var $96=$89;
 var $97=HEAP32[((14120)>>2)];
 var $98=($96>>>0)<($97>>>0);
 if($98){label=19;break;}else{label=17;break;}
 case 17: 
 var $100=(($89+12)|0);
 var $101=HEAP32[(($100)>>2)];
 var $102=($101|0)==($87|0);
 if($102){label=18;break;}else{label=19;break;}
 case 18: 
 HEAP32[(($100)>>2)]=$85;
 HEAP32[(($86)>>2)]=$89;
 label=20;break;
 case 19: 
 _abort();
 throw "Reached an unreachable!";
 case 20: 
 var $105=$82<<3;
 var $106=((($105)-($8))|0);
 var $107=$8|3;
 var $108=(($87+4)|0);
 HEAP32[(($108)>>2)]=$107;
 var $109=$87;
 var $110=(($109+$8)|0);
 var $111=$110;
 var $112=$106|1;
 var $_sum106107=$8|4;
 var $113=(($109+$_sum106107)|0);
 var $114=$113;
 HEAP32[(($114)>>2)]=$112;
 var $115=(($109+$105)|0);
 var $116=$115;
 HEAP32[(($116)>>2)]=$106;
 var $117=HEAP32[((14112)>>2)];
 var $118=($117|0)==0;
 if($118){label=26;break;}else{label=21;break;}
 case 21: 
 var $120=HEAP32[((14124)>>2)];
 var $121=$117>>>3;
 var $122=$121<<1;
 var $123=((14144+($122<<2))|0);
 var $124=$123;
 var $125=HEAP32[((14104)>>2)];
 var $126=1<<$121;
 var $127=$125&$126;
 var $128=($127|0)==0;
 if($128){label=22;break;}else{label=23;break;}
 case 22: 
 var $130=$125|$126;
 HEAP32[((14104)>>2)]=$130;
 var $_sum109_pre=((($122)+(2))|0);
 var $_pre=((14144+($_sum109_pre<<2))|0);
 var $F4_0=$124;var $_pre_phi=$_pre;label=25;break;
 case 23: 
 var $_sum110=((($122)+(2))|0);
 var $132=((14144+($_sum110<<2))|0);
 var $133=HEAP32[(($132)>>2)];
 var $134=$133;
 var $135=HEAP32[((14120)>>2)];
 var $136=($134>>>0)<($135>>>0);
 if($136){label=24;break;}else{var $F4_0=$133;var $_pre_phi=$132;label=25;break;}
 case 24: 
 _abort();
 throw "Reached an unreachable!";
 case 25: 
 var $_pre_phi;
 var $F4_0;
 HEAP32[(($_pre_phi)>>2)]=$120;
 var $139=(($F4_0+12)|0);
 HEAP32[(($139)>>2)]=$120;
 var $140=(($120+8)|0);
 HEAP32[(($140)>>2)]=$F4_0;
 var $141=(($120+12)|0);
 HEAP32[(($141)>>2)]=$124;
 label=26;break;
 case 26: 
 HEAP32[((14112)>>2)]=$106;
 HEAP32[((14124)>>2)]=$111;
 var $143=$88;
 var $mem_0=$143;label=341;break;
 case 27: 
 var $145=HEAP32[((14108)>>2)];
 var $146=($145|0)==0;
 if($146){var $nb_0=$8;label=160;break;}else{label=28;break;}
 case 28: 
 var $148=(((-$145))|0);
 var $149=$145&$148;
 var $150=((($149)-(1))|0);
 var $151=$150>>>12;
 var $152=$151&16;
 var $153=$150>>>($152>>>0);
 var $154=$153>>>5;
 var $155=$154&8;
 var $156=$155|$152;
 var $157=$153>>>($155>>>0);
 var $158=$157>>>2;
 var $159=$158&4;
 var $160=$156|$159;
 var $161=$157>>>($159>>>0);
 var $162=$161>>>1;
 var $163=$162&2;
 var $164=$160|$163;
 var $165=$161>>>($163>>>0);
 var $166=$165>>>1;
 var $167=$166&1;
 var $168=$164|$167;
 var $169=$165>>>($167>>>0);
 var $170=((($168)+($169))|0);
 var $171=((14408+($170<<2))|0);
 var $172=HEAP32[(($171)>>2)];
 var $173=(($172+4)|0);
 var $174=HEAP32[(($173)>>2)];
 var $175=$174&-8;
 var $176=((($175)-($8))|0);
 var $t_0_i=$172;var $v_0_i=$172;var $rsize_0_i=$176;label=29;break;
 case 29: 
 var $rsize_0_i;
 var $v_0_i;
 var $t_0_i;
 var $178=(($t_0_i+16)|0);
 var $179=HEAP32[(($178)>>2)];
 var $180=($179|0)==0;
 if($180){label=30;break;}else{var $185=$179;label=31;break;}
 case 30: 
 var $182=(($t_0_i+20)|0);
 var $183=HEAP32[(($182)>>2)];
 var $184=($183|0)==0;
 if($184){label=32;break;}else{var $185=$183;label=31;break;}
 case 31: 
 var $185;
 var $186=(($185+4)|0);
 var $187=HEAP32[(($186)>>2)];
 var $188=$187&-8;
 var $189=((($188)-($8))|0);
 var $190=($189>>>0)<($rsize_0_i>>>0);
 var $_rsize_0_i=($190?$189:$rsize_0_i);
 var $_v_0_i=($190?$185:$v_0_i);
 var $t_0_i=$185;var $v_0_i=$_v_0_i;var $rsize_0_i=$_rsize_0_i;label=29;break;
 case 32: 
 var $192=$v_0_i;
 var $193=HEAP32[((14120)>>2)];
 var $194=($192>>>0)<($193>>>0);
 if($194){label=76;break;}else{label=33;break;}
 case 33: 
 var $196=(($192+$8)|0);
 var $197=$196;
 var $198=($192>>>0)<($196>>>0);
 if($198){label=34;break;}else{label=76;break;}
 case 34: 
 var $200=(($v_0_i+24)|0);
 var $201=HEAP32[(($200)>>2)];
 var $202=(($v_0_i+12)|0);
 var $203=HEAP32[(($202)>>2)];
 var $204=($203|0)==($v_0_i|0);
 if($204){label=40;break;}else{label=35;break;}
 case 35: 
 var $206=(($v_0_i+8)|0);
 var $207=HEAP32[(($206)>>2)];
 var $208=$207;
 var $209=($208>>>0)<($193>>>0);
 if($209){label=39;break;}else{label=36;break;}
 case 36: 
 var $211=(($207+12)|0);
 var $212=HEAP32[(($211)>>2)];
 var $213=($212|0)==($v_0_i|0);
 if($213){label=37;break;}else{label=39;break;}
 case 37: 
 var $215=(($203+8)|0);
 var $216=HEAP32[(($215)>>2)];
 var $217=($216|0)==($v_0_i|0);
 if($217){label=38;break;}else{label=39;break;}
 case 38: 
 HEAP32[(($211)>>2)]=$203;
 HEAP32[(($215)>>2)]=$207;
 var $R_1_i=$203;label=47;break;
 case 39: 
 _abort();
 throw "Reached an unreachable!";
 case 40: 
 var $220=(($v_0_i+20)|0);
 var $221=HEAP32[(($220)>>2)];
 var $222=($221|0)==0;
 if($222){label=41;break;}else{var $R_0_i=$221;var $RP_0_i=$220;label=42;break;}
 case 41: 
 var $224=(($v_0_i+16)|0);
 var $225=HEAP32[(($224)>>2)];
 var $226=($225|0)==0;
 if($226){var $R_1_i=0;label=47;break;}else{var $R_0_i=$225;var $RP_0_i=$224;label=42;break;}
 case 42: 
 var $RP_0_i;
 var $R_0_i;
 var $227=(($R_0_i+20)|0);
 var $228=HEAP32[(($227)>>2)];
 var $229=($228|0)==0;
 if($229){label=43;break;}else{var $R_0_i=$228;var $RP_0_i=$227;label=42;break;}
 case 43: 
 var $231=(($R_0_i+16)|0);
 var $232=HEAP32[(($231)>>2)];
 var $233=($232|0)==0;
 if($233){label=44;break;}else{var $R_0_i=$232;var $RP_0_i=$231;label=42;break;}
 case 44: 
 var $235=$RP_0_i;
 var $236=($235>>>0)<($193>>>0);
 if($236){label=46;break;}else{label=45;break;}
 case 45: 
 HEAP32[(($RP_0_i)>>2)]=0;
 var $R_1_i=$R_0_i;label=47;break;
 case 46: 
 _abort();
 throw "Reached an unreachable!";
 case 47: 
 var $R_1_i;
 var $240=($201|0)==0;
 if($240){label=67;break;}else{label=48;break;}
 case 48: 
 var $242=(($v_0_i+28)|0);
 var $243=HEAP32[(($242)>>2)];
 var $244=((14408+($243<<2))|0);
 var $245=HEAP32[(($244)>>2)];
 var $246=($v_0_i|0)==($245|0);
 if($246){label=49;break;}else{label=51;break;}
 case 49: 
 HEAP32[(($244)>>2)]=$R_1_i;
 var $cond_i=($R_1_i|0)==0;
 if($cond_i){label=50;break;}else{label=57;break;}
 case 50: 
 var $248=1<<$243;
 var $249=$248^-1;
 var $250=HEAP32[((14108)>>2)];
 var $251=$250&$249;
 HEAP32[((14108)>>2)]=$251;
 label=67;break;
 case 51: 
 var $253=$201;
 var $254=HEAP32[((14120)>>2)];
 var $255=($253>>>0)<($254>>>0);
 if($255){label=55;break;}else{label=52;break;}
 case 52: 
 var $257=(($201+16)|0);
 var $258=HEAP32[(($257)>>2)];
 var $259=($258|0)==($v_0_i|0);
 if($259){label=53;break;}else{label=54;break;}
 case 53: 
 HEAP32[(($257)>>2)]=$R_1_i;
 label=56;break;
 case 54: 
 var $262=(($201+20)|0);
 HEAP32[(($262)>>2)]=$R_1_i;
 label=56;break;
 case 55: 
 _abort();
 throw "Reached an unreachable!";
 case 56: 
 var $265=($R_1_i|0)==0;
 if($265){label=67;break;}else{label=57;break;}
 case 57: 
 var $267=$R_1_i;
 var $268=HEAP32[((14120)>>2)];
 var $269=($267>>>0)<($268>>>0);
 if($269){label=66;break;}else{label=58;break;}
 case 58: 
 var $271=(($R_1_i+24)|0);
 HEAP32[(($271)>>2)]=$201;
 var $272=(($v_0_i+16)|0);
 var $273=HEAP32[(($272)>>2)];
 var $274=($273|0)==0;
 if($274){label=62;break;}else{label=59;break;}
 case 59: 
 var $276=$273;
 var $277=HEAP32[((14120)>>2)];
 var $278=($276>>>0)<($277>>>0);
 if($278){label=61;break;}else{label=60;break;}
 case 60: 
 var $280=(($R_1_i+16)|0);
 HEAP32[(($280)>>2)]=$273;
 var $281=(($273+24)|0);
 HEAP32[(($281)>>2)]=$R_1_i;
 label=62;break;
 case 61: 
 _abort();
 throw "Reached an unreachable!";
 case 62: 
 var $284=(($v_0_i+20)|0);
 var $285=HEAP32[(($284)>>2)];
 var $286=($285|0)==0;
 if($286){label=67;break;}else{label=63;break;}
 case 63: 
 var $288=$285;
 var $289=HEAP32[((14120)>>2)];
 var $290=($288>>>0)<($289>>>0);
 if($290){label=65;break;}else{label=64;break;}
 case 64: 
 var $292=(($R_1_i+20)|0);
 HEAP32[(($292)>>2)]=$285;
 var $293=(($285+24)|0);
 HEAP32[(($293)>>2)]=$R_1_i;
 label=67;break;
 case 65: 
 _abort();
 throw "Reached an unreachable!";
 case 66: 
 _abort();
 throw "Reached an unreachable!";
 case 67: 
 var $297=($rsize_0_i>>>0)<16;
 if($297){label=68;break;}else{label=69;break;}
 case 68: 
 var $299=((($rsize_0_i)+($8))|0);
 var $300=$299|3;
 var $301=(($v_0_i+4)|0);
 HEAP32[(($301)>>2)]=$300;
 var $_sum4_i=((($299)+(4))|0);
 var $302=(($192+$_sum4_i)|0);
 var $303=$302;
 var $304=HEAP32[(($303)>>2)];
 var $305=$304|1;
 HEAP32[(($303)>>2)]=$305;
 label=77;break;
 case 69: 
 var $307=$8|3;
 var $308=(($v_0_i+4)|0);
 HEAP32[(($308)>>2)]=$307;
 var $309=$rsize_0_i|1;
 var $_sum_i137=$8|4;
 var $310=(($192+$_sum_i137)|0);
 var $311=$310;
 HEAP32[(($311)>>2)]=$309;
 var $_sum1_i=((($rsize_0_i)+($8))|0);
 var $312=(($192+$_sum1_i)|0);
 var $313=$312;
 HEAP32[(($313)>>2)]=$rsize_0_i;
 var $314=HEAP32[((14112)>>2)];
 var $315=($314|0)==0;
 if($315){label=75;break;}else{label=70;break;}
 case 70: 
 var $317=HEAP32[((14124)>>2)];
 var $318=$314>>>3;
 var $319=$318<<1;
 var $320=((14144+($319<<2))|0);
 var $321=$320;
 var $322=HEAP32[((14104)>>2)];
 var $323=1<<$318;
 var $324=$322&$323;
 var $325=($324|0)==0;
 if($325){label=71;break;}else{label=72;break;}
 case 71: 
 var $327=$322|$323;
 HEAP32[((14104)>>2)]=$327;
 var $_sum2_pre_i=((($319)+(2))|0);
 var $_pre_i=((14144+($_sum2_pre_i<<2))|0);
 var $F1_0_i=$321;var $_pre_phi_i=$_pre_i;label=74;break;
 case 72: 
 var $_sum3_i=((($319)+(2))|0);
 var $329=((14144+($_sum3_i<<2))|0);
 var $330=HEAP32[(($329)>>2)];
 var $331=$330;
 var $332=HEAP32[((14120)>>2)];
 var $333=($331>>>0)<($332>>>0);
 if($333){label=73;break;}else{var $F1_0_i=$330;var $_pre_phi_i=$329;label=74;break;}
 case 73: 
 _abort();
 throw "Reached an unreachable!";
 case 74: 
 var $_pre_phi_i;
 var $F1_0_i;
 HEAP32[(($_pre_phi_i)>>2)]=$317;
 var $336=(($F1_0_i+12)|0);
 HEAP32[(($336)>>2)]=$317;
 var $337=(($317+8)|0);
 HEAP32[(($337)>>2)]=$F1_0_i;
 var $338=(($317+12)|0);
 HEAP32[(($338)>>2)]=$321;
 label=75;break;
 case 75: 
 HEAP32[((14112)>>2)]=$rsize_0_i;
 HEAP32[((14124)>>2)]=$197;
 label=77;break;
 case 76: 
 _abort();
 throw "Reached an unreachable!";
 case 77: 
 var $341=(($v_0_i+8)|0);
 var $342=$341;
 var $343=($341|0)==0;
 if($343){var $nb_0=$8;label=160;break;}else{var $mem_0=$342;label=341;break;}
 case 78: 
 var $345=($bytes>>>0)>4294967231;
 if($345){var $nb_0=-1;label=160;break;}else{label=79;break;}
 case 79: 
 var $347=((($bytes)+(11))|0);
 var $348=$347&-8;
 var $349=HEAP32[((14108)>>2)];
 var $350=($349|0)==0;
 if($350){var $nb_0=$348;label=160;break;}else{label=80;break;}
 case 80: 
 var $352=(((-$348))|0);
 var $353=$347>>>8;
 var $354=($353|0)==0;
 if($354){var $idx_0_i=0;label=83;break;}else{label=81;break;}
 case 81: 
 var $356=($348>>>0)>16777215;
 if($356){var $idx_0_i=31;label=83;break;}else{label=82;break;}
 case 82: 
 var $358=((($353)+(1048320))|0);
 var $359=$358>>>16;
 var $360=$359&8;
 var $361=$353<<$360;
 var $362=((($361)+(520192))|0);
 var $363=$362>>>16;
 var $364=$363&4;
 var $365=$364|$360;
 var $366=$361<<$364;
 var $367=((($366)+(245760))|0);
 var $368=$367>>>16;
 var $369=$368&2;
 var $370=$365|$369;
 var $371=(((14)-($370))|0);
 var $372=$366<<$369;
 var $373=$372>>>15;
 var $374=((($371)+($373))|0);
 var $375=$374<<1;
 var $376=((($374)+(7))|0);
 var $377=$348>>>($376>>>0);
 var $378=$377&1;
 var $379=$378|$375;
 var $idx_0_i=$379;label=83;break;
 case 83: 
 var $idx_0_i;
 var $381=((14408+($idx_0_i<<2))|0);
 var $382=HEAP32[(($381)>>2)];
 var $383=($382|0)==0;
 if($383){var $v_2_i=0;var $rsize_2_i=$352;var $t_1_i=0;label=90;break;}else{label=84;break;}
 case 84: 
 var $385=($idx_0_i|0)==31;
 if($385){var $390=0;label=86;break;}else{label=85;break;}
 case 85: 
 var $387=$idx_0_i>>>1;
 var $388=(((25)-($387))|0);
 var $390=$388;label=86;break;
 case 86: 
 var $390;
 var $391=$348<<$390;
 var $v_0_i118=0;var $rsize_0_i117=$352;var $t_0_i116=$382;var $sizebits_0_i=$391;var $rst_0_i=0;label=87;break;
 case 87: 
 var $rst_0_i;
 var $sizebits_0_i;
 var $t_0_i116;
 var $rsize_0_i117;
 var $v_0_i118;
 var $393=(($t_0_i116+4)|0);
 var $394=HEAP32[(($393)>>2)];
 var $395=$394&-8;
 var $396=((($395)-($348))|0);
 var $397=($396>>>0)<($rsize_0_i117>>>0);
 if($397){label=88;break;}else{var $v_1_i=$v_0_i118;var $rsize_1_i=$rsize_0_i117;label=89;break;}
 case 88: 
 var $399=($395|0)==($348|0);
 if($399){var $v_2_i=$t_0_i116;var $rsize_2_i=$396;var $t_1_i=$t_0_i116;label=90;break;}else{var $v_1_i=$t_0_i116;var $rsize_1_i=$396;label=89;break;}
 case 89: 
 var $rsize_1_i;
 var $v_1_i;
 var $401=(($t_0_i116+20)|0);
 var $402=HEAP32[(($401)>>2)];
 var $403=$sizebits_0_i>>>31;
 var $404=(($t_0_i116+16+($403<<2))|0);
 var $405=HEAP32[(($404)>>2)];
 var $406=($402|0)==0;
 var $407=($402|0)==($405|0);
 var $or_cond_i=$406|$407;
 var $rst_1_i=($or_cond_i?$rst_0_i:$402);
 var $408=($405|0)==0;
 var $409=$sizebits_0_i<<1;
 if($408){var $v_2_i=$v_1_i;var $rsize_2_i=$rsize_1_i;var $t_1_i=$rst_1_i;label=90;break;}else{var $v_0_i118=$v_1_i;var $rsize_0_i117=$rsize_1_i;var $t_0_i116=$405;var $sizebits_0_i=$409;var $rst_0_i=$rst_1_i;label=87;break;}
 case 90: 
 var $t_1_i;
 var $rsize_2_i;
 var $v_2_i;
 var $410=($t_1_i|0)==0;
 var $411=($v_2_i|0)==0;
 var $or_cond21_i=$410&$411;
 if($or_cond21_i){label=91;break;}else{var $t_2_ph_i=$t_1_i;label=93;break;}
 case 91: 
 var $413=2<<$idx_0_i;
 var $414=(((-$413))|0);
 var $415=$413|$414;
 var $416=$349&$415;
 var $417=($416|0)==0;
 if($417){var $nb_0=$348;label=160;break;}else{label=92;break;}
 case 92: 
 var $419=(((-$416))|0);
 var $420=$416&$419;
 var $421=((($420)-(1))|0);
 var $422=$421>>>12;
 var $423=$422&16;
 var $424=$421>>>($423>>>0);
 var $425=$424>>>5;
 var $426=$425&8;
 var $427=$426|$423;
 var $428=$424>>>($426>>>0);
 var $429=$428>>>2;
 var $430=$429&4;
 var $431=$427|$430;
 var $432=$428>>>($430>>>0);
 var $433=$432>>>1;
 var $434=$433&2;
 var $435=$431|$434;
 var $436=$432>>>($434>>>0);
 var $437=$436>>>1;
 var $438=$437&1;
 var $439=$435|$438;
 var $440=$436>>>($438>>>0);
 var $441=((($439)+($440))|0);
 var $442=((14408+($441<<2))|0);
 var $443=HEAP32[(($442)>>2)];
 var $t_2_ph_i=$443;label=93;break;
 case 93: 
 var $t_2_ph_i;
 var $444=($t_2_ph_i|0)==0;
 if($444){var $rsize_3_lcssa_i=$rsize_2_i;var $v_3_lcssa_i=$v_2_i;label=96;break;}else{var $t_228_i=$t_2_ph_i;var $rsize_329_i=$rsize_2_i;var $v_330_i=$v_2_i;label=94;break;}
 case 94: 
 var $v_330_i;
 var $rsize_329_i;
 var $t_228_i;
 var $445=(($t_228_i+4)|0);
 var $446=HEAP32[(($445)>>2)];
 var $447=$446&-8;
 var $448=((($447)-($348))|0);
 var $449=($448>>>0)<($rsize_329_i>>>0);
 var $_rsize_3_i=($449?$448:$rsize_329_i);
 var $t_2_v_3_i=($449?$t_228_i:$v_330_i);
 var $450=(($t_228_i+16)|0);
 var $451=HEAP32[(($450)>>2)];
 var $452=($451|0)==0;
 if($452){label=95;break;}else{var $t_228_i=$451;var $rsize_329_i=$_rsize_3_i;var $v_330_i=$t_2_v_3_i;label=94;break;}
 case 95: 
 var $453=(($t_228_i+20)|0);
 var $454=HEAP32[(($453)>>2)];
 var $455=($454|0)==0;
 if($455){var $rsize_3_lcssa_i=$_rsize_3_i;var $v_3_lcssa_i=$t_2_v_3_i;label=96;break;}else{var $t_228_i=$454;var $rsize_329_i=$_rsize_3_i;var $v_330_i=$t_2_v_3_i;label=94;break;}
 case 96: 
 var $v_3_lcssa_i;
 var $rsize_3_lcssa_i;
 var $456=($v_3_lcssa_i|0)==0;
 if($456){var $nb_0=$348;label=160;break;}else{label=97;break;}
 case 97: 
 var $458=HEAP32[((14112)>>2)];
 var $459=((($458)-($348))|0);
 var $460=($rsize_3_lcssa_i>>>0)<($459>>>0);
 if($460){label=98;break;}else{var $nb_0=$348;label=160;break;}
 case 98: 
 var $462=$v_3_lcssa_i;
 var $463=HEAP32[((14120)>>2)];
 var $464=($462>>>0)<($463>>>0);
 if($464){label=158;break;}else{label=99;break;}
 case 99: 
 var $466=(($462+$348)|0);
 var $467=$466;
 var $468=($462>>>0)<($466>>>0);
 if($468){label=100;break;}else{label=158;break;}
 case 100: 
 var $470=(($v_3_lcssa_i+24)|0);
 var $471=HEAP32[(($470)>>2)];
 var $472=(($v_3_lcssa_i+12)|0);
 var $473=HEAP32[(($472)>>2)];
 var $474=($473|0)==($v_3_lcssa_i|0);
 if($474){label=106;break;}else{label=101;break;}
 case 101: 
 var $476=(($v_3_lcssa_i+8)|0);
 var $477=HEAP32[(($476)>>2)];
 var $478=$477;
 var $479=($478>>>0)<($463>>>0);
 if($479){label=105;break;}else{label=102;break;}
 case 102: 
 var $481=(($477+12)|0);
 var $482=HEAP32[(($481)>>2)];
 var $483=($482|0)==($v_3_lcssa_i|0);
 if($483){label=103;break;}else{label=105;break;}
 case 103: 
 var $485=(($473+8)|0);
 var $486=HEAP32[(($485)>>2)];
 var $487=($486|0)==($v_3_lcssa_i|0);
 if($487){label=104;break;}else{label=105;break;}
 case 104: 
 HEAP32[(($481)>>2)]=$473;
 HEAP32[(($485)>>2)]=$477;
 var $R_1_i122=$473;label=113;break;
 case 105: 
 _abort();
 throw "Reached an unreachable!";
 case 106: 
 var $490=(($v_3_lcssa_i+20)|0);
 var $491=HEAP32[(($490)>>2)];
 var $492=($491|0)==0;
 if($492){label=107;break;}else{var $R_0_i120=$491;var $RP_0_i119=$490;label=108;break;}
 case 107: 
 var $494=(($v_3_lcssa_i+16)|0);
 var $495=HEAP32[(($494)>>2)];
 var $496=($495|0)==0;
 if($496){var $R_1_i122=0;label=113;break;}else{var $R_0_i120=$495;var $RP_0_i119=$494;label=108;break;}
 case 108: 
 var $RP_0_i119;
 var $R_0_i120;
 var $497=(($R_0_i120+20)|0);
 var $498=HEAP32[(($497)>>2)];
 var $499=($498|0)==0;
 if($499){label=109;break;}else{var $R_0_i120=$498;var $RP_0_i119=$497;label=108;break;}
 case 109: 
 var $501=(($R_0_i120+16)|0);
 var $502=HEAP32[(($501)>>2)];
 var $503=($502|0)==0;
 if($503){label=110;break;}else{var $R_0_i120=$502;var $RP_0_i119=$501;label=108;break;}
 case 110: 
 var $505=$RP_0_i119;
 var $506=($505>>>0)<($463>>>0);
 if($506){label=112;break;}else{label=111;break;}
 case 111: 
 HEAP32[(($RP_0_i119)>>2)]=0;
 var $R_1_i122=$R_0_i120;label=113;break;
 case 112: 
 _abort();
 throw "Reached an unreachable!";
 case 113: 
 var $R_1_i122;
 var $510=($471|0)==0;
 if($510){label=133;break;}else{label=114;break;}
 case 114: 
 var $512=(($v_3_lcssa_i+28)|0);
 var $513=HEAP32[(($512)>>2)];
 var $514=((14408+($513<<2))|0);
 var $515=HEAP32[(($514)>>2)];
 var $516=($v_3_lcssa_i|0)==($515|0);
 if($516){label=115;break;}else{label=117;break;}
 case 115: 
 HEAP32[(($514)>>2)]=$R_1_i122;
 var $cond_i123=($R_1_i122|0)==0;
 if($cond_i123){label=116;break;}else{label=123;break;}
 case 116: 
 var $518=1<<$513;
 var $519=$518^-1;
 var $520=HEAP32[((14108)>>2)];
 var $521=$520&$519;
 HEAP32[((14108)>>2)]=$521;
 label=133;break;
 case 117: 
 var $523=$471;
 var $524=HEAP32[((14120)>>2)];
 var $525=($523>>>0)<($524>>>0);
 if($525){label=121;break;}else{label=118;break;}
 case 118: 
 var $527=(($471+16)|0);
 var $528=HEAP32[(($527)>>2)];
 var $529=($528|0)==($v_3_lcssa_i|0);
 if($529){label=119;break;}else{label=120;break;}
 case 119: 
 HEAP32[(($527)>>2)]=$R_1_i122;
 label=122;break;
 case 120: 
 var $532=(($471+20)|0);
 HEAP32[(($532)>>2)]=$R_1_i122;
 label=122;break;
 case 121: 
 _abort();
 throw "Reached an unreachable!";
 case 122: 
 var $535=($R_1_i122|0)==0;
 if($535){label=133;break;}else{label=123;break;}
 case 123: 
 var $537=$R_1_i122;
 var $538=HEAP32[((14120)>>2)];
 var $539=($537>>>0)<($538>>>0);
 if($539){label=132;break;}else{label=124;break;}
 case 124: 
 var $541=(($R_1_i122+24)|0);
 HEAP32[(($541)>>2)]=$471;
 var $542=(($v_3_lcssa_i+16)|0);
 var $543=HEAP32[(($542)>>2)];
 var $544=($543|0)==0;
 if($544){label=128;break;}else{label=125;break;}
 case 125: 
 var $546=$543;
 var $547=HEAP32[((14120)>>2)];
 var $548=($546>>>0)<($547>>>0);
 if($548){label=127;break;}else{label=126;break;}
 case 126: 
 var $550=(($R_1_i122+16)|0);
 HEAP32[(($550)>>2)]=$543;
 var $551=(($543+24)|0);
 HEAP32[(($551)>>2)]=$R_1_i122;
 label=128;break;
 case 127: 
 _abort();
 throw "Reached an unreachable!";
 case 128: 
 var $554=(($v_3_lcssa_i+20)|0);
 var $555=HEAP32[(($554)>>2)];
 var $556=($555|0)==0;
 if($556){label=133;break;}else{label=129;break;}
 case 129: 
 var $558=$555;
 var $559=HEAP32[((14120)>>2)];
 var $560=($558>>>0)<($559>>>0);
 if($560){label=131;break;}else{label=130;break;}
 case 130: 
 var $562=(($R_1_i122+20)|0);
 HEAP32[(($562)>>2)]=$555;
 var $563=(($555+24)|0);
 HEAP32[(($563)>>2)]=$R_1_i122;
 label=133;break;
 case 131: 
 _abort();
 throw "Reached an unreachable!";
 case 132: 
 _abort();
 throw "Reached an unreachable!";
 case 133: 
 var $567=($rsize_3_lcssa_i>>>0)<16;
 if($567){label=134;break;}else{label=135;break;}
 case 134: 
 var $569=((($rsize_3_lcssa_i)+($348))|0);
 var $570=$569|3;
 var $571=(($v_3_lcssa_i+4)|0);
 HEAP32[(($571)>>2)]=$570;
 var $_sum19_i=((($569)+(4))|0);
 var $572=(($462+$_sum19_i)|0);
 var $573=$572;
 var $574=HEAP32[(($573)>>2)];
 var $575=$574|1;
 HEAP32[(($573)>>2)]=$575;
 label=159;break;
 case 135: 
 var $577=$348|3;
 var $578=(($v_3_lcssa_i+4)|0);
 HEAP32[(($578)>>2)]=$577;
 var $579=$rsize_3_lcssa_i|1;
 var $_sum_i125136=$348|4;
 var $580=(($462+$_sum_i125136)|0);
 var $581=$580;
 HEAP32[(($581)>>2)]=$579;
 var $_sum1_i126=((($rsize_3_lcssa_i)+($348))|0);
 var $582=(($462+$_sum1_i126)|0);
 var $583=$582;
 HEAP32[(($583)>>2)]=$rsize_3_lcssa_i;
 var $584=$rsize_3_lcssa_i>>>3;
 var $585=($rsize_3_lcssa_i>>>0)<256;
 if($585){label=136;break;}else{label=141;break;}
 case 136: 
 var $587=$584<<1;
 var $588=((14144+($587<<2))|0);
 var $589=$588;
 var $590=HEAP32[((14104)>>2)];
 var $591=1<<$584;
 var $592=$590&$591;
 var $593=($592|0)==0;
 if($593){label=137;break;}else{label=138;break;}
 case 137: 
 var $595=$590|$591;
 HEAP32[((14104)>>2)]=$595;
 var $_sum15_pre_i=((($587)+(2))|0);
 var $_pre_i127=((14144+($_sum15_pre_i<<2))|0);
 var $F5_0_i=$589;var $_pre_phi_i128=$_pre_i127;label=140;break;
 case 138: 
 var $_sum18_i=((($587)+(2))|0);
 var $597=((14144+($_sum18_i<<2))|0);
 var $598=HEAP32[(($597)>>2)];
 var $599=$598;
 var $600=HEAP32[((14120)>>2)];
 var $601=($599>>>0)<($600>>>0);
 if($601){label=139;break;}else{var $F5_0_i=$598;var $_pre_phi_i128=$597;label=140;break;}
 case 139: 
 _abort();
 throw "Reached an unreachable!";
 case 140: 
 var $_pre_phi_i128;
 var $F5_0_i;
 HEAP32[(($_pre_phi_i128)>>2)]=$467;
 var $604=(($F5_0_i+12)|0);
 HEAP32[(($604)>>2)]=$467;
 var $_sum16_i=((($348)+(8))|0);
 var $605=(($462+$_sum16_i)|0);
 var $606=$605;
 HEAP32[(($606)>>2)]=$F5_0_i;
 var $_sum17_i=((($348)+(12))|0);
 var $607=(($462+$_sum17_i)|0);
 var $608=$607;
 HEAP32[(($608)>>2)]=$589;
 label=159;break;
 case 141: 
 var $610=$466;
 var $611=$rsize_3_lcssa_i>>>8;
 var $612=($611|0)==0;
 if($612){var $I7_0_i=0;label=144;break;}else{label=142;break;}
 case 142: 
 var $614=($rsize_3_lcssa_i>>>0)>16777215;
 if($614){var $I7_0_i=31;label=144;break;}else{label=143;break;}
 case 143: 
 var $616=((($611)+(1048320))|0);
 var $617=$616>>>16;
 var $618=$617&8;
 var $619=$611<<$618;
 var $620=((($619)+(520192))|0);
 var $621=$620>>>16;
 var $622=$621&4;
 var $623=$622|$618;
 var $624=$619<<$622;
 var $625=((($624)+(245760))|0);
 var $626=$625>>>16;
 var $627=$626&2;
 var $628=$623|$627;
 var $629=(((14)-($628))|0);
 var $630=$624<<$627;
 var $631=$630>>>15;
 var $632=((($629)+($631))|0);
 var $633=$632<<1;
 var $634=((($632)+(7))|0);
 var $635=$rsize_3_lcssa_i>>>($634>>>0);
 var $636=$635&1;
 var $637=$636|$633;
 var $I7_0_i=$637;label=144;break;
 case 144: 
 var $I7_0_i;
 var $639=((14408+($I7_0_i<<2))|0);
 var $_sum2_i=((($348)+(28))|0);
 var $640=(($462+$_sum2_i)|0);
 var $641=$640;
 HEAP32[(($641)>>2)]=$I7_0_i;
 var $_sum3_i129=((($348)+(16))|0);
 var $642=(($462+$_sum3_i129)|0);
 var $_sum4_i130=((($348)+(20))|0);
 var $643=(($462+$_sum4_i130)|0);
 var $644=$643;
 HEAP32[(($644)>>2)]=0;
 var $645=$642;
 HEAP32[(($645)>>2)]=0;
 var $646=HEAP32[((14108)>>2)];
 var $647=1<<$I7_0_i;
 var $648=$646&$647;
 var $649=($648|0)==0;
 if($649){label=145;break;}else{label=146;break;}
 case 145: 
 var $651=$646|$647;
 HEAP32[((14108)>>2)]=$651;
 HEAP32[(($639)>>2)]=$610;
 var $652=$639;
 var $_sum5_i=((($348)+(24))|0);
 var $653=(($462+$_sum5_i)|0);
 var $654=$653;
 HEAP32[(($654)>>2)]=$652;
 var $_sum6_i=((($348)+(12))|0);
 var $655=(($462+$_sum6_i)|0);
 var $656=$655;
 HEAP32[(($656)>>2)]=$610;
 var $_sum7_i=((($348)+(8))|0);
 var $657=(($462+$_sum7_i)|0);
 var $658=$657;
 HEAP32[(($658)>>2)]=$610;
 label=159;break;
 case 146: 
 var $660=HEAP32[(($639)>>2)];
 var $661=($I7_0_i|0)==31;
 if($661){var $666=0;label=148;break;}else{label=147;break;}
 case 147: 
 var $663=$I7_0_i>>>1;
 var $664=(((25)-($663))|0);
 var $666=$664;label=148;break;
 case 148: 
 var $666;
 var $667=$rsize_3_lcssa_i<<$666;
 var $K12_0_i=$667;var $T_0_i=$660;label=149;break;
 case 149: 
 var $T_0_i;
 var $K12_0_i;
 var $669=(($T_0_i+4)|0);
 var $670=HEAP32[(($669)>>2)];
 var $671=$670&-8;
 var $672=($671|0)==($rsize_3_lcssa_i|0);
 if($672){label=154;break;}else{label=150;break;}
 case 150: 
 var $674=$K12_0_i>>>31;
 var $675=(($T_0_i+16+($674<<2))|0);
 var $676=HEAP32[(($675)>>2)];
 var $677=($676|0)==0;
 var $678=$K12_0_i<<1;
 if($677){label=151;break;}else{var $K12_0_i=$678;var $T_0_i=$676;label=149;break;}
 case 151: 
 var $680=$675;
 var $681=HEAP32[((14120)>>2)];
 var $682=($680>>>0)<($681>>>0);
 if($682){label=153;break;}else{label=152;break;}
 case 152: 
 HEAP32[(($675)>>2)]=$610;
 var $_sum12_i=((($348)+(24))|0);
 var $684=(($462+$_sum12_i)|0);
 var $685=$684;
 HEAP32[(($685)>>2)]=$T_0_i;
 var $_sum13_i=((($348)+(12))|0);
 var $686=(($462+$_sum13_i)|0);
 var $687=$686;
 HEAP32[(($687)>>2)]=$610;
 var $_sum14_i=((($348)+(8))|0);
 var $688=(($462+$_sum14_i)|0);
 var $689=$688;
 HEAP32[(($689)>>2)]=$610;
 label=159;break;
 case 153: 
 _abort();
 throw "Reached an unreachable!";
 case 154: 
 var $692=(($T_0_i+8)|0);
 var $693=HEAP32[(($692)>>2)];
 var $694=$T_0_i;
 var $695=HEAP32[((14120)>>2)];
 var $696=($694>>>0)<($695>>>0);
 if($696){label=157;break;}else{label=155;break;}
 case 155: 
 var $698=$693;
 var $699=($698>>>0)<($695>>>0);
 if($699){label=157;break;}else{label=156;break;}
 case 156: 
 var $701=(($693+12)|0);
 HEAP32[(($701)>>2)]=$610;
 HEAP32[(($692)>>2)]=$610;
 var $_sum9_i=((($348)+(8))|0);
 var $702=(($462+$_sum9_i)|0);
 var $703=$702;
 HEAP32[(($703)>>2)]=$693;
 var $_sum10_i=((($348)+(12))|0);
 var $704=(($462+$_sum10_i)|0);
 var $705=$704;
 HEAP32[(($705)>>2)]=$T_0_i;
 var $_sum11_i=((($348)+(24))|0);
 var $706=(($462+$_sum11_i)|0);
 var $707=$706;
 HEAP32[(($707)>>2)]=0;
 label=159;break;
 case 157: 
 _abort();
 throw "Reached an unreachable!";
 case 158: 
 _abort();
 throw "Reached an unreachable!";
 case 159: 
 var $709=(($v_3_lcssa_i+8)|0);
 var $710=$709;
 var $711=($709|0)==0;
 if($711){var $nb_0=$348;label=160;break;}else{var $mem_0=$710;label=341;break;}
 case 160: 
 var $nb_0;
 var $712=HEAP32[((14112)>>2)];
 var $713=($nb_0>>>0)>($712>>>0);
 if($713){label=165;break;}else{label=161;break;}
 case 161: 
 var $715=((($712)-($nb_0))|0);
 var $716=HEAP32[((14124)>>2)];
 var $717=($715>>>0)>15;
 if($717){label=162;break;}else{label=163;break;}
 case 162: 
 var $719=$716;
 var $720=(($719+$nb_0)|0);
 var $721=$720;
 HEAP32[((14124)>>2)]=$721;
 HEAP32[((14112)>>2)]=$715;
 var $722=$715|1;
 var $_sum102=((($nb_0)+(4))|0);
 var $723=(($719+$_sum102)|0);
 var $724=$723;
 HEAP32[(($724)>>2)]=$722;
 var $725=(($719+$712)|0);
 var $726=$725;
 HEAP32[(($726)>>2)]=$715;
 var $727=$nb_0|3;
 var $728=(($716+4)|0);
 HEAP32[(($728)>>2)]=$727;
 label=164;break;
 case 163: 
 HEAP32[((14112)>>2)]=0;
 HEAP32[((14124)>>2)]=0;
 var $730=$712|3;
 var $731=(($716+4)|0);
 HEAP32[(($731)>>2)]=$730;
 var $732=$716;
 var $_sum101=((($712)+(4))|0);
 var $733=(($732+$_sum101)|0);
 var $734=$733;
 var $735=HEAP32[(($734)>>2)];
 var $736=$735|1;
 HEAP32[(($734)>>2)]=$736;
 label=164;break;
 case 164: 
 var $738=(($716+8)|0);
 var $739=$738;
 var $mem_0=$739;label=341;break;
 case 165: 
 var $741=HEAP32[((14116)>>2)];
 var $742=($nb_0>>>0)<($741>>>0);
 if($742){label=166;break;}else{label=167;break;}
 case 166: 
 var $744=((($741)-($nb_0))|0);
 HEAP32[((14116)>>2)]=$744;
 var $745=HEAP32[((14128)>>2)];
 var $746=$745;
 var $747=(($746+$nb_0)|0);
 var $748=$747;
 HEAP32[((14128)>>2)]=$748;
 var $749=$744|1;
 var $_sum=((($nb_0)+(4))|0);
 var $750=(($746+$_sum)|0);
 var $751=$750;
 HEAP32[(($751)>>2)]=$749;
 var $752=$nb_0|3;
 var $753=(($745+4)|0);
 HEAP32[(($753)>>2)]=$752;
 var $754=(($745+8)|0);
 var $755=$754;
 var $mem_0=$755;label=341;break;
 case 167: 
 var $757=HEAP32[((14064)>>2)];
 var $758=($757|0)==0;
 if($758){label=168;break;}else{label=171;break;}
 case 168: 
 var $760=_sysconf(30);
 var $761=((($760)-(1))|0);
 var $762=$761&$760;
 var $763=($762|0)==0;
 if($763){label=170;break;}else{label=169;break;}
 case 169: 
 _abort();
 throw "Reached an unreachable!";
 case 170: 
 HEAP32[((14072)>>2)]=$760;
 HEAP32[((14068)>>2)]=$760;
 HEAP32[((14076)>>2)]=-1;
 HEAP32[((14080)>>2)]=-1;
 HEAP32[((14084)>>2)]=0;
 HEAP32[((14548)>>2)]=0;
 var $765=_time(0);
 var $766=$765&-16;
 var $767=$766^1431655768;
 HEAP32[((14064)>>2)]=$767;
 label=171;break;
 case 171: 
 var $769=((($nb_0)+(48))|0);
 var $770=HEAP32[((14072)>>2)];
 var $771=((($nb_0)+(47))|0);
 var $772=((($770)+($771))|0);
 var $773=(((-$770))|0);
 var $774=$772&$773;
 var $775=($774>>>0)>($nb_0>>>0);
 if($775){label=172;break;}else{var $mem_0=0;label=341;break;}
 case 172: 
 var $777=HEAP32[((14544)>>2)];
 var $778=($777|0)==0;
 if($778){label=174;break;}else{label=173;break;}
 case 173: 
 var $780=HEAP32[((14536)>>2)];
 var $781=((($780)+($774))|0);
 var $782=($781>>>0)<=($780>>>0);
 var $783=($781>>>0)>($777>>>0);
 var $or_cond1_i=$782|$783;
 if($or_cond1_i){var $mem_0=0;label=341;break;}else{label=174;break;}
 case 174: 
 var $785=HEAP32[((14548)>>2)];
 var $786=$785&4;
 var $787=($786|0)==0;
 if($787){label=175;break;}else{var $tsize_1_i=0;label=198;break;}
 case 175: 
 var $789=HEAP32[((14128)>>2)];
 var $790=($789|0)==0;
 if($790){label=181;break;}else{label=176;break;}
 case 176: 
 var $792=$789;
 var $sp_0_i_i=14552;label=177;break;
 case 177: 
 var $sp_0_i_i;
 var $794=(($sp_0_i_i)|0);
 var $795=HEAP32[(($794)>>2)];
 var $796=($795>>>0)>($792>>>0);
 if($796){label=179;break;}else{label=178;break;}
 case 178: 
 var $798=(($sp_0_i_i+4)|0);
 var $799=HEAP32[(($798)>>2)];
 var $800=(($795+$799)|0);
 var $801=($800>>>0)>($792>>>0);
 if($801){label=180;break;}else{label=179;break;}
 case 179: 
 var $803=(($sp_0_i_i+8)|0);
 var $804=HEAP32[(($803)>>2)];
 var $805=($804|0)==0;
 if($805){label=181;break;}else{var $sp_0_i_i=$804;label=177;break;}
 case 180: 
 var $806=($sp_0_i_i|0)==0;
 if($806){label=181;break;}else{label=188;break;}
 case 181: 
 var $807=_sbrk(0);
 var $808=($807|0)==-1;
 if($808){var $tsize_0303639_i=0;label=197;break;}else{label=182;break;}
 case 182: 
 var $810=$807;
 var $811=HEAP32[((14068)>>2)];
 var $812=((($811)-(1))|0);
 var $813=$812&$810;
 var $814=($813|0)==0;
 if($814){var $ssize_0_i=$774;label=184;break;}else{label=183;break;}
 case 183: 
 var $816=((($812)+($810))|0);
 var $817=(((-$811))|0);
 var $818=$816&$817;
 var $819=((($774)-($810))|0);
 var $820=((($819)+($818))|0);
 var $ssize_0_i=$820;label=184;break;
 case 184: 
 var $ssize_0_i;
 var $822=HEAP32[((14536)>>2)];
 var $823=((($822)+($ssize_0_i))|0);
 var $824=($ssize_0_i>>>0)>($nb_0>>>0);
 var $825=($ssize_0_i>>>0)<2147483647;
 var $or_cond_i131=$824&$825;
 if($or_cond_i131){label=185;break;}else{var $tsize_0303639_i=0;label=197;break;}
 case 185: 
 var $827=HEAP32[((14544)>>2)];
 var $828=($827|0)==0;
 if($828){label=187;break;}else{label=186;break;}
 case 186: 
 var $830=($823>>>0)<=($822>>>0);
 var $831=($823>>>0)>($827>>>0);
 var $or_cond2_i=$830|$831;
 if($or_cond2_i){var $tsize_0303639_i=0;label=197;break;}else{label=187;break;}
 case 187: 
 var $833=_sbrk($ssize_0_i);
 var $834=($833|0)==($807|0);
 var $ssize_0__i=($834?$ssize_0_i:0);
 var $__i=($834?$807:-1);
 var $tbase_0_i=$__i;var $tsize_0_i=$ssize_0__i;var $br_0_i=$833;var $ssize_1_i=$ssize_0_i;label=190;break;
 case 188: 
 var $836=HEAP32[((14116)>>2)];
 var $837=((($772)-($836))|0);
 var $838=$837&$773;
 var $839=($838>>>0)<2147483647;
 if($839){label=189;break;}else{var $tsize_0303639_i=0;label=197;break;}
 case 189: 
 var $841=_sbrk($838);
 var $842=HEAP32[(($794)>>2)];
 var $843=HEAP32[(($798)>>2)];
 var $844=(($842+$843)|0);
 var $845=($841|0)==($844|0);
 var $_3_i=($845?$838:0);
 var $_4_i=($845?$841:-1);
 var $tbase_0_i=$_4_i;var $tsize_0_i=$_3_i;var $br_0_i=$841;var $ssize_1_i=$838;label=190;break;
 case 190: 
 var $ssize_1_i;
 var $br_0_i;
 var $tsize_0_i;
 var $tbase_0_i;
 var $847=(((-$ssize_1_i))|0);
 var $848=($tbase_0_i|0)==-1;
 if($848){label=191;break;}else{var $tsize_244_i=$tsize_0_i;var $tbase_245_i=$tbase_0_i;label=201;break;}
 case 191: 
 var $850=($br_0_i|0)!=-1;
 var $851=($ssize_1_i>>>0)<2147483647;
 var $or_cond5_i=$850&$851;
 var $852=($ssize_1_i>>>0)<($769>>>0);
 var $or_cond6_i=$or_cond5_i&$852;
 if($or_cond6_i){label=192;break;}else{var $ssize_2_i=$ssize_1_i;label=196;break;}
 case 192: 
 var $854=HEAP32[((14072)>>2)];
 var $855=((($771)-($ssize_1_i))|0);
 var $856=((($855)+($854))|0);
 var $857=(((-$854))|0);
 var $858=$856&$857;
 var $859=($858>>>0)<2147483647;
 if($859){label=193;break;}else{var $ssize_2_i=$ssize_1_i;label=196;break;}
 case 193: 
 var $861=_sbrk($858);
 var $862=($861|0)==-1;
 if($862){label=195;break;}else{label=194;break;}
 case 194: 
 var $864=((($858)+($ssize_1_i))|0);
 var $ssize_2_i=$864;label=196;break;
 case 195: 
 var $866=_sbrk($847);
 var $tsize_0303639_i=$tsize_0_i;label=197;break;
 case 196: 
 var $ssize_2_i;
 var $868=($br_0_i|0)==-1;
 if($868){var $tsize_0303639_i=$tsize_0_i;label=197;break;}else{var $tsize_244_i=$ssize_2_i;var $tbase_245_i=$br_0_i;label=201;break;}
 case 197: 
 var $tsize_0303639_i;
 var $869=HEAP32[((14548)>>2)];
 var $870=$869|4;
 HEAP32[((14548)>>2)]=$870;
 var $tsize_1_i=$tsize_0303639_i;label=198;break;
 case 198: 
 var $tsize_1_i;
 var $872=($774>>>0)<2147483647;
 if($872){label=199;break;}else{label=340;break;}
 case 199: 
 var $874=_sbrk($774);
 var $875=_sbrk(0);
 var $notlhs_i=($874|0)!=-1;
 var $notrhs_i=($875|0)!=-1;
 var $or_cond8_not_i=$notrhs_i&$notlhs_i;
 var $876=($874>>>0)<($875>>>0);
 var $or_cond9_i=$or_cond8_not_i&$876;
 if($or_cond9_i){label=200;break;}else{label=340;break;}
 case 200: 
 var $877=$875;
 var $878=$874;
 var $879=((($877)-($878))|0);
 var $880=((($nb_0)+(40))|0);
 var $881=($879>>>0)>($880>>>0);
 var $_tsize_1_i=($881?$879:$tsize_1_i);
 var $_tbase_1_i=($881?$874:-1);
 var $882=($_tbase_1_i|0)==-1;
 if($882){label=340;break;}else{var $tsize_244_i=$_tsize_1_i;var $tbase_245_i=$_tbase_1_i;label=201;break;}
 case 201: 
 var $tbase_245_i;
 var $tsize_244_i;
 var $883=HEAP32[((14536)>>2)];
 var $884=((($883)+($tsize_244_i))|0);
 HEAP32[((14536)>>2)]=$884;
 var $885=HEAP32[((14540)>>2)];
 var $886=($884>>>0)>($885>>>0);
 if($886){label=202;break;}else{label=203;break;}
 case 202: 
 HEAP32[((14540)>>2)]=$884;
 label=203;break;
 case 203: 
 var $888=HEAP32[((14128)>>2)];
 var $889=($888|0)==0;
 if($889){label=204;break;}else{var $sp_067_i=14552;label=211;break;}
 case 204: 
 var $891=HEAP32[((14120)>>2)];
 var $892=($891|0)==0;
 var $893=($tbase_245_i>>>0)<($891>>>0);
 var $or_cond10_i=$892|$893;
 if($or_cond10_i){label=205;break;}else{label=206;break;}
 case 205: 
 HEAP32[((14120)>>2)]=$tbase_245_i;
 label=206;break;
 case 206: 
 HEAP32[((14552)>>2)]=$tbase_245_i;
 HEAP32[((14556)>>2)]=$tsize_244_i;
 HEAP32[((14564)>>2)]=0;
 var $895=HEAP32[((14064)>>2)];
 HEAP32[((14140)>>2)]=$895;
 HEAP32[((14136)>>2)]=-1;
 var $i_02_i_i=0;label=207;break;
 case 207: 
 var $i_02_i_i;
 var $897=$i_02_i_i<<1;
 var $898=((14144+($897<<2))|0);
 var $899=$898;
 var $_sum_i_i=((($897)+(3))|0);
 var $900=((14144+($_sum_i_i<<2))|0);
 HEAP32[(($900)>>2)]=$899;
 var $_sum1_i_i=((($897)+(2))|0);
 var $901=((14144+($_sum1_i_i<<2))|0);
 HEAP32[(($901)>>2)]=$899;
 var $902=((($i_02_i_i)+(1))|0);
 var $903=($902>>>0)<32;
 if($903){var $i_02_i_i=$902;label=207;break;}else{label=208;break;}
 case 208: 
 var $904=((($tsize_244_i)-(40))|0);
 var $905=(($tbase_245_i+8)|0);
 var $906=$905;
 var $907=$906&7;
 var $908=($907|0)==0;
 if($908){var $912=0;label=210;break;}else{label=209;break;}
 case 209: 
 var $910=(((-$906))|0);
 var $911=$910&7;
 var $912=$911;label=210;break;
 case 210: 
 var $912;
 var $913=(($tbase_245_i+$912)|0);
 var $914=$913;
 var $915=((($904)-($912))|0);
 HEAP32[((14128)>>2)]=$914;
 HEAP32[((14116)>>2)]=$915;
 var $916=$915|1;
 var $_sum_i14_i=((($912)+(4))|0);
 var $917=(($tbase_245_i+$_sum_i14_i)|0);
 var $918=$917;
 HEAP32[(($918)>>2)]=$916;
 var $_sum2_i_i=((($tsize_244_i)-(36))|0);
 var $919=(($tbase_245_i+$_sum2_i_i)|0);
 var $920=$919;
 HEAP32[(($920)>>2)]=40;
 var $921=HEAP32[((14080)>>2)];
 HEAP32[((14132)>>2)]=$921;
 label=338;break;
 case 211: 
 var $sp_067_i;
 var $922=(($sp_067_i)|0);
 var $923=HEAP32[(($922)>>2)];
 var $924=(($sp_067_i+4)|0);
 var $925=HEAP32[(($924)>>2)];
 var $926=(($923+$925)|0);
 var $927=($tbase_245_i|0)==($926|0);
 if($927){label=213;break;}else{label=212;break;}
 case 212: 
 var $929=(($sp_067_i+8)|0);
 var $930=HEAP32[(($929)>>2)];
 var $931=($930|0)==0;
 if($931){label=218;break;}else{var $sp_067_i=$930;label=211;break;}
 case 213: 
 var $932=(($sp_067_i+12)|0);
 var $933=HEAP32[(($932)>>2)];
 var $934=$933&8;
 var $935=($934|0)==0;
 if($935){label=214;break;}else{label=218;break;}
 case 214: 
 var $937=$888;
 var $938=($937>>>0)>=($923>>>0);
 var $939=($937>>>0)<($tbase_245_i>>>0);
 var $or_cond47_i=$938&$939;
 if($or_cond47_i){label=215;break;}else{label=218;break;}
 case 215: 
 var $941=((($925)+($tsize_244_i))|0);
 HEAP32[(($924)>>2)]=$941;
 var $942=HEAP32[((14116)>>2)];
 var $943=((($942)+($tsize_244_i))|0);
 var $944=(($888+8)|0);
 var $945=$944;
 var $946=$945&7;
 var $947=($946|0)==0;
 if($947){var $951=0;label=217;break;}else{label=216;break;}
 case 216: 
 var $949=(((-$945))|0);
 var $950=$949&7;
 var $951=$950;label=217;break;
 case 217: 
 var $951;
 var $952=(($937+$951)|0);
 var $953=$952;
 var $954=((($943)-($951))|0);
 HEAP32[((14128)>>2)]=$953;
 HEAP32[((14116)>>2)]=$954;
 var $955=$954|1;
 var $_sum_i18_i=((($951)+(4))|0);
 var $956=(($937+$_sum_i18_i)|0);
 var $957=$956;
 HEAP32[(($957)>>2)]=$955;
 var $_sum2_i19_i=((($943)+(4))|0);
 var $958=(($937+$_sum2_i19_i)|0);
 var $959=$958;
 HEAP32[(($959)>>2)]=40;
 var $960=HEAP32[((14080)>>2)];
 HEAP32[((14132)>>2)]=$960;
 label=338;break;
 case 218: 
 var $961=HEAP32[((14120)>>2)];
 var $962=($tbase_245_i>>>0)<($961>>>0);
 if($962){label=219;break;}else{label=220;break;}
 case 219: 
 HEAP32[((14120)>>2)]=$tbase_245_i;
 label=220;break;
 case 220: 
 var $964=(($tbase_245_i+$tsize_244_i)|0);
 var $sp_160_i=14552;label=221;break;
 case 221: 
 var $sp_160_i;
 var $966=(($sp_160_i)|0);
 var $967=HEAP32[(($966)>>2)];
 var $968=($967|0)==($964|0);
 if($968){label=223;break;}else{label=222;break;}
 case 222: 
 var $970=(($sp_160_i+8)|0);
 var $971=HEAP32[(($970)>>2)];
 var $972=($971|0)==0;
 if($972){label=304;break;}else{var $sp_160_i=$971;label=221;break;}
 case 223: 
 var $973=(($sp_160_i+12)|0);
 var $974=HEAP32[(($973)>>2)];
 var $975=$974&8;
 var $976=($975|0)==0;
 if($976){label=224;break;}else{label=304;break;}
 case 224: 
 HEAP32[(($966)>>2)]=$tbase_245_i;
 var $978=(($sp_160_i+4)|0);
 var $979=HEAP32[(($978)>>2)];
 var $980=((($979)+($tsize_244_i))|0);
 HEAP32[(($978)>>2)]=$980;
 var $981=(($tbase_245_i+8)|0);
 var $982=$981;
 var $983=$982&7;
 var $984=($983|0)==0;
 if($984){var $989=0;label=226;break;}else{label=225;break;}
 case 225: 
 var $986=(((-$982))|0);
 var $987=$986&7;
 var $989=$987;label=226;break;
 case 226: 
 var $989;
 var $990=(($tbase_245_i+$989)|0);
 var $_sum93_i=((($tsize_244_i)+(8))|0);
 var $991=(($tbase_245_i+$_sum93_i)|0);
 var $992=$991;
 var $993=$992&7;
 var $994=($993|0)==0;
 if($994){var $999=0;label=228;break;}else{label=227;break;}
 case 227: 
 var $996=(((-$992))|0);
 var $997=$996&7;
 var $999=$997;label=228;break;
 case 228: 
 var $999;
 var $_sum94_i=((($999)+($tsize_244_i))|0);
 var $1000=(($tbase_245_i+$_sum94_i)|0);
 var $1001=$1000;
 var $1002=$1000;
 var $1003=$990;
 var $1004=((($1002)-($1003))|0);
 var $_sum_i21_i=((($989)+($nb_0))|0);
 var $1005=(($tbase_245_i+$_sum_i21_i)|0);
 var $1006=$1005;
 var $1007=((($1004)-($nb_0))|0);
 var $1008=$nb_0|3;
 var $_sum1_i22_i=((($989)+(4))|0);
 var $1009=(($tbase_245_i+$_sum1_i22_i)|0);
 var $1010=$1009;
 HEAP32[(($1010)>>2)]=$1008;
 var $1011=HEAP32[((14128)>>2)];
 var $1012=($1001|0)==($1011|0);
 if($1012){label=229;break;}else{label=230;break;}
 case 229: 
 var $1014=HEAP32[((14116)>>2)];
 var $1015=((($1014)+($1007))|0);
 HEAP32[((14116)>>2)]=$1015;
 HEAP32[((14128)>>2)]=$1006;
 var $1016=$1015|1;
 var $_sum46_i_i=((($_sum_i21_i)+(4))|0);
 var $1017=(($tbase_245_i+$_sum46_i_i)|0);
 var $1018=$1017;
 HEAP32[(($1018)>>2)]=$1016;
 label=303;break;
 case 230: 
 var $1020=HEAP32[((14124)>>2)];
 var $1021=($1001|0)==($1020|0);
 if($1021){label=231;break;}else{label=232;break;}
 case 231: 
 var $1023=HEAP32[((14112)>>2)];
 var $1024=((($1023)+($1007))|0);
 HEAP32[((14112)>>2)]=$1024;
 HEAP32[((14124)>>2)]=$1006;
 var $1025=$1024|1;
 var $_sum44_i_i=((($_sum_i21_i)+(4))|0);
 var $1026=(($tbase_245_i+$_sum44_i_i)|0);
 var $1027=$1026;
 HEAP32[(($1027)>>2)]=$1025;
 var $_sum45_i_i=((($1024)+($_sum_i21_i))|0);
 var $1028=(($tbase_245_i+$_sum45_i_i)|0);
 var $1029=$1028;
 HEAP32[(($1029)>>2)]=$1024;
 label=303;break;
 case 232: 
 var $_sum2_i23_i=((($tsize_244_i)+(4))|0);
 var $_sum95_i=((($_sum2_i23_i)+($999))|0);
 var $1031=(($tbase_245_i+$_sum95_i)|0);
 var $1032=$1031;
 var $1033=HEAP32[(($1032)>>2)];
 var $1034=$1033&3;
 var $1035=($1034|0)==1;
 if($1035){label=233;break;}else{var $oldfirst_0_i_i=$1001;var $qsize_0_i_i=$1007;label=280;break;}
 case 233: 
 var $1037=$1033&-8;
 var $1038=$1033>>>3;
 var $1039=($1033>>>0)<256;
 if($1039){label=234;break;}else{label=246;break;}
 case 234: 
 var $_sum3940_i_i=$999|8;
 var $_sum105_i=((($_sum3940_i_i)+($tsize_244_i))|0);
 var $1041=(($tbase_245_i+$_sum105_i)|0);
 var $1042=$1041;
 var $1043=HEAP32[(($1042)>>2)];
 var $_sum41_i_i=((($tsize_244_i)+(12))|0);
 var $_sum106_i=((($_sum41_i_i)+($999))|0);
 var $1044=(($tbase_245_i+$_sum106_i)|0);
 var $1045=$1044;
 var $1046=HEAP32[(($1045)>>2)];
 var $1047=$1038<<1;
 var $1048=((14144+($1047<<2))|0);
 var $1049=$1048;
 var $1050=($1043|0)==($1049|0);
 if($1050){label=237;break;}else{label=235;break;}
 case 235: 
 var $1052=$1043;
 var $1053=HEAP32[((14120)>>2)];
 var $1054=($1052>>>0)<($1053>>>0);
 if($1054){label=245;break;}else{label=236;break;}
 case 236: 
 var $1056=(($1043+12)|0);
 var $1057=HEAP32[(($1056)>>2)];
 var $1058=($1057|0)==($1001|0);
 if($1058){label=237;break;}else{label=245;break;}
 case 237: 
 var $1059=($1046|0)==($1043|0);
 if($1059){label=238;break;}else{label=239;break;}
 case 238: 
 var $1061=1<<$1038;
 var $1062=$1061^-1;
 var $1063=HEAP32[((14104)>>2)];
 var $1064=$1063&$1062;
 HEAP32[((14104)>>2)]=$1064;
 label=279;break;
 case 239: 
 var $1066=($1046|0)==($1049|0);
 if($1066){label=240;break;}else{label=241;break;}
 case 240: 
 var $_pre56_i_i=(($1046+8)|0);
 var $_pre_phi57_i_i=$_pre56_i_i;label=243;break;
 case 241: 
 var $1068=$1046;
 var $1069=HEAP32[((14120)>>2)];
 var $1070=($1068>>>0)<($1069>>>0);
 if($1070){label=244;break;}else{label=242;break;}
 case 242: 
 var $1072=(($1046+8)|0);
 var $1073=HEAP32[(($1072)>>2)];
 var $1074=($1073|0)==($1001|0);
 if($1074){var $_pre_phi57_i_i=$1072;label=243;break;}else{label=244;break;}
 case 243: 
 var $_pre_phi57_i_i;
 var $1075=(($1043+12)|0);
 HEAP32[(($1075)>>2)]=$1046;
 HEAP32[(($_pre_phi57_i_i)>>2)]=$1043;
 label=279;break;
 case 244: 
 _abort();
 throw "Reached an unreachable!";
 case 245: 
 _abort();
 throw "Reached an unreachable!";
 case 246: 
 var $1077=$1000;
 var $_sum34_i_i=$999|24;
 var $_sum96_i=((($_sum34_i_i)+($tsize_244_i))|0);
 var $1078=(($tbase_245_i+$_sum96_i)|0);
 var $1079=$1078;
 var $1080=HEAP32[(($1079)>>2)];
 var $_sum5_i_i=((($tsize_244_i)+(12))|0);
 var $_sum97_i=((($_sum5_i_i)+($999))|0);
 var $1081=(($tbase_245_i+$_sum97_i)|0);
 var $1082=$1081;
 var $1083=HEAP32[(($1082)>>2)];
 var $1084=($1083|0)==($1077|0);
 if($1084){label=252;break;}else{label=247;break;}
 case 247: 
 var $_sum3637_i_i=$999|8;
 var $_sum98_i=((($_sum3637_i_i)+($tsize_244_i))|0);
 var $1086=(($tbase_245_i+$_sum98_i)|0);
 var $1087=$1086;
 var $1088=HEAP32[(($1087)>>2)];
 var $1089=$1088;
 var $1090=HEAP32[((14120)>>2)];
 var $1091=($1089>>>0)<($1090>>>0);
 if($1091){label=251;break;}else{label=248;break;}
 case 248: 
 var $1093=(($1088+12)|0);
 var $1094=HEAP32[(($1093)>>2)];
 var $1095=($1094|0)==($1077|0);
 if($1095){label=249;break;}else{label=251;break;}
 case 249: 
 var $1097=(($1083+8)|0);
 var $1098=HEAP32[(($1097)>>2)];
 var $1099=($1098|0)==($1077|0);
 if($1099){label=250;break;}else{label=251;break;}
 case 250: 
 HEAP32[(($1093)>>2)]=$1083;
 HEAP32[(($1097)>>2)]=$1088;
 var $R_1_i_i=$1083;label=259;break;
 case 251: 
 _abort();
 throw "Reached an unreachable!";
 case 252: 
 var $_sum67_i_i=$999|16;
 var $_sum103_i=((($_sum2_i23_i)+($_sum67_i_i))|0);
 var $1102=(($tbase_245_i+$_sum103_i)|0);
 var $1103=$1102;
 var $1104=HEAP32[(($1103)>>2)];
 var $1105=($1104|0)==0;
 if($1105){label=253;break;}else{var $R_0_i_i=$1104;var $RP_0_i_i=$1103;label=254;break;}
 case 253: 
 var $_sum104_i=((($_sum67_i_i)+($tsize_244_i))|0);
 var $1107=(($tbase_245_i+$_sum104_i)|0);
 var $1108=$1107;
 var $1109=HEAP32[(($1108)>>2)];
 var $1110=($1109|0)==0;
 if($1110){var $R_1_i_i=0;label=259;break;}else{var $R_0_i_i=$1109;var $RP_0_i_i=$1108;label=254;break;}
 case 254: 
 var $RP_0_i_i;
 var $R_0_i_i;
 var $1111=(($R_0_i_i+20)|0);
 var $1112=HEAP32[(($1111)>>2)];
 var $1113=($1112|0)==0;
 if($1113){label=255;break;}else{var $R_0_i_i=$1112;var $RP_0_i_i=$1111;label=254;break;}
 case 255: 
 var $1115=(($R_0_i_i+16)|0);
 var $1116=HEAP32[(($1115)>>2)];
 var $1117=($1116|0)==0;
 if($1117){label=256;break;}else{var $R_0_i_i=$1116;var $RP_0_i_i=$1115;label=254;break;}
 case 256: 
 var $1119=$RP_0_i_i;
 var $1120=HEAP32[((14120)>>2)];
 var $1121=($1119>>>0)<($1120>>>0);
 if($1121){label=258;break;}else{label=257;break;}
 case 257: 
 HEAP32[(($RP_0_i_i)>>2)]=0;
 var $R_1_i_i=$R_0_i_i;label=259;break;
 case 258: 
 _abort();
 throw "Reached an unreachable!";
 case 259: 
 var $R_1_i_i;
 var $1125=($1080|0)==0;
 if($1125){label=279;break;}else{label=260;break;}
 case 260: 
 var $_sum31_i_i=((($tsize_244_i)+(28))|0);
 var $_sum99_i=((($_sum31_i_i)+($999))|0);
 var $1127=(($tbase_245_i+$_sum99_i)|0);
 var $1128=$1127;
 var $1129=HEAP32[(($1128)>>2)];
 var $1130=((14408+($1129<<2))|0);
 var $1131=HEAP32[(($1130)>>2)];
 var $1132=($1077|0)==($1131|0);
 if($1132){label=261;break;}else{label=263;break;}
 case 261: 
 HEAP32[(($1130)>>2)]=$R_1_i_i;
 var $cond_i_i=($R_1_i_i|0)==0;
 if($cond_i_i){label=262;break;}else{label=269;break;}
 case 262: 
 var $1134=1<<$1129;
 var $1135=$1134^-1;
 var $1136=HEAP32[((14108)>>2)];
 var $1137=$1136&$1135;
 HEAP32[((14108)>>2)]=$1137;
 label=279;break;
 case 263: 
 var $1139=$1080;
 var $1140=HEAP32[((14120)>>2)];
 var $1141=($1139>>>0)<($1140>>>0);
 if($1141){label=267;break;}else{label=264;break;}
 case 264: 
 var $1143=(($1080+16)|0);
 var $1144=HEAP32[(($1143)>>2)];
 var $1145=($1144|0)==($1077|0);
 if($1145){label=265;break;}else{label=266;break;}
 case 265: 
 HEAP32[(($1143)>>2)]=$R_1_i_i;
 label=268;break;
 case 266: 
 var $1148=(($1080+20)|0);
 HEAP32[(($1148)>>2)]=$R_1_i_i;
 label=268;break;
 case 267: 
 _abort();
 throw "Reached an unreachable!";
 case 268: 
 var $1151=($R_1_i_i|0)==0;
 if($1151){label=279;break;}else{label=269;break;}
 case 269: 
 var $1153=$R_1_i_i;
 var $1154=HEAP32[((14120)>>2)];
 var $1155=($1153>>>0)<($1154>>>0);
 if($1155){label=278;break;}else{label=270;break;}
 case 270: 
 var $1157=(($R_1_i_i+24)|0);
 HEAP32[(($1157)>>2)]=$1080;
 var $_sum3233_i_i=$999|16;
 var $_sum100_i=((($_sum3233_i_i)+($tsize_244_i))|0);
 var $1158=(($tbase_245_i+$_sum100_i)|0);
 var $1159=$1158;
 var $1160=HEAP32[(($1159)>>2)];
 var $1161=($1160|0)==0;
 if($1161){label=274;break;}else{label=271;break;}
 case 271: 
 var $1163=$1160;
 var $1164=HEAP32[((14120)>>2)];
 var $1165=($1163>>>0)<($1164>>>0);
 if($1165){label=273;break;}else{label=272;break;}
 case 272: 
 var $1167=(($R_1_i_i+16)|0);
 HEAP32[(($1167)>>2)]=$1160;
 var $1168=(($1160+24)|0);
 HEAP32[(($1168)>>2)]=$R_1_i_i;
 label=274;break;
 case 273: 
 _abort();
 throw "Reached an unreachable!";
 case 274: 
 var $_sum101_i=((($_sum2_i23_i)+($_sum3233_i_i))|0);
 var $1171=(($tbase_245_i+$_sum101_i)|0);
 var $1172=$1171;
 var $1173=HEAP32[(($1172)>>2)];
 var $1174=($1173|0)==0;
 if($1174){label=279;break;}else{label=275;break;}
 case 275: 
 var $1176=$1173;
 var $1177=HEAP32[((14120)>>2)];
 var $1178=($1176>>>0)<($1177>>>0);
 if($1178){label=277;break;}else{label=276;break;}
 case 276: 
 var $1180=(($R_1_i_i+20)|0);
 HEAP32[(($1180)>>2)]=$1173;
 var $1181=(($1173+24)|0);
 HEAP32[(($1181)>>2)]=$R_1_i_i;
 label=279;break;
 case 277: 
 _abort();
 throw "Reached an unreachable!";
 case 278: 
 _abort();
 throw "Reached an unreachable!";
 case 279: 
 var $_sum9_i_i=$1037|$999;
 var $_sum102_i=((($_sum9_i_i)+($tsize_244_i))|0);
 var $1185=(($tbase_245_i+$_sum102_i)|0);
 var $1186=$1185;
 var $1187=((($1037)+($1007))|0);
 var $oldfirst_0_i_i=$1186;var $qsize_0_i_i=$1187;label=280;break;
 case 280: 
 var $qsize_0_i_i;
 var $oldfirst_0_i_i;
 var $1189=(($oldfirst_0_i_i+4)|0);
 var $1190=HEAP32[(($1189)>>2)];
 var $1191=$1190&-2;
 HEAP32[(($1189)>>2)]=$1191;
 var $1192=$qsize_0_i_i|1;
 var $_sum10_i_i=((($_sum_i21_i)+(4))|0);
 var $1193=(($tbase_245_i+$_sum10_i_i)|0);
 var $1194=$1193;
 HEAP32[(($1194)>>2)]=$1192;
 var $_sum11_i_i=((($qsize_0_i_i)+($_sum_i21_i))|0);
 var $1195=(($tbase_245_i+$_sum11_i_i)|0);
 var $1196=$1195;
 HEAP32[(($1196)>>2)]=$qsize_0_i_i;
 var $1197=$qsize_0_i_i>>>3;
 var $1198=($qsize_0_i_i>>>0)<256;
 if($1198){label=281;break;}else{label=286;break;}
 case 281: 
 var $1200=$1197<<1;
 var $1201=((14144+($1200<<2))|0);
 var $1202=$1201;
 var $1203=HEAP32[((14104)>>2)];
 var $1204=1<<$1197;
 var $1205=$1203&$1204;
 var $1206=($1205|0)==0;
 if($1206){label=282;break;}else{label=283;break;}
 case 282: 
 var $1208=$1203|$1204;
 HEAP32[((14104)>>2)]=$1208;
 var $_sum27_pre_i_i=((($1200)+(2))|0);
 var $_pre_i24_i=((14144+($_sum27_pre_i_i<<2))|0);
 var $F4_0_i_i=$1202;var $_pre_phi_i25_i=$_pre_i24_i;label=285;break;
 case 283: 
 var $_sum30_i_i=((($1200)+(2))|0);
 var $1210=((14144+($_sum30_i_i<<2))|0);
 var $1211=HEAP32[(($1210)>>2)];
 var $1212=$1211;
 var $1213=HEAP32[((14120)>>2)];
 var $1214=($1212>>>0)<($1213>>>0);
 if($1214){label=284;break;}else{var $F4_0_i_i=$1211;var $_pre_phi_i25_i=$1210;label=285;break;}
 case 284: 
 _abort();
 throw "Reached an unreachable!";
 case 285: 
 var $_pre_phi_i25_i;
 var $F4_0_i_i;
 HEAP32[(($_pre_phi_i25_i)>>2)]=$1006;
 var $1217=(($F4_0_i_i+12)|0);
 HEAP32[(($1217)>>2)]=$1006;
 var $_sum28_i_i=((($_sum_i21_i)+(8))|0);
 var $1218=(($tbase_245_i+$_sum28_i_i)|0);
 var $1219=$1218;
 HEAP32[(($1219)>>2)]=$F4_0_i_i;
 var $_sum29_i_i=((($_sum_i21_i)+(12))|0);
 var $1220=(($tbase_245_i+$_sum29_i_i)|0);
 var $1221=$1220;
 HEAP32[(($1221)>>2)]=$1202;
 label=303;break;
 case 286: 
 var $1223=$1005;
 var $1224=$qsize_0_i_i>>>8;
 var $1225=($1224|0)==0;
 if($1225){var $I7_0_i_i=0;label=289;break;}else{label=287;break;}
 case 287: 
 var $1227=($qsize_0_i_i>>>0)>16777215;
 if($1227){var $I7_0_i_i=31;label=289;break;}else{label=288;break;}
 case 288: 
 var $1229=((($1224)+(1048320))|0);
 var $1230=$1229>>>16;
 var $1231=$1230&8;
 var $1232=$1224<<$1231;
 var $1233=((($1232)+(520192))|0);
 var $1234=$1233>>>16;
 var $1235=$1234&4;
 var $1236=$1235|$1231;
 var $1237=$1232<<$1235;
 var $1238=((($1237)+(245760))|0);
 var $1239=$1238>>>16;
 var $1240=$1239&2;
 var $1241=$1236|$1240;
 var $1242=(((14)-($1241))|0);
 var $1243=$1237<<$1240;
 var $1244=$1243>>>15;
 var $1245=((($1242)+($1244))|0);
 var $1246=$1245<<1;
 var $1247=((($1245)+(7))|0);
 var $1248=$qsize_0_i_i>>>($1247>>>0);
 var $1249=$1248&1;
 var $1250=$1249|$1246;
 var $I7_0_i_i=$1250;label=289;break;
 case 289: 
 var $I7_0_i_i;
 var $1252=((14408+($I7_0_i_i<<2))|0);
 var $_sum12_i26_i=((($_sum_i21_i)+(28))|0);
 var $1253=(($tbase_245_i+$_sum12_i26_i)|0);
 var $1254=$1253;
 HEAP32[(($1254)>>2)]=$I7_0_i_i;
 var $_sum13_i_i=((($_sum_i21_i)+(16))|0);
 var $1255=(($tbase_245_i+$_sum13_i_i)|0);
 var $_sum14_i_i=((($_sum_i21_i)+(20))|0);
 var $1256=(($tbase_245_i+$_sum14_i_i)|0);
 var $1257=$1256;
 HEAP32[(($1257)>>2)]=0;
 var $1258=$1255;
 HEAP32[(($1258)>>2)]=0;
 var $1259=HEAP32[((14108)>>2)];
 var $1260=1<<$I7_0_i_i;
 var $1261=$1259&$1260;
 var $1262=($1261|0)==0;
 if($1262){label=290;break;}else{label=291;break;}
 case 290: 
 var $1264=$1259|$1260;
 HEAP32[((14108)>>2)]=$1264;
 HEAP32[(($1252)>>2)]=$1223;
 var $1265=$1252;
 var $_sum15_i_i=((($_sum_i21_i)+(24))|0);
 var $1266=(($tbase_245_i+$_sum15_i_i)|0);
 var $1267=$1266;
 HEAP32[(($1267)>>2)]=$1265;
 var $_sum16_i_i=((($_sum_i21_i)+(12))|0);
 var $1268=(($tbase_245_i+$_sum16_i_i)|0);
 var $1269=$1268;
 HEAP32[(($1269)>>2)]=$1223;
 var $_sum17_i_i=((($_sum_i21_i)+(8))|0);
 var $1270=(($tbase_245_i+$_sum17_i_i)|0);
 var $1271=$1270;
 HEAP32[(($1271)>>2)]=$1223;
 label=303;break;
 case 291: 
 var $1273=HEAP32[(($1252)>>2)];
 var $1274=($I7_0_i_i|0)==31;
 if($1274){var $1279=0;label=293;break;}else{label=292;break;}
 case 292: 
 var $1276=$I7_0_i_i>>>1;
 var $1277=(((25)-($1276))|0);
 var $1279=$1277;label=293;break;
 case 293: 
 var $1279;
 var $1280=$qsize_0_i_i<<$1279;
 var $K8_0_i_i=$1280;var $T_0_i27_i=$1273;label=294;break;
 case 294: 
 var $T_0_i27_i;
 var $K8_0_i_i;
 var $1282=(($T_0_i27_i+4)|0);
 var $1283=HEAP32[(($1282)>>2)];
 var $1284=$1283&-8;
 var $1285=($1284|0)==($qsize_0_i_i|0);
 if($1285){label=299;break;}else{label=295;break;}
 case 295: 
 var $1287=$K8_0_i_i>>>31;
 var $1288=(($T_0_i27_i+16+($1287<<2))|0);
 var $1289=HEAP32[(($1288)>>2)];
 var $1290=($1289|0)==0;
 var $1291=$K8_0_i_i<<1;
 if($1290){label=296;break;}else{var $K8_0_i_i=$1291;var $T_0_i27_i=$1289;label=294;break;}
 case 296: 
 var $1293=$1288;
 var $1294=HEAP32[((14120)>>2)];
 var $1295=($1293>>>0)<($1294>>>0);
 if($1295){label=298;break;}else{label=297;break;}
 case 297: 
 HEAP32[(($1288)>>2)]=$1223;
 var $_sum24_i_i=((($_sum_i21_i)+(24))|0);
 var $1297=(($tbase_245_i+$_sum24_i_i)|0);
 var $1298=$1297;
 HEAP32[(($1298)>>2)]=$T_0_i27_i;
 var $_sum25_i_i=((($_sum_i21_i)+(12))|0);
 var $1299=(($tbase_245_i+$_sum25_i_i)|0);
 var $1300=$1299;
 HEAP32[(($1300)>>2)]=$1223;
 var $_sum26_i_i=((($_sum_i21_i)+(8))|0);
 var $1301=(($tbase_245_i+$_sum26_i_i)|0);
 var $1302=$1301;
 HEAP32[(($1302)>>2)]=$1223;
 label=303;break;
 case 298: 
 _abort();
 throw "Reached an unreachable!";
 case 299: 
 var $1305=(($T_0_i27_i+8)|0);
 var $1306=HEAP32[(($1305)>>2)];
 var $1307=$T_0_i27_i;
 var $1308=HEAP32[((14120)>>2)];
 var $1309=($1307>>>0)<($1308>>>0);
 if($1309){label=302;break;}else{label=300;break;}
 case 300: 
 var $1311=$1306;
 var $1312=($1311>>>0)<($1308>>>0);
 if($1312){label=302;break;}else{label=301;break;}
 case 301: 
 var $1314=(($1306+12)|0);
 HEAP32[(($1314)>>2)]=$1223;
 HEAP32[(($1305)>>2)]=$1223;
 var $_sum21_i_i=((($_sum_i21_i)+(8))|0);
 var $1315=(($tbase_245_i+$_sum21_i_i)|0);
 var $1316=$1315;
 HEAP32[(($1316)>>2)]=$1306;
 var $_sum22_i_i=((($_sum_i21_i)+(12))|0);
 var $1317=(($tbase_245_i+$_sum22_i_i)|0);
 var $1318=$1317;
 HEAP32[(($1318)>>2)]=$T_0_i27_i;
 var $_sum23_i_i=((($_sum_i21_i)+(24))|0);
 var $1319=(($tbase_245_i+$_sum23_i_i)|0);
 var $1320=$1319;
 HEAP32[(($1320)>>2)]=0;
 label=303;break;
 case 302: 
 _abort();
 throw "Reached an unreachable!";
 case 303: 
 var $_sum1819_i_i=$989|8;
 var $1321=(($tbase_245_i+$_sum1819_i_i)|0);
 var $mem_0=$1321;label=341;break;
 case 304: 
 var $1322=$888;
 var $sp_0_i_i_i=14552;label=305;break;
 case 305: 
 var $sp_0_i_i_i;
 var $1324=(($sp_0_i_i_i)|0);
 var $1325=HEAP32[(($1324)>>2)];
 var $1326=($1325>>>0)>($1322>>>0);
 if($1326){label=307;break;}else{label=306;break;}
 case 306: 
 var $1328=(($sp_0_i_i_i+4)|0);
 var $1329=HEAP32[(($1328)>>2)];
 var $1330=(($1325+$1329)|0);
 var $1331=($1330>>>0)>($1322>>>0);
 if($1331){label=308;break;}else{label=307;break;}
 case 307: 
 var $1333=(($sp_0_i_i_i+8)|0);
 var $1334=HEAP32[(($1333)>>2)];
 var $sp_0_i_i_i=$1334;label=305;break;
 case 308: 
 var $_sum_i15_i=((($1329)-(47))|0);
 var $_sum1_i16_i=((($1329)-(39))|0);
 var $1335=(($1325+$_sum1_i16_i)|0);
 var $1336=$1335;
 var $1337=$1336&7;
 var $1338=($1337|0)==0;
 if($1338){var $1343=0;label=310;break;}else{label=309;break;}
 case 309: 
 var $1340=(((-$1336))|0);
 var $1341=$1340&7;
 var $1343=$1341;label=310;break;
 case 310: 
 var $1343;
 var $_sum2_i17_i=((($_sum_i15_i)+($1343))|0);
 var $1344=(($1325+$_sum2_i17_i)|0);
 var $1345=(($888+16)|0);
 var $1346=$1345;
 var $1347=($1344>>>0)<($1346>>>0);
 var $1348=($1347?$1322:$1344);
 var $1349=(($1348+8)|0);
 var $1350=$1349;
 var $1351=((($tsize_244_i)-(40))|0);
 var $1352=(($tbase_245_i+8)|0);
 var $1353=$1352;
 var $1354=$1353&7;
 var $1355=($1354|0)==0;
 if($1355){var $1359=0;label=312;break;}else{label=311;break;}
 case 311: 
 var $1357=(((-$1353))|0);
 var $1358=$1357&7;
 var $1359=$1358;label=312;break;
 case 312: 
 var $1359;
 var $1360=(($tbase_245_i+$1359)|0);
 var $1361=$1360;
 var $1362=((($1351)-($1359))|0);
 HEAP32[((14128)>>2)]=$1361;
 HEAP32[((14116)>>2)]=$1362;
 var $1363=$1362|1;
 var $_sum_i_i_i=((($1359)+(4))|0);
 var $1364=(($tbase_245_i+$_sum_i_i_i)|0);
 var $1365=$1364;
 HEAP32[(($1365)>>2)]=$1363;
 var $_sum2_i_i_i=((($tsize_244_i)-(36))|0);
 var $1366=(($tbase_245_i+$_sum2_i_i_i)|0);
 var $1367=$1366;
 HEAP32[(($1367)>>2)]=40;
 var $1368=HEAP32[((14080)>>2)];
 HEAP32[((14132)>>2)]=$1368;
 var $1369=(($1348+4)|0);
 var $1370=$1369;
 HEAP32[(($1370)>>2)]=27;
 assert(16 % 1 === 0);HEAP32[(($1349)>>2)]=HEAP32[((14552)>>2)];HEAP32[((($1349)+(4))>>2)]=HEAP32[((14556)>>2)];HEAP32[((($1349)+(8))>>2)]=HEAP32[((14560)>>2)];HEAP32[((($1349)+(12))>>2)]=HEAP32[((14564)>>2)];
 HEAP32[((14552)>>2)]=$tbase_245_i;
 HEAP32[((14556)>>2)]=$tsize_244_i;
 HEAP32[((14564)>>2)]=0;
 HEAP32[((14560)>>2)]=$1350;
 var $1371=(($1348+28)|0);
 var $1372=$1371;
 HEAP32[(($1372)>>2)]=7;
 var $1373=(($1348+32)|0);
 var $1374=($1373>>>0)<($1330>>>0);
 if($1374){var $1375=$1372;label=313;break;}else{label=314;break;}
 case 313: 
 var $1375;
 var $1376=(($1375+4)|0);
 HEAP32[(($1376)>>2)]=7;
 var $1377=(($1375+8)|0);
 var $1378=$1377;
 var $1379=($1378>>>0)<($1330>>>0);
 if($1379){var $1375=$1376;label=313;break;}else{label=314;break;}
 case 314: 
 var $1380=($1348|0)==($1322|0);
 if($1380){label=338;break;}else{label=315;break;}
 case 315: 
 var $1382=$1348;
 var $1383=$888;
 var $1384=((($1382)-($1383))|0);
 var $1385=(($1322+$1384)|0);
 var $_sum3_i_i=((($1384)+(4))|0);
 var $1386=(($1322+$_sum3_i_i)|0);
 var $1387=$1386;
 var $1388=HEAP32[(($1387)>>2)];
 var $1389=$1388&-2;
 HEAP32[(($1387)>>2)]=$1389;
 var $1390=$1384|1;
 var $1391=(($888+4)|0);
 HEAP32[(($1391)>>2)]=$1390;
 var $1392=$1385;
 HEAP32[(($1392)>>2)]=$1384;
 var $1393=$1384>>>3;
 var $1394=($1384>>>0)<256;
 if($1394){label=316;break;}else{label=321;break;}
 case 316: 
 var $1396=$1393<<1;
 var $1397=((14144+($1396<<2))|0);
 var $1398=$1397;
 var $1399=HEAP32[((14104)>>2)];
 var $1400=1<<$1393;
 var $1401=$1399&$1400;
 var $1402=($1401|0)==0;
 if($1402){label=317;break;}else{label=318;break;}
 case 317: 
 var $1404=$1399|$1400;
 HEAP32[((14104)>>2)]=$1404;
 var $_sum11_pre_i_i=((($1396)+(2))|0);
 var $_pre_i_i=((14144+($_sum11_pre_i_i<<2))|0);
 var $F_0_i_i=$1398;var $_pre_phi_i_i=$_pre_i_i;label=320;break;
 case 318: 
 var $_sum12_i_i=((($1396)+(2))|0);
 var $1406=((14144+($_sum12_i_i<<2))|0);
 var $1407=HEAP32[(($1406)>>2)];
 var $1408=$1407;
 var $1409=HEAP32[((14120)>>2)];
 var $1410=($1408>>>0)<($1409>>>0);
 if($1410){label=319;break;}else{var $F_0_i_i=$1407;var $_pre_phi_i_i=$1406;label=320;break;}
 case 319: 
 _abort();
 throw "Reached an unreachable!";
 case 320: 
 var $_pre_phi_i_i;
 var $F_0_i_i;
 HEAP32[(($_pre_phi_i_i)>>2)]=$888;
 var $1413=(($F_0_i_i+12)|0);
 HEAP32[(($1413)>>2)]=$888;
 var $1414=(($888+8)|0);
 HEAP32[(($1414)>>2)]=$F_0_i_i;
 var $1415=(($888+12)|0);
 HEAP32[(($1415)>>2)]=$1398;
 label=338;break;
 case 321: 
 var $1417=$888;
 var $1418=$1384>>>8;
 var $1419=($1418|0)==0;
 if($1419){var $I1_0_i_i=0;label=324;break;}else{label=322;break;}
 case 322: 
 var $1421=($1384>>>0)>16777215;
 if($1421){var $I1_0_i_i=31;label=324;break;}else{label=323;break;}
 case 323: 
 var $1423=((($1418)+(1048320))|0);
 var $1424=$1423>>>16;
 var $1425=$1424&8;
 var $1426=$1418<<$1425;
 var $1427=((($1426)+(520192))|0);
 var $1428=$1427>>>16;
 var $1429=$1428&4;
 var $1430=$1429|$1425;
 var $1431=$1426<<$1429;
 var $1432=((($1431)+(245760))|0);
 var $1433=$1432>>>16;
 var $1434=$1433&2;
 var $1435=$1430|$1434;
 var $1436=(((14)-($1435))|0);
 var $1437=$1431<<$1434;
 var $1438=$1437>>>15;
 var $1439=((($1436)+($1438))|0);
 var $1440=$1439<<1;
 var $1441=((($1439)+(7))|0);
 var $1442=$1384>>>($1441>>>0);
 var $1443=$1442&1;
 var $1444=$1443|$1440;
 var $I1_0_i_i=$1444;label=324;break;
 case 324: 
 var $I1_0_i_i;
 var $1446=((14408+($I1_0_i_i<<2))|0);
 var $1447=(($888+28)|0);
 var $I1_0_c_i_i=$I1_0_i_i;
 HEAP32[(($1447)>>2)]=$I1_0_c_i_i;
 var $1448=(($888+20)|0);
 HEAP32[(($1448)>>2)]=0;
 var $1449=(($888+16)|0);
 HEAP32[(($1449)>>2)]=0;
 var $1450=HEAP32[((14108)>>2)];
 var $1451=1<<$I1_0_i_i;
 var $1452=$1450&$1451;
 var $1453=($1452|0)==0;
 if($1453){label=325;break;}else{label=326;break;}
 case 325: 
 var $1455=$1450|$1451;
 HEAP32[((14108)>>2)]=$1455;
 HEAP32[(($1446)>>2)]=$1417;
 var $1456=(($888+24)|0);
 var $_c_i_i=$1446;
 HEAP32[(($1456)>>2)]=$_c_i_i;
 var $1457=(($888+12)|0);
 HEAP32[(($1457)>>2)]=$888;
 var $1458=(($888+8)|0);
 HEAP32[(($1458)>>2)]=$888;
 label=338;break;
 case 326: 
 var $1460=HEAP32[(($1446)>>2)];
 var $1461=($I1_0_i_i|0)==31;
 if($1461){var $1466=0;label=328;break;}else{label=327;break;}
 case 327: 
 var $1463=$I1_0_i_i>>>1;
 var $1464=(((25)-($1463))|0);
 var $1466=$1464;label=328;break;
 case 328: 
 var $1466;
 var $1467=$1384<<$1466;
 var $K2_0_i_i=$1467;var $T_0_i_i=$1460;label=329;break;
 case 329: 
 var $T_0_i_i;
 var $K2_0_i_i;
 var $1469=(($T_0_i_i+4)|0);
 var $1470=HEAP32[(($1469)>>2)];
 var $1471=$1470&-8;
 var $1472=($1471|0)==($1384|0);
 if($1472){label=334;break;}else{label=330;break;}
 case 330: 
 var $1474=$K2_0_i_i>>>31;
 var $1475=(($T_0_i_i+16+($1474<<2))|0);
 var $1476=HEAP32[(($1475)>>2)];
 var $1477=($1476|0)==0;
 var $1478=$K2_0_i_i<<1;
 if($1477){label=331;break;}else{var $K2_0_i_i=$1478;var $T_0_i_i=$1476;label=329;break;}
 case 331: 
 var $1480=$1475;
 var $1481=HEAP32[((14120)>>2)];
 var $1482=($1480>>>0)<($1481>>>0);
 if($1482){label=333;break;}else{label=332;break;}
 case 332: 
 HEAP32[(($1475)>>2)]=$1417;
 var $1484=(($888+24)|0);
 var $T_0_c8_i_i=$T_0_i_i;
 HEAP32[(($1484)>>2)]=$T_0_c8_i_i;
 var $1485=(($888+12)|0);
 HEAP32[(($1485)>>2)]=$888;
 var $1486=(($888+8)|0);
 HEAP32[(($1486)>>2)]=$888;
 label=338;break;
 case 333: 
 _abort();
 throw "Reached an unreachable!";
 case 334: 
 var $1489=(($T_0_i_i+8)|0);
 var $1490=HEAP32[(($1489)>>2)];
 var $1491=$T_0_i_i;
 var $1492=HEAP32[((14120)>>2)];
 var $1493=($1491>>>0)<($1492>>>0);
 if($1493){label=337;break;}else{label=335;break;}
 case 335: 
 var $1495=$1490;
 var $1496=($1495>>>0)<($1492>>>0);
 if($1496){label=337;break;}else{label=336;break;}
 case 336: 
 var $1498=(($1490+12)|0);
 HEAP32[(($1498)>>2)]=$1417;
 HEAP32[(($1489)>>2)]=$1417;
 var $1499=(($888+8)|0);
 var $_c7_i_i=$1490;
 HEAP32[(($1499)>>2)]=$_c7_i_i;
 var $1500=(($888+12)|0);
 var $T_0_c_i_i=$T_0_i_i;
 HEAP32[(($1500)>>2)]=$T_0_c_i_i;
 var $1501=(($888+24)|0);
 HEAP32[(($1501)>>2)]=0;
 label=338;break;
 case 337: 
 _abort();
 throw "Reached an unreachable!";
 case 338: 
 var $1502=HEAP32[((14116)>>2)];
 var $1503=($1502>>>0)>($nb_0>>>0);
 if($1503){label=339;break;}else{label=340;break;}
 case 339: 
 var $1505=((($1502)-($nb_0))|0);
 HEAP32[((14116)>>2)]=$1505;
 var $1506=HEAP32[((14128)>>2)];
 var $1507=$1506;
 var $1508=(($1507+$nb_0)|0);
 var $1509=$1508;
 HEAP32[((14128)>>2)]=$1509;
 var $1510=$1505|1;
 var $_sum_i134=((($nb_0)+(4))|0);
 var $1511=(($1507+$_sum_i134)|0);
 var $1512=$1511;
 HEAP32[(($1512)>>2)]=$1510;
 var $1513=$nb_0|3;
 var $1514=(($1506+4)|0);
 HEAP32[(($1514)>>2)]=$1513;
 var $1515=(($1506+8)|0);
 var $1516=$1515;
 var $mem_0=$1516;label=341;break;
 case 340: 
 var $1517=___errno_location();
 HEAP32[(($1517)>>2)]=12;
 var $mem_0=0;label=341;break;
 case 341: 
 var $mem_0;
 return $mem_0;
  default: assert(0, "bad label: " + label);
 }

}
Module["_malloc"] = _malloc;

function _free($mem){
 var label=0;

 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=($mem|0)==0;
 if($1){label=140;break;}else{label=2;break;}
 case 2: 
 var $3=((($mem)-(8))|0);
 var $4=$3;
 var $5=HEAP32[((14120)>>2)];
 var $6=($3>>>0)<($5>>>0);
 if($6){label=139;break;}else{label=3;break;}
 case 3: 
 var $8=((($mem)-(4))|0);
 var $9=$8;
 var $10=HEAP32[(($9)>>2)];
 var $11=$10&3;
 var $12=($11|0)==1;
 if($12){label=139;break;}else{label=4;break;}
 case 4: 
 var $14=$10&-8;
 var $_sum=((($14)-(8))|0);
 var $15=(($mem+$_sum)|0);
 var $16=$15;
 var $17=$10&1;
 var $18=($17|0)==0;
 if($18){label=5;break;}else{var $p_0=$4;var $psize_0=$14;label=56;break;}
 case 5: 
 var $20=$3;
 var $21=HEAP32[(($20)>>2)];
 var $22=($11|0)==0;
 if($22){label=140;break;}else{label=6;break;}
 case 6: 
 var $_sum232=(((-8)-($21))|0);
 var $24=(($mem+$_sum232)|0);
 var $25=$24;
 var $26=((($21)+($14))|0);
 var $27=($24>>>0)<($5>>>0);
 if($27){label=139;break;}else{label=7;break;}
 case 7: 
 var $29=HEAP32[((14124)>>2)];
 var $30=($25|0)==($29|0);
 if($30){label=54;break;}else{label=8;break;}
 case 8: 
 var $32=$21>>>3;
 var $33=($21>>>0)<256;
 if($33){label=9;break;}else{label=21;break;}
 case 9: 
 var $_sum276=((($_sum232)+(8))|0);
 var $35=(($mem+$_sum276)|0);
 var $36=$35;
 var $37=HEAP32[(($36)>>2)];
 var $_sum277=((($_sum232)+(12))|0);
 var $38=(($mem+$_sum277)|0);
 var $39=$38;
 var $40=HEAP32[(($39)>>2)];
 var $41=$32<<1;
 var $42=((14144+($41<<2))|0);
 var $43=$42;
 var $44=($37|0)==($43|0);
 if($44){label=12;break;}else{label=10;break;}
 case 10: 
 var $46=$37;
 var $47=($46>>>0)<($5>>>0);
 if($47){label=20;break;}else{label=11;break;}
 case 11: 
 var $49=(($37+12)|0);
 var $50=HEAP32[(($49)>>2)];
 var $51=($50|0)==($25|0);
 if($51){label=12;break;}else{label=20;break;}
 case 12: 
 var $52=($40|0)==($37|0);
 if($52){label=13;break;}else{label=14;break;}
 case 13: 
 var $54=1<<$32;
 var $55=$54^-1;
 var $56=HEAP32[((14104)>>2)];
 var $57=$56&$55;
 HEAP32[((14104)>>2)]=$57;
 var $p_0=$25;var $psize_0=$26;label=56;break;
 case 14: 
 var $59=($40|0)==($43|0);
 if($59){label=15;break;}else{label=16;break;}
 case 15: 
 var $_pre307=(($40+8)|0);
 var $_pre_phi308=$_pre307;label=18;break;
 case 16: 
 var $61=$40;
 var $62=($61>>>0)<($5>>>0);
 if($62){label=19;break;}else{label=17;break;}
 case 17: 
 var $64=(($40+8)|0);
 var $65=HEAP32[(($64)>>2)];
 var $66=($65|0)==($25|0);
 if($66){var $_pre_phi308=$64;label=18;break;}else{label=19;break;}
 case 18: 
 var $_pre_phi308;
 var $67=(($37+12)|0);
 HEAP32[(($67)>>2)]=$40;
 HEAP32[(($_pre_phi308)>>2)]=$37;
 var $p_0=$25;var $psize_0=$26;label=56;break;
 case 19: 
 _abort();
 throw "Reached an unreachable!";
 case 20: 
 _abort();
 throw "Reached an unreachable!";
 case 21: 
 var $69=$24;
 var $_sum266=((($_sum232)+(24))|0);
 var $70=(($mem+$_sum266)|0);
 var $71=$70;
 var $72=HEAP32[(($71)>>2)];
 var $_sum267=((($_sum232)+(12))|0);
 var $73=(($mem+$_sum267)|0);
 var $74=$73;
 var $75=HEAP32[(($74)>>2)];
 var $76=($75|0)==($69|0);
 if($76){label=27;break;}else{label=22;break;}
 case 22: 
 var $_sum273=((($_sum232)+(8))|0);
 var $78=(($mem+$_sum273)|0);
 var $79=$78;
 var $80=HEAP32[(($79)>>2)];
 var $81=$80;
 var $82=($81>>>0)<($5>>>0);
 if($82){label=26;break;}else{label=23;break;}
 case 23: 
 var $84=(($80+12)|0);
 var $85=HEAP32[(($84)>>2)];
 var $86=($85|0)==($69|0);
 if($86){label=24;break;}else{label=26;break;}
 case 24: 
 var $88=(($75+8)|0);
 var $89=HEAP32[(($88)>>2)];
 var $90=($89|0)==($69|0);
 if($90){label=25;break;}else{label=26;break;}
 case 25: 
 HEAP32[(($84)>>2)]=$75;
 HEAP32[(($88)>>2)]=$80;
 var $R_1=$75;label=34;break;
 case 26: 
 _abort();
 throw "Reached an unreachable!";
 case 27: 
 var $_sum269=((($_sum232)+(20))|0);
 var $93=(($mem+$_sum269)|0);
 var $94=$93;
 var $95=HEAP32[(($94)>>2)];
 var $96=($95|0)==0;
 if($96){label=28;break;}else{var $R_0=$95;var $RP_0=$94;label=29;break;}
 case 28: 
 var $_sum268=((($_sum232)+(16))|0);
 var $98=(($mem+$_sum268)|0);
 var $99=$98;
 var $100=HEAP32[(($99)>>2)];
 var $101=($100|0)==0;
 if($101){var $R_1=0;label=34;break;}else{var $R_0=$100;var $RP_0=$99;label=29;break;}
 case 29: 
 var $RP_0;
 var $R_0;
 var $102=(($R_0+20)|0);
 var $103=HEAP32[(($102)>>2)];
 var $104=($103|0)==0;
 if($104){label=30;break;}else{var $R_0=$103;var $RP_0=$102;label=29;break;}
 case 30: 
 var $106=(($R_0+16)|0);
 var $107=HEAP32[(($106)>>2)];
 var $108=($107|0)==0;
 if($108){label=31;break;}else{var $R_0=$107;var $RP_0=$106;label=29;break;}
 case 31: 
 var $110=$RP_0;
 var $111=($110>>>0)<($5>>>0);
 if($111){label=33;break;}else{label=32;break;}
 case 32: 
 HEAP32[(($RP_0)>>2)]=0;
 var $R_1=$R_0;label=34;break;
 case 33: 
 _abort();
 throw "Reached an unreachable!";
 case 34: 
 var $R_1;
 var $115=($72|0)==0;
 if($115){var $p_0=$25;var $psize_0=$26;label=56;break;}else{label=35;break;}
 case 35: 
 var $_sum270=((($_sum232)+(28))|0);
 var $117=(($mem+$_sum270)|0);
 var $118=$117;
 var $119=HEAP32[(($118)>>2)];
 var $120=((14408+($119<<2))|0);
 var $121=HEAP32[(($120)>>2)];
 var $122=($69|0)==($121|0);
 if($122){label=36;break;}else{label=38;break;}
 case 36: 
 HEAP32[(($120)>>2)]=$R_1;
 var $cond=($R_1|0)==0;
 if($cond){label=37;break;}else{label=44;break;}
 case 37: 
 var $124=1<<$119;
 var $125=$124^-1;
 var $126=HEAP32[((14108)>>2)];
 var $127=$126&$125;
 HEAP32[((14108)>>2)]=$127;
 var $p_0=$25;var $psize_0=$26;label=56;break;
 case 38: 
 var $129=$72;
 var $130=HEAP32[((14120)>>2)];
 var $131=($129>>>0)<($130>>>0);
 if($131){label=42;break;}else{label=39;break;}
 case 39: 
 var $133=(($72+16)|0);
 var $134=HEAP32[(($133)>>2)];
 var $135=($134|0)==($69|0);
 if($135){label=40;break;}else{label=41;break;}
 case 40: 
 HEAP32[(($133)>>2)]=$R_1;
 label=43;break;
 case 41: 
 var $138=(($72+20)|0);
 HEAP32[(($138)>>2)]=$R_1;
 label=43;break;
 case 42: 
 _abort();
 throw "Reached an unreachable!";
 case 43: 
 var $141=($R_1|0)==0;
 if($141){var $p_0=$25;var $psize_0=$26;label=56;break;}else{label=44;break;}
 case 44: 
 var $143=$R_1;
 var $144=HEAP32[((14120)>>2)];
 var $145=($143>>>0)<($144>>>0);
 if($145){label=53;break;}else{label=45;break;}
 case 45: 
 var $147=(($R_1+24)|0);
 HEAP32[(($147)>>2)]=$72;
 var $_sum271=((($_sum232)+(16))|0);
 var $148=(($mem+$_sum271)|0);
 var $149=$148;
 var $150=HEAP32[(($149)>>2)];
 var $151=($150|0)==0;
 if($151){label=49;break;}else{label=46;break;}
 case 46: 
 var $153=$150;
 var $154=HEAP32[((14120)>>2)];
 var $155=($153>>>0)<($154>>>0);
 if($155){label=48;break;}else{label=47;break;}
 case 47: 
 var $157=(($R_1+16)|0);
 HEAP32[(($157)>>2)]=$150;
 var $158=(($150+24)|0);
 HEAP32[(($158)>>2)]=$R_1;
 label=49;break;
 case 48: 
 _abort();
 throw "Reached an unreachable!";
 case 49: 
 var $_sum272=((($_sum232)+(20))|0);
 var $161=(($mem+$_sum272)|0);
 var $162=$161;
 var $163=HEAP32[(($162)>>2)];
 var $164=($163|0)==0;
 if($164){var $p_0=$25;var $psize_0=$26;label=56;break;}else{label=50;break;}
 case 50: 
 var $166=$163;
 var $167=HEAP32[((14120)>>2)];
 var $168=($166>>>0)<($167>>>0);
 if($168){label=52;break;}else{label=51;break;}
 case 51: 
 var $170=(($R_1+20)|0);
 HEAP32[(($170)>>2)]=$163;
 var $171=(($163+24)|0);
 HEAP32[(($171)>>2)]=$R_1;
 var $p_0=$25;var $psize_0=$26;label=56;break;
 case 52: 
 _abort();
 throw "Reached an unreachable!";
 case 53: 
 _abort();
 throw "Reached an unreachable!";
 case 54: 
 var $_sum233=((($14)-(4))|0);
 var $175=(($mem+$_sum233)|0);
 var $176=$175;
 var $177=HEAP32[(($176)>>2)];
 var $178=$177&3;
 var $179=($178|0)==3;
 if($179){label=55;break;}else{var $p_0=$25;var $psize_0=$26;label=56;break;}
 case 55: 
 HEAP32[((14112)>>2)]=$26;
 var $181=HEAP32[(($176)>>2)];
 var $182=$181&-2;
 HEAP32[(($176)>>2)]=$182;
 var $183=$26|1;
 var $_sum264=((($_sum232)+(4))|0);
 var $184=(($mem+$_sum264)|0);
 var $185=$184;
 HEAP32[(($185)>>2)]=$183;
 var $186=$15;
 HEAP32[(($186)>>2)]=$26;
 label=140;break;
 case 56: 
 var $psize_0;
 var $p_0;
 var $188=$p_0;
 var $189=($188>>>0)<($15>>>0);
 if($189){label=57;break;}else{label=139;break;}
 case 57: 
 var $_sum263=((($14)-(4))|0);
 var $191=(($mem+$_sum263)|0);
 var $192=$191;
 var $193=HEAP32[(($192)>>2)];
 var $194=$193&1;
 var $phitmp=($194|0)==0;
 if($phitmp){label=139;break;}else{label=58;break;}
 case 58: 
 var $196=$193&2;
 var $197=($196|0)==0;
 if($197){label=59;break;}else{label=112;break;}
 case 59: 
 var $199=HEAP32[((14128)>>2)];
 var $200=($16|0)==($199|0);
 if($200){label=60;break;}else{label=62;break;}
 case 60: 
 var $202=HEAP32[((14116)>>2)];
 var $203=((($202)+($psize_0))|0);
 HEAP32[((14116)>>2)]=$203;
 HEAP32[((14128)>>2)]=$p_0;
 var $204=$203|1;
 var $205=(($p_0+4)|0);
 HEAP32[(($205)>>2)]=$204;
 var $206=HEAP32[((14124)>>2)];
 var $207=($p_0|0)==($206|0);
 if($207){label=61;break;}else{label=140;break;}
 case 61: 
 HEAP32[((14124)>>2)]=0;
 HEAP32[((14112)>>2)]=0;
 label=140;break;
 case 62: 
 var $210=HEAP32[((14124)>>2)];
 var $211=($16|0)==($210|0);
 if($211){label=63;break;}else{label=64;break;}
 case 63: 
 var $213=HEAP32[((14112)>>2)];
 var $214=((($213)+($psize_0))|0);
 HEAP32[((14112)>>2)]=$214;
 HEAP32[((14124)>>2)]=$p_0;
 var $215=$214|1;
 var $216=(($p_0+4)|0);
 HEAP32[(($216)>>2)]=$215;
 var $217=(($188+$214)|0);
 var $218=$217;
 HEAP32[(($218)>>2)]=$214;
 label=140;break;
 case 64: 
 var $220=$193&-8;
 var $221=((($220)+($psize_0))|0);
 var $222=$193>>>3;
 var $223=($193>>>0)<256;
 if($223){label=65;break;}else{label=77;break;}
 case 65: 
 var $225=(($mem+$14)|0);
 var $226=$225;
 var $227=HEAP32[(($226)>>2)];
 var $_sum257258=$14|4;
 var $228=(($mem+$_sum257258)|0);
 var $229=$228;
 var $230=HEAP32[(($229)>>2)];
 var $231=$222<<1;
 var $232=((14144+($231<<2))|0);
 var $233=$232;
 var $234=($227|0)==($233|0);
 if($234){label=68;break;}else{label=66;break;}
 case 66: 
 var $236=$227;
 var $237=HEAP32[((14120)>>2)];
 var $238=($236>>>0)<($237>>>0);
 if($238){label=76;break;}else{label=67;break;}
 case 67: 
 var $240=(($227+12)|0);
 var $241=HEAP32[(($240)>>2)];
 var $242=($241|0)==($16|0);
 if($242){label=68;break;}else{label=76;break;}
 case 68: 
 var $243=($230|0)==($227|0);
 if($243){label=69;break;}else{label=70;break;}
 case 69: 
 var $245=1<<$222;
 var $246=$245^-1;
 var $247=HEAP32[((14104)>>2)];
 var $248=$247&$246;
 HEAP32[((14104)>>2)]=$248;
 label=110;break;
 case 70: 
 var $250=($230|0)==($233|0);
 if($250){label=71;break;}else{label=72;break;}
 case 71: 
 var $_pre305=(($230+8)|0);
 var $_pre_phi306=$_pre305;label=74;break;
 case 72: 
 var $252=$230;
 var $253=HEAP32[((14120)>>2)];
 var $254=($252>>>0)<($253>>>0);
 if($254){label=75;break;}else{label=73;break;}
 case 73: 
 var $256=(($230+8)|0);
 var $257=HEAP32[(($256)>>2)];
 var $258=($257|0)==($16|0);
 if($258){var $_pre_phi306=$256;label=74;break;}else{label=75;break;}
 case 74: 
 var $_pre_phi306;
 var $259=(($227+12)|0);
 HEAP32[(($259)>>2)]=$230;
 HEAP32[(($_pre_phi306)>>2)]=$227;
 label=110;break;
 case 75: 
 _abort();
 throw "Reached an unreachable!";
 case 76: 
 _abort();
 throw "Reached an unreachable!";
 case 77: 
 var $261=$15;
 var $_sum235=((($14)+(16))|0);
 var $262=(($mem+$_sum235)|0);
 var $263=$262;
 var $264=HEAP32[(($263)>>2)];
 var $_sum236237=$14|4;
 var $265=(($mem+$_sum236237)|0);
 var $266=$265;
 var $267=HEAP32[(($266)>>2)];
 var $268=($267|0)==($261|0);
 if($268){label=83;break;}else{label=78;break;}
 case 78: 
 var $270=(($mem+$14)|0);
 var $271=$270;
 var $272=HEAP32[(($271)>>2)];
 var $273=$272;
 var $274=HEAP32[((14120)>>2)];
 var $275=($273>>>0)<($274>>>0);
 if($275){label=82;break;}else{label=79;break;}
 case 79: 
 var $277=(($272+12)|0);
 var $278=HEAP32[(($277)>>2)];
 var $279=($278|0)==($261|0);
 if($279){label=80;break;}else{label=82;break;}
 case 80: 
 var $281=(($267+8)|0);
 var $282=HEAP32[(($281)>>2)];
 var $283=($282|0)==($261|0);
 if($283){label=81;break;}else{label=82;break;}
 case 81: 
 HEAP32[(($277)>>2)]=$267;
 HEAP32[(($281)>>2)]=$272;
 var $R7_1=$267;label=90;break;
 case 82: 
 _abort();
 throw "Reached an unreachable!";
 case 83: 
 var $_sum239=((($14)+(12))|0);
 var $286=(($mem+$_sum239)|0);
 var $287=$286;
 var $288=HEAP32[(($287)>>2)];
 var $289=($288|0)==0;
 if($289){label=84;break;}else{var $R7_0=$288;var $RP9_0=$287;label=85;break;}
 case 84: 
 var $_sum238=((($14)+(8))|0);
 var $291=(($mem+$_sum238)|0);
 var $292=$291;
 var $293=HEAP32[(($292)>>2)];
 var $294=($293|0)==0;
 if($294){var $R7_1=0;label=90;break;}else{var $R7_0=$293;var $RP9_0=$292;label=85;break;}
 case 85: 
 var $RP9_0;
 var $R7_0;
 var $295=(($R7_0+20)|0);
 var $296=HEAP32[(($295)>>2)];
 var $297=($296|0)==0;
 if($297){label=86;break;}else{var $R7_0=$296;var $RP9_0=$295;label=85;break;}
 case 86: 
 var $299=(($R7_0+16)|0);
 var $300=HEAP32[(($299)>>2)];
 var $301=($300|0)==0;
 if($301){label=87;break;}else{var $R7_0=$300;var $RP9_0=$299;label=85;break;}
 case 87: 
 var $303=$RP9_0;
 var $304=HEAP32[((14120)>>2)];
 var $305=($303>>>0)<($304>>>0);
 if($305){label=89;break;}else{label=88;break;}
 case 88: 
 HEAP32[(($RP9_0)>>2)]=0;
 var $R7_1=$R7_0;label=90;break;
 case 89: 
 _abort();
 throw "Reached an unreachable!";
 case 90: 
 var $R7_1;
 var $309=($264|0)==0;
 if($309){label=110;break;}else{label=91;break;}
 case 91: 
 var $_sum250=((($14)+(20))|0);
 var $311=(($mem+$_sum250)|0);
 var $312=$311;
 var $313=HEAP32[(($312)>>2)];
 var $314=((14408+($313<<2))|0);
 var $315=HEAP32[(($314)>>2)];
 var $316=($261|0)==($315|0);
 if($316){label=92;break;}else{label=94;break;}
 case 92: 
 HEAP32[(($314)>>2)]=$R7_1;
 var $cond298=($R7_1|0)==0;
 if($cond298){label=93;break;}else{label=100;break;}
 case 93: 
 var $318=1<<$313;
 var $319=$318^-1;
 var $320=HEAP32[((14108)>>2)];
 var $321=$320&$319;
 HEAP32[((14108)>>2)]=$321;
 label=110;break;
 case 94: 
 var $323=$264;
 var $324=HEAP32[((14120)>>2)];
 var $325=($323>>>0)<($324>>>0);
 if($325){label=98;break;}else{label=95;break;}
 case 95: 
 var $327=(($264+16)|0);
 var $328=HEAP32[(($327)>>2)];
 var $329=($328|0)==($261|0);
 if($329){label=96;break;}else{label=97;break;}
 case 96: 
 HEAP32[(($327)>>2)]=$R7_1;
 label=99;break;
 case 97: 
 var $332=(($264+20)|0);
 HEAP32[(($332)>>2)]=$R7_1;
 label=99;break;
 case 98: 
 _abort();
 throw "Reached an unreachable!";
 case 99: 
 var $335=($R7_1|0)==0;
 if($335){label=110;break;}else{label=100;break;}
 case 100: 
 var $337=$R7_1;
 var $338=HEAP32[((14120)>>2)];
 var $339=($337>>>0)<($338>>>0);
 if($339){label=109;break;}else{label=101;break;}
 case 101: 
 var $341=(($R7_1+24)|0);
 HEAP32[(($341)>>2)]=$264;
 var $_sum251=((($14)+(8))|0);
 var $342=(($mem+$_sum251)|0);
 var $343=$342;
 var $344=HEAP32[(($343)>>2)];
 var $345=($344|0)==0;
 if($345){label=105;break;}else{label=102;break;}
 case 102: 
 var $347=$344;
 var $348=HEAP32[((14120)>>2)];
 var $349=($347>>>0)<($348>>>0);
 if($349){label=104;break;}else{label=103;break;}
 case 103: 
 var $351=(($R7_1+16)|0);
 HEAP32[(($351)>>2)]=$344;
 var $352=(($344+24)|0);
 HEAP32[(($352)>>2)]=$R7_1;
 label=105;break;
 case 104: 
 _abort();
 throw "Reached an unreachable!";
 case 105: 
 var $_sum252=((($14)+(12))|0);
 var $355=(($mem+$_sum252)|0);
 var $356=$355;
 var $357=HEAP32[(($356)>>2)];
 var $358=($357|0)==0;
 if($358){label=110;break;}else{label=106;break;}
 case 106: 
 var $360=$357;
 var $361=HEAP32[((14120)>>2)];
 var $362=($360>>>0)<($361>>>0);
 if($362){label=108;break;}else{label=107;break;}
 case 107: 
 var $364=(($R7_1+20)|0);
 HEAP32[(($364)>>2)]=$357;
 var $365=(($357+24)|0);
 HEAP32[(($365)>>2)]=$R7_1;
 label=110;break;
 case 108: 
 _abort();
 throw "Reached an unreachable!";
 case 109: 
 _abort();
 throw "Reached an unreachable!";
 case 110: 
 var $368=$221|1;
 var $369=(($p_0+4)|0);
 HEAP32[(($369)>>2)]=$368;
 var $370=(($188+$221)|0);
 var $371=$370;
 HEAP32[(($371)>>2)]=$221;
 var $372=HEAP32[((14124)>>2)];
 var $373=($p_0|0)==($372|0);
 if($373){label=111;break;}else{var $psize_1=$221;label=113;break;}
 case 111: 
 HEAP32[((14112)>>2)]=$221;
 label=140;break;
 case 112: 
 var $376=$193&-2;
 HEAP32[(($192)>>2)]=$376;
 var $377=$psize_0|1;
 var $378=(($p_0+4)|0);
 HEAP32[(($378)>>2)]=$377;
 var $379=(($188+$psize_0)|0);
 var $380=$379;
 HEAP32[(($380)>>2)]=$psize_0;
 var $psize_1=$psize_0;label=113;break;
 case 113: 
 var $psize_1;
 var $382=$psize_1>>>3;
 var $383=($psize_1>>>0)<256;
 if($383){label=114;break;}else{label=119;break;}
 case 114: 
 var $385=$382<<1;
 var $386=((14144+($385<<2))|0);
 var $387=$386;
 var $388=HEAP32[((14104)>>2)];
 var $389=1<<$382;
 var $390=$388&$389;
 var $391=($390|0)==0;
 if($391){label=115;break;}else{label=116;break;}
 case 115: 
 var $393=$388|$389;
 HEAP32[((14104)>>2)]=$393;
 var $_sum248_pre=((($385)+(2))|0);
 var $_pre=((14144+($_sum248_pre<<2))|0);
 var $F16_0=$387;var $_pre_phi=$_pre;label=118;break;
 case 116: 
 var $_sum249=((($385)+(2))|0);
 var $395=((14144+($_sum249<<2))|0);
 var $396=HEAP32[(($395)>>2)];
 var $397=$396;
 var $398=HEAP32[((14120)>>2)];
 var $399=($397>>>0)<($398>>>0);
 if($399){label=117;break;}else{var $F16_0=$396;var $_pre_phi=$395;label=118;break;}
 case 117: 
 _abort();
 throw "Reached an unreachable!";
 case 118: 
 var $_pre_phi;
 var $F16_0;
 HEAP32[(($_pre_phi)>>2)]=$p_0;
 var $402=(($F16_0+12)|0);
 HEAP32[(($402)>>2)]=$p_0;
 var $403=(($p_0+8)|0);
 HEAP32[(($403)>>2)]=$F16_0;
 var $404=(($p_0+12)|0);
 HEAP32[(($404)>>2)]=$387;
 label=140;break;
 case 119: 
 var $406=$p_0;
 var $407=$psize_1>>>8;
 var $408=($407|0)==0;
 if($408){var $I18_0=0;label=122;break;}else{label=120;break;}
 case 120: 
 var $410=($psize_1>>>0)>16777215;
 if($410){var $I18_0=31;label=122;break;}else{label=121;break;}
 case 121: 
 var $412=((($407)+(1048320))|0);
 var $413=$412>>>16;
 var $414=$413&8;
 var $415=$407<<$414;
 var $416=((($415)+(520192))|0);
 var $417=$416>>>16;
 var $418=$417&4;
 var $419=$418|$414;
 var $420=$415<<$418;
 var $421=((($420)+(245760))|0);
 var $422=$421>>>16;
 var $423=$422&2;
 var $424=$419|$423;
 var $425=(((14)-($424))|0);
 var $426=$420<<$423;
 var $427=$426>>>15;
 var $428=((($425)+($427))|0);
 var $429=$428<<1;
 var $430=((($428)+(7))|0);
 var $431=$psize_1>>>($430>>>0);
 var $432=$431&1;
 var $433=$432|$429;
 var $I18_0=$433;label=122;break;
 case 122: 
 var $I18_0;
 var $435=((14408+($I18_0<<2))|0);
 var $436=(($p_0+28)|0);
 var $I18_0_c=$I18_0;
 HEAP32[(($436)>>2)]=$I18_0_c;
 var $437=(($p_0+20)|0);
 HEAP32[(($437)>>2)]=0;
 var $438=(($p_0+16)|0);
 HEAP32[(($438)>>2)]=0;
 var $439=HEAP32[((14108)>>2)];
 var $440=1<<$I18_0;
 var $441=$439&$440;
 var $442=($441|0)==0;
 if($442){label=123;break;}else{label=124;break;}
 case 123: 
 var $444=$439|$440;
 HEAP32[((14108)>>2)]=$444;
 HEAP32[(($435)>>2)]=$406;
 var $445=(($p_0+24)|0);
 var $_c=$435;
 HEAP32[(($445)>>2)]=$_c;
 var $446=(($p_0+12)|0);
 HEAP32[(($446)>>2)]=$p_0;
 var $447=(($p_0+8)|0);
 HEAP32[(($447)>>2)]=$p_0;
 label=136;break;
 case 124: 
 var $449=HEAP32[(($435)>>2)];
 var $450=($I18_0|0)==31;
 if($450){var $455=0;label=126;break;}else{label=125;break;}
 case 125: 
 var $452=$I18_0>>>1;
 var $453=(((25)-($452))|0);
 var $455=$453;label=126;break;
 case 126: 
 var $455;
 var $456=$psize_1<<$455;
 var $K19_0=$456;var $T_0=$449;label=127;break;
 case 127: 
 var $T_0;
 var $K19_0;
 var $458=(($T_0+4)|0);
 var $459=HEAP32[(($458)>>2)];
 var $460=$459&-8;
 var $461=($460|0)==($psize_1|0);
 if($461){label=132;break;}else{label=128;break;}
 case 128: 
 var $463=$K19_0>>>31;
 var $464=(($T_0+16+($463<<2))|0);
 var $465=HEAP32[(($464)>>2)];
 var $466=($465|0)==0;
 var $467=$K19_0<<1;
 if($466){label=129;break;}else{var $K19_0=$467;var $T_0=$465;label=127;break;}
 case 129: 
 var $469=$464;
 var $470=HEAP32[((14120)>>2)];
 var $471=($469>>>0)<($470>>>0);
 if($471){label=131;break;}else{label=130;break;}
 case 130: 
 HEAP32[(($464)>>2)]=$406;
 var $473=(($p_0+24)|0);
 var $T_0_c245=$T_0;
 HEAP32[(($473)>>2)]=$T_0_c245;
 var $474=(($p_0+12)|0);
 HEAP32[(($474)>>2)]=$p_0;
 var $475=(($p_0+8)|0);
 HEAP32[(($475)>>2)]=$p_0;
 label=136;break;
 case 131: 
 _abort();
 throw "Reached an unreachable!";
 case 132: 
 var $478=(($T_0+8)|0);
 var $479=HEAP32[(($478)>>2)];
 var $480=$T_0;
 var $481=HEAP32[((14120)>>2)];
 var $482=($480>>>0)<($481>>>0);
 if($482){label=135;break;}else{label=133;break;}
 case 133: 
 var $484=$479;
 var $485=($484>>>0)<($481>>>0);
 if($485){label=135;break;}else{label=134;break;}
 case 134: 
 var $487=(($479+12)|0);
 HEAP32[(($487)>>2)]=$406;
 HEAP32[(($478)>>2)]=$406;
 var $488=(($p_0+8)|0);
 var $_c244=$479;
 HEAP32[(($488)>>2)]=$_c244;
 var $489=(($p_0+12)|0);
 var $T_0_c=$T_0;
 HEAP32[(($489)>>2)]=$T_0_c;
 var $490=(($p_0+24)|0);
 HEAP32[(($490)>>2)]=0;
 label=136;break;
 case 135: 
 _abort();
 throw "Reached an unreachable!";
 case 136: 
 var $492=HEAP32[((14136)>>2)];
 var $493=((($492)-(1))|0);
 HEAP32[((14136)>>2)]=$493;
 var $494=($493|0)==0;
 if($494){var $sp_0_in_i=14560;label=137;break;}else{label=140;break;}
 case 137: 
 var $sp_0_in_i;
 var $sp_0_i=HEAP32[(($sp_0_in_i)>>2)];
 var $495=($sp_0_i|0)==0;
 var $496=(($sp_0_i+8)|0);
 if($495){label=138;break;}else{var $sp_0_in_i=$496;label=137;break;}
 case 138: 
 HEAP32[((14136)>>2)]=-1;
 label=140;break;
 case 139: 
 _abort();
 throw "Reached an unreachable!";
 case 140: 
 return;
  default: assert(0, "bad label: " + label);
 }

}
Module["_free"] = _free;


// EMSCRIPTEN_END_FUNCS
// EMSCRIPTEN_END_FUNCS

// Warning: printing of i64 values may be slightly rounded! No deep i64 math used, so precise i64 code not included
var i64Math = null;

// === Auto-generated postamble setup entry stuff ===

if (memoryInitializer) {
  if (ENVIRONMENT_IS_NODE || ENVIRONMENT_IS_SHELL) {
    var data = Module['readBinary'](memoryInitializer);
    HEAPU8.set(data, STATIC_BASE);
  } else {
    addRunDependency('memory initializer');
    Browser.asyncLoad(memoryInitializer, function(data) {
      HEAPU8.set(data, STATIC_BASE);
      removeRunDependency('memory initializer');
    }, function(data) {
      throw 'could not load memory initializer ' + memoryInitializer;
    });
  }
}

function ExitStatus(status) {
  this.name = "ExitStatus";
  this.message = "Program terminated with exit(" + status + ")";
  this.status = status;
};
ExitStatus.prototype = new Error();
ExitStatus.prototype.constructor = ExitStatus;

var initialStackTop;
var preloadStartTime = null;
var calledMain = false;

dependenciesFulfilled = function runCaller() {
  // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
  if (!Module['calledRun'] && shouldRunNow) run();
  if (!Module['calledRun']) dependenciesFulfilled = runCaller; // try this again later, after new deps are fulfilled
}

Module['callMain'] = Module.callMain = function callMain(args) {
  assert(runDependencies == 0, 'cannot call main when async dependencies remain! (listen on __ATMAIN__)');
  assert(__ATPRERUN__.length == 0, 'cannot call main when preRun functions remain to be called');

  args = args || [];

  if (ENVIRONMENT_IS_WEB && preloadStartTime !== null) {
    Module.printErr('preload time: ' + (Date.now() - preloadStartTime) + ' ms');
  }

  ensureInitRuntime();

  var argc = args.length+1;
  function pad() {
    for (var i = 0; i < 4-1; i++) {
      argv.push(0);
    }
  }
  var argv = [allocate(intArrayFromString("/bin/this.program"), 'i8', ALLOC_NORMAL) ];
  pad();
  for (var i = 0; i < argc-1; i = i + 1) {
    argv.push(allocate(intArrayFromString(args[i]), 'i8', ALLOC_NORMAL));
    pad();
  }
  argv.push(0);
  argv = allocate(argv, 'i32', ALLOC_NORMAL);

  initialStackTop = STACKTOP;

  try {

    var ret = Module['_main'](argc, argv, 0);


    // if we're not running an evented main loop, it's time to exit
    if (!Module['noExitRuntime']) {
      exit(ret);
    }
  }
  catch(e) {
    if (e instanceof ExitStatus) {
      // exit() throws this once it's done to make sure execution
      // has been stopped completely
      return;
    } else if (e == 'SimulateInfiniteLoop') {
      // running an evented main loop, don't immediately exit
      Module['noExitRuntime'] = true;
      return;
    } else {
      if (e && typeof e === 'object' && e.stack) Module.printErr('exception thrown: ' + [e, e.stack]);
      throw e;
    }
  } finally {
    calledMain = true;
  }
}




function run(args) {
  args = args || Module['arguments'];

  if (preloadStartTime === null) preloadStartTime = Date.now();

  if (runDependencies > 0) {
    Module.printErr('run() called, but dependencies remain, so not running');
    return;
  }

  preRun();

  if (runDependencies > 0) return; // a preRun added a dependency, run will be called later
  if (Module['calledRun']) return; // run may have just been called through dependencies being fulfilled just in this very frame

  function doRun() {
    if (Module['calledRun']) return; // run may have just been called while the async setStatus time below was happening
    Module['calledRun'] = true;

    ensureInitRuntime();

    preMain();

    if (Module['_main'] && shouldRunNow) {
      Module['callMain'](args);
    }

    postRun();
  }

  if (Module['setStatus']) {
    Module['setStatus']('Running...');
    setTimeout(function() {
      setTimeout(function() {
        Module['setStatus']('');
      }, 1);
      if (!ABORT) doRun();
    }, 1);
  } else {
    doRun();
  }
}
Module['run'] = Module.run = run;

function exit(status) {
  ABORT = true;
  EXITSTATUS = status;
  STACKTOP = initialStackTop;

  // exit the runtime
  exitRuntime();

  // TODO We should handle this differently based on environment.
  // In the browser, the best we can do is throw an exception
  // to halt execution, but in node we could process.exit and
  // I'd imagine SM shell would have something equivalent.
  // This would let us set a proper exit status (which
  // would be great for checking test exit statuses).
  // https://github.com/kripken/emscripten/issues/1371

  // throw an exception to halt the current execution
  throw new ExitStatus(status);
}
Module['exit'] = Module.exit = exit;

function abort(text) {
  if (text) {
    Module.print(text);
    Module.printErr(text);
  }

  ABORT = true;
  EXITSTATUS = 1;

  throw 'abort() at ' + stackTrace();
}
Module['abort'] = Module.abort = abort;

// {{PRE_RUN_ADDITIONS}}

if (Module['preInit']) {
  if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
  while (Module['preInit'].length > 0) {
    Module['preInit'].pop()();
  }
}

// shouldRunNow refers to calling main(), not run().
var shouldRunNow = true;
if (Module['noInitialRun']) {
  shouldRunNow = false;
}


run();

// {{POST_RUN_ADDITIONS}}






// {{MODULE_ADDITIONS}}



