/* Scraping     */
// **************
var cheerio = require('cheerio');
var request = require('request');
var fs = require('fs');
var options = {
  url: 'https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords=bulb',
  Headers: {
    userAgent: "Mozilla/5.0 (Macintosh; U; Intel Mac OS X; en-US) AppleWebKit/525.19 (KHTML, like Gecko) Chrome/7.0.540.0 Safari/525.19",
    acceptEncoding: "gzip, deflate, br",
    acceptLanguage: "en-US,en;q=0.9,ar;q=0.8,fr;q=0.7",
    accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    cacheControl: 'no-cache',
    pragma: 'no-cache'
  }
};
var dataResult = []; // Scraping result


/* Server       */
// **************
var express = require('express');//Express to set the server
var app = express();
var cors = require('cors');//Cors to send/receive data in JSON format
var path = require('path');//To set the public path where the index.html is saved
var bodyParser = require('body-parser')
app.use(bodyParser.json()); //To support JSON-encoded bodies
app.use(express.json()); //To support JSON-encoded bodies
var port = process.env.PORT || 3000;//Set the server port (to listen) 
app.use(cors());
app.use('/', express.static(path.join(__dirname, 'public')));
var clear = require('clear');

/* Amazon Web Services (AWS)*/
// **************************
var config = require('config-json');//config-json to store the AWSAccessKeyId and the AWSSecretKey
config.load('./config.json');
var aws = require('aws-sdk');
var AWSAccessKeyId = config.get('AWSAccessKeyId'),
  AWSSecretKey = config.get('AWSSecretKey');
aws.config.update({
  accessKeyId: AWSAccessKeyId,
  secretAccessKey: AWSSecretKey
});
var s3 = new aws.S3();
var bucketName ='scrapingfolders3',
    fileS3Name = 'scrapingresults3.json';
  //
  //            
var dataRead = [{"title":"AmazonBasics 75 Watt Equivalent, Soft White, Non-Dimmable, A19 LED Light Bulb | 2-Pack","price":"$7.89","stars":"Prime4.2 out of 5 stars"},{"title":"Philips LED Non-Dimmable A19 Frosted Light Bulb: 800-Lumen, 2700-Kelvin, 8.5-Watt (60-Watt Equivalent), E26 Base, Soft White, 16-Pack","price":"$26.01$26.01","stars":"Prime4.4 out of 5 stars"},{"price":"","stars":""},{"title":"(Pack of 6) 7W Dimmable GU10 LED Spot Light Bulbs 70W Equivalent, 2700K Warm White Spotlight Bulb GU10 Base, Led Light Bulbs, 120V, 2 Years Warranty","price":"$36.12","stars":"5 out of 5 stars"},{"title":"Westinghouse 115 Watt (400 Watt Equivalent) LED High Bay Daylight Mogul Base 120 - 277 Volt High Lumen Light Bulb","price":"$219.99","stars":"Prime4.6 out of 5 stars"},{"title":"(Pack of 1) Daylight White 5000K 5W Led Bulb silicon controlled Dimmable GU10 Base 50w Halogen light Equivalent, Recessed Lighting,LED spotlight, 500lm led spotlight for Home and Shop decorative Light","price":"","stars":"4.7 out of 5 stars"},{"title":"Sunlite T5/LED/4'/25W/IS/DLC/40K Plug and Play 25W Light Bulb with (G5) Base, Cool White","price":"$23.09","stars":"5 out of 5 stars"},{"title":"TORCHSTAR 18W Dimmable PAR38 LED Light Bulb, Energy Star UL-listed Spotlight, 120W Equivalent, 4000K Cool White, 1300LM for Stage, Scene, Event, Residential, Commercial, General Lighting","price":"$15.29","stars":"4 out of 5 stars"},{"title":"(Pack of 6)A19 LED Vintage Filament Bulb, Dimmable, 7.5W (Equivalent to 75W Incandescent E26 Base), 850 lumen, 2700K （Warm White), A60 LED Filament Bulb, Omnidirectional, CRI 85+, 120Volt","price":"$30.99","stars":"5 out of 5 stars"},{"title":"BR30 12 Watt Light Bulb Equivalent 120 Watt Incandescent Bulb Not Dimmable E26 Base 3000K Soft Light 120v 1200 Lumens 6-Pack","price":"$38.69","stars":"5 out of 5 stars"},{"title":"ALZO 8W Joyous Light Dimmable LED Full Spectrum PAR20 Spot Light Bulb 5500K Bright White Daylight, 650 Lumens, 120V","price":"$10.13","stars":"5 out of 5 stars"},{"title":"8ft LED Shop Light Fixture,72w 7200 Lumens 5000K Daylight White Tube Light,Hight Output,Double Sided V Shape T8 Integrated 8 Foot Led Bulbs for Garage,Warehouse,Plug and Play,Clear Lens 100-Pack","price":"","stars":"4.6 out of 5 stars"},{"title":"Excellent 9W E26 LED Light Bulbs Not Dimmable 630LM Led 60W Replacement Day White LED Globe Light Bulbs (Pack of 3)","price":"$8.99","stars":"5 out of 5 stars"},{"title":"Bulbrite 776667 7W 2700K LED7ST18/27K/FIL/2 LED ST18 Light Bulb with Medium/Standard Base, Warm White","price":"$12.63","stars":"Prime4.5 out of 5 stars"},{"title":"Great Eagle LED BR40 3000K Dimmable Light Bulb, 15W(120W Equivalent) UL Listed 1480 Lumens Bright White Color for Recessed and Track Lighting Fixtures (4-Pack)","price":"$21.95","stars":"Prime4.5 out of 5 stars"},{"title":"Sienna Faceted Transparent Amber LED C7 Christmas Replacement Bulbs, 4 Pack","price":"$9.49","stars":"4.5 out of 5 stars"},{"title":"12 pack SWITCH 75-Watt Replacemen​t 18.5W LED Light Bulb, A23201FA2-R, Frosted Lens","price":"$129.99","stars":""},{"title":"Buggy Whip Antenna 360 Degree White 1156 Led Light Bulb","price":"$31.91","stars":""},{"title":"Sylvania Smart+ Bluetooth Soft White A19 LED Bulb (3 Pack)","price":"$74.99","stars":"Prime"},{"title":"Pack of 6 MR11 LED GU4.0 Bulb, Luxrite, 20W Halogen Bulb Equivalent, 12V Spot, 200 Lumens, 3000K (Soft White), Track/Accent Lighting, 30° Beam Angle, GU4 Bi-Pin Base","price":"$44.99","stars":"Prime"},{"title":"(Pack of 10) Soraa 777570 SM16GA-07-36D-827-03 Brilliant MR16 GU10 7.5W 2700K 36 Degree LED Light Bulb","price":"$243.81","stars":""},{"title":"PHILIPS EnduraLED 10W MR16 2700K Dimmable NFL 24 Light Bulb x 10 pcs","price":"$339.68","stars":"Prime"},{"title":"Rowrun LED 15 Watt Corn Bulb Incandescent Replacement Bulb 1300LM 5736SMD 156/pcs LEDs Cold White(6000-6500K) E26/E27 Pack of 1","price":"$12.66","stars":"5 out of 5 stars"},{"title":"Philips 414698 - 7MR16/END/F24 3000 12V DIM MR16 Flood LED Light Bulb","price":"$27.46","stars":""},{"title":"Ushio BC2687 1000254 - DZA - Stage & Studio - T3.5-30W Light Bulb - 10.8V - G5.3 Base - 3100K","price":"$19.53","stars":"Prime"},{"title":"Spoya Fire Flame Superman badge symbol Home Bedroom Hotel Bar E26 E27 Ceiling wall CREE LED logo projection projector light spot light downlight decorative light lamp Bulb","price":"$19.99","stars":"4.1 out of 5 stars"},{"title":"Luxrite LR31823 14-Watt LED BR40 Flood Light Bulb, 85W Equivalent, Dimmable, Cool White 4100K, 1100 Lumens, E26 Base, UL Listed, 1-Pack","price":"$14.99","stars":"5 out of 5 stars"},{"title":"(Pack of 1) R39 BR14 LED lighting bulbs E17 base 3W led light 25W Halogen Equivalent Replacement bulb light Natural White 4000K Led light For Home Lighting Decorative AC120V","price":"$8.99","stars":""},{"title":"Liqoo MR16 LED Light Bulbs, Bi Pin GU5.3 Base, 5W 400LM Warm White 2800K (35 Watt Equivalent) Halogen Lamp Replacement AC DC 12V Not Dimmable 120° Beam Angle for Landscape Track Lighting, 6 Packs","price":"$17.99","stars":"Prime5 out of 5 stars"},{"title":"Great Eagle 100W Equivalent LED Light Bulb 1600 Lumens A19 Cool White 4000K Dimmable 14-Watt UL Listed (6-Pack)","price":"$23.95","stars":"Prime4.1 out of 5 stars"}]; // Data read from the S3 file
var msg;


/*** Write into the S3 file ***/
var writeS3File = function(dataRead) {
  return new Promise(function(resolve, reject) {
    var getParams = {
      Bucket: bucketName,
      Key: fileS3Name
    };

    return s3.getObject(getParams, function(err, data) {
      if (err) {
        console.log(err);
        msg = "Nok";
      } else {
        params = {
          Bucket: bucketName,
          Key: fileS3Name,
          Body: JSON.stringify(dataRead)
        };
        s3.putObject(params, function(err, data) {
          if (err) {
            console.log(err);
            msg = "Nok";
          } else {
            msg = "Ok";
            resolve();
          }
        })
      }
    })
  });
}

/*** Read from the S3 file ***/
var readS3File = function() {
  return new Promise(function(resolve, reject) {

    var getParams = {
      Bucket: bucketName,
      Key: fileS3Name
    };

    s3.getObject(getParams, function(err, data) {
      if (err) {
        msg = "Nok";
        console.log(err);
      } else {
        dataRead = []; //reset
        dataRead = JSON.parse(data.Body.toString());
        for (var i = 0; i < dataRead.length; i++) {
          console.log("Title:[" + i + "]  " + dataRead[i].title);
        };
        msg = "Ok";
        resolve();
      }
    })
  });
}

/*** Scraping ***/ 
app.get('/startScraping', function(req, res) {
  request(options, function(err, res, html) {
    if (!err) {
      var $ = cheerio.load(html);

      $('.s-result-item').each(function(i, elm) {

        var toAvoid1 = elm.attribs.class; //Avoid the element with this class acs-private-brands-container-background
        var toAvoid2 = $(elm).find('#osp-search');

        if ((toAvoid1.search("acs-private-brands-container-background")) == -1 &&
          (toAvoid2.length == 0)) {

          console.log(' __________________________ ');

          var title = $(elm).find('h2'),
            price = $(elm).find('.a-column.a-span7'),
            stars = $(elm).find('.a-icon-alt');

          console.log('title: ' + title.attr('data-attribute'));
          console.log('price: ' + price.find('.a-offscreen').text());
          console.log('stars: ' + stars.text());

          dataResult.push({
            title: title.attr('data-attribute'),
            price: price.find('.a-offscreen').text(),
            stars: stars.text()
          });
        } else {
          //Do nothing ...          
        }
      })
      fs.writeFile('result.json', JSON.stringify(dataResult), function(err) {
        if (err) throw err;
        console.log('... JSON file created :)');
      });

    } else {
      console.error("err: ", err);
    }
  })
  res.json({
    "status": "Ok",
  });
});
/*** Write ***/ 
app.get('/writeS3File', function(req, res) {
  writeS3File(dataResult).then(function() {
    res.json({
      "status": msg
    });
  }).catch(function(err){
      console.log(err);
  });
});
/*** Read ***/ 
app.get('/readS3File', function(req, res) {
  readS3File().then(function() {
    res.json({
      "status": msg
    });
  }).catch(function(err){
      console.log(err);
  });
});

/*** Start the server ***/
// **********************
clear(); //clear screen
console.log(' ***** Start session *** ');
console.log(' *****               *** ');
app.listen(port);