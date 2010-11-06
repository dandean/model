var Assert = require("assert"),
    Model = require("./model"),
    instance;

var SingleUnvalidatedProperty = Model.create({
  prop: Model.None
});

instance = new SingleUnvalidatedProperty();
Assert.equal(Object.keys(instance).length, 1, "Model instance should have only 1 property.");
Assert.ok("prop" in instance, "`prop` should be a property on the model instance.");
Assert.ok(instance.valid, "Model instance has no validators so should be valid.");
Assert.equal(instance.errors.length, 0, "Model instance has no validators so should have no errors after validation.");

var SingleRequiredProperty = Model.create({
  prop: Model.Required
});

instance = new SingleRequiredProperty();
Assert.equal(instance.prop, undefined, "`prop` should be `undefined`.");
Assert.equal(instance.valid, false, '`prop` is required, but is undefined, so should be invalid.');
instance.prop = "radical";
Assert.equal(instance.valid, true, "`prop` now has a value so should be valid.");
instance.prop = null;
Assert.equal(instance.valid, false, '`prop` is required, but is null, so should be invalid.');
Assert.equal(instance.errors.length, 1, "`prop` should have 1 error.");

// REGEXP VALIDATORS SHOULD AUTO-EXPAND INTO TEST METHODS
var HasRegExpValidator = Model.create({
  numbers: {
    test: /^\d+$/,
    message: "The '{field}' field should only consist of numbers"
  }
});

instance = new HasRegExpValidator({ numbers: 500 });
Assert.ok(instance.valid, "Should be valid.");

instance = new HasRegExpValidator({ numbers: "hi there" });
Assert.ok(instance.valid === false, "Should NOT be valid.");

// DEFAULT VALUES AREN'T PASSED THROUGH VALIDATION
var HasDefaultValueWhichDoesNotMatchValidator = Model.create({
  numbers: {
    defaultValue: "This is not a number",
    validation: {
      test: /^\d+$/,
      message: "The '{field}' field should only consist of numbers"
    }
  }
});

instance = new HasDefaultValueWhichDoesNotMatchValidator({
  numbers: "This is not a number"
});
Assert.ok(instance.valid, "Default value should pass even when they don't match validators.");

instance.numbers = 500;
Assert.ok(instance.valid, "New non-default value should pass validator.");

instance.numbers = "!!!";
Assert.ok(instance.valid === false, "New non-default value should fail validator.");

Assert["throws"](function() {
  var DoesNotHaveValidationTest = Model.create({
    prop: {
      xtest: function() { return false; },
      message: ""
    }
  });
  new DoesNotHaveValidationTest();
}, "Should have invalid definition test key.");

Assert["throws"](function() {
  var DoesNotHaveValidationTest = Model.create({
    prop: {
      test: function() { return false; },
      xmessage: ""
    }
  });
  new DoesNotHaveValidationTest();
}, "Should have invalid definition message key.");


var HasSubscribers = Model.create({
  prop1: Model.None,
  prop2: Model.None
});

var hasSubscribers = new HasSubscribers(),
    classSubscriberSawChange,
    propValueAfterClassSubscriber,
    instanceSubscriberSawChange,
    propValueAfterInstanceSubscriber;

HasSubscribers.subscribe("prop1", function(value, old, instance) {
  classSubscriberSawChange = true;
  propValueAfterClassSubscriber = value;
  
  Assert.ok(instance instanceof HasSubscribers);
  Assert.equal(2, Object.keys(instance).length);
  Assert.equal(value, instance.prop1);
});
hasSubscribers.subscribe("prop1", function(value, old) {
  instanceSubscriberSawChange = true;
  propValueAfterInstanceSubscriber = value;
});

hasSubscribers.prop1 = "one";

Assert.equal(classSubscriberSawChange, true);
Assert.equal(instanceSubscriberSawChange, true);
Assert.equal(propValueAfterClassSubscriber, "one");
Assert.equal(propValueAfterInstanceSubscriber, "one");

HasSubscribers.unsubscribe("prop1");
classSubscriberSawChange = false;
instanceSubscriberSawChange = false;

hasSubscribers.prop1 = "two";
Assert.equal(classSubscriberSawChange, false);
Assert.equal(instanceSubscriberSawChange, true);
Assert.equal(propValueAfterClassSubscriber, "one");
Assert.equal(propValueAfterInstanceSubscriber, "two");

hasSubscribers.unsubscribe("prop1");
classSubscriberSawChange = false;
instanceSubscriberSawChange = false;

hasSubscribers.prop1 = "three";
Assert.equal(classSubscriberSawChange, false);
Assert.equal(instanceSubscriberSawChange, false);
Assert.equal(propValueAfterClassSubscriber, "one");
Assert.equal(propValueAfterInstanceSubscriber, "two");

var cb1SawChange = false,
    cb2SawChange = false;

var callback = function(value, old) {
  cb1SawChange = true;
};

hasSubscribers.subscribe("prop2", callback);
hasSubscribers.subscribe("prop2", function(value, old) {
  cb2SawChange = true;
});

hasSubscribers.prop2 = "four";

Assert.equal(cb1SawChange, true);
Assert.equal(cb2SawChange, true);

hasSubscribers.unsubscribe("prop2", callback);

cb1SawChange = false;
cb2SawChange = false;

hasSubscribers.prop2 = "five";
Assert.equal(cb1SawChange, false);
Assert.equal(cb2SawChange, true);

HasSubscribers.unsubscribe();
