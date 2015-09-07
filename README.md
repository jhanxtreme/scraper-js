# scraper-js
App in beta mode. Sample usage:

	ez.ajax({
		url: 'https://www.google.com.ph/',
		method: 'GET',
		result: function(res){

			var text =  res.responseText;
			ez.scrape({
				data: text,
				results: function(res){
					console.log('RESULT', res);
					console.log('DONE');
				}
			});

		}
	});

