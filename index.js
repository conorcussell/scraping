var cheerio = require('cheerio');
var request = require('request');
var fs = require('fs');

// request the index page
request('http://www.jamieoliver.com/recipes/vegetables-recipes/', function (error, response, html) {
  if (!error && response.statusCode == 200) {
    var $ = cheerio.load(html);

    // find all the individual recipe links
    $('.recipe-block a').each(function(r) {
      getRecipe(this.attribs.href);
    });
  }
});

// get each recipe
function getRecipe(url) {
  request('http://www.jamieoliver.com' + url, function (error, response, html) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);

      var name = $('.single-recipe-details h1').text();
      var ingredients = $('.ingred-list').text().replace(/  +/g, ' ');
      var method = $('.instructions-wrapper').text().replace(/  +/g, ' ');

      var recipe = {
        name: name,
        ingredients: ingredients,
        method: method
      };

      // this creates a json file for each recipe we find. You could store them to a database instead though.
      fs.writeFile(name.replace(/ /g, '_') + '.json', JSON.stringify(recipe), function(err) {
          if(err) {
            return console.log(err);
          }
      });
    }
  });
}
