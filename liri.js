
var command = process.argv[2];
var value = process.argv[3];
var Twitter = require('twitter');
var keys = require("./keys");

var client = new Twitter(keys.twitterKeys);
var params = {
	screen_name: 'divers1776' ,
	count: 20
}

// var Spotify = require('node-spotify-api');

// var spotify = new Spotify({
//   id: 'divers1776',
//   secret: '99b56b8825e847b89df82b1c58bd05cd'
// });


var SpotifyWebApi = require('spotify-web-api-node');

// credentials are optional
var spotifyApi = new SpotifyWebApi(keys.spotifyKeys);





var fs = require('fs');

var request = require('request');


console.log(command);
console.log(value);



// client.get('favorites/list', function(error, tweets, response) {
//   if(error) throw error;
//   console.log(tweets);  // The favorites. 
//   console.log(response);  // Raw response object. 
// });

switch (command) {
    case 'mytweets':
        myTweets();
        break;
    case 'spotify':
        spotifyThisSong(value);
        break;
    case 'omdb':
        movieThis(value);
        break;
    case 'random':
        random();
        break;
}


// **********************  my-tweets function
function myTweets() {
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error && response.statusCode == 200) {
            fs.appendFile('terminal.log', ('=============== LOG ENTRY BEGIN ===============\r\n' + Date() 
            	+ '\r\n \r\nTERMINAL COMMANDS:\r\n$: ' + process.argv + '\r\n \r\nDATA OUTPUT:\r\n'), function(err) {
                if (err) throw err;
            });
            console.log(' ');
            console.log('Last 20 Tweets:')
            for (i = 0; i < tweets.length; i++) {
                var number = i + 1;
                console.log(' ');
                console.log([i + 1] + '. ' + tweets[i].text);
                console.log('Created on: ' + tweets[i].created_at);
                console.log(' ');
                fs.appendFile('terminal.log', (number + '. Tweet: ' + tweets[i].text + '\r\nCreated at: ' 
                	+ tweets[i].created_at + ' \r\n'), function(err) {
                    if (err) throw err;
                });
            }
            fs.appendFile('terminal.log', ('=============== LOG ENTRY END ===============\r\n \r\n'),
             function(err) {
                if (err) throw err;
            });
        }
    });
}


// Search tracks whose name, album or artist contains 'Love'
function spotifyThisSong(value) {
	spotifyApi.searchTracks(value)
  .then(function(data) {
    console.log("Search by "+ value , data.body);
  }, function(err) {
    console.error(err);
  });
}



// ***************************** omdbThis function
function movieThis(value) {
    if (value == null) {
        value = 'wargames';
    }
    // http://www.omdbapi.com/?apikey=40e9cece&
    request('http://www.omdbapi.com/?apikey=40e9cece&' + value + '&tomatoes=true&r=json', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            jsonBody = JSON.parse(body);
            console.log(' ');
            console.log('Title: ' + jsonBody.Title);
            console.log('Year: ' + jsonBody.Year);
            console.log('IMDb Rating: ' + jsonBody.imdbRating);
            console.log('Country: ' + jsonBody.Country);
            console.log('Language: ' + jsonBody.Language);
            console.log('Plot: ' + jsonBody.Plot);
            console.log('Actors: ' + jsonBody.Actors);
            console.log('Rotten Tomatoes Rating: ' + jsonBody.tomatoRating);
            console.log('Rotten Tomatoes URL: ' + jsonBody.tomatoURL);
            console.log(' ');
            fs.appendFile('log.txt', ('=============== LOG ENTRY BEGIN ===============\r\n' + Date() 
            	+ '\r\n \r\nTERMINAL COMMANDS: ' + process.argv + '\r\nDATA OUTPUT:\r\n' + 'Title: ' 
            	+ jsonBody.Title + '\r\nYear: ' + jsonBody.Year + '\r\nIMDb Rating: ' + jsonBody.imdbRating 
            	+ '\r\nCountry: ' + jsonBody.Country + '\r\nLanguage: ' + jsonBody.Language + '\r\nPlot: ' 
            	+ jsonBody.Plot + '\r\nActors: ' + jsonBody.Actors + '\r\nRotten Tomatoes Rating: ' 
            	+ jsonBody.tomatoRating + '\r\nRotten Tomatoes URL: ' + jsonBody.tomatoURL 
            	+ '\r\n =============== LOG ENTRY END ===============\r\n \r\n'), function(err) {
                if (err) throw err;
            });
        }
    });
} 

// ****************** random function
function random() {
    fs.readFile('random.txt', 'utf8', function(error, data) {
        if (error) {
            console.log(error);
        } else {
            var dataArr = data.split(',');
            if (dataArr[0] === 'spotify') {
                spotifyThis(dataArr[1]);
            }
            if (dataArr[0] === 'omdb') {
                omdbThis(dataArr[1]);
            }
        }
    })
}
