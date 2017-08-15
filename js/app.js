(function(appContainerId) {

/* VIEWS */

	/**
	 * Application View Object.
	 * @constructor
	 * @param {String} appContainerId - Aplication container ID.
	 */

	function AppObject(appContainerId) {
		var	app = document.getElementById(appContainerId),
			view = document.createElement('div'),
			info = document.createElement('div');
		
		view.id = "view";
		view.classList.add("view");
		app.appendChild(view);	
		
		info.id = "info";
		info.classList.add("info");
		app.appendChild(info);	

		this.view = view;
		this.info = info;
		this.app = app;	
	}

	/**
	 * Search View Object.
	 * @constructor
	 * @param {AppObject} app - Application View Object to append.
	 */

	function SearchObject(app) {
		var	searcher, view = app.view;

		searcher = document.createElement('input');
		searcher.type = "text";
		searcher.id = "searcher";
		searcher.classList.add("searcher");
		searcher.setAttribute("placeholder","Search");
		
		view.appendChild(searcher);

		this.node = searcher; 
		this.event = 'keyup';
	}

	/**
	 * Result View Object.
	 * @constructor
	 * @param {AppObject} app - Application View Object to append.
	 */

	function ResultObject(app) {
		var	result, view = app.view;

		result = document.createElement('div');
		result.id = "result";
		
		view.appendChild(result);

		this.appender = result;

		/** this.makeContainer - is creating container for results. */

		this.makeContainer = function() {
			var containerObj = document.createElement('ul');
			containerObj.classList.add("films");
			return containerObj;
		},

		/** this.makeResult - is creating every result. */

		this.makeResult = function(film) {
			var picture = film.backdrop_path,
			title = film.title,
			date = new Date(film.release_date),
			resultObj, pictureObj, titleObj, imagePath;

			resultObj = document.createElement('li');
			resultObj.classList.add("film");
			
			titleObj = document.createElement('span');
			titleObj.innerHTML = title + ' (' + date.getFullYear() + ')';
			titleObj.classList.add("film-title");

			imagePath = 'https://image.tmdb.org/t/p/w500';
			
			if (picture) {
				pictureObj = document.createElement('img');
				pictureObj.setAttribute('src',imagePath + picture);
				resultObj.appendChild(pictureObj);
			} else {
				titleObj.classList.add("non-image");			
			}

			resultObj.appendChild(titleObj);		

			return resultObj;
		}
	}

	/**
	 * Info View Object.
	 * @constructor
	 * @param {AppObject} app - Application View Object to append.
	 */

	function InfoObject(app) {
		var	info = app.info,
			poster = document.createElement('div'),
			content = document.createElement('div');

		poster.id = "poster";
		poster.classList.add("poster");
		info.appendChild(poster);	

		content.id = "content";
		content.classList.add("content");
		info.appendChild(content);	

		this.posterContainer = poster; 

		this.contentContainer = content;

		/** print - creating a output on current film. 
		 * 	@param {arrayOfFilms} films - Array of films returned from MDB.
		 * 	@param {integer} index - Index of cLicked element.
		 */

		this.print = function(films,index) {
			var film = films[index],
				title =  film.title,
				id = film.id,
				poster = film.poster_path,
				date = new Date(film.release_date),
				overview = film.overview,
				posterObj, titleObj, overviewObj;

				this.posterContainer.innerHTML = '';

				if (poster) {
					posterObj  = document.createElement('img');
					posterObj.setAttribute('src','https://image.tmdb.org/t/p/w500'+ poster)

					this.posterContainer.appendChild(posterObj);
				}

				titleObj = document.createElement('h2');
				titleObj.classList.add("info-film-title");
				titleObj.innerHTML = title + ' (' + date.getFullYear() + ')';
				
				overviewObj = document.createElement('p');
				overviewObj.classList.add("info-film-overview");
				overviewObj.innerHTML = overview;

				this.contentContainer.innerHTML = '';

				this.contentContainer.appendChild(titleObj);
				this.contentContainer.appendChild(overviewObj);
		}
	}

/* CONTROLERS */

	/**
	 * ResultPrinter.
	 * @constructor
	 * @param {ResultObject} printObj - Result Object to print results.
	 * @param {InfoObject} infoObject - Info Object to print clicked result info.
	 */

	function ResultPrinter(printObj,infoObj) {
		var node = printObj.appender || null,
			currentFilm = -1,
			films = false,
			setFilms = function(insertFilms) {
				films = insertFilms || false;
			}

		this.print = function(insertFilms) {
			setFilms(insertFilms);
			if (node && films) {
				var i,li,ul,id;

				ul = printObj.makeContainer();

				for (i=0; i<films.length; i++) {
					li = printObj.makeResult(films[i]);
					li.setAttribute('data-id', i );
					li.addEventListener('click', function(){
						currentFilm = this.getAttribute('data-id')
						infoObj.print(films,currentFilm);
					});
					ul.appendChild(li);
				}
				node.innerHTML = '';
				node.appendChild(ul);
			}
		}
	}

	/**
	 * Responder.
	 * @constructor
	 * @param {function} writeResult - Call back function to print a response.
	 */

	function Responder(writeResult) {
		var apiUrl ='https://api.themoviedb.org/3/search/movie',
			apiKey = '3ec8025c2bdce32374786f4f443882d6',
			printer =  writeResult,
			films = [];

		this.respond = function(e) {
			var searchValue = e.target.value;
			if (searchValue) {
				var xhttp, 
					url = apiUrl + "?api_key=" + apiKey + "&query=" + searchValue;
	     		xhttp=new XMLHttpRequest();
				xhttp.onreadystatechange = function() {
				    if (this.readyState == 4 && this.status == 200) {
				       	films = JSON.parse(this.responseText).results;
						printer(films);
				    }
				};
				xhttp.open("GET", url, true);
				xhttp.send();
			} else {
				films = [];
				printer(films);
			}
		}
	}

	/**
	 * Searcher.
	 * @constructor
	 * @param {SearchObject} searchObj - Search Object to bind search node, and proper event.
	 * @param {function} callBack - Function Launched on event started.
	 */

	function Searcher(searchObj,callBack) {
		var node = (searchObj.node && searchObj.node.nodeType === 1) ? searchObj.node : null, 
			events = ['keyup','keydown','keypress','change','click','blur','focus'],
			event = (events.filter(function(e) { return e === searchObj.event}).length===1) ? searchObj.event : 'keyup',
			callBack = callBack || function() {
				console.info('Searcher callBack function')
			};
		this.search = function() {
			if (node) {
				node.addEventListener(event, callBack);
			}
		}
	}

	var appObject = new AppObject(appContainerId);
	var searchObject = new SearchObject(appObject);
	var resultObject = new ResultObject(appObject);
	var infoObject = new InfoObject(appObject);

	var resultprinter = new ResultPrinter(resultObject,infoObject);
	var responder = new Responder(resultprinter.print);
	var searcher = new Searcher(searchObject,responder.respond);
	searcher.search();

})('app');