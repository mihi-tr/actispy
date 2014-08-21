angular.module('actispyFilters', []).filter('pace', function() {
  return function(input) {
      var min = Math.floor(input);
      var sec= Math.round((input-min)*60)
      return min + ":" + sec
        };
        });
