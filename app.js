const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('common'));

const apps = require('./playstore.js');

app.get('/apps', (req, res) => {
    const { sort, genres } = req.query;

    if (sort) {
        if (!['Rating', 'App'].includes(sort))
        return res
            .status(400)
            .send('Sort must be one of rating or app');
    }

    if (!sort) {
        return res
            .status(400)
            .send('Please provide a sort value.');
    }

    if (genres) {
            if (!['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'].includes(genres))
                return res
                    .status(400)
                    .send('Genre must be Action, Puzzle, Strategy, Casual, Arcade, or Card.');
        }

    let results = genres  
        ? apps.filter(app =>
            app
                .Genres
                .includes(genres))
        : apps;
    
    if (sort === 'App') {
        results.sort((a,b) => {
            let appA = a.App.toLowerCase();
            let appB = b.App.toLowerCase();
            return appA > appB ? 1
            : appA < appB ? -1 : 0
        });
    }

    if (sort === 'Rating') {
        results.sort((a,b) => {
            return b.Rating - a.Rating
        });
    }

    res
        .json(results);
});


app.listen(8000, () => {
    console.log('Server started on PORT 8000.')
});