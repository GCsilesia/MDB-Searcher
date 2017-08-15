(function(appContainerId) {

/* VIEWS */

	/**
	 * Application View Object.
	 * @constructor
	 * @param {string} appContainerId - Aplication container ID.
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

	var appObject = new AppObject(appContainerId);
})('app');