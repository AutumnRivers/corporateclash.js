const https = require('https');
const api = 'https://corporateclash.net/api/v1/'; // Subject to change in the future...? Yell at me if this breaks

/**
 * The object used for invasion details
 * @typedef {{ invaded: boolean, invadingCog: (string|undefined), cogsDefeated: (number|boolean), remainingCogs: number, remainingTime: number }} DistrictInvasion
 */

/**
 * Basic details for a district
 * @typedef {{ name: string; online: boolean; population: number; last_update: number; }} DistrictDetails
 */

/**
 * Creates new district.
 * 
 * @class
 */
class District {
    /** @lends District.prototype */
    constructor(district) {
        /** @constructs */
        this.name = district.name || 'Unknown District';
        this.online = district.online || false;
        this.population = district.population || -1;
        this.lastUpdated = district.last_update || 0;
        this.invasion = {
            invaded: district.invasion_online || false,
            invadingCog: district.cogs_attacking != 'None' ? district.cogs_attacking : undefined,
            cogsDefeated: district.count_defeated || false,
            remainingCogs: district.count_total || 0,
            remainingTime: district.remaining_time || -1
        }
    }

    /**
     * Returns invasion details, if any
     * 
     * @returns {DistrictInvasion} The invasion object.
     */
    get currentInvasion() {
        return this.invasion;
    }

    /**
     * Updates basic details for the district. Typically, this should never be used unless some details are REALLY broken.
     * 
     * @param {DistrictDetails} districtObject An object containing district details
     * @returns {(void|boolean)} Returns false if the district object isn't an object. Otherwise, nothing gets returned.
     */
    set details (districtObject) { // Does not update invasion details
        if(typeof districtObject != 'object') return false;

        this.name = districtObject.name;
        this.online = districtObject.online;
        this.population = districtObject.population;
        this.lastUpdated = districtObject.last_update;
    }

    /**
     * Updates the population for the district. Use this when updating details, cause this is all you really need 99% of the time!
     * 
     * @param {number} newPopulation Number containing new district population
     * @returns {(void|boolean)} Returns false if newPopulation isn't a whole number. Otherwise, nothing gets returned.
     */
    set updatePopulation(newPopulation) {
        if(typeof newPopulation != 'number') return false;

        this.population = newPopulation;
    }

    /**
     * Updates invasion details. Separate function, equal purpose. This is used more sparcingly.
     * 
     * @param {boolean} currentlyBeingInvaded Is the district currently being invaded?
     * @param {string} invadingCog Current cog invading, like "Head Honcho", if set to "None" then it'll be set to undefined
     * @param {number} cogsDefeated How many cogs have been defeated so far. If 0 or falsy, sets to false.
     * @param {number} remainingCogs How many cogs remain in the invasion?
     * @param {number} remainingTime How much time remains in the invasion? If falsy, sets to -1.
     * @returns {void}
     */
    updateInvasion = (currentlyBeingInvaded, invadingCog, cogsDefeated, remainingCogs, remainingTime) => {
        const newInvasion = {
            invaded: currentlyBeingInvaded || false,
            invadingCog: invadingCog != 'None' ? invadingCog : undefined,
            cogsDefeated: cogsDefeated || false,
            remainingCogs: remainingCogs || 0,
            remainingTime: remainingTime || -1
        }

        this.invasion = newInvasion;
    }
}

/**
 * Main class for interacting with districts.
 * 
 * @class
 */
class Districts {
    /** @lends Districts.prototype */
    constructor(customUserAgent) {
        /** @constructs */
        this.rawList = [];
        this.objList = [];
        this.agent = customUserAgent || "CorporateClash.JS/1.0.1";
    }

    /**
     * Gets the current district list from the Corporate Clash API.
     * 
     * @returns {Promise<Object[]>} Array of districts from Corporate Clash's API.
     * @readonly
     */
    getDistricts = () => {
        const districtsURL = api + 'districts.js';

        this.rawList = [];
        let districts = '';

        return new Promise(resolve => {
            https.get(districtsURL, {
                headers: {
                    'User-Agent': this.agent
                }
            }, res => {
                res.on('data', data => {
                    districts += data;
                });

                res.on('end', () => {
                    if(!res.complete) throw new Error("Couldn't complete call to Districts API. Is Corporate Clash online?");

                    this.rawList = JSON.parse(districts);
                    resolve(this.rawList);
                });
            });
        });
    }

    /**
     * Updates the current list of "built" districts
     * 
     * @returns {Promise<District[]>} Array of "built" districts made to be used in code.
     */
    updateDistricts = () => {
        this.objList = [];

        return new Promise(resolve => {
            for(const district of this.rawList) {
                this.objList.push(new District(district));
            }

            resolve(this.objList);
        })
    }
}

module.exports = Districts;