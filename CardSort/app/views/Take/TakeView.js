//take survey view - loads created survey from webservice, display demographics field selection,
//		allow user to take, and submit survey
CardSort.views.TakeView = Ext.extend(Ext.Panel, {
     initComponent: function(){
     
         var titlebarT, backButtonT, submitButtonT, infoButtonT, categoryBodyt, categoryColumnT, categoryContainerT,  dropContainerT, categoryArrayT, 
         cardArrayT, cardCountT, categoryCountT, cardBodyT, demographicsEnabledT, userID,
         cardLocationArray, cardPanelT, dropID, surveyTitleT, demographicsPanel, demographicsFields, ageSelectionT,
         genderSelectionT, ethnicitySelectionT, stateSelectionT, citySeletion, categoryContainerT1, dropZoneCountT
         
         //track if demographics are enabled
         demographicsEnabledT = 0;
         userID = 0;
         
         //counts number of cards added. used to create card ID
         cardCountT = 0;
         categoryCountT = 0;
         
         //intialize titlebar title
         surveyTitleT = '';
         
         //intializ arrays
         categoryArrayT = new Array();
         cardArrayT = new Array();
         
         //create, intialize, and addListener for jsopDataLoaded Event
         //this event is fired when data from the webservice 
         var evtT = document.createEvent('Event');
         evtT.initEvent("jsonpDataLoadedT",true,true);
         document.addEventListener("jsonpDataLoadedT",jsonpDataLoadedHandlerT,false);
         
    //*****************************************************
    //Begin Titlebar Components
         //titlebar back button
         backButtonT = {
            id: 'takeViewCancel',
            text: 'Cancel',
            ui: 'back',
            handler: function(){
                CardSort.isReload = true;
                //remove data evente listener to prevent duplicate events
                document.removeEventListener("jsonpDataLoadedT",jsonpDataLoadedHandlerT,false);
                pageReload();
                
                Ext.dispatch({
                    controller: 'Main',
                    action: 'index',
                    historyUrl: 'Main/index'
                });
            }
         };
         
         //titlebar submit button
         submitButtonT = {
             id: 'takeViewSubmit',
             text: 'Submit',
             ui: 'confirm',
             disabled: true,
             handler: function(){ 
                Ext.Msg.confirm('Submit Survey', 'Are you sure you are ready to submit?', function(button){
                    if(button == 'yes'){
                        prepareSubmit();
                        submitWebService();	
                        CardSort.isReload = true;	
                        
                        Ext.dispatch({
                          //controller: App.controllers.main,
                          controller: 'Main',
                          action: 'index',
                          historyUrl: 'Main/index'
                        });
                    }  
                });	
            }	
         };
         
         infoButtonT = {
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
                        height: 290,
                        styleHtmlContent: true,
                        //scroll: 'vertical',
                        html: '<p>Cards and categories have been pre-determined for you.<br/><br/>Simply drag the cards and drop them into the categories where you feel they fit best.<br/><br/>When finished, tap the &quot;Submit&quot; button located in the upper-right corner.</p>',
                        dockedItems: [{
                            dock: 'top',
                            xtype: 'toolbar',
                            title: 'Take Survey Info'
                        }]
                    });
                }
                this.popup.show('pop');
            }
         };
         
         //titlebar (instaniate new toolbar to allow acces to title to change dynamically)
         titlebarT = new Ext.Toolbar({
             id: 'takeViewTitlebar',
             //xtype: 'toolbar',
             title: surveyTitleT,
             dock:'top',
             items: [backButtonT, {xtype: 'spacer'}, infoButtonT, submitButtonT]
          });
    //End Titlebar Components
    //*****************************************************
         
         
    //*****************************************************
    //Begin get Survey data from webservice function
         
         //Function to get survey data (cards, categories, title, description)
         function getSurvey(surveyCode) {
            var categoryListT = '';
            var cardListT = '';
            cardArrayT = [];
            categoryArrayT = [];
         
            //Request test survey data from webservice
            Ext.util.JSONP.request({
                url: "http://cardsort.timkrause.info/webservice.php",
                params: {method: 'getSurveyForTest', code: surveyCode},
                callbackKey: "callback",
                callback: function(result) { 
                    try{
                        categoryListT = result.table[0].row.SURVEY_CATEGORIES;   
                        cardListT =result.table[0].row.SURVEY_CARDS;
                        
                        //get demographics identifier
                        demographicsEnabledT = result.table[0].row.DEMOGRAPHICS_IDEN;
                        
                        //Get survey description to display in toolbar dropdown
                        surveyDescriptionT = result.table[0].row.SURVEY_COMMENTS;
                        
                        //Get survey name and set titlebarT title
                        surveyTitleT = result.table[0].row.SURVEY_TITLE;
                        titlebarT.setTitle(surveyTitleT);
                        
                        //remove trailing comma
                        var strLn = categoryListT.length;
                        categoryListT = categoryListT.slice(0, strLn-1);
                        strLn = cardListT.length;
                        cardListT = cardListT.slice(0, strLn-1);
                        
                        //read category csv into array 
                        categoryArrayT = categoryListT.split(',');			
                        
                        //read card csv into array 
                        cardArrayT = cardListT.split(',');
                        
                        //call load functions to add cards and categories to page
                        loadCards(cardArrayT);
                        
                        loadCategories(categoryArrayT);	
                        
                        //fire event notify data is finished loading
                        document.dispatchEvent(evtT);
                    
                    }
                    //catch error if invalid code is entered
                    catch(err){
                        //if user enters invalid code return them to the main menu
                        Ext.dispatch({
                             //controller: App.controllers.main,
                             controller: 'Main',
                             action: 'index',
                             historyUrl: 'Main/index'
                        });
                    }
                }	
            });
         };
         
    //End get Survey data from webservice function
    //*****************************************************
         
         
    //*****************************************************
    //Begin card and category components and function
         
         //categoryBody - main container holds all categoryColumns. Srolls horizontally
        categoryBodyT = new Ext.Container({
            id: 'categoryBodyT',
            cls: 'categoryBody',
            layout:{type: 'hbox'},
        });
        
        
         //diplay array of categories as divs
         function loadCategories(catArray) {
            //categoryCountT = catArray.length;
            for(var i=0; i<catArray.length; i++){

                var cat = {	id: 'cat' + catArray[i],
                    html: catArray[i],
                    //Height not correct when set with css
                    cls:'addCategory',
                };

                //Create divs to be register as droppable later.
                //ID = drop + verticle position + categoryCountT
                var drop1 = {	
                    id: 'drop' + '0' + categoryCountT, 
                    //Height setting in css does not work
                    height: 84,
                    cls:'dropZone1',
                };
                
                 var drop2 = {	
                    id: 'drop' + '1'+ categoryCountT, 
                    height: 84,
                    cls:'dropZone2',
                 };
                 
                var drop3= {	id: 'drop' + '2' + categoryCountT,
                    height: 84,
                    cls:'dropZone1',
                 };
                 var drop4 = {	id: 'drop' + '3' + categoryCountT,
                    height: 84,
                    cls:'dropZone2',
                 };
                 var drop5 = {	id: 'drop' + '4' + categoryCountT,
                    height: 84,
                    cls:'dropZone1',
                 };
                 var drop6 = {	id: 'drop' + '5' + categoryCountT,
                    height: 84,
                    cls:'dropZone2',
                 };
                 var drop7 = {	id: 'drop' + '6' + categoryCountT,
                    height: 84,
                    cls:'dropZone1',
                 };
                 
                 categoryCountT++;
                 
                 categoryContainerT1 = new Ext.Container({
                     cls: 'categoryContainer',
                     items: [cat ] //categoryContainerT, dropContainer]
                });
                 
                 dropContainerT = new Ext.Container({
                    cls: 'dropContainer',
                    items: [drop1, drop2, drop3, drop4, drop5, drop6, drop7],
                });
                 
                 categoryColumnT = new Ext.Container({
                     cls: 'categoryColumn',
                     items: [categoryContainerT1, dropContainerT]
                 });
                 
                 
                 categoryBodyT.add(categoryColumnT);
                 categoryBodyT.doLayout();
            }		
        };
                 
            //Contains all cards docked to bottom
            cardPanelT = new Ext.Container({
                //id: 'cardPanelT',
                layout:{type: 'hbox'},
                height: 75,
                cls: 'cardContainer',
                dock: 'bottom',
                scroll: 'horizontal',
            });
                 
         //display cards from array
         function loadCards(cardArray) {
             var card;
             var cardPanelT2;
             cardLocationArray = new Array()
             cardCountT = 0;
             for(var i=0; i<cardArray.length; i++){
                 //cardLocationArray[i] = cardArray[i];
                 //set up multidimensional array to track card location
                 //cardLocationArray[i] = new Array(cardArray[i]);
                 
                 //add nested array with length 2 to cardLocationArray
                 cardLocationArray[i] = new Array(2);
                 //add card name to postion 0 of nested array
                 cardLocationArray[i][0] = cardArray[i];
                 //set card position to unknown
                 cardLocationArray[i][1] = 'UNKNOWN';
                 
                 card =  new Ext.Container({
                       id: 'card' + cardArray[i],
                       html: cardArray[i],
                       height: 55,
                       cls:'draggableCard'
                });
                 
                 cardCountT ++;
                 cardPanelT.add(card);
                 //cardPanelT.add(cardPanelT2);
                 cardPanelT.doLayout();
             }
         };
         
         
         //*************************************************************************
         //Begin submit survey functions
         //parse cardLocationArray into cards and categories
         //Maps cardloaction number to category name
         function prepareSubmit() {
             //Create nested array to hold card and category pairs
             var submitArray = [[]];
             
             
             //map category name to dropID
             for(var i=0; i<cardLocationArray.length; i++)
             {	
                //Check if card has not been dropped
                if(cardLocationArray[i][1] != 'UNKNOWN')
                {
                    var catIndex = cardLocationArray[i][1];
                    //set cat index to dropZone categoryCountT
                    catIndex = catIndex.charAt(catIndex.length-1);
                    var catName2
             
                    for(var j=0; j<categoryArrayT.length; j++){
                        //if dropZone index equals categoryArrayT index set name to catName2
                        if(j == catIndex)
                        {
                            catName2 = categoryArrayT[j];
                        }
                    }
                //creat card category pair
                cardLocationArray[i][1] = catName2;
                }
             }
         };
         
         //Submit cardLocationArray to DB one item at a time
         function submitWebService(){
             //if demographics are enabled submit demographics and surver information
             if(demographicsEnabledT == 1 )
             {	
                 for(var i=0; i<cardLocationArray.length; i++)
                 {	
                    Ext.util.JSONP.request({
                        url: "http://cardsort.timkrause.info/webservice.php",
                        params: {	
                            method: 'setFact', 
                            card: cardLocationArray[i][0],
                            category: cardLocationArray[i][1],
                            code: CardSort.code, 
                            userId: userID,
                        },
                        callbackKey: "callback",
                        callback: function(result) { 
                        }
                    });
                    }
                }
            else
            {
                 //send each carlocation pair to the webserivce - no demographics
                 for(var i=0; i<cardLocationArray.length; i++)
                 {	
                    Ext.util.JSONP.request({
                        url: "http://cardsort.timkrause.info/webservice.php",
                        params: {	
                            method: 'setFact', 
                            card: cardLocationArray[i][0],
                            category: cardLocationArray[i][1],
                            code: CardSort.code, 
                        },
                        callbackKey: "callback",
                        callback: function(result) {  }
                        
                    });
                 }
             }
         };
         
         //End submit survey functions	
         //*************************************************************************
         
         
         
         //*****************************************************
         //Begin Demographic componenents and functions
        demographicsPanel = new Ext.Container ({
            fullscreen: true,
            cls: 'demographicsPanel',
        });
         
        //crate demographic components and populate selction fields
        function loadDemographicsData()
        {
            ageSelectionT = new Ext.form.Select({
                 label: 'Age',
                 id: 'ageSelection',
                 options: [	
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
         
         genderSelectionT = {
         xtype: 'selectfield',
         id: 'genderSelection',
         label: 'Gender',
         options: [	
                   {text: 'Unknown', 	value: 'UNKNOWN'},
                   {text: 'Male', 		value: 'Male'	},
                   {text: 'Female',	value: 'Female'     }
                   ]
         };
         
         ethnicitySelectionT = {
         xtype: 'selectfield',
         id: 'ethnicitySelection',
         label: 'Ethnicity',
         //value: 'Select Ethnicity',
         options: [	{text: 'Unknown',								value: 'UNKNOWN'								},
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
                   {text: 'Korean',                                 value: 'Korean'									},
                   {text: 'Vietnamese',                             value: 'Vietnamese'								},
                   {text: 'Other Asian Origin',                     value: 'Other Asian Origin'						},
                   {text: 'Native Hawaiian',						value: 'Native Hawaiian'						},
                   {text: 'Guamanian/Chamorro',                     value: 'Guamanian/Chamorro'						},
                   {text: 'Samoan',                                 value: 'Samoan'									},
                   {text: 'Other Pacific Islander Origin',			value: 'Other Pacific Islander Origin'			},
                   {text: 'Other Race',                             value: 'Other Race'								},
                   ]
         };
         
         
         
         stateSelectionT  = {
         xtype: 'selectfield',
         label: 'State',
         id: 'stateSelection',
         options: [	{text: 'Unknown', value: 'UNKNOWN'},
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
                   {text: 'Wyoming', value: 'Wyoming'},]
         };
         // Implement  city selection demographics in next version
         /*
          citySelectionT = {
          xtype: 'selectfield',
          label: 'City',
          options: [{text: 'Stevens Point', value: 'Stevens Point'}]
          };
          */
         
         demographicsFields = {
            xtype: 'container',
            cls: 'demographicsFields',
            height: 600,
            items: [ageSelectionT, genderSelectionT, ethnicitySelectionT, stateSelectionT]
         };
         
         demographicsPanel.add(demographicsFields);
         demographicsPanel.doLayout();
         
         };
         
         function setDemographicsData()
         {
         // get selction values
            Ext.util.JSONP.request({
                url: "http://cardsort.timkrause.info/webservice.php",
                params: {	
                    method: 'setUser', 
                    gender: Ext.getCmp('genderSelection').getValue(),
                    age: Ext.getCmp('ageSelection').getValue(),
                    ethnicity: Ext.getCmp('ethnicitySelection').getValue(),
                    state: Ext.getCmp('stateSelection').getValue(),
                },
                callbackKey: "callback",
                callback: function(result) { 
                    userID = result;
                    //split userID = ID on equal sign
                    userID = userID.split('=');
                    userID = userID[1];
                }
            });
         };
         //End Demographic components and functions
         //*****************************************************
         
         
         
         
         //Event handleer for jsonpDataLoaded event. after data is loaded show loading splash screen or demographics selections
         function jsonpDataLoadedHandlerT() {
             Ext.getCmp('splashStartButton').setPosition(0, 260);
             Ext.getCmp('splashStartButton').setDisabled(false);
             
             //if demographics is enabaled  show demographics data entry screen
             if(demographicsEnabledT == 1)
             {
                loadDemographicsData();
             }
         };
         
         
         //reload page if page has already been loaded. 
         //This fixes a bug where the droppable listeners are not reset correctly and no cards can be dropped
         function pageReload()
         {
             
             //clear all drop listners
             var numDrop = 6;
             for(var catNum=0; catNum<categoryCountT; catNum++)
             {
                for(var i=0; i<numDrop; i++)
                {
                    var id = 'drop' + i + catNum;
                    Ext.getCmp(id).clearListeners();
                    // Ext.getCmp(id).destroy();
                    }
             }
             
             Ext.getCmp('splashPanel').removeAll(true);
             
             categoryCountT = 0;
             categoryArrayT = [];
             cardArrayT = [];
             demographicsEnabledT = 0;
             dropID = -1;
             cardLocationArray = [];

         };
         
         
         
         //*******************************************************
         Ext.apply(this, {
               style: 'background: #A2ABA5',
               dockedItems: [titlebarT, categoryBodyT, cardPanelT,
                    {	
                         xtype: 'panel',
                         fullscreen: true,
                         dock: 'top',
                         style: 'background: #c5dde88;', //position:absolute;' ,
                         html: 'Begin Survey. Drag cards into categories. Tap submit when finished. The test is loading',
                         id: 'splashPanel',
                         items: [demographicsPanel, {
                                 //Splashstart button is disabled until data from webservice is loaded. this button has to be in the Ext.apply
                                 //		otherwise the droppable listeners do not get registered correctly
                                 //TODO: style button and panel
                                 xtype: 'button', 
                                 ui: 'confirm',
                                 //dock:'left',
                                 text: ' Touch Here To Begin Survey',
                                 disabled: true,
                                 id: 'splashStartButton',
                                 cls: 'beginTestButton',
                                 height: 150,
                                 width: 800,
                                 scope: this,
                                 handler:function(){
                                     //hide splash panel or demographics selections and show survey panel
                                     Ext.getCmp('splashStartButton').setVisible(false);
                                     Ext.getCmp('splashPanel').setVisible(false);
                                     Ext.getCmp('takeViewSubmit').setDisabled(false);
            
                                         if(CardSort.isReload == true)
                                         {
                                             CardSort.isReload = false;
                                             Ext.getCmp('categoryBodyT').clearListeners();
                                         
                                            for(var j=0; j<categoryArrayT.length; j++)
                                            {
                                                var id2 = 'dropContainerT' + j;                             
                                            }	
                                         
                                         }
                                             
                                             
                                         if(demographicsEnabledT == 1)
                                         {
                                            setDemographicsData();
                                         }
                                         
                                         
                                         //set draggable listeners
                                         for(var i=0; i<cardArrayT.length; i++)
                                         {
                                            new Ext.util.Draggable('card'+ cardArrayT[i], {
                                                revert: true
                                            });
                                         
                                         }
                                             
                                         //add droppable listeners to dropDivs
                                         //loop thorugh categories
                                      
                                         //Number of drop zones
                                         dropZoneCountT = 6;
                                         for(var i=dropZoneCountT; 0<=i; i--)
                                         {	
                                            /*categoryArrayT.length;*/
                                           
                                            //loop throuh drop zones
                                            
                                            //Number of categories
                                            for(var j=0; j<categoryArrayT.length; j++)
                                            {
                                                var dropName = 'drop'+i+j;
                                
                                                new Ext.util.Droppable(dropName, { 
                                                    validDropMode: 'contains',
                                                
                                                    //listens for drop events
                                                    listeners: {	
                                                        drop: function(droppable, draggable, e) {
                                                        
                                                            // there is no way to get category name here so each drop zone
                                                            //number corresponds with an index to the category in the categoryArray
                                                            dropID = droppable.el.id;
                                                            
                                                            var cardTargetT = e.target;
                                                            var cardTID = cardTargetT.id;
                                                            var cardTText = cardTargetT.innerHTML;
                                                            var cn = document.getElementById(draggable.el.id).textContent;

                                                            var newCardT = new Ext.Container({
                                                                 id: 'D' + cardTID,
                                                                 html: cn,
                                                                 height: 55, // draggableCard height
                                                                 cls:'draggableCard',
                                                                 draggable: true,
                                                            });
                                                
                                                            // add new card to dropzone
                                                            Ext.getCmp(dropID).add(newCardT);
                                                            Ext.getCmp(dropID).doLayout();
                                                            
                                                            //destroy card in cardpanel
                                                            Ext.getCmp(cardTID).destroy();
                                                            
                                                            
                                                            // reset draggabel listener on remaing cards in the cardPanel
                                                            for(var i=0; i<cardArrayT.length; i++)
                                                            {
                                                                if(cardArrayT[i] == cardTText)
                                                            {
                                                            //reomve card from cardArrray if dropped
                                                            cardArrayT.splice(i,1);
                                                        }
                                                            

                                                            if(cardArrayT[i] != undefined)
                                                            {
                                                                //reset draggable listener on cards that shifted position in the cardpanel
                                                                var cardDrag = 'card' + cardArrayT[i];
                                                                new Ext.util.Draggable(cardDrag, {
                                                                    revert: true,
                                                                });
                                                            }
                                                            }
                                                            
                                                            //search  for category name and add card name plus drop position
                                                            for(var i=0; i<cardLocationArray.length; i++){
                                                                //if card name in cardlocationArray equals name of card dropped add category to cardlocationArray
                                                                if(cardLocationArray[i][0] == cn){
                                                                    //set card's category
                                                                    cardLocationArray[i][1] = dropID;
                                                                    //console.log('find location ' + cn + dropID);

                                                                }
                                                            }
                                                        }	
                                                    }
                                                });
                                            
                                            }
                                        }	  
                                    }
                                            
                                }],
                            }, ],
                   
                   });
         
         CardSort.views.TakeView.superclass.initComponent.call(this);
         
         //if page has beened exited. reload
         //pageReload();
         //load survey information from webservice
         getSurvey(CardSort.code);
         
         },
     
     });
Ext.reg('TakeView', CardSort.views.TakeView);
