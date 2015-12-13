var appFilters = angular.module('app.filters', []);

// Capitalization
appFilters.filter('capitalize', function() {
  // FUNCTION TO CAPITALIZE THE !ST LETTERS IN A STRING
  String.prototype.capitalize = function() {
    return this.replace(/(^|\s)([a-z])/g, function(m, p1, p2) {
      return p1 + p2.toUpperCase();
    });
  };
  return function(input) {
    //if input string, do capitalize
    return typeof input == "string" ? input.capitalize() : input;
  };
});

appFilters.filter('timeago', function() {
  return function(input, format) {
    //if formating is needed to return a humanized date
    // return format ? moment.unix(input).format('LL'): moment.unix(input).fromNow();
    return format ? moment(input, "YYYY-MM-DD HH:mm").format('LL') : moment(input, "YYYY-MM-DD HH:mm").fromNow();
  };
});

appFilters.filter('summary', function() {
  return function(input, len) {
    return input.substring(-1, parseInt(len)) + '...';
  };
});

appFilters.filter('util', function() {
  return function(input, format) {
    // If format ==  true, then format the no. provided
    return format ? Util.formatNumber(input) : Util.padPrice(input);
  };
});
