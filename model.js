/*
TODO Features:
- Connection to databases
- Save
- Remove
- pubsub
  - Model.subscribe("prop", cb); // When any instance of a Model type's property changes
  - instance.subscribe("prop", cb); // When an instance's property changes
- Various DB adaptors
- Client side storage adaptors
*/

// For Browser support (from prototype.js)
if (!Function.prototype.bind) {
  function update(array, args) {
      var arrayLength = array.length, length = args.length;
      while (length--) array[arrayLength + length] = args[length];
      return array;
  }
  function merge(array, args) {
    array = Array.prototype.slice.call(array, 0);
    return update(array, args);
  }
  Function.prototype.bind = function(context) {
    if (arguments.length < 2 && typeof arguments[0] == 'undefined') return this;
    var __method = this, args = Array.prototype.slice.call(arguments, 1);
    return function() {
      var a = merge(args, arguments);
      return __method.apply(context, a);
    };
  };
}

function create(defCreate) {
  // Static vars to `create`
  
  var Constructor = (function(defConstructor) {
    // Class-level vars defined during `create`.
    var ModelDefinition = defConstructor;

    var Klass = function(data) {
      // Instance-level vars, defined during instance construction.
      var isValid = false;
      
      // `data` and `validated` fields need to be defined on THIS instead of the
      // prototype so that the property descriptors are enforced.
      Object.defineProperties(this, {
        "data": { value: {} },
        "validated": { value: false, writable: true },
        "errors": { value: [] },
        valid: {
          get: function() {
            if (!this.validated) {
              while (this.errors.length) this.errors.pop();
              isValid = true;

              var def = this.definition;

              for (var key in def) {
                var value = this.data[key];

                if (def[key].validation) {

                  def[key].validation.forEach(function(v) {
                    var defaultValue = def[key].defaultValue;
                    var result = (typeof(defaultValue) != 'undefined' && defaultValue == value) || v.test(value);

                    if (!result) {
                      isValid = false;
                      this.errors.push(v.message.replace("{key}", key));
                    }
                  }, this);
                }
              }
              this.validated = true;
            }
            return isValid;
          }
        }
      });

      // Getter/Setter for each data property.
      Object.keys(this.definition).forEach(function(key) {
        Object.defineProperty(this, key, {
          get: function() { return this.data[key]; },
          set: function(value) {
            this.validated = false;
            this.data[key] = value;
          },
          enumerable: true
        });
      }.bind(this));

      // Populate instance properties with values.
      if (data) {
        for (var name in data) {
          this.data[name] = data[name];
        }
      }
    };
    
    // Build up the field value validation rules
    Object.keys(ModelDefinition).forEach(function(key) {

      var rules = {
        defaultValue: undefined,
        validation: []
      };
      
      var spec = ModelDefinition[key];
      
      if (Array.isArray(spec)) {
        // spec is an array, use it as an array of validator defs
        // no defaultValue
        rules.validation = spec;

      } else {
        if ("validation" in spec) {
          if (Array.isArray(spec.validation)) {
            // spec has validation array, use it as an array of validator defs
            rules.validation = spec.validation;

            if ("defaultValue" in spec) {
              rules.defaultValue = spec.defaultValue;
            }

          } else if ("test" in spec.validation && "message" in spec.validation) {
            // spec is a validator def, add it to the validator defs
            rules.validation.push(spec.validation);

            if ("defaultValue" in spec) {
              rules.defaultValue = spec.defaultValue;
            }
          }

        } else if ("test" in spec && "message" in spec) {
          rules.validation.push(spec);
        }
      }
      
      if (rules.validation.length == 0) {
        throw new Error("The definition for field '" + key + "' is invalid.");
      }
      
      rules.validation.forEach(function(rule, i) {
        if (!("message" in rule)) throw new Error("Validation rule does not have a message.");
        
        if (!("test" in rule)) throw new Error("Validation rule does not have a test function.");
        
        var isFunction = rule.test instanceof Function;
        var isRegExp = rule.test instanceof RegExp;
        
        if (!isFunction && !isRegExp) throw new TypeError("Validation rule test is not a Function or RegExp object.");
      });

      ModelDefinition[key] = rules;
    });

    // Store the normalized property definition and validation on the Model type class.
    Object.defineProperty(Klass.prototype, "definition", {
      value: ModelDefinition
    });
    
    return Klass;
    
  })(defCreate);
  
  return Constructor;
}

var Model = {
  None: {
    test: function() { return true; },
    message: "This validator will always pass."
  },
  Required: {
    test: function(x) {
      return !(x == null || x == undefined || x == "");
    },
    message: '"{field}" is required but has no value.'
  },
  EmailAddress: {
    test: function(x) { throw new Error("Not implemented."); },
    message: "Not implemented"
  },
  PhoneUS: {
    test: function(x) { throw new Error("Not implemented."); },
    message: "Not implemented"
  },
  Url: {
    test: function(x) { throw new Error("Not implemented."); },
    message: "Not implemented"
  }
};

exports.create = create;

Object.keys(Model).forEach(function(m) {
  Object.defineProperty(exports, m, {
    enumerable: true,
    configurable: false,
    value: Model[m]
  });
});
