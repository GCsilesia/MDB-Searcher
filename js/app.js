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
	}

	var appObject = new AppObject(appContainerId);
	var searchObject = new SearchObject(appObject);
})('app');