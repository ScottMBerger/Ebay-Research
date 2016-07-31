
var app = angular.module('app', ['ngAnimate']);

app.controller('first', function($scope, $rootScope, $http, $timeout) {
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
			$scope.result.tbl = $scope.result.tbl.slice(3, $scope.result.tbl.length - 3);
			//removeOutliers($scope.result.tbl, 'price', 0.1, 0);
			$scope.result.tbl = filterOutliers($scope.result.tbl)
			//$scope.result.tbl = stddev($scope.result.tbl)

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

	$scope.removeThis = function(index) {
		$scope.result.tbl.splice(index, 1)
		$scope.result.sold = 0;
		$scope.result.total = 0;
		$scope.result.tbl.map(function(m) {
			$scope.result.total++;
			if (m.didsell == "EndedWithSales") {
    		$scope.result.sold++;
    	}
		});
	}
});

function filterOutliers(someArray) {  
    // Copy the values, rather than operating on references to existing values
    var values = someArray.concat();

    // Then sort
    values.sort(keysrt('price'));


    /* Then find a generous IQR. This is generous because if (values.length / 4) 
     * is not an int, then really you should average the two elements on either 
     * side to find q1.
     */     
    var q1 = values[Math.floor((values.length / 5))].price;
    // Likewise for q3. 
    var q3 = values[Math.ceil((values.length * (4 / 5)))].price;
    var iqr = q3 - q1;

    // Then find min and max values
    var maxValue = q3 + iqr*1.5;
    var minValue = q1 - iqr*1.5;

    // Then filter anything beyond or beneath these values.
    var filteredValues = values.filter(function(x) {
        return (x.price <= maxValue) && (x.price >= minValue);
    });

    // Then return
    return filteredValues;
}

function keysrt(key) {
  return function(a,b){
   if (Number(a[key]) > Number(b[key])) return 1;
   if (Number(a[key]) < Number(b[key])) return -1;
   return 0;
  }
}

app.directive('scHover', scHoverDirective);
function scHoverDirective($timeout) {
    return {
        link: function(scope, element, attrs, modelCtrl) {
                var inTimeout = false;
                var hoverDelay = parseInt(attrs.scHoverDelay, 10) | 500;

                element.on('mouseover', function () {
                  inTimeout = true;
                  $timeout(function () {
                    if (inTimeout) {
                      scope.$eval(attrs.scHover);
                      inTimeout = false;
                    }
                  }, hoverDelay);
                });

                element.on('mouseleave', function () {
                  inTimeout = false;
                  scope.$apply(function () {
                    scope.$eval(attrs.scHoverEnd);
                  });
                });
        }
    }
}