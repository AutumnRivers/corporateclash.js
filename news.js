const https = require('https');
const api = 'https://corporateclash.net/api/v1/'; // Subject to change in the future...? Yell at me if this breaks

/**
 * Creates new News entry.
 * 
 * @class
 */
class NewsEntry {
    /** @lends NewsEntry.prototype */
    constructor(entry) {
        /** @constructs */
        this.id = entry.id || 0;
        this.author = entry.author || 'Unknown';
        this.posted = entry.posted || 0;
        this.image = entry.image_url || 'https://sitecdn.corporateclash.net/logo1.1/icon-focused-300x300.png';
        this.title = entry.title || 'Unknown';
        this.summary = entry.summary || "A very special news entry... though we don't know what it's about!";
        this.category = entry.category || 'Unknown';
        this.url = `https://corporateclash.net/news/article/${this.id || 3}`;
    }

    // News entries are static, so there's nothing to update with them. We will, however, set up a getter for the URL!
    /**
     * Returns the URL to the news entry.
     * 
     * @returns {string} URL to news entry
     */
    get entryURL() {
        return this.url;
    }
}

/**
 * Base class for getting news entries
 * 
 * @class
 */
class News {
    /** @lends News.prototype */
    constructor(customUserAgent) {
        /** @constructs */
        this.rawList = [];
        this.newsList = [];
        this.agent = customUserAgent || "CorporateClash.JS/1.0.1";
    }

    /**
     * Gets the current news entries from the Corporate Clash API.
     * 
     * @returns {Promise<Object[]>} Array of news entries from Corporate Clash's API.
     */
    getEntries = () => {
        const newsURL = api + 'launcher/news';

        this.rawList = [];
        let entries = '';

        return new Promise(resolve => {
            https.get(newsURL, {
                headers: {
                    'User-Agent': this.agent
                }
            }, res => {
                res.on('data', data => {
                    entries += data;
                });

                res.on('end', () => {
                    if(!res.complete) throw new Error("Couldn't complete call to News API. Is Corporate Clash online?");

                    this.rawList = JSON.parse(entries);
                    resolve(this.rawList);
                });
            });
        });
    }

    /**
     * Parses the raw entries into programmer-friendly array.
     * 
     * @returns {Promise<NewsEntry[]>} Array of programmer-friendly news entries
     */
    parseEntries = () => {
        this.newsList = [];

        return new Promise(resolve => {
            for(const entry of this.rawList) {
                this.newsList.push(new NewsEntry(entry));
            }

            resolve(this.newsList);
        })
    }
}

module.exports = News;