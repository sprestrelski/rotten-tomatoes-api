const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()
app.use('/favicon.ico', express.static('src/favicon.ico'));

const targets = [
    {
        name: 'search',
        address: 'https://www.rottentomatoes.com/search?search=',
        base: '',
    }
]


app.get('/', (req, res) => {
    res.json('Try /search/movies/monty python')
})

app.get('/search', (req, res) => {
    res.json('Try /search/movies/monty python')
})

app.get('/search/movies/:movieId', (req, res) => {
    const movieId = req.params.movieId;
    const movieAddress = targets.filter(target => target.name == "search")[0].address
        + movieId;

    axios.get(movieAddress)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            const movieResults = [];
            const filtered = $(`search-page-result[type='movie']`);
            $(`search-page-media-row`, filtered).each(function () {
                const title = $(this).text().trim();
                const pageLink = $(this).children(`.unset`)[0].attribs.href;
                let imgLink = $($(this).children(`.unset`)[0]).children()[0].attribs.src;
                imgLink = imgLink.split('/v2/')[1];
                const cast = $(this).attr('cast');
                const tmscore = $(this).attr('tomatometerscore');
                movieResults.push({
                    title: title,
                    cast: cast,
                    tomatometerscore: tmscore,
                    pageLink: pageLink,
                    imgLink: imgLink,
                });
            })


            res.json(movieResults);
        }).catch(err => console.log(err))
})

app.get('/search/shows/:showId', (req, res) => {
    const showId = req.params.showId;
    const showAddress = targets.filter(target => target.name == "search")[0].address
        + showId;

    axios.get(showAddress)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            const showResults = [];
            const filtered = $(`search-page-result[type='tvSeries']`);
            $(`search-page-media-row`, filtered).each(function () {
                const title = $(this).text().trim();
                const pageLink = $(this).children(`.unset`)[0].attribs.href;
                let imgLink = $($(this).children(`.unset`)[0]).children()[0].attribs.src;
                imgLink = imgLink.split('/v2/')[1];
                const cast = $(this).attr('cast');
                const tmscore = $(this).attr('tomatometerscore');
                showResults.push({
                    title: title,
                    cast: cast,
                    tomatometerscore: tmscore,
                    pageLink: pageLink,
                    imgLink: imgLink,
                });
            })


            res.json(showResults);
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))