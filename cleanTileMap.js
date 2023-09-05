// Remove unessary and info tiles from the tilemap

// get file path as first argument
const filePath = process.argv[2];

const clone = (obj) => JSON.parse(JSON.stringify(obj));
const filter = (arr) => arr.filter((x) => x !== -1);

// read file
var fs = require("fs");

fs.readFile(filePath, "utf8", function (err, data) {
  if (err) {
    return console.log(err);
  }

  // parse json
  const tilemap = JSON.parse(data);
  const newTilemap = { layers: [] };

  // loop through layers
  for (const layer in tilemap.layers) {
    const newLayer = clone(tilemap.layers[layer]);
    delete newLayer.number;
    newLayer.tiles = [];
    // loop through rows
    for (const row in tilemap.layers[layer].tiles) {
      const t = tilemap.layers[layer].tiles[row];
      if (Array.isArray(t)) {
        console.log("Error: tilemap is already cleaned");
        process.exit(1);
      }
      if (t.tile === -1) {
        continue;
      }
      const newTile = [
        t.tile,
        t.x,
        t.y,
        t.rot ? t.rot : -1,
        // t.flipX === false ? -1 : t.flipX,
      ];
      newLayer.tiles.push(filter(newTile));
    }
    // add layer to new tilemap
    newTilemap.layers[layer] = newLayer;
  }

  // write new tilemap

  console.log(JSON.stringify(newTilemap));
  fs.writeFile(filePath, JSON.stringify(newTilemap), function (err) {
    if (err) return console.log(err);
    console.log("Cleaned tilemap");
  });
});
