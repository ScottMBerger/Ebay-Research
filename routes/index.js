var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title:'Express'});
});

router.post('/s', function(req, res, next) {
	console.log('Search term: ' + req.body.searchterm);
	console.log(req.body);
	var search = {};
	search['term'] = req.body.searchterm;

	request('http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findCompletedItems&SERVICE-VERSION=1.7.0&SECURITY-APPNAME=ScottBer-testing-PRD-913d8b941-841f4c02&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords='+search.term, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	  	var parsed = JSON.parse(body);
	  	var tbl = [];
	  	var total = 0;
	  	var sold = 0;
	    parsed.findCompletedItemsResponse[0].searchResult[0].item.map(function(r) { 
	    	tbl.push({title:r.title[0], price:r.sellingStatus[0].convertedCurrentPrice[0].__value__, didsell:r.sellingStatus[0].sellingState[0]});
	    	total++;
	    	if (r.sellingStatus[0].sellingState[0] == "EndedWithSales") {
	    		sold++;
	    	}
	    	console.log(r.title[0]);
	    });
	    //console.log(tbl);
	    //res.render('index', { title:'Express', tbl:tbl, total:total, sold:sold});
	    res.setHeader('Content-Type', 'application/json');
    	res.send(JSON.stringify({ title:'Express', tbl:tbl, total:total, sold:sold}));
	  }
	})
  
});
module.exports = router;


	var toot = {"findCompletedItemsResponse":[{"ack":["Success"],"version":["1.13.0"],"timestamp":["2016-07-27T20:39:30.299Z"],"searchResult":[{"@count":"2","item":[{"itemId":["291824323670"],"title":["Garmin nuvi 1300 Automotive vehicle gps map car receiver  4.3in screen"],"globalId":["EBAY-US"],"primaryCategory":[{"categoryId":["156955"],"categoryName":["GPS Units"]}],"galleryURL":["http:\/\/thumbs3.ebaystatic.com\/m\/mb8TALeWKIurp874HFCMFMQ\/140.jpg"],"viewItemURL":["http:\/\/www.ebay.com\/itm\/Garmin-nuvi-1300-Automotive-vehicle-gps-map-car-receiver-4-3in-screen-\/291824323670"],"productId":[{"@type":"ReferenceID","__value__":"79642113"}],"paymentMethod":["PayPal"],"autoPay":["false"],"postalCode":["22407"],"location":["Fredericksburg,VA,USA"],"country":["US"],"shippingInfo":[{"shippingServiceCost":[{"@currencyId":"USD","__value__":"0.0"}],"shippingType":["FlatDomesticCalculatedInternational"],"shipToLocations":["US","CA","GB","AU","AT","BE","FR","DE","IT","JP","ES","TW","NL","CN","HK","MX","BR","RU","DK","RO","SK","BG","CZ","FI","HU","LV","LT","MT","EE","GR","PT","CY","SI","SE","KR","ID","IE","PL","IL","NZ"],"expeditedShipping":["false"],"oneDayShippingAvailable":["false"],"handlingTime":["2"]}],"sellingStatus":[{"currentPrice":[{"@currencyId":"USD","__value__":"18.0"}],"convertedCurrentPrice":[{"@currencyId":"USD","__value__":"18.0"}],"sellingState":["EndedWithSales"]}],"listingInfo":[{"bestOfferEnabled":["false"],"buyItNowAvailable":["false"],"startTime":["2016-07-21T14:36:40.000Z"],"endTime":["2016-07-21T14:48:44.000Z"],"listingType":["FixedPrice"],"gift":["false"]}],"returnsAccepted":["false"],"condition":[{"conditionId":["3000"],"conditionDisplayName":["Used"]}],"isMultiVariationListing":["false"],"topRatedListing":["false"]},{"itemId":["322174941918"],"title":["Garmin nuvi 1300 Automotive GPS Receiver"],"globalId":["EBAY-US"],"primaryCategory":[{"categoryId":["156955"],"categoryName":["GPS Units"]}],"galleryURL":["http:\/\/thumbs3.ebaystatic.com\/m\/myXrDonlOyGxpObGVjWkrEA\/140.jpg"],"viewItemURL":["http:\/\/www.ebay.com\/itm\/Garmin-nuvi-1300-Automotive-GPS-Receiver-\/322174941918"],"paymentMethod":["PayPal"],"autoPay":["true"],"location":["USA"],"country":["US"],"shippingInfo":[{"shippingServiceCost":[{"@currencyId":"USD","__value__":"0.0"}],"shippingType":["Free"],"shipToLocations":["US"],"expeditedShipping":["false"],"oneDayShippingAvailable":["false"],"handlingTime":["1"]}],"sellingStatus":[{"currentPrice":[{"@currencyId":"USD","__value__":"21.84"}],"convertedCurrentPrice":[{"@currencyId":"USD","__value__":"21.84"}],"sellingState":["EndedWithSales"]}],"listingInfo":[{"bestOfferEnabled":["false"],"buyItNowAvailable":["false"],"startTime":["2016-06-30T01:55:33.000Z"],"endTime":["2016-07-01T21:52:28.000Z"],"listingType":["StoreInventory"],"gift":["false"]}],"returnsAccepted":["true"],"galleryPlusPictureURL":["http:\/\/galleryplus.ebayimg.com\/ws\/web\/322174941918_1_0_1.jpg"],"condition":[{"conditionId":["3000"],"conditionDisplayName":["Used"]}],"isMultiVariationListing":["false"],"topRatedListing":["true"]}]}],"paginationOutput":[{"pageNumber":["1"],"entriesPerPage":["2"],"totalPages":["6"],"totalEntries":["12"]}]}]};
var tit = [{"ack":["Success"]}];
	console.log(tit[0].ack);