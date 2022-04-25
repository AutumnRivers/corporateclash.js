# CorporateClash.JS
Node.JS module to read Toontown: Corporate Clash's [public API](https://github.com/CorporateClash/api-docs).

---

## Installing:
`yarn add corporateclash` - Yarn recommended, though npm works too: `npm install corporateclash`

`corporateclash` has ZERO dependencies, using only built-in modules, making it VERY lightweight. Specifically, it uses the `https` module. Make sure if you're building a local copy of Node, you build with that!

---

## Usage:
### Districts
Recommended call:  
```js
const Districts = require('corporateclash/districts');
```

Alternative call:
```js
const { Districts } = require('corporateclash');
```

Usage:
```js
const districts = new Districts();

// Districts need to have the raw district entries retrieved before you can use programmer-friendly versions.
// Since everything is a promise, we'll use an async function to do our dirty work.
const parseDistricts = async () => {
    // If you want the raw data, you can assign this to a variable. You won't be able to update individual entries, however.
    await districts.getDistricts();

    // Running this "parses" the districts into more human-friendly format better suited for code, while also allowing you to update and get info of each district individually.
    const parsedDistricts = await districts.updateDistricts();

    // For example, if you wanted to update the (local) population:
    parsedDistricts[0].updatePopulation = 200; // You would actually use a value retrieved from the API here, but whatever.

    // If, for some reason, your district details were super outdated, you can update them, as well.
    const newDistrictDetails = {
        name: 'Corporate Clash Canyon',
        online: true,
        population: 1337,
        last_update: Date.now(),
        thisWillBeIgnored: "Hello, Madi!"
    };

    // Update the details. Any external info will simply be ignored
    parsedDistricts[0].details = newDistrictDetails;

    // You can also get the details of the current invasion
    console.log(parsedDistricts[0].currentInvasion);

    // And if you need to update the invasion details...
    parsedDistricts[0].updateInvasion(true, 'Shyster', 1234, 4321, 60000);

    // And that's all for districts! Relatively easy to use when you understand their format.
    console.log(parsedDistricts);
}
```

### News
Recommended call: 
```js
const News = require('corporateclash/news');
```

Alternative call:
```js
const { News } = require('corporateclash');
```

Usage:
```js
const news = new News();

// News entries work *very* similar to Districts. There's no modification, however, and typically you'll want the whole object.
// Do note that the public API only shows the LAST FIVE ENTRIES. No, I don't know why.
// Again, promises. Async to the rescue!
const parseNews = async () => {
    // This returns and stores the raw data from the API. This is fine for the most part, so you can probably just use this.
    const rawEntries = await news.getEntries();

    // However, we can also parse the entries to use JS standards (like changing image_url -> image) and parse the URL to the entry for you!
    const parsedEntries = await news.parseEntries();

    // You can't change details about a news entry, since they are static. If you got wrong info on an entry, you'll just have to retry.
    // You also can't get individual details for the most part, but you can get the URL of an entry!
    console.log(parsedEntries[0].entryURL);

    // And that's all for the news. Simple enough, right?
    console.log(parsedEntries);
}
```