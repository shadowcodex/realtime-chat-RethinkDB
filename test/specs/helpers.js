var helpers = (function() {

  var helpers = { };
  helpers.randomInt = function(n) {
    return Math.floor(Math.random() * n);
  };

  helpers.randomString = function(n) {
    var str = '';
    while (n--) {
      if (Math.random() < 0.15) {
        str += '\n';
      } else {
        var chr = helpers.randomInt(26) + 97;
        str += String.fromCharCode(chr);
      }
    }
    return str;
  };

  var attrNames = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
  var attrValues = [-4, 0, 10, 50, '0', '10', 'a', 'b', 'c', true, false];

  helpers.randomAttributes = function(allowFalse) {
    var attributes = { };
    var count = helpers.randomInt(3);
    for(var i = 0; i < count; i++) {
      var name = attrNames[helpers.randomInt(attrNames.length)];
      var value = attrValues[helpers.randomInt(attrValues.length - (allowFalse ? 0 : 1))];
      attributes[name] = value;
    }

    return attributes;
  };

  helpers.randomAttributesArray = function(n) {
    var attributes = Array(n);
    for(var i = 0; i < n; i++) {
      attributes[i] = helpers.randomAttributes();
    }
    return attributes;
  };

  // A random test generates random data to check some invariants. To increase
  // confidence in a random test, it is run repeatedly.
  helpers.randomTest = function(n, fun) {
    return function () {
      while (n--) {
        fun();
      }
    };
  };

  function randomElement (arr) {
    return arr[helpers.randomInt(arr.length)];
  }

  return helpers;
})();