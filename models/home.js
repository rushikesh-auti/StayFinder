//core module
const fs = require('fs');
const path = require('path');
const rootDir = require('../utils/pathUtil');
const { error, log } = require('console');

// fake DB
let registeredHomes = [];

module.exports = class Home {
  constructor(houseName, price, location, rating, photoUrl) {
    this.houseName = houseName;
    this.price = price;
    this.location = location;
    this.rating = rating;
    this.photoUrl = photoUrl;
  };

  save() {
    Home.fetchAll((registeredHomes) => {
      registeredHomes.push(this);
      const homeDataPath = path.join(rootDir, 'data', 'homes.json');
      fs.writeFile(homeDataPath, JSON.stringify(registeredHomes), error => {
        if (error) {
          console.log("file writing error: ", error);
        }
      });
    });
  };

  static fetchAll(callback) {
    const homeDataPath = path.join(rootDir, 'data', 'homes.json');
    fs.readFile(homeDataPath, (err, data) => {
      callback(!err ? JSON.parse(data) : []);
    });
  };

  static findById(homeId, callback) {
    this.fetchAll(homes => {
      const homeFound = homes.find(home => home.id === homeId);
      callback(homeFound);
    })
  }
};

