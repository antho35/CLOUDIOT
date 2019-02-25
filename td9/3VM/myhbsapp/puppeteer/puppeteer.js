const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });
  const page = await browser.newPage();
  await page.goto('http://myhbsapp.com');
//  await page.screenshot({path: './screenshots/accueil.png'});

  await page.type('#searchalbum', 'album_mer');

  await Promise.all([
    page.waitForNavigation(),
    page.click('#btnsearch')
  ]);
//  await page.screenshot({path: './screenshots/album_mer.png'});

  await page.click('#img3');
//  await page.screenshot({path: './screenshots/img3.png'});

  //l'utilisateur retourne à la page d'accueil
  await page.goto('http://myhbsapp.com');

  //il choisit un autre album
  await page.type('#searchalbum', 'album_montagne');
  await Promise.all([
    page.waitForNavigation(),
    page.click('#btnsearch')
  ]);

/*
//  await page.screenshot({path: './screenshots/album_montagne.png'});
  await page.click('#delete');
  await page.type('#searchalbum', 'album_montagne');
  await Promise.all([
    page.waitForNavigation(),
    page.click('#btnsearch')
  ]);*/
//  await page.screenshot({path: './screenshots/album_not_found.png'});

  await page.click('#addalbum');
  await page.type('#id', 'album_montagne');
  await page.type('#titre', 'Montagne Album');
  await page.type('#description', 'The most beautiful mountains on earth');
  await page.type('#photo1', '/images/montagne/montagne1.jpg');
  await page.type('#photo2', '/images/montagne/montagne2.jpg');
  await page.type('#photo3', '/images/montagne/montagne3.jpg');
  await page.type('#photo4', '/images/montagne/montagne4.jpg');
  //await page.screenshot({path: './screenshots/addalbum_desert.png'});
  await Promise.all([
    page.waitForNavigation(),
    page.click('#submit')
  ]);
  await page.type('#searchalbum', 'album_montagne');
  await Promise.all([
    page.waitForNavigation(),
    page.click('#btnsearch')
  ]);
//  await page.screenshot({path: './screenshots/album_desert.png'});




/*
  //proba
  function getRandomArbitrary(min, max) { //valeur de max est exclue
  return Math.random() * (max - min) + min;
  }

  // ajoute un album avec une proba 1/10
  if(getRandomArbitrary(1, 11)==1){
  await page.click('#addalbum');
  await page.type('#id', 'album_desert');
  await page.type('#titre', 'Desert Album');
  await page.type('#description', 'The most beautiful deserts on earth');
  await page.type('#photo1', '/images/desert/desert1.jpg');
  await page.type('#photo2', '/images/desert/desert2.jpg');
  await page.type('#photo3', '/images/desert/desert3.jpg');
  await page.type('#photo4', '/images/desert/desert4.jpg');
  await page.screenshot({path: './screenshots/addalbum_desert.png'});
  await Promise.all([
    page.waitForNavigation(),
    page.click('#submit')
  ]);
  await page.type('#searchalbum', 'album_desert');
  await Promise.all([
    page.waitForNavigation(),
    page.click('#btnsearch')
  ]);
  await page.screenshot({path: './screenshots/album_desert.png'});
}


// supprime un album avec une proba 1/10
if(getRandomArbitrary(1, 11)==1){
//l'utilisateur retourne à la page d'accueil
await page.goto('http://12.0.0.2:3000/');
//il choisit un autre album
await page.type('#searchalbum', 'album_montagne');
await Promise.all([
  page.waitForNavigation(),
  page.click('#btnsearch')
]);
await page.screenshot({path: './screenshots/album_montagne.png'});
await page.click('#delete');
await page.type('#searchalbum', 'album_montagne');
await Promise.all([
  page.waitForNavigation(),
  page.click('#btnsearch')
]);
await page.screenshot({path: './screenshots/album_not_found.png'});
}

if(getRandomArbitrary(1, 11)!=1 || getRandomArbitrary(1, 11)!=2){
  await page.goto('http://12.0.0.2:3000/');
  await page.screenshot({path: './screenshots/accueil.png'});

  await page.type('#searchalbum', 'album_mer');

  await Promise.all([
    page.waitForNavigation(),
    page.click('#btnsearch')
  ]);
  await page.screenshot({path: './screenshots/album_mer.png'});

  await page.click('#img3');
  await page.screenshot({path: './screenshots/img3.png'});
}
*/
setTimeout(async function () {
    await browser.close();
    console.log('timeout completed');
}, 3000);


})();
