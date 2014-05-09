//Main View - display logo, screenshots, and navigation buttons
CardSort.views.MainView = Ext.extend(Ext.Panel, {

	initComponent: function(){
		// Intialize page elements
		var toolbarMain, sortButton, sortButtonContent, logoContainer, ssContainer, tsContainer, csContainer, vrContainer, takeButton, takeButtonContent, createButton, createButtonContent, 
				buttonPanel, viewButton, viewButtonContent, getstartedButton, simplePanel, takePanel, createPanel, viewResultsPanel

		// WISC CARD SORT LOGO
        logoContainer = {
			xtype: 'container',
			html: '<img src="img/LOGO.png" class="main-img" alt="CardSort Logo" />'
        }

        // Simple Sort Screenshot
        ssContainer = {
            xtype: 'container',
            html: '<img src="img/simpleSort.png" class="screenShot-img" alt="Simple Sort Screenshot" />'
        }

        // Take Survey Screenshot
        tsContainer = {
            xtype: 'container',
            html: '<img src="img/takeSurvey.png" class="screenShot-img" alt="Take Survey Screenshot" />'
        }

        // Create Survey Screenshot
        csContainer = {
        xtype: 'container',
        html: '<img src="img/createSurvey.png" class="screenShot-img" alt="Create Survey Screenshot" />'
        }

        // View Results Screenshot
        vrContainer = {
        xtype: 'container',
        html: '<img src="img/viewResults.png" class="screenShot-img" alt="View Results Screenshot" />'
        }

		sortButton = {
		    xtype: 'button',
			text: 'Simple Sort',
			ui: 'round',
			cls: 'mainButtons',
            pressedCls: 'main-button-pressed',
			handler: function(){
				switchPanel(simplePanel);
			}
		};
		
		sortButtonContent = {
		    xtype: 'button',
			text: 'Simple Sort',
			ui: 'confirm-round',
            height: 50,
			cls: 'contentButtons',
			dock: 'bottom',
			handler: function(){
			    Ext.dispatch({
					controller: 'Main',
					action: 'sort',
					historyUrl: 'Main/sort'
				});
			}
		};

		takeButton = {
			xtype: 'button',
			text: 'Take Survey',
			ui: 'round',
			cls: 'mainButtons',
			pressedCls: 'main-button-pressed',
            handler: function(){
				switchPanel(takePanel);
			}
		};
		
		takeButtonContent = {
			xtype: 'button',
			text: 'Take Survey',
			ui: 'confirm-round',
			height: 50,
			cls: 'contentButtons',
			dock: 'bottom',
			handler: function(){
				Ext.dispatch({
					controller: 'Main',
					action: 'take',
					historyUrl: 'Main/take'
				});
			}
		};

		createButton = {
			xtype: 'button',
			text: 'Create Survey',
			ui: 'round',
			cls: 'mainButtons',
			pressedCls: 'main-button-pressed',
            handler: function(){
				switchPanel(createPanel);
			}
		};
		
		createButtonContent = {
			xtype: 'button',
			text: 'Create Survey',
			ui: 'confirm-round',
			height: 50,
			cls: 'contentButtons',
			dock: 'bottom',
			handler: function(){
				Ext.dispatch({
					controller: 'Main',
					action: 'create',
					historyUrl: 'Main/create'
				});
			}
		};
		
		viewButton = {
			xtype: 'button',
			text: 'View Results',
			ui: 'round',
			cls: 'mainButtons',
			pressedCls: 'main-button-pressed',
			handler: function(){
				switchPanel(viewResultsPanel);
			}
		};
		
		
		viewButtonContent = {
			xtype: 'button',
			text: 'View Results',
			ui: 'confirm-round',
			height: 50,
			cls: 'contentButtons',
			dock: 'bottom',
			handler: function(){
				Ext.dispatch({
					controller: 'Main',
					action: 'results',
					historyUrl: 'Main/view'
				});
			}
		};
		
			
		//left button panel
		buttonPanel = new Ext.Panel({
			dock: 'left',
			
			//change are button panel calss to mainPanel
			cls: 'buttonPanel',
			
			//remove number will be handlered by css
			layout: {type: 'vbox'},
			//renderTo:'buttonPanel',
			dockedItems: [sortButton, takeButton, createButton, viewButton]

		});
		
		// MAIN PAGE LOAD (This page describes what Card Sorting is)
		loadPanel = new Ext.Panel({

			cls: 'mainPanels',
			hidden: false,

			items: [logoContainer, { xtype: 'panel', cls: 'loadTextMain', html: 'Card sorting is a technique used by many designers, and usability specialists.  They use this method as an input to structure websites.<br/><br/>This application will allow users to perform usability testing to help improve the navigational structure, menu structure, or navigation paths of a web site.  It will allow for surveys to be created, conducted, and analyzed.  Card sorting may not provide you with final structure, but it can help you answer many questions you will need to tackle throughout the design phase.<br/><br/>It is a reliable and inexpensive method for finding patterns on how users would expect to find content.  By understanding the way users view data through statistics, we can increase the chances of making a website easier to use.<br/><br/>Select from the options on the left to continue.'}]

		});


    // Content Panels "MAIN"
        // SIMPLE SORT
		simplePanel = new Ext.Panel({
			cls: 'mainPanels',
			hidden: true,
			items:[ssContainer, {xtype: 'panel', cls: 'loadText', html: 'Participants are given a blank slate to create cards and categories on the fly.  They are asked to sort cards into groups or categories that they feel are appropriate.  Simple card sorting is useful as input to information structures in new or existing sites.  Tap the button below to continue.'}, sortButtonContent]
		});
		
		// TAKE SURVEY
		takePanel = new Ext.Panel({
			cls: 'mainPanels',
			hidden: true,
			items:[tsContainer, {xtype: 'panel', cls: 'loadText', html: 'Participants are given cards showing site content with an initial set of categories.  They are asked to place cards into these pre-established primary groups.  Pre-created sorts are useful when adding new content to an existing design or site, or for gaining additional feedback after a simple card sort.  Tap the button below to continue.'}, takeButtonContent]
		});
		
		// CREATE SURVEY
		createPanel = new Ext.Panel({
			cls: 'mainPanels',
			hidden: true,
			items: [csContainer, { xtype: 'panel', cls: 'loadText', html: 'Create a survey by choosing a name, password, and a number of categories and cards.  You can also enable or disable whether or not you would like to allow the demographics form to be displayed prior to the participant conducting the survey.  Tap the button below to continue.' }, createButtonContent]
		});
		
		// VIEW RESULTS
		viewResultsPanel = new Ext.Panel({
			cls: 'mainPanels',
			hidden: true,
			items: [vrContainer, { xtype: 'panel', cls: 'loadText', html: 'View the statistics of completed sorts from the participants. You have the option to narrow down results with filters to add or remove data from specific demographic fields.  Tap the button below to continue.' }, viewButtonContent]
		});
		
		
		// Set visible panel
		function switchPanel(activePanel) {
		console.log("URL " + CardSort.webserviceURL);
		console.log(CardSort.code);
		loadPanel.setVisible(false);
		simplePanel.setVisible(false);
		takePanel.setVisible(false);
		createPanel.setVisible(false);
		viewResultsPanel.setVisible(false);
		//gettingStartedPanel.setVisible(false);
		
		activePanel.setVisible(true);
		activePanel.setDocked('left', this)
		//activePanel.Panel.doLayout();

		};
		
		
		Ext.apply(this, {
			dockedItems:[ buttonPanel, loadPanel, simplePanel, takePanel, viewResultsPanel, createPanel]
		});
	
		CardSort.views.MainView.superclass.initComponent.call(this);
	}

});
Ext.reg('MainView', CardSort.views.MainView);

