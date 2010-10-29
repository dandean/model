var Assert = require("assert"),
    Model = require("./model");

// -> EXAMPLE MODEL DEFINITION, AND ALL OF ITS VARIANTS.
// AT THIS POINT, THE CURRENT ITERATION WOULD BE A SINGLE FIELD SPEC
var X = Model.create({
  prop1: Model.None,
  prop2: Model.Required,
  prop3: [Model.Required, Model.Url],
  prop4: {
    defaultValue: "Enter a URL",
    validation: Model.None
  },
  prop5: {
    defaultValue: "Enter a URL",
    validation: Model.Required
  },
  prop6: {
    defaultValue: "Enter a URL",
    validation: [Model.Required, Model.Url]
  },
  prop7: {
    defaultValue: "Enter a URL",
    validation: [Model.Url, {
      test: function(x) {
        return !(value == null || value == undefined || value == "");
      },
      message: '"{field}" is required but has no value.'
    }]
  },
  prop8: {
    defaultValue: "Enter a URL",
    validation: {
      test: function(x) {
        return !(value == null || value == undefined || value == "");
      },
      message: '"{field}" is required but has no value.'
    }
  }
});


var x = new X();


//// TWO-PROPERTIES, NO VALIDATORS
//var ModelHasNameAndPhone = Model.create({
//  name: {},
//  phone: {}
//});
//
//var modelShouldHaveNameAndPhone = new ModelHasNameAndPhone();
//Assert.ok(modelShouldHaveNameAndPhone.valid, "Instance has no validators, should be valid.");
//
//var keys = Object.keys(modelShouldHaveNameAndPhone);
//Assert.equal(keys.length, 2, "Instance should have 2 keys.");
//Assert.ok(keys.indexOf("name") > -1, "Instance should have a 'name' key.");
//Assert.ok(keys.indexOf("phone") > -1, "Instance should have a 'phone' key.");
//
//
//// REQUIRED FIELD flag
//var NameIsRequired = Model.create({
//  name: {
//    required: true
//  }
//});
//
//var nameShouldBeRequired = new NameIsRequired();
//Assert.ok(nameShouldBeRequired.valid === false, "Instance instance should be invalid");
//Assert.equal(nameShouldBeRequired.errors.length, 1, "Instance should have 1 error.");
//
//nameShouldBeRequired.name = "name";
//Assert.ok(nameShouldBeRequired.valid);
//Assert.equal(nameShouldBeRequired.errors.length, 0, "Instance should have 0 errors.");
//
//
//// REGEXP VALIDATORS SHOULD AUTO-EXPAND INTO TEST METHODS
//var HasRegExpValidator = Model.create({
//  numbers: {
//    validator: {
//      test: /^\d+$/,
//      message: "The '{field}' field should only consist of numbers"
//    }
//  }
//});
//
//var hasRegExpValidatorWhichShouldSucceed = new HasRegExpValidator({
//  numbers: 500
//});
//Assert.ok(hasRegExpValidatorWhichShouldSucceed.valid, "Should be valid.");
//
//var hasRegExpValidatorWhichShouldFail = new HasRegExpValidator({
//  numbers: "hi there"
//});
//Assert.ok(hasRegExpValidatorWhichShouldFail.valid === false, "Should NOT be valid.");
//
//
//// DEFAULT VALUES AREN'T PASSED THROUGH VALIDATION
//var HasDefaultValueWhichDoesNotMatchValidator = Model.create({
//  numbers: {
//    defaultValue: "This is not a number",
//    validator: {
//      test: /^\d+$/,
//      message: "The '{field}' field should only consist of numbers"
//    }
//  }
//});
//
//var hasDefaultValueWhichDoesNotMatchValidator = new HasDefaultValueWhichDoesNotMatchValidator({
//  numbers: "This is not a number"
//});
//Assert.ok(hasDefaultValueWhichDoesNotMatchValidator.valid, "Default value should pass even when they don't match validators.");
//
//hasDefaultValueWhichDoesNotMatchValidator.numbers = 500;
//Assert.ok(hasDefaultValueWhichDoesNotMatchValidator.valid, "New non-default value should pass validator.");
//
//hasDefaultValueWhichDoesNotMatchValidator.numbers = "!!!";
//Assert.ok(hasDefaultValueWhichDoesNotMatchValidator.valid === false, "New non-default value should fail validator.");

















//var Person = Model.create({
//  name: {
//    required: true,
//    validator: {
//      test: function(name) {
//        return name == "^[a-zA-Z ]$";
//      },
//      message: "Name can contain only letters and spaces."
//    }
//  },
//  phone: {
//    validator: {
//      test: /\d{10}/,
//      message: "Phone must be 10 digits long"
//    }
//  }
//});
//
//var Dog = Model.create({
//  canSit: {
//    defaultValue: "!!!",
//    required: true,
//    validator: {
//      test: /^yes|no$/i,
//      message: "Either 'Yes' or 'No'"
//    }
//  },
//  name: {
//    required: true,
//    validator: [
//      {
//        test: function(name) {
//          return name == "dan";
//        },
//        message: "The name must be 'dan'"
//      },
//      {
//        test: /^\w{3}$/,
//        message: "The name must be 3 characters long"
//      }
//    ]
//  }
//});
