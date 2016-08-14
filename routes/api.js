var express = require('express');
var router = express.Router();
var request = require('request');

/* GET search json. */
router.post('/search', function(req, res, next) {
	console.log('Search term: ' + req.body.searchTerm);
	var search = {};
	search['term'] = req.body.searchTerm;
	var tbl = []
	var total = 0
	var sold = 0
	var cur30 = {'sold':0, 'listed':0, 'money':0}
	var prev60 = {'sold':0, 'listed':0, 'money':0}
	var monthTbl = {}
	var dayTbl = {}

	function searchCallback(error, response, body) {
		if (!error && response.statusCode == 200) {
	  	var parsed = JSON.parse(body);
	    parsed.findCompletedItemsResponse[0].searchResult[0].item.map(function(r) { 
	    	tbl.push({title:r.title[0], price:r.sellingStatus[0].convertedCurrentPrice[0].__value__, didsell:r.sellingStatus[0].sellingState[0]});
	    	total++;

	    	var daycalc = daysBetween(r.listingInfo[0].endTime[0].substring(0, 10), Date.now())
	    	if (daycalc <= 30) {
	    		cur30.listed++
	    	} else if (daycalc > 30 && daycalc <= 90){
	    		prev60.listed++
	    	}

	    	if(!monthTbl[r.listingInfo[0].endTime[0].substring(0, 7)]) {
					monthTbl[r.listingInfo[0].endTime[0].substring(0, 7)] = {'sold':0, 'listed':0, 'money':0};
				}
	    	if(!dayTbl[r.listingInfo[0].endTime[0].substring(0, 10)]) {
					dayTbl[r.listingInfo[0].endTime[0].substring(0, 10)] = {'sold':0, 'listed':0, 'money':0};
				}
				monthTbl[r.listingInfo[0].endTime[0].substring(0, 7)].listed++
				dayTbl[r.listingInfo[0].endTime[0].substring(0, 10)].listed++

	    	if (r.sellingStatus[0].sellingState[0] == "EndedWithSales") {
	    		sold++;
	    		if (daycalc <= 30) {
		    		cur30.sold++
	    			cur30.money += Number(r.sellingStatus[0].convertedCurrentPrice[0].__value__)
		    	} else if (daycalc > 30 && daycalc <= 90){
		    		prev60.sold++
	    			prev60.money += Number(r.sellingStatus[0].convertedCurrentPrice[0].__value__)
		    	}
	    		dayTbl[r.listingInfo[0].endTime[0].substring(0, 10)].sold++
	    		dayTbl[r.listingInfo[0].endTime[0].substring(0, 10)].money += Number(r.sellingStatus[0].convertedCurrentPrice[0].__value__)
	    		monthTbl[r.listingInfo[0].endTime[0].substring(0, 7)].sold++
	    		monthTbl[r.listingInfo[0].endTime[0].substring(0, 7)].money += Number(r.sellingStatus[0].convertedCurrentPrice[0].__value__)
	    	}
	    	//console.log(r.title[0]);
	    });

	  	var pageInfo = parsed.findCompletedItemsResponse[0].paginationOutput[0];
	  	console.log(pageInfo.pageNumber[0]+' '+pageInfo.totalPages[0]);
	  	if (pageInfo.pageNumber[0] < 10 && pageInfo.pageNumber[0] < pageInfo.totalPages[0]) {
	  		request('http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findCompletedItems&SERVICE-VERSION=1.7.0&SECURITY-APPNAME='+process.env.API_KEY+'&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords='+search.term+'&paginationInput.pageNumber='+(Number(pageInfo.pageNumber[0])+1), searchCallback)
				return
	  	}

				console.log(monthTbl)
				console.log(cur30)
				console.log(prev60)
	    //console.log(tbl);
	    //res.render('index', { title:'Express', tbl:tbl, total:total, sold:sold});
	    res.setHeader('Content-Type', 'application/json');
    	res.send(JSON.stringify({ title:'Express', tbl:tbl, total:total, sold:sold, monthTbl:monthTbl, dayTbl:dayTbl, cur30:cur30, prev60:prev60}));
	  }
	}
	request('http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findCompletedItems&SERVICE-VERSION=1.7.0&SECURITY-APPNAME='+process.env.API_KEY+'&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords='+search.term, searchCallback)
  
});
module.exports = router;


function daysBetween(date1, date2) {
	date1 = date1.split('-');
	date1 = new Date(date1[0], --date1[1], date1[2]);
	return (Math.abs((+date1) - (+date2))/8.64e7);
}