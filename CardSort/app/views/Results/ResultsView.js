//Results View
CardSort.views.ResultsView = Ext.extend(Ext.Panel, {
	initComponent: function(){
	
		var titlebarV, backButtonV, infoButtonV, surveyTitleV, dataGrid, pairValueArrayV, tableArrayV, categoryArrayV, cardArrayV, numberOfSurveysTaken,
		categoryHeaderObject, gridContainer, demoSelectContainer, stateSelectionV, citySelection, ageSelectionV, genderSelectionV, ethnicitySelectionV, 
		generateButton, demographicsEnabledV, mainPanelV
		
		//Set survey toolbar title intial value
		surveyTitleV = 'View Results';
		
		//intialize data arrays
		categoryArrayV = new Array();
		cardArrayV = new Array();
		pairValueArrayV = new Array();
		storeArray = new Array();
		categoryHeaderArray = new Array();
		
		//create, intialize, and addListener for jsopDataLoaded Event
		//gets dispatched when all data for the getSurvey request is loaded in from the webservice
		var evtV = document.createEvent('Event');
		evtV.initEvent("jsonpDataLoaded",true,true);
		document.addEventListener("jsonpDataLoaded",jsonpDataLoadedHandler,false);
		
		//create, intialize, and addListener for fact data loaded event
		//gets dispatched when all data from fact table is loaded in from the webservice
		var evtLoadFact = document.createEvent('Event');
		evtLoadFact.initEvent("factDataLoaded",true,true);
		document.addEventListener("factDataLoaded", factDataLoadedHandler,false);
		
	
	//*************************************************************
	//Begin Titlebar Components
		backButtonV = {
			xtype: 'button',
			text: 'Back',
			ui: 'back',
			handler: function(){
            
                //remove grd container
                Ext.getCmp('gridContainer').removeAll(true);
                Ext.getCmp('gridContainer').destroy();
            
                //remove event load event listeners when exiting the page to prevent duplciate events
                document.removeEventListener("factDataLoaded", factDataLoadedHandler,false);
                document.removeEventListener("jsonpDataLoaded",jsonpDataLoadedHandler,false);
                
                //reset data ararys
                categoryArrayV = [];
                cardArrayV = [];
                pairValueArrayV = [];
                storeArray = [];
                categoryHeaderArray = [];
                                        
				Ext.dispatch({
					controller: 'Main',
					action: 'index',
					historyUrl: 'Main/index'
				});
			}
		};
		
		infoButtonV = {
			iconMask: true,
			iconCls: 'info',
			handler: function(){
				//display overlay with page tutorial
				if (!this.popup) {
					this.popup = new Ext.Panel({
						floating: true,
						modal: true,
						centered: true,
						width: 300,
						height: 340,
						styleHtmlContent: true,
						html: '<p>View the statistics of completed sorts from the participants.<br/><br/><font color="green">Greater or equal to 80&#37<font/><br/><font color="orange">Between 70&#37 &amp; 79&#37<font/><br/><font color="red">Less than or equal to 69&#37<font/><br/><br/><font color="black">You have the option to narrow down the results with filters to add or remove data from specific demographic fields.<font/></p>',
						dockedItems: [{
							dock: 'top',
							xtype: 'toolbar',
							title: 'Results Info'
						}]
					});
				}
				this.popup.show('pop');
			}
		};
		
		//TODO: Share results. Email html table, sceenshot, ...
		//TODO:  share button
        
		titlebarV = new Ext.Toolbar({
			title: surveyTitleV,
			dock: 'top',
			items: [backButtonV, {xtype: 'spacer'}, infoButtonV],
		});
		
		
	//End Titlebar components
	//*************************************************************
	
    
	//*************************************************************
	//Begin Demographic selection components
    
        //add and populate demographics selections. Create generate survey button
        function addDemographicsComponents()
        {
            genderSelectionV = new Ext.form.Select({
                xtype: 'selectfield',
                value: 'Filter By Gender',
                options: [	
                            {text: 'All', 		value: ''},
                            {text: 'Male', 		value: 'Male'},
                            {text: 'Female', 	value: 'Female'}
                        ]
            });
            
            ageSelectionV = new Ext.form.Select({
                xtype: 'selectfield',
                value: 'Filter By Age',
                options: [	
                            {text: 'All',		value: ''		},
                            {text: 'Unkown', 	value: 'UNKNOWN'},
                            {text: '<10', 		value: '<10'	},
                            {text: '10-19',		value: '10 - 19'},
                            {text: '20-29',		value: '20 - 29'},
                            {text: '30-39',		value: '30 - 39'},
                            {text: '40-49',		value: '40 - 49'},
                            {text: '50-59',		value: '50 - 59'},
                            {text: '60-69',		value: '60 - 69'},
                            {text: '70-79',		value: '70 - 79'},
                            {text: '80+',		value: '80+'	},
                        ]
                });	

            ethnicitySelectionV = new Ext.form.Select({
                    xtype: 'selectfield',
                    value: 'Filter By Ethnicity',
                    options: [	
                                {text: 'All',									value: ''										},
                                {text: 'Unknown',								value: 'UNKNOWN'								},
                                {text: 'White',									value: 'White' 									},
                                {text: 'Black/African American/Negro',			value: 'Black/African American/Negro' 			},
                                {text: 'American Indian/Alaska Native',			value: 'American Indian/Alaska Native' 			},
                                {text: 'Mexican/Mexican American/Chicano',		value: 'Mexican/Mexican American/Chicano' 		},
                                {text: 'Peurto Rican',							value: 'Peurto Rican'							},
                                {text: 'Cuban',									value: 'Cuban'									},
                                {text: 'Other Hispanic/Latino/Spanish Origin',	value: 'Other Hispanic/Latino/Spanish Origin'	},
                                {text: 'Chinese',								value: 'Chinese'								},
                                {text: 'Filipino',								value: 'Filipino'								},
                                {text: 'Japanese',								value: 'Japanese'								},
                                {text: 'Korean',								value: 'Korean'									},
                                {text: 'Vietnamese',							value: 'Vietnamese'								},
                                {text: 'Other Asian Origin',					value: 'Other Asian Origin'						},
                                {text: 'Native Hawaiian',						value: 'Native Hawaiian'						},
                                {text: 'Guamanian/Chamorro',					value: 'Guamanian/Chamorro'						},
                                {text: 'Samoan',								value: 'Samoan'									},
                                {text: 'Other Pacific Islander Origin',			value: 'Other Pacific Islander Origin'			},
                                {text: 'Other Race',							value: 'Other Race'								},
                            ]
                });
            
            stateSelectionV = new Ext.form.Select({
                xtype: 'selectfield',
                value: 'Filter By State',
                options: [	
                            {text: 'All',		value: ''	},
                            {text: 'Unknown', value: 'UNKNOWN'},
                            {text: 'Alabama', value: 'Alabama'},
                            {text: 'Alaska', value: 'Alaska'},
                            {text: 'Arizona', value: 'Arizona'},
                            {text: 'Arkansas', value: 'Arkansas'},
                            {text: 'California', value: 'California'},
                            {text: 'Colorado', value: 'Colorado'},
                            {text: 'Connecticut', value: 'Connecticut'},
                            {text: 'Delaware', value: 'Delaware'},
                            {text: 'Disctrict of Columbia', value: 'District of Columbia'},
                            {text: 'Florida', value: 'Florida'},
                            {text: 'Georgia', value: 'Georgia'},
                            {text: 'Hawaii', value: 'Hawaii'},
                            {text: 'Idaho', value: 'Idaho'},
                            {text: 'Illinois', value: 'Illinois'},
                            {text: 'Indiana', value: 'Indiana'},
                            {text: 'Iowa', value: 'Iowa'},
                            {text: 'Kansas', value: 'Kansas'},
                            {text: 'Kentucky', value: 'Kentucky'},
                            {text: 'Louisiana', value: 'Louisiana'},
                            {text: 'Maine', value: 'Maine'},
                            {text: 'Maryland', value: 'Maryland'},
                            {text: 'Massachusetts', value: 'Massachusetts'},
                            {text: 'Michigan', value: 'Michigan'},
                            {text: 'Minnesota', value: 'Minnesota'},
                            {text: 'Mississippi', value: 'Mississippi'},
                            {text: 'Missouri', value: 'Missouri'},
                            {text: 'Montana', value: 'Montana'},
                            {text: 'Nebraska', value: 'Nebraska'},
                            {text: 'Nevada', value: 'Nevada'},
                            {text: 'New Hampshire', value: 'New Hampshire'},
                            {text: 'New Jersey', value: 'New Jersey'},
                            {text: 'New Mexico', value: 'New Mexico'},
                            {text: 'New York', value: 'New York'},
                            {text: 'North Carolina', value: 'North Carolina'},
                            {text: 'North Dakota', value: 'North Dakota'},
                            {text: 'Ohio', value: 'Ohio'},
                            {text: 'Oklahoma', value: 'Oklahoma'},
                            {text: 'Oregon', value: 'Oregon'},
                            {text: 'Pennsylvania', value: 'Pennsylvania'},
                            {text: 'Rhode Island', value: 'Rhode Island'},
                            {text: 'South Carolina', value: 'South Carolina'},
                            {text: 'South Dakota', value: 'South Dakota'},
                            {text: 'Tennessee', value: 'Tennessee'},
                            {text: 'Texas', value: 'Texas'},
                            {text: 'Utah', value: 'Utah'},
                            {text: 'Vermont', value: 'Vermont'},
                            {text: 'Virginia', value: 'Virginia'},
                            {text: 'Washington', value: 'Washington'},
                            {text: 'West Virginia', value: 'West Virginia'},
                            {text: 'Wisconsin', value: 'Wisconsin'},
                            {text: 'Wyoming', value: 'Wyoming'},
                        ]
            });
            
            
            //TODO: Implement city slection filter in next version
            /*
            citySelectionV = new Ext.form.Select({
            xtype: 'selectfield',
            });
            */
            
            generateButton = new Ext.Button({
                dock: 'top',
                text: 'Show Results',
                ui: 'confirm',
                width: 150,
                height: 46,
                handler: function(){
                    var gender = genderSelectionV.getValue();
                    if(gender == 'Filter By Gender')
                    {
                        gender = '';
                    }
                    var age = ageSelectionV.getValue();
                    if(age == 'Filter By Age')
                    {
                        age = '';
                    }
                    var ethnicity = ethnicitySelectionV.getValue();
                    if(ethnicity == 'Filter By Ethnicity')
                    {
                        ethnicity = '';
                    }
                    var state = stateSelectionV.getValue()
                    if(state == 'Filter By State')
                    {
                        state = '';
                    }
                    
                    resetGridContainer();
                    //submit slections to webservice
                    buildCatCardPairData(gender, age, ethnicity, state);
                }
            });
            
            demoSelectContainer = new Ext.Container({
                cls: 'demoSelectContainer',
                id: 'demoSelectContainer',
                layout:{type: 'hbox'},
                dock: 'top',
                height: 60,
                items: [genderSelectionV, ageSelectionV, ethnicitySelectionV, stateSelectionV, generateButton]
            });
                demoSelectContainer.doLayout();
                mainPanelV.addDocked(demoSelectContainer);
                mainPanelV.doLayout();
           }
		
	//End Demographic selection coponents
	//*************************************************************
	
	
	
	//*************************************************************
	//Begin build dataArray and grid functions
		//pass filter selections as parameters
		function buildCatCardPairData(gender, age, ethnicity, state) {
			var tableArrayVCount = 0;
			
			Ext.util.JSONP.request({
				url: 'http://cardsort.timkrause.info/webservice.php',
				params: {method: 'getFact', 
						code: CardSort.code,
						gender: gender,
						age: age,
						ethnicity: ethnicity,
						state: state,
						},
				callbackKey: "callback",
				callback: function(result) 
				{
					var resultsLength = result.table.length;
					//loop through result[] to create nested card and category pair array
					for(var factNum=0; factNum<result.table.length; factNum++)
					{
						//add new nested array to pairValueArrayV for each fact
						pairValueArrayV[factNum] = new Array(2);
						
						//add fact data from websevice to nested array
						pairValueArrayV[factNum][1] = result.table[factNum].row.CARD_DESC;
						pairValueArrayV[factNum][0] = result.table[factNum].row.CATEGORY_DESC;
					}
					buildStoreArray();
				}
			});
		};
		
		//creteds data formated to be added to a store to create results grid
		function buildStoreArray()
		{
			//build card row with category columns
			var rowData;
			for(var cardNum=0; cardNum<cardArrayV.length; cardNum++)
			{	
				var unknownCount = 0;
				//create rowData object
				rowData = Object();
				rowData.C0 = cardArrayV[cardNum];
					
				//if pairValue array is empty
				if(pairValueArrayV.length == 0)
				{
					for(var catNum=0; catNum<categoryArrayV.length; catNum++)
					{
						var cIndex = catNum + 1;
						rowData['C' + cIndex] = 0;
					}
				}
					
				//build cell containg count
				numberOfSurveysTaken = 0;
				for(var pairNum=0; pairNum<pairValueArrayV.length; pairNum++)
				{
					//match card array with fact table cards
					if(cardArrayV[cardNum] == pairValueArrayV[pairNum][1])
					{	
						numberOfSurveysTaken++;
						
							for(var catNum=0; catNum<categoryArrayV.length; catNum++){
								//offset by 1 to account for blank 1st column in header
								var categoryCount = 0;
								var cIndex = catNum + 1;
								if(isNaN(rowData['C' + cIndex]))
								{
									rowData['C' + cIndex] = 0;
								}
								
								//matcah category array with fact table categories
								if(categoryArrayV[catNum] == pairValueArrayV[pairNum][0]){
									categoryCount ++;
								}
								//create columns in rowData object and add categoryCount
								rowData['C' + cIndex] = categoryCount + rowData['C' + cIndex];
							}	
						//incremnt unknown count if card does not have category
						if(pairValueArrayV[pairNum][0] == 'UNKNOWN'){	
							unknownCount++;
						}
					}
				}
				
				//append unknow to end of row
				var cardIndex = cardArrayV.length + 1;
				var catIndex = categoryArrayV.length + 1;
				rowData['C' + catIndex] = unknownCount;
				//add rowData object to array
				storeArray[cardNum] =  rowData ; 
			}
			
            //set tabel values to 0 to replace undefined
			if(storeArray == undefined)
			{
				storeArray[0] = 0;
			}
			
			//Build table rows and columns
			buildCategoryHeaderObject();
			document.dispatchEvent(evtLoadFact);
	
		};
		
		//build grid rows and cloumns set color coding for grid data
		function buildCategoryHeaderObject()
		{
			//Create first column in header with no text and mapped to display cards
			categoryHeaderArray[0] = {header: ' Surveys Taken = ' + numberOfSurveysTaken,   mapping: 'C0'}
			categoryHeaderObject = '';
			for(var i=1; i<categoryArrayV.length + 1; i++)
			{
				var headerValue =  categoryArrayV[i-1] ;
				var mappingValue = 'C' + i ;
				categoryHeaderArray[i] = {
				
					header: headerValue, 
					mapping: mappingValue,
					renderer:function(val)
					{
						//calculate percentage and round
						if(numberOfSurveysTaken != 0)
						{
							var percent = (val/numberOfSurveysTaken) * 100;
							percent = Math.round(percent);
						}
						else 
						{
							percent = 0;
						}
							
						//set text color based on percentage match
						var color;
						if(percent >= 80)
						{
							color = "3ab050";
						}
						if(percent >= 70 && percent < 80)
						{	
							color = "ffc000";
						}
						if(percent < 70)
						{
							color = "d50000";
						}
						
						percent = percent + '%';
						var data = val + '  (' + percent + ')';
						return "<span style='color: #" + color + ";'>" + data +  "</span>"
						
					}
				};
			}
			
			//append UNKNOWN column
			var index = categoryArrayV.length+1;
			categoryHeaderArray[index] = 
			{
				header: 'Unknown', mapping: 'C'+ index, 
				renderer:function(val)
				{
					//calculate percentage and round
					if(numberOfSurveysTaken != 0)
					{
						var percent = (val/numberOfSurveysTaken) * 100;
						percent = Math.round(percent);
					}
					else 
					{
						percent = 0;
					}
					
					//set text color based on percentage match
					var color;
					if(percent >= 80)
					{
						color = "3ab050";
					}
					if(percent >= 70 && percent < 80)
					{	
						color = "ffc000";
					}
					if(percent < 70)
					{
						color = "d50000";
					}
					
					percent = percent + '%';
					var data = val + '  (' + percent + ')';
					return "<span style='color: #" + color + ";'>" + data +  "</span>"
				}
			}
		};
		
	//End build dataArray and grid functions
	//*************************************************************
	
		
	//*************************************************************
	//Begin Load Survey data from webservice
	
	//Create alphabetically sorted card and category arrays from DB
		function getSortedArrays() {
		
			var categoryListV;
			var cardListV;

			//Request test survey data from webservice
			Ext.util.JSONP.request({
				url: "http://cardsort.timkrause.info/webservice.php",
				params: {method: 'getSurveyForTest', code: CardSort.code},
				callbackKey: "callback",
				callback: function(result) { 
					
					
					categoryListV = result.table[0].row.SURVEY_CATEGORIES;
					cardListV =result.table[0].row.SURVEY_CARDS;
					
					//get demographics identifier
					demographicsEnabledV = result.table[0].row.DEMOGRAPHICS_IDEN;
				
					//Get survey name and set titlebarT title
					surveyTitleV = result.table[0].row.SURVEY_TITLE;
					titlebarV.setTitle(surveyTitleV);
					
					//remove trailing comma
					var strLn = categoryListV.length;
					categoryListV = categoryListV.slice(0, strLn-1);
					strLn = cardListV.length;
					cardListV = cardListV.slice(0, strLn-1);
					
					//read category csv into array and sort array
					categoryArrayV = categoryListV.split(',');
					categoryArrayV.sort();		
				
					//read card csv into array and sort array
					cardArrayV = cardListV.split(',');
					cardArrayV.sort();
                                
					//fire event to on data loaded to check if demographics are enabled
					document.dispatchEvent(evtV);
				}	
			});
		};
	
	//End Load Survey data from webservice
	//*************************************************************
		
		
		
	
	//*************************************************************	
	// Create Grid Begin
	
		mainPanelV = new Ext.Panel({
          //  id: 'mainPanelV',
			fullscreen: true,
		});
        
        gridContainer = new Ext.Container({
          id: 'gridContainer',
          fullscreen  : true,
          });  

		
		//reset grid and data arrays after each filter selection
		function resetGridContainer()
		{
			//reset grid
			Ext.getCmp('gridContainer').destroy();
			gridContainer = new Ext.Container({
				id: 'gridContainer',
				fullscreen  : true,
			});
			
			//clear arrays
			storeArray = [];
			pairValueArrayV = [];
		}
		
		//create store and grid
		function creatGrid()
		{
			var store = new Ext.data.Store({
				model : CardSort.models.ResultsM,
				data  : storeArray,
			});
		
			//create grid after data has been loaded
			var grid = new Ext.ux.TouchGridPanel({
				fullscreen  : true,
				store       : store,
				multiSelect : false,
				colModel    : categoryHeaderArray
			});
			
			gridContainer.add(grid);
			gridContainer.doLayout();
		};
	
		//when storeArry is built create and show resutls grid
		function factDataLoadedHandler(){
			creatGrid();
			mainPanelV.add(gridContainer);
			mainPanelV.doLayout();
		};
		
		//handler jsonpDataLoaded event. check demographicsEnabled
		function jsonpDataLoadedHandler() {
            //show selection fields
            if(demographicsEnabledV == 1)
            {
                addDemographicsComponents();
                demoSelectContainer.doLayout();
                mainPanelV.doLayout();
            }
            
            //build data with out selection filters
            if(demographicsEnabledV == 0)
            {                 
                buildCatCardPairData();
            }                   
		};
		
	//*************************************************************
	// Create Grid End
	
	
	
	
	//*******************************************************************
		Ext.apply(this,{
			dockedItems:[titlebarV, mainPanelV]
		});
		
	CardSort.views.ResultsView.superclass.initComponent.call(this);
	
        //get card and category list form getSurveyForTest webservice method
		getSortedArrays();
	
	},
	
});
//register xtype
Ext.reg('ResultsView', CardSort.views.ResultsView);

