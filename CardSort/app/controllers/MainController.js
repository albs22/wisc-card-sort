Ext.regController('Main', {
 
    // index action tests if current page is index if not render index page
    index: function()
    {
      //console.log('IntialLoad ' + CardSort.intialLoad);
      /* iPad only 
          //hide splach screen
        navigator.splashscreen.hide();
         // console.log('Network Test');
          
        if(CardSort.intialLoad == true || CardSort.intialLoad == undefined)
        {
             CardSort.intialLoad = false;
           
          //check network status using phonehap api
          var networkState = navigator.network.connection.type;
          
          var states = {};
          states[Connection.UNKNOWN]  = 'Unknown Conected';
          states[Connection.ETHERNET] = 'Ethernet Conected';
          states[Connection.WIFI]     = 'WiFi Conected';
          states[Connection.CELL_2G]  = 'Cell 2G Conected';
          states[Connection.CELL_3G]  = 'Cell 3G Conected';
          states[Connection.CELL_4G]  = 'Cell 4G Conected';
          states[Connection.NONE]     = 'No network connection';
          
          if(states[networkState] == 'No network connection' || states[networkState] == 'Unknown Conected' )
          {
            Ext.Msg.alert('Connection Status', 'No network connection available only Simple Sort available'); 
            Ext.Msg.doComponentLayout();                  
          }
          else
          {
              //alert('Connection type: ' + states[networkState]);      
              Ext.Msg.alert('Connection Status', states[networkState]);
              Ext.Msg.doComponentLayout();
              Ext.Msg.doComponentLayout();  
          }
          
        }
		*/
                  
        
		Ext.Msg.doComponentLayout();
		if ( ! this.indexView)
        {
            this.indexView = this.render({
                xtype: 'MainView',
            });
        }
		
		 this.application.viewport.setActiveItem(this.indexView)
	
    },
	
	
	// sort button action tests if current page is sprtview if not render sortview page
	// and create back button with handler
    sort: function()
	{
        //prevents the page from being rerenderd when re-entered to preserve categories and cards
        if ( ! this.sortView)
        {
            this.sortView = this.render({
                xtype: 'SortView',
            });
      }
		
	  this.application.viewport.setActiveItem(this.sortView);
	},
	
    //Render and display create view
	create: function()
	{
            this.createView = this.render({
                    xtype: 'CreateView',
            });
        
		this.application.viewport.setActiveItem(this.createView);
	},
	
    //Render and display take view
	take: function()
	{
		
        Ext.Msg.prompt('Take Survery', 'Enter Survey Code:', function(button, value){
            if(button == 'ok' && value != ''){
					
                //set CardSort.code to value entered in msg prompt
                CardSort.code = value;
                
                this.takeView = this.render({
                    xtype: 'TakeView',
                    });
                    
                this.application.viewport.setActiveItem(this.takeView);
					
            }
			//sencha bug: need to resize prompt to fit all components. does not work on first call
			Ext.Msg.doComponentLayout();
			// this - fixes scope issue inside Ext.msg.prompt
			}, this, false, '', {maxlength: 5} );
	},
	
	
	results: function()
	{
		Ext.Msg.prompt('View Results', 'Enter Survey Code:', function(button, value){
			if(button == 'ok'){
                //set CardSort.code to value entered in msg prompt
				CardSort.code = value;
                
				this.resultsView = this.render({
					xtype: 'ResultsView',
				});
		
				this.application.viewport.setActiveItem(this.resultsView);
			}
		Ext.Msg.doComponentLayout();
		// this - fixes scope issue inside Ext.msg.prompt
		}, this, false, '', {maxlength: 5} );
	},
	
});