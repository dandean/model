// TODO: defaultValue for required fields
// TODO: save method
// TODO: how do we create one of these from a record or database?
// TODO: break out into individual files

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

function create(modelDefinition) {
  
  var model;
  
  (function(def) {
    var properties = {},  // internal datastore
        valid = undefined,
        unvalidated = true,
        errors = [];  // populated when the `valid` key is accessed

    model = function(data) {
      // populate instance field properties
      if (data) {
        for (var name in data) {
          properties[name] = data[name];
        }
      }
    };

    Object.keys(def).forEach(function(key) {
      
      Object.defineProperty(model.prototype, key, {
        get: function() { return properties[key]; },
        set: function(x) {
          unvalidated = true;
          properties[key] = x;
        },
        enumerable: true,
        configurable: true
      });
    
      var validators = [];

      // Convert `required` flag into a validator
      if (def[key].required) {
        validators.push({
          test: function(value) {
            return !(value == null || value == undefined || value == "");
          },
          message: '"{key}" is required but has no value.'
        });

        delete def[key].required;
      }

      if (def[key].validator) {
        if (Array.isArray(def[key].validator)) {
          for(var i=0; i<def[key].validator.length; i++) {
            validators.push(def[key].validator[i]);
          }
        } else {
          validators.push(def[key].validator);
        }

        delete def[key].validator;
        def[key].validators = validators;
      }

    }.bind(model.prototype));

    Object.defineProperty(model.prototype, "valid", {
      get: function() {
        
        if (unvalidated) {
          errors = [];
          valid = true;
          
          console.log("validating", this);
          
          for (var key in def) {
            var value = properties[key];

            if (def[key].validators) {
              def[key].validators.forEach(function(v) {
                var result = v.test(value);
                if (!result) {
                  valid = false;
                  errors.push(v.message.replace("{key}", key));
                }
              }, model.prototype);
            }
          }
          unvalidated = false;
        }
        return valid;
      },
      enumerable: false,
      configurable: false
    });

    Object.defineProperty(model.prototype, "errors", {
      get: function() {
        return errors;
      },
      enumerable: false,
      configurable: false
    });

  })(modelDefinition);

  return model;
}


var Person = create({
  name: {
    required: true,
    validator: {
      test: function(name) {
        return name == "^[a-zA-Z ]$";
      },
      message: "Name can contain only letters and spaces."
    }
  },
  phone: {
    validator: {
      test: /\d{10}/,
      message: "Phone must be 10 digits long"
    }
  }
});

var Dog = create({
  canSit: {
    required: true,
    validator: {
      test: /^yes|no$/i,
      message: "Either 'Yes' or 'No'"
    }
  },
  name: {
    required: true,
    validator: [
      {
        test: function(name) {
          return name == "dan";
        },
        message: "The name must be 'dan'"
      },
      {
        test: /^\w{3}$/,
        message: "The name must be 3 characters long"
      }
    ]
  }
});

var itska = new Dog();
var sara = new Dog();

console.log(itska.valid, sara.valid);



// exports.create = create;
