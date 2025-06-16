var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj2, key, value) => key in obj2 ? __defProp(obj2, key, { enumerable: true, configurable: true, writable: true, value }) : obj2[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// netlify/functions/node_modules/bluebird/js/release/es5.js
var require_es5 = __commonJS({
  "netlify/functions/node_modules/bluebird/js/release/es5.js"(exports2, module2) {
    var isES5 = function() {
      "use strict";
      return this === void 0;
    }();
    if (isES5) {
      module2.exports = {
        freeze: Object.freeze,
        defineProperty: Object.defineProperty,
        getDescriptor: Object.getOwnPropertyDescriptor,
        keys: Object.keys,
        names: Object.getOwnPropertyNames,
        getPrototypeOf: Object.getPrototypeOf,
        isArray: Array.isArray,
        isES5,
        propertyIsWritable: function(obj2, prop) {
          var descriptor = Object.getOwnPropertyDescriptor(obj2, prop);
          return !!(!descriptor || descriptor.writable || descriptor.set);
        }
      };
    } else {
      has = {}.hasOwnProperty;
      str = {}.toString;
      proto = {}.constructor.prototype;
      ObjectKeys = function(o) {
        var ret2 = [];
        for (var key in o) {
          if (has.call(o, key)) {
            ret2.push(key);
          }
        }
        return ret2;
      };
      ObjectGetDescriptor = function(o, key) {
        return { value: o[key] };
      };
      ObjectDefineProperty = function(o, key, desc) {
        o[key] = desc.value;
        return o;
      };
      ObjectFreeze = function(obj2) {
        return obj2;
      };
      ObjectGetPrototypeOf = function(obj2) {
        try {
          return Object(obj2).constructor.prototype;
        } catch (e) {
          return proto;
        }
      };
      ArrayIsArray = function(obj2) {
        try {
          return str.call(obj2) === "[object Array]";
        } catch (e) {
          return false;
        }
      };
      module2.exports = {
        isArray: ArrayIsArray,
        keys: ObjectKeys,
        names: ObjectKeys,
        defineProperty: ObjectDefineProperty,
        getDescriptor: ObjectGetDescriptor,
        freeze: ObjectFreeze,
        getPrototypeOf: ObjectGetPrototypeOf,
        isES5,
        propertyIsWritable: function() {
          return true;
        }
      };
    }
    var has;
    var str;
    var proto;
    var ObjectKeys;
    var ObjectGetDescriptor;
    var ObjectDefineProperty;
    var ObjectFreeze;
    var ObjectGetPrototypeOf;
    var ArrayIsArray;
  }
});

// netlify/functions/node_modules/bluebird/js/release/util.js
var require_util = __commonJS({
  "netlify/functions/node_modules/bluebird/js/release/util.js"(exports, module) {
    "use strict";
    var es5 = require_es5();
    var canEvaluate = typeof navigator == "undefined";
    var errorObj = { e: {} };
    var tryCatchTarget;
    var globalObject = typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : exports !== void 0 ? exports : null;
    function tryCatcher() {
      try {
        var target = tryCatchTarget;
        tryCatchTarget = null;
        return target.apply(this, arguments);
      } catch (e) {
        errorObj.e = e;
        return errorObj;
      }
    }
    function tryCatch(fn) {
      tryCatchTarget = fn;
      return tryCatcher;
    }
    var inherits = function(Child, Parent) {
      var hasProp = {}.hasOwnProperty;
      function T() {
        this.constructor = Child;
        this.constructor$ = Parent;
        for (var propertyName in Parent.prototype) {
          if (hasProp.call(Parent.prototype, propertyName) && propertyName.charAt(propertyName.length - 1) !== "$") {
            this[propertyName + "$"] = Parent.prototype[propertyName];
          }
        }
      }
      T.prototype = Parent.prototype;
      Child.prototype = new T();
      return Child.prototype;
    };
    function isPrimitive(val) {
      return val == null || val === true || val === false || typeof val === "string" || typeof val === "number";
    }
    function isObject(value) {
      return typeof value === "function" || typeof value === "object" && value !== null;
    }
    function maybeWrapAsError(maybeError) {
      if (!isPrimitive(maybeError))
        return maybeError;
      return new Error(safeToString(maybeError));
    }
    function withAppended(target, appendee) {
      var len = target.length;
      var ret2 = new Array(len + 1);
      var i;
      for (i = 0; i < len; ++i) {
        ret2[i] = target[i];
      }
      ret2[i] = appendee;
      return ret2;
    }
    function getDataPropertyOrDefault(obj2, key, defaultValue) {
      if (es5.isES5) {
        var desc = Object.getOwnPropertyDescriptor(obj2, key);
        if (desc != null) {
          return desc.get == null && desc.set == null ? desc.value : defaultValue;
        }
      } else {
        return {}.hasOwnProperty.call(obj2, key) ? obj2[key] : void 0;
      }
    }
    function notEnumerableProp(obj2, name, value) {
      if (isPrimitive(obj2))
        return obj2;
      var descriptor = {
        value,
        configurable: true,
        enumerable: false,
        writable: true
      };
      es5.defineProperty(obj2, name, descriptor);
      return obj2;
    }
    function thrower(r) {
      throw r;
    }
    var inheritedDataKeys = function() {
      var excludedPrototypes = [
        Array.prototype,
        Object.prototype,
        Function.prototype
      ];
      var isExcludedProto = function(val) {
        for (var i = 0; i < excludedPrototypes.length; ++i) {
          if (excludedPrototypes[i] === val) {
            return true;
          }
        }
        return false;
      };
      if (es5.isES5) {
        var getKeys = Object.getOwnPropertyNames;
        return function(obj2) {
          var ret2 = [];
          var visitedKeys = /* @__PURE__ */ Object.create(null);
          while (obj2 != null && !isExcludedProto(obj2)) {
            var keys;
            try {
              keys = getKeys(obj2);
            } catch (e) {
              return ret2;
            }
            for (var i = 0; i < keys.length; ++i) {
              var key = keys[i];
              if (visitedKeys[key])
                continue;
              visitedKeys[key] = true;
              var desc = Object.getOwnPropertyDescriptor(obj2, key);
              if (desc != null && desc.get == null && desc.set == null) {
                ret2.push(key);
              }
            }
            obj2 = es5.getPrototypeOf(obj2);
          }
          return ret2;
        };
      } else {
        var hasProp = {}.hasOwnProperty;
        return function(obj2) {
          if (isExcludedProto(obj2))
            return [];
          var ret2 = [];
          enumeration:
            for (var key in obj2) {
              if (hasProp.call(obj2, key)) {
                ret2.push(key);
              } else {
                for (var i = 0; i < excludedPrototypes.length; ++i) {
                  if (hasProp.call(excludedPrototypes[i], key)) {
                    continue enumeration;
                  }
                }
                ret2.push(key);
              }
            }
          return ret2;
        };
      }
    }();
    var thisAssignmentPattern = /this\s*\.\s*\S+\s*=/;
    function isClass(fn) {
      try {
        if (typeof fn === "function") {
          var keys = es5.names(fn.prototype);
          var hasMethods = es5.isES5 && keys.length > 1;
          var hasMethodsOtherThanConstructor = keys.length > 0 && !(keys.length === 1 && keys[0] === "constructor");
          var hasThisAssignmentAndStaticMethods = thisAssignmentPattern.test(fn + "") && es5.names(fn).length > 0;
          if (hasMethods || hasMethodsOtherThanConstructor || hasThisAssignmentAndStaticMethods) {
            return true;
          }
        }
        return false;
      } catch (e) {
        return false;
      }
    }
    function toFastProperties(obj) {
      function FakeConstructor() {
      }
      FakeConstructor.prototype = obj;
      var receiver = new FakeConstructor();
      function ic() {
        return typeof receiver.foo;
      }
      ic();
      ic();
      return obj;
      eval(obj);
    }
    var rident = /^[a-z$_][a-z$_0-9]*$/i;
    function isIdentifier(str) {
      return rident.test(str);
    }
    function filledRange(count, prefix, suffix) {
      var ret2 = new Array(count);
      for (var i = 0; i < count; ++i) {
        ret2[i] = prefix + i + suffix;
      }
      return ret2;
    }
    function safeToString(obj2) {
      try {
        return obj2 + "";
      } catch (e) {
        return "[no string representation]";
      }
    }
    function isError(obj2) {
      return obj2 instanceof Error || obj2 !== null && typeof obj2 === "object" && typeof obj2.message === "string" && typeof obj2.name === "string";
    }
    function markAsOriginatingFromRejection(e) {
      try {
        notEnumerableProp(e, "isOperational", true);
      } catch (ignore) {
      }
    }
    function originatesFromRejection(e) {
      if (e == null)
        return false;
      return e instanceof Error["__BluebirdErrorTypes__"].OperationalError || e["isOperational"] === true;
    }
    function canAttachTrace(obj2) {
      return isError(obj2) && es5.propertyIsWritable(obj2, "stack");
    }
    var ensureErrorObject = function() {
      if (!("stack" in new Error())) {
        return function(value) {
          if (canAttachTrace(value))
            return value;
          try {
            throw new Error(safeToString(value));
          } catch (err) {
            return err;
          }
        };
      } else {
        return function(value) {
          if (canAttachTrace(value))
            return value;
          return new Error(safeToString(value));
        };
      }
    }();
    function classString(obj2) {
      return {}.toString.call(obj2);
    }
    function copyDescriptors(from, to, filter) {
      var keys = es5.names(from);
      for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        if (filter(key)) {
          try {
            es5.defineProperty(to, key, es5.getDescriptor(from, key));
          } catch (ignore) {
          }
        }
      }
    }
    var asArray = function(v) {
      if (es5.isArray(v)) {
        return v;
      }
      return null;
    };
    if (typeof Symbol !== "undefined" && Symbol.iterator) {
      ArrayFrom = typeof Array.from === "function" ? function(v) {
        return Array.from(v);
      } : function(v) {
        var ret2 = [];
        var it = v[Symbol.iterator]();
        var itResult;
        while (!(itResult = it.next()).done) {
          ret2.push(itResult.value);
        }
        return ret2;
      };
      asArray = function(v) {
        if (es5.isArray(v)) {
          return v;
        } else if (v != null && typeof v[Symbol.iterator] === "function") {
          return ArrayFrom(v);
        }
        return null;
      };
    }
    var ArrayFrom;
    var isNode = typeof process !== "undefined" && classString(process).toLowerCase() === "[object process]";
    var hasEnvVariables = typeof process !== "undefined" && typeof process.env !== "undefined";
    function env(key) {
      return hasEnvVariables ? process.env[key] : void 0;
    }
    function getNativePromise() {
      if (typeof Promise === "function") {
        try {
          var promise = new Promise(function() {
          });
          if (classString(promise) === "[object Promise]") {
            return Promise;
          }
        } catch (e) {
        }
      }
    }
    var reflectHandler;
    function contextBind(ctx, cb) {
      if (ctx === null || typeof cb !== "function" || cb === reflectHandler) {
        return cb;
      }
      if (ctx.domain !== null) {
        cb = ctx.domain.bind(cb);
      }
      var async = ctx.async;
      if (async !== null) {
        var old = cb;
        cb = function() {
          var $_len = arguments.length + 2;
          var args = new Array($_len);
          for (var $_i = 2; $_i < $_len; ++$_i) {
            args[$_i] = arguments[$_i - 2];
          }
          ;
          args[0] = old;
          args[1] = this;
          return async.runInAsyncScope.apply(async, args);
        };
      }
      return cb;
    }
    var ret = {
      setReflectHandler: function(fn) {
        reflectHandler = fn;
      },
      isClass,
      isIdentifier,
      inheritedDataKeys,
      getDataPropertyOrDefault,
      thrower,
      isArray: es5.isArray,
      asArray,
      notEnumerableProp,
      isPrimitive,
      isObject,
      isError,
      canEvaluate,
      errorObj,
      tryCatch,
      inherits,
      withAppended,
      maybeWrapAsError,
      toFastProperties,
      filledRange,
      toString: safeToString,
      canAttachTrace,
      ensureErrorObject,
      originatesFromRejection,
      markAsOriginatingFromRejection,
      classString,
      copyDescriptors,
      isNode,
      hasEnvVariables,
      env,
      global: globalObject,
      getNativePromise,
      contextBind
    };
    ret.isRecentNode = ret.isNode && function() {
      var version;
      if (process.versions && process.versions.node) {
        version = process.versions.node.split(".").map(Number);
      } else if (process.version) {
        version = process.version.split(".").map(Number);
      }
      return version[0] === 0 && version[1] > 10 || version[0] > 0;
    }();
    ret.nodeSupportsAsyncResource = ret.isNode && function() {
      var supportsAsync = false;
      try {
        var res = require("async_hooks").AsyncResource;
        supportsAsync = typeof res.prototype.runInAsyncScope === "function";
      } catch (e) {
        supportsAsync = false;
      }
      return supportsAsync;
    }();
    if (ret.isNode)
      ret.toFastProperties(process);
    try {
      throw new Error();
    } catch (e) {
      ret.lastLineError = e;
    }
    module.exports = ret;
  }
});

// netlify/functions/node_modules/bluebird/js/release/schedule.js
var require_schedule = __commonJS({
  "netlify/functions/node_modules/bluebird/js/release/schedule.js"(exports2, module2) {
    "use strict";
    var util = require_util();
    var schedule;
    var noAsyncScheduler = function() {
      throw new Error("No async scheduler available\n\n    See http://goo.gl/MqrFmX\n");
    };
    var NativePromise = util.getNativePromise();
    if (util.isNode && typeof MutationObserver === "undefined") {
      GlobalSetImmediate = global.setImmediate;
      ProcessNextTick = process.nextTick;
      schedule = util.isRecentNode ? function(fn) {
        GlobalSetImmediate.call(global, fn);
      } : function(fn) {
        ProcessNextTick.call(process, fn);
      };
    } else if (typeof NativePromise === "function" && typeof NativePromise.resolve === "function") {
      nativePromise = NativePromise.resolve();
      schedule = function(fn) {
        nativePromise.then(fn);
      };
    } else if (typeof MutationObserver !== "undefined" && !(typeof window !== "undefined" && window.navigator && (window.navigator.standalone || window.cordova)) && "classList" in document.documentElement) {
      schedule = function() {
        var div = document.createElement("div");
        var opts = { attributes: true };
        var toggleScheduled = false;
        var div2 = document.createElement("div");
        var o2 = new MutationObserver(function() {
          div.classList.toggle("foo");
          toggleScheduled = false;
        });
        o2.observe(div2, opts);
        var scheduleToggle = function() {
          if (toggleScheduled)
            return;
          toggleScheduled = true;
          div2.classList.toggle("foo");
        };
        return function schedule2(fn) {
          var o = new MutationObserver(function() {
            o.disconnect();
            fn();
          });
          o.observe(div, opts);
          scheduleToggle();
        };
      }();
    } else if (typeof setImmediate !== "undefined") {
      schedule = function(fn) {
        setImmediate(fn);
      };
    } else if (typeof setTimeout !== "undefined") {
      schedule = function(fn) {
        setTimeout(fn, 0);
      };
    } else {
      schedule = noAsyncScheduler;
    }
    var GlobalSetImmediate;
    var ProcessNextTick;
    var nativePromise;
    module2.exports = schedule;
  }
});

// netlify/functions/node_modules/bluebird/js/release/queue.js
var require_queue = __commonJS({
  "netlify/functions/node_modules/bluebird/js/release/queue.js"(exports2, module2) {
    "use strict";
    function arrayMove(src, srcIndex, dst, dstIndex, len) {
      for (var j = 0; j < len; ++j) {
        dst[j + dstIndex] = src[j + srcIndex];
        src[j + srcIndex] = void 0;
      }
    }
    function Queue(capacity) {
      this._capacity = capacity;
      this._length = 0;
      this._front = 0;
    }
    Queue.prototype._willBeOverCapacity = function(size) {
      return this._capacity < size;
    };
    Queue.prototype._pushOne = function(arg) {
      var length = this.length();
      this._checkCapacity(length + 1);
      var i = this._front + length & this._capacity - 1;
      this[i] = arg;
      this._length = length + 1;
    };
    Queue.prototype.push = function(fn, receiver2, arg) {
      var length = this.length() + 3;
      if (this._willBeOverCapacity(length)) {
        this._pushOne(fn);
        this._pushOne(receiver2);
        this._pushOne(arg);
        return;
      }
      var j = this._front + length - 3;
      this._checkCapacity(length);
      var wrapMask = this._capacity - 1;
      this[j + 0 & wrapMask] = fn;
      this[j + 1 & wrapMask] = receiver2;
      this[j + 2 & wrapMask] = arg;
      this._length = length;
    };
    Queue.prototype.shift = function() {
      var front = this._front, ret2 = this[front];
      this[front] = void 0;
      this._front = front + 1 & this._capacity - 1;
      this._length--;
      return ret2;
    };
    Queue.prototype.length = function() {
      return this._length;
    };
    Queue.prototype._checkCapacity = function(size) {
      if (this._capacity < size) {
        this._resizeTo(this._capacity << 1);
      }
    };
    Queue.prototype._resizeTo = function(capacity) {
      var oldCapacity = this._capacity;
      this._capacity = capacity;
      var front = this._front;
      var length = this._length;
      var moveItemsCount = front + length & oldCapacity - 1;
      arrayMove(this, 0, this, oldCapacity, moveItemsCount);
    };
    module2.exports = Queue;
  }
});

// netlify/functions/node_modules/bluebird/js/release/async.js
var require_async = __commonJS({
  "netlify/functions/node_modules/bluebird/js/release/async.js"(exports2, module2) {
    "use strict";
    var firstLineError;
    try {
      throw new Error();
    } catch (e) {
      firstLineError = e;
    }
    var schedule = require_schedule();
    var Queue = require_queue();
    function Async() {
      this._customScheduler = false;
      this._isTickUsed = false;
      this._lateQueue = new Queue(16);
      this._normalQueue = new Queue(16);
      this._haveDrainedQueues = false;
      var self2 = this;
      this.drainQueues = function() {
        self2._drainQueues();
      };
      this._schedule = schedule;
    }
    Async.prototype.setScheduler = function(fn) {
      var prev = this._schedule;
      this._schedule = fn;
      this._customScheduler = true;
      return prev;
    };
    Async.prototype.hasCustomScheduler = function() {
      return this._customScheduler;
    };
    Async.prototype.haveItemsQueued = function() {
      return this._isTickUsed || this._haveDrainedQueues;
    };
    Async.prototype.fatalError = function(e, isNode2) {
      if (isNode2) {
        process.stderr.write("Fatal " + (e instanceof Error ? e.stack : e) + "\n");
        process.exit(2);
      } else {
        this.throwLater(e);
      }
    };
    Async.prototype.throwLater = function(fn, arg) {
      if (arguments.length === 1) {
        arg = fn;
        fn = function() {
          throw arg;
        };
      }
      if (typeof setTimeout !== "undefined") {
        setTimeout(function() {
          fn(arg);
        }, 0);
      } else
        try {
          this._schedule(function() {
            fn(arg);
          });
        } catch (e) {
          throw new Error("No async scheduler available\n\n    See http://goo.gl/MqrFmX\n");
        }
    };
    function AsyncInvokeLater(fn, receiver2, arg) {
      this._lateQueue.push(fn, receiver2, arg);
      this._queueTick();
    }
    function AsyncInvoke(fn, receiver2, arg) {
      this._normalQueue.push(fn, receiver2, arg);
      this._queueTick();
    }
    function AsyncSettlePromises(promise) {
      this._normalQueue._pushOne(promise);
      this._queueTick();
    }
    Async.prototype.invokeLater = AsyncInvokeLater;
    Async.prototype.invoke = AsyncInvoke;
    Async.prototype.settlePromises = AsyncSettlePromises;
    function _drainQueue(queue) {
      while (queue.length() > 0) {
        _drainQueueStep(queue);
      }
    }
    function _drainQueueStep(queue) {
      var fn = queue.shift();
      if (typeof fn !== "function") {
        fn._settlePromises();
      } else {
        var receiver2 = queue.shift();
        var arg = queue.shift();
        fn.call(receiver2, arg);
      }
    }
    Async.prototype._drainQueues = function() {
      _drainQueue(this._normalQueue);
      this._reset();
      this._haveDrainedQueues = true;
      _drainQueue(this._lateQueue);
    };
    Async.prototype._queueTick = function() {
      if (!this._isTickUsed) {
        this._isTickUsed = true;
        this._schedule(this.drainQueues);
      }
    };
    Async.prototype._reset = function() {
      this._isTickUsed = false;
    };
    module2.exports = Async;
    module2.exports.firstLineError = firstLineError;
  }
});

// netlify/functions/node_modules/bluebird/js/release/errors.js
var require_errors = __commonJS({
  "netlify/functions/node_modules/bluebird/js/release/errors.js"(exports2, module2) {
    "use strict";
    var es52 = require_es5();
    var Objectfreeze = es52.freeze;
    var util = require_util();
    var inherits2 = util.inherits;
    var notEnumerableProp2 = util.notEnumerableProp;
    function subError(nameProperty, defaultMessage) {
      function SubError(message) {
        if (!(this instanceof SubError))
          return new SubError(message);
        notEnumerableProp2(this, "message", typeof message === "string" ? message : defaultMessage);
        notEnumerableProp2(this, "name", nameProperty);
        if (Error.captureStackTrace) {
          Error.captureStackTrace(this, this.constructor);
        } else {
          Error.call(this);
        }
      }
      inherits2(SubError, Error);
      return SubError;
    }
    var _TypeError;
    var _RangeError;
    var Warning = subError("Warning", "warning");
    var CancellationError = subError("CancellationError", "cancellation error");
    var TimeoutError = subError("TimeoutError", "timeout error");
    var AggregateError2 = subError("AggregateError", "aggregate error");
    try {
      _TypeError = TypeError;
      _RangeError = RangeError;
    } catch (e) {
      _TypeError = subError("TypeError", "type error");
      _RangeError = subError("RangeError", "range error");
    }
    var methods = "join pop push shift unshift slice filter forEach some every map indexOf lastIndexOf reduce reduceRight sort reverse".split(" ");
    for (i = 0; i < methods.length; ++i) {
      if (typeof Array.prototype[methods[i]] === "function") {
        AggregateError2.prototype[methods[i]] = Array.prototype[methods[i]];
      }
    }
    var i;
    es52.defineProperty(AggregateError2.prototype, "length", {
      value: 0,
      configurable: false,
      writable: true,
      enumerable: true
    });
    AggregateError2.prototype["isOperational"] = true;
    var level = 0;
    AggregateError2.prototype.toString = function() {
      var indent = Array(level * 4 + 1).join(" ");
      var ret2 = "\n" + indent + "AggregateError of:\n";
      level++;
      indent = Array(level * 4 + 1).join(" ");
      for (var i2 = 0; i2 < this.length; ++i2) {
        var str = this[i2] === this ? "[Circular AggregateError]" : this[i2] + "";
        var lines = str.split("\n");
        for (var j = 0; j < lines.length; ++j) {
          lines[j] = indent + lines[j];
        }
        str = lines.join("\n");
        ret2 += str + "\n";
      }
      level--;
      return ret2;
    };
    function OperationalError(message) {
      if (!(this instanceof OperationalError))
        return new OperationalError(message);
      notEnumerableProp2(this, "name", "OperationalError");
      notEnumerableProp2(this, "message", message);
      this.cause = message;
      this["isOperational"] = true;
      if (message instanceof Error) {
        notEnumerableProp2(this, "message", message.message);
        notEnumerableProp2(this, "stack", message.stack);
      } else if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      }
    }
    inherits2(OperationalError, Error);
    var errorTypes = Error["__BluebirdErrorTypes__"];
    if (!errorTypes) {
      errorTypes = Objectfreeze({
        CancellationError,
        TimeoutError,
        OperationalError,
        RejectionError: OperationalError,
        AggregateError: AggregateError2
      });
      es52.defineProperty(Error, "__BluebirdErrorTypes__", {
        value: errorTypes,
        writable: false,
        enumerable: false,
        configurable: false
      });
    }
    module2.exports = {
      Error,
      TypeError: _TypeError,
      RangeError: _RangeError,
      CancellationError: errorTypes.CancellationError,
      OperationalError: errorTypes.OperationalError,
      TimeoutError: errorTypes.TimeoutError,
      AggregateError: errorTypes.AggregateError,
      Warning
    };
  }
});

// netlify/functions/node_modules/bluebird/js/release/thenables.js
var require_thenables = __commonJS({
  "netlify/functions/node_modules/bluebird/js/release/thenables.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, INTERNAL) {
      var util = require_util();
      var errorObj2 = util.errorObj;
      var isObject2 = util.isObject;
      function tryConvertToPromise(obj2, context) {
        if (isObject2(obj2)) {
          if (obj2 instanceof Promise2)
            return obj2;
          var then = getThen(obj2);
          if (then === errorObj2) {
            if (context)
              context._pushContext();
            var ret2 = Promise2.reject(then.e);
            if (context)
              context._popContext();
            return ret2;
          } else if (typeof then === "function") {
            if (isAnyBluebirdPromise(obj2)) {
              var ret2 = new Promise2(INTERNAL);
              obj2._then(ret2._fulfill, ret2._reject, void 0, ret2, null);
              return ret2;
            }
            return doThenable(obj2, then, context);
          }
        }
        return obj2;
      }
      function doGetThen(obj2) {
        return obj2.then;
      }
      function getThen(obj2) {
        try {
          return doGetThen(obj2);
        } catch (e) {
          errorObj2.e = e;
          return errorObj2;
        }
      }
      var hasProp = {}.hasOwnProperty;
      function isAnyBluebirdPromise(obj2) {
        try {
          return hasProp.call(obj2, "_promise0");
        } catch (e) {
          return false;
        }
      }
      function doThenable(x, then, context) {
        var promise = new Promise2(INTERNAL);
        var ret2 = promise;
        if (context)
          context._pushContext();
        promise._captureStackTrace();
        if (context)
          context._popContext();
        var synchronous = true;
        var result = util.tryCatch(then).call(x, resolve, reject);
        synchronous = false;
        if (promise && result === errorObj2) {
          promise._rejectCallback(result.e, true, true);
          promise = null;
        }
        function resolve(value) {
          if (!promise)
            return;
          promise._resolveCallback(value);
          promise = null;
        }
        function reject(reason) {
          if (!promise)
            return;
          promise._rejectCallback(reason, synchronous, true);
          promise = null;
        }
        return ret2;
      }
      return tryConvertToPromise;
    };
  }
});

// netlify/functions/node_modules/bluebird/js/release/promise_array.js
var require_promise_array = __commonJS({
  "netlify/functions/node_modules/bluebird/js/release/promise_array.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, INTERNAL, tryConvertToPromise, apiRejection, Proxyable) {
      var util = require_util();
      var isArray = util.isArray;
      function toResolutionValue(val) {
        switch (val) {
          case -2:
            return [];
          case -3:
            return {};
          case -6:
            return /* @__PURE__ */ new Map();
        }
      }
      function PromiseArray(values) {
        var promise = this._promise = new Promise2(INTERNAL);
        if (values instanceof Promise2) {
          promise._propagateFrom(values, 3);
          values.suppressUnhandledRejections();
        }
        promise._setOnCancel(this);
        this._values = values;
        this._length = 0;
        this._totalResolved = 0;
        this._init(void 0, -2);
      }
      util.inherits(PromiseArray, Proxyable);
      PromiseArray.prototype.length = function() {
        return this._length;
      };
      PromiseArray.prototype.promise = function() {
        return this._promise;
      };
      PromiseArray.prototype._init = function init(_, resolveValueIfEmpty) {
        var values = tryConvertToPromise(this._values, this._promise);
        if (values instanceof Promise2) {
          values = values._target();
          var bitField = values._bitField;
          ;
          this._values = values;
          if ((bitField & 50397184) === 0) {
            this._promise._setAsyncGuaranteed();
            return values._then(init, this._reject, void 0, this, resolveValueIfEmpty);
          } else if ((bitField & 33554432) !== 0) {
            values = values._value();
          } else if ((bitField & 16777216) !== 0) {
            return this._reject(values._reason());
          } else {
            return this._cancel();
          }
        }
        values = util.asArray(values);
        if (values === null) {
          var err = apiRejection("expecting an array or an iterable object but got " + util.classString(values)).reason();
          this._promise._rejectCallback(err, false);
          return;
        }
        if (values.length === 0) {
          if (resolveValueIfEmpty === -5) {
            this._resolveEmptyArray();
          } else {
            this._resolve(toResolutionValue(resolveValueIfEmpty));
          }
          return;
        }
        this._iterate(values);
      };
      PromiseArray.prototype._iterate = function(values) {
        var len = this.getActualLength(values.length);
        this._length = len;
        this._values = this.shouldCopyValues() ? new Array(len) : this._values;
        var result = this._promise;
        var isResolved = false;
        var bitField = null;
        for (var i = 0; i < len; ++i) {
          var maybePromise = tryConvertToPromise(values[i], result);
          if (maybePromise instanceof Promise2) {
            maybePromise = maybePromise._target();
            bitField = maybePromise._bitField;
          } else {
            bitField = null;
          }
          if (isResolved) {
            if (bitField !== null) {
              maybePromise.suppressUnhandledRejections();
            }
          } else if (bitField !== null) {
            if ((bitField & 50397184) === 0) {
              maybePromise._proxy(this, i);
              this._values[i] = maybePromise;
            } else if ((bitField & 33554432) !== 0) {
              isResolved = this._promiseFulfilled(maybePromise._value(), i);
            } else if ((bitField & 16777216) !== 0) {
              isResolved = this._promiseRejected(maybePromise._reason(), i);
            } else {
              isResolved = this._promiseCancelled(i);
            }
          } else {
            isResolved = this._promiseFulfilled(maybePromise, i);
          }
        }
        if (!isResolved)
          result._setAsyncGuaranteed();
      };
      PromiseArray.prototype._isResolved = function() {
        return this._values === null;
      };
      PromiseArray.prototype._resolve = function(value) {
        this._values = null;
        this._promise._fulfill(value);
      };
      PromiseArray.prototype._cancel = function() {
        if (this._isResolved() || !this._promise._isCancellable())
          return;
        this._values = null;
        this._promise._cancel();
      };
      PromiseArray.prototype._reject = function(reason) {
        this._values = null;
        this._promise._rejectCallback(reason, false);
      };
      PromiseArray.prototype._promiseFulfilled = function(value, index) {
        this._values[index] = value;
        var totalResolved = ++this._totalResolved;
        if (totalResolved >= this._length) {
          this._resolve(this._values);
          return true;
        }
        return false;
      };
      PromiseArray.prototype._promiseCancelled = function() {
        this._cancel();
        return true;
      };
      PromiseArray.prototype._promiseRejected = function(reason) {
        this._totalResolved++;
        this._reject(reason);
        return true;
      };
      PromiseArray.prototype._resultCancelled = function() {
        if (this._isResolved())
          return;
        var values = this._values;
        this._cancel();
        if (values instanceof Promise2) {
          values.cancel();
        } else {
          for (var i = 0; i < values.length; ++i) {
            if (values[i] instanceof Promise2) {
              values[i].cancel();
            }
          }
        }
      };
      PromiseArray.prototype.shouldCopyValues = function() {
        return true;
      };
      PromiseArray.prototype.getActualLength = function(len) {
        return len;
      };
      return PromiseArray;
    };
  }
});

// netlify/functions/node_modules/bluebird/js/release/context.js
var require_context = __commonJS({
  "netlify/functions/node_modules/bluebird/js/release/context.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2) {
      var longStackTraces = false;
      var contextStack = [];
      Promise2.prototype._promiseCreated = function() {
      };
      Promise2.prototype._pushContext = function() {
      };
      Promise2.prototype._popContext = function() {
        return null;
      };
      Promise2._peekContext = Promise2.prototype._peekContext = function() {
      };
      function Context() {
        this._trace = new Context.CapturedTrace(peekContext());
      }
      Context.prototype._pushContext = function() {
        if (this._trace !== void 0) {
          this._trace._promiseCreated = null;
          contextStack.push(this._trace);
        }
      };
      Context.prototype._popContext = function() {
        if (this._trace !== void 0) {
          var trace = contextStack.pop();
          var ret2 = trace._promiseCreated;
          trace._promiseCreated = null;
          return ret2;
        }
        return null;
      };
      function createContext() {
        if (longStackTraces)
          return new Context();
      }
      function peekContext() {
        var lastIndex = contextStack.length - 1;
        if (lastIndex >= 0) {
          return contextStack[lastIndex];
        }
        return void 0;
      }
      Context.CapturedTrace = null;
      Context.create = createContext;
      Context.deactivateLongStackTraces = function() {
      };
      Context.activateLongStackTraces = function() {
        var Promise_pushContext = Promise2.prototype._pushContext;
        var Promise_popContext = Promise2.prototype._popContext;
        var Promise_PeekContext = Promise2._peekContext;
        var Promise_peekContext = Promise2.prototype._peekContext;
        var Promise_promiseCreated = Promise2.prototype._promiseCreated;
        Context.deactivateLongStackTraces = function() {
          Promise2.prototype._pushContext = Promise_pushContext;
          Promise2.prototype._popContext = Promise_popContext;
          Promise2._peekContext = Promise_PeekContext;
          Promise2.prototype._peekContext = Promise_peekContext;
          Promise2.prototype._promiseCreated = Promise_promiseCreated;
          longStackTraces = false;
        };
        longStackTraces = true;
        Promise2.prototype._pushContext = Context.prototype._pushContext;
        Promise2.prototype._popContext = Context.prototype._popContext;
        Promise2._peekContext = Promise2.prototype._peekContext = peekContext;
        Promise2.prototype._promiseCreated = function() {
          var ctx = this._peekContext();
          if (ctx && ctx._promiseCreated == null)
            ctx._promiseCreated = this;
        };
      };
      return Context;
    };
  }
});

// netlify/functions/node_modules/bluebird/js/release/debuggability.js
var require_debuggability = __commonJS({
  "netlify/functions/node_modules/bluebird/js/release/debuggability.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, Context, enableAsyncHooks, disableAsyncHooks) {
      var async = Promise2._async;
      var Warning = require_errors().Warning;
      var util = require_util();
      var es52 = require_es5();
      var canAttachTrace2 = util.canAttachTrace;
      var unhandledRejectionHandled;
      var possiblyUnhandledRejection;
      var bluebirdFramePattern = /[\\\/]bluebird[\\\/]js[\\\/](release|debug|instrumented)/;
      var nodeFramePattern = /\((?:timers\.js):\d+:\d+\)/;
      var parseLinePattern = /[\/<\(](.+?):(\d+):(\d+)\)?\s*$/;
      var stackFramePattern = null;
      var formatStack = null;
      var indentStackFrames = false;
      var printWarning;
      var debugging = !!(util.env("BLUEBIRD_DEBUG") != 0 && (util.env("BLUEBIRD_DEBUG") || util.env("NODE_ENV") === "development"));
      var warnings = !!(util.env("BLUEBIRD_WARNINGS") != 0 && (debugging || util.env("BLUEBIRD_WARNINGS")));
      var longStackTraces = !!(util.env("BLUEBIRD_LONG_STACK_TRACES") != 0 && (debugging || util.env("BLUEBIRD_LONG_STACK_TRACES")));
      var wForgottenReturn = util.env("BLUEBIRD_W_FORGOTTEN_RETURN") != 0 && (warnings || !!util.env("BLUEBIRD_W_FORGOTTEN_RETURN"));
      var deferUnhandledRejectionCheck;
      (function() {
        var promises = [];
        function unhandledRejectionCheck() {
          for (var i = 0; i < promises.length; ++i) {
            promises[i]._notifyUnhandledRejection();
          }
          unhandledRejectionClear();
        }
        function unhandledRejectionClear() {
          promises.length = 0;
        }
        deferUnhandledRejectionCheck = function(promise) {
          promises.push(promise);
          setTimeout(unhandledRejectionCheck, 1);
        };
        es52.defineProperty(Promise2, "_unhandledRejectionCheck", {
          value: unhandledRejectionCheck
        });
        es52.defineProperty(Promise2, "_unhandledRejectionClear", {
          value: unhandledRejectionClear
        });
      })();
      Promise2.prototype.suppressUnhandledRejections = function() {
        var target = this._target();
        target._bitField = target._bitField & ~1048576 | 524288;
      };
      Promise2.prototype._ensurePossibleRejectionHandled = function() {
        if ((this._bitField & 524288) !== 0)
          return;
        this._setRejectionIsUnhandled();
        deferUnhandledRejectionCheck(this);
      };
      Promise2.prototype._notifyUnhandledRejectionIsHandled = function() {
        fireRejectionEvent("rejectionHandled", unhandledRejectionHandled, void 0, this);
      };
      Promise2.prototype._setReturnedNonUndefined = function() {
        this._bitField = this._bitField | 268435456;
      };
      Promise2.prototype._returnedNonUndefined = function() {
        return (this._bitField & 268435456) !== 0;
      };
      Promise2.prototype._notifyUnhandledRejection = function() {
        if (this._isRejectionUnhandled()) {
          var reason = this._settledValue();
          this._setUnhandledRejectionIsNotified();
          fireRejectionEvent("unhandledRejection", possiblyUnhandledRejection, reason, this);
        }
      };
      Promise2.prototype._setUnhandledRejectionIsNotified = function() {
        this._bitField = this._bitField | 262144;
      };
      Promise2.prototype._unsetUnhandledRejectionIsNotified = function() {
        this._bitField = this._bitField & ~262144;
      };
      Promise2.prototype._isUnhandledRejectionNotified = function() {
        return (this._bitField & 262144) > 0;
      };
      Promise2.prototype._setRejectionIsUnhandled = function() {
        this._bitField = this._bitField | 1048576;
      };
      Promise2.prototype._unsetRejectionIsUnhandled = function() {
        this._bitField = this._bitField & ~1048576;
        if (this._isUnhandledRejectionNotified()) {
          this._unsetUnhandledRejectionIsNotified();
          this._notifyUnhandledRejectionIsHandled();
        }
      };
      Promise2.prototype._isRejectionUnhandled = function() {
        return (this._bitField & 1048576) > 0;
      };
      Promise2.prototype._warn = function(message, shouldUseOwnTrace, promise) {
        return warn(message, shouldUseOwnTrace, promise || this);
      };
      Promise2.onPossiblyUnhandledRejection = function(fn) {
        var context = Promise2._getContext();
        possiblyUnhandledRejection = util.contextBind(context, fn);
      };
      Promise2.onUnhandledRejectionHandled = function(fn) {
        var context = Promise2._getContext();
        unhandledRejectionHandled = util.contextBind(context, fn);
      };
      var disableLongStackTraces = function() {
      };
      Promise2.longStackTraces = function() {
        if (async.haveItemsQueued() && !config2.longStackTraces) {
          throw new Error("cannot enable long stack traces after promises have been created\n\n    See http://goo.gl/MqrFmX\n");
        }
        if (!config2.longStackTraces && longStackTracesIsSupported()) {
          var Promise_captureStackTrace = Promise2.prototype._captureStackTrace;
          var Promise_attachExtraTrace = Promise2.prototype._attachExtraTrace;
          var Promise_dereferenceTrace = Promise2.prototype._dereferenceTrace;
          config2.longStackTraces = true;
          disableLongStackTraces = function() {
            if (async.haveItemsQueued() && !config2.longStackTraces) {
              throw new Error("cannot enable long stack traces after promises have been created\n\n    See http://goo.gl/MqrFmX\n");
            }
            Promise2.prototype._captureStackTrace = Promise_captureStackTrace;
            Promise2.prototype._attachExtraTrace = Promise_attachExtraTrace;
            Promise2.prototype._dereferenceTrace = Promise_dereferenceTrace;
            Context.deactivateLongStackTraces();
            config2.longStackTraces = false;
          };
          Promise2.prototype._captureStackTrace = longStackTracesCaptureStackTrace;
          Promise2.prototype._attachExtraTrace = longStackTracesAttachExtraTrace;
          Promise2.prototype._dereferenceTrace = longStackTracesDereferenceTrace;
          Context.activateLongStackTraces();
        }
      };
      Promise2.hasLongStackTraces = function() {
        return config2.longStackTraces && longStackTracesIsSupported();
      };
      var legacyHandlers = {
        unhandledrejection: {
          before: function() {
            var ret2 = util.global.onunhandledrejection;
            util.global.onunhandledrejection = null;
            return ret2;
          },
          after: function(fn) {
            util.global.onunhandledrejection = fn;
          }
        },
        rejectionhandled: {
          before: function() {
            var ret2 = util.global.onrejectionhandled;
            util.global.onrejectionhandled = null;
            return ret2;
          },
          after: function(fn) {
            util.global.onrejectionhandled = fn;
          }
        }
      };
      var fireDomEvent = function() {
        var dispatch = function(legacy, e) {
          if (legacy) {
            var fn;
            try {
              fn = legacy.before();
              return !util.global.dispatchEvent(e);
            } finally {
              legacy.after(fn);
            }
          } else {
            return !util.global.dispatchEvent(e);
          }
        };
        try {
          if (typeof CustomEvent === "function") {
            var event = new CustomEvent("CustomEvent");
            util.global.dispatchEvent(event);
            return function(name, event2) {
              name = name.toLowerCase();
              var eventData = {
                detail: event2,
                cancelable: true
              };
              var domEvent = new CustomEvent(name, eventData);
              es52.defineProperty(domEvent, "promise", { value: event2.promise });
              es52.defineProperty(domEvent, "reason", { value: event2.reason });
              return dispatch(legacyHandlers[name], domEvent);
            };
          } else if (typeof Event === "function") {
            var event = new Event("CustomEvent");
            util.global.dispatchEvent(event);
            return function(name, event2) {
              name = name.toLowerCase();
              var domEvent = new Event(name, {
                cancelable: true
              });
              domEvent.detail = event2;
              es52.defineProperty(domEvent, "promise", { value: event2.promise });
              es52.defineProperty(domEvent, "reason", { value: event2.reason });
              return dispatch(legacyHandlers[name], domEvent);
            };
          } else {
            var event = document.createEvent("CustomEvent");
            event.initCustomEvent("testingtheevent", false, true, {});
            util.global.dispatchEvent(event);
            return function(name, event2) {
              name = name.toLowerCase();
              var domEvent = document.createEvent("CustomEvent");
              domEvent.initCustomEvent(name, false, true, event2);
              return dispatch(legacyHandlers[name], domEvent);
            };
          }
        } catch (e) {
        }
        return function() {
          return false;
        };
      }();
      var fireGlobalEvent = function() {
        if (util.isNode) {
          return function() {
            return process.emit.apply(process, arguments);
          };
        } else {
          if (!util.global) {
            return function() {
              return false;
            };
          }
          return function(name) {
            var methodName = "on" + name.toLowerCase();
            var method = util.global[methodName];
            if (!method)
              return false;
            method.apply(util.global, [].slice.call(arguments, 1));
            return true;
          };
        }
      }();
      function generatePromiseLifecycleEventObject(name, promise) {
        return { promise };
      }
      var eventToObjectGenerator = {
        promiseCreated: generatePromiseLifecycleEventObject,
        promiseFulfilled: generatePromiseLifecycleEventObject,
        promiseRejected: generatePromiseLifecycleEventObject,
        promiseResolved: generatePromiseLifecycleEventObject,
        promiseCancelled: generatePromiseLifecycleEventObject,
        promiseChained: function(name, promise, child) {
          return { promise, child };
        },
        warning: function(name, warning) {
          return { warning };
        },
        unhandledRejection: function(name, reason, promise) {
          return { reason, promise };
        },
        rejectionHandled: generatePromiseLifecycleEventObject
      };
      var activeFireEvent = function(name) {
        var globalEventFired = false;
        try {
          globalEventFired = fireGlobalEvent.apply(null, arguments);
        } catch (e) {
          async.throwLater(e);
          globalEventFired = true;
        }
        var domEventFired = false;
        try {
          domEventFired = fireDomEvent(name, eventToObjectGenerator[name].apply(null, arguments));
        } catch (e) {
          async.throwLater(e);
          domEventFired = true;
        }
        return domEventFired || globalEventFired;
      };
      Promise2.config = function(opts) {
        opts = Object(opts);
        if ("longStackTraces" in opts) {
          if (opts.longStackTraces) {
            Promise2.longStackTraces();
          } else if (!opts.longStackTraces && Promise2.hasLongStackTraces()) {
            disableLongStackTraces();
          }
        }
        if ("warnings" in opts) {
          var warningsOption = opts.warnings;
          config2.warnings = !!warningsOption;
          wForgottenReturn = config2.warnings;
          if (util.isObject(warningsOption)) {
            if ("wForgottenReturn" in warningsOption) {
              wForgottenReturn = !!warningsOption.wForgottenReturn;
            }
          }
        }
        if ("cancellation" in opts && opts.cancellation && !config2.cancellation) {
          if (async.haveItemsQueued()) {
            throw new Error("cannot enable cancellation after promises are in use");
          }
          Promise2.prototype._clearCancellationData = cancellationClearCancellationData;
          Promise2.prototype._propagateFrom = cancellationPropagateFrom;
          Promise2.prototype._onCancel = cancellationOnCancel;
          Promise2.prototype._setOnCancel = cancellationSetOnCancel;
          Promise2.prototype._attachCancellationCallback = cancellationAttachCancellationCallback;
          Promise2.prototype._execute = cancellationExecute;
          propagateFromFunction = cancellationPropagateFrom;
          config2.cancellation = true;
        }
        if ("monitoring" in opts) {
          if (opts.monitoring && !config2.monitoring) {
            config2.monitoring = true;
            Promise2.prototype._fireEvent = activeFireEvent;
          } else if (!opts.monitoring && config2.monitoring) {
            config2.monitoring = false;
            Promise2.prototype._fireEvent = defaultFireEvent;
          }
        }
        if ("asyncHooks" in opts && util.nodeSupportsAsyncResource) {
          var prev = config2.asyncHooks;
          var cur = !!opts.asyncHooks;
          if (prev !== cur) {
            config2.asyncHooks = cur;
            if (cur) {
              enableAsyncHooks();
            } else {
              disableAsyncHooks();
            }
          }
        }
        return Promise2;
      };
      function defaultFireEvent() {
        return false;
      }
      Promise2.prototype._fireEvent = defaultFireEvent;
      Promise2.prototype._execute = function(executor, resolve, reject) {
        try {
          executor(resolve, reject);
        } catch (e) {
          return e;
        }
      };
      Promise2.prototype._onCancel = function() {
      };
      Promise2.prototype._setOnCancel = function(handler2) {
        ;
      };
      Promise2.prototype._attachCancellationCallback = function(onCancel) {
        ;
      };
      Promise2.prototype._captureStackTrace = function() {
      };
      Promise2.prototype._attachExtraTrace = function() {
      };
      Promise2.prototype._dereferenceTrace = function() {
      };
      Promise2.prototype._clearCancellationData = function() {
      };
      Promise2.prototype._propagateFrom = function(parent, flags) {
        ;
        ;
      };
      function cancellationExecute(executor, resolve, reject) {
        var promise = this;
        try {
          executor(resolve, reject, function(onCancel) {
            if (typeof onCancel !== "function") {
              throw new TypeError("onCancel must be a function, got: " + util.toString(onCancel));
            }
            promise._attachCancellationCallback(onCancel);
          });
        } catch (e) {
          return e;
        }
      }
      function cancellationAttachCancellationCallback(onCancel) {
        if (!this._isCancellable())
          return this;
        var previousOnCancel = this._onCancel();
        if (previousOnCancel !== void 0) {
          if (util.isArray(previousOnCancel)) {
            previousOnCancel.push(onCancel);
          } else {
            this._setOnCancel([previousOnCancel, onCancel]);
          }
        } else {
          this._setOnCancel(onCancel);
        }
      }
      function cancellationOnCancel() {
        return this._onCancelField;
      }
      function cancellationSetOnCancel(onCancel) {
        this._onCancelField = onCancel;
      }
      function cancellationClearCancellationData() {
        this._cancellationParent = void 0;
        this._onCancelField = void 0;
      }
      function cancellationPropagateFrom(parent, flags) {
        if ((flags & 1) !== 0) {
          this._cancellationParent = parent;
          var branchesRemainingToCancel = parent._branchesRemainingToCancel;
          if (branchesRemainingToCancel === void 0) {
            branchesRemainingToCancel = 0;
          }
          parent._branchesRemainingToCancel = branchesRemainingToCancel + 1;
        }
        if ((flags & 2) !== 0 && parent._isBound()) {
          this._setBoundTo(parent._boundTo);
        }
      }
      function bindingPropagateFrom(parent, flags) {
        if ((flags & 2) !== 0 && parent._isBound()) {
          this._setBoundTo(parent._boundTo);
        }
      }
      var propagateFromFunction = bindingPropagateFrom;
      function boundValueFunction() {
        var ret2 = this._boundTo;
        if (ret2 !== void 0) {
          if (ret2 instanceof Promise2) {
            if (ret2.isFulfilled()) {
              return ret2.value();
            } else {
              return void 0;
            }
          }
        }
        return ret2;
      }
      function longStackTracesCaptureStackTrace() {
        this._trace = new CapturedTrace(this._peekContext());
      }
      function longStackTracesAttachExtraTrace(error, ignoreSelf) {
        if (canAttachTrace2(error)) {
          var trace = this._trace;
          if (trace !== void 0) {
            if (ignoreSelf)
              trace = trace._parent;
          }
          if (trace !== void 0) {
            trace.attachExtraTrace(error);
          } else if (!error.__stackCleaned__) {
            var parsed = parseStackAndMessage(error);
            util.notEnumerableProp(error, "stack", parsed.message + "\n" + parsed.stack.join("\n"));
            util.notEnumerableProp(error, "__stackCleaned__", true);
          }
        }
      }
      function longStackTracesDereferenceTrace() {
        this._trace = void 0;
      }
      function checkForgottenReturns(returnValue, promiseCreated, name, promise, parent) {
        if (returnValue === void 0 && promiseCreated !== null && wForgottenReturn) {
          if (parent !== void 0 && parent._returnedNonUndefined())
            return;
          if ((promise._bitField & 65535) === 0)
            return;
          if (name)
            name = name + " ";
          var handlerLine = "";
          var creatorLine = "";
          if (promiseCreated._trace) {
            var traceLines = promiseCreated._trace.stack.split("\n");
            var stack = cleanStack(traceLines);
            for (var i = stack.length - 1; i >= 0; --i) {
              var line = stack[i];
              if (!nodeFramePattern.test(line)) {
                var lineMatches = line.match(parseLinePattern);
                if (lineMatches) {
                  handlerLine = "at " + lineMatches[1] + ":" + lineMatches[2] + ":" + lineMatches[3] + " ";
                }
                break;
              }
            }
            if (stack.length > 0) {
              var firstUserLine = stack[0];
              for (var i = 0; i < traceLines.length; ++i) {
                if (traceLines[i] === firstUserLine) {
                  if (i > 0) {
                    creatorLine = "\n" + traceLines[i - 1];
                  }
                  break;
                }
              }
            }
          }
          var msg = "a promise was created in a " + name + "handler " + handlerLine + "but was not returned from it, see http://goo.gl/rRqMUw" + creatorLine;
          promise._warn(msg, true, promiseCreated);
        }
      }
      function deprecated(name, replacement) {
        var message = name + " is deprecated and will be removed in a future version.";
        if (replacement)
          message += " Use " + replacement + " instead.";
        return warn(message);
      }
      function warn(message, shouldUseOwnTrace, promise) {
        if (!config2.warnings)
          return;
        var warning = new Warning(message);
        var ctx;
        if (shouldUseOwnTrace) {
          promise._attachExtraTrace(warning);
        } else if (config2.longStackTraces && (ctx = Promise2._peekContext())) {
          ctx.attachExtraTrace(warning);
        } else {
          var parsed = parseStackAndMessage(warning);
          warning.stack = parsed.message + "\n" + parsed.stack.join("\n");
        }
        if (!activeFireEvent("warning", warning)) {
          formatAndLogError(warning, "", true);
        }
      }
      function reconstructStack(message, stacks) {
        for (var i = 0; i < stacks.length - 1; ++i) {
          stacks[i].push("From previous event:");
          stacks[i] = stacks[i].join("\n");
        }
        if (i < stacks.length) {
          stacks[i] = stacks[i].join("\n");
        }
        return message + "\n" + stacks.join("\n");
      }
      function removeDuplicateOrEmptyJumps(stacks) {
        for (var i = 0; i < stacks.length; ++i) {
          if (stacks[i].length === 0 || i + 1 < stacks.length && stacks[i][0] === stacks[i + 1][0]) {
            stacks.splice(i, 1);
            i--;
          }
        }
      }
      function removeCommonRoots(stacks) {
        var current = stacks[0];
        for (var i = 1; i < stacks.length; ++i) {
          var prev = stacks[i];
          var currentLastIndex = current.length - 1;
          var currentLastLine = current[currentLastIndex];
          var commonRootMeetPoint = -1;
          for (var j = prev.length - 1; j >= 0; --j) {
            if (prev[j] === currentLastLine) {
              commonRootMeetPoint = j;
              break;
            }
          }
          for (var j = commonRootMeetPoint; j >= 0; --j) {
            var line = prev[j];
            if (current[currentLastIndex] === line) {
              current.pop();
              currentLastIndex--;
            } else {
              break;
            }
          }
          current = prev;
        }
      }
      function cleanStack(stack) {
        var ret2 = [];
        for (var i = 0; i < stack.length; ++i) {
          var line = stack[i];
          var isTraceLine = line === "    (No stack trace)" || stackFramePattern.test(line);
          var isInternalFrame = isTraceLine && shouldIgnore(line);
          if (isTraceLine && !isInternalFrame) {
            if (indentStackFrames && line.charAt(0) !== " ") {
              line = "    " + line;
            }
            ret2.push(line);
          }
        }
        return ret2;
      }
      function stackFramesAsArray(error) {
        var stack = error.stack.replace(/\s+$/g, "").split("\n");
        for (var i = 0; i < stack.length; ++i) {
          var line = stack[i];
          if (line === "    (No stack trace)" || stackFramePattern.test(line)) {
            break;
          }
        }
        if (i > 0 && error.name != "SyntaxError") {
          stack = stack.slice(i);
        }
        return stack;
      }
      function parseStackAndMessage(error) {
        var stack = error.stack;
        var message = error.toString();
        stack = typeof stack === "string" && stack.length > 0 ? stackFramesAsArray(error) : ["    (No stack trace)"];
        return {
          message,
          stack: error.name == "SyntaxError" ? stack : cleanStack(stack)
        };
      }
      function formatAndLogError(error, title, isSoft) {
        if (typeof console !== "undefined") {
          var message;
          if (util.isObject(error)) {
            var stack = error.stack;
            message = title + formatStack(stack, error);
          } else {
            message = title + String(error);
          }
          if (typeof printWarning === "function") {
            printWarning(message, isSoft);
          } else if (typeof console.log === "function" || typeof console.log === "object") {
            console.log(message);
          }
        }
      }
      function fireRejectionEvent(name, localHandler, reason, promise) {
        var localEventFired = false;
        try {
          if (typeof localHandler === "function") {
            localEventFired = true;
            if (name === "rejectionHandled") {
              localHandler(promise);
            } else {
              localHandler(reason, promise);
            }
          }
        } catch (e) {
          async.throwLater(e);
        }
        if (name === "unhandledRejection") {
          if (!activeFireEvent(name, reason, promise) && !localEventFired) {
            formatAndLogError(reason, "Unhandled rejection ");
          }
        } else {
          activeFireEvent(name, promise);
        }
      }
      function formatNonError(obj2) {
        var str;
        if (typeof obj2 === "function") {
          str = "[function " + (obj2.name || "anonymous") + "]";
        } else {
          str = obj2 && typeof obj2.toString === "function" ? obj2.toString() : util.toString(obj2);
          var ruselessToString = /\[object [a-zA-Z0-9$_]+\]/;
          if (ruselessToString.test(str)) {
            try {
              var newStr = JSON.stringify(obj2);
              str = newStr;
            } catch (e) {
            }
          }
          if (str.length === 0) {
            str = "(empty array)";
          }
        }
        return "(<" + snip(str) + ">, no stack trace)";
      }
      function snip(str) {
        var maxChars = 41;
        if (str.length < maxChars) {
          return str;
        }
        return str.substr(0, maxChars - 3) + "...";
      }
      function longStackTracesIsSupported() {
        return typeof captureStackTrace === "function";
      }
      var shouldIgnore = function() {
        return false;
      };
      var parseLineInfoRegex = /[\/<\(]([^:\/]+):(\d+):(?:\d+)\)?\s*$/;
      function parseLineInfo(line) {
        var matches = line.match(parseLineInfoRegex);
        if (matches) {
          return {
            fileName: matches[1],
            line: parseInt(matches[2], 10)
          };
        }
      }
      function setBounds(firstLineError, lastLineError) {
        if (!longStackTracesIsSupported())
          return;
        var firstStackLines = (firstLineError.stack || "").split("\n");
        var lastStackLines = (lastLineError.stack || "").split("\n");
        var firstIndex = -1;
        var lastIndex = -1;
        var firstFileName;
        var lastFileName;
        for (var i = 0; i < firstStackLines.length; ++i) {
          var result = parseLineInfo(firstStackLines[i]);
          if (result) {
            firstFileName = result.fileName;
            firstIndex = result.line;
            break;
          }
        }
        for (var i = 0; i < lastStackLines.length; ++i) {
          var result = parseLineInfo(lastStackLines[i]);
          if (result) {
            lastFileName = result.fileName;
            lastIndex = result.line;
            break;
          }
        }
        if (firstIndex < 0 || lastIndex < 0 || !firstFileName || !lastFileName || firstFileName !== lastFileName || firstIndex >= lastIndex) {
          return;
        }
        shouldIgnore = function(line) {
          if (bluebirdFramePattern.test(line))
            return true;
          var info = parseLineInfo(line);
          if (info) {
            if (info.fileName === firstFileName && (firstIndex <= info.line && info.line <= lastIndex)) {
              return true;
            }
          }
          return false;
        };
      }
      function CapturedTrace(parent) {
        this._parent = parent;
        this._promisesCreated = 0;
        var length = this._length = 1 + (parent === void 0 ? 0 : parent._length);
        captureStackTrace(this, CapturedTrace);
        if (length > 32)
          this.uncycle();
      }
      util.inherits(CapturedTrace, Error);
      Context.CapturedTrace = CapturedTrace;
      CapturedTrace.prototype.uncycle = function() {
        var length = this._length;
        if (length < 2)
          return;
        var nodes = [];
        var stackToIndex = {};
        for (var i = 0, node = this; node !== void 0; ++i) {
          nodes.push(node);
          node = node._parent;
        }
        length = this._length = i;
        for (var i = length - 1; i >= 0; --i) {
          var stack = nodes[i].stack;
          if (stackToIndex[stack] === void 0) {
            stackToIndex[stack] = i;
          }
        }
        for (var i = 0; i < length; ++i) {
          var currentStack = nodes[i].stack;
          var index = stackToIndex[currentStack];
          if (index !== void 0 && index !== i) {
            if (index > 0) {
              nodes[index - 1]._parent = void 0;
              nodes[index - 1]._length = 1;
            }
            nodes[i]._parent = void 0;
            nodes[i]._length = 1;
            var cycleEdgeNode = i > 0 ? nodes[i - 1] : this;
            if (index < length - 1) {
              cycleEdgeNode._parent = nodes[index + 1];
              cycleEdgeNode._parent.uncycle();
              cycleEdgeNode._length = cycleEdgeNode._parent._length + 1;
            } else {
              cycleEdgeNode._parent = void 0;
              cycleEdgeNode._length = 1;
            }
            var currentChildLength = cycleEdgeNode._length + 1;
            for (var j = i - 2; j >= 0; --j) {
              nodes[j]._length = currentChildLength;
              currentChildLength++;
            }
            return;
          }
        }
      };
      CapturedTrace.prototype.attachExtraTrace = function(error) {
        if (error.__stackCleaned__)
          return;
        this.uncycle();
        var parsed = parseStackAndMessage(error);
        var message = parsed.message;
        var stacks = [parsed.stack];
        var trace = this;
        while (trace !== void 0) {
          stacks.push(cleanStack(trace.stack.split("\n")));
          trace = trace._parent;
        }
        removeCommonRoots(stacks);
        removeDuplicateOrEmptyJumps(stacks);
        util.notEnumerableProp(error, "stack", reconstructStack(message, stacks));
        util.notEnumerableProp(error, "__stackCleaned__", true);
      };
      var captureStackTrace = function stackDetection() {
        var v8stackFramePattern = /^\s*at\s*/;
        var v8stackFormatter = function(stack, error) {
          if (typeof stack === "string")
            return stack;
          if (error.name !== void 0 && error.message !== void 0) {
            return error.toString();
          }
          return formatNonError(error);
        };
        if (typeof Error.stackTraceLimit === "number" && typeof Error.captureStackTrace === "function") {
          Error.stackTraceLimit += 6;
          stackFramePattern = v8stackFramePattern;
          formatStack = v8stackFormatter;
          var captureStackTrace2 = Error.captureStackTrace;
          shouldIgnore = function(line) {
            return bluebirdFramePattern.test(line);
          };
          return function(receiver2, ignoreUntil) {
            Error.stackTraceLimit += 6;
            captureStackTrace2(receiver2, ignoreUntil);
            Error.stackTraceLimit -= 6;
          };
        }
        var err = new Error();
        if (typeof err.stack === "string" && err.stack.split("\n")[0].indexOf("stackDetection@") >= 0) {
          stackFramePattern = /@/;
          formatStack = v8stackFormatter;
          indentStackFrames = true;
          return function captureStackTrace3(o) {
            o.stack = new Error().stack;
          };
        }
        var hasStackAfterThrow;
        try {
          throw new Error();
        } catch (e) {
          hasStackAfterThrow = "stack" in e;
        }
        if (!("stack" in err) && hasStackAfterThrow && typeof Error.stackTraceLimit === "number") {
          stackFramePattern = v8stackFramePattern;
          formatStack = v8stackFormatter;
          return function captureStackTrace3(o) {
            Error.stackTraceLimit += 6;
            try {
              throw new Error();
            } catch (e) {
              o.stack = e.stack;
            }
            Error.stackTraceLimit -= 6;
          };
        }
        formatStack = function(stack, error) {
          if (typeof stack === "string")
            return stack;
          if ((typeof error === "object" || typeof error === "function") && error.name !== void 0 && error.message !== void 0) {
            return error.toString();
          }
          return formatNonError(error);
        };
        return null;
      }([]);
      if (typeof console !== "undefined" && typeof console.warn !== "undefined") {
        printWarning = function(message) {
          console.warn(message);
        };
        if (util.isNode && process.stderr.isTTY) {
          printWarning = function(message, isSoft) {
            var color = isSoft ? "\x1B[33m" : "\x1B[31m";
            console.warn(color + message + "\x1B[0m\n");
          };
        } else if (!util.isNode && typeof new Error().stack === "string") {
          printWarning = function(message, isSoft) {
            console.warn("%c" + message, isSoft ? "color: darkorange" : "color: red");
          };
        }
      }
      var config2 = {
        warnings,
        longStackTraces: false,
        cancellation: false,
        monitoring: false,
        asyncHooks: false
      };
      if (longStackTraces)
        Promise2.longStackTraces();
      return {
        asyncHooks: function() {
          return config2.asyncHooks;
        },
        longStackTraces: function() {
          return config2.longStackTraces;
        },
        warnings: function() {
          return config2.warnings;
        },
        cancellation: function() {
          return config2.cancellation;
        },
        monitoring: function() {
          return config2.monitoring;
        },
        propagateFromFunction: function() {
          return propagateFromFunction;
        },
        boundValueFunction: function() {
          return boundValueFunction;
        },
        checkForgottenReturns,
        setBounds,
        warn,
        deprecated,
        CapturedTrace,
        fireDomEvent,
        fireGlobalEvent
      };
    };
  }
});

// netlify/functions/node_modules/bluebird/js/release/catch_filter.js
var require_catch_filter = __commonJS({
  "netlify/functions/node_modules/bluebird/js/release/catch_filter.js"(exports2, module2) {
    "use strict";
    module2.exports = function(NEXT_FILTER) {
      var util = require_util();
      var getKeys = require_es5().keys;
      var tryCatch2 = util.tryCatch;
      var errorObj2 = util.errorObj;
      function catchFilter(instances, cb, promise) {
        return function(e) {
          var boundTo = promise._boundValue();
          predicateLoop:
            for (var i = 0; i < instances.length; ++i) {
              var item = instances[i];
              if (item === Error || item != null && item.prototype instanceof Error) {
                if (e instanceof item) {
                  return tryCatch2(cb).call(boundTo, e);
                }
              } else if (typeof item === "function") {
                var matchesPredicate = tryCatch2(item).call(boundTo, e);
                if (matchesPredicate === errorObj2) {
                  return matchesPredicate;
                } else if (matchesPredicate) {
                  return tryCatch2(cb).call(boundTo, e);
                }
              } else if (util.isObject(e)) {
                var keys = getKeys(item);
                for (var j = 0; j < keys.length; ++j) {
                  var key = keys[j];
                  if (item[key] != e[key]) {
                    continue predicateLoop;
                  }
                }
                return tryCatch2(cb).call(boundTo, e);
              }
            }
          return NEXT_FILTER;
        };
      }
      return catchFilter;
    };
  }
});

// netlify/functions/node_modules/bluebird/js/release/finally.js
var require_finally = __commonJS({
  "netlify/functions/node_modules/bluebird/js/release/finally.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, tryConvertToPromise, NEXT_FILTER) {
      var util = require_util();
      var CancellationError = Promise2.CancellationError;
      var errorObj2 = util.errorObj;
      var catchFilter = require_catch_filter()(NEXT_FILTER);
      function PassThroughHandlerContext(promise, type, handler2) {
        this.promise = promise;
        this.type = type;
        this.handler = handler2;
        this.called = false;
        this.cancelPromise = null;
      }
      PassThroughHandlerContext.prototype.isFinallyHandler = function() {
        return this.type === 0;
      };
      function FinallyHandlerCancelReaction(finallyHandler2) {
        this.finallyHandler = finallyHandler2;
      }
      FinallyHandlerCancelReaction.prototype._resultCancelled = function() {
        checkCancel(this.finallyHandler);
      };
      function checkCancel(ctx, reason) {
        if (ctx.cancelPromise != null) {
          if (arguments.length > 1) {
            ctx.cancelPromise._reject(reason);
          } else {
            ctx.cancelPromise._cancel();
          }
          ctx.cancelPromise = null;
          return true;
        }
        return false;
      }
      function succeed() {
        return finallyHandler.call(this, this.promise._target()._settledValue());
      }
      function fail(reason) {
        if (checkCancel(this, reason))
          return;
        errorObj2.e = reason;
        return errorObj2;
      }
      function finallyHandler(reasonOrValue) {
        var promise = this.promise;
        var handler2 = this.handler;
        if (!this.called) {
          this.called = true;
          var ret2 = this.isFinallyHandler() ? handler2.call(promise._boundValue()) : handler2.call(promise._boundValue(), reasonOrValue);
          if (ret2 === NEXT_FILTER) {
            return ret2;
          } else if (ret2 !== void 0) {
            promise._setReturnedNonUndefined();
            var maybePromise = tryConvertToPromise(ret2, promise);
            if (maybePromise instanceof Promise2) {
              if (this.cancelPromise != null) {
                if (maybePromise._isCancelled()) {
                  var reason = new CancellationError("late cancellation observer");
                  promise._attachExtraTrace(reason);
                  errorObj2.e = reason;
                  return errorObj2;
                } else if (maybePromise.isPending()) {
                  maybePromise._attachCancellationCallback(new FinallyHandlerCancelReaction(this));
                }
              }
              return maybePromise._then(succeed, fail, void 0, this, void 0);
            }
          }
        }
        if (promise.isRejected()) {
          checkCancel(this);
          errorObj2.e = reasonOrValue;
          return errorObj2;
        } else {
          checkCancel(this);
          return reasonOrValue;
        }
      }
      Promise2.prototype._passThrough = function(handler2, type, success, fail2) {
        if (typeof handler2 !== "function")
          return this.then();
        return this._then(success, fail2, void 0, new PassThroughHandlerContext(this, type, handler2), void 0);
      };
      Promise2.prototype.lastly = Promise2.prototype["finally"] = function(handler2) {
        return this._passThrough(handler2, 0, finallyHandler, finallyHandler);
      };
      Promise2.prototype.tap = function(handler2) {
        return this._passThrough(handler2, 1, finallyHandler);
      };
      Promise2.prototype.tapCatch = function(handlerOrPredicate) {
        var len = arguments.length;
        if (len === 1) {
          return this._passThrough(handlerOrPredicate, 1, void 0, finallyHandler);
        } else {
          var catchInstances = new Array(len - 1), j = 0, i;
          for (i = 0; i < len - 1; ++i) {
            var item = arguments[i];
            if (util.isObject(item)) {
              catchInstances[j++] = item;
            } else {
              return Promise2.reject(new TypeError("tapCatch statement predicate: expecting an object but got " + util.classString(item)));
            }
          }
          catchInstances.length = j;
          var handler2 = arguments[i];
          return this._passThrough(catchFilter(catchInstances, handler2, this), 1, void 0, finallyHandler);
        }
      };
      return PassThroughHandlerContext;
    };
  }
});

// netlify/functions/node_modules/bluebird/js/release/nodeback.js
var require_nodeback = __commonJS({
  "netlify/functions/node_modules/bluebird/js/release/nodeback.js"(exports2, module2) {
    "use strict";
    var util = require_util();
    var maybeWrapAsError2 = util.maybeWrapAsError;
    var errors = require_errors();
    var OperationalError = errors.OperationalError;
    var es52 = require_es5();
    function isUntypedError(obj2) {
      return obj2 instanceof Error && es52.getPrototypeOf(obj2) === Error.prototype;
    }
    var rErrorKey = /^(?:name|message|stack|cause)$/;
    function wrapAsOperationalError(obj2) {
      var ret2;
      if (isUntypedError(obj2)) {
        ret2 = new OperationalError(obj2);
        ret2.name = obj2.name;
        ret2.message = obj2.message;
        ret2.stack = obj2.stack;
        var keys = es52.keys(obj2);
        for (var i = 0; i < keys.length; ++i) {
          var key = keys[i];
          if (!rErrorKey.test(key)) {
            ret2[key] = obj2[key];
          }
        }
        return ret2;
      }
      util.markAsOriginatingFromRejection(obj2);
      return obj2;
    }
    function nodebackForPromise(promise, multiArgs) {
      return function(err, value) {
        if (promise === null)
          return;
        if (err) {
          var wrapped = wrapAsOperationalError(maybeWrapAsError2(err));
          promise._attachExtraTrace(wrapped);
          promise._reject(wrapped);
        } else if (!multiArgs) {
          promise._fulfill(value);
        } else {
          var $_len = arguments.length;
          var args = new Array(Math.max($_len - 1, 0));
          for (var $_i = 1; $_i < $_len; ++$_i) {
            args[$_i - 1] = arguments[$_i];
          }
          ;
          promise._fulfill(args);
        }
        promise = null;
      };
    }
    module2.exports = nodebackForPromise;
  }
});

// netlify/functions/node_modules/bluebird/js/release/method.js
var require_method = __commonJS({
  "netlify/functions/node_modules/bluebird/js/release/method.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, INTERNAL, tryConvertToPromise, apiRejection, debug) {
      var util = require_util();
      var tryCatch2 = util.tryCatch;
      Promise2.method = function(fn) {
        if (typeof fn !== "function") {
          throw new Promise2.TypeError("expecting a function but got " + util.classString(fn));
        }
        return function() {
          var ret2 = new Promise2(INTERNAL);
          ret2._captureStackTrace();
          ret2._pushContext();
          var value = tryCatch2(fn).apply(this, arguments);
          var promiseCreated = ret2._popContext();
          debug.checkForgottenReturns(value, promiseCreated, "Promise.method", ret2);
          ret2._resolveFromSyncValue(value);
          return ret2;
        };
      };
      Promise2.attempt = Promise2["try"] = function(fn) {
        if (typeof fn !== "function") {
          return apiRejection("expecting a function but got " + util.classString(fn));
        }
        var ret2 = new Promise2(INTERNAL);
        ret2._captureStackTrace();
        ret2._pushContext();
        var value;
        if (arguments.length > 1) {
          debug.deprecated("calling Promise.try with more than 1 argument");
          var arg = arguments[1];
          var ctx = arguments[2];
          value = util.isArray(arg) ? tryCatch2(fn).apply(ctx, arg) : tryCatch2(fn).call(ctx, arg);
        } else {
          value = tryCatch2(fn)();
        }
        var promiseCreated = ret2._popContext();
        debug.checkForgottenReturns(value, promiseCreated, "Promise.try", ret2);
        ret2._resolveFromSyncValue(value);
        return ret2;
      };
      Promise2.prototype._resolveFromSyncValue = function(value) {
        if (value === util.errorObj) {
          this._rejectCallback(value.e, false);
        } else {
          this._resolveCallback(value, true);
        }
      };
    };
  }
});

// netlify/functions/node_modules/bluebird/js/release/bind.js
var require_bind = __commonJS({
  "netlify/functions/node_modules/bluebird/js/release/bind.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, INTERNAL, tryConvertToPromise, debug) {
      var calledBind = false;
      var rejectThis = function(_, e) {
        this._reject(e);
      };
      var targetRejected = function(e, context) {
        context.promiseRejectionQueued = true;
        context.bindingPromise._then(rejectThis, rejectThis, null, this, e);
      };
      var bindingResolved = function(thisArg, context) {
        if ((this._bitField & 50397184) === 0) {
          this._resolveCallback(context.target);
        }
      };
      var bindingRejected = function(e, context) {
        if (!context.promiseRejectionQueued)
          this._reject(e);
      };
      Promise2.prototype.bind = function(thisArg) {
        if (!calledBind) {
          calledBind = true;
          Promise2.prototype._propagateFrom = debug.propagateFromFunction();
          Promise2.prototype._boundValue = debug.boundValueFunction();
        }
        var maybePromise = tryConvertToPromise(thisArg);
        var ret2 = new Promise2(INTERNAL);
        ret2._propagateFrom(this, 1);
        var target = this._target();
        ret2._setBoundTo(maybePromise);
        if (maybePromise instanceof Promise2) {
          var context = {
            promiseRejectionQueued: false,
            promise: ret2,
            target,
            bindingPromise: maybePromise
          };
          target._then(INTERNAL, targetRejected, void 0, ret2, context);
          maybePromise._then(bindingResolved, bindingRejected, void 0, ret2, context);
          ret2._setOnCancel(maybePromise);
        } else {
          ret2._resolveCallback(target);
        }
        return ret2;
      };
      Promise2.prototype._setBoundTo = function(obj2) {
        if (obj2 !== void 0) {
          this._bitField = this._bitField | 2097152;
          this._boundTo = obj2;
        } else {
          this._bitField = this._bitField & ~2097152;
        }
      };
      Promise2.prototype._isBound = function() {
        return (this._bitField & 2097152) === 2097152;
      };
      Promise2.bind = function(thisArg, value) {
        return Promise2.resolve(value).bind(thisArg);
      };
    };
  }
});

// netlify/functions/node_modules/bluebird/js/release/cancel.js
var require_cancel = __commonJS({
  "netlify/functions/node_modules/bluebird/js/release/cancel.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, PromiseArray, apiRejection, debug) {
      var util = require_util();
      var tryCatch2 = util.tryCatch;
      var errorObj2 = util.errorObj;
      var async = Promise2._async;
      Promise2.prototype["break"] = Promise2.prototype.cancel = function() {
        if (!debug.cancellation())
          return this._warn("cancellation is disabled");
        var promise = this;
        var child = promise;
        while (promise._isCancellable()) {
          if (!promise._cancelBy(child)) {
            if (child._isFollowing()) {
              child._followee().cancel();
            } else {
              child._cancelBranched();
            }
            break;
          }
          var parent = promise._cancellationParent;
          if (parent == null || !parent._isCancellable()) {
            if (promise._isFollowing()) {
              promise._followee().cancel();
            } else {
              promise._cancelBranched();
            }
            break;
          } else {
            if (promise._isFollowing())
              promise._followee().cancel();
            promise._setWillBeCancelled();
            child = promise;
            promise = parent;
          }
        }
      };
      Promise2.prototype._branchHasCancelled = function() {
        this._branchesRemainingToCancel--;
      };
      Promise2.prototype._enoughBranchesHaveCancelled = function() {
        return this._branchesRemainingToCancel === void 0 || this._branchesRemainingToCancel <= 0;
      };
      Promise2.prototype._cancelBy = function(canceller) {
        if (canceller === this) {
          this._branchesRemainingToCancel = 0;
          this._invokeOnCancel();
          return true;
        } else {
          this._branchHasCancelled();
          if (this._enoughBranchesHaveCancelled()) {
            this._invokeOnCancel();
            return true;
          }
        }
        return false;
      };
      Promise2.prototype._cancelBranched = function() {
        if (this._enoughBranchesHaveCancelled()) {
          this._cancel();
        }
      };
      Promise2.prototype._cancel = function() {
        if (!this._isCancellable())
          return;
        this._setCancelled();
        async.invoke(this._cancelPromises, this, void 0);
      };
      Promise2.prototype._cancelPromises = function() {
        if (this._length() > 0)
          this._settlePromises();
      };
      Promise2.prototype._unsetOnCancel = function() {
        this._onCancelField = void 0;
      };
      Promise2.prototype._isCancellable = function() {
        return this.isPending() && !this._isCancelled();
      };
      Promise2.prototype.isCancellable = function() {
        return this.isPending() && !this.isCancelled();
      };
      Promise2.prototype._doInvokeOnCancel = function(onCancelCallback, internalOnly) {
        if (util.isArray(onCancelCallback)) {
          for (var i = 0; i < onCancelCallback.length; ++i) {
            this._doInvokeOnCancel(onCancelCallback[i], internalOnly);
          }
        } else if (onCancelCallback !== void 0) {
          if (typeof onCancelCallback === "function") {
            if (!internalOnly) {
              var e = tryCatch2(onCancelCallback).call(this._boundValue());
              if (e === errorObj2) {
                this._attachExtraTrace(e.e);
                async.throwLater(e.e);
              }
            }
          } else {
            onCancelCallback._resultCancelled(this);
          }
        }
      };
      Promise2.prototype._invokeOnCancel = function() {
        var onCancelCallback = this._onCancel();
        this._unsetOnCancel();
        async.invoke(this._doInvokeOnCancel, this, onCancelCallback);
      };
      Promise2.prototype._invokeInternalOnCancel = function() {
        if (this._isCancellable()) {
          this._doInvokeOnCancel(this._onCancel(), true);
          this._unsetOnCancel();
        }
      };
      Promise2.prototype._resultCancelled = function() {
        this.cancel();
      };
    };
  }
});

// netlify/functions/node_modules/bluebird/js/release/direct_resolve.js
var require_direct_resolve = __commonJS({
  "netlify/functions/node_modules/bluebird/js/release/direct_resolve.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2) {
      function returner() {
        return this.value;
      }
      function thrower2() {
        throw this.reason;
      }
      Promise2.prototype["return"] = Promise2.prototype.thenReturn = function(value) {
        if (value instanceof Promise2)
          value.suppressUnhandledRejections();
        return this._then(returner, void 0, void 0, { value }, void 0);
      };
      Promise2.prototype["throw"] = Promise2.prototype.thenThrow = function(reason) {
        return this._then(thrower2, void 0, void 0, { reason }, void 0);
      };
      Promise2.prototype.catchThrow = function(reason) {
        if (arguments.length <= 1) {
          return this._then(void 0, thrower2, void 0, { reason }, void 0);
        } else {
          var _reason = arguments[1];
          var handler2 = function() {
            throw _reason;
          };
          return this.caught(reason, handler2);
        }
      };
      Promise2.prototype.catchReturn = function(value) {
        if (arguments.length <= 1) {
          if (value instanceof Promise2)
            value.suppressUnhandledRejections();
          return this._then(void 0, returner, void 0, { value }, void 0);
        } else {
          var _value = arguments[1];
          if (_value instanceof Promise2)
            _value.suppressUnhandledRejections();
          var handler2 = function() {
            return _value;
          };
          return this.caught(value, handler2);
        }
      };
    };
  }
});

// netlify/functions/node_modules/bluebird/js/release/synchronous_inspection.js
var require_synchronous_inspection = __commonJS({
  "netlify/functions/node_modules/bluebird/js/release/synchronous_inspection.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2) {
      function PromiseInspection(promise) {
        if (promise !== void 0) {
          promise = promise._target();
          this._bitField = promise._bitField;
          this._settledValueField = promise._isFateSealed() ? promise._settledValue() : void 0;
        } else {
          this._bitField = 0;
          this._settledValueField = void 0;
        }
      }
      PromiseInspection.prototype._settledValue = function() {
        return this._settledValueField;
      };
      var value = PromiseInspection.prototype.value = function() {
        if (!this.isFulfilled()) {
          throw new TypeError("cannot get fulfillment value of a non-fulfilled promise\n\n    See http://goo.gl/MqrFmX\n");
        }
        return this._settledValue();
      };
      var reason = PromiseInspection.prototype.error = PromiseInspection.prototype.reason = function() {
        if (!this.isRejected()) {
          throw new TypeError("cannot get rejection reason of a non-rejected promise\n\n    See http://goo.gl/MqrFmX\n");
        }
        return this._settledValue();
      };
      var isFulfilled = PromiseInspection.prototype.isFulfilled = function() {
        return (this._bitField & 33554432) !== 0;
      };
      var isRejected = PromiseInspection.prototype.isRejected = function() {
        return (this._bitField & 16777216) !== 0;
      };
      var isPending = PromiseInspection.prototype.isPending = function() {
        return (this._bitField & 50397184) === 0;
      };
      var isResolved = PromiseInspection.prototype.isResolved = function() {
        return (this._bitField & 50331648) !== 0;
      };
      PromiseInspection.prototype.isCancelled = function() {
        return (this._bitField & 8454144) !== 0;
      };
      Promise2.prototype.__isCancelled = function() {
        return (this._bitField & 65536) === 65536;
      };
      Promise2.prototype._isCancelled = function() {
        return this._target().__isCancelled();
      };
      Promise2.prototype.isCancelled = function() {
        return (this._target()._bitField & 8454144) !== 0;
      };
      Promise2.prototype.isPending = function() {
        return isPending.call(this._target());
      };
      Promise2.prototype.isRejected = function() {
        return isRejected.call(this._target());
      };
      Promise2.prototype.isFulfilled = function() {
        return isFulfilled.call(this._target());
      };
      Promise2.prototype.isResolved = function() {
        return isResolved.call(this._target());
      };
      Promise2.prototype.value = function() {
        return value.call(this._target());
      };
      Promise2.prototype.reason = function() {
        var target = this._target();
        target._unsetRejectionIsUnhandled();
        return reason.call(target);
      };
      Promise2.prototype._value = function() {
        return this._settledValue();
      };
      Promise2.prototype._reason = function() {
        this._unsetRejectionIsUnhandled();
        return this._settledValue();
      };
      Promise2.PromiseInspection = PromiseInspection;
    };
  }
});

// netlify/functions/node_modules/bluebird/js/release/join.js
var require_join = __commonJS({
  "netlify/functions/node_modules/bluebird/js/release/join.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, PromiseArray, tryConvertToPromise, INTERNAL, async) {
      var util = require_util();
      var canEvaluate2 = util.canEvaluate;
      var tryCatch2 = util.tryCatch;
      var errorObj2 = util.errorObj;
      var reject;
      if (true) {
        if (canEvaluate2) {
          var thenCallback = function(i2) {
            return new Function("value", "holder", "                             \n            'use strict';                                                    \n            holder.pIndex = value;                                           \n            holder.checkFulfillment(this);                                   \n            ".replace(/Index/g, i2));
          };
          var promiseSetter = function(i2) {
            return new Function("promise", "holder", "                           \n            'use strict';                                                    \n            holder.pIndex = promise;                                         \n            ".replace(/Index/g, i2));
          };
          var generateHolderClass = function(total) {
            var props = new Array(total);
            for (var i2 = 0; i2 < props.length; ++i2) {
              props[i2] = "this.p" + (i2 + 1);
            }
            var assignment = props.join(" = ") + " = null;";
            var cancellationCode = "var promise;\n" + props.map(function(prop) {
              return "                                                         \n                promise = " + prop + ";                                      \n                if (promise instanceof Promise) {                            \n                    promise.cancel();                                        \n                }                                                            \n            ";
            }).join("\n");
            var passedArguments = props.join(", ");
            var name = "Holder$" + total;
            var code = "return function(tryCatch, errorObj, Promise, async) {    \n            'use strict';                                                    \n            function [TheName](fn) {                                         \n                [TheProperties]                                              \n                this.fn = fn;                                                \n                this.asyncNeeded = true;                                     \n                this.now = 0;                                                \n            }                                                                \n                                                                             \n            [TheName].prototype._callFunction = function(promise) {          \n                promise._pushContext();                                      \n                var ret = tryCatch(this.fn)([ThePassedArguments]);           \n                promise._popContext();                                       \n                if (ret === errorObj) {                                      \n                    promise._rejectCallback(ret.e, false);                   \n                } else {                                                     \n                    promise._resolveCallback(ret);                           \n                }                                                            \n            };                                                               \n                                                                             \n            [TheName].prototype.checkFulfillment = function(promise) {       \n                var now = ++this.now;                                        \n                if (now === [TheTotal]) {                                    \n                    if (this.asyncNeeded) {                                  \n                        async.invoke(this._callFunction, this, promise);     \n                    } else {                                                 \n                        this._callFunction(promise);                         \n                    }                                                        \n                                                                             \n                }                                                            \n            };                                                               \n                                                                             \n            [TheName].prototype._resultCancelled = function() {              \n                [CancellationCode]                                           \n            };                                                               \n                                                                             \n            return [TheName];                                                \n        }(tryCatch, errorObj, Promise, async);                               \n        ";
            code = code.replace(/\[TheName\]/g, name).replace(/\[TheTotal\]/g, total).replace(/\[ThePassedArguments\]/g, passedArguments).replace(/\[TheProperties\]/g, assignment).replace(/\[CancellationCode\]/g, cancellationCode);
            return new Function("tryCatch", "errorObj", "Promise", "async", code)(tryCatch2, errorObj2, Promise2, async);
          };
          var holderClasses = [];
          var thenCallbacks = [];
          var promiseSetters = [];
          for (var i = 0; i < 8; ++i) {
            holderClasses.push(generateHolderClass(i + 1));
            thenCallbacks.push(thenCallback(i + 1));
            promiseSetters.push(promiseSetter(i + 1));
          }
          reject = function(reason) {
            this._reject(reason);
          };
        }
      }
      Promise2.join = function() {
        var last = arguments.length - 1;
        var fn;
        if (last > 0 && typeof arguments[last] === "function") {
          fn = arguments[last];
          if (true) {
            if (last <= 8 && canEvaluate2) {
              var ret2 = new Promise2(INTERNAL);
              ret2._captureStackTrace();
              var HolderClass = holderClasses[last - 1];
              var holder = new HolderClass(fn);
              var callbacks = thenCallbacks;
              for (var i2 = 0; i2 < last; ++i2) {
                var maybePromise = tryConvertToPromise(arguments[i2], ret2);
                if (maybePromise instanceof Promise2) {
                  maybePromise = maybePromise._target();
                  var bitField = maybePromise._bitField;
                  ;
                  if ((bitField & 50397184) === 0) {
                    maybePromise._then(callbacks[i2], reject, void 0, ret2, holder);
                    promiseSetters[i2](maybePromise, holder);
                    holder.asyncNeeded = false;
                  } else if ((bitField & 33554432) !== 0) {
                    callbacks[i2].call(ret2, maybePromise._value(), holder);
                  } else if ((bitField & 16777216) !== 0) {
                    ret2._reject(maybePromise._reason());
                  } else {
                    ret2._cancel();
                  }
                } else {
                  callbacks[i2].call(ret2, maybePromise, holder);
                }
              }
              if (!ret2._isFateSealed()) {
                if (holder.asyncNeeded) {
                  var context = Promise2._getContext();
                  holder.fn = util.contextBind(context, holder.fn);
                }
                ret2._setAsyncGuaranteed();
                ret2._setOnCancel(holder);
              }
              return ret2;
            }
          }
        }
        var $_len = arguments.length;
        var args = new Array($_len);
        for (var $_i = 0; $_i < $_len; ++$_i) {
          args[$_i] = arguments[$_i];
        }
        ;
        if (fn)
          args.pop();
        var ret2 = new PromiseArray(args).promise();
        return fn !== void 0 ? ret2.spread(fn) : ret2;
      };
    };
  }
});

// netlify/functions/node_modules/bluebird/js/release/call_get.js
var require_call_get = __commonJS({
  "netlify/functions/node_modules/bluebird/js/release/call_get.js"(exports2, module2) {
    "use strict";
    var cr = Object.create;
    if (cr) {
      callerCache = cr(null);
      getterCache = cr(null);
      callerCache[" size"] = getterCache[" size"] = 0;
    }
    var callerCache;
    var getterCache;
    module2.exports = function(Promise2) {
      var util = require_util();
      var canEvaluate2 = util.canEvaluate;
      var isIdentifier2 = util.isIdentifier;
      var getMethodCaller;
      var getGetter;
      if (true) {
        var makeMethodCaller = function(methodName) {
          return new Function("ensureMethod", "                                    \n        return function(obj) {                                               \n            'use strict'                                                     \n            var len = this.length;                                           \n            ensureMethod(obj, 'methodName');                                 \n            switch(len) {                                                    \n                case 1: return obj.methodName(this[0]);                      \n                case 2: return obj.methodName(this[0], this[1]);             \n                case 3: return obj.methodName(this[0], this[1], this[2]);    \n                case 0: return obj.methodName();                             \n                default:                                                     \n                    return obj.methodName.apply(obj, this);                  \n            }                                                                \n        };                                                                   \n        ".replace(/methodName/g, methodName))(ensureMethod);
        };
        var makeGetter = function(propertyName) {
          return new Function("obj", "                                             \n        'use strict';                                                        \n        return obj.propertyName;                                             \n        ".replace("propertyName", propertyName));
        };
        var getCompiled = function(name, compiler, cache) {
          var ret2 = cache[name];
          if (typeof ret2 !== "function") {
            if (!isIdentifier2(name)) {
              return null;
            }
            ret2 = compiler(name);
            cache[name] = ret2;
            cache[" size"]++;
            if (cache[" size"] > 512) {
              var keys = Object.keys(cache);
              for (var i = 0; i < 256; ++i)
                delete cache[keys[i]];
              cache[" size"] = keys.length - 256;
            }
          }
          return ret2;
        };
        getMethodCaller = function(name) {
          return getCompiled(name, makeMethodCaller, callerCache);
        };
        getGetter = function(name) {
          return getCompiled(name, makeGetter, getterCache);
        };
      }
      function ensureMethod(obj2, methodName) {
        var fn;
        if (obj2 != null)
          fn = obj2[methodName];
        if (typeof fn !== "function") {
          var message = "Object " + util.classString(obj2) + " has no method '" + util.toString(methodName) + "'";
          throw new Promise2.TypeError(message);
        }
        return fn;
      }
      function caller(obj2) {
        var methodName = this.pop();
        var fn = ensureMethod(obj2, methodName);
        return fn.apply(obj2, this);
      }
      Promise2.prototype.call = function(methodName) {
        var $_len = arguments.length;
        var args = new Array(Math.max($_len - 1, 0));
        for (var $_i = 1; $_i < $_len; ++$_i) {
          args[$_i - 1] = arguments[$_i];
        }
        ;
        if (true) {
          if (canEvaluate2) {
            var maybeCaller = getMethodCaller(methodName);
            if (maybeCaller !== null) {
              return this._then(maybeCaller, void 0, void 0, args, void 0);
            }
          }
        }
        args.push(methodName);
        return this._then(caller, void 0, void 0, args, void 0);
      };
      function namedGetter(obj2) {
        return obj2[this];
      }
      function indexedGetter(obj2) {
        var index = +this;
        if (index < 0)
          index = Math.max(0, index + obj2.length);
        return obj2[index];
      }
      Promise2.prototype.get = function(propertyName) {
        var isIndex = typeof propertyName === "number";
        var getter;
        if (!isIndex) {
          if (canEvaluate2) {
            var maybeGetter = getGetter(propertyName);
            getter = maybeGetter !== null ? maybeGetter : namedGetter;
          } else {
            getter = namedGetter;
          }
        } else {
          getter = indexedGetter;
        }
        return this._then(getter, void 0, void 0, propertyName, void 0);
      };
    };
  }
});

// netlify/functions/node_modules/bluebird/js/release/generators.js
var require_generators = __commonJS({
  "netlify/functions/node_modules/bluebird/js/release/generators.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, apiRejection, INTERNAL, tryConvertToPromise, Proxyable, debug) {
      var errors = require_errors();
      var TypeError2 = errors.TypeError;
      var util = require_util();
      var errorObj2 = util.errorObj;
      var tryCatch2 = util.tryCatch;
      var yieldHandlers = [];
      function promiseFromYieldHandler(value, yieldHandlers2, traceParent) {
        for (var i = 0; i < yieldHandlers2.length; ++i) {
          traceParent._pushContext();
          var result = tryCatch2(yieldHandlers2[i])(value);
          traceParent._popContext();
          if (result === errorObj2) {
            traceParent._pushContext();
            var ret2 = Promise2.reject(errorObj2.e);
            traceParent._popContext();
            return ret2;
          }
          var maybePromise = tryConvertToPromise(result, traceParent);
          if (maybePromise instanceof Promise2)
            return maybePromise;
        }
        return null;
      }
      function PromiseSpawn(generatorFunction, receiver2, yieldHandler, stack) {
        if (debug.cancellation()) {
          var internal = new Promise2(INTERNAL);
          var _finallyPromise = this._finallyPromise = new Promise2(INTERNAL);
          this._promise = internal.lastly(function() {
            return _finallyPromise;
          });
          internal._captureStackTrace();
          internal._setOnCancel(this);
        } else {
          var promise = this._promise = new Promise2(INTERNAL);
          promise._captureStackTrace();
        }
        this._stack = stack;
        this._generatorFunction = generatorFunction;
        this._receiver = receiver2;
        this._generator = void 0;
        this._yieldHandlers = typeof yieldHandler === "function" ? [yieldHandler].concat(yieldHandlers) : yieldHandlers;
        this._yieldedPromise = null;
        this._cancellationPhase = false;
      }
      util.inherits(PromiseSpawn, Proxyable);
      PromiseSpawn.prototype._isResolved = function() {
        return this._promise === null;
      };
      PromiseSpawn.prototype._cleanup = function() {
        this._promise = this._generator = null;
        if (debug.cancellation() && this._finallyPromise !== null) {
          this._finallyPromise._fulfill();
          this._finallyPromise = null;
        }
      };
      PromiseSpawn.prototype._promiseCancelled = function() {
        if (this._isResolved())
          return;
        var implementsReturn = typeof this._generator["return"] !== "undefined";
        var result;
        if (!implementsReturn) {
          var reason = new Promise2.CancellationError("generator .return() sentinel");
          Promise2.coroutine.returnSentinel = reason;
          this._promise._attachExtraTrace(reason);
          this._promise._pushContext();
          result = tryCatch2(this._generator["throw"]).call(this._generator, reason);
          this._promise._popContext();
        } else {
          this._promise._pushContext();
          result = tryCatch2(this._generator["return"]).call(this._generator, void 0);
          this._promise._popContext();
        }
        this._cancellationPhase = true;
        this._yieldedPromise = null;
        this._continue(result);
      };
      PromiseSpawn.prototype._promiseFulfilled = function(value) {
        this._yieldedPromise = null;
        this._promise._pushContext();
        var result = tryCatch2(this._generator.next).call(this._generator, value);
        this._promise._popContext();
        this._continue(result);
      };
      PromiseSpawn.prototype._promiseRejected = function(reason) {
        this._yieldedPromise = null;
        this._promise._attachExtraTrace(reason);
        this._promise._pushContext();
        var result = tryCatch2(this._generator["throw"]).call(this._generator, reason);
        this._promise._popContext();
        this._continue(result);
      };
      PromiseSpawn.prototype._resultCancelled = function() {
        if (this._yieldedPromise instanceof Promise2) {
          var promise = this._yieldedPromise;
          this._yieldedPromise = null;
          promise.cancel();
        }
      };
      PromiseSpawn.prototype.promise = function() {
        return this._promise;
      };
      PromiseSpawn.prototype._run = function() {
        this._generator = this._generatorFunction.call(this._receiver);
        this._receiver = this._generatorFunction = void 0;
        this._promiseFulfilled(void 0);
      };
      PromiseSpawn.prototype._continue = function(result) {
        var promise = this._promise;
        if (result === errorObj2) {
          this._cleanup();
          if (this._cancellationPhase) {
            return promise.cancel();
          } else {
            return promise._rejectCallback(result.e, false);
          }
        }
        var value = result.value;
        if (result.done === true) {
          this._cleanup();
          if (this._cancellationPhase) {
            return promise.cancel();
          } else {
            return promise._resolveCallback(value);
          }
        } else {
          var maybePromise = tryConvertToPromise(value, this._promise);
          if (!(maybePromise instanceof Promise2)) {
            maybePromise = promiseFromYieldHandler(maybePromise, this._yieldHandlers, this._promise);
            if (maybePromise === null) {
              this._promiseRejected(new TypeError2("A value %s was yielded that could not be treated as a promise\n\n    See http://goo.gl/MqrFmX\n\n".replace("%s", String(value)) + "From coroutine:\n" + this._stack.split("\n").slice(1, -7).join("\n")));
              return;
            }
          }
          maybePromise = maybePromise._target();
          var bitField = maybePromise._bitField;
          ;
          if ((bitField & 50397184) === 0) {
            this._yieldedPromise = maybePromise;
            maybePromise._proxy(this, null);
          } else if ((bitField & 33554432) !== 0) {
            Promise2._async.invoke(this._promiseFulfilled, this, maybePromise._value());
          } else if ((bitField & 16777216) !== 0) {
            Promise2._async.invoke(this._promiseRejected, this, maybePromise._reason());
          } else {
            this._promiseCancelled();
          }
        }
      };
      Promise2.coroutine = function(generatorFunction, options) {
        if (typeof generatorFunction !== "function") {
          throw new TypeError2("generatorFunction must be a function\n\n    See http://goo.gl/MqrFmX\n");
        }
        var yieldHandler = Object(options).yieldHandler;
        var PromiseSpawn$ = PromiseSpawn;
        var stack = new Error().stack;
        return function() {
          var generator = generatorFunction.apply(this, arguments);
          var spawn = new PromiseSpawn$(void 0, void 0, yieldHandler, stack);
          var ret2 = spawn.promise();
          spawn._generator = generator;
          spawn._promiseFulfilled(void 0);
          return ret2;
        };
      };
      Promise2.coroutine.addYieldHandler = function(fn) {
        if (typeof fn !== "function") {
          throw new TypeError2("expecting a function but got " + util.classString(fn));
        }
        yieldHandlers.push(fn);
      };
      Promise2.spawn = function(generatorFunction) {
        debug.deprecated("Promise.spawn()", "Promise.coroutine()");
        if (typeof generatorFunction !== "function") {
          return apiRejection("generatorFunction must be a function\n\n    See http://goo.gl/MqrFmX\n");
        }
        var spawn = new PromiseSpawn(generatorFunction, this);
        var ret2 = spawn.promise();
        spawn._run(Promise2.spawn);
        return ret2;
      };
    };
  }
});

// netlify/functions/node_modules/bluebird/js/release/map.js
var require_map = __commonJS({
  "netlify/functions/node_modules/bluebird/js/release/map.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug) {
      var util = require_util();
      var tryCatch2 = util.tryCatch;
      var errorObj2 = util.errorObj;
      var async = Promise2._async;
      function MappingPromiseArray(promises, fn, limit, _filter) {
        this.constructor$(promises);
        this._promise._captureStackTrace();
        var context = Promise2._getContext();
        this._callback = util.contextBind(context, fn);
        this._preservedValues = _filter === INTERNAL ? new Array(this.length()) : null;
        this._limit = limit;
        this._inFlight = 0;
        this._queue = [];
        async.invoke(this._asyncInit, this, void 0);
        if (util.isArray(promises)) {
          for (var i = 0; i < promises.length; ++i) {
            var maybePromise = promises[i];
            if (maybePromise instanceof Promise2) {
              maybePromise.suppressUnhandledRejections();
            }
          }
        }
      }
      util.inherits(MappingPromiseArray, PromiseArray);
      MappingPromiseArray.prototype._asyncInit = function() {
        this._init$(void 0, -2);
      };
      MappingPromiseArray.prototype._init = function() {
      };
      MappingPromiseArray.prototype._promiseFulfilled = function(value, index) {
        var values = this._values;
        var length = this.length();
        var preservedValues = this._preservedValues;
        var limit = this._limit;
        if (index < 0) {
          index = index * -1 - 1;
          values[index] = value;
          if (limit >= 1) {
            this._inFlight--;
            this._drainQueue();
            if (this._isResolved())
              return true;
          }
        } else {
          if (limit >= 1 && this._inFlight >= limit) {
            values[index] = value;
            this._queue.push(index);
            return false;
          }
          if (preservedValues !== null)
            preservedValues[index] = value;
          var promise = this._promise;
          var callback = this._callback;
          var receiver2 = promise._boundValue();
          promise._pushContext();
          var ret2 = tryCatch2(callback).call(receiver2, value, index, length);
          var promiseCreated = promise._popContext();
          debug.checkForgottenReturns(ret2, promiseCreated, preservedValues !== null ? "Promise.filter" : "Promise.map", promise);
          if (ret2 === errorObj2) {
            this._reject(ret2.e);
            return true;
          }
          var maybePromise = tryConvertToPromise(ret2, this._promise);
          if (maybePromise instanceof Promise2) {
            maybePromise = maybePromise._target();
            var bitField = maybePromise._bitField;
            ;
            if ((bitField & 50397184) === 0) {
              if (limit >= 1)
                this._inFlight++;
              values[index] = maybePromise;
              maybePromise._proxy(this, (index + 1) * -1);
              return false;
            } else if ((bitField & 33554432) !== 0) {
              ret2 = maybePromise._value();
            } else if ((bitField & 16777216) !== 0) {
              this._reject(maybePromise._reason());
              return true;
            } else {
              this._cancel();
              return true;
            }
          }
          values[index] = ret2;
        }
        var totalResolved = ++this._totalResolved;
        if (totalResolved >= length) {
          if (preservedValues !== null) {
            this._filter(values, preservedValues);
          } else {
            this._resolve(values);
          }
          return true;
        }
        return false;
      };
      MappingPromiseArray.prototype._drainQueue = function() {
        var queue = this._queue;
        var limit = this._limit;
        var values = this._values;
        while (queue.length > 0 && this._inFlight < limit) {
          if (this._isResolved())
            return;
          var index = queue.pop();
          this._promiseFulfilled(values[index], index);
        }
      };
      MappingPromiseArray.prototype._filter = function(booleans, values) {
        var len = values.length;
        var ret2 = new Array(len);
        var j = 0;
        for (var i = 0; i < len; ++i) {
          if (booleans[i])
            ret2[j++] = values[i];
        }
        ret2.length = j;
        this._resolve(ret2);
      };
      MappingPromiseArray.prototype.preservedValues = function() {
        return this._preservedValues;
      };
      function map(promises, fn, options, _filter) {
        if (typeof fn !== "function") {
          return apiRejection("expecting a function but got " + util.classString(fn));
        }
        var limit = 0;
        if (options !== void 0) {
          if (typeof options === "object" && options !== null) {
            if (typeof options.concurrency !== "number") {
              return Promise2.reject(new TypeError("'concurrency' must be a number but it is " + util.classString(options.concurrency)));
            }
            limit = options.concurrency;
          } else {
            return Promise2.reject(new TypeError("options argument must be an object but it is " + util.classString(options)));
          }
        }
        limit = typeof limit === "number" && isFinite(limit) && limit >= 1 ? limit : 0;
        return new MappingPromiseArray(promises, fn, limit, _filter).promise();
      }
      Promise2.prototype.map = function(fn, options) {
        return map(this, fn, options, null);
      };
      Promise2.map = function(promises, fn, options, _filter) {
        return map(promises, fn, options, _filter);
      };
    };
  }
});

// netlify/functions/node_modules/bluebird/js/release/nodeify.js
var require_nodeify = __commonJS({
  "netlify/functions/node_modules/bluebird/js/release/nodeify.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2) {
      var util = require_util();
      var async = Promise2._async;
      var tryCatch2 = util.tryCatch;
      var errorObj2 = util.errorObj;
      function spreadAdapter(val, nodeback) {
        var promise = this;
        if (!util.isArray(val))
          return successAdapter.call(promise, val, nodeback);
        var ret2 = tryCatch2(nodeback).apply(promise._boundValue(), [null].concat(val));
        if (ret2 === errorObj2) {
          async.throwLater(ret2.e);
        }
      }
      function successAdapter(val, nodeback) {
        var promise = this;
        var receiver2 = promise._boundValue();
        var ret2 = val === void 0 ? tryCatch2(nodeback).call(receiver2, null) : tryCatch2(nodeback).call(receiver2, null, val);
        if (ret2 === errorObj2) {
          async.throwLater(ret2.e);
        }
      }
      function errorAdapter(reason, nodeback) {
        var promise = this;
        if (!reason) {
          var newReason = new Error(reason + "");
          newReason.cause = reason;
          reason = newReason;
        }
        var ret2 = tryCatch2(nodeback).call(promise._boundValue(), reason);
        if (ret2 === errorObj2) {
          async.throwLater(ret2.e);
        }
      }
      Promise2.prototype.asCallback = Promise2.prototype.nodeify = function(nodeback, options) {
        if (typeof nodeback == "function") {
          var adapter = successAdapter;
          if (options !== void 0 && Object(options).spread) {
            adapter = spreadAdapter;
          }
          this._then(adapter, errorAdapter, void 0, this, nodeback);
        }
        return this;
      };
    };
  }
});

// netlify/functions/node_modules/bluebird/js/release/promisify.js
var require_promisify = __commonJS({
  "netlify/functions/node_modules/bluebird/js/release/promisify.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, INTERNAL) {
      var THIS = {};
      var util = require_util();
      var nodebackForPromise = require_nodeback();
      var withAppended2 = util.withAppended;
      var maybeWrapAsError2 = util.maybeWrapAsError;
      var canEvaluate2 = util.canEvaluate;
      var TypeError2 = require_errors().TypeError;
      var defaultSuffix = "Async";
      var defaultPromisified = { __isPromisified__: true };
      var noCopyProps = [
        "arity",
        "length",
        "name",
        "arguments",
        "caller",
        "callee",
        "prototype",
        "__isPromisified__"
      ];
      var noCopyPropsPattern = new RegExp("^(?:" + noCopyProps.join("|") + ")$");
      var defaultFilter = function(name) {
        return util.isIdentifier(name) && name.charAt(0) !== "_" && name !== "constructor";
      };
      function propsFilter(key) {
        return !noCopyPropsPattern.test(key);
      }
      function isPromisified(fn) {
        try {
          return fn.__isPromisified__ === true;
        } catch (e) {
          return false;
        }
      }
      function hasPromisified(obj2, key, suffix) {
        var val = util.getDataPropertyOrDefault(obj2, key + suffix, defaultPromisified);
        return val ? isPromisified(val) : false;
      }
      function checkValid(ret2, suffix, suffixRegexp) {
        for (var i = 0; i < ret2.length; i += 2) {
          var key = ret2[i];
          if (suffixRegexp.test(key)) {
            var keyWithoutAsyncSuffix = key.replace(suffixRegexp, "");
            for (var j = 0; j < ret2.length; j += 2) {
              if (ret2[j] === keyWithoutAsyncSuffix) {
                throw new TypeError2("Cannot promisify an API that has normal methods with '%s'-suffix\n\n    See http://goo.gl/MqrFmX\n".replace("%s", suffix));
              }
            }
          }
        }
      }
      function promisifiableMethods(obj2, suffix, suffixRegexp, filter) {
        var keys = util.inheritedDataKeys(obj2);
        var ret2 = [];
        for (var i = 0; i < keys.length; ++i) {
          var key = keys[i];
          var value = obj2[key];
          var passesDefaultFilter = filter === defaultFilter ? true : defaultFilter(key, value, obj2);
          if (typeof value === "function" && !isPromisified(value) && !hasPromisified(obj2, key, suffix) && filter(key, value, obj2, passesDefaultFilter)) {
            ret2.push(key, value);
          }
        }
        checkValid(ret2, suffix, suffixRegexp);
        return ret2;
      }
      var escapeIdentRegex = function(str) {
        return str.replace(/([$])/, "\\$");
      };
      var makeNodePromisifiedEval;
      if (true) {
        var switchCaseArgumentOrder = function(likelyArgumentCount) {
          var ret2 = [likelyArgumentCount];
          var min = Math.max(0, likelyArgumentCount - 1 - 3);
          for (var i = likelyArgumentCount - 1; i >= min; --i) {
            ret2.push(i);
          }
          for (var i = likelyArgumentCount + 1; i <= 3; ++i) {
            ret2.push(i);
          }
          return ret2;
        };
        var argumentSequence = function(argumentCount) {
          return util.filledRange(argumentCount, "_arg", "");
        };
        var parameterDeclaration = function(parameterCount2) {
          return util.filledRange(Math.max(parameterCount2, 3), "_arg", "");
        };
        var parameterCount = function(fn) {
          if (typeof fn.length === "number") {
            return Math.max(Math.min(fn.length, 1023 + 1), 0);
          }
          return 0;
        };
        makeNodePromisifiedEval = function(callback, receiver2, originalName, fn, _, multiArgs) {
          var newParameterCount = Math.max(0, parameterCount(fn) - 1);
          var argumentOrder = switchCaseArgumentOrder(newParameterCount);
          var shouldProxyThis = typeof callback === "string" || receiver2 === THIS;
          function generateCallForArgumentCount(count) {
            var args = argumentSequence(count).join(", ");
            var comma = count > 0 ? ", " : "";
            var ret2;
            if (shouldProxyThis) {
              ret2 = "ret = callback.call(this, {{args}}, nodeback); break;\n";
            } else {
              ret2 = receiver2 === void 0 ? "ret = callback({{args}}, nodeback); break;\n" : "ret = callback.call(receiver, {{args}}, nodeback); break;\n";
            }
            return ret2.replace("{{args}}", args).replace(", ", comma);
          }
          function generateArgumentSwitchCase() {
            var ret2 = "";
            for (var i = 0; i < argumentOrder.length; ++i) {
              ret2 += "case " + argumentOrder[i] + ":" + generateCallForArgumentCount(argumentOrder[i]);
            }
            ret2 += "                                                             \n        default:                                                             \n            var args = new Array(len + 1);                                   \n            var i = 0;                                                       \n            for (var i = 0; i < len; ++i) {                                  \n               args[i] = arguments[i];                                       \n            }                                                                \n            args[i] = nodeback;                                              \n            [CodeForCall]                                                    \n            break;                                                           \n        ".replace("[CodeForCall]", shouldProxyThis ? "ret = callback.apply(this, args);\n" : "ret = callback.apply(receiver, args);\n");
            return ret2;
          }
          var getFunctionCode = typeof callback === "string" ? "this != null ? this['" + callback + "'] : fn" : "fn";
          var body = "'use strict';                                                \n        var ret = function (Parameters) {                                    \n            'use strict';                                                    \n            var len = arguments.length;                                      \n            var promise = new Promise(INTERNAL);                             \n            promise._captureStackTrace();                                    \n            var nodeback = nodebackForPromise(promise, " + multiArgs + ");   \n            var ret;                                                         \n            var callback = tryCatch([GetFunctionCode]);                      \n            switch(len) {                                                    \n                [CodeForSwitchCase]                                          \n            }                                                                \n            if (ret === errorObj) {                                          \n                promise._rejectCallback(maybeWrapAsError(ret.e), true, true);\n            }                                                                \n            if (!promise._isFateSealed()) promise._setAsyncGuaranteed();     \n            return promise;                                                  \n        };                                                                   \n        notEnumerableProp(ret, '__isPromisified__', true);                   \n        return ret;                                                          \n    ".replace("[CodeForSwitchCase]", generateArgumentSwitchCase()).replace("[GetFunctionCode]", getFunctionCode);
          body = body.replace("Parameters", parameterDeclaration(newParameterCount));
          return new Function("Promise", "fn", "receiver", "withAppended", "maybeWrapAsError", "nodebackForPromise", "tryCatch", "errorObj", "notEnumerableProp", "INTERNAL", body)(Promise2, fn, receiver2, withAppended2, maybeWrapAsError2, nodebackForPromise, util.tryCatch, util.errorObj, util.notEnumerableProp, INTERNAL);
        };
      }
      function makeNodePromisifiedClosure(callback, receiver2, _, fn, __, multiArgs) {
        var defaultThis = function() {
          return this;
        }();
        var method = callback;
        if (typeof method === "string") {
          callback = fn;
        }
        function promisified() {
          var _receiver = receiver2;
          if (receiver2 === THIS)
            _receiver = this;
          var promise = new Promise2(INTERNAL);
          promise._captureStackTrace();
          var cb = typeof method === "string" && this !== defaultThis ? this[method] : callback;
          var fn2 = nodebackForPromise(promise, multiArgs);
          try {
            cb.apply(_receiver, withAppended2(arguments, fn2));
          } catch (e) {
            promise._rejectCallback(maybeWrapAsError2(e), true, true);
          }
          if (!promise._isFateSealed())
            promise._setAsyncGuaranteed();
          return promise;
        }
        util.notEnumerableProp(promisified, "__isPromisified__", true);
        return promisified;
      }
      var makeNodePromisified = canEvaluate2 ? makeNodePromisifiedEval : makeNodePromisifiedClosure;
      function promisifyAll(obj2, suffix, filter, promisifier, multiArgs) {
        var suffixRegexp = new RegExp(escapeIdentRegex(suffix) + "$");
        var methods = promisifiableMethods(obj2, suffix, suffixRegexp, filter);
        for (var i = 0, len = methods.length; i < len; i += 2) {
          var key = methods[i];
          var fn = methods[i + 1];
          var promisifiedKey = key + suffix;
          if (promisifier === makeNodePromisified) {
            obj2[promisifiedKey] = makeNodePromisified(key, THIS, key, fn, suffix, multiArgs);
          } else {
            var promisified = promisifier(fn, function() {
              return makeNodePromisified(key, THIS, key, fn, suffix, multiArgs);
            });
            util.notEnumerableProp(promisified, "__isPromisified__", true);
            obj2[promisifiedKey] = promisified;
          }
        }
        util.toFastProperties(obj2);
        return obj2;
      }
      function promisify(callback, receiver2, multiArgs) {
        return makeNodePromisified(callback, receiver2, void 0, callback, null, multiArgs);
      }
      Promise2.promisify = function(fn, options) {
        if (typeof fn !== "function") {
          throw new TypeError2("expecting a function but got " + util.classString(fn));
        }
        if (isPromisified(fn)) {
          return fn;
        }
        options = Object(options);
        var receiver2 = options.context === void 0 ? THIS : options.context;
        var multiArgs = !!options.multiArgs;
        var ret2 = promisify(fn, receiver2, multiArgs);
        util.copyDescriptors(fn, ret2, propsFilter);
        return ret2;
      };
      Promise2.promisifyAll = function(target, options) {
        if (typeof target !== "function" && typeof target !== "object") {
          throw new TypeError2("the target of promisifyAll must be an object or a function\n\n    See http://goo.gl/MqrFmX\n");
        }
        options = Object(options);
        var multiArgs = !!options.multiArgs;
        var suffix = options.suffix;
        if (typeof suffix !== "string")
          suffix = defaultSuffix;
        var filter = options.filter;
        if (typeof filter !== "function")
          filter = defaultFilter;
        var promisifier = options.promisifier;
        if (typeof promisifier !== "function")
          promisifier = makeNodePromisified;
        if (!util.isIdentifier(suffix)) {
          throw new RangeError("suffix must be a valid identifier\n\n    See http://goo.gl/MqrFmX\n");
        }
        var keys = util.inheritedDataKeys(target);
        for (var i = 0; i < keys.length; ++i) {
          var value = target[keys[i]];
          if (keys[i] !== "constructor" && util.isClass(value)) {
            promisifyAll(value.prototype, suffix, filter, promisifier, multiArgs);
            promisifyAll(value, suffix, filter, promisifier, multiArgs);
          }
        }
        return promisifyAll(target, suffix, filter, promisifier, multiArgs);
      };
    };
  }
});

// netlify/functions/node_modules/bluebird/js/release/props.js
var require_props = __commonJS({
  "netlify/functions/node_modules/bluebird/js/release/props.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, PromiseArray, tryConvertToPromise, apiRejection) {
      var util = require_util();
      var isObject2 = util.isObject;
      var es52 = require_es5();
      var Es6Map;
      if (typeof Map === "function")
        Es6Map = Map;
      var mapToEntries = function() {
        var index = 0;
        var size = 0;
        function extractEntry(value, key) {
          this[index] = value;
          this[index + size] = key;
          index++;
        }
        return function mapToEntries2(map) {
          size = map.size;
          index = 0;
          var ret2 = new Array(map.size * 2);
          map.forEach(extractEntry, ret2);
          return ret2;
        };
      }();
      var entriesToMap = function(entries) {
        var ret2 = new Es6Map();
        var length = entries.length / 2 | 0;
        for (var i = 0; i < length; ++i) {
          var key = entries[length + i];
          var value = entries[i];
          ret2.set(key, value);
        }
        return ret2;
      };
      function PropertiesPromiseArray(obj2) {
        var isMap = false;
        var entries;
        if (Es6Map !== void 0 && obj2 instanceof Es6Map) {
          entries = mapToEntries(obj2);
          isMap = true;
        } else {
          var keys = es52.keys(obj2);
          var len = keys.length;
          entries = new Array(len * 2);
          for (var i = 0; i < len; ++i) {
            var key = keys[i];
            entries[i] = obj2[key];
            entries[i + len] = key;
          }
        }
        this.constructor$(entries);
        this._isMap = isMap;
        this._init$(void 0, isMap ? -6 : -3);
      }
      util.inherits(PropertiesPromiseArray, PromiseArray);
      PropertiesPromiseArray.prototype._init = function() {
      };
      PropertiesPromiseArray.prototype._promiseFulfilled = function(value, index) {
        this._values[index] = value;
        var totalResolved = ++this._totalResolved;
        if (totalResolved >= this._length) {
          var val;
          if (this._isMap) {
            val = entriesToMap(this._values);
          } else {
            val = {};
            var keyOffset = this.length();
            for (var i = 0, len = this.length(); i < len; ++i) {
              val[this._values[i + keyOffset]] = this._values[i];
            }
          }
          this._resolve(val);
          return true;
        }
        return false;
      };
      PropertiesPromiseArray.prototype.shouldCopyValues = function() {
        return false;
      };
      PropertiesPromiseArray.prototype.getActualLength = function(len) {
        return len >> 1;
      };
      function props(promises) {
        var ret2;
        var castValue = tryConvertToPromise(promises);
        if (!isObject2(castValue)) {
          return apiRejection("cannot await properties of a non-object\n\n    See http://goo.gl/MqrFmX\n");
        } else if (castValue instanceof Promise2) {
          ret2 = castValue._then(Promise2.props, void 0, void 0, void 0, void 0);
        } else {
          ret2 = new PropertiesPromiseArray(castValue).promise();
        }
        if (castValue instanceof Promise2) {
          ret2._propagateFrom(castValue, 2);
        }
        return ret2;
      }
      Promise2.prototype.props = function() {
        return props(this);
      };
      Promise2.props = function(promises) {
        return props(promises);
      };
    };
  }
});

// netlify/functions/node_modules/bluebird/js/release/race.js
var require_race = __commonJS({
  "netlify/functions/node_modules/bluebird/js/release/race.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, INTERNAL, tryConvertToPromise, apiRejection) {
      var util = require_util();
      var raceLater = function(promise) {
        return promise.then(function(array) {
          return race(array, promise);
        });
      };
      function race(promises, parent) {
        var maybePromise = tryConvertToPromise(promises);
        if (maybePromise instanceof Promise2) {
          return raceLater(maybePromise);
        } else {
          promises = util.asArray(promises);
          if (promises === null)
            return apiRejection("expecting an array or an iterable object but got " + util.classString(promises));
        }
        var ret2 = new Promise2(INTERNAL);
        if (parent !== void 0) {
          ret2._propagateFrom(parent, 3);
        }
        var fulfill = ret2._fulfill;
        var reject = ret2._reject;
        for (var i = 0, len = promises.length; i < len; ++i) {
          var val = promises[i];
          if (val === void 0 && !(i in promises)) {
            continue;
          }
          Promise2.cast(val)._then(fulfill, reject, void 0, ret2, null);
        }
        return ret2;
      }
      Promise2.race = function(promises) {
        return race(promises, void 0);
      };
      Promise2.prototype.race = function() {
        return race(this, void 0);
      };
    };
  }
});

// netlify/functions/node_modules/bluebird/js/release/reduce.js
var require_reduce = __commonJS({
  "netlify/functions/node_modules/bluebird/js/release/reduce.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug) {
      var util = require_util();
      var tryCatch2 = util.tryCatch;
      function ReductionPromiseArray(promises, fn, initialValue, _each) {
        this.constructor$(promises);
        var context = Promise2._getContext();
        this._fn = util.contextBind(context, fn);
        if (initialValue !== void 0) {
          initialValue = Promise2.resolve(initialValue);
          initialValue._attachCancellationCallback(this);
        }
        this._initialValue = initialValue;
        this._currentCancellable = null;
        if (_each === INTERNAL) {
          this._eachValues = Array(this._length);
        } else if (_each === 0) {
          this._eachValues = null;
        } else {
          this._eachValues = void 0;
        }
        this._promise._captureStackTrace();
        this._init$(void 0, -5);
      }
      util.inherits(ReductionPromiseArray, PromiseArray);
      ReductionPromiseArray.prototype._gotAccum = function(accum) {
        if (this._eachValues !== void 0 && this._eachValues !== null && accum !== INTERNAL) {
          this._eachValues.push(accum);
        }
      };
      ReductionPromiseArray.prototype._eachComplete = function(value) {
        if (this._eachValues !== null) {
          this._eachValues.push(value);
        }
        return this._eachValues;
      };
      ReductionPromiseArray.prototype._init = function() {
      };
      ReductionPromiseArray.prototype._resolveEmptyArray = function() {
        this._resolve(this._eachValues !== void 0 ? this._eachValues : this._initialValue);
      };
      ReductionPromiseArray.prototype.shouldCopyValues = function() {
        return false;
      };
      ReductionPromiseArray.prototype._resolve = function(value) {
        this._promise._resolveCallback(value);
        this._values = null;
      };
      ReductionPromiseArray.prototype._resultCancelled = function(sender) {
        if (sender === this._initialValue)
          return this._cancel();
        if (this._isResolved())
          return;
        this._resultCancelled$();
        if (this._currentCancellable instanceof Promise2) {
          this._currentCancellable.cancel();
        }
        if (this._initialValue instanceof Promise2) {
          this._initialValue.cancel();
        }
      };
      ReductionPromiseArray.prototype._iterate = function(values) {
        this._values = values;
        var value;
        var i;
        var length = values.length;
        if (this._initialValue !== void 0) {
          value = this._initialValue;
          i = 0;
        } else {
          value = Promise2.resolve(values[0]);
          i = 1;
        }
        this._currentCancellable = value;
        for (var j = i; j < length; ++j) {
          var maybePromise = values[j];
          if (maybePromise instanceof Promise2) {
            maybePromise.suppressUnhandledRejections();
          }
        }
        if (!value.isRejected()) {
          for (; i < length; ++i) {
            var ctx = {
              accum: null,
              value: values[i],
              index: i,
              length,
              array: this
            };
            value = value._then(gotAccum, void 0, void 0, ctx, void 0);
            if ((i & 127) === 0) {
              value._setNoAsyncGuarantee();
            }
          }
        }
        if (this._eachValues !== void 0) {
          value = value._then(this._eachComplete, void 0, void 0, this, void 0);
        }
        value._then(completed, completed, void 0, value, this);
      };
      Promise2.prototype.reduce = function(fn, initialValue) {
        return reduce(this, fn, initialValue, null);
      };
      Promise2.reduce = function(promises, fn, initialValue, _each) {
        return reduce(promises, fn, initialValue, _each);
      };
      function completed(valueOrReason, array) {
        if (this.isFulfilled()) {
          array._resolve(valueOrReason);
        } else {
          array._reject(valueOrReason);
        }
      }
      function reduce(promises, fn, initialValue, _each) {
        if (typeof fn !== "function") {
          return apiRejection("expecting a function but got " + util.classString(fn));
        }
        var array = new ReductionPromiseArray(promises, fn, initialValue, _each);
        return array.promise();
      }
      function gotAccum(accum) {
        this.accum = accum;
        this.array._gotAccum(accum);
        var value = tryConvertToPromise(this.value, this.array._promise);
        if (value instanceof Promise2) {
          this.array._currentCancellable = value;
          return value._then(gotValue, void 0, void 0, this, void 0);
        } else {
          return gotValue.call(this, value);
        }
      }
      function gotValue(value) {
        var array = this.array;
        var promise = array._promise;
        var fn = tryCatch2(array._fn);
        promise._pushContext();
        var ret2;
        if (array._eachValues !== void 0) {
          ret2 = fn.call(promise._boundValue(), value, this.index, this.length);
        } else {
          ret2 = fn.call(promise._boundValue(), this.accum, value, this.index, this.length);
        }
        if (ret2 instanceof Promise2) {
          array._currentCancellable = ret2;
        }
        var promiseCreated = promise._popContext();
        debug.checkForgottenReturns(ret2, promiseCreated, array._eachValues !== void 0 ? "Promise.each" : "Promise.reduce", promise);
        return ret2;
      }
    };
  }
});

// netlify/functions/node_modules/bluebird/js/release/settle.js
var require_settle = __commonJS({
  "netlify/functions/node_modules/bluebird/js/release/settle.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, PromiseArray, debug) {
      var PromiseInspection = Promise2.PromiseInspection;
      var util = require_util();
      function SettledPromiseArray(values) {
        this.constructor$(values);
      }
      util.inherits(SettledPromiseArray, PromiseArray);
      SettledPromiseArray.prototype._promiseResolved = function(index, inspection) {
        this._values[index] = inspection;
        var totalResolved = ++this._totalResolved;
        if (totalResolved >= this._length) {
          this._resolve(this._values);
          return true;
        }
        return false;
      };
      SettledPromiseArray.prototype._promiseFulfilled = function(value, index) {
        var ret2 = new PromiseInspection();
        ret2._bitField = 33554432;
        ret2._settledValueField = value;
        return this._promiseResolved(index, ret2);
      };
      SettledPromiseArray.prototype._promiseRejected = function(reason, index) {
        var ret2 = new PromiseInspection();
        ret2._bitField = 16777216;
        ret2._settledValueField = reason;
        return this._promiseResolved(index, ret2);
      };
      Promise2.settle = function(promises) {
        debug.deprecated(".settle()", ".reflect()");
        return new SettledPromiseArray(promises).promise();
      };
      Promise2.allSettled = function(promises) {
        return new SettledPromiseArray(promises).promise();
      };
      Promise2.prototype.settle = function() {
        return Promise2.settle(this);
      };
    };
  }
});

// netlify/functions/node_modules/bluebird/js/release/some.js
var require_some = __commonJS({
  "netlify/functions/node_modules/bluebird/js/release/some.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, PromiseArray, apiRejection) {
      var util = require_util();
      var RangeError2 = require_errors().RangeError;
      var AggregateError2 = require_errors().AggregateError;
      var isArray = util.isArray;
      var CANCELLATION = {};
      function SomePromiseArray(values) {
        this.constructor$(values);
        this._howMany = 0;
        this._unwrap = false;
        this._initialized = false;
      }
      util.inherits(SomePromiseArray, PromiseArray);
      SomePromiseArray.prototype._init = function() {
        if (!this._initialized) {
          return;
        }
        if (this._howMany === 0) {
          this._resolve([]);
          return;
        }
        this._init$(void 0, -5);
        var isArrayResolved = isArray(this._values);
        if (!this._isResolved() && isArrayResolved && this._howMany > this._canPossiblyFulfill()) {
          this._reject(this._getRangeError(this.length()));
        }
      };
      SomePromiseArray.prototype.init = function() {
        this._initialized = true;
        this._init();
      };
      SomePromiseArray.prototype.setUnwrap = function() {
        this._unwrap = true;
      };
      SomePromiseArray.prototype.howMany = function() {
        return this._howMany;
      };
      SomePromiseArray.prototype.setHowMany = function(count) {
        this._howMany = count;
      };
      SomePromiseArray.prototype._promiseFulfilled = function(value) {
        this._addFulfilled(value);
        if (this._fulfilled() === this.howMany()) {
          this._values.length = this.howMany();
          if (this.howMany() === 1 && this._unwrap) {
            this._resolve(this._values[0]);
          } else {
            this._resolve(this._values);
          }
          return true;
        }
        return false;
      };
      SomePromiseArray.prototype._promiseRejected = function(reason) {
        this._addRejected(reason);
        return this._checkOutcome();
      };
      SomePromiseArray.prototype._promiseCancelled = function() {
        if (this._values instanceof Promise2 || this._values == null) {
          return this._cancel();
        }
        this._addRejected(CANCELLATION);
        return this._checkOutcome();
      };
      SomePromiseArray.prototype._checkOutcome = function() {
        if (this.howMany() > this._canPossiblyFulfill()) {
          var e = new AggregateError2();
          for (var i = this.length(); i < this._values.length; ++i) {
            if (this._values[i] !== CANCELLATION) {
              e.push(this._values[i]);
            }
          }
          if (e.length > 0) {
            this._reject(e);
          } else {
            this._cancel();
          }
          return true;
        }
        return false;
      };
      SomePromiseArray.prototype._fulfilled = function() {
        return this._totalResolved;
      };
      SomePromiseArray.prototype._rejected = function() {
        return this._values.length - this.length();
      };
      SomePromiseArray.prototype._addRejected = function(reason) {
        this._values.push(reason);
      };
      SomePromiseArray.prototype._addFulfilled = function(value) {
        this._values[this._totalResolved++] = value;
      };
      SomePromiseArray.prototype._canPossiblyFulfill = function() {
        return this.length() - this._rejected();
      };
      SomePromiseArray.prototype._getRangeError = function(count) {
        var message = "Input array must contain at least " + this._howMany + " items but contains only " + count + " items";
        return new RangeError2(message);
      };
      SomePromiseArray.prototype._resolveEmptyArray = function() {
        this._reject(this._getRangeError(0));
      };
      function some(promises, howMany) {
        if ((howMany | 0) !== howMany || howMany < 0) {
          return apiRejection("expecting a positive integer\n\n    See http://goo.gl/MqrFmX\n");
        }
        var ret2 = new SomePromiseArray(promises);
        var promise = ret2.promise();
        ret2.setHowMany(howMany);
        ret2.init();
        return promise;
      }
      Promise2.some = function(promises, howMany) {
        return some(promises, howMany);
      };
      Promise2.prototype.some = function(howMany) {
        return some(this, howMany);
      };
      Promise2._SomePromiseArray = SomePromiseArray;
    };
  }
});

// netlify/functions/node_modules/bluebird/js/release/timers.js
var require_timers = __commonJS({
  "netlify/functions/node_modules/bluebird/js/release/timers.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, INTERNAL, debug) {
      var util = require_util();
      var TimeoutError = Promise2.TimeoutError;
      function HandleWrapper(handle) {
        this.handle = handle;
      }
      HandleWrapper.prototype._resultCancelled = function() {
        clearTimeout(this.handle);
      };
      var afterValue = function(value) {
        return delay(+this).thenReturn(value);
      };
      var delay = Promise2.delay = function(ms, value) {
        var ret2;
        var handle;
        if (value !== void 0) {
          ret2 = Promise2.resolve(value)._then(afterValue, null, null, ms, void 0);
          if (debug.cancellation() && value instanceof Promise2) {
            ret2._setOnCancel(value);
          }
        } else {
          ret2 = new Promise2(INTERNAL);
          handle = setTimeout(function() {
            ret2._fulfill();
          }, +ms);
          if (debug.cancellation()) {
            ret2._setOnCancel(new HandleWrapper(handle));
          }
          ret2._captureStackTrace();
        }
        ret2._setAsyncGuaranteed();
        return ret2;
      };
      Promise2.prototype.delay = function(ms) {
        return delay(ms, this);
      };
      var afterTimeout = function(promise, message, parent) {
        var err;
        if (typeof message !== "string") {
          if (message instanceof Error) {
            err = message;
          } else {
            err = new TimeoutError("operation timed out");
          }
        } else {
          err = new TimeoutError(message);
        }
        util.markAsOriginatingFromRejection(err);
        promise._attachExtraTrace(err);
        promise._reject(err);
        if (parent != null) {
          parent.cancel();
        }
      };
      function successClear(value) {
        clearTimeout(this.handle);
        return value;
      }
      function failureClear(reason) {
        clearTimeout(this.handle);
        throw reason;
      }
      Promise2.prototype.timeout = function(ms, message) {
        ms = +ms;
        var ret2, parent;
        var handleWrapper = new HandleWrapper(setTimeout(function timeoutTimeout() {
          if (ret2.isPending()) {
            afterTimeout(ret2, message, parent);
          }
        }, ms));
        if (debug.cancellation()) {
          parent = this.then();
          ret2 = parent._then(successClear, failureClear, void 0, handleWrapper, void 0);
          ret2._setOnCancel(handleWrapper);
        } else {
          ret2 = this._then(successClear, failureClear, void 0, handleWrapper, void 0);
        }
        return ret2;
      };
    };
  }
});

// netlify/functions/node_modules/bluebird/js/release/using.js
var require_using = __commonJS({
  "netlify/functions/node_modules/bluebird/js/release/using.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, apiRejection, tryConvertToPromise, createContext, INTERNAL, debug) {
      var util = require_util();
      var TypeError2 = require_errors().TypeError;
      var inherits2 = require_util().inherits;
      var errorObj2 = util.errorObj;
      var tryCatch2 = util.tryCatch;
      var NULL = {};
      function thrower2(e) {
        setTimeout(function() {
          throw e;
        }, 0);
      }
      function castPreservingDisposable(thenable) {
        var maybePromise = tryConvertToPromise(thenable);
        if (maybePromise !== thenable && typeof thenable._isDisposable === "function" && typeof thenable._getDisposer === "function" && thenable._isDisposable()) {
          maybePromise._setDisposable(thenable._getDisposer());
        }
        return maybePromise;
      }
      function dispose(resources, inspection) {
        var i = 0;
        var len = resources.length;
        var ret2 = new Promise2(INTERNAL);
        function iterator() {
          if (i >= len)
            return ret2._fulfill();
          var maybePromise = castPreservingDisposable(resources[i++]);
          if (maybePromise instanceof Promise2 && maybePromise._isDisposable()) {
            try {
              maybePromise = tryConvertToPromise(maybePromise._getDisposer().tryDispose(inspection), resources.promise);
            } catch (e) {
              return thrower2(e);
            }
            if (maybePromise instanceof Promise2) {
              return maybePromise._then(iterator, thrower2, null, null, null);
            }
          }
          iterator();
        }
        iterator();
        return ret2;
      }
      function Disposer(data, promise, context) {
        this._data = data;
        this._promise = promise;
        this._context = context;
      }
      Disposer.prototype.data = function() {
        return this._data;
      };
      Disposer.prototype.promise = function() {
        return this._promise;
      };
      Disposer.prototype.resource = function() {
        if (this.promise().isFulfilled()) {
          return this.promise().value();
        }
        return NULL;
      };
      Disposer.prototype.tryDispose = function(inspection) {
        var resource = this.resource();
        var context = this._context;
        if (context !== void 0)
          context._pushContext();
        var ret2 = resource !== NULL ? this.doDispose(resource, inspection) : null;
        if (context !== void 0)
          context._popContext();
        this._promise._unsetDisposable();
        this._data = null;
        return ret2;
      };
      Disposer.isDisposer = function(d) {
        return d != null && typeof d.resource === "function" && typeof d.tryDispose === "function";
      };
      function FunctionDisposer(fn, promise, context) {
        this.constructor$(fn, promise, context);
      }
      inherits2(FunctionDisposer, Disposer);
      FunctionDisposer.prototype.doDispose = function(resource, inspection) {
        var fn = this.data();
        return fn.call(resource, resource, inspection);
      };
      function maybeUnwrapDisposer(value) {
        if (Disposer.isDisposer(value)) {
          this.resources[this.index]._setDisposable(value);
          return value.promise();
        }
        return value;
      }
      function ResourceList(length) {
        this.length = length;
        this.promise = null;
        this[length - 1] = null;
      }
      ResourceList.prototype._resultCancelled = function() {
        var len = this.length;
        for (var i = 0; i < len; ++i) {
          var item = this[i];
          if (item instanceof Promise2) {
            item.cancel();
          }
        }
      };
      Promise2.using = function() {
        var len = arguments.length;
        if (len < 2)
          return apiRejection("you must pass at least 2 arguments to Promise.using");
        var fn = arguments[len - 1];
        if (typeof fn !== "function") {
          return apiRejection("expecting a function but got " + util.classString(fn));
        }
        var input;
        var spreadArgs = true;
        if (len === 2 && Array.isArray(arguments[0])) {
          input = arguments[0];
          len = input.length;
          spreadArgs = false;
        } else {
          input = arguments;
          len--;
        }
        var resources = new ResourceList(len);
        for (var i = 0; i < len; ++i) {
          var resource = input[i];
          if (Disposer.isDisposer(resource)) {
            var disposer = resource;
            resource = resource.promise();
            resource._setDisposable(disposer);
          } else {
            var maybePromise = tryConvertToPromise(resource);
            if (maybePromise instanceof Promise2) {
              resource = maybePromise._then(maybeUnwrapDisposer, null, null, {
                resources,
                index: i
              }, void 0);
            }
          }
          resources[i] = resource;
        }
        var reflectedResources = new Array(resources.length);
        for (var i = 0; i < reflectedResources.length; ++i) {
          reflectedResources[i] = Promise2.resolve(resources[i]).reflect();
        }
        var resultPromise = Promise2.all(reflectedResources).then(function(inspections) {
          for (var i2 = 0; i2 < inspections.length; ++i2) {
            var inspection = inspections[i2];
            if (inspection.isRejected()) {
              errorObj2.e = inspection.error();
              return errorObj2;
            } else if (!inspection.isFulfilled()) {
              resultPromise.cancel();
              return;
            }
            inspections[i2] = inspection.value();
          }
          promise._pushContext();
          fn = tryCatch2(fn);
          var ret2 = spreadArgs ? fn.apply(void 0, inspections) : fn(inspections);
          var promiseCreated = promise._popContext();
          debug.checkForgottenReturns(ret2, promiseCreated, "Promise.using", promise);
          return ret2;
        });
        var promise = resultPromise.lastly(function() {
          var inspection = new Promise2.PromiseInspection(resultPromise);
          return dispose(resources, inspection);
        });
        resources.promise = promise;
        promise._setOnCancel(resources);
        return promise;
      };
      Promise2.prototype._setDisposable = function(disposer) {
        this._bitField = this._bitField | 131072;
        this._disposer = disposer;
      };
      Promise2.prototype._isDisposable = function() {
        return (this._bitField & 131072) > 0;
      };
      Promise2.prototype._getDisposer = function() {
        return this._disposer;
      };
      Promise2.prototype._unsetDisposable = function() {
        this._bitField = this._bitField & ~131072;
        this._disposer = void 0;
      };
      Promise2.prototype.disposer = function(fn) {
        if (typeof fn === "function") {
          return new FunctionDisposer(fn, this, createContext());
        }
        throw new TypeError2();
      };
    };
  }
});

// netlify/functions/node_modules/bluebird/js/release/any.js
var require_any = __commonJS({
  "netlify/functions/node_modules/bluebird/js/release/any.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2) {
      var SomePromiseArray = Promise2._SomePromiseArray;
      function any(promises) {
        var ret2 = new SomePromiseArray(promises);
        var promise = ret2.promise();
        ret2.setHowMany(1);
        ret2.setUnwrap();
        ret2.init();
        return promise;
      }
      Promise2.any = function(promises) {
        return any(promises);
      };
      Promise2.prototype.any = function() {
        return any(this);
      };
    };
  }
});

// netlify/functions/node_modules/bluebird/js/release/each.js
var require_each = __commonJS({
  "netlify/functions/node_modules/bluebird/js/release/each.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, INTERNAL) {
      var PromiseReduce = Promise2.reduce;
      var PromiseAll = Promise2.all;
      function promiseAllThis() {
        return PromiseAll(this);
      }
      function PromiseMapSeries(promises, fn) {
        return PromiseReduce(promises, fn, INTERNAL, INTERNAL);
      }
      Promise2.prototype.each = function(fn) {
        return PromiseReduce(this, fn, INTERNAL, 0)._then(promiseAllThis, void 0, void 0, this, void 0);
      };
      Promise2.prototype.mapSeries = function(fn) {
        return PromiseReduce(this, fn, INTERNAL, INTERNAL);
      };
      Promise2.each = function(promises, fn) {
        return PromiseReduce(promises, fn, INTERNAL, 0)._then(promiseAllThis, void 0, void 0, promises, void 0);
      };
      Promise2.mapSeries = PromiseMapSeries;
    };
  }
});

// netlify/functions/node_modules/bluebird/js/release/filter.js
var require_filter = __commonJS({
  "netlify/functions/node_modules/bluebird/js/release/filter.js"(exports2, module2) {
    "use strict";
    module2.exports = function(Promise2, INTERNAL) {
      var PromiseMap = Promise2.map;
      Promise2.prototype.filter = function(fn, options) {
        return PromiseMap(this, fn, options, INTERNAL);
      };
      Promise2.filter = function(promises, fn, options) {
        return PromiseMap(promises, fn, options, INTERNAL);
      };
    };
  }
});

// netlify/functions/node_modules/bluebird/js/release/promise.js
var require_promise = __commonJS({
  "netlify/functions/node_modules/bluebird/js/release/promise.js"(exports2, module2) {
    "use strict";
    module2.exports = function() {
      var makeSelfResolutionError = function() {
        return new TypeError2("circular promise resolution chain\n\n    See http://goo.gl/MqrFmX\n");
      };
      var reflectHandler2 = function() {
        return new Promise2.PromiseInspection(this._target());
      };
      var apiRejection = function(msg) {
        return Promise2.reject(new TypeError2(msg));
      };
      function Proxyable() {
      }
      var UNDEFINED_BINDING = {};
      var util = require_util();
      util.setReflectHandler(reflectHandler2);
      var getDomain = function() {
        var domain = process.domain;
        if (domain === void 0) {
          return null;
        }
        return domain;
      };
      var getContextDefault = function() {
        return null;
      };
      var getContextDomain = function() {
        return {
          domain: getDomain(),
          async: null
        };
      };
      var AsyncResource = util.isNode && util.nodeSupportsAsyncResource ? require("async_hooks").AsyncResource : null;
      var getContextAsyncHooks = function() {
        return {
          domain: getDomain(),
          async: new AsyncResource("Bluebird::Promise")
        };
      };
      var getContext = util.isNode ? getContextDomain : getContextDefault;
      util.notEnumerableProp(Promise2, "_getContext", getContext);
      var enableAsyncHooks = function() {
        getContext = getContextAsyncHooks;
        util.notEnumerableProp(Promise2, "_getContext", getContextAsyncHooks);
      };
      var disableAsyncHooks = function() {
        getContext = getContextDomain;
        util.notEnumerableProp(Promise2, "_getContext", getContextDomain);
      };
      var es52 = require_es5();
      var Async = require_async();
      var async = new Async();
      es52.defineProperty(Promise2, "_async", { value: async });
      var errors = require_errors();
      var TypeError2 = Promise2.TypeError = errors.TypeError;
      Promise2.RangeError = errors.RangeError;
      var CancellationError = Promise2.CancellationError = errors.CancellationError;
      Promise2.TimeoutError = errors.TimeoutError;
      Promise2.OperationalError = errors.OperationalError;
      Promise2.RejectionError = errors.OperationalError;
      Promise2.AggregateError = errors.AggregateError;
      var INTERNAL = function() {
      };
      var APPLY = {};
      var NEXT_FILTER = {};
      var tryConvertToPromise = require_thenables()(Promise2, INTERNAL);
      var PromiseArray = require_promise_array()(Promise2, INTERNAL, tryConvertToPromise, apiRejection, Proxyable);
      var Context = require_context()(Promise2);
      var createContext = Context.create;
      var debug = require_debuggability()(Promise2, Context, enableAsyncHooks, disableAsyncHooks);
      var CapturedTrace = debug.CapturedTrace;
      var PassThroughHandlerContext = require_finally()(Promise2, tryConvertToPromise, NEXT_FILTER);
      var catchFilter = require_catch_filter()(NEXT_FILTER);
      var nodebackForPromise = require_nodeback();
      var errorObj2 = util.errorObj;
      var tryCatch2 = util.tryCatch;
      function check(self2, executor) {
        if (self2 == null || self2.constructor !== Promise2) {
          throw new TypeError2("the promise constructor cannot be invoked directly\n\n    See http://goo.gl/MqrFmX\n");
        }
        if (typeof executor !== "function") {
          throw new TypeError2("expecting a function but got " + util.classString(executor));
        }
      }
      function Promise2(executor) {
        if (executor !== INTERNAL) {
          check(this, executor);
        }
        this._bitField = 0;
        this._fulfillmentHandler0 = void 0;
        this._rejectionHandler0 = void 0;
        this._promise0 = void 0;
        this._receiver0 = void 0;
        this._resolveFromExecutor(executor);
        this._promiseCreated();
        this._fireEvent("promiseCreated", this);
      }
      Promise2.prototype.toString = function() {
        return "[object Promise]";
      };
      Promise2.prototype.caught = Promise2.prototype["catch"] = function(fn) {
        var len = arguments.length;
        if (len > 1) {
          var catchInstances = new Array(len - 1), j = 0, i;
          for (i = 0; i < len - 1; ++i) {
            var item = arguments[i];
            if (util.isObject(item)) {
              catchInstances[j++] = item;
            } else {
              return apiRejection("Catch statement predicate: expecting an object but got " + util.classString(item));
            }
          }
          catchInstances.length = j;
          fn = arguments[i];
          if (typeof fn !== "function") {
            throw new TypeError2("The last argument to .catch() must be a function, got " + util.toString(fn));
          }
          return this.then(void 0, catchFilter(catchInstances, fn, this));
        }
        return this.then(void 0, fn);
      };
      Promise2.prototype.reflect = function() {
        return this._then(reflectHandler2, reflectHandler2, void 0, this, void 0);
      };
      Promise2.prototype.then = function(didFulfill, didReject) {
        if (debug.warnings() && arguments.length > 0 && typeof didFulfill !== "function" && typeof didReject !== "function") {
          var msg = ".then() only accepts functions but was passed: " + util.classString(didFulfill);
          if (arguments.length > 1) {
            msg += ", " + util.classString(didReject);
          }
          this._warn(msg);
        }
        return this._then(didFulfill, didReject, void 0, void 0, void 0);
      };
      Promise2.prototype.done = function(didFulfill, didReject) {
        var promise = this._then(didFulfill, didReject, void 0, void 0, void 0);
        promise._setIsFinal();
      };
      Promise2.prototype.spread = function(fn) {
        if (typeof fn !== "function") {
          return apiRejection("expecting a function but got " + util.classString(fn));
        }
        return this.all()._then(fn, void 0, void 0, APPLY, void 0);
      };
      Promise2.prototype.toJSON = function() {
        var ret2 = {
          isFulfilled: false,
          isRejected: false,
          fulfillmentValue: void 0,
          rejectionReason: void 0
        };
        if (this.isFulfilled()) {
          ret2.fulfillmentValue = this.value();
          ret2.isFulfilled = true;
        } else if (this.isRejected()) {
          ret2.rejectionReason = this.reason();
          ret2.isRejected = true;
        }
        return ret2;
      };
      Promise2.prototype.all = function() {
        if (arguments.length > 0) {
          this._warn(".all() was passed arguments but it does not take any");
        }
        return new PromiseArray(this).promise();
      };
      Promise2.prototype.error = function(fn) {
        return this.caught(util.originatesFromRejection, fn);
      };
      Promise2.getNewLibraryCopy = module2.exports;
      Promise2.is = function(val) {
        return val instanceof Promise2;
      };
      Promise2.fromNode = Promise2.fromCallback = function(fn) {
        var ret2 = new Promise2(INTERNAL);
        ret2._captureStackTrace();
        var multiArgs = arguments.length > 1 ? !!Object(arguments[1]).multiArgs : false;
        var result = tryCatch2(fn)(nodebackForPromise(ret2, multiArgs));
        if (result === errorObj2) {
          ret2._rejectCallback(result.e, true);
        }
        if (!ret2._isFateSealed())
          ret2._setAsyncGuaranteed();
        return ret2;
      };
      Promise2.all = function(promises) {
        return new PromiseArray(promises).promise();
      };
      Promise2.cast = function(obj2) {
        var ret2 = tryConvertToPromise(obj2);
        if (!(ret2 instanceof Promise2)) {
          ret2 = new Promise2(INTERNAL);
          ret2._captureStackTrace();
          ret2._setFulfilled();
          ret2._rejectionHandler0 = obj2;
        }
        return ret2;
      };
      Promise2.resolve = Promise2.fulfilled = Promise2.cast;
      Promise2.reject = Promise2.rejected = function(reason) {
        var ret2 = new Promise2(INTERNAL);
        ret2._captureStackTrace();
        ret2._rejectCallback(reason, true);
        return ret2;
      };
      Promise2.setScheduler = function(fn) {
        if (typeof fn !== "function") {
          throw new TypeError2("expecting a function but got " + util.classString(fn));
        }
        return async.setScheduler(fn);
      };
      Promise2.prototype._then = function(didFulfill, didReject, _, receiver2, internalData) {
        var haveInternalData = internalData !== void 0;
        var promise = haveInternalData ? internalData : new Promise2(INTERNAL);
        var target = this._target();
        var bitField = target._bitField;
        if (!haveInternalData) {
          promise._propagateFrom(this, 3);
          promise._captureStackTrace();
          if (receiver2 === void 0 && (this._bitField & 2097152) !== 0) {
            if (!((bitField & 50397184) === 0)) {
              receiver2 = this._boundValue();
            } else {
              receiver2 = target === this ? void 0 : this._boundTo;
            }
          }
          this._fireEvent("promiseChained", this, promise);
        }
        var context = getContext();
        if (!((bitField & 50397184) === 0)) {
          var handler2, value, settler = target._settlePromiseCtx;
          if ((bitField & 33554432) !== 0) {
            value = target._rejectionHandler0;
            handler2 = didFulfill;
          } else if ((bitField & 16777216) !== 0) {
            value = target._fulfillmentHandler0;
            handler2 = didReject;
            target._unsetRejectionIsUnhandled();
          } else {
            settler = target._settlePromiseLateCancellationObserver;
            value = new CancellationError("late cancellation observer");
            target._attachExtraTrace(value);
            handler2 = didReject;
          }
          async.invoke(settler, target, {
            handler: util.contextBind(context, handler2),
            promise,
            receiver: receiver2,
            value
          });
        } else {
          target._addCallbacks(didFulfill, didReject, promise, receiver2, context);
        }
        return promise;
      };
      Promise2.prototype._length = function() {
        return this._bitField & 65535;
      };
      Promise2.prototype._isFateSealed = function() {
        return (this._bitField & 117506048) !== 0;
      };
      Promise2.prototype._isFollowing = function() {
        return (this._bitField & 67108864) === 67108864;
      };
      Promise2.prototype._setLength = function(len) {
        this._bitField = this._bitField & -65536 | len & 65535;
      };
      Promise2.prototype._setFulfilled = function() {
        this._bitField = this._bitField | 33554432;
        this._fireEvent("promiseFulfilled", this);
      };
      Promise2.prototype._setRejected = function() {
        this._bitField = this._bitField | 16777216;
        this._fireEvent("promiseRejected", this);
      };
      Promise2.prototype._setFollowing = function() {
        this._bitField = this._bitField | 67108864;
        this._fireEvent("promiseResolved", this);
      };
      Promise2.prototype._setIsFinal = function() {
        this._bitField = this._bitField | 4194304;
      };
      Promise2.prototype._isFinal = function() {
        return (this._bitField & 4194304) > 0;
      };
      Promise2.prototype._unsetCancelled = function() {
        this._bitField = this._bitField & ~65536;
      };
      Promise2.prototype._setCancelled = function() {
        this._bitField = this._bitField | 65536;
        this._fireEvent("promiseCancelled", this);
      };
      Promise2.prototype._setWillBeCancelled = function() {
        this._bitField = this._bitField | 8388608;
      };
      Promise2.prototype._setAsyncGuaranteed = function() {
        if (async.hasCustomScheduler())
          return;
        var bitField = this._bitField;
        this._bitField = bitField | (bitField & 536870912) >> 2 ^ 134217728;
      };
      Promise2.prototype._setNoAsyncGuarantee = function() {
        this._bitField = (this._bitField | 536870912) & ~134217728;
      };
      Promise2.prototype._receiverAt = function(index) {
        var ret2 = index === 0 ? this._receiver0 : this[index * 4 - 4 + 3];
        if (ret2 === UNDEFINED_BINDING) {
          return void 0;
        } else if (ret2 === void 0 && this._isBound()) {
          return this._boundValue();
        }
        return ret2;
      };
      Promise2.prototype._promiseAt = function(index) {
        return this[index * 4 - 4 + 2];
      };
      Promise2.prototype._fulfillmentHandlerAt = function(index) {
        return this[index * 4 - 4 + 0];
      };
      Promise2.prototype._rejectionHandlerAt = function(index) {
        return this[index * 4 - 4 + 1];
      };
      Promise2.prototype._boundValue = function() {
      };
      Promise2.prototype._migrateCallback0 = function(follower) {
        var bitField = follower._bitField;
        var fulfill = follower._fulfillmentHandler0;
        var reject = follower._rejectionHandler0;
        var promise = follower._promise0;
        var receiver2 = follower._receiverAt(0);
        if (receiver2 === void 0)
          receiver2 = UNDEFINED_BINDING;
        this._addCallbacks(fulfill, reject, promise, receiver2, null);
      };
      Promise2.prototype._migrateCallbackAt = function(follower, index) {
        var fulfill = follower._fulfillmentHandlerAt(index);
        var reject = follower._rejectionHandlerAt(index);
        var promise = follower._promiseAt(index);
        var receiver2 = follower._receiverAt(index);
        if (receiver2 === void 0)
          receiver2 = UNDEFINED_BINDING;
        this._addCallbacks(fulfill, reject, promise, receiver2, null);
      };
      Promise2.prototype._addCallbacks = function(fulfill, reject, promise, receiver2, context) {
        var index = this._length();
        if (index >= 65535 - 4) {
          index = 0;
          this._setLength(0);
        }
        if (index === 0) {
          this._promise0 = promise;
          this._receiver0 = receiver2;
          if (typeof fulfill === "function") {
            this._fulfillmentHandler0 = util.contextBind(context, fulfill);
          }
          if (typeof reject === "function") {
            this._rejectionHandler0 = util.contextBind(context, reject);
          }
        } else {
          var base = index * 4 - 4;
          this[base + 2] = promise;
          this[base + 3] = receiver2;
          if (typeof fulfill === "function") {
            this[base + 0] = util.contextBind(context, fulfill);
          }
          if (typeof reject === "function") {
            this[base + 1] = util.contextBind(context, reject);
          }
        }
        this._setLength(index + 1);
        return index;
      };
      Promise2.prototype._proxy = function(proxyable, arg) {
        this._addCallbacks(void 0, void 0, arg, proxyable, null);
      };
      Promise2.prototype._resolveCallback = function(value, shouldBind) {
        if ((this._bitField & 117506048) !== 0)
          return;
        if (value === this)
          return this._rejectCallback(makeSelfResolutionError(), false);
        var maybePromise = tryConvertToPromise(value, this);
        if (!(maybePromise instanceof Promise2))
          return this._fulfill(value);
        if (shouldBind)
          this._propagateFrom(maybePromise, 2);
        var promise = maybePromise._target();
        if (promise === this) {
          this._reject(makeSelfResolutionError());
          return;
        }
        var bitField = promise._bitField;
        if ((bitField & 50397184) === 0) {
          var len = this._length();
          if (len > 0)
            promise._migrateCallback0(this);
          for (var i = 1; i < len; ++i) {
            promise._migrateCallbackAt(this, i);
          }
          this._setFollowing();
          this._setLength(0);
          this._setFollowee(maybePromise);
        } else if ((bitField & 33554432) !== 0) {
          this._fulfill(promise._value());
        } else if ((bitField & 16777216) !== 0) {
          this._reject(promise._reason());
        } else {
          var reason = new CancellationError("late cancellation observer");
          promise._attachExtraTrace(reason);
          this._reject(reason);
        }
      };
      Promise2.prototype._rejectCallback = function(reason, synchronous, ignoreNonErrorWarnings) {
        var trace = util.ensureErrorObject(reason);
        var hasStack = trace === reason;
        if (!hasStack && !ignoreNonErrorWarnings && debug.warnings()) {
          var message = "a promise was rejected with a non-error: " + util.classString(reason);
          this._warn(message, true);
        }
        this._attachExtraTrace(trace, synchronous ? hasStack : false);
        this._reject(reason);
      };
      Promise2.prototype._resolveFromExecutor = function(executor) {
        if (executor === INTERNAL)
          return;
        var promise = this;
        this._captureStackTrace();
        this._pushContext();
        var synchronous = true;
        var r = this._execute(executor, function(value) {
          promise._resolveCallback(value);
        }, function(reason) {
          promise._rejectCallback(reason, synchronous);
        });
        synchronous = false;
        this._popContext();
        if (r !== void 0) {
          promise._rejectCallback(r, true);
        }
      };
      Promise2.prototype._settlePromiseFromHandler = function(handler2, receiver2, value, promise) {
        var bitField = promise._bitField;
        if ((bitField & 65536) !== 0)
          return;
        promise._pushContext();
        var x;
        if (receiver2 === APPLY) {
          if (!value || typeof value.length !== "number") {
            x = errorObj2;
            x.e = new TypeError2("cannot .spread() a non-array: " + util.classString(value));
          } else {
            x = tryCatch2(handler2).apply(this._boundValue(), value);
          }
        } else {
          x = tryCatch2(handler2).call(receiver2, value);
        }
        var promiseCreated = promise._popContext();
        bitField = promise._bitField;
        if ((bitField & 65536) !== 0)
          return;
        if (x === NEXT_FILTER) {
          promise._reject(value);
        } else if (x === errorObj2) {
          promise._rejectCallback(x.e, false);
        } else {
          debug.checkForgottenReturns(x, promiseCreated, "", promise, this);
          promise._resolveCallback(x);
        }
      };
      Promise2.prototype._target = function() {
        var ret2 = this;
        while (ret2._isFollowing())
          ret2 = ret2._followee();
        return ret2;
      };
      Promise2.prototype._followee = function() {
        return this._rejectionHandler0;
      };
      Promise2.prototype._setFollowee = function(promise) {
        this._rejectionHandler0 = promise;
      };
      Promise2.prototype._settlePromise = function(promise, handler2, receiver2, value) {
        var isPromise = promise instanceof Promise2;
        var bitField = this._bitField;
        var asyncGuaranteed = (bitField & 134217728) !== 0;
        if ((bitField & 65536) !== 0) {
          if (isPromise)
            promise._invokeInternalOnCancel();
          if (receiver2 instanceof PassThroughHandlerContext && receiver2.isFinallyHandler()) {
            receiver2.cancelPromise = promise;
            if (tryCatch2(handler2).call(receiver2, value) === errorObj2) {
              promise._reject(errorObj2.e);
            }
          } else if (handler2 === reflectHandler2) {
            promise._fulfill(reflectHandler2.call(receiver2));
          } else if (receiver2 instanceof Proxyable) {
            receiver2._promiseCancelled(promise);
          } else if (isPromise || promise instanceof PromiseArray) {
            promise._cancel();
          } else {
            receiver2.cancel();
          }
        } else if (typeof handler2 === "function") {
          if (!isPromise) {
            handler2.call(receiver2, value, promise);
          } else {
            if (asyncGuaranteed)
              promise._setAsyncGuaranteed();
            this._settlePromiseFromHandler(handler2, receiver2, value, promise);
          }
        } else if (receiver2 instanceof Proxyable) {
          if (!receiver2._isResolved()) {
            if ((bitField & 33554432) !== 0) {
              receiver2._promiseFulfilled(value, promise);
            } else {
              receiver2._promiseRejected(value, promise);
            }
          }
        } else if (isPromise) {
          if (asyncGuaranteed)
            promise._setAsyncGuaranteed();
          if ((bitField & 33554432) !== 0) {
            promise._fulfill(value);
          } else {
            promise._reject(value);
          }
        }
      };
      Promise2.prototype._settlePromiseLateCancellationObserver = function(ctx) {
        var handler2 = ctx.handler;
        var promise = ctx.promise;
        var receiver2 = ctx.receiver;
        var value = ctx.value;
        if (typeof handler2 === "function") {
          if (!(promise instanceof Promise2)) {
            handler2.call(receiver2, value, promise);
          } else {
            this._settlePromiseFromHandler(handler2, receiver2, value, promise);
          }
        } else if (promise instanceof Promise2) {
          promise._reject(value);
        }
      };
      Promise2.prototype._settlePromiseCtx = function(ctx) {
        this._settlePromise(ctx.promise, ctx.handler, ctx.receiver, ctx.value);
      };
      Promise2.prototype._settlePromise0 = function(handler2, value, bitField) {
        var promise = this._promise0;
        var receiver2 = this._receiverAt(0);
        this._promise0 = void 0;
        this._receiver0 = void 0;
        this._settlePromise(promise, handler2, receiver2, value);
      };
      Promise2.prototype._clearCallbackDataAtIndex = function(index) {
        var base = index * 4 - 4;
        this[base + 2] = this[base + 3] = this[base + 0] = this[base + 1] = void 0;
      };
      Promise2.prototype._fulfill = function(value) {
        var bitField = this._bitField;
        if ((bitField & 117506048) >>> 16)
          return;
        if (value === this) {
          var err = makeSelfResolutionError();
          this._attachExtraTrace(err);
          return this._reject(err);
        }
        this._setFulfilled();
        this._rejectionHandler0 = value;
        if ((bitField & 65535) > 0) {
          if ((bitField & 134217728) !== 0) {
            this._settlePromises();
          } else {
            async.settlePromises(this);
          }
          this._dereferenceTrace();
        }
      };
      Promise2.prototype._reject = function(reason) {
        var bitField = this._bitField;
        if ((bitField & 117506048) >>> 16)
          return;
        this._setRejected();
        this._fulfillmentHandler0 = reason;
        if (this._isFinal()) {
          return async.fatalError(reason, util.isNode);
        }
        if ((bitField & 65535) > 0) {
          async.settlePromises(this);
        } else {
          this._ensurePossibleRejectionHandled();
        }
      };
      Promise2.prototype._fulfillPromises = function(len, value) {
        for (var i = 1; i < len; i++) {
          var handler2 = this._fulfillmentHandlerAt(i);
          var promise = this._promiseAt(i);
          var receiver2 = this._receiverAt(i);
          this._clearCallbackDataAtIndex(i);
          this._settlePromise(promise, handler2, receiver2, value);
        }
      };
      Promise2.prototype._rejectPromises = function(len, reason) {
        for (var i = 1; i < len; i++) {
          var handler2 = this._rejectionHandlerAt(i);
          var promise = this._promiseAt(i);
          var receiver2 = this._receiverAt(i);
          this._clearCallbackDataAtIndex(i);
          this._settlePromise(promise, handler2, receiver2, reason);
        }
      };
      Promise2.prototype._settlePromises = function() {
        var bitField = this._bitField;
        var len = bitField & 65535;
        if (len > 0) {
          if ((bitField & 16842752) !== 0) {
            var reason = this._fulfillmentHandler0;
            this._settlePromise0(this._rejectionHandler0, reason, bitField);
            this._rejectPromises(len, reason);
          } else {
            var value = this._rejectionHandler0;
            this._settlePromise0(this._fulfillmentHandler0, value, bitField);
            this._fulfillPromises(len, value);
          }
          this._setLength(0);
        }
        this._clearCancellationData();
      };
      Promise2.prototype._settledValue = function() {
        var bitField = this._bitField;
        if ((bitField & 33554432) !== 0) {
          return this._rejectionHandler0;
        } else if ((bitField & 16777216) !== 0) {
          return this._fulfillmentHandler0;
        }
      };
      if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
        es52.defineProperty(Promise2.prototype, Symbol.toStringTag, {
          get: function() {
            return "Object";
          }
        });
      }
      function deferResolve(v) {
        this.promise._resolveCallback(v);
      }
      function deferReject(v) {
        this.promise._rejectCallback(v, false);
      }
      Promise2.defer = Promise2.pending = function() {
        debug.deprecated("Promise.defer", "new Promise");
        var promise = new Promise2(INTERNAL);
        return {
          promise,
          resolve: deferResolve,
          reject: deferReject
        };
      };
      util.notEnumerableProp(Promise2, "_makeSelfResolutionError", makeSelfResolutionError);
      require_method()(Promise2, INTERNAL, tryConvertToPromise, apiRejection, debug);
      require_bind()(Promise2, INTERNAL, tryConvertToPromise, debug);
      require_cancel()(Promise2, PromiseArray, apiRejection, debug);
      require_direct_resolve()(Promise2);
      require_synchronous_inspection()(Promise2);
      require_join()(Promise2, PromiseArray, tryConvertToPromise, INTERNAL, async);
      Promise2.Promise = Promise2;
      Promise2.version = "3.7.2";
      require_call_get()(Promise2);
      require_generators()(Promise2, apiRejection, INTERNAL, tryConvertToPromise, Proxyable, debug);
      require_map()(Promise2, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug);
      require_nodeify()(Promise2);
      require_promisify()(Promise2, INTERNAL);
      require_props()(Promise2, PromiseArray, tryConvertToPromise, apiRejection);
      require_race()(Promise2, INTERNAL, tryConvertToPromise, apiRejection);
      require_reduce()(Promise2, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug);
      require_settle()(Promise2, PromiseArray, debug);
      require_some()(Promise2, PromiseArray, apiRejection);
      require_timers()(Promise2, INTERNAL, debug);
      require_using()(Promise2, apiRejection, tryConvertToPromise, createContext, INTERNAL, debug);
      require_any()(Promise2);
      require_each()(Promise2, INTERNAL);
      require_filter()(Promise2, INTERNAL);
      util.toFastProperties(Promise2);
      util.toFastProperties(Promise2.prototype);
      function fillTypes(value) {
        var p = new Promise2(INTERNAL);
        p._fulfillmentHandler0 = value;
        p._rejectionHandler0 = value;
        p._promise0 = value;
        p._receiver0 = value;
      }
      fillTypes({ a: 1 });
      fillTypes({ b: 2 });
      fillTypes({ c: 3 });
      fillTypes(1);
      fillTypes(function() {
      });
      fillTypes(void 0);
      fillTypes(false);
      fillTypes(new Promise2(INTERNAL));
      debug.setBounds(Async.firstLineError, util.lastLineError);
      return Promise2;
    };
  }
});

// netlify/functions/node_modules/bluebird/js/release/bluebird.js
var require_bluebird = __commonJS({
  "netlify/functions/node_modules/bluebird/js/release/bluebird.js"(exports2, module2) {
    "use strict";
    var old;
    if (typeof Promise !== "undefined")
      old = Promise;
    function noConflict() {
      try {
        if (Promise === bluebird)
          Promise = old;
      } catch (e) {
      }
      return bluebird;
    }
    var bluebird = require_promise()();
    bluebird.noConflict = noConflict;
    module2.exports = bluebird;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/client/access_token.js
var require_access_token = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/client/access_token.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _events = _interopRequireDefault(require("events"));
    function _interopRequireDefault(obj2) {
      return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
    }
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var TOKEN_BUFFER = 10;
    var AccessToken = /* @__PURE__ */ function() {
      function AccessToken2() {
        _classCallCheck(this, AccessToken2);
        this.accessToken;
        this.expiresAt;
      }
      _createClass(AccessToken2, [{
        key: "bearerToken",
        value: function bearerToken(client) {
          var emitter = new _events["default"]();
          var promise = this.promise(emitter);
          this.emitOrLoadAccessToken(client, emitter);
          return promise;
        }
      }, {
        key: "promise",
        value: function promise(emitter) {
          return new Promise(function(resolve, reject) {
            emitter.on("resolve", function(response) {
              return resolve(response);
            });
            emitter.on("reject", function(error) {
              return reject(error);
            });
          });
        }
      }, {
        key: "emitOrLoadAccessToken",
        value: function emitOrLoadAccessToken(client, emitter) {
          if (this.needsLoadOrRefresh()) {
            this.loadAccessToken(client, emitter);
          } else {
            emitter.emit("resolve", this.accessToken);
          }
        }
      }, {
        key: "needsLoadOrRefresh",
        value: function needsLoadOrRefresh() {
          if (!this.accessToken) {
            return true;
          } else if (Date.now() + TOKEN_BUFFER > this.expiresAt) {
            return true;
          } else {
            return false;
          }
        }
      }, {
        key: "loadAccessToken",
        value: function loadAccessToken(client, emitter) {
          var _this = this;
          client.unauthenticatedRequest("POST", "/v1/security/oauth2/token", {
            "grant_type": "client_credentials",
            "client_id": client.clientId,
            "client_secret": client.clientSecret
          }).then(function(response) {
            _this.storeAccessToken(response);
            _this.emitOrLoadAccessToken(client, emitter);
          })["catch"](function(error) {
            emitter.emit("reject", error);
          });
        }
      }, {
        key: "storeAccessToken",
        value: function storeAccessToken(response) {
          this.accessToken = response.result["access_token"];
          this.expiresAt = Date.now() + response.result["expires_in"] * 1e3;
        }
      }]);
      return AccessToken2;
    }();
    var _default = AccessToken;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/client/response.js
var require_response = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/client/response.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var JSON_CONTENT_TYPES = ["application/json", "application/vnd.amadeus+json"];
    var Response = /* @__PURE__ */ function() {
      function Response2(http_response, request) {
        _classCallCheck(this, Response2);
        this.headers = http_response.headers || {};
        this.statusCode = http_response.statusCode;
        this.request = request;
        this.body = "";
        this.result = null;
        this.data = null;
        this.parsed = false;
      }
      _createClass(Response2, [{
        key: "addChunk",
        value: function addChunk(chunk) {
          this.body += chunk;
        }
      }, {
        key: "parse",
        value: function parse() {
          try {
            if (this.statusCode === 204) {
              return;
            }
            if (this.isJson()) {
              this.result = JSON.parse(this.body);
              this.data = this.result.data;
              this.parsed = true;
            } else {
              this.parsed = false;
            }
          } catch (SyntaxError2) {
            this.parsed = false;
          }
        }
      }, {
        key: "success",
        value: function success() {
          if (this.statusCode == 204) {
            return true;
          }
          if (this.parsed && this.statusCode < 300) {
            return true;
          }
        }
      }, {
        key: "isJson",
        value: function isJson() {
          return JSON_CONTENT_TYPES.indexOf(this.headers["content-type"]) !== -1;
        }
      }]);
      return Response2;
    }();
    var _default = Response;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/client/errors.js
var require_errors2 = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/client/errors.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.UnknownError = exports2.ServerError = exports2.ResponseError = exports2.ParserError = exports2.NotFoundError = exports2.NetworkError = exports2.ClientError = exports2.AuthenticationError = void 0;
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _inherits(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
      Object.defineProperty(subClass, "prototype", { writable: false });
      if (superClass)
        _setPrototypeOf(subClass, superClass);
    }
    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
        o2.__proto__ = p2;
        return o2;
      };
      return _setPrototypeOf(o, p);
    }
    function _createSuper(Derived) {
      var hasNativeReflectConstruct = _isNativeReflectConstruct();
      return function _createSuperInternal() {
        var Super = _getPrototypeOf(Derived), result;
        if (hasNativeReflectConstruct) {
          var NewTarget = _getPrototypeOf(this).constructor;
          result = Reflect.construct(Super, arguments, NewTarget);
        } else {
          result = Super.apply(this, arguments);
        }
        return _possibleConstructorReturn(this, result);
      };
    }
    function _possibleConstructorReturn(self2, call) {
      if (call && (_typeof(call) === "object" || typeof call === "function")) {
        return call;
      } else if (call !== void 0) {
        throw new TypeError("Derived constructors may only return object or undefined");
      }
      return _assertThisInitialized(self2);
    }
    function _assertThisInitialized(self2) {
      if (self2 === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }
      return self2;
    }
    function _isNativeReflectConstruct() {
      if (typeof Reflect === "undefined" || !Reflect.construct)
        return false;
      if (Reflect.construct.sham)
        return false;
      if (typeof Proxy === "function")
        return true;
      try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
        }));
        return true;
      } catch (e) {
        return false;
      }
    }
    function _getPrototypeOf(o) {
      _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf2(o2) {
        return o2.__proto__ || Object.getPrototypeOf(o2);
      };
      return _getPrototypeOf(o);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var ResponseError = /* @__PURE__ */ function() {
      function ResponseError2(response) {
        _classCallCheck(this, ResponseError2);
        this.response = response;
        this.determineDescription();
      }
      _createClass(ResponseError2, [{
        key: "determineDescription",
        value: function determineDescription() {
          if (!this.response || !this.response.parsed) {
            this.description = null;
            return;
          }
          var result = this.response.result;
          if (result && result.errors) {
            this.description = result.errors;
          } else if (result) {
            this.description = result;
          }
          return;
        }
      }]);
      return ResponseError2;
    }();
    exports2.ResponseError = ResponseError;
    var NetworkError = /* @__PURE__ */ function(_ResponseError) {
      _inherits(NetworkError2, _ResponseError);
      var _super = _createSuper(NetworkError2);
      function NetworkError2() {
        var _this;
        _classCallCheck(this, NetworkError2);
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        _this = _super.call.apply(_super, [this].concat(args));
        _this.code = "NetworkError";
        return _this;
      }
      return _createClass(NetworkError2);
    }(ResponseError);
    exports2.NetworkError = NetworkError;
    var ParserError = /* @__PURE__ */ function(_ResponseError2) {
      _inherits(ParserError2, _ResponseError2);
      var _super2 = _createSuper(ParserError2);
      function ParserError2() {
        var _this2;
        _classCallCheck(this, ParserError2);
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }
        _this2 = _super2.call.apply(_super2, [this].concat(args));
        _this2.code = "ParserError";
        return _this2;
      }
      return _createClass(ParserError2);
    }(ResponseError);
    exports2.ParserError = ParserError;
    var ServerError = /* @__PURE__ */ function(_ResponseError3) {
      _inherits(ServerError2, _ResponseError3);
      var _super3 = _createSuper(ServerError2);
      function ServerError2() {
        var _this3;
        _classCallCheck(this, ServerError2);
        for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }
        _this3 = _super3.call.apply(_super3, [this].concat(args));
        _this3.code = "ServerError";
        return _this3;
      }
      return _createClass(ServerError2);
    }(ResponseError);
    exports2.ServerError = ServerError;
    var ClientError = /* @__PURE__ */ function(_ResponseError4) {
      _inherits(ClientError2, _ResponseError4);
      var _super4 = _createSuper(ClientError2);
      function ClientError2() {
        var _this4;
        _classCallCheck(this, ClientError2);
        for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          args[_key4] = arguments[_key4];
        }
        _this4 = _super4.call.apply(_super4, [this].concat(args));
        _this4.code = "ClientError";
        return _this4;
      }
      return _createClass(ClientError2);
    }(ResponseError);
    exports2.ClientError = ClientError;
    var AuthenticationError = /* @__PURE__ */ function(_ResponseError5) {
      _inherits(AuthenticationError2, _ResponseError5);
      var _super5 = _createSuper(AuthenticationError2);
      function AuthenticationError2() {
        var _this5;
        _classCallCheck(this, AuthenticationError2);
        for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
          args[_key5] = arguments[_key5];
        }
        _this5 = _super5.call.apply(_super5, [this].concat(args));
        _this5.code = "AuthenticationError";
        return _this5;
      }
      return _createClass(AuthenticationError2);
    }(ResponseError);
    exports2.AuthenticationError = AuthenticationError;
    var NotFoundError = /* @__PURE__ */ function(_ResponseError6) {
      _inherits(NotFoundError2, _ResponseError6);
      var _super6 = _createSuper(NotFoundError2);
      function NotFoundError2() {
        var _this6;
        _classCallCheck(this, NotFoundError2);
        for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
          args[_key6] = arguments[_key6];
        }
        _this6 = _super6.call.apply(_super6, [this].concat(args));
        _this6.code = "NotFoundError";
        return _this6;
      }
      return _createClass(NotFoundError2);
    }(ResponseError);
    exports2.NotFoundError = NotFoundError;
    var UnknownError = /* @__PURE__ */ function(_ResponseError7) {
      _inherits(UnknownError2, _ResponseError7);
      var _super7 = _createSuper(UnknownError2);
      function UnknownError2() {
        var _this7;
        _classCallCheck(this, UnknownError2);
        for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
          args[_key7] = arguments[_key7];
        }
        _this7 = _super7.call.apply(_super7, [this].concat(args));
        _this7.code = "UnknownError";
        return _this7;
      }
      return _createClass(UnknownError2);
    }(ResponseError);
    exports2.UnknownError = UnknownError;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/client/listener.js
var require_listener = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/client/listener.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _response = _interopRequireDefault(require_response());
    var _util = _interopRequireDefault(require("util"));
    var _errors = require_errors2();
    function _interopRequireDefault(obj2) {
      return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
    }
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var Listener = /* @__PURE__ */ function() {
      function Listener2(request, emitter, client) {
        _classCallCheck(this, Listener2);
        this.request = request;
        this.emitter = emitter;
        this.client = client;
      }
      _createClass(Listener2, [{
        key: "onResponse",
        value: function onResponse(http_response) {
          var response = new _response["default"](http_response, this.request);
          http_response.on("data", response.addChunk.bind(response));
          http_response.on("end", this.onEnd(response).bind(this));
          http_response.on("close", this.onNetworkError(response).bind(this));
          http_response.on("error", this.onNetworkError(response).bind(this));
        }
      }, {
        key: "onError",
        value: function onError(http_response) {
          var response = new _response["default"](http_response, this.request);
          this.onNetworkError(response)();
        }
      }, {
        key: "onEnd",
        value: function onEnd(response) {
          var _this = this;
          return function() {
            response.parse();
            if (response.success()) {
              _this.onSuccess(response);
            } else {
              _this.onFail(response);
            }
          };
        }
      }, {
        key: "onSuccess",
        value: function onSuccess(response) {
          this.log(response);
          this.emitter.emit("resolve", response);
        }
      }, {
        key: "onFail",
        value: function onFail(response) {
          var Error2 = this.errorFor(response);
          var error = new Error2(response);
          this.log(response, error);
          this.emitter.emit("reject", error);
        }
      }, {
        key: "errorFor",
        value: function errorFor(_ref) {
          var statusCode = _ref.statusCode, parsed = _ref.parsed;
          var error = null;
          if (statusCode >= 500) {
            error = _errors.ServerError;
          } else if (statusCode === 401) {
            error = _errors.AuthenticationError;
          } else if (statusCode === 404) {
            error = _errors.NotFoundError;
          } else if (statusCode >= 400) {
            error = _errors.ClientError;
          } else if (!parsed) {
            error = _errors.ParserError;
          } else {
            error = _errors.UnknownError;
          }
          return error;
        }
      }, {
        key: "onNetworkError",
        value: function onNetworkError(response) {
          var _this2 = this;
          return function() {
            response.parse();
            var error = new _errors.NetworkError(response);
            _this2.log(response, error);
            _this2.emitter.emit("reject", error);
          };
        }
      }, {
        key: "log",
        value: function log(response, error) {
          if (this.client.debug()) {
            this.client.logger.log(_util["default"].inspect(response, false, null));
          }
          if (!this.client.debug() && this.client.warn() && error) {
            this.client.logger.log("Amadeus", error.code, error.description);
          }
        }
      }]);
      return Listener2;
    }();
    var _default = Listener;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/es-errors/type.js
var require_type = __commonJS({
  "netlify/functions/node_modules/es-errors/type.js"(exports2, module2) {
    "use strict";
    module2.exports = TypeError;
  }
});

// netlify/functions/node_modules/object-inspect/util.inspect.js
var require_util_inspect = __commonJS({
  "netlify/functions/node_modules/object-inspect/util.inspect.js"(exports2, module2) {
    module2.exports = require("util").inspect;
  }
});

// netlify/functions/node_modules/object-inspect/index.js
var require_object_inspect = __commonJS({
  "netlify/functions/node_modules/object-inspect/index.js"(exports2, module2) {
    var hasMap = typeof Map === "function" && Map.prototype;
    var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, "size") : null;
    var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === "function" ? mapSizeDescriptor.get : null;
    var mapForEach = hasMap && Map.prototype.forEach;
    var hasSet = typeof Set === "function" && Set.prototype;
    var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, "size") : null;
    var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === "function" ? setSizeDescriptor.get : null;
    var setForEach = hasSet && Set.prototype.forEach;
    var hasWeakMap = typeof WeakMap === "function" && WeakMap.prototype;
    var weakMapHas = hasWeakMap ? WeakMap.prototype.has : null;
    var hasWeakSet = typeof WeakSet === "function" && WeakSet.prototype;
    var weakSetHas = hasWeakSet ? WeakSet.prototype.has : null;
    var hasWeakRef = typeof WeakRef === "function" && WeakRef.prototype;
    var weakRefDeref = hasWeakRef ? WeakRef.prototype.deref : null;
    var booleanValueOf = Boolean.prototype.valueOf;
    var objectToString = Object.prototype.toString;
    var functionToString = Function.prototype.toString;
    var $match = String.prototype.match;
    var $slice = String.prototype.slice;
    var $replace = String.prototype.replace;
    var $toUpperCase = String.prototype.toUpperCase;
    var $toLowerCase = String.prototype.toLowerCase;
    var $test = RegExp.prototype.test;
    var $concat = Array.prototype.concat;
    var $join = Array.prototype.join;
    var $arrSlice = Array.prototype.slice;
    var $floor = Math.floor;
    var bigIntValueOf = typeof BigInt === "function" ? BigInt.prototype.valueOf : null;
    var gOPS = Object.getOwnPropertySymbols;
    var symToString = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? Symbol.prototype.toString : null;
    var hasShammedSymbols = typeof Symbol === "function" && typeof Symbol.iterator === "object";
    var toStringTag = typeof Symbol === "function" && Symbol.toStringTag && (typeof Symbol.toStringTag === hasShammedSymbols ? "object" : "symbol") ? Symbol.toStringTag : null;
    var isEnumerable = Object.prototype.propertyIsEnumerable;
    var gPO = (typeof Reflect === "function" ? Reflect.getPrototypeOf : Object.getPrototypeOf) || ([].__proto__ === Array.prototype ? function(O) {
      return O.__proto__;
    } : null);
    function addNumericSeparator(num, str) {
      if (num === Infinity || num === -Infinity || num !== num || num && num > -1e3 && num < 1e3 || $test.call(/e/, str)) {
        return str;
      }
      var sepRegex = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
      if (typeof num === "number") {
        var int = num < 0 ? -$floor(-num) : $floor(num);
        if (int !== num) {
          var intStr = String(int);
          var dec = $slice.call(str, intStr.length + 1);
          return $replace.call(intStr, sepRegex, "$&_") + "." + $replace.call($replace.call(dec, /([0-9]{3})/g, "$&_"), /_$/, "");
        }
      }
      return $replace.call(str, sepRegex, "$&_");
    }
    var utilInspect = require_util_inspect();
    var inspectCustom = utilInspect.custom;
    var inspectSymbol = isSymbol(inspectCustom) ? inspectCustom : null;
    var quotes = {
      __proto__: null,
      "double": '"',
      single: "'"
    };
    var quoteREs = {
      __proto__: null,
      "double": /(["\\])/g,
      single: /(['\\])/g
    };
    module2.exports = function inspect_(obj2, options, depth, seen) {
      var opts = options || {};
      if (has(opts, "quoteStyle") && !has(quotes, opts.quoteStyle)) {
        throw new TypeError('option "quoteStyle" must be "single" or "double"');
      }
      if (has(opts, "maxStringLength") && (typeof opts.maxStringLength === "number" ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity : opts.maxStringLength !== null)) {
        throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
      }
      var customInspect = has(opts, "customInspect") ? opts.customInspect : true;
      if (typeof customInspect !== "boolean" && customInspect !== "symbol") {
        throw new TypeError("option \"customInspect\", if provided, must be `true`, `false`, or `'symbol'`");
      }
      if (has(opts, "indent") && opts.indent !== null && opts.indent !== "	" && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)) {
        throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
      }
      if (has(opts, "numericSeparator") && typeof opts.numericSeparator !== "boolean") {
        throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
      }
      var numericSeparator = opts.numericSeparator;
      if (typeof obj2 === "undefined") {
        return "undefined";
      }
      if (obj2 === null) {
        return "null";
      }
      if (typeof obj2 === "boolean") {
        return obj2 ? "true" : "false";
      }
      if (typeof obj2 === "string") {
        return inspectString(obj2, opts);
      }
      if (typeof obj2 === "number") {
        if (obj2 === 0) {
          return Infinity / obj2 > 0 ? "0" : "-0";
        }
        var str = String(obj2);
        return numericSeparator ? addNumericSeparator(obj2, str) : str;
      }
      if (typeof obj2 === "bigint") {
        var bigIntStr = String(obj2) + "n";
        return numericSeparator ? addNumericSeparator(obj2, bigIntStr) : bigIntStr;
      }
      var maxDepth = typeof opts.depth === "undefined" ? 5 : opts.depth;
      if (typeof depth === "undefined") {
        depth = 0;
      }
      if (depth >= maxDepth && maxDepth > 0 && typeof obj2 === "object") {
        return isArray(obj2) ? "[Array]" : "[Object]";
      }
      var indent = getIndent(opts, depth);
      if (typeof seen === "undefined") {
        seen = [];
      } else if (indexOf(seen, obj2) >= 0) {
        return "[Circular]";
      }
      function inspect(value, from, noIndent) {
        if (from) {
          seen = $arrSlice.call(seen);
          seen.push(from);
        }
        if (noIndent) {
          var newOpts = {
            depth: opts.depth
          };
          if (has(opts, "quoteStyle")) {
            newOpts.quoteStyle = opts.quoteStyle;
          }
          return inspect_(value, newOpts, depth + 1, seen);
        }
        return inspect_(value, opts, depth + 1, seen);
      }
      if (typeof obj2 === "function" && !isRegExp(obj2)) {
        var name = nameOf(obj2);
        var keys = arrObjKeys(obj2, inspect);
        return "[Function" + (name ? ": " + name : " (anonymous)") + "]" + (keys.length > 0 ? " { " + $join.call(keys, ", ") + " }" : "");
      }
      if (isSymbol(obj2)) {
        var symString = hasShammedSymbols ? $replace.call(String(obj2), /^(Symbol\(.*\))_[^)]*$/, "$1") : symToString.call(obj2);
        return typeof obj2 === "object" && !hasShammedSymbols ? markBoxed(symString) : symString;
      }
      if (isElement(obj2)) {
        var s = "<" + $toLowerCase.call(String(obj2.nodeName));
        var attrs = obj2.attributes || [];
        for (var i = 0; i < attrs.length; i++) {
          s += " " + attrs[i].name + "=" + wrapQuotes(quote(attrs[i].value), "double", opts);
        }
        s += ">";
        if (obj2.childNodes && obj2.childNodes.length) {
          s += "...";
        }
        s += "</" + $toLowerCase.call(String(obj2.nodeName)) + ">";
        return s;
      }
      if (isArray(obj2)) {
        if (obj2.length === 0) {
          return "[]";
        }
        var xs = arrObjKeys(obj2, inspect);
        if (indent && !singleLineValues(xs)) {
          return "[" + indentedJoin(xs, indent) + "]";
        }
        return "[ " + $join.call(xs, ", ") + " ]";
      }
      if (isError2(obj2)) {
        var parts = arrObjKeys(obj2, inspect);
        if (!("cause" in Error.prototype) && "cause" in obj2 && !isEnumerable.call(obj2, "cause")) {
          return "{ [" + String(obj2) + "] " + $join.call($concat.call("[cause]: " + inspect(obj2.cause), parts), ", ") + " }";
        }
        if (parts.length === 0) {
          return "[" + String(obj2) + "]";
        }
        return "{ [" + String(obj2) + "] " + $join.call(parts, ", ") + " }";
      }
      if (typeof obj2 === "object" && customInspect) {
        if (inspectSymbol && typeof obj2[inspectSymbol] === "function" && utilInspect) {
          return utilInspect(obj2, { depth: maxDepth - depth });
        } else if (customInspect !== "symbol" && typeof obj2.inspect === "function") {
          return obj2.inspect();
        }
      }
      if (isMap(obj2)) {
        var mapParts = [];
        if (mapForEach) {
          mapForEach.call(obj2, function(value, key) {
            mapParts.push(inspect(key, obj2, true) + " => " + inspect(value, obj2));
          });
        }
        return collectionOf("Map", mapSize.call(obj2), mapParts, indent);
      }
      if (isSet(obj2)) {
        var setParts = [];
        if (setForEach) {
          setForEach.call(obj2, function(value) {
            setParts.push(inspect(value, obj2));
          });
        }
        return collectionOf("Set", setSize.call(obj2), setParts, indent);
      }
      if (isWeakMap(obj2)) {
        return weakCollectionOf("WeakMap");
      }
      if (isWeakSet(obj2)) {
        return weakCollectionOf("WeakSet");
      }
      if (isWeakRef(obj2)) {
        return weakCollectionOf("WeakRef");
      }
      if (isNumber(obj2)) {
        return markBoxed(inspect(Number(obj2)));
      }
      if (isBigInt(obj2)) {
        return markBoxed(inspect(bigIntValueOf.call(obj2)));
      }
      if (isBoolean(obj2)) {
        return markBoxed(booleanValueOf.call(obj2));
      }
      if (isString(obj2)) {
        return markBoxed(inspect(String(obj2)));
      }
      if (typeof window !== "undefined" && obj2 === window) {
        return "{ [object Window] }";
      }
      if (typeof globalThis !== "undefined" && obj2 === globalThis || typeof global !== "undefined" && obj2 === global) {
        return "{ [object globalThis] }";
      }
      if (!isDate(obj2) && !isRegExp(obj2)) {
        var ys = arrObjKeys(obj2, inspect);
        var isPlainObject = gPO ? gPO(obj2) === Object.prototype : obj2 instanceof Object || obj2.constructor === Object;
        var protoTag = obj2 instanceof Object ? "" : "null prototype";
        var stringTag = !isPlainObject && toStringTag && Object(obj2) === obj2 && toStringTag in obj2 ? $slice.call(toStr(obj2), 8, -1) : protoTag ? "Object" : "";
        var constructorTag = isPlainObject || typeof obj2.constructor !== "function" ? "" : obj2.constructor.name ? obj2.constructor.name + " " : "";
        var tag = constructorTag + (stringTag || protoTag ? "[" + $join.call($concat.call([], stringTag || [], protoTag || []), ": ") + "] " : "");
        if (ys.length === 0) {
          return tag + "{}";
        }
        if (indent) {
          return tag + "{" + indentedJoin(ys, indent) + "}";
        }
        return tag + "{ " + $join.call(ys, ", ") + " }";
      }
      return String(obj2);
    };
    function wrapQuotes(s, defaultStyle, opts) {
      var style = opts.quoteStyle || defaultStyle;
      var quoteChar = quotes[style];
      return quoteChar + s + quoteChar;
    }
    function quote(s) {
      return $replace.call(String(s), /"/g, "&quot;");
    }
    function canTrustToString(obj2) {
      return !toStringTag || !(typeof obj2 === "object" && (toStringTag in obj2 || typeof obj2[toStringTag] !== "undefined"));
    }
    function isArray(obj2) {
      return toStr(obj2) === "[object Array]" && canTrustToString(obj2);
    }
    function isDate(obj2) {
      return toStr(obj2) === "[object Date]" && canTrustToString(obj2);
    }
    function isRegExp(obj2) {
      return toStr(obj2) === "[object RegExp]" && canTrustToString(obj2);
    }
    function isError2(obj2) {
      return toStr(obj2) === "[object Error]" && canTrustToString(obj2);
    }
    function isString(obj2) {
      return toStr(obj2) === "[object String]" && canTrustToString(obj2);
    }
    function isNumber(obj2) {
      return toStr(obj2) === "[object Number]" && canTrustToString(obj2);
    }
    function isBoolean(obj2) {
      return toStr(obj2) === "[object Boolean]" && canTrustToString(obj2);
    }
    function isSymbol(obj2) {
      if (hasShammedSymbols) {
        return obj2 && typeof obj2 === "object" && obj2 instanceof Symbol;
      }
      if (typeof obj2 === "symbol") {
        return true;
      }
      if (!obj2 || typeof obj2 !== "object" || !symToString) {
        return false;
      }
      try {
        symToString.call(obj2);
        return true;
      } catch (e) {
      }
      return false;
    }
    function isBigInt(obj2) {
      if (!obj2 || typeof obj2 !== "object" || !bigIntValueOf) {
        return false;
      }
      try {
        bigIntValueOf.call(obj2);
        return true;
      } catch (e) {
      }
      return false;
    }
    var hasOwn = Object.prototype.hasOwnProperty || function(key) {
      return key in this;
    };
    function has(obj2, key) {
      return hasOwn.call(obj2, key);
    }
    function toStr(obj2) {
      return objectToString.call(obj2);
    }
    function nameOf(f) {
      if (f.name) {
        return f.name;
      }
      var m = $match.call(functionToString.call(f), /^function\s*([\w$]+)/);
      if (m) {
        return m[1];
      }
      return null;
    }
    function indexOf(xs, x) {
      if (xs.indexOf) {
        return xs.indexOf(x);
      }
      for (var i = 0, l = xs.length; i < l; i++) {
        if (xs[i] === x) {
          return i;
        }
      }
      return -1;
    }
    function isMap(x) {
      if (!mapSize || !x || typeof x !== "object") {
        return false;
      }
      try {
        mapSize.call(x);
        try {
          setSize.call(x);
        } catch (s) {
          return true;
        }
        return x instanceof Map;
      } catch (e) {
      }
      return false;
    }
    function isWeakMap(x) {
      if (!weakMapHas || !x || typeof x !== "object") {
        return false;
      }
      try {
        weakMapHas.call(x, weakMapHas);
        try {
          weakSetHas.call(x, weakSetHas);
        } catch (s) {
          return true;
        }
        return x instanceof WeakMap;
      } catch (e) {
      }
      return false;
    }
    function isWeakRef(x) {
      if (!weakRefDeref || !x || typeof x !== "object") {
        return false;
      }
      try {
        weakRefDeref.call(x);
        return true;
      } catch (e) {
      }
      return false;
    }
    function isSet(x) {
      if (!setSize || !x || typeof x !== "object") {
        return false;
      }
      try {
        setSize.call(x);
        try {
          mapSize.call(x);
        } catch (m) {
          return true;
        }
        return x instanceof Set;
      } catch (e) {
      }
      return false;
    }
    function isWeakSet(x) {
      if (!weakSetHas || !x || typeof x !== "object") {
        return false;
      }
      try {
        weakSetHas.call(x, weakSetHas);
        try {
          weakMapHas.call(x, weakMapHas);
        } catch (s) {
          return true;
        }
        return x instanceof WeakSet;
      } catch (e) {
      }
      return false;
    }
    function isElement(x) {
      if (!x || typeof x !== "object") {
        return false;
      }
      if (typeof HTMLElement !== "undefined" && x instanceof HTMLElement) {
        return true;
      }
      return typeof x.nodeName === "string" && typeof x.getAttribute === "function";
    }
    function inspectString(str, opts) {
      if (str.length > opts.maxStringLength) {
        var remaining = str.length - opts.maxStringLength;
        var trailer = "... " + remaining + " more character" + (remaining > 1 ? "s" : "");
        return inspectString($slice.call(str, 0, opts.maxStringLength), opts) + trailer;
      }
      var quoteRE = quoteREs[opts.quoteStyle || "single"];
      quoteRE.lastIndex = 0;
      var s = $replace.call($replace.call(str, quoteRE, "\\$1"), /[\x00-\x1f]/g, lowbyte);
      return wrapQuotes(s, "single", opts);
    }
    function lowbyte(c) {
      var n = c.charCodeAt(0);
      var x = {
        8: "b",
        9: "t",
        10: "n",
        12: "f",
        13: "r"
      }[n];
      if (x) {
        return "\\" + x;
      }
      return "\\x" + (n < 16 ? "0" : "") + $toUpperCase.call(n.toString(16));
    }
    function markBoxed(str) {
      return "Object(" + str + ")";
    }
    function weakCollectionOf(type) {
      return type + " { ? }";
    }
    function collectionOf(type, size, entries, indent) {
      var joinedEntries = indent ? indentedJoin(entries, indent) : $join.call(entries, ", ");
      return type + " (" + size + ") {" + joinedEntries + "}";
    }
    function singleLineValues(xs) {
      for (var i = 0; i < xs.length; i++) {
        if (indexOf(xs[i], "\n") >= 0) {
          return false;
        }
      }
      return true;
    }
    function getIndent(opts, depth) {
      var baseIndent;
      if (opts.indent === "	") {
        baseIndent = "	";
      } else if (typeof opts.indent === "number" && opts.indent > 0) {
        baseIndent = $join.call(Array(opts.indent + 1), " ");
      } else {
        return null;
      }
      return {
        base: baseIndent,
        prev: $join.call(Array(depth + 1), baseIndent)
      };
    }
    function indentedJoin(xs, indent) {
      if (xs.length === 0) {
        return "";
      }
      var lineJoiner = "\n" + indent.prev + indent.base;
      return lineJoiner + $join.call(xs, "," + lineJoiner) + "\n" + indent.prev;
    }
    function arrObjKeys(obj2, inspect) {
      var isArr = isArray(obj2);
      var xs = [];
      if (isArr) {
        xs.length = obj2.length;
        for (var i = 0; i < obj2.length; i++) {
          xs[i] = has(obj2, i) ? inspect(obj2[i], obj2) : "";
        }
      }
      var syms = typeof gOPS === "function" ? gOPS(obj2) : [];
      var symMap;
      if (hasShammedSymbols) {
        symMap = {};
        for (var k = 0; k < syms.length; k++) {
          symMap["$" + syms[k]] = syms[k];
        }
      }
      for (var key in obj2) {
        if (!has(obj2, key)) {
          continue;
        }
        if (isArr && String(Number(key)) === key && key < obj2.length) {
          continue;
        }
        if (hasShammedSymbols && symMap["$" + key] instanceof Symbol) {
          continue;
        } else if ($test.call(/[^\w$]/, key)) {
          xs.push(inspect(key, obj2) + ": " + inspect(obj2[key], obj2));
        } else {
          xs.push(key + ": " + inspect(obj2[key], obj2));
        }
      }
      if (typeof gOPS === "function") {
        for (var j = 0; j < syms.length; j++) {
          if (isEnumerable.call(obj2, syms[j])) {
            xs.push("[" + inspect(syms[j]) + "]: " + inspect(obj2[syms[j]], obj2));
          }
        }
      }
      return xs;
    }
  }
});

// netlify/functions/node_modules/side-channel-list/index.js
var require_side_channel_list = __commonJS({
  "netlify/functions/node_modules/side-channel-list/index.js"(exports2, module2) {
    "use strict";
    var inspect = require_object_inspect();
    var $TypeError = require_type();
    var listGetNode = function(list, key, isDelete) {
      var prev = list;
      var curr;
      for (; (curr = prev.next) != null; prev = curr) {
        if (curr.key === key) {
          prev.next = curr.next;
          if (!isDelete) {
            curr.next = list.next;
            list.next = curr;
          }
          return curr;
        }
      }
    };
    var listGet = function(objects, key) {
      if (!objects) {
        return void 0;
      }
      var node = listGetNode(objects, key);
      return node && node.value;
    };
    var listSet = function(objects, key, value) {
      var node = listGetNode(objects, key);
      if (node) {
        node.value = value;
      } else {
        objects.next = {
          key,
          next: objects.next,
          value
        };
      }
    };
    var listHas = function(objects, key) {
      if (!objects) {
        return false;
      }
      return !!listGetNode(objects, key);
    };
    var listDelete = function(objects, key) {
      if (objects) {
        return listGetNode(objects, key, true);
      }
    };
    module2.exports = function getSideChannelList() {
      var $o;
      var channel = {
        assert: function(key) {
          if (!channel.has(key)) {
            throw new $TypeError("Side channel does not contain " + inspect(key));
          }
        },
        "delete": function(key) {
          var root = $o && $o.next;
          var deletedNode = listDelete($o, key);
          if (deletedNode && root && root === deletedNode) {
            $o = void 0;
          }
          return !!deletedNode;
        },
        get: function(key) {
          return listGet($o, key);
        },
        has: function(key) {
          return listHas($o, key);
        },
        set: function(key, value) {
          if (!$o) {
            $o = {
              next: void 0
            };
          }
          listSet($o, key, value);
        }
      };
      return channel;
    };
  }
});

// netlify/functions/node_modules/es-object-atoms/index.js
var require_es_object_atoms = __commonJS({
  "netlify/functions/node_modules/es-object-atoms/index.js"(exports2, module2) {
    "use strict";
    module2.exports = Object;
  }
});

// netlify/functions/node_modules/es-errors/index.js
var require_es_errors = __commonJS({
  "netlify/functions/node_modules/es-errors/index.js"(exports2, module2) {
    "use strict";
    module2.exports = Error;
  }
});

// netlify/functions/node_modules/es-errors/eval.js
var require_eval = __commonJS({
  "netlify/functions/node_modules/es-errors/eval.js"(exports2, module2) {
    "use strict";
    module2.exports = EvalError;
  }
});

// netlify/functions/node_modules/es-errors/range.js
var require_range = __commonJS({
  "netlify/functions/node_modules/es-errors/range.js"(exports2, module2) {
    "use strict";
    module2.exports = RangeError;
  }
});

// netlify/functions/node_modules/es-errors/ref.js
var require_ref = __commonJS({
  "netlify/functions/node_modules/es-errors/ref.js"(exports2, module2) {
    "use strict";
    module2.exports = ReferenceError;
  }
});

// netlify/functions/node_modules/es-errors/syntax.js
var require_syntax = __commonJS({
  "netlify/functions/node_modules/es-errors/syntax.js"(exports2, module2) {
    "use strict";
    module2.exports = SyntaxError;
  }
});

// netlify/functions/node_modules/es-errors/uri.js
var require_uri = __commonJS({
  "netlify/functions/node_modules/es-errors/uri.js"(exports2, module2) {
    "use strict";
    module2.exports = URIError;
  }
});

// netlify/functions/node_modules/math-intrinsics/abs.js
var require_abs = __commonJS({
  "netlify/functions/node_modules/math-intrinsics/abs.js"(exports2, module2) {
    "use strict";
    module2.exports = Math.abs;
  }
});

// netlify/functions/node_modules/math-intrinsics/floor.js
var require_floor = __commonJS({
  "netlify/functions/node_modules/math-intrinsics/floor.js"(exports2, module2) {
    "use strict";
    module2.exports = Math.floor;
  }
});

// netlify/functions/node_modules/math-intrinsics/max.js
var require_max = __commonJS({
  "netlify/functions/node_modules/math-intrinsics/max.js"(exports2, module2) {
    "use strict";
    module2.exports = Math.max;
  }
});

// netlify/functions/node_modules/math-intrinsics/min.js
var require_min = __commonJS({
  "netlify/functions/node_modules/math-intrinsics/min.js"(exports2, module2) {
    "use strict";
    module2.exports = Math.min;
  }
});

// netlify/functions/node_modules/math-intrinsics/pow.js
var require_pow = __commonJS({
  "netlify/functions/node_modules/math-intrinsics/pow.js"(exports2, module2) {
    "use strict";
    module2.exports = Math.pow;
  }
});

// netlify/functions/node_modules/math-intrinsics/round.js
var require_round = __commonJS({
  "netlify/functions/node_modules/math-intrinsics/round.js"(exports2, module2) {
    "use strict";
    module2.exports = Math.round;
  }
});

// netlify/functions/node_modules/math-intrinsics/isNaN.js
var require_isNaN = __commonJS({
  "netlify/functions/node_modules/math-intrinsics/isNaN.js"(exports2, module2) {
    "use strict";
    module2.exports = Number.isNaN || function isNaN2(a) {
      return a !== a;
    };
  }
});

// netlify/functions/node_modules/math-intrinsics/sign.js
var require_sign = __commonJS({
  "netlify/functions/node_modules/math-intrinsics/sign.js"(exports2, module2) {
    "use strict";
    var $isNaN = require_isNaN();
    module2.exports = function sign(number) {
      if ($isNaN(number) || number === 0) {
        return number;
      }
      return number < 0 ? -1 : 1;
    };
  }
});

// netlify/functions/node_modules/gopd/gOPD.js
var require_gOPD = __commonJS({
  "netlify/functions/node_modules/gopd/gOPD.js"(exports2, module2) {
    "use strict";
    module2.exports = Object.getOwnPropertyDescriptor;
  }
});

// netlify/functions/node_modules/gopd/index.js
var require_gopd = __commonJS({
  "netlify/functions/node_modules/gopd/index.js"(exports2, module2) {
    "use strict";
    var $gOPD = require_gOPD();
    if ($gOPD) {
      try {
        $gOPD([], "length");
      } catch (e) {
        $gOPD = null;
      }
    }
    module2.exports = $gOPD;
  }
});

// netlify/functions/node_modules/es-define-property/index.js
var require_es_define_property = __commonJS({
  "netlify/functions/node_modules/es-define-property/index.js"(exports2, module2) {
    "use strict";
    var $defineProperty = Object.defineProperty || false;
    if ($defineProperty) {
      try {
        $defineProperty({}, "a", { value: 1 });
      } catch (e) {
        $defineProperty = false;
      }
    }
    module2.exports = $defineProperty;
  }
});

// netlify/functions/node_modules/has-symbols/shams.js
var require_shams = __commonJS({
  "netlify/functions/node_modules/has-symbols/shams.js"(exports2, module2) {
    "use strict";
    module2.exports = function hasSymbols() {
      if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") {
        return false;
      }
      if (typeof Symbol.iterator === "symbol") {
        return true;
      }
      var obj2 = {};
      var sym = Symbol("test");
      var symObj = Object(sym);
      if (typeof sym === "string") {
        return false;
      }
      if (Object.prototype.toString.call(sym) !== "[object Symbol]") {
        return false;
      }
      if (Object.prototype.toString.call(symObj) !== "[object Symbol]") {
        return false;
      }
      var symVal = 42;
      obj2[sym] = symVal;
      for (var _ in obj2) {
        return false;
      }
      if (typeof Object.keys === "function" && Object.keys(obj2).length !== 0) {
        return false;
      }
      if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(obj2).length !== 0) {
        return false;
      }
      var syms = Object.getOwnPropertySymbols(obj2);
      if (syms.length !== 1 || syms[0] !== sym) {
        return false;
      }
      if (!Object.prototype.propertyIsEnumerable.call(obj2, sym)) {
        return false;
      }
      if (typeof Object.getOwnPropertyDescriptor === "function") {
        var descriptor = Object.getOwnPropertyDescriptor(obj2, sym);
        if (descriptor.value !== symVal || descriptor.enumerable !== true) {
          return false;
        }
      }
      return true;
    };
  }
});

// netlify/functions/node_modules/has-symbols/index.js
var require_has_symbols = __commonJS({
  "netlify/functions/node_modules/has-symbols/index.js"(exports2, module2) {
    "use strict";
    var origSymbol = typeof Symbol !== "undefined" && Symbol;
    var hasSymbolSham = require_shams();
    module2.exports = function hasNativeSymbols() {
      if (typeof origSymbol !== "function") {
        return false;
      }
      if (typeof Symbol !== "function") {
        return false;
      }
      if (typeof origSymbol("foo") !== "symbol") {
        return false;
      }
      if (typeof Symbol("bar") !== "symbol") {
        return false;
      }
      return hasSymbolSham();
    };
  }
});

// netlify/functions/node_modules/get-proto/Reflect.getPrototypeOf.js
var require_Reflect_getPrototypeOf = __commonJS({
  "netlify/functions/node_modules/get-proto/Reflect.getPrototypeOf.js"(exports2, module2) {
    "use strict";
    module2.exports = typeof Reflect !== "undefined" && Reflect.getPrototypeOf || null;
  }
});

// netlify/functions/node_modules/get-proto/Object.getPrototypeOf.js
var require_Object_getPrototypeOf = __commonJS({
  "netlify/functions/node_modules/get-proto/Object.getPrototypeOf.js"(exports2, module2) {
    "use strict";
    var $Object = require_es_object_atoms();
    module2.exports = $Object.getPrototypeOf || null;
  }
});

// netlify/functions/node_modules/function-bind/implementation.js
var require_implementation = __commonJS({
  "netlify/functions/node_modules/function-bind/implementation.js"(exports2, module2) {
    "use strict";
    var ERROR_MESSAGE = "Function.prototype.bind called on incompatible ";
    var toStr = Object.prototype.toString;
    var max = Math.max;
    var funcType = "[object Function]";
    var concatty = function concatty2(a, b) {
      var arr = [];
      for (var i = 0; i < a.length; i += 1) {
        arr[i] = a[i];
      }
      for (var j = 0; j < b.length; j += 1) {
        arr[j + a.length] = b[j];
      }
      return arr;
    };
    var slicy = function slicy2(arrLike, offset) {
      var arr = [];
      for (var i = offset || 0, j = 0; i < arrLike.length; i += 1, j += 1) {
        arr[j] = arrLike[i];
      }
      return arr;
    };
    var joiny = function(arr, joiner) {
      var str = "";
      for (var i = 0; i < arr.length; i += 1) {
        str += arr[i];
        if (i + 1 < arr.length) {
          str += joiner;
        }
      }
      return str;
    };
    module2.exports = function bind(that) {
      var target = this;
      if (typeof target !== "function" || toStr.apply(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
      }
      var args = slicy(arguments, 1);
      var bound;
      var binder = function() {
        if (this instanceof bound) {
          var result = target.apply(this, concatty(args, arguments));
          if (Object(result) === result) {
            return result;
          }
          return this;
        }
        return target.apply(that, concatty(args, arguments));
      };
      var boundLength = max(0, target.length - args.length);
      var boundArgs = [];
      for (var i = 0; i < boundLength; i++) {
        boundArgs[i] = "$" + i;
      }
      bound = Function("binder", "return function (" + joiny(boundArgs, ",") + "){ return binder.apply(this,arguments); }")(binder);
      if (target.prototype) {
        var Empty = function Empty2() {
        };
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
      }
      return bound;
    };
  }
});

// netlify/functions/node_modules/function-bind/index.js
var require_function_bind = __commonJS({
  "netlify/functions/node_modules/function-bind/index.js"(exports2, module2) {
    "use strict";
    var implementation = require_implementation();
    module2.exports = Function.prototype.bind || implementation;
  }
});

// netlify/functions/node_modules/call-bind-apply-helpers/functionCall.js
var require_functionCall = __commonJS({
  "netlify/functions/node_modules/call-bind-apply-helpers/functionCall.js"(exports2, module2) {
    "use strict";
    module2.exports = Function.prototype.call;
  }
});

// netlify/functions/node_modules/call-bind-apply-helpers/functionApply.js
var require_functionApply = __commonJS({
  "netlify/functions/node_modules/call-bind-apply-helpers/functionApply.js"(exports2, module2) {
    "use strict";
    module2.exports = Function.prototype.apply;
  }
});

// netlify/functions/node_modules/call-bind-apply-helpers/reflectApply.js
var require_reflectApply = __commonJS({
  "netlify/functions/node_modules/call-bind-apply-helpers/reflectApply.js"(exports2, module2) {
    "use strict";
    module2.exports = typeof Reflect !== "undefined" && Reflect && Reflect.apply;
  }
});

// netlify/functions/node_modules/call-bind-apply-helpers/actualApply.js
var require_actualApply = __commonJS({
  "netlify/functions/node_modules/call-bind-apply-helpers/actualApply.js"(exports2, module2) {
    "use strict";
    var bind = require_function_bind();
    var $apply = require_functionApply();
    var $call = require_functionCall();
    var $reflectApply = require_reflectApply();
    module2.exports = $reflectApply || bind.call($call, $apply);
  }
});

// netlify/functions/node_modules/call-bind-apply-helpers/index.js
var require_call_bind_apply_helpers = __commonJS({
  "netlify/functions/node_modules/call-bind-apply-helpers/index.js"(exports2, module2) {
    "use strict";
    var bind = require_function_bind();
    var $TypeError = require_type();
    var $call = require_functionCall();
    var $actualApply = require_actualApply();
    module2.exports = function callBindBasic(args) {
      if (args.length < 1 || typeof args[0] !== "function") {
        throw new $TypeError("a function is required");
      }
      return $actualApply(bind, $call, args);
    };
  }
});

// netlify/functions/node_modules/dunder-proto/get.js
var require_get = __commonJS({
  "netlify/functions/node_modules/dunder-proto/get.js"(exports2, module2) {
    "use strict";
    var callBind = require_call_bind_apply_helpers();
    var gOPD = require_gopd();
    var hasProtoAccessor;
    try {
      hasProtoAccessor = [].__proto__ === Array.prototype;
    } catch (e) {
      if (!e || typeof e !== "object" || !("code" in e) || e.code !== "ERR_PROTO_ACCESS") {
        throw e;
      }
    }
    var desc = !!hasProtoAccessor && gOPD && gOPD(Object.prototype, "__proto__");
    var $Object = Object;
    var $getPrototypeOf = $Object.getPrototypeOf;
    module2.exports = desc && typeof desc.get === "function" ? callBind([desc.get]) : typeof $getPrototypeOf === "function" ? function getDunder(value) {
      return $getPrototypeOf(value == null ? value : $Object(value));
    } : false;
  }
});

// netlify/functions/node_modules/get-proto/index.js
var require_get_proto = __commonJS({
  "netlify/functions/node_modules/get-proto/index.js"(exports2, module2) {
    "use strict";
    var reflectGetProto = require_Reflect_getPrototypeOf();
    var originalGetProto = require_Object_getPrototypeOf();
    var getDunderProto = require_get();
    module2.exports = reflectGetProto ? function getProto(O) {
      return reflectGetProto(O);
    } : originalGetProto ? function getProto(O) {
      if (!O || typeof O !== "object" && typeof O !== "function") {
        throw new TypeError("getProto: not an object");
      }
      return originalGetProto(O);
    } : getDunderProto ? function getProto(O) {
      return getDunderProto(O);
    } : null;
  }
});

// netlify/functions/node_modules/hasown/index.js
var require_hasown = __commonJS({
  "netlify/functions/node_modules/hasown/index.js"(exports2, module2) {
    "use strict";
    var call = Function.prototype.call;
    var $hasOwn = Object.prototype.hasOwnProperty;
    var bind = require_function_bind();
    module2.exports = bind.call(call, $hasOwn);
  }
});

// netlify/functions/node_modules/get-intrinsic/index.js
var require_get_intrinsic = __commonJS({
  "netlify/functions/node_modules/get-intrinsic/index.js"(exports2, module2) {
    "use strict";
    var undefined2;
    var $Object = require_es_object_atoms();
    var $Error = require_es_errors();
    var $EvalError = require_eval();
    var $RangeError = require_range();
    var $ReferenceError = require_ref();
    var $SyntaxError = require_syntax();
    var $TypeError = require_type();
    var $URIError = require_uri();
    var abs = require_abs();
    var floor = require_floor();
    var max = require_max();
    var min = require_min();
    var pow = require_pow();
    var round = require_round();
    var sign = require_sign();
    var $Function = Function;
    var getEvalledConstructor = function(expressionSyntax) {
      try {
        return $Function('"use strict"; return (' + expressionSyntax + ").constructor;")();
      } catch (e) {
      }
    };
    var $gOPD = require_gopd();
    var $defineProperty = require_es_define_property();
    var throwTypeError = function() {
      throw new $TypeError();
    };
    var ThrowTypeError = $gOPD ? function() {
      try {
        arguments.callee;
        return throwTypeError;
      } catch (calleeThrows) {
        try {
          return $gOPD(arguments, "callee").get;
        } catch (gOPDthrows) {
          return throwTypeError;
        }
      }
    }() : throwTypeError;
    var hasSymbols = require_has_symbols()();
    var getProto = require_get_proto();
    var $ObjectGPO = require_Object_getPrototypeOf();
    var $ReflectGPO = require_Reflect_getPrototypeOf();
    var $apply = require_functionApply();
    var $call = require_functionCall();
    var needsEval = {};
    var TypedArray = typeof Uint8Array === "undefined" || !getProto ? undefined2 : getProto(Uint8Array);
    var INTRINSICS = {
      __proto__: null,
      "%AggregateError%": typeof AggregateError === "undefined" ? undefined2 : AggregateError,
      "%Array%": Array,
      "%ArrayBuffer%": typeof ArrayBuffer === "undefined" ? undefined2 : ArrayBuffer,
      "%ArrayIteratorPrototype%": hasSymbols && getProto ? getProto([][Symbol.iterator]()) : undefined2,
      "%AsyncFromSyncIteratorPrototype%": undefined2,
      "%AsyncFunction%": needsEval,
      "%AsyncGenerator%": needsEval,
      "%AsyncGeneratorFunction%": needsEval,
      "%AsyncIteratorPrototype%": needsEval,
      "%Atomics%": typeof Atomics === "undefined" ? undefined2 : Atomics,
      "%BigInt%": typeof BigInt === "undefined" ? undefined2 : BigInt,
      "%BigInt64Array%": typeof BigInt64Array === "undefined" ? undefined2 : BigInt64Array,
      "%BigUint64Array%": typeof BigUint64Array === "undefined" ? undefined2 : BigUint64Array,
      "%Boolean%": Boolean,
      "%DataView%": typeof DataView === "undefined" ? undefined2 : DataView,
      "%Date%": Date,
      "%decodeURI%": decodeURI,
      "%decodeURIComponent%": decodeURIComponent,
      "%encodeURI%": encodeURI,
      "%encodeURIComponent%": encodeURIComponent,
      "%Error%": $Error,
      "%eval%": eval,
      "%EvalError%": $EvalError,
      "%Float16Array%": typeof Float16Array === "undefined" ? undefined2 : Float16Array,
      "%Float32Array%": typeof Float32Array === "undefined" ? undefined2 : Float32Array,
      "%Float64Array%": typeof Float64Array === "undefined" ? undefined2 : Float64Array,
      "%FinalizationRegistry%": typeof FinalizationRegistry === "undefined" ? undefined2 : FinalizationRegistry,
      "%Function%": $Function,
      "%GeneratorFunction%": needsEval,
      "%Int8Array%": typeof Int8Array === "undefined" ? undefined2 : Int8Array,
      "%Int16Array%": typeof Int16Array === "undefined" ? undefined2 : Int16Array,
      "%Int32Array%": typeof Int32Array === "undefined" ? undefined2 : Int32Array,
      "%isFinite%": isFinite,
      "%isNaN%": isNaN,
      "%IteratorPrototype%": hasSymbols && getProto ? getProto(getProto([][Symbol.iterator]())) : undefined2,
      "%JSON%": typeof JSON === "object" ? JSON : undefined2,
      "%Map%": typeof Map === "undefined" ? undefined2 : Map,
      "%MapIteratorPrototype%": typeof Map === "undefined" || !hasSymbols || !getProto ? undefined2 : getProto((/* @__PURE__ */ new Map())[Symbol.iterator]()),
      "%Math%": Math,
      "%Number%": Number,
      "%Object%": $Object,
      "%Object.getOwnPropertyDescriptor%": $gOPD,
      "%parseFloat%": parseFloat,
      "%parseInt%": parseInt,
      "%Promise%": typeof Promise === "undefined" ? undefined2 : Promise,
      "%Proxy%": typeof Proxy === "undefined" ? undefined2 : Proxy,
      "%RangeError%": $RangeError,
      "%ReferenceError%": $ReferenceError,
      "%Reflect%": typeof Reflect === "undefined" ? undefined2 : Reflect,
      "%RegExp%": RegExp,
      "%Set%": typeof Set === "undefined" ? undefined2 : Set,
      "%SetIteratorPrototype%": typeof Set === "undefined" || !hasSymbols || !getProto ? undefined2 : getProto((/* @__PURE__ */ new Set())[Symbol.iterator]()),
      "%SharedArrayBuffer%": typeof SharedArrayBuffer === "undefined" ? undefined2 : SharedArrayBuffer,
      "%String%": String,
      "%StringIteratorPrototype%": hasSymbols && getProto ? getProto(""[Symbol.iterator]()) : undefined2,
      "%Symbol%": hasSymbols ? Symbol : undefined2,
      "%SyntaxError%": $SyntaxError,
      "%ThrowTypeError%": ThrowTypeError,
      "%TypedArray%": TypedArray,
      "%TypeError%": $TypeError,
      "%Uint8Array%": typeof Uint8Array === "undefined" ? undefined2 : Uint8Array,
      "%Uint8ClampedArray%": typeof Uint8ClampedArray === "undefined" ? undefined2 : Uint8ClampedArray,
      "%Uint16Array%": typeof Uint16Array === "undefined" ? undefined2 : Uint16Array,
      "%Uint32Array%": typeof Uint32Array === "undefined" ? undefined2 : Uint32Array,
      "%URIError%": $URIError,
      "%WeakMap%": typeof WeakMap === "undefined" ? undefined2 : WeakMap,
      "%WeakRef%": typeof WeakRef === "undefined" ? undefined2 : WeakRef,
      "%WeakSet%": typeof WeakSet === "undefined" ? undefined2 : WeakSet,
      "%Function.prototype.call%": $call,
      "%Function.prototype.apply%": $apply,
      "%Object.defineProperty%": $defineProperty,
      "%Object.getPrototypeOf%": $ObjectGPO,
      "%Math.abs%": abs,
      "%Math.floor%": floor,
      "%Math.max%": max,
      "%Math.min%": min,
      "%Math.pow%": pow,
      "%Math.round%": round,
      "%Math.sign%": sign,
      "%Reflect.getPrototypeOf%": $ReflectGPO
    };
    if (getProto) {
      try {
        null.error;
      } catch (e) {
        errorProto = getProto(getProto(e));
        INTRINSICS["%Error.prototype%"] = errorProto;
      }
    }
    var errorProto;
    var doEval = function doEval2(name) {
      var value;
      if (name === "%AsyncFunction%") {
        value = getEvalledConstructor("async function () {}");
      } else if (name === "%GeneratorFunction%") {
        value = getEvalledConstructor("function* () {}");
      } else if (name === "%AsyncGeneratorFunction%") {
        value = getEvalledConstructor("async function* () {}");
      } else if (name === "%AsyncGenerator%") {
        var fn = doEval2("%AsyncGeneratorFunction%");
        if (fn) {
          value = fn.prototype;
        }
      } else if (name === "%AsyncIteratorPrototype%") {
        var gen = doEval2("%AsyncGenerator%");
        if (gen && getProto) {
          value = getProto(gen.prototype);
        }
      }
      INTRINSICS[name] = value;
      return value;
    };
    var LEGACY_ALIASES = {
      __proto__: null,
      "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
      "%ArrayPrototype%": ["Array", "prototype"],
      "%ArrayProto_entries%": ["Array", "prototype", "entries"],
      "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
      "%ArrayProto_keys%": ["Array", "prototype", "keys"],
      "%ArrayProto_values%": ["Array", "prototype", "values"],
      "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
      "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
      "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
      "%BooleanPrototype%": ["Boolean", "prototype"],
      "%DataViewPrototype%": ["DataView", "prototype"],
      "%DatePrototype%": ["Date", "prototype"],
      "%ErrorPrototype%": ["Error", "prototype"],
      "%EvalErrorPrototype%": ["EvalError", "prototype"],
      "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
      "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
      "%FunctionPrototype%": ["Function", "prototype"],
      "%Generator%": ["GeneratorFunction", "prototype"],
      "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
      "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
      "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
      "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
      "%JSONParse%": ["JSON", "parse"],
      "%JSONStringify%": ["JSON", "stringify"],
      "%MapPrototype%": ["Map", "prototype"],
      "%NumberPrototype%": ["Number", "prototype"],
      "%ObjectPrototype%": ["Object", "prototype"],
      "%ObjProto_toString%": ["Object", "prototype", "toString"],
      "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
      "%PromisePrototype%": ["Promise", "prototype"],
      "%PromiseProto_then%": ["Promise", "prototype", "then"],
      "%Promise_all%": ["Promise", "all"],
      "%Promise_reject%": ["Promise", "reject"],
      "%Promise_resolve%": ["Promise", "resolve"],
      "%RangeErrorPrototype%": ["RangeError", "prototype"],
      "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
      "%RegExpPrototype%": ["RegExp", "prototype"],
      "%SetPrototype%": ["Set", "prototype"],
      "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
      "%StringPrototype%": ["String", "prototype"],
      "%SymbolPrototype%": ["Symbol", "prototype"],
      "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
      "%TypedArrayPrototype%": ["TypedArray", "prototype"],
      "%TypeErrorPrototype%": ["TypeError", "prototype"],
      "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
      "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
      "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
      "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
      "%URIErrorPrototype%": ["URIError", "prototype"],
      "%WeakMapPrototype%": ["WeakMap", "prototype"],
      "%WeakSetPrototype%": ["WeakSet", "prototype"]
    };
    var bind = require_function_bind();
    var hasOwn = require_hasown();
    var $concat = bind.call($call, Array.prototype.concat);
    var $spliceApply = bind.call($apply, Array.prototype.splice);
    var $replace = bind.call($call, String.prototype.replace);
    var $strSlice = bind.call($call, String.prototype.slice);
    var $exec = bind.call($call, RegExp.prototype.exec);
    var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
    var reEscapeChar = /\\(\\)?/g;
    var stringToPath = function stringToPath2(string) {
      var first = $strSlice(string, 0, 1);
      var last = $strSlice(string, -1);
      if (first === "%" && last !== "%") {
        throw new $SyntaxError("invalid intrinsic syntax, expected closing `%`");
      } else if (last === "%" && first !== "%") {
        throw new $SyntaxError("invalid intrinsic syntax, expected opening `%`");
      }
      var result = [];
      $replace(string, rePropName, function(match, number, quote, subString) {
        result[result.length] = quote ? $replace(subString, reEscapeChar, "$1") : number || match;
      });
      return result;
    };
    var getBaseIntrinsic = function getBaseIntrinsic2(name, allowMissing) {
      var intrinsicName = name;
      var alias;
      if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
        alias = LEGACY_ALIASES[intrinsicName];
        intrinsicName = "%" + alias[0] + "%";
      }
      if (hasOwn(INTRINSICS, intrinsicName)) {
        var value = INTRINSICS[intrinsicName];
        if (value === needsEval) {
          value = doEval(intrinsicName);
        }
        if (typeof value === "undefined" && !allowMissing) {
          throw new $TypeError("intrinsic " + name + " exists, but is not available. Please file an issue!");
        }
        return {
          alias,
          name: intrinsicName,
          value
        };
      }
      throw new $SyntaxError("intrinsic " + name + " does not exist!");
    };
    module2.exports = function GetIntrinsic(name, allowMissing) {
      if (typeof name !== "string" || name.length === 0) {
        throw new $TypeError("intrinsic name must be a non-empty string");
      }
      if (arguments.length > 1 && typeof allowMissing !== "boolean") {
        throw new $TypeError('"allowMissing" argument must be a boolean');
      }
      if ($exec(/^%?[^%]*%?$/, name) === null) {
        throw new $SyntaxError("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
      }
      var parts = stringToPath(name);
      var intrinsicBaseName = parts.length > 0 ? parts[0] : "";
      var intrinsic = getBaseIntrinsic("%" + intrinsicBaseName + "%", allowMissing);
      var intrinsicRealName = intrinsic.name;
      var value = intrinsic.value;
      var skipFurtherCaching = false;
      var alias = intrinsic.alias;
      if (alias) {
        intrinsicBaseName = alias[0];
        $spliceApply(parts, $concat([0, 1], alias));
      }
      for (var i = 1, isOwn = true; i < parts.length; i += 1) {
        var part = parts[i];
        var first = $strSlice(part, 0, 1);
        var last = $strSlice(part, -1);
        if ((first === '"' || first === "'" || first === "`" || (last === '"' || last === "'" || last === "`")) && first !== last) {
          throw new $SyntaxError("property names with quotes must have matching quotes");
        }
        if (part === "constructor" || !isOwn) {
          skipFurtherCaching = true;
        }
        intrinsicBaseName += "." + part;
        intrinsicRealName = "%" + intrinsicBaseName + "%";
        if (hasOwn(INTRINSICS, intrinsicRealName)) {
          value = INTRINSICS[intrinsicRealName];
        } else if (value != null) {
          if (!(part in value)) {
            if (!allowMissing) {
              throw new $TypeError("base intrinsic for " + name + " exists, but the property is not available.");
            }
            return void 0;
          }
          if ($gOPD && i + 1 >= parts.length) {
            var desc = $gOPD(value, part);
            isOwn = !!desc;
            if (isOwn && "get" in desc && !("originalValue" in desc.get)) {
              value = desc.get;
            } else {
              value = value[part];
            }
          } else {
            isOwn = hasOwn(value, part);
            value = value[part];
          }
          if (isOwn && !skipFurtherCaching) {
            INTRINSICS[intrinsicRealName] = value;
          }
        }
      }
      return value;
    };
  }
});

// netlify/functions/node_modules/call-bound/index.js
var require_call_bound = __commonJS({
  "netlify/functions/node_modules/call-bound/index.js"(exports2, module2) {
    "use strict";
    var GetIntrinsic = require_get_intrinsic();
    var callBindBasic = require_call_bind_apply_helpers();
    var $indexOf = callBindBasic([GetIntrinsic("%String.prototype.indexOf%")]);
    module2.exports = function callBoundIntrinsic(name, allowMissing) {
      var intrinsic = GetIntrinsic(name, !!allowMissing);
      if (typeof intrinsic === "function" && $indexOf(name, ".prototype.") > -1) {
        return callBindBasic([intrinsic]);
      }
      return intrinsic;
    };
  }
});

// netlify/functions/node_modules/side-channel-map/index.js
var require_side_channel_map = __commonJS({
  "netlify/functions/node_modules/side-channel-map/index.js"(exports2, module2) {
    "use strict";
    var GetIntrinsic = require_get_intrinsic();
    var callBound = require_call_bound();
    var inspect = require_object_inspect();
    var $TypeError = require_type();
    var $Map = GetIntrinsic("%Map%", true);
    var $mapGet = callBound("Map.prototype.get", true);
    var $mapSet = callBound("Map.prototype.set", true);
    var $mapHas = callBound("Map.prototype.has", true);
    var $mapDelete = callBound("Map.prototype.delete", true);
    var $mapSize = callBound("Map.prototype.size", true);
    module2.exports = !!$Map && function getSideChannelMap() {
      var $m;
      var channel = {
        assert: function(key) {
          if (!channel.has(key)) {
            throw new $TypeError("Side channel does not contain " + inspect(key));
          }
        },
        "delete": function(key) {
          if ($m) {
            var result = $mapDelete($m, key);
            if ($mapSize($m) === 0) {
              $m = void 0;
            }
            return result;
          }
          return false;
        },
        get: function(key) {
          if ($m) {
            return $mapGet($m, key);
          }
        },
        has: function(key) {
          if ($m) {
            return $mapHas($m, key);
          }
          return false;
        },
        set: function(key, value) {
          if (!$m) {
            $m = new $Map();
          }
          $mapSet($m, key, value);
        }
      };
      return channel;
    };
  }
});

// netlify/functions/node_modules/side-channel-weakmap/index.js
var require_side_channel_weakmap = __commonJS({
  "netlify/functions/node_modules/side-channel-weakmap/index.js"(exports2, module2) {
    "use strict";
    var GetIntrinsic = require_get_intrinsic();
    var callBound = require_call_bound();
    var inspect = require_object_inspect();
    var getSideChannelMap = require_side_channel_map();
    var $TypeError = require_type();
    var $WeakMap = GetIntrinsic("%WeakMap%", true);
    var $weakMapGet = callBound("WeakMap.prototype.get", true);
    var $weakMapSet = callBound("WeakMap.prototype.set", true);
    var $weakMapHas = callBound("WeakMap.prototype.has", true);
    var $weakMapDelete = callBound("WeakMap.prototype.delete", true);
    module2.exports = $WeakMap ? function getSideChannelWeakMap() {
      var $wm;
      var $m;
      var channel = {
        assert: function(key) {
          if (!channel.has(key)) {
            throw new $TypeError("Side channel does not contain " + inspect(key));
          }
        },
        "delete": function(key) {
          if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
            if ($wm) {
              return $weakMapDelete($wm, key);
            }
          } else if (getSideChannelMap) {
            if ($m) {
              return $m["delete"](key);
            }
          }
          return false;
        },
        get: function(key) {
          if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
            if ($wm) {
              return $weakMapGet($wm, key);
            }
          }
          return $m && $m.get(key);
        },
        has: function(key) {
          if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
            if ($wm) {
              return $weakMapHas($wm, key);
            }
          }
          return !!$m && $m.has(key);
        },
        set: function(key, value) {
          if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
            if (!$wm) {
              $wm = new $WeakMap();
            }
            $weakMapSet($wm, key, value);
          } else if (getSideChannelMap) {
            if (!$m) {
              $m = getSideChannelMap();
            }
            $m.set(key, value);
          }
        }
      };
      return channel;
    } : getSideChannelMap;
  }
});

// netlify/functions/node_modules/side-channel/index.js
var require_side_channel = __commonJS({
  "netlify/functions/node_modules/side-channel/index.js"(exports2, module2) {
    "use strict";
    var $TypeError = require_type();
    var inspect = require_object_inspect();
    var getSideChannelList = require_side_channel_list();
    var getSideChannelMap = require_side_channel_map();
    var getSideChannelWeakMap = require_side_channel_weakmap();
    var makeChannel = getSideChannelWeakMap || getSideChannelMap || getSideChannelList;
    module2.exports = function getSideChannel() {
      var $channelData;
      var channel = {
        assert: function(key) {
          if (!channel.has(key)) {
            throw new $TypeError("Side channel does not contain " + inspect(key));
          }
        },
        "delete": function(key) {
          return !!$channelData && $channelData["delete"](key);
        },
        get: function(key) {
          return $channelData && $channelData.get(key);
        },
        has: function(key) {
          return !!$channelData && $channelData.has(key);
        },
        set: function(key, value) {
          if (!$channelData) {
            $channelData = makeChannel();
          }
          $channelData.set(key, value);
        }
      };
      return channel;
    };
  }
});

// netlify/functions/node_modules/qs/lib/formats.js
var require_formats = __commonJS({
  "netlify/functions/node_modules/qs/lib/formats.js"(exports2, module2) {
    "use strict";
    var replace = String.prototype.replace;
    var percentTwenties = /%20/g;
    var Format = {
      RFC1738: "RFC1738",
      RFC3986: "RFC3986"
    };
    module2.exports = {
      "default": Format.RFC3986,
      formatters: {
        RFC1738: function(value) {
          return replace.call(value, percentTwenties, "+");
        },
        RFC3986: function(value) {
          return String(value);
        }
      },
      RFC1738: Format.RFC1738,
      RFC3986: Format.RFC3986
    };
  }
});

// netlify/functions/node_modules/qs/lib/utils.js
var require_utils = __commonJS({
  "netlify/functions/node_modules/qs/lib/utils.js"(exports2, module2) {
    "use strict";
    var formats = require_formats();
    var has = Object.prototype.hasOwnProperty;
    var isArray = Array.isArray;
    var hexTable = function() {
      var array = [];
      for (var i = 0; i < 256; ++i) {
        array.push("%" + ((i < 16 ? "0" : "") + i.toString(16)).toUpperCase());
      }
      return array;
    }();
    var compactQueue = function compactQueue2(queue) {
      while (queue.length > 1) {
        var item = queue.pop();
        var obj2 = item.obj[item.prop];
        if (isArray(obj2)) {
          var compacted = [];
          for (var j = 0; j < obj2.length; ++j) {
            if (typeof obj2[j] !== "undefined") {
              compacted.push(obj2[j]);
            }
          }
          item.obj[item.prop] = compacted;
        }
      }
    };
    var arrayToObject = function arrayToObject2(source, options) {
      var obj2 = options && options.plainObjects ? { __proto__: null } : {};
      for (var i = 0; i < source.length; ++i) {
        if (typeof source[i] !== "undefined") {
          obj2[i] = source[i];
        }
      }
      return obj2;
    };
    var merge = function merge2(target, source, options) {
      if (!source) {
        return target;
      }
      if (typeof source !== "object" && typeof source !== "function") {
        if (isArray(target)) {
          target.push(source);
        } else if (target && typeof target === "object") {
          if (options && (options.plainObjects || options.allowPrototypes) || !has.call(Object.prototype, source)) {
            target[source] = true;
          }
        } else {
          return [target, source];
        }
        return target;
      }
      if (!target || typeof target !== "object") {
        return [target].concat(source);
      }
      var mergeTarget = target;
      if (isArray(target) && !isArray(source)) {
        mergeTarget = arrayToObject(target, options);
      }
      if (isArray(target) && isArray(source)) {
        source.forEach(function(item, i) {
          if (has.call(target, i)) {
            var targetItem = target[i];
            if (targetItem && typeof targetItem === "object" && item && typeof item === "object") {
              target[i] = merge2(targetItem, item, options);
            } else {
              target.push(item);
            }
          } else {
            target[i] = item;
          }
        });
        return target;
      }
      return Object.keys(source).reduce(function(acc, key) {
        var value = source[key];
        if (has.call(acc, key)) {
          acc[key] = merge2(acc[key], value, options);
        } else {
          acc[key] = value;
        }
        return acc;
      }, mergeTarget);
    };
    var assign = function assignSingleSource(target, source) {
      return Object.keys(source).reduce(function(acc, key) {
        acc[key] = source[key];
        return acc;
      }, target);
    };
    var decode = function(str, defaultDecoder, charset) {
      var strWithoutPlus = str.replace(/\+/g, " ");
      if (charset === "iso-8859-1") {
        return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
      }
      try {
        return decodeURIComponent(strWithoutPlus);
      } catch (e) {
        return strWithoutPlus;
      }
    };
    var limit = 1024;
    var encode = function encode2(str, defaultEncoder, charset, kind, format) {
      if (str.length === 0) {
        return str;
      }
      var string = str;
      if (typeof str === "symbol") {
        string = Symbol.prototype.toString.call(str);
      } else if (typeof str !== "string") {
        string = String(str);
      }
      if (charset === "iso-8859-1") {
        return escape(string).replace(/%u[0-9a-f]{4}/gi, function($0) {
          return "%26%23" + parseInt($0.slice(2), 16) + "%3B";
        });
      }
      var out = "";
      for (var j = 0; j < string.length; j += limit) {
        var segment = string.length >= limit ? string.slice(j, j + limit) : string;
        var arr = [];
        for (var i = 0; i < segment.length; ++i) {
          var c = segment.charCodeAt(i);
          if (c === 45 || c === 46 || c === 95 || c === 126 || c >= 48 && c <= 57 || c >= 65 && c <= 90 || c >= 97 && c <= 122 || format === formats.RFC1738 && (c === 40 || c === 41)) {
            arr[arr.length] = segment.charAt(i);
            continue;
          }
          if (c < 128) {
            arr[arr.length] = hexTable[c];
            continue;
          }
          if (c < 2048) {
            arr[arr.length] = hexTable[192 | c >> 6] + hexTable[128 | c & 63];
            continue;
          }
          if (c < 55296 || c >= 57344) {
            arr[arr.length] = hexTable[224 | c >> 12] + hexTable[128 | c >> 6 & 63] + hexTable[128 | c & 63];
            continue;
          }
          i += 1;
          c = 65536 + ((c & 1023) << 10 | segment.charCodeAt(i) & 1023);
          arr[arr.length] = hexTable[240 | c >> 18] + hexTable[128 | c >> 12 & 63] + hexTable[128 | c >> 6 & 63] + hexTable[128 | c & 63];
        }
        out += arr.join("");
      }
      return out;
    };
    var compact = function compact2(value) {
      var queue = [{ obj: { o: value }, prop: "o" }];
      var refs = [];
      for (var i = 0; i < queue.length; ++i) {
        var item = queue[i];
        var obj2 = item.obj[item.prop];
        var keys = Object.keys(obj2);
        for (var j = 0; j < keys.length; ++j) {
          var key = keys[j];
          var val = obj2[key];
          if (typeof val === "object" && val !== null && refs.indexOf(val) === -1) {
            queue.push({ obj: obj2, prop: key });
            refs.push(val);
          }
        }
      }
      compactQueue(queue);
      return value;
    };
    var isRegExp = function isRegExp2(obj2) {
      return Object.prototype.toString.call(obj2) === "[object RegExp]";
    };
    var isBuffer = function isBuffer2(obj2) {
      if (!obj2 || typeof obj2 !== "object") {
        return false;
      }
      return !!(obj2.constructor && obj2.constructor.isBuffer && obj2.constructor.isBuffer(obj2));
    };
    var combine = function combine2(a, b) {
      return [].concat(a, b);
    };
    var maybeMap = function maybeMap2(val, fn) {
      if (isArray(val)) {
        var mapped = [];
        for (var i = 0; i < val.length; i += 1) {
          mapped.push(fn(val[i]));
        }
        return mapped;
      }
      return fn(val);
    };
    module2.exports = {
      arrayToObject,
      assign,
      combine,
      compact,
      decode,
      encode,
      isBuffer,
      isRegExp,
      maybeMap,
      merge
    };
  }
});

// netlify/functions/node_modules/qs/lib/stringify.js
var require_stringify = __commonJS({
  "netlify/functions/node_modules/qs/lib/stringify.js"(exports2, module2) {
    "use strict";
    var getSideChannel = require_side_channel();
    var utils = require_utils();
    var formats = require_formats();
    var has = Object.prototype.hasOwnProperty;
    var arrayPrefixGenerators = {
      brackets: function brackets(prefix) {
        return prefix + "[]";
      },
      comma: "comma",
      indices: function indices(prefix, key) {
        return prefix + "[" + key + "]";
      },
      repeat: function repeat(prefix) {
        return prefix;
      }
    };
    var isArray = Array.isArray;
    var push = Array.prototype.push;
    var pushToArray = function(arr, valueOrArray) {
      push.apply(arr, isArray(valueOrArray) ? valueOrArray : [valueOrArray]);
    };
    var toISO = Date.prototype.toISOString;
    var defaultFormat = formats["default"];
    var defaults = {
      addQueryPrefix: false,
      allowDots: false,
      allowEmptyArrays: false,
      arrayFormat: "indices",
      charset: "utf-8",
      charsetSentinel: false,
      commaRoundTrip: false,
      delimiter: "&",
      encode: true,
      encodeDotInKeys: false,
      encoder: utils.encode,
      encodeValuesOnly: false,
      filter: void 0,
      format: defaultFormat,
      formatter: formats.formatters[defaultFormat],
      indices: false,
      serializeDate: function serializeDate(date) {
        return toISO.call(date);
      },
      skipNulls: false,
      strictNullHandling: false
    };
    var isNonNullishPrimitive = function isNonNullishPrimitive2(v) {
      return typeof v === "string" || typeof v === "number" || typeof v === "boolean" || typeof v === "symbol" || typeof v === "bigint";
    };
    var sentinel = {};
    var stringify = function stringify2(object, prefix, generateArrayPrefix, commaRoundTrip, allowEmptyArrays, strictNullHandling, skipNulls, encodeDotInKeys, encoder, filter, sort, allowDots, serializeDate, format, formatter, encodeValuesOnly, charset, sideChannel) {
      var obj2 = object;
      var tmpSc = sideChannel;
      var step = 0;
      var findFlag = false;
      while ((tmpSc = tmpSc.get(sentinel)) !== void 0 && !findFlag) {
        var pos = tmpSc.get(object);
        step += 1;
        if (typeof pos !== "undefined") {
          if (pos === step) {
            throw new RangeError("Cyclic object value");
          } else {
            findFlag = true;
          }
        }
        if (typeof tmpSc.get(sentinel) === "undefined") {
          step = 0;
        }
      }
      if (typeof filter === "function") {
        obj2 = filter(prefix, obj2);
      } else if (obj2 instanceof Date) {
        obj2 = serializeDate(obj2);
      } else if (generateArrayPrefix === "comma" && isArray(obj2)) {
        obj2 = utils.maybeMap(obj2, function(value2) {
          if (value2 instanceof Date) {
            return serializeDate(value2);
          }
          return value2;
        });
      }
      if (obj2 === null) {
        if (strictNullHandling) {
          return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder, charset, "key", format) : prefix;
        }
        obj2 = "";
      }
      if (isNonNullishPrimitive(obj2) || utils.isBuffer(obj2)) {
        if (encoder) {
          var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset, "key", format);
          return [formatter(keyValue) + "=" + formatter(encoder(obj2, defaults.encoder, charset, "value", format))];
        }
        return [formatter(prefix) + "=" + formatter(String(obj2))];
      }
      var values = [];
      if (typeof obj2 === "undefined") {
        return values;
      }
      var objKeys;
      if (generateArrayPrefix === "comma" && isArray(obj2)) {
        if (encodeValuesOnly && encoder) {
          obj2 = utils.maybeMap(obj2, encoder);
        }
        objKeys = [{ value: obj2.length > 0 ? obj2.join(",") || null : void 0 }];
      } else if (isArray(filter)) {
        objKeys = filter;
      } else {
        var keys = Object.keys(obj2);
        objKeys = sort ? keys.sort(sort) : keys;
      }
      var encodedPrefix = encodeDotInKeys ? String(prefix).replace(/\./g, "%2E") : String(prefix);
      var adjustedPrefix = commaRoundTrip && isArray(obj2) && obj2.length === 1 ? encodedPrefix + "[]" : encodedPrefix;
      if (allowEmptyArrays && isArray(obj2) && obj2.length === 0) {
        return adjustedPrefix + "[]";
      }
      for (var j = 0; j < objKeys.length; ++j) {
        var key = objKeys[j];
        var value = typeof key === "object" && key && typeof key.value !== "undefined" ? key.value : obj2[key];
        if (skipNulls && value === null) {
          continue;
        }
        var encodedKey = allowDots && encodeDotInKeys ? String(key).replace(/\./g, "%2E") : String(key);
        var keyPrefix = isArray(obj2) ? typeof generateArrayPrefix === "function" ? generateArrayPrefix(adjustedPrefix, encodedKey) : adjustedPrefix : adjustedPrefix + (allowDots ? "." + encodedKey : "[" + encodedKey + "]");
        sideChannel.set(object, step);
        var valueSideChannel = getSideChannel();
        valueSideChannel.set(sentinel, sideChannel);
        pushToArray(values, stringify2(value, keyPrefix, generateArrayPrefix, commaRoundTrip, allowEmptyArrays, strictNullHandling, skipNulls, encodeDotInKeys, generateArrayPrefix === "comma" && encodeValuesOnly && isArray(obj2) ? null : encoder, filter, sort, allowDots, serializeDate, format, formatter, encodeValuesOnly, charset, valueSideChannel));
      }
      return values;
    };
    var normalizeStringifyOptions = function normalizeStringifyOptions2(opts) {
      if (!opts) {
        return defaults;
      }
      if (typeof opts.allowEmptyArrays !== "undefined" && typeof opts.allowEmptyArrays !== "boolean") {
        throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
      }
      if (typeof opts.encodeDotInKeys !== "undefined" && typeof opts.encodeDotInKeys !== "boolean") {
        throw new TypeError("`encodeDotInKeys` option can only be `true` or `false`, when provided");
      }
      if (opts.encoder !== null && typeof opts.encoder !== "undefined" && typeof opts.encoder !== "function") {
        throw new TypeError("Encoder has to be a function.");
      }
      var charset = opts.charset || defaults.charset;
      if (typeof opts.charset !== "undefined" && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") {
        throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
      }
      var format = formats["default"];
      if (typeof opts.format !== "undefined") {
        if (!has.call(formats.formatters, opts.format)) {
          throw new TypeError("Unknown format option provided.");
        }
        format = opts.format;
      }
      var formatter = formats.formatters[format];
      var filter = defaults.filter;
      if (typeof opts.filter === "function" || isArray(opts.filter)) {
        filter = opts.filter;
      }
      var arrayFormat;
      if (opts.arrayFormat in arrayPrefixGenerators) {
        arrayFormat = opts.arrayFormat;
      } else if ("indices" in opts) {
        arrayFormat = opts.indices ? "indices" : "repeat";
      } else {
        arrayFormat = defaults.arrayFormat;
      }
      if ("commaRoundTrip" in opts && typeof opts.commaRoundTrip !== "boolean") {
        throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
      }
      var allowDots = typeof opts.allowDots === "undefined" ? opts.encodeDotInKeys === true ? true : defaults.allowDots : !!opts.allowDots;
      return {
        addQueryPrefix: typeof opts.addQueryPrefix === "boolean" ? opts.addQueryPrefix : defaults.addQueryPrefix,
        allowDots,
        allowEmptyArrays: typeof opts.allowEmptyArrays === "boolean" ? !!opts.allowEmptyArrays : defaults.allowEmptyArrays,
        arrayFormat,
        charset,
        charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults.charsetSentinel,
        commaRoundTrip: !!opts.commaRoundTrip,
        delimiter: typeof opts.delimiter === "undefined" ? defaults.delimiter : opts.delimiter,
        encode: typeof opts.encode === "boolean" ? opts.encode : defaults.encode,
        encodeDotInKeys: typeof opts.encodeDotInKeys === "boolean" ? opts.encodeDotInKeys : defaults.encodeDotInKeys,
        encoder: typeof opts.encoder === "function" ? opts.encoder : defaults.encoder,
        encodeValuesOnly: typeof opts.encodeValuesOnly === "boolean" ? opts.encodeValuesOnly : defaults.encodeValuesOnly,
        filter,
        format,
        formatter,
        serializeDate: typeof opts.serializeDate === "function" ? opts.serializeDate : defaults.serializeDate,
        skipNulls: typeof opts.skipNulls === "boolean" ? opts.skipNulls : defaults.skipNulls,
        sort: typeof opts.sort === "function" ? opts.sort : null,
        strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults.strictNullHandling
      };
    };
    module2.exports = function(object, opts) {
      var obj2 = object;
      var options = normalizeStringifyOptions(opts);
      var objKeys;
      var filter;
      if (typeof options.filter === "function") {
        filter = options.filter;
        obj2 = filter("", obj2);
      } else if (isArray(options.filter)) {
        filter = options.filter;
        objKeys = filter;
      }
      var keys = [];
      if (typeof obj2 !== "object" || obj2 === null) {
        return "";
      }
      var generateArrayPrefix = arrayPrefixGenerators[options.arrayFormat];
      var commaRoundTrip = generateArrayPrefix === "comma" && options.commaRoundTrip;
      if (!objKeys) {
        objKeys = Object.keys(obj2);
      }
      if (options.sort) {
        objKeys.sort(options.sort);
      }
      var sideChannel = getSideChannel();
      for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];
        var value = obj2[key];
        if (options.skipNulls && value === null) {
          continue;
        }
        pushToArray(keys, stringify(value, key, generateArrayPrefix, commaRoundTrip, options.allowEmptyArrays, options.strictNullHandling, options.skipNulls, options.encodeDotInKeys, options.encode ? options.encoder : null, options.filter, options.sort, options.allowDots, options.serializeDate, options.format, options.formatter, options.encodeValuesOnly, options.charset, sideChannel));
      }
      var joined = keys.join(options.delimiter);
      var prefix = options.addQueryPrefix === true ? "?" : "";
      if (options.charsetSentinel) {
        if (options.charset === "iso-8859-1") {
          prefix += "utf8=%26%2310003%3B&";
        } else {
          prefix += "utf8=%E2%9C%93&";
        }
      }
      return joined.length > 0 ? prefix + joined : "";
    };
  }
});

// netlify/functions/node_modules/qs/lib/parse.js
var require_parse = __commonJS({
  "netlify/functions/node_modules/qs/lib/parse.js"(exports2, module2) {
    "use strict";
    var utils = require_utils();
    var has = Object.prototype.hasOwnProperty;
    var isArray = Array.isArray;
    var defaults = {
      allowDots: false,
      allowEmptyArrays: false,
      allowPrototypes: false,
      allowSparse: false,
      arrayLimit: 20,
      charset: "utf-8",
      charsetSentinel: false,
      comma: false,
      decodeDotInKeys: false,
      decoder: utils.decode,
      delimiter: "&",
      depth: 5,
      duplicates: "combine",
      ignoreQueryPrefix: false,
      interpretNumericEntities: false,
      parameterLimit: 1e3,
      parseArrays: true,
      plainObjects: false,
      strictDepth: false,
      strictNullHandling: false,
      throwOnLimitExceeded: false
    };
    var interpretNumericEntities = function(str) {
      return str.replace(/&#(\d+);/g, function($0, numberStr) {
        return String.fromCharCode(parseInt(numberStr, 10));
      });
    };
    var parseArrayValue = function(val, options, currentArrayLength) {
      if (val && typeof val === "string" && options.comma && val.indexOf(",") > -1) {
        return val.split(",");
      }
      if (options.throwOnLimitExceeded && currentArrayLength >= options.arrayLimit) {
        throw new RangeError("Array limit exceeded. Only " + options.arrayLimit + " element" + (options.arrayLimit === 1 ? "" : "s") + " allowed in an array.");
      }
      return val;
    };
    var isoSentinel = "utf8=%26%2310003%3B";
    var charsetSentinel = "utf8=%E2%9C%93";
    var parseValues = function parseQueryStringValues(str, options) {
      var obj2 = { __proto__: null };
      var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, "") : str;
      cleanStr = cleanStr.replace(/%5B/gi, "[").replace(/%5D/gi, "]");
      var limit = options.parameterLimit === Infinity ? void 0 : options.parameterLimit;
      var parts = cleanStr.split(options.delimiter, options.throwOnLimitExceeded ? limit + 1 : limit);
      if (options.throwOnLimitExceeded && parts.length > limit) {
        throw new RangeError("Parameter limit exceeded. Only " + limit + " parameter" + (limit === 1 ? "" : "s") + " allowed.");
      }
      var skipIndex = -1;
      var i;
      var charset = options.charset;
      if (options.charsetSentinel) {
        for (i = 0; i < parts.length; ++i) {
          if (parts[i].indexOf("utf8=") === 0) {
            if (parts[i] === charsetSentinel) {
              charset = "utf-8";
            } else if (parts[i] === isoSentinel) {
              charset = "iso-8859-1";
            }
            skipIndex = i;
            i = parts.length;
          }
        }
      }
      for (i = 0; i < parts.length; ++i) {
        if (i === skipIndex) {
          continue;
        }
        var part = parts[i];
        var bracketEqualsPos = part.indexOf("]=");
        var pos = bracketEqualsPos === -1 ? part.indexOf("=") : bracketEqualsPos + 1;
        var key;
        var val;
        if (pos === -1) {
          key = options.decoder(part, defaults.decoder, charset, "key");
          val = options.strictNullHandling ? null : "";
        } else {
          key = options.decoder(part.slice(0, pos), defaults.decoder, charset, "key");
          val = utils.maybeMap(parseArrayValue(part.slice(pos + 1), options, isArray(obj2[key]) ? obj2[key].length : 0), function(encodedVal) {
            return options.decoder(encodedVal, defaults.decoder, charset, "value");
          });
        }
        if (val && options.interpretNumericEntities && charset === "iso-8859-1") {
          val = interpretNumericEntities(String(val));
        }
        if (part.indexOf("[]=") > -1) {
          val = isArray(val) ? [val] : val;
        }
        var existing = has.call(obj2, key);
        if (existing && options.duplicates === "combine") {
          obj2[key] = utils.combine(obj2[key], val);
        } else if (!existing || options.duplicates === "last") {
          obj2[key] = val;
        }
      }
      return obj2;
    };
    var parseObject = function(chain, val, options, valuesParsed) {
      var currentArrayLength = 0;
      if (chain.length > 0 && chain[chain.length - 1] === "[]") {
        var parentKey = chain.slice(0, -1).join("");
        currentArrayLength = Array.isArray(val) && val[parentKey] ? val[parentKey].length : 0;
      }
      var leaf = valuesParsed ? val : parseArrayValue(val, options, currentArrayLength);
      for (var i = chain.length - 1; i >= 0; --i) {
        var obj2;
        var root = chain[i];
        if (root === "[]" && options.parseArrays) {
          obj2 = options.allowEmptyArrays && (leaf === "" || options.strictNullHandling && leaf === null) ? [] : utils.combine([], leaf);
        } else {
          obj2 = options.plainObjects ? { __proto__: null } : {};
          var cleanRoot = root.charAt(0) === "[" && root.charAt(root.length - 1) === "]" ? root.slice(1, -1) : root;
          var decodedRoot = options.decodeDotInKeys ? cleanRoot.replace(/%2E/g, ".") : cleanRoot;
          var index = parseInt(decodedRoot, 10);
          if (!options.parseArrays && decodedRoot === "") {
            obj2 = { 0: leaf };
          } else if (!isNaN(index) && root !== decodedRoot && String(index) === decodedRoot && index >= 0 && (options.parseArrays && index <= options.arrayLimit)) {
            obj2 = [];
            obj2[index] = leaf;
          } else if (decodedRoot !== "__proto__") {
            obj2[decodedRoot] = leaf;
          }
        }
        leaf = obj2;
      }
      return leaf;
    };
    var parseKeys = function parseQueryStringKeys(givenKey, val, options, valuesParsed) {
      if (!givenKey) {
        return;
      }
      var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, "[$1]") : givenKey;
      var brackets = /(\[[^[\]]*])/;
      var child = /(\[[^[\]]*])/g;
      var segment = options.depth > 0 && brackets.exec(key);
      var parent = segment ? key.slice(0, segment.index) : key;
      var keys = [];
      if (parent) {
        if (!options.plainObjects && has.call(Object.prototype, parent)) {
          if (!options.allowPrototypes) {
            return;
          }
        }
        keys.push(parent);
      }
      var i = 0;
      while (options.depth > 0 && (segment = child.exec(key)) !== null && i < options.depth) {
        i += 1;
        if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
          if (!options.allowPrototypes) {
            return;
          }
        }
        keys.push(segment[1]);
      }
      if (segment) {
        if (options.strictDepth === true) {
          throw new RangeError("Input depth exceeded depth option of " + options.depth + " and strictDepth is true");
        }
        keys.push("[" + key.slice(segment.index) + "]");
      }
      return parseObject(keys, val, options, valuesParsed);
    };
    var normalizeParseOptions = function normalizeParseOptions2(opts) {
      if (!opts) {
        return defaults;
      }
      if (typeof opts.allowEmptyArrays !== "undefined" && typeof opts.allowEmptyArrays !== "boolean") {
        throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
      }
      if (typeof opts.decodeDotInKeys !== "undefined" && typeof opts.decodeDotInKeys !== "boolean") {
        throw new TypeError("`decodeDotInKeys` option can only be `true` or `false`, when provided");
      }
      if (opts.decoder !== null && typeof opts.decoder !== "undefined" && typeof opts.decoder !== "function") {
        throw new TypeError("Decoder has to be a function.");
      }
      if (typeof opts.charset !== "undefined" && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") {
        throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
      }
      if (typeof opts.throwOnLimitExceeded !== "undefined" && typeof opts.throwOnLimitExceeded !== "boolean") {
        throw new TypeError("`throwOnLimitExceeded` option must be a boolean");
      }
      var charset = typeof opts.charset === "undefined" ? defaults.charset : opts.charset;
      var duplicates = typeof opts.duplicates === "undefined" ? defaults.duplicates : opts.duplicates;
      if (duplicates !== "combine" && duplicates !== "first" && duplicates !== "last") {
        throw new TypeError("The duplicates option must be either combine, first, or last");
      }
      var allowDots = typeof opts.allowDots === "undefined" ? opts.decodeDotInKeys === true ? true : defaults.allowDots : !!opts.allowDots;
      return {
        allowDots,
        allowEmptyArrays: typeof opts.allowEmptyArrays === "boolean" ? !!opts.allowEmptyArrays : defaults.allowEmptyArrays,
        allowPrototypes: typeof opts.allowPrototypes === "boolean" ? opts.allowPrototypes : defaults.allowPrototypes,
        allowSparse: typeof opts.allowSparse === "boolean" ? opts.allowSparse : defaults.allowSparse,
        arrayLimit: typeof opts.arrayLimit === "number" ? opts.arrayLimit : defaults.arrayLimit,
        charset,
        charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults.charsetSentinel,
        comma: typeof opts.comma === "boolean" ? opts.comma : defaults.comma,
        decodeDotInKeys: typeof opts.decodeDotInKeys === "boolean" ? opts.decodeDotInKeys : defaults.decodeDotInKeys,
        decoder: typeof opts.decoder === "function" ? opts.decoder : defaults.decoder,
        delimiter: typeof opts.delimiter === "string" || utils.isRegExp(opts.delimiter) ? opts.delimiter : defaults.delimiter,
        depth: typeof opts.depth === "number" || opts.depth === false ? +opts.depth : defaults.depth,
        duplicates,
        ignoreQueryPrefix: opts.ignoreQueryPrefix === true,
        interpretNumericEntities: typeof opts.interpretNumericEntities === "boolean" ? opts.interpretNumericEntities : defaults.interpretNumericEntities,
        parameterLimit: typeof opts.parameterLimit === "number" ? opts.parameterLimit : defaults.parameterLimit,
        parseArrays: opts.parseArrays !== false,
        plainObjects: typeof opts.plainObjects === "boolean" ? opts.plainObjects : defaults.plainObjects,
        strictDepth: typeof opts.strictDepth === "boolean" ? !!opts.strictDepth : defaults.strictDepth,
        strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults.strictNullHandling,
        throwOnLimitExceeded: typeof opts.throwOnLimitExceeded === "boolean" ? opts.throwOnLimitExceeded : false
      };
    };
    module2.exports = function(str, opts) {
      var options = normalizeParseOptions(opts);
      if (str === "" || str === null || typeof str === "undefined") {
        return options.plainObjects ? { __proto__: null } : {};
      }
      var tempObj = typeof str === "string" ? parseValues(str, options) : str;
      var obj2 = options.plainObjects ? { __proto__: null } : {};
      var keys = Object.keys(tempObj);
      for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var newObj = parseKeys(key, tempObj[key], options, typeof str === "string");
        obj2 = utils.merge(obj2, newObj, options);
      }
      if (options.allowSparse === true) {
        return obj2;
      }
      return utils.compact(obj2);
    };
  }
});

// netlify/functions/node_modules/qs/lib/index.js
var require_lib = __commonJS({
  "netlify/functions/node_modules/qs/lib/index.js"(exports2, module2) {
    "use strict";
    var stringify = require_stringify();
    var parse = require_parse();
    var formats = require_formats();
    module2.exports = {
      formats,
      parse,
      stringify
    };
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/client/request.js
var require_request = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/client/request.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _qs = _interopRequireDefault(require_lib());
    function _interopRequireDefault(obj2) {
      return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
    }
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var Request = /* @__PURE__ */ function() {
      function Request2(options) {
        _classCallCheck(this, Request2);
        this.host = options.host;
        this.port = options.port;
        this.ssl = options.ssl;
        this.scheme = this.ssl ? "https" : "http";
        this.verb = options.verb;
        this.path = options.path;
        this.params = options.params;
        this.queryPath = this.fullQueryPath();
        this.bearerToken = options.bearerToken;
        this.clientVersion = options.clientVersion;
        this.languageVersion = options.languageVersion.replace("v", "");
        this.appId = options.appId;
        this.appVersion = options.appVersion;
        this.headers = {
          "User-Agent": this.userAgent(),
          "Accept": "application/json, application/vnd.amadeus+json"
        };
        this.ListHTTPOverride = ["/v2/shopping/flight-offers", "/v1/shopping/seatmaps", "/v1/shopping/availability/flight-availabilities", "/v2/shopping/flight-offers/prediction", "/v1/shopping/flight-offers/pricing", "/v1/shopping/flight-offers/upselling"];
        this.addAuthorizationHeader();
        this.addContentTypeHeader();
        this.addHTTPOverrideHeader();
      }
      _createClass(Request2, [{
        key: "options",
        value: function options() {
          var options2 = {
            "host": this.host,
            "port": this.port,
            "protocol": "".concat(this.scheme, ":"),
            "path": this.queryPath,
            "method": this.verb,
            "headers": this.headers
          };
          return options2;
        }
      }, {
        key: "body",
        value: function body() {
          if (this.verb !== "POST") {
            return "";
          } else {
            if (!this.bearerToken) {
              return _qs["default"].stringify(this.params);
            }
            return this.params;
          }
        }
      }, {
        key: "userAgent",
        value: function userAgent() {
          var userAgent2 = "amadeus-node/".concat(this.clientVersion, " node/").concat(this.languageVersion);
          if (!this.appId) {
            return userAgent2;
          }
          return "".concat(userAgent2, " ").concat(this.appId, "/").concat(this.appVersion);
        }
      }, {
        key: "fullQueryPath",
        value: function fullQueryPath() {
          if (this.verb === "POST") {
            return this.path;
          } else {
            return "".concat(this.path, "?").concat(_qs["default"].stringify(this.params));
          }
        }
      }, {
        key: "addAuthorizationHeader",
        value: function addAuthorizationHeader() {
          if (!this.bearerToken) {
            return;
          }
          this.headers["Authorization"] = "Bearer ".concat(this.bearerToken);
        }
      }, {
        key: "addContentTypeHeader",
        value: function addContentTypeHeader() {
          if (this.verb === "POST" && !this.bearerToken) {
            this.headers["Content-Type"] = "application/x-www-form-urlencoded";
          } else {
            this.headers["Content-Type"] = "application/vnd.amadeus+json";
          }
          return;
        }
      }, {
        key: "addHTTPOverrideHeader",
        value: function addHTTPOverrideHeader() {
          if (this.verb === "POST" && this.ListHTTPOverride.includes(this.path)) {
            this.headers["X-HTTP-Method-Override"] = "GET";
          }
          return;
        }
      }]);
      return Request2;
    }();
    var _default = Request;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/client/validator.js
var require_validator = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/client/validator.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _https = _interopRequireDefault(require("https"));
    var _http = _interopRequireDefault(require("http"));
    function _interopRequireDefault(obj2) {
      return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
    }
    function _inherits(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
      Object.defineProperty(subClass, "prototype", { writable: false });
      if (superClass)
        _setPrototypeOf(subClass, superClass);
    }
    function _createSuper(Derived) {
      var hasNativeReflectConstruct = _isNativeReflectConstruct();
      return function _createSuperInternal() {
        var Super = _getPrototypeOf(Derived), result;
        if (hasNativeReflectConstruct) {
          var NewTarget = _getPrototypeOf(this).constructor;
          result = Reflect.construct(Super, arguments, NewTarget);
        } else {
          result = Super.apply(this, arguments);
        }
        return _possibleConstructorReturn(this, result);
      };
    }
    function _possibleConstructorReturn(self2, call) {
      if (call && (_typeof(call) === "object" || typeof call === "function")) {
        return call;
      } else if (call !== void 0) {
        throw new TypeError("Derived constructors may only return object or undefined");
      }
      return _assertThisInitialized(self2);
    }
    function _assertThisInitialized(self2) {
      if (self2 === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }
      return self2;
    }
    function _wrapNativeSuper(Class) {
      var _cache = typeof Map === "function" ? /* @__PURE__ */ new Map() : void 0;
      _wrapNativeSuper = function _wrapNativeSuper2(Class2) {
        if (Class2 === null || !_isNativeFunction(Class2))
          return Class2;
        if (typeof Class2 !== "function") {
          throw new TypeError("Super expression must either be null or a function");
        }
        if (typeof _cache !== "undefined") {
          if (_cache.has(Class2))
            return _cache.get(Class2);
          _cache.set(Class2, Wrapper);
        }
        function Wrapper() {
          return _construct(Class2, arguments, _getPrototypeOf(this).constructor);
        }
        Wrapper.prototype = Object.create(Class2.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } });
        return _setPrototypeOf(Wrapper, Class2);
      };
      return _wrapNativeSuper(Class);
    }
    function _construct(Parent, args, Class) {
      if (_isNativeReflectConstruct()) {
        _construct = Reflect.construct.bind();
      } else {
        _construct = function _construct2(Parent2, args2, Class2) {
          var a = [null];
          a.push.apply(a, args2);
          var Constructor = Function.bind.apply(Parent2, a);
          var instance = new Constructor();
          if (Class2)
            _setPrototypeOf(instance, Class2.prototype);
          return instance;
        };
      }
      return _construct.apply(null, arguments);
    }
    function _isNativeReflectConstruct() {
      if (typeof Reflect === "undefined" || !Reflect.construct)
        return false;
      if (Reflect.construct.sham)
        return false;
      if (typeof Proxy === "function")
        return true;
      try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
        }));
        return true;
      } catch (e) {
        return false;
      }
    }
    function _isNativeFunction(fn) {
      return Function.toString.call(fn).indexOf("[native code]") !== -1;
    }
    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
        o2.__proto__ = p2;
        return o2;
      };
      return _setPrototypeOf(o, p);
    }
    function _getPrototypeOf(o) {
      _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf2(o2) {
        return o2.__proto__ || Object.getPrototypeOf(o2);
      };
      return _getPrototypeOf(o);
    }
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var HOSTS = {
      "test": "test.api.amadeus.com",
      "production": "api.amadeus.com"
    };
    var RECOGNIZED_OPTIONS = ["clientId", "clientSecret", "logger", "logLevel", "hostname", "host", "customAppId", "customAppVersion", "http", "ssl", "port"];
    var Validator = /* @__PURE__ */ function() {
      function Validator2() {
        _classCallCheck(this, Validator2);
      }
      _createClass(Validator2, [{
        key: "validateAndInitialize",
        value: function validateAndInitialize(client, options) {
          this.initializeClientCredentials(client, options);
          this.initializeLogger(client, options);
          this.initializeHost(client, options);
          this.initializeCustomApp(client, options);
          this.initializeHttp(client, options);
          this.warnOnUnrecognizedOptions(options, client, RECOGNIZED_OPTIONS);
        }
      }, {
        key: "initializeClientCredentials",
        value: function initializeClientCredentials(client, options) {
          client.clientId = this.initRequired("clientId", options);
          client.clientSecret = this.initRequired("clientSecret", options);
        }
      }, {
        key: "initializeLogger",
        value: function initializeLogger(client, options) {
          client.logger = this.initOptional("logger", options, console);
          client.logLevel = this.initOptional("logLevel", options, "silent");
        }
      }, {
        key: "initializeHost",
        value: function initializeHost(client, options) {
          var hostname = this.initOptional("hostname", options, "test");
          client.host = this.initOptional("host", options, HOSTS[hostname]);
          client.port = this.initOptional("port", options, 443);
          client.ssl = this.initOptional("ssl", options, true);
        }
      }, {
        key: "initializeCustomApp",
        value: function initializeCustomApp(client, options) {
          client.customAppId = this.initOptional("customAppId", options);
          client.customAppVersion = this.initOptional("customAppVersion", options);
        }
      }, {
        key: "initializeHttp",
        value: function initializeHttp(client, options) {
          var network = client.ssl ? _https["default"] : _http["default"];
          client.http = this.initOptional("http", options, network);
        }
      }, {
        key: "initRequired",
        value: function initRequired(key, options) {
          var result = this.initOptional(key, options);
          if (!result)
            throw new ArgumentError("Missing required argument: ".concat(key));
          return result;
        }
      }, {
        key: "initOptional",
        value: function initOptional(key, options) {
          var fallback = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null;
          var value = options[key];
          var envKey = "AMADEUS_".concat(key.replace(/[A-Z]/g, function(c) {
            return "_".concat(c.toLowerCase());
          }).toUpperCase());
          if (value == void 0) {
            value = options[key];
          }
          if (value == void 0) {
            value = process.env[envKey];
          }
          if (value == void 0) {
            value = fallback;
          }
          return value;
        }
      }, {
        key: "warnOnUnrecognizedOptions",
        value: function warnOnUnrecognizedOptions(options, client, recognizedOptions) {
          Object.keys(options).forEach(function(key) {
            if (recognizedOptions.indexOf(key) === -1 && client.warn()) {
              client.logger.log("Unrecognized option: ".concat(key));
            }
          });
          return null;
        }
      }]);
      return Validator2;
    }();
    var ArgumentError = /* @__PURE__ */ function(_Error) {
      _inherits(ArgumentError2, _Error);
      var _super = _createSuper(ArgumentError2);
      function ArgumentError2(message) {
        var _this;
        _classCallCheck(this, ArgumentError2);
        _this = _super.call(this, message);
        _this.name = "ArgumentError";
        return _this;
      }
      return _createClass(ArgumentError2);
    }(/* @__PURE__ */ _wrapNativeSuper(Error));
    var _default = Validator;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/package.json
var require_package = __commonJS({
  "netlify/functions/node_modules/amadeus/package.json"(exports2, module2) {
    module2.exports = {
      name: "amadeus",
      version: "8.1.0",
      description: "Node library for the Amadeus travel APIs",
      main: "lib/amadeus.js",
      scripts: {
        prebuild: "npm run lint:src & npm run docs",
        build: "babel -d lib src/ -s inline",
        "build:watch": "watch 'npm run build' src",
        prepublishOnly: "babel -d lib src/ -s inline",
        pretest: "eslint spec",
        test: "jest spec --coverage --collectCoverageFrom=src/**/*.js",
        "test:watch": "watch 'npm test' src spec",
        predocs: "npm run lint:docs",
        docs: "documentation build src/** -f html -o docs -a undefined -a public",
        "docs:watch": "watch 'npm run docs' src",
        "docs:serve": "open docs/",
        "docs:dev": "npm run docs:serve && npm run docs:watch",
        "lint:src": "eslint src",
        "lint:docs": "documentation lint src/**",
        console: "node -r ./lib/amadeus.js"
      },
      jest: {
        verbose: true,
        testEnvironment: "node"
      },
      repository: {
        type: "git",
        url: "git+https://github.com/amadeus4dev/amadeus-node.git"
      },
      keywords: [
        "amadeus",
        "travel",
        "api",
        "apis",
        "hotels",
        "flights"
      ],
      author: "amadeus-developer",
      license: "MIT",
      bugs: {
        url: "https://github.com/amadeus4dev/amadeus-node/issues"
      },
      homepage: "https://developers.amadeus.com",
      contributors: [
        "cbetta",
        "Anthony Roux",
        "Alvaro Navarro",
        "Akshit Singla",
        "Anna Tsolakou",
        "Minji Kim",
        "Gustavo Giunco Bertoldi"
      ],
      devDependencies: {
        "@babel/cli": "^7.18.6",
        "@babel/core": "^7.18.6",
        "@babel/preset-env": "^7.18.6",
        "babel-plugin-add-module-exports": "^1.0.4",
        "babel-preset-env": "^1.7.0",
        documentation: "^13.2.5",
        eslint: "^4.16.0",
        jest: "^24.8.0",
        merge: "^2.1.1",
        watch: "^1.0.2"
      },
      dependencies: {
        bluebird: "^3.7.2",
        qs: "^6.11.0"
      }
    };
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/client.js
var require_client = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/client.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _events = _interopRequireDefault(require("events"));
    var _bluebird = _interopRequireDefault(require_bluebird());
    var _util = _interopRequireDefault(require("util"));
    var _access_token = _interopRequireDefault(require_access_token());
    var _listener = _interopRequireDefault(require_listener());
    var _request = _interopRequireDefault(require_request());
    var _validator = _interopRequireDefault(require_validator());
    var _package = _interopRequireDefault(require_package());
    function _interopRequireDefault(obj2) {
      return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
    }
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var Client = /* @__PURE__ */ function() {
      function Client2() {
        var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
        _classCallCheck(this, Client2);
        new _validator["default"]().validateAndInitialize(this, options);
        this.accessToken = new _access_token["default"](this);
        this.version = _package["default"].version;
      }
      _createClass(Client2, [{
        key: "get",
        value: function get(path2) {
          var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return this.request("GET", path2, params);
        }
      }, {
        key: "post",
        value: function post(path2) {
          var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return this.request("POST", path2, params);
        }
      }, {
        key: "delete",
        value: function _delete(path2) {
          var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return this.request("DELETE", path2, params);
        }
      }, {
        key: "request",
        value: function request(verb, path2) {
          var _this = this;
          var params = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          return this.accessToken.bearerToken(this).then(function(bearerToken) {
            return _this.unauthenticatedRequest(verb, path2, params, bearerToken);
          });
        }
      }, {
        key: "unauthenticatedRequest",
        value: function unauthenticatedRequest(verb, path2, params) {
          var bearerToken = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : null;
          var request = this.buildRequest(verb, path2, params, bearerToken);
          this.log(request);
          var emitter = new _events["default"]();
          var promise = this.buildPromise(emitter);
          this.execute(request, emitter);
          return promise;
        }
      }, {
        key: "execute",
        value: function execute(request, emitter) {
          var http_request = this.http.request(request.options());
          var listener = new _listener["default"](request, emitter, this);
          http_request.on("response", listener.onResponse.bind(listener));
          http_request.on("error", listener.onError.bind(listener));
          http_request.write(request.body());
          http_request.end();
        }
      }, {
        key: "buildRequest",
        value: function buildRequest(verb, path2, params, bearerToken) {
          return new _request["default"]({
            host: this.host,
            verb,
            path: path2,
            params,
            bearerToken,
            clientVersion: this.version,
            languageVersion: process.version,
            appId: this.customAppId,
            appVersion: this.customAppVersion,
            port: this.port,
            ssl: this.ssl
          });
        }
      }, {
        key: "buildPromise",
        value: function buildPromise(emitter) {
          return new _bluebird["default"](function(resolve, reject) {
            emitter.on("resolve", function(response) {
              return resolve(response);
            });
            emitter.on("reject", function(error) {
              return reject(error);
            });
          });
        }
      }, {
        key: "log",
        value: function log(request) {
          if (this.debug()) {
            this.logger.log(_util["default"].inspect(request, false, null));
          }
        }
      }, {
        key: "debug",
        value: function debug() {
          return this.logLevel == "debug";
        }
      }, {
        key: "warn",
        value: function warn() {
          return this.logLevel == "warn" || this.debug();
        }
      }]);
      return Client2;
    }();
    var _default = Client;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/client/pagination.js
var require_pagination = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/client/pagination.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var Pagination = /* @__PURE__ */ function() {
      function Pagination2(client) {
        _classCallCheck(this, Pagination2);
        this.client = client;
      }
      _createClass(Pagination2, [{
        key: "page",
        value: function page(pageName, response) {
          var pageNumber = this.pageNumber(response, pageName);
          if (pageNumber) {
            return this.call(response.request, pageNumber);
          } else {
            return this.nullPromise();
          }
        }
      }, {
        key: "call",
        value: function call(request, pageNumber) {
          var params = request.params || {};
          params["page"] = params["page"] || {};
          params["page"]["offset"] = pageNumber;
          return this.client.request(request.verb, request.path, params);
        }
      }, {
        key: "pageNumber",
        value: function pageNumber(response, pageName) {
          try {
            return response.result["meta"]["links"][pageName].split("page%5Boffset%5D=")[1].split("&")[0];
          } catch (TypeError2) {
            return null;
          }
        }
      }, {
        key: "nullPromise",
        value: function nullPromise() {
          return new Promise(function(resolve) {
            resolve(null);
          });
        }
      }]);
      return Pagination2;
    }();
    var _default = Pagination;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/reference_data/urls/checkin_links.js
var require_checkin_links = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/reference_data/urls/checkin_links.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var CheckinLinks = /* @__PURE__ */ function() {
      function CheckinLinks2(client) {
        _classCallCheck(this, CheckinLinks2);
        this.client = client;
      }
      _createClass(CheckinLinks2, [{
        key: "get",
        value: function get() {
          var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          return this.client.get("/v2/reference-data/urls/checkin-links", params);
        }
      }]);
      return CheckinLinks2;
    }();
    var _default = CheckinLinks;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/reference_data/urls.js
var require_urls = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/reference_data/urls.js"(exports2, module2) {
    "use strict";
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _checkin_links = _interopRequireDefault(require_checkin_links());
    function _interopRequireDefault(obj2) {
      return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    var Urls = /* @__PURE__ */ _createClass(function Urls2(client) {
      _classCallCheck(this, Urls2);
      this.client = client;
      this.checkinLinks = new _checkin_links["default"](client);
    });
    var _default = Urls;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/reference_data/locations/airports.js
var require_airports = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/reference_data/locations/airports.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var Airports = /* @__PURE__ */ function() {
      function Airports2(client) {
        _classCallCheck(this, Airports2);
        this.client = client;
      }
      _createClass(Airports2, [{
        key: "get",
        value: function get() {
          var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          return this.client.get("/v1/reference-data/locations/airports", params);
        }
      }]);
      return Airports2;
    }();
    var _default = Airports;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/reference_data/locations/cities.js
var require_cities = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/reference_data/locations/cities.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var Cities = /* @__PURE__ */ function() {
      function Cities2(client) {
        _classCallCheck(this, Cities2);
        this.client = client;
      }
      _createClass(Cities2, [{
        key: "get",
        value: function get() {
          var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          return this.client.get("/v1/reference-data/locations/cities", params);
        }
      }]);
      return Cities2;
    }();
    var _default = Cities;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/reference_data/locations/hotel.js
var require_hotel = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/reference_data/locations/hotel.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var Hotel = /* @__PURE__ */ function() {
      function Hotel2(client) {
        _classCallCheck(this, Hotel2);
        this.client = client;
      }
      _createClass(Hotel2, [{
        key: "get",
        value: function get() {
          var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          return this.client.get("/v1/reference-data/locations/hotel", params);
        }
      }]);
      return Hotel2;
    }();
    var _default = Hotel;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/reference_data/locations/hotels/by-city.js
var require_by_city = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/reference_data/locations/hotels/by-city.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var byCity = /* @__PURE__ */ function() {
      function byCity2(client) {
        _classCallCheck(this, byCity2);
        this.client = client;
      }
      _createClass(byCity2, [{
        key: "get",
        value: function get() {
          var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          return this.client.get("/v1/reference-data/locations/hotels/by-city", params);
        }
      }]);
      return byCity2;
    }();
    var _default = byCity;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/reference_data/locations/hotels/by-geocode.js
var require_by_geocode = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/reference_data/locations/hotels/by-geocode.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var byGeocode = /* @__PURE__ */ function() {
      function byGeocode2(client) {
        _classCallCheck(this, byGeocode2);
        this.client = client;
      }
      _createClass(byGeocode2, [{
        key: "get",
        value: function get() {
          var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          return this.client.get("/v1/reference-data/locations/hotels/by-geocode", params);
        }
      }]);
      return byGeocode2;
    }();
    var _default = byGeocode;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/reference_data/locations/hotels/by-hotels.js
var require_by_hotels = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/reference_data/locations/hotels/by-hotels.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var byHotels = /* @__PURE__ */ function() {
      function byHotels2(client) {
        _classCallCheck(this, byHotels2);
        this.client = client;
      }
      _createClass(byHotels2, [{
        key: "get",
        value: function get() {
          var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          return this.client.get("/v1/reference-data/locations/hotels/by-hotels", params);
        }
      }]);
      return byHotels2;
    }();
    var _default = byHotels;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/reference_data/locations/hotels.js
var require_hotels = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/reference_data/locations/hotels.js"(exports2, module2) {
    "use strict";
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _byCity = _interopRequireDefault(require_by_city());
    var _byGeocode = _interopRequireDefault(require_by_geocode());
    var _byHotels = _interopRequireDefault(require_by_hotels());
    function _interopRequireDefault(obj2) {
      return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    var Hotels = /* @__PURE__ */ _createClass(function Hotels2(client) {
      _classCallCheck(this, Hotels2);
      this.client = client;
      this.byCity = new _byCity["default"](client);
      this.byGeocode = new _byGeocode["default"](client);
      this.byHotels = new _byHotels["default"](client);
    });
    var _default = Hotels;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/reference_data/locations/poi.js
var require_poi = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/reference_data/locations/poi.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var PointOfInterest = /* @__PURE__ */ function() {
      function PointOfInterest2(client, poiId) {
        _classCallCheck(this, PointOfInterest2);
        this.client = client;
        this._poiId = poiId;
      }
      _createClass(PointOfInterest2, [{
        key: "get",
        value: function get() {
          return this.client.get("/v1/reference-data/locations/pois/".concat(this._poiId));
        }
      }]);
      return PointOfInterest2;
    }();
    var _default = PointOfInterest;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/reference_data/locations/points_of_interest/by-square.js
var require_by_square = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/reference_data/locations/points_of_interest/by-square.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var bySquare = /* @__PURE__ */ function() {
      function bySquare2(client) {
        _classCallCheck(this, bySquare2);
        this.client = client;
      }
      _createClass(bySquare2, [{
        key: "get",
        value: function get() {
          var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          return this.client.get("/v1/reference-data/locations/pois/by-square", params);
        }
      }]);
      return bySquare2;
    }();
    var _default = bySquare;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/reference_data/locations/pois.js
var require_pois = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/reference_data/locations/pois.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _bySquare = _interopRequireDefault(require_by_square());
    function _interopRequireDefault(obj2) {
      return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
    }
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var PointsOfInterest = /* @__PURE__ */ function() {
      function PointsOfInterest2(client) {
        _classCallCheck(this, PointsOfInterest2);
        this.client = client;
        this.bySquare = new _bySquare["default"](client);
      }
      _createClass(PointsOfInterest2, [{
        key: "get",
        value: function get() {
          var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          return this.client.get("/v1/reference-data/locations/pois", params);
        }
      }]);
      return PointsOfInterest2;
    }();
    var _default = PointsOfInterest;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/reference_data/locations.js
var require_locations = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/reference_data/locations.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _airports = _interopRequireDefault(require_airports());
    var _cities = _interopRequireDefault(require_cities());
    var _hotel = _interopRequireDefault(require_hotel());
    var _hotels = _interopRequireDefault(require_hotels());
    var _poi = _interopRequireDefault(require_poi());
    var _pois = _interopRequireDefault(require_pois());
    function _interopRequireDefault(obj2) {
      return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
    }
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var Locations = /* @__PURE__ */ function() {
      function Locations2(client) {
        _classCallCheck(this, Locations2);
        this.client = client;
        this.airports = new _airports["default"](client);
        this.cities = new _cities["default"](client);
        this.hotel = new _hotel["default"](client);
        this.hotels = new _hotels["default"](client);
        this.pointsOfInterest = new _pois["default"](client);
      }
      _createClass(Locations2, [{
        key: "get",
        value: function get() {
          var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          return this.client.get("/v1/reference-data/locations", params);
        }
      }, {
        key: "pointOfInterest",
        value: function pointOfInterest(poiId) {
          return new _poi["default"](this.client, poiId);
        }
      }]);
      return Locations2;
    }();
    var _default = Locations;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/reference_data/location.js
var require_location = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/reference_data/location.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var Location = /* @__PURE__ */ function() {
      function Location2(client, locationId) {
        _classCallCheck(this, Location2);
        this.client = client;
        this.locationId = locationId;
      }
      _createClass(Location2, [{
        key: "get",
        value: function get() {
          var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          return this.client.get("/v1/reference-data/locations/".concat(this.locationId), params);
        }
      }]);
      return Location2;
    }();
    var _default = Location;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/reference_data/airlines.js
var require_airlines = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/reference_data/airlines.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var Airlines = /* @__PURE__ */ function() {
      function Airlines2(client) {
        _classCallCheck(this, Airlines2);
        this.client = client;
      }
      _createClass(Airlines2, [{
        key: "get",
        value: function get() {
          var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          return this.client.get("/v1/reference-data/airlines", params);
        }
      }]);
      return Airlines2;
    }();
    var _default = Airlines;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/reference_data/recommended_locations.js
var require_recommended_locations = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/reference_data/recommended_locations.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var RecommendedLocations = /* @__PURE__ */ function() {
      function RecommendedLocations2(client) {
        _classCallCheck(this, RecommendedLocations2);
        this.client = client;
      }
      _createClass(RecommendedLocations2, [{
        key: "get",
        value: function get() {
          var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          return this.client.get("/v1/reference-data/recommended-locations", params);
        }
      }]);
      return RecommendedLocations2;
    }();
    var _default = RecommendedLocations;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/reference_data.js
var require_reference_data = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/reference_data.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _urls = _interopRequireDefault(require_urls());
    var _locations = _interopRequireDefault(require_locations());
    var _location = _interopRequireDefault(require_location());
    var _airlines = _interopRequireDefault(require_airlines());
    var _recommended_locations = _interopRequireDefault(require_recommended_locations());
    function _interopRequireDefault(obj2) {
      return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
    }
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var ReferenceData = /* @__PURE__ */ function() {
      function ReferenceData2(client) {
        _classCallCheck(this, ReferenceData2);
        this.client = client;
        this.urls = new _urls["default"](client);
        this.locations = new _locations["default"](client);
        this.airlines = new _airlines["default"](client);
        this.recommendedLocations = new _recommended_locations["default"](client);
      }
      _createClass(ReferenceData2, [{
        key: "location",
        value: function location(locationId) {
          return new _location["default"](this.client, locationId);
        }
      }]);
      return ReferenceData2;
    }();
    var _default = ReferenceData;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/shopping/flight_destinations.js
var require_flight_destinations = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/shopping/flight_destinations.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var FlightDestinations = /* @__PURE__ */ function() {
      function FlightDestinations2(client) {
        _classCallCheck(this, FlightDestinations2);
        this.client = client;
      }
      _createClass(FlightDestinations2, [{
        key: "get",
        value: function get() {
          var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          return this.client.get("/v1/shopping/flight-destinations", params);
        }
      }]);
      return FlightDestinations2;
    }();
    var _default = FlightDestinations;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/shopping/flight_offers/flight_choice_prediction.js
var require_flight_choice_prediction = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/shopping/flight_offers/flight_choice_prediction.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var FlightChoicePrediction = /* @__PURE__ */ function() {
      function FlightChoicePrediction2(client) {
        _classCallCheck(this, FlightChoicePrediction2);
        this.client = client;
      }
      _createClass(FlightChoicePrediction2, [{
        key: "post",
        value: function post() {
          var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          return this.client.post("/v2/shopping/flight-offers/prediction", params);
        }
      }]);
      return FlightChoicePrediction2;
    }();
    var _default = FlightChoicePrediction;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/shopping/flight_offers/pricing.js
var require_pricing = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/shopping/flight_offers/pricing.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var Pricing = /* @__PURE__ */ function() {
      function Pricing2(client) {
        _classCallCheck(this, Pricing2);
        this.client = client;
      }
      _createClass(Pricing2, [{
        key: "post",
        value: function post() {
          var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          return this.client.post("/v1/shopping/flight-offers/pricing", params);
        }
      }]);
      return Pricing2;
    }();
    var _default = Pricing;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/shopping/flight_offers/upselling.js
var require_upselling = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/shopping/flight_offers/upselling.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var Upselling = /* @__PURE__ */ function() {
      function Upselling2(client) {
        _classCallCheck(this, Upselling2);
        this.client = client;
      }
      _createClass(Upselling2, [{
        key: "post",
        value: function post() {
          var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          return this.client.post("/v1/shopping/flight-offers/upselling", params);
        }
      }]);
      return Upselling2;
    }();
    var _default = Upselling;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/shopping/flight_offers.js
var require_flight_offers = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/shopping/flight_offers.js"(exports2, module2) {
    "use strict";
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _flight_choice_prediction = _interopRequireDefault(require_flight_choice_prediction());
    var _pricing = _interopRequireDefault(require_pricing());
    var _upselling = _interopRequireDefault(require_upselling());
    function _interopRequireDefault(obj2) {
      return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    var FlightOffers = /* @__PURE__ */ _createClass(function FlightOffers2(client) {
      _classCallCheck(this, FlightOffers2);
      this.client = client;
      this.prediction = new _flight_choice_prediction["default"](client);
      this.pricing = new _pricing["default"](client);
      this.upselling = new _upselling["default"](client);
    });
    var _default = FlightOffers;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/shopping/flight_offers_search.js
var require_flight_offers_search = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/shopping/flight_offers_search.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var FlightOffersSearch = /* @__PURE__ */ function() {
      function FlightOffersSearch2(client) {
        _classCallCheck(this, FlightOffersSearch2);
        this.client = client;
      }
      _createClass(FlightOffersSearch2, [{
        key: "get",
        value: function get() {
          var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          return this.client.get("/v2/shopping/flight-offers", params);
        }
      }, {
        key: "post",
        value: function post() {
          var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          return this.client.post("/v2/shopping/flight-offers", params);
        }
      }]);
      return FlightOffersSearch2;
    }();
    var _default = FlightOffersSearch;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/shopping/flight_dates.js
var require_flight_dates = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/shopping/flight_dates.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var FlightDates = /* @__PURE__ */ function() {
      function FlightDates2(client) {
        _classCallCheck(this, FlightDates2);
        this.client = client;
      }
      _createClass(FlightDates2, [{
        key: "get",
        value: function get() {
          var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          return this.client.get("/v1/shopping/flight-dates", params);
        }
      }]);
      return FlightDates2;
    }();
    var _default = FlightDates;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/shopping/seatmaps.js
var require_seatmaps = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/shopping/seatmaps.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var Seatmaps = /* @__PURE__ */ function() {
      function Seatmaps2(client) {
        _classCallCheck(this, Seatmaps2);
        this.client = client;
      }
      _createClass(Seatmaps2, [{
        key: "get",
        value: function get() {
          var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          return this.client.get("/v1/shopping/seatmaps", params);
        }
      }, {
        key: "post",
        value: function post() {
          var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          return this.client.post("/v1/shopping/seatmaps", params);
        }
      }]);
      return Seatmaps2;
    }();
    var _default = Seatmaps;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/shopping/hotel_offer_search.js
var require_hotel_offer_search = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/shopping/hotel_offer_search.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var HotelOfferSearch = /* @__PURE__ */ function() {
      function HotelOfferSearch2(client, offerId) {
        _classCallCheck(this, HotelOfferSearch2);
        this.client = client;
        this.offerId = offerId;
      }
      _createClass(HotelOfferSearch2, [{
        key: "get",
        value: function get() {
          var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          return this.client.get("/v3/shopping/hotel-offers/".concat(this.offerId), params);
        }
      }]);
      return HotelOfferSearch2;
    }();
    var _default = HotelOfferSearch;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/shopping/hotel_offers_search.js
var require_hotel_offers_search = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/shopping/hotel_offers_search.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var HotelOffersSearch = /* @__PURE__ */ function() {
      function HotelOffersSearch2(client) {
        _classCallCheck(this, HotelOffersSearch2);
        this.client = client;
      }
      _createClass(HotelOffersSearch2, [{
        key: "get",
        value: function get() {
          var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          return this.client.get("/v3/shopping/hotel-offers", params);
        }
      }]);
      return HotelOffersSearch2;
    }();
    var _default = HotelOffersSearch;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/shopping/activities/by_square.js
var require_by_square2 = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/shopping/activities/by_square.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var bySquare = /* @__PURE__ */ function() {
      function bySquare2(client) {
        _classCallCheck(this, bySquare2);
        this.client = client;
      }
      _createClass(bySquare2, [{
        key: "get",
        value: function get() {
          var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          return this.client.get("/v1/shopping/activities/by-square", params);
        }
      }]);
      return bySquare2;
    }();
    var _default = bySquare;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/shopping/activities.js
var require_activities = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/shopping/activities.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _by_square = _interopRequireDefault(require_by_square2());
    function _interopRequireDefault(obj2) {
      return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
    }
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var Activities = /* @__PURE__ */ function() {
      function Activities2(client) {
        _classCallCheck(this, Activities2);
        this.client = client;
        this.bySquare = new _by_square["default"](client);
      }
      _createClass(Activities2, [{
        key: "get",
        value: function get() {
          var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          return this.client.get("/v1/shopping/activities", params);
        }
      }]);
      return Activities2;
    }();
    var _default = Activities;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/shopping/activity.js
var require_activity = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/shopping/activity.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var Activity = /* @__PURE__ */ function() {
      function Activity2(client, activityId) {
        _classCallCheck(this, Activity2);
        this.client = client;
        this.activityId = activityId;
      }
      _createClass(Activity2, [{
        key: "get",
        value: function get() {
          return this.client.get("/v1/shopping/activities/".concat(this.activityId));
        }
      }]);
      return Activity2;
    }();
    var _default = Activity;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/shopping/availability/flight_availabilities.js
var require_flight_availabilities = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/shopping/availability/flight_availabilities.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var FlightAvailabilities = /* @__PURE__ */ function() {
      function FlightAvailabilities2(client) {
        _classCallCheck(this, FlightAvailabilities2);
        this.client = client;
      }
      _createClass(FlightAvailabilities2, [{
        key: "post",
        value: function post() {
          var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          return this.client.post("/v1/shopping/availability/flight-availabilities", params);
        }
      }]);
      return FlightAvailabilities2;
    }();
    var _default = FlightAvailabilities;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/shopping/availability.js
var require_availability = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/shopping/availability.js"(exports2, module2) {
    "use strict";
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _flight_availabilities = _interopRequireDefault(require_flight_availabilities());
    function _interopRequireDefault(obj2) {
      return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    var Availability = /* @__PURE__ */ _createClass(function Availability2(client) {
      _classCallCheck(this, Availability2);
      this.client = client;
      this.flightAvailabilities = new _flight_availabilities["default"](client);
    });
    var _default = Availability;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/shopping/transfer_offers.js
var require_transfer_offers = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/shopping/transfer_offers.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var TransferOffers = /* @__PURE__ */ function() {
      function TransferOffers2(client) {
        _classCallCheck(this, TransferOffers2);
        this.client = client;
      }
      _createClass(TransferOffers2, [{
        key: "post",
        value: function post() {
          var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          return this.client.post("/v1/shopping/transfer-offers", params);
        }
      }]);
      return TransferOffers2;
    }();
    var _default = TransferOffers;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/shopping.js
var require_shopping = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/shopping.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _flight_destinations = _interopRequireDefault(require_flight_destinations());
    var _flight_offers = _interopRequireDefault(require_flight_offers());
    var _flight_offers_search = _interopRequireDefault(require_flight_offers_search());
    var _flight_dates = _interopRequireDefault(require_flight_dates());
    var _seatmaps = _interopRequireDefault(require_seatmaps());
    var _hotel_offer_search = _interopRequireDefault(require_hotel_offer_search());
    var _hotel_offers_search = _interopRequireDefault(require_hotel_offers_search());
    var _activities = _interopRequireDefault(require_activities());
    var _activity = _interopRequireDefault(require_activity());
    var _availability = _interopRequireDefault(require_availability());
    var _transfer_offers = _interopRequireDefault(require_transfer_offers());
    function _interopRequireDefault(obj2) {
      return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
    }
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var Shopping = /* @__PURE__ */ function() {
      function Shopping2(client) {
        _classCallCheck(this, Shopping2);
        this.client = client;
        this.flightDestinations = new _flight_destinations["default"](client);
        this.flightOffers = new _flight_offers["default"](client);
        this.flightOffersSearch = new _flight_offers_search["default"](client);
        this.flightDates = new _flight_dates["default"](client);
        this.seatmaps = new _seatmaps["default"](client);
        this.hotelOffersSearch = new _hotel_offers_search["default"](client);
        this.activities = new _activities["default"](client);
        this.availability = new _availability["default"](client);
        this.transferOffers = new _transfer_offers["default"](client);
      }
      _createClass(Shopping2, [{
        key: "hotelOfferSearch",
        value: function hotelOfferSearch(offerId) {
          return new _hotel_offer_search["default"](this.client, offerId);
        }
      }, {
        key: "activity",
        value: function activity(activityId) {
          return new _activity["default"](this.client, activityId);
        }
      }]);
      return Shopping2;
    }();
    var _default = Shopping;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/booking/flight_orders.js
var require_flight_orders = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/booking/flight_orders.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var FlightOrders = /* @__PURE__ */ function() {
      function FlightOrders2(client) {
        _classCallCheck(this, FlightOrders2);
        this.client = client;
      }
      _createClass(FlightOrders2, [{
        key: "post",
        value: function post() {
          var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          return this.client.post("/v1/booking/flight-orders", params);
        }
      }]);
      return FlightOrders2;
    }();
    var _default = FlightOrders;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/booking/flight_order.js
var require_flight_order = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/booking/flight_order.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var FlightOrder = /* @__PURE__ */ function() {
      function FlightOrder2(client, orderId) {
        _classCallCheck(this, FlightOrder2);
        this.client = client;
        this._orderId = orderId;
      }
      _createClass(FlightOrder2, [{
        key: "get",
        value: function get() {
          if (this._orderId)
            return this.client.get("/v1/booking/flight-orders/" + this._orderId);
          else
            throw new Error("MISSING_REQUIRED_PARAMETER");
        }
      }, {
        key: "delete",
        value: function _delete() {
          if (this._orderId)
            return this.client["delete"]("/v1/booking/flight-orders/" + this._orderId);
          else
            throw new Error("MISSING_REQUIRED_PARAMETER");
        }
      }]);
      return FlightOrder2;
    }();
    var _default = FlightOrder;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/booking/hotel_bookings.js
var require_hotel_bookings = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/booking/hotel_bookings.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var HotelBookings = /* @__PURE__ */ function() {
      function HotelBookings2(client) {
        _classCallCheck(this, HotelBookings2);
        this.client = client;
      }
      _createClass(HotelBookings2, [{
        key: "post",
        value: function post() {
          var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          return this.client.post("/v1/booking/hotel-bookings", params);
        }
      }]);
      return HotelBookings2;
    }();
    var _default = HotelBookings;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/booking.js
var require_booking = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/booking.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _flight_orders = _interopRequireDefault(require_flight_orders());
    var _flight_order = _interopRequireDefault(require_flight_order());
    var _hotel_bookings = _interopRequireDefault(require_hotel_bookings());
    function _interopRequireDefault(obj2) {
      return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
    }
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var Booking = /* @__PURE__ */ function() {
      function Booking2(client) {
        _classCallCheck(this, Booking2);
        this.client = client;
        this.flightOrders = new _flight_orders["default"](client);
        this.hotelBookings = new _hotel_bookings["default"](client);
      }
      _createClass(Booking2, [{
        key: "flightOrder",
        value: function flightOrder(orderId) {
          return new _flight_order["default"](this.client, orderId);
        }
      }]);
      return Booking2;
    }();
    var _default = Booking;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/travel/analytics/air_traffic/traveled.js
var require_traveled = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/travel/analytics/air_traffic/traveled.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var Traveled = /* @__PURE__ */ function() {
      function Traveled2(client) {
        _classCallCheck(this, Traveled2);
        this.client = client;
      }
      _createClass(Traveled2, [{
        key: "get",
        value: function get() {
          var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          return this.client.get("/v1/travel/analytics/air-traffic/traveled", params);
        }
      }]);
      return Traveled2;
    }();
    var _default = Traveled;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/travel/analytics/air_traffic/booked.js
var require_booked = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/travel/analytics/air_traffic/booked.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var Booked = /* @__PURE__ */ function() {
      function Booked2(client) {
        _classCallCheck(this, Booked2);
        this.client = client;
      }
      _createClass(Booked2, [{
        key: "get",
        value: function get() {
          var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          return this.client.get("/v1/travel/analytics/air-traffic/booked", params);
        }
      }]);
      return Booked2;
    }();
    var _default = Booked;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/travel/analytics/air_traffic/busiest_period.js
var require_busiest_period = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/travel/analytics/air_traffic/busiest_period.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var BusiestPeriod = /* @__PURE__ */ function() {
      function BusiestPeriod2(client) {
        _classCallCheck(this, BusiestPeriod2);
        this.client = client;
      }
      _createClass(BusiestPeriod2, [{
        key: "get",
        value: function get() {
          var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          return this.client.get("/v1/travel/analytics/air-traffic/busiest-period", params);
        }
      }]);
      return BusiestPeriod2;
    }();
    var _default = BusiestPeriod;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/travel/analytics/air_traffic.js
var require_air_traffic = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/travel/analytics/air_traffic.js"(exports2, module2) {
    "use strict";
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _traveled = _interopRequireDefault(require_traveled());
    var _booked = _interopRequireDefault(require_booked());
    var _busiest_period = _interopRequireDefault(require_busiest_period());
    function _interopRequireDefault(obj2) {
      return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    var AirTraffic = /* @__PURE__ */ _createClass(function AirTraffic2(client) {
      _classCallCheck(this, AirTraffic2);
      this.client = client;
      this.traveled = new _traveled["default"](client);
      this.booked = new _booked["default"](client);
      this.busiestPeriod = new _busiest_period["default"](client);
    });
    var _default = AirTraffic;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/travel/analytics.js
var require_analytics = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/travel/analytics.js"(exports2, module2) {
    "use strict";
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _air_traffic = _interopRequireDefault(require_air_traffic());
    function _interopRequireDefault(obj2) {
      return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    var Analytics = /* @__PURE__ */ _createClass(function Analytics2(client) {
      _classCallCheck(this, Analytics2);
      this.client = client;
      this.airTraffic = new _air_traffic["default"](client);
    });
    var _default = Analytics;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/travel/predictions/trip_purpose.js
var require_trip_purpose = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/travel/predictions/trip_purpose.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var TripPurpose = /* @__PURE__ */ function() {
      function TripPurpose2(client) {
        _classCallCheck(this, TripPurpose2);
        this.client = client;
      }
      _createClass(TripPurpose2, [{
        key: "get",
        value: function get() {
          var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          return this.client.get("/v1/travel/predictions/trip-purpose", params);
        }
      }]);
      return TripPurpose2;
    }();
    var _default = TripPurpose;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/travel/predictions/flight_delay.js
var require_flight_delay = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/travel/predictions/flight_delay.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var FlightDelay = /* @__PURE__ */ function() {
      function FlightDelay2(client) {
        _classCallCheck(this, FlightDelay2);
        this.client = client;
      }
      _createClass(FlightDelay2, [{
        key: "get",
        value: function get() {
          var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          return this.client.get("/v1/travel/predictions/flight-delay", params);
        }
      }]);
      return FlightDelay2;
    }();
    var _default = FlightDelay;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/travel/predictions.js
var require_predictions = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/travel/predictions.js"(exports2, module2) {
    "use strict";
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _trip_purpose = _interopRequireDefault(require_trip_purpose());
    var _flight_delay = _interopRequireDefault(require_flight_delay());
    function _interopRequireDefault(obj2) {
      return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    var Predictions = /* @__PURE__ */ _createClass(function Predictions2(client) {
      _classCallCheck(this, Predictions2);
      this.client = client;
      this.tripPurpose = new _trip_purpose["default"](client);
      this.flightDelay = new _flight_delay["default"](client);
    });
    var _default = Predictions;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/travel/trip_parser.js
var require_trip_parser = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/travel/trip_parser.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var TripParser = /* @__PURE__ */ function() {
      function TripParser2(client) {
        _classCallCheck(this, TripParser2);
        this.client = client;
      }
      _createClass(TripParser2, [{
        key: "post",
        value: function post() {
          var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          return this.client.post("/v3/travel/trip-parser", params);
        }
      }, {
        key: "fromFile",
        value: function fromFile(fileContentsInUTF8Format) {
          return new Buffer.from(fileContentsInUTF8Format).toString("base64");
        }
      }]);
      return TripParser2;
    }();
    var _default = TripParser;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/travel.js
var require_travel = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/travel.js"(exports2, module2) {
    "use strict";
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _analytics = _interopRequireDefault(require_analytics());
    var _predictions = _interopRequireDefault(require_predictions());
    var _trip_parser = _interopRequireDefault(require_trip_parser());
    function _interopRequireDefault(obj2) {
      return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    var Travel = /* @__PURE__ */ _createClass(function Travel2(client) {
      _classCallCheck(this, Travel2);
      this.client = client;
      this.analytics = new _analytics["default"](client);
      this.predictions = new _predictions["default"](client);
      this.tripParser = new _trip_parser["default"](client);
    });
    var _default = Travel;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/e_reputation/hotel_sentiments.js
var require_hotel_sentiments = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/e_reputation/hotel_sentiments.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var HotelSentiments = /* @__PURE__ */ function() {
      function HotelSentiments2(client) {
        _classCallCheck(this, HotelSentiments2);
        this.client = client;
      }
      _createClass(HotelSentiments2, [{
        key: "get",
        value: function get() {
          var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          return this.client.get("/v2/e-reputation/hotel-sentiments", params);
        }
      }]);
      return HotelSentiments2;
    }();
    var _default = HotelSentiments;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/e_reputation.js
var require_e_reputation = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/e_reputation.js"(exports2, module2) {
    "use strict";
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _hotel_sentiments = _interopRequireDefault(require_hotel_sentiments());
    function _interopRequireDefault(obj2) {
      return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    var EReputation = /* @__PURE__ */ _createClass(function EReputation2(client) {
      _classCallCheck(this, EReputation2);
      this.client = client;
      this.hotelSentiments = new _hotel_sentiments["default"](client);
    });
    var _default = EReputation;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/media/files.js
var require_files = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/media/files.js"(exports2, module2) {
    "use strict";
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    var Files = /* @__PURE__ */ _createClass(function Files2(client) {
      _classCallCheck(this, Files2);
      this.client = client;
    });
    var _default = Files;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/media.js
var require_media = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/media.js"(exports2, module2) {
    "use strict";
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _files = _interopRequireDefault(require_files());
    function _interopRequireDefault(obj2) {
      return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    var Media = /* @__PURE__ */ _createClass(function Media2(client) {
      _classCallCheck(this, Media2);
      this.client = client;
      this.files = new _files["default"](client);
    });
    var _default = Media;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/ordering/transfer_orders.js
var require_transfer_orders = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/ordering/transfer_orders.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var TransferOrders = /* @__PURE__ */ function() {
      function TransferOrders2(client) {
        _classCallCheck(this, TransferOrders2);
        this.client = client;
      }
      _createClass(TransferOrders2, [{
        key: "post",
        value: function post(body, offerId) {
          return this.client.post("/v1/ordering/transfer-orders?offerId=".concat(offerId), body);
        }
      }]);
      return TransferOrders2;
    }();
    var _default = TransferOrders;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/ordering/transfer_orders/transfers/cancellation.js
var require_cancellation = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/ordering/transfer_orders/transfers/cancellation.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var Cancellation = /* @__PURE__ */ function() {
      function Cancellation2(client, orderId) {
        _classCallCheck(this, Cancellation2);
        this.client = client;
        this.orderId = orderId;
      }
      _createClass(Cancellation2, [{
        key: "post",
        value: function post(body, confirmNbr) {
          return this.client.post("/v1/ordering/transfer-orders/".concat(this.orderId, "/transfers/cancellation?confirmNbr=").concat(confirmNbr), body);
        }
      }]);
      return Cancellation2;
    }();
    var _default = Cancellation;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/ordering/transfer_orders/transfers.js
var require_transfers = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/ordering/transfer_orders/transfers.js"(exports2, module2) {
    "use strict";
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _cancellation = _interopRequireDefault(require_cancellation());
    function _interopRequireDefault(obj2) {
      return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    var Transfers = /* @__PURE__ */ _createClass(function Transfers2(client, orderId) {
      _classCallCheck(this, Transfers2);
      this.client = client;
      this.orderId = orderId;
      this.cancellation = new _cancellation["default"](client, orderId);
    });
    var _default = Transfers;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/ordering/transfer_order.js
var require_transfer_order = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/ordering/transfer_order.js"(exports2, module2) {
    "use strict";
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _transfers = _interopRequireDefault(require_transfers());
    function _interopRequireDefault(obj2) {
      return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    var TransferOrder = /* @__PURE__ */ _createClass(function TransferOrder2(client, orderId) {
      _classCallCheck(this, TransferOrder2);
      this.client = client;
      this.orderId = orderId;
      this.transfers = new _transfers["default"](client, orderId);
    });
    var _default = TransferOrder;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/ordering.js
var require_ordering = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/ordering.js"(exports2, module2) {
    "use strict";
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _transfer_orders = _interopRequireDefault(require_transfer_orders());
    var _transfer_order = _interopRequireDefault(require_transfer_order());
    function _interopRequireDefault(obj2) {
      return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    var Ordering = /* @__PURE__ */ _createClass(function Ordering2(client) {
      _classCallCheck(this, Ordering2);
      this.client = client;
      this.transferOrders = new _transfer_orders["default"](client);
      this.transferOrder = function(orderId) {
        return new _transfer_order["default"](client, orderId);
      };
    });
    var _default = Ordering;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/airport/direct-destinations.js
var require_direct_destinations = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/airport/direct-destinations.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var DirectDestinations = /* @__PURE__ */ function() {
      function DirectDestinations2(client) {
        _classCallCheck(this, DirectDestinations2);
        this.client = client;
      }
      _createClass(DirectDestinations2, [{
        key: "get",
        value: function get() {
          var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          return this.client.get("/v1/airport/direct-destinations", params);
        }
      }]);
      return DirectDestinations2;
    }();
    var _default = DirectDestinations;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/airport/predictions/on_time.js
var require_on_time = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/airport/predictions/on_time.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var OnTime = /* @__PURE__ */ function() {
      function OnTime2(client) {
        _classCallCheck(this, OnTime2);
        this.client = client;
      }
      _createClass(OnTime2, [{
        key: "get",
        value: function get() {
          var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          return this.client.get("/v1/airport/predictions/on-time", params);
        }
      }]);
      return OnTime2;
    }();
    var _default = OnTime;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/airport/predictions.js
var require_predictions2 = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/airport/predictions.js"(exports2, module2) {
    "use strict";
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _on_time = _interopRequireDefault(require_on_time());
    function _interopRequireDefault(obj2) {
      return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    var Predictions = /* @__PURE__ */ _createClass(function Predictions2(client) {
      _classCallCheck(this, Predictions2);
      this.client = client;
      this.onTime = new _on_time["default"](client);
    });
    var _default = Predictions;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/airport.js
var require_airport = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/airport.js"(exports2, module2) {
    "use strict";
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _directDestinations = _interopRequireDefault(require_direct_destinations());
    var _predictions = _interopRequireDefault(require_predictions2());
    function _interopRequireDefault(obj2) {
      return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    var Airport = /* @__PURE__ */ _createClass(function Airport2(client) {
      _classCallCheck(this, Airport2);
      this.client = client;
      this.directDestinations = new _directDestinations["default"](client);
      this.predictions = new _predictions["default"](client);
    });
    var _default = Airport;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/safety/safety_rated_locations/by_square.js
var require_by_square3 = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/safety/safety_rated_locations/by_square.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var bySquare = /* @__PURE__ */ function() {
      function bySquare2(client) {
        _classCallCheck(this, bySquare2);
        this.client = client;
      }
      _createClass(bySquare2, [{
        key: "get",
        value: function get() {
          var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          return this.client.get("/v1/safety/safety-rated-locations/by-square", params);
        }
      }]);
      return bySquare2;
    }();
    var _default = bySquare;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/safety/safety_rated_locations.js
var require_safety_rated_locations = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/safety/safety_rated_locations.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _by_square = _interopRequireDefault(require_by_square3());
    function _interopRequireDefault(obj2) {
      return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
    }
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var SafetyRatedLocations = /* @__PURE__ */ function() {
      function SafetyRatedLocations2(client) {
        _classCallCheck(this, SafetyRatedLocations2);
        this.client = client;
        this.bySquare = new _by_square["default"](client);
      }
      _createClass(SafetyRatedLocations2, [{
        key: "get",
        value: function get() {
          var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          return this.client.get("/v1/safety/safety-rated-locations", params);
        }
      }]);
      return SafetyRatedLocations2;
    }();
    var _default = SafetyRatedLocations;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/safety/safety_rated_location.js
var require_safety_rated_location = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/safety/safety_rated_location.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var SafetyRatedLocation = /* @__PURE__ */ function() {
      function SafetyRatedLocation2(client, locationId) {
        _classCallCheck(this, SafetyRatedLocation2);
        this.client = client;
        this.locationId = locationId;
      }
      _createClass(SafetyRatedLocation2, [{
        key: "get",
        value: function get() {
          return this.client.get("/v1/safety/safety-rated-locations/".concat(this.locationId));
        }
      }]);
      return SafetyRatedLocation2;
    }();
    var _default = SafetyRatedLocation;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/safety.js
var require_safety = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/safety.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _safety_rated_locations = _interopRequireDefault(require_safety_rated_locations());
    var _safety_rated_location = _interopRequireDefault(require_safety_rated_location());
    function _interopRequireDefault(obj2) {
      return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
    }
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var Safety = /* @__PURE__ */ function() {
      function Safety2(client) {
        _classCallCheck(this, Safety2);
        this.client = client;
        this.safetyRatedLocations = new _safety_rated_locations["default"](client);
      }
      _createClass(Safety2, [{
        key: "safetyRatedLocation",
        value: function safetyRatedLocation(locationId) {
          return new _safety_rated_location["default"](this.client, locationId);
        }
      }]);
      return Safety2;
    }();
    var _default = Safety;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/schedule/flights.js
var require_flights = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/schedule/flights.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var Flights = /* @__PURE__ */ function() {
      function Flights2(client) {
        _classCallCheck(this, Flights2);
        this.client = client;
      }
      _createClass(Flights2, [{
        key: "get",
        value: function get() {
          var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          return this.client.get("/v2/schedule/flights", params);
        }
      }]);
      return Flights2;
    }();
    var _default = Flights;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/schedule.js
var require_schedule2 = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/schedule.js"(exports2, module2) {
    "use strict";
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _flights = _interopRequireDefault(require_flights());
    function _interopRequireDefault(obj2) {
      return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    var Schedule = /* @__PURE__ */ _createClass(function Schedule2(client) {
      _classCallCheck(this, Schedule2);
      this.client = client;
      this.flights = new _flights["default"](client);
    });
    var _default = Schedule;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/analytics/itinerary_price_metrics.js
var require_itinerary_price_metrics = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/analytics/itinerary_price_metrics.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var ItineraryPriceMetrics = /* @__PURE__ */ function() {
      function ItineraryPriceMetrics2(client) {
        _classCallCheck(this, ItineraryPriceMetrics2);
        this.client = client;
      }
      _createClass(ItineraryPriceMetrics2, [{
        key: "get",
        value: function get() {
          var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          return this.client.get("/v1/analytics/itinerary-price-metrics", params);
        }
      }]);
      return ItineraryPriceMetrics2;
    }();
    var _default = ItineraryPriceMetrics;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/analytics.js
var require_analytics2 = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/analytics.js"(exports2, module2) {
    "use strict";
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _itinerary_price_metrics = _interopRequireDefault(require_itinerary_price_metrics());
    function _interopRequireDefault(obj2) {
      return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    var Analytics = /* @__PURE__ */ _createClass(function Analytics2(client) {
      _classCallCheck(this, Analytics2);
      this.client = client;
      this.itineraryPriceMetrics = new _itinerary_price_metrics["default"](client);
    });
    var _default = Analytics;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/location/analytics/category_rated_areas.js
var require_category_rated_areas = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/location/analytics/category_rated_areas.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var CategoryRatedAreas = /* @__PURE__ */ function() {
      function CategoryRatedAreas2(client) {
        _classCallCheck(this, CategoryRatedAreas2);
        this.client = client;
      }
      _createClass(CategoryRatedAreas2, [{
        key: "get",
        value: function get() {
          var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          return this.client.get("/v1/location/analytics/category-rated-areas", params);
        }
      }]);
      return CategoryRatedAreas2;
    }();
    var _default = CategoryRatedAreas;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/location/analytics.js
var require_analytics3 = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/location/analytics.js"(exports2, module2) {
    "use strict";
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _category_rated_areas = _interopRequireDefault(require_category_rated_areas());
    function _interopRequireDefault(obj2) {
      return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    var Analytics = /* @__PURE__ */ _createClass(function Analytics2(client) {
      _classCallCheck(this, Analytics2);
      this.client = client;
      this.categoryRatedAreas = new _category_rated_areas["default"](client);
    });
    var _default = Analytics;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/location.js
var require_location2 = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/location.js"(exports2, module2) {
    "use strict";
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _analytics = _interopRequireDefault(require_analytics3());
    function _interopRequireDefault(obj2) {
      return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    var Location = /* @__PURE__ */ _createClass(function Location2(client) {
      _classCallCheck(this, Location2);
      this.client = client;
      this.analytics = new _analytics["default"](client);
    });
    var _default = Location;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/duty_of_care/diseases/covid19_report.js
var require_covid19_report = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/duty_of_care/diseases/covid19_report.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var Covid19Report = /* @__PURE__ */ function() {
      function Covid19Report2(client) {
        _classCallCheck(this, Covid19Report2);
        this.client = client;
      }
      _createClass(Covid19Report2, [{
        key: "get",
        value: function get() {
          var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          return this.client.get("/v2/duty-of-care/diseases/covid19-area-report", params);
        }
      }]);
      return Covid19Report2;
    }();
    var _default = Covid19Report;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/duty_of_care/diseases.js
var require_diseases = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/duty_of_care/diseases.js"(exports2, module2) {
    "use strict";
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _covid19_report = _interopRequireDefault(require_covid19_report());
    function _interopRequireDefault(obj2) {
      return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    var Diseases = /* @__PURE__ */ _createClass(function Diseases2(client) {
      _classCallCheck(this, Diseases2);
      this.client = client;
      this.covid19Report = new _covid19_report["default"](client);
    });
    var _default = Diseases;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/duty_of_care.js
var require_duty_of_care = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/duty_of_care.js"(exports2, module2) {
    "use strict";
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _diseases = _interopRequireDefault(require_diseases());
    function _interopRequireDefault(obj2) {
      return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    var DutyOfCare = /* @__PURE__ */ _createClass(function DutyOfCare2(client) {
      _classCallCheck(this, DutyOfCare2);
      this.client = client;
      this.diseases = new _diseases["default"](client);
    });
    var _default = DutyOfCare;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/airline/destinations.js
var require_destinations = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/airline/destinations.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var Destinations = /* @__PURE__ */ function() {
      function Destinations2(client) {
        _classCallCheck(this, Destinations2);
        this.client = client;
      }
      _createClass(Destinations2, [{
        key: "get",
        value: function get() {
          var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          return this.client.get("/v1/airline/destinations", params);
        }
      }]);
      return Destinations2;
    }();
    var _default = Destinations;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/airline.js
var require_airline = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus/namespaces/airline.js"(exports2, module2) {
    "use strict";
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _destinations = _interopRequireDefault(require_destinations());
    function _interopRequireDefault(obj2) {
      return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    var Airline = /* @__PURE__ */ _createClass(function Airline2(client) {
      _classCallCheck(this, Airline2);
      this.client = client;
      this.destinations = new _destinations["default"](client);
    });
    var _default = Airline;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// netlify/functions/node_modules/amadeus/lib/amadeus.js
var require_amadeus = __commonJS({
  "netlify/functions/node_modules/amadeus/lib/amadeus.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _client = _interopRequireDefault(require_client());
    var _pagination = _interopRequireDefault(require_pagination());
    var _reference_data = _interopRequireDefault(require_reference_data());
    var _shopping = _interopRequireDefault(require_shopping());
    var _booking = _interopRequireDefault(require_booking());
    var _travel = _interopRequireDefault(require_travel());
    var _e_reputation = _interopRequireDefault(require_e_reputation());
    var _media = _interopRequireDefault(require_media());
    var _ordering = _interopRequireDefault(require_ordering());
    var _airport = _interopRequireDefault(require_airport());
    var _safety = _interopRequireDefault(require_safety());
    var _schedule = _interopRequireDefault(require_schedule2());
    var _analytics = _interopRequireDefault(require_analytics2());
    var _location = _interopRequireDefault(require_location2());
    var _duty_of_care = _interopRequireDefault(require_duty_of_care());
    var _airline = _interopRequireDefault(require_airline());
    function _interopRequireDefault(obj2) {
      return obj2 && obj2.__esModule ? obj2 : { "default": obj2 };
    }
    function _typeof(obj2) {
      "@babel/helpers - typeof";
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj3) {
        return typeof obj3;
      } : function(obj3) {
        return obj3 && typeof Symbol == "function" && obj3.constructor === Symbol && obj3 !== Symbol.prototype ? "symbol" : typeof obj3;
      }, _typeof(obj2);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var Amadeus2 = /* @__PURE__ */ function() {
      function Amadeus3() {
        var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
        _classCallCheck(this, Amadeus3);
        this.client = new _client["default"](params);
        this.version = this.client.version;
        this.referenceData = new _reference_data["default"](this.client);
        this.shopping = new _shopping["default"](this.client);
        this.booking = new _booking["default"](this.client);
        this.travel = new _travel["default"](this.client);
        this.eReputation = new _e_reputation["default"](this.client);
        this.media = new _media["default"](this.client);
        this.ordering = new _ordering["default"](this.client);
        this.airport = new _airport["default"](this.client);
        this.pagination = new _pagination["default"](this.client);
        this.safety = new _safety["default"](this.client);
        this.schedule = new _schedule["default"](this.client);
        this.analytics = new _analytics["default"](this.client);
        this.location = new _location["default"](this.client);
        this.dutyOfCare = new _duty_of_care["default"](this.client);
        this.airline = new _airline["default"](this.client);
      }
      _createClass(Amadeus3, [{
        key: "previous",
        value: function previous(response) {
          return this.pagination.page("previous", response);
        }
      }, {
        key: "next",
        value: function next(response) {
          return this.pagination.page("next", response);
        }
      }, {
        key: "first",
        value: function first(response) {
          return this.pagination.page("first", response);
        }
      }, {
        key: "last",
        value: function last(response) {
          return this.pagination.page("last", response);
        }
      }]);
      return Amadeus3;
    }();
    Amadeus2.location = {
      airport: "AIRPORT",
      city: "CITY",
      any: "AIRPORT,CITY"
    };
    Amadeus2.direction = {
      arriving: "ARRIVING",
      departing: "DEPARTING"
    };
    var _default = Amadeus2;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/dotenv/package.json
var require_package2 = __commonJS({
  "node_modules/dotenv/package.json"(exports2, module2) {
    module2.exports = {
      name: "dotenv",
      version: "16.5.0",
      description: "Loads environment variables from .env file",
      main: "lib/main.js",
      types: "lib/main.d.ts",
      exports: {
        ".": {
          types: "./lib/main.d.ts",
          require: "./lib/main.js",
          default: "./lib/main.js"
        },
        "./config": "./config.js",
        "./config.js": "./config.js",
        "./lib/env-options": "./lib/env-options.js",
        "./lib/env-options.js": "./lib/env-options.js",
        "./lib/cli-options": "./lib/cli-options.js",
        "./lib/cli-options.js": "./lib/cli-options.js",
        "./package.json": "./package.json"
      },
      scripts: {
        "dts-check": "tsc --project tests/types/tsconfig.json",
        lint: "standard",
        pretest: "npm run lint && npm run dts-check",
        test: "tap run --allow-empty-coverage --disable-coverage --timeout=60000",
        "test:coverage": "tap run --show-full-coverage --timeout=60000 --coverage-report=lcov",
        prerelease: "npm test",
        release: "standard-version"
      },
      repository: {
        type: "git",
        url: "git://github.com/motdotla/dotenv.git"
      },
      homepage: "https://github.com/motdotla/dotenv#readme",
      funding: "https://dotenvx.com",
      keywords: [
        "dotenv",
        "env",
        ".env",
        "environment",
        "variables",
        "config",
        "settings"
      ],
      readmeFilename: "README.md",
      license: "BSD-2-Clause",
      devDependencies: {
        "@types/node": "^18.11.3",
        decache: "^4.6.2",
        sinon: "^14.0.1",
        standard: "^17.0.0",
        "standard-version": "^9.5.0",
        tap: "^19.2.0",
        typescript: "^4.8.4"
      },
      engines: {
        node: ">=12"
      },
      browser: {
        fs: false
      }
    };
  }
});

// node_modules/dotenv/lib/main.js
var require_main = __commonJS({
  "node_modules/dotenv/lib/main.js"(exports2, module2) {
    var fs = require("fs");
    var path2 = require("path");
    var os = require("os");
    var crypto = require("crypto");
    var packageJson = require_package2();
    var version = packageJson.version;
    var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
    function parse(src) {
      const obj2 = {};
      let lines = src.toString();
      lines = lines.replace(/\r\n?/mg, "\n");
      let match;
      while ((match = LINE.exec(lines)) != null) {
        const key = match[1];
        let value = match[2] || "";
        value = value.trim();
        const maybeQuote = value[0];
        value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
        if (maybeQuote === '"') {
          value = value.replace(/\\n/g, "\n");
          value = value.replace(/\\r/g, "\r");
        }
        obj2[key] = value;
      }
      return obj2;
    }
    function _parseVault(options) {
      const vaultPath = _vaultPath(options);
      const result = DotenvModule.configDotenv({ path: vaultPath });
      if (!result.parsed) {
        const err = new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
        err.code = "MISSING_DATA";
        throw err;
      }
      const keys = _dotenvKey(options).split(",");
      const length = keys.length;
      let decrypted;
      for (let i = 0; i < length; i++) {
        try {
          const key = keys[i].trim();
          const attrs = _instructions(result, key);
          decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
          break;
        } catch (error) {
          if (i + 1 >= length) {
            throw error;
          }
        }
      }
      return DotenvModule.parse(decrypted);
    }
    function _warn(message) {
      console.log(`[dotenv@${version}][WARN] ${message}`);
    }
    function _debug(message) {
      console.log(`[dotenv@${version}][DEBUG] ${message}`);
    }
    function _dotenvKey(options) {
      if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {
        return options.DOTENV_KEY;
      }
      if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
        return process.env.DOTENV_KEY;
      }
      return "";
    }
    function _instructions(result, dotenvKey) {
      let uri;
      try {
        uri = new URL(dotenvKey);
      } catch (error) {
        if (error.code === "ERR_INVALID_URL") {
          const err = new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        }
        throw error;
      }
      const key = uri.password;
      if (!key) {
        const err = new Error("INVALID_DOTENV_KEY: Missing key part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environment = uri.searchParams.get("environment");
      if (!environment) {
        const err = new Error("INVALID_DOTENV_KEY: Missing environment part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
      const ciphertext = result.parsed[environmentKey];
      if (!ciphertext) {
        const err = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
        err.code = "NOT_FOUND_DOTENV_ENVIRONMENT";
        throw err;
      }
      return { ciphertext, key };
    }
    function _vaultPath(options) {
      let possibleVaultPath = null;
      if (options && options.path && options.path.length > 0) {
        if (Array.isArray(options.path)) {
          for (const filepath of options.path) {
            if (fs.existsSync(filepath)) {
              possibleVaultPath = filepath.endsWith(".vault") ? filepath : `${filepath}.vault`;
            }
          }
        } else {
          possibleVaultPath = options.path.endsWith(".vault") ? options.path : `${options.path}.vault`;
        }
      } else {
        possibleVaultPath = path2.resolve(process.cwd(), ".env.vault");
      }
      if (fs.existsSync(possibleVaultPath)) {
        return possibleVaultPath;
      }
      return null;
    }
    function _resolveHome(envPath) {
      return envPath[0] === "~" ? path2.join(os.homedir(), envPath.slice(1)) : envPath;
    }
    function _configVault(options) {
      const debug = Boolean(options && options.debug);
      if (debug) {
        _debug("Loading env from encrypted .env.vault");
      }
      const parsed = DotenvModule._parseVault(options);
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsed, options);
      return { parsed };
    }
    function configDotenv(options) {
      const dotenvPath = path2.resolve(process.cwd(), ".env");
      let encoding = "utf8";
      const debug = Boolean(options && options.debug);
      if (options && options.encoding) {
        encoding = options.encoding;
      } else {
        if (debug) {
          _debug("No encoding is specified. UTF-8 is used by default");
        }
      }
      let optionPaths = [dotenvPath];
      if (options && options.path) {
        if (!Array.isArray(options.path)) {
          optionPaths = [_resolveHome(options.path)];
        } else {
          optionPaths = [];
          for (const filepath of options.path) {
            optionPaths.push(_resolveHome(filepath));
          }
        }
      }
      let lastError;
      const parsedAll = {};
      for (const path3 of optionPaths) {
        try {
          const parsed = DotenvModule.parse(fs.readFileSync(path3, { encoding }));
          DotenvModule.populate(parsedAll, parsed, options);
        } catch (e) {
          if (debug) {
            _debug(`Failed to load ${path3} ${e.message}`);
          }
          lastError = e;
        }
      }
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsedAll, options);
      if (lastError) {
        return { parsed: parsedAll, error: lastError };
      } else {
        return { parsed: parsedAll };
      }
    }
    function config2(options) {
      if (_dotenvKey(options).length === 0) {
        return DotenvModule.configDotenv(options);
      }
      const vaultPath = _vaultPath(options);
      if (!vaultPath) {
        _warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`);
        return DotenvModule.configDotenv(options);
      }
      return DotenvModule._configVault(options);
    }
    function decrypt(encrypted, keyStr) {
      const key = Buffer.from(keyStr.slice(-64), "hex");
      let ciphertext = Buffer.from(encrypted, "base64");
      const nonce = ciphertext.subarray(0, 12);
      const authTag = ciphertext.subarray(-16);
      ciphertext = ciphertext.subarray(12, -16);
      try {
        const aesgcm = crypto.createDecipheriv("aes-256-gcm", key, nonce);
        aesgcm.setAuthTag(authTag);
        return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
      } catch (error) {
        const isRange = error instanceof RangeError;
        const invalidKeyLength = error.message === "Invalid key length";
        const decryptionFailed = error.message === "Unsupported state or unable to authenticate data";
        if (isRange || invalidKeyLength) {
          const err = new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        } else if (decryptionFailed) {
          const err = new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
          err.code = "DECRYPTION_FAILED";
          throw err;
        } else {
          throw error;
        }
      }
    }
    function populate(processEnv, parsed, options = {}) {
      const debug = Boolean(options && options.debug);
      const override = Boolean(options && options.override);
      if (typeof parsed !== "object") {
        const err = new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
        err.code = "OBJECT_REQUIRED";
        throw err;
      }
      for (const key of Object.keys(parsed)) {
        if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
          if (override === true) {
            processEnv[key] = parsed[key];
          }
          if (debug) {
            if (override === true) {
              _debug(`"${key}" is already defined and WAS overwritten`);
            } else {
              _debug(`"${key}" is already defined and was NOT overwritten`);
            }
          }
        } else {
          processEnv[key] = parsed[key];
        }
      }
    }
    var DotenvModule = {
      configDotenv,
      _configVault,
      _parseVault,
      config: config2,
      decrypt,
      parse,
      populate
    };
    module2.exports.configDotenv = DotenvModule.configDotenv;
    module2.exports._configVault = DotenvModule._configVault;
    module2.exports._parseVault = DotenvModule._parseVault;
    module2.exports.config = DotenvModule.config;
    module2.exports.decrypt = DotenvModule.decrypt;
    module2.exports.parse = DotenvModule.parse;
    module2.exports.populate = DotenvModule.populate;
    module2.exports = DotenvModule;
  }
});

// src/config/env.js
var env_exports = {};
__export(env_exports, {
  default: () => env_default
});
var import_dotenv, import_path, import_url, import_meta, config, requiredEnvVars, missingVars, env_default;
var init_env = __esm({
  "src/config/env.js"() {
    import_dotenv = __toESM(require_main(), 1);
    import_path = __toESM(require("path"), 1);
    import_url = require("url");
    import_meta = {};
    try {
      import_dotenv.default.config({ path: import_path.default.resolve(process.cwd(), ".env") });
    } catch (error) {
      console.warn("Error loading .env file from process.cwd(), trying relative path...");
      try {
        const __filename = (0, import_url.fileURLToPath)(import_meta.url);
        const __dirname = import_path.default.dirname(__filename);
        import_dotenv.default.config({ path: import_path.default.resolve(__dirname, "../../../.env") });
      } catch (innerError) {
        console.warn("Error loading .env file from relative path, using process.env only");
      }
    }
    config = {
      nodeEnv: process.env.NODE_ENV || "development",
      port: parseInt(process.env.PORT || "3000", 10),
      isProduction: process.env.NODE_ENV === "production",
      isDevelopment: process.env.NODE_ENV !== "production",
      amadeus: {
        apiKey: process.env.AMADEUS_API_KEY,
        apiSecret: process.env.AMADEUS_API_SECRET,
        hostname: process.env.AMADEUS_HOSTNAME || "production"
      },
      db: {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        name: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || "5432", 10)
      },
      api: {
        prefix: process.env.API_PREFIX || "/api"
      },
      cors: {
        origin: process.env.CORS_ORIGIN || "*"
      }
    };
    requiredEnvVars = [
      "AMADEUS_API_KEY",
      "AMADEUS_API_SECRET",
      "DB_USER",
      "DB_PASSWORD",
      "DB_NAME",
      "DB_HOST"
    ];
    missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
    if (missingVars.length > 0) {
      console.error(`Missing required environment variables: ${missingVars.join(", ")}`);
      if (process.env.NODE_ENV === "production") {
        process.exit(1);
      } else {
        console.warn("Running in development mode with missing environment variables.");
      }
    }
    env_default = config;
  }
});

// netlify/functions/search-flights.js
var search_flights_exports = {};
__export(search_flights_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(search_flights_exports);
var import_amadeus = __toESM(require_amadeus(), 1);

// netlify/functions/utils/cors.js
var withCors = (handler2) => async (event, context) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
      },
      body: ""
    };
  }
  try {
    const response = await handler2(event, context);
    if (!response) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Internal server error" }),
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        }
      };
    }
    return __spreadProps(__spreadValues({}, response), {
      headers: __spreadProps(__spreadValues({}, response.headers || {}), {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      })
    });
  } catch (error) {
    console.error("Error in handler:", error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify(__spreadValues({
        error: error.message || "Internal server error"
      }, process.env.NODE_ENV === "development" ? { stack: error.stack } : {})),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      }
    };
  }
};

// netlify/functions/search-flights.js
var getConfig = async () => {
  if (process.env.AMADEUS_API_KEY && process.env.AMADEUS_API_SECRET) {
    console.log("Using environment variables for Amadeus config");
    return {
      apiKey: process.env.AMADEUS_API_KEY,
      apiSecret: process.env.AMADEUS_API_SECRET,
      hostname: process.env.AMADEUS_HOSTNAME || "production"
    };
  }
  try {
    console.log("Trying to load config from ../../src/config/env.js");
    const config2 = await Promise.resolve().then(() => (init_env(), env_exports));
    return {
      apiKey: config2.default.amadeus.apiKey,
      apiSecret: config2.default.amadeus.apiSecret,
      hostname: config2.default.amadeus.hostname
    };
  } catch (error) {
    console.error("Failed to load config:", error);
    throw new Error("Failed to load configuration");
  }
};
var amadeus;
var searchFlightsHandler = async (event, context) => {
  console.log("=== New Request ===");
  console.log("Method:", event.httpMethod);
  console.log("Path:", event.path);
  console.log("Query:", event.queryStringParameters);
  if (event.httpMethod !== "POST") {
    const error = { error: "Method Not Allowed", allowed: ["POST"] };
    console.error("Method not allowed:", error);
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(error)
    };
  }
  try {
    if (!amadeus) {
      console.log("Initializing Amadeus client...");
      const config2 = await getConfig();
      amadeus = new import_amadeus.default({
        clientId: config2.apiKey,
        clientSecret: config2.apiSecret,
        hostname: config2.hostname
      });
      console.log("Amadeus client initialized successfully");
    }
    const params = JSON.parse(event.body);
    if (!params.origin || !params.destination || !params.departureDate) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "Missing required parameters: origin, destination, departureDate"
        })
      };
    }
    console.log("Searching flights with params:", {
      origin: params.origin,
      destination: params.destination,
      departureDate: params.departureDate,
      returnDate: params.returnDate,
      adults: params.adults || 1
    });
    const response = await amadeus.shopping.flightOffersSearch.get(__spreadProps(__spreadValues({
      originLocationCode: params.origin,
      destinationLocationCode: params.destination,
      departureDate: params.departureDate
    }, params.returnDate && { returnDate: params.returnDate }), {
      adults: params.adults || 1,
      nonStop: params.nonStop || false,
      maxPrice: params.maxPrice,
      max: params.maxResults || 10,
      currencyCode: "USD"
    }));
    console.log("Received response from Amadeus API");
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Flight search successful",
        data: response.data || [],
        meta: response.meta || {}
      })
    };
  } catch (error) {
    console.error("Search flights error:", error);
    const errorDetails = {
      message: error.message,
      code: error.code,
      statusCode: error.response?.statusCode,
      body: error.response?.body,
      description: error.description,
      stack: process.env.NODE_ENV === "development" ? error.stack : void 0
    };
    console.error("Error details:", JSON.stringify(errorDetails, null, 2));
    return {
      statusCode: error.response?.statusCode || 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Failed to fetch flight data",
        details: process.env.NODE_ENV === "development" ? errorDetails : void 0,
        message: error.description || error.message
      })
    };
  }
};
var handler = withCors(searchFlightsHandler);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
//# sourceMappingURL=search-flights.js.map
