async function fetchMovieData(imdbID) {
    const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`);
    return await response.json();
}

document.getElementById('movieSearch').addEventListener('input', async function() {
    const query = this.value;
    if (query.length < 3) {
        document.getElementById('suggestions').innerHTML = '';
        return;
    }

    const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`);
    const data = await response.json();

    if (data.Response === 'True') {
        const movies = data.Search;
        const suggestions = movies.map(movie => `
            <div class="max-w-sm rounded overflow-hidden shadow-lg cursor-pointer" onclick="selectMovie('${movie.imdbID}', '${movie.Title}')">
                <img class="w-full" src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150'}" alt="${movie.Title}">
                <div class="px-6 py-4">
                    <div class="font-bold text-xl mb-2">${movie.Title}</div>
                    <p class="text-gray-700 text-base">${movie.Year}</p>
                </div>
            </div>
        `).join('');
        document.getElementById('suggestions').innerHTML = suggestions;
    } else {
        document.getElementById('suggestions').innerHTML = '<div class="p-2">No results found</div>';
    }
});

function selectMovie(imdbID, title) {
    window.history.pushState({}, title, `?id=${imdbID}&title=${title}`);
    loadMovieDetails(imdbID);
}

async function loadMovieDetails(imdbID) {
    document.getElementById('movieSearch').style.display = 'none';
    document.getElementById('suggestions').style.display = 'none';
    document.getElementById('movieDetailsContainer').style.display = 'block';
    
    const movie = await fetchMovieData(imdbID);

    // Fill in movie details
    document.getElementById('movieTitle').innerText = movie.Title;
    document.getElementById('moviePoster').src = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300';
    document.getElementById('movieYear').innerText = `Year: ${movie.Year}`;
    document.getElementById('movieRated').innerText = `Rated: ${movie.Rated}`;
    document.getElementById('movieReleased').innerText = `Released: ${movie.Released}`;
    document.getElementById('movieRuntime').innerText = `Runtime: ${movie.Runtime}`;
    document.getElementById('movieGenre').innerText = `Genre: ${movie.Genre}`;
    document.getElementById('movieDirector').innerText = `Director: ${movie.Director}`;
    document.getElementById('movieWriter').innerText = `Writer: ${movie.Writer}`;
    document.getElementById('movieActors').innerText = `Actors: ${movie.Actors}`;
    document.getElementById('moviePlot').innerText = `Plot: ${movie.Plot}`;
    document.getElementById('movieLanguage').innerText = `Language: ${movie.Language}`;
    document.getElementById('movieCountry').innerText = `Country: ${movie.Country}`;
    document.getElementById('movieAwards').innerText = `Awards: ${movie.Awards}`;
    document.getElementById('movieImdbRating').innerText = `IMDB Rating: ${movie.imdbRating}`;
    document.getElementById('movieImdbVotes').innerText = `IMDB Votes: ${movie.imdbVotes}`;
    document.getElementById('movieBoxOffice').innerText = `Box Office: ${movie.BoxOffice}`;
    document.getElementById('movieProduction').innerText = `Production: ${movie.Production}`;
    document.getElementById('movieWebsite').innerHTML = `Website: <a href="${movie.Website}" target="_blank">${movie.Website}</a>`;
}

window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const imdbID = urlParams.get('id');
    if (imdbID) {
        loadMovieDetails(imdbID);
    }
}
