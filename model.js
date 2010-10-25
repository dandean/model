// TODO: save method
// TODO: how do we create one of these from a record or database?

function create(modelDefinition) {
  
  return (function(def) {

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

          Object.defineProperty(this, key, {
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
                var isValid =  !(value == null || value == undefined || value == "");
                return isValid;
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

        }.bind(this));

        Object.defineProperty(this, "valid", {
          get: function() {

            if (unvalidated) {
              errors = [];
              valid = true;

              for (var key in def) {
                var value = properties[key];

                if (def[key].validators) {
                  def[key].validators.forEach(function(v) {
                    var defaultValue = def[key].defaultValue;
                    var result = (typeof(defaultValue) != 'undefined' && defaultValue == value) ||  v.test(value);
                    if (!result) {
                      valid = false;
                      errors.push(v.message.replace("{key}", key));
                    }
                  }, this);
                }
              }
              unvalidated = false;
            }
            return valid;
          },
          enumerable: false,
          configurable: false
        });

        Object.defineProperty(this, "errors", {
          get: function() {
            return errors;
          },
          enumerable: false,
          configurable: false
        });
      }
    };

  })(modelDefinition);
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
    defaultValue: "!!!",
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


Evidence.TestCase.extend('Poking', {
  testOne: function(t){
    t.assertTrue(false);
  }
});

//var itska = new Dog();
//var sara = new Dog();
//
//console.log(itska.valid, sara.valid);



// exports.create = create;
