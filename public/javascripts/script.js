
var app = angular.module('app', ['ngAnimate']);

app.controller('first', function($scope, $rootScope, $http) {
	$scope.searchterm = '';
	$scope.search = function() {
		console.log($scope.searchterm);
		$http({
        url: '/s',
        method: "POST",
        data: { 'searchterm' : $scope.searchterm }
    })
    .then(function(response) {
      $scope.result = angular.fromJson(response).data;
      $scope.result.tbl.sort(keysrt('price'));
    }, 
    function(response) { // optional
            // failed
    });
	};

	//add std deviation per item
	//add average listings and sales per day.
	var old = {};
	$scope.outliers = function(res) {
		if (res == false) {
			$scope.result.tbl = old.slice(0);

			$scope.result.sold = 0;
			$scope.result.total = 0;
			$scope.result.tbl.map(function(m) {
				$scope.result.total++;
				if (m.didsell == "EndedWithSales") {
	    		$scope.result.sold++;
	    	}
			});
		} else {
			console.log('filter');
			old = $scope.result.tbl.slice(0);
			$scope.result.tbl = $scope.result.tbl.slice(5, 95);

			$scope.result.sold = 0;
			$scope.result.total = 0;
			$scope.result.tbl.map(function(m) {
				$scope.result.total++;
				if (m.didsell == "EndedWithSales") {
	    		$scope.result.sold++;
	    	}
			});
		}
	}
});

function keysrt(key) {
  return function(a,b){
   if (Number(a[key]) > Number(b[key])) return 1;
   if (Number(a[key]) < Number(b[key])) return -1;
   return 0;
  }
}