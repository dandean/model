// TODO: save method
// TODO: how do we create one of these from a record or database?
// TODO: field validators should consist on an Array

function create(modelDefinition) {
    
  // TODO: what the fuck is "connection" and how does it work?
  return (function(def, connection) {

    return function(data) {
      var initialized = false,
          properties = {},  // internal datastore
          valid = undefined,
          unvalidated = true,
          errors = [];  // populated when the `valid` key is accessed

      // populate instance field properties
      if (data) {
        for (var name in data) {
          properties[name] = data[name];
        }
      }
      
      if (!initialized) {
        initialized = true;
        
        Object.keys(def).forEach(function(key) {

          // Add definition keys as get/set fields on the resulting model object
          Object.defineProperty(this, key, {
            get: function() { return properties[key]; },
            set: function(x) {
              unvalidated = true;
              properties[key] = x;
            },
            enumerable: true
          });

          var rules = {
            defaultValue: undefined,
            validation: []
          };
          
          var spec = def[key];
          
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
          
        }.bind(this));
        
//        Object.defineProperty(this, "valid", {
//          get: function() {
//            
//            if (unvalidated) {
//              errors = [];
//              valid = true;
//              
//              for (var key in def) {
//                var value = properties[key];
//                
//                if (def[key].validators) {
//                  
//                  def[key].validators.forEach(function(v) {
//                    var defaultValue = def[key].defaultValue;
//                    var result = (typeof(defaultValue) != 'undefined' && defaultValue == value) ||  v.test(value);
//                    
//                    if (!result) {
//                      valid = false;
//                      errors.push(v.message.replace("{key}", key));
//                    }
//                  }, this);
//                }
//              }
//              unvalidated = false;
//            }
//            return valid;
//          },
//          enumerable: false,
//          configurable: false
//        });
//
//        Object.defineProperty(this, "errors", {
//          get: function() {
//            return errors;
//          },
//          enumerable: false,
//          configurable: false
//        });
      }
    };

  })(modelDefinition);
}

exports.create = create;

var Model = {
  None: {
    test: function() { return true; },
    message: "This validator will always pass."
  },
  Required: {
    test: function(x) {
      return !(value == null || value == undefined || value == "");
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

Object.keys(Model).forEach(function(m) {
  Object.defineProperty(exports, m, {
    enumerable: true,
    configurable: false,
    value: Model[m]
  });
});
