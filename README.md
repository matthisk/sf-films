# sf-films
Film Locations in SF

## Geocoding

The input dataset has location information which lacks Geocoding (i.e. latitude and longitude information). To enrich the original dataset with this information there is a management command. But before the database can be enriched it rows have to be stored as objects instead of arrays (with the column names as properties). For this operation there is also a management command:

```
node bin/index.js columnize -i INPUT_DB -o OUTPUT_DB
```

Now this database can be transformed into a geocoded database by the following command: (For geocoding you need the environment variable ``GAPPS_KEY`` with your google apps key)

```
node bin/index.js geocode -i INPUT_DB -o OUTPUT_DB
```

The repository already has a geocoded database in ``data/db.json``

## Running

To start the application use the following package.json command:

```
npm run start
```

## Development

The codebase is written in ES6 JavaScript to compile this down to ES5 use the following package.json command:

```
npm run watch
```

To build the frontend application with Webpack run:

```
webpack --watch
```

