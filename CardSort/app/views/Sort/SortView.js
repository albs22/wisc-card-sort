//take survey view - loads survey for user to complete. saves results in db
CardSort.views.SortView = Ext.extend(Ext.Panel, {

	initComponent: function(){
	
		var titlebarS, backButtonS, infoButtonS, clearButtonS, submitButtonS, cardCountS, categoryCountS, categoryBodyS, categoryColumnS, 
		categoryContainerS, dropContainerS, addCategoryButtonS, cardPanelS, dropCounterS, categoryContainerS, cardS
		
		var duplicateCardS = '';
		//counts number of cards created
		cardCountS = 0;
		//counts number of categories created
		categoryCountS = 0;
		//counts number cards dropped
		dropCounterS = 0;
		//cards not dropped
		var cardsRemaining = 0;

		var droppedArray = [];
		var cardArrayS =[];
	
	//******************************************************************
	// Begin Titlebar Components
		// titlebar back button
		backButtonS = {
				id: 'sortViewCancel',
				text: 'Cancel',
				ui: 'back',
				handler: function(){
					Ext.dispatch({
						//controller: App.controllers.main,
						controller: 'Main',
						action: 'index',
						historyUrl: 'Main/index'
					});
				}
		};
		
		//clear all cards and categories
		clearButtonS = {
			text: 'Clear',
			width: 60,
			ui: 'decline',
			handler: function(){
				Ext.Msg.confirm('Clear Sort', 'Would you like to delete all cards and categories?', function(button){
					if(button == 'yes')
					{
						clearCardsCategories();
					}
				});
			}
		};
		
		
		//titlebar share button
		//TODO: In next version implement card sort sharing or exporting(email, list, screenshot, ...)
		/*
		submitButtonS = {
				id: 'sortViewSubmit',
				text: 'Share',
				ui: 'confirm',
				handler: function(){ 
				}
		};
		*/
		
		infoButtonS = {
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
						height: 275,
						styleHtmlContent: true,
						html: '<p>To create a new category or card, tap the corresponding add button, then enter your text &#40;max&#58; 15 characters&#41;.<br/><br/>Once the cards are created, you can drag &amp; drop them under the category you feel is appropriate.<br/><br/>To delete a card, tap hold it.</p>',
						dockedItems: [{
							dock: 'top',
							xtype: 'toolbar',
							title: 'Simple Sort Info'
						}]
					});
				}
				this.popup.show('pop');
			}
		};
		
		// TITLE BAR
		titlebarS = {
            id: 'sortViewTitlebar',
            xtype: 'toolbar',
            title: 'Simple Sort',
            dock:'top',
            items: [backButtonS, {xtype: 'spacer'}, clearButtonS, infoButtonS]
		};
	//End Titlebar Components
	//******************************************************************
	
    
    
	//******************************************************************
	// Begin Display add buttons and drozones 
	
		//categoryBody - main container holds all categoryColumns. Srolls horizontally
		categoryBodyS = new Ext.Container({
			id: 'categoryBody2',
            cls: 'categoryBody',
			layout:{type: 'hbox'},
		});
		
		//creates category dropZone divs 
		function loadCategories() {
			var numCategory = 6;
			for(var i=0; i<numCategory; i++){

				//Create divs to be register as droppable later. 
				var dropS1 = {	id: 'dropS' + '0' + i, 
								height: 84,
								cls:'dropZone1',
							};
				var dropS2 = {	id: 'dropS' + '1'+ i, 
								height: 84,
								cls:'dropZone2',
							};
				var dropS3= {	id: 'dropS' + '2' + i,
								height: 84,
								cls:'dropZone1',
							};
				var dropS4 = {	id: 'dropS' + '3' + i,
								height: 84,
								cls:'dropZone2',
							};
				var dropS5 = {	id: 'dropS' + '4' + i,
								height: 84,
								cls:'dropZone1',
							};		
				var dropS6 = {	id: 'dropS' + '5' + i,
								height: 84,
								cls:'dropZone2',
							};
                var dropS7 = {	id: 'dropS' + '6' + i,
								height: 84,
								cls:'dropZone1',
							};
							
				//new categories added to this container
				categoryContainerS = new Ext.Container({     
					id: 'categoryContainer' + i,
                    cls: 'addCategory',
				 }); 
				
				//dropContainerS containes dropZone divs
				dropContainerS = new Ext.Container({
					cls: 'dropContainer',
					items: [dropS1, dropS2, dropS3, dropS4, dropS5, dropS6, dropS7],
				});
				
				//contains dropzoneContainer and category Container
				categoryColumnS = new Ext.Container({
					cls: 'categoryColumn',
					items: [categoryContainerS, dropContainerS]
				});
				
				//add categoryColumns to category body panel
				categoryBodyS.add(categoryColumnS);
				categoryBodyS.doLayout();
			}	
		};
		
		//Add new card button
		addCardButtonS = {
			xtype: 'button',
			text: 'Add Card',
            height: 60, //addCardButton height,
			cls: 'addCardButton',
			handler: function(){
				createCard();
			}
		};
		
		//New cards are added to cardPanelS
		cardPanelS = new Ext.Panel({
			//hidden: true,
			//style: "background-color: #FFAD5C;",
			id: 'cardPanelS',
			height: 75,
			layout:{type: 'hbox'},
			cls: 'cardContainer',
			dock: 'bottom',
			//enabling scroll here makes cards appear behind the background when dragged 
			scroll: 'horizontal',
			//items: [addCardButtonS]
			
		});
		
		function loadCardsPanel()
		{
			cardPanelS.add(addCardButtonS);
		
		}
		
	//******************************************************************
	// End Display add buttons and dropzones 
    
    
    
    //******************************************************************
    // Begin create card, category functions and droppable listener setter
		
		//function to create card and set draggable listener
		function createCard() {
			Ext.Msg.prompt('Add Card', 'Enter Card Name:', function(button, value) {
					//sencha bug: need to resize prompt to fit all components. does not work on first call
				Ext.Msg.doComponentLayout();
				if(button == 'ok' && value != ''){	
					 cardS = new Ext.Container({
						id: 'card' + cardCountS,
						html: value,
						draggable: true,
						height: 55, // draggableCard height
						cls:'draggableCard',
						listeners: {	
							//delete card on taphold
							taphold:{
								element: 'el',
								fn: function(e){
									Ext.Msg.confirm('Delete Card', 'Do you want to delete this card?', function(button){
										if(button == 'yes'){
											var target = e.target;
											var id = target.id;
											Ext.getCmp(id).destroy();
											//reset draggable listeners
											resetCardPanelDraggable(id);
										}
									});
								}
							}	
						}
					});
					
					//add card to cardPanel
					cardPanelS.add(cardS);
					cardPanelS.doLayout();
					var item = 'card' + cardCountS;
					cardArrayS.push(item);
					cardCountS++;
				}		
				//Must set value to "" for prompt work correctly in chrome 15
			}, this, false, '', {maxlength: 15} );	
        };
		
                            
        // set drop listeners on selected drop zones
         function setDroppable(columnIndex, numDropZones)
         {
            for(var i=0; i<numDropZones; i++)
            {
                var dropName = 'dropS' + i + columnIndex;
                new Ext.util.Droppable(dropName, { 
                    validDropMode: 'contains',
                    //listens for drop events
                        listeners: {	
                            drop: function(droppable, draggable, e) {
                                //delete card from carPanle and add to dropzone. Allows cards to 'snap-in'. Allows cards to now scroll with card panel
                                dropCounterS ++;

                                //get dropped card's name and ID
                                var cardTarget = e.target;
                                var cardPanelCardID = cardTarget.id;
                                var cardText = cardTarget.innerHTML;

                                //get ID of dropzone
                                var dropIDS = droppable.el.id;

                                //when card ID is auto generated do not creat new card
                                //prevents extra blank card from being created
                                if(cardPanelCardID.substr(0,3) != 'ext' && duplicateCardS != cardPanelCardID  )
                                {
                                    //crete new card with same text as dropped in selected dropzone
                                    var newCard = new Ext.Container({
                                        id: 'cardD' + dropCounterS,
                                        html: cardText,
                                        height: 55, // draggableCard height
                                        cls:'draggableCard',
                                        draggable: true,
                                        listeners:{
                                            //delete card function
                                            taphold:{
                                                element: 'el',
                                                fn: function(e){
                                                    Ext.Msg.confirm('Delete Card', 'Do you want to delete this card?', function(button){
                                                        if(button == 'yes'){
                                                            var target = e.target;
                                                            var id = target.id;
                                                            Ext.getCmp(id).destroy();

                                                            //reset draggable listeners
                                                            resetCardPanelDraggable(id);
                                                        }
                                                    });
                                                }
                                            }	
                                        }
                                    });
         
                                    //add new cards to array
                                    var item = 'cardD' + dropCounterS;
                                    droppedArray.push(item);
                                 
                                    // add new card to dropzone dropIDS
                                    Ext.getCmp(dropIDS).add(newCard);
                                    Ext.getCmp(dropIDS).doLayout();
                                 
                                    //refresh layout of dropzone
                                    Ext.getCmp(dropIDS).doLayout();
                                 
                                    //remove card form card panel
                                    Ext.getCmp(cardPanelCardID).destroy();
                                    // reset draggable listener on remaing cards in the cardPanel and move card from cardArray
                                    resetCardPanelDraggable(cardPanelCardID);
                                    duplicateCardS = cardPanelCardID;
                                    categoryBodyS.doLayout();
                                    cardPanelS.doLayout();
             
                                }
                            }
                        }
                    });
                }
            };
         
    // Begin create card and category functions  
    //******************************************************************
    
    
    
    //******************************************************************
    //Begin reset and clear functions            
		function resetCardPanelDraggable(destroyedCardID, CI, DZ)
		{
			// reset draggable listener on remaing cards in the cardPanel
			for(var i = 0; i<cardArrayS.length; i++)
			{
				if(cardArrayS[i] == destroyedCardID)
				{
					//reomve card from cardArrray if dropped
					cardArrayS.splice(i,1);
				}
				if(cardArrayS[i] != undefined)
				{
					//reset draggable listener on cards that shifted position in the cardpanel
					new Ext.util.Draggable(cardArrayS[i], {
							revert: true,
					});
					
                }
            }
		};
		
			
		//delete all cards and categories
		function clearCardsCategories()
		{
			//clear cardPanel then re-create button
			//clear dropped cards
			for(var i=0; i<droppedArray.length; i++)
			{
				//check if card exists before deleting
				var cardExsists = document.getElementById(droppedArray[i]);
				if(cardExsists)
				{
					Ext.getCmp(droppedArray[i]).destroy();
				}
			}
			dropCounterS = 0;
			
			//clear categories
			for(var catNum = 0; catNum<categoryCountS; catNum++)
			{
				//find category conatiner and category then reomve category div from parent div
				var parent = document.getElementById('categoryContainer' + catNum);
				//var parent = document.getElementById('categoryContainer0');
				var child = document.getElementById(catNum);
				parent.removeChild(child);
			}
			
			//clear all drop listeners
			var numDrop = 6;
			for(var catNum=0; catNum<categoryCountS; catNum++)
			{
				for(var i=0; i<numDrop; i++)
				{
					var id = 'dropS' + i + catNum;
					Ext.getCmp(id).clearListeners();
                  //  Ext.getCmp(id).destroy();
				
				}
			}
            
			//clear cards, categories and listeners
			Ext.getCmp('categoryBody2').clearListeners();
			Ext.getCmp('cardPanelS').removeAll();
			Ext.getCmp('cardPanelS').add(addCardButtonS);
			Ext.getCmp('cardPanelS').doLayout();
			Ext.getCmp('addCategoryButton').setPosition(1, 1);
			
			//reset data
			cardCountS = 0;
			categoryCountS = 0;
			droppedArray = [];
			cardArrayS = [];
			duplicateCardS = '';
		};
		
		
		
	//*******************************************************
	
		Ext.apply(this, {
			style: 'background: #A2ABA5',
			dockedItems: [titlebarS, cardPanelS,],
			items: [categoryBodyS, 
				{
			//Add category button
				xtype: 'button',
				text: 'Add Category',
				id: 'addCategoryButton',
				height: 40,
				width: 150,
                cls: 'addCategoryBtn',
				//scope: this,
				handler: function(){
					Ext.Msg.prompt('Add Category', 'Enter Category Name:', function(button, value) {
						//sencha bug: need to resize prompt to fit all components. does not work on first call
						Ext.Msg.doComponentLayout();
						if(button == 'ok' && value != ''){	
							var categoryS = new Ext.Container({
								//xtype: 'container',
								id: 'category' + categoryCountS,
								html: value,
								cls:'category',
							});
							
							var maxCategories = 6;
							if(categoryCountS < maxCategories)
							{
								//get get div element for new category placement
								var categoryPositionEL = document.getElementById('categoryContainer' + categoryCountS);
								categoryPositionEL.innerHTML = '<div id="'+ categoryCountS  +'" class = "category">' + value + '</div>';
							}
						
							//Move add category button to next categoryContainer
							var numDropZones = 7;
							//Set dropZone droppable listners
							//Move add category to the left as more categories are added
							if(categoryCountS == 0){
								this.setPosition(171, 1);
								setDroppable(0, numDropZones);
							}
							if(categoryCountS == 1){
								this.setPosition(342, 1);
								//Set droppable listeners (columnindex, number of dropZones)
								setDroppable(1, numDropZones);
							}
							if(categoryCountS == 2){
								this.setPosition(513, 1);
								setDroppable(2, numDropZones);
							}
							if(categoryCountS == 3){
								this.setPosition(684, 1);
								setDroppable(3, numDropZones);
							}
							if(categoryCountS == 4){
								this.setPosition(855, 1);
								setDroppable(4, numDropZones);
							}
							if(categoryCountS == 5){
								this.setPosition(1046, 1);
								setDroppable(5, numDropZones);
							}
							categoryBodyS.doLayout();
							cardPanelS.doLayout();
							categoryCountS++;
						}
						//set scope of msg.prompt
					}, this, false, '', {maxlength: 15} );
				}
			},]	

		});
		
		CardSort.views.SortView.superclass.initComponent.call(this);
		
		//display drop zones
		loadCategories();
		//display add card button
		loadCardsPanel()
		this.doLayout();
	},

});
Ext.reg('SortView', CardSort.views.SortView);



								