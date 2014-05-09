//Create Survey View View
CardSort.views.CreateView = Ext.extend(Ext.Panel, {
	initComponent: function(){
		//define page components
        var titlebarC, backButtonC, infoButtonC, submitButtonC, addCardButtonC, addCategoryButtonC, mainContainerC, categoryArrayC, addCardField, addCategoryField, 
		cardNumberC, categoryNumberC, categoryArrayC, cardPanelFields, cardArrayC, categoryPanelFields, nameField, descriptionField, cardListC, categoryListC, categoryListC, 
		fieldHeaderC, fieldPanelC, demographicsToggle, emailField,  iconContainerC, shareCodeField, cardPanelScroll, shareCodeArray, shareCodeC;
		
		//count number of categeories and cards
		cardNumberC = 0;
		categoryNumberC = 0;
		//create share code array
		shareCodeArray = new Array();
		
		//create cards and categories
		categoryArrayC = new Array();
		cardArrayC = new Array();

		
	//*****************************************************************************
	//Begin titlebarC Components
		//titlebarC buttons
		backButtonC = {
			id: 'createViewCancel',
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
		
		//submit button prompts user confrim survey submit. calls jsonp rewuest top upload created survey data to webservice
		submitButtonC = {
			id: 'createViewSubmit',
			width: 60,
			text: 'Submit',
			ui: 'confirm',
			handler: function(){
				Ext.Msg.confirm('Create Survey', 'Do you really want to create a survey? With code ' + shareCodeC, function(button){
					if(button == 'yes'){
					
						// read cardArrayC into csl to import to db
						var cardListC= new String();
						for(var i=0; i<cardArrayC.length; i++){
			
							var cardListC = cardListC + cardArrayC[i]  + ",";
						}
						
						// read categoryArrayC into csl to import to db
						var categoryListC = new String();
						for(var i=0; i<categoryArrayC.length; i++){
			
							var categoryListC = categoryListC + categoryArrayC[i]  + ",";
						}
						
						
						//Make jsonp request to web serive to submit created survey data
						Ext.util.JSONP.request({
							url: "http://alexbehlen.com/webservice.php",
							params: {	method: 'setSurvey',
										demographics: demographicsToggle.getValue(),
										code: shareCodeC,
										//password: passwordField.getValue(), 
										//email: emailField.getValue(), 
										title: nameField.getValue(), 
										comments: descriptionField.getValue(), 
										cards: cardListC, 
										categories: categoryListC
									},
							callbackKey: "callback",
							callback: function(result) { }
					
						});

						//clear fields and remove cards, and categories after submitted to DB
						//passwordField.reset();
						//emailField.reset();
						nameField.reset();
						descriptionField.reset();
								
						Ext.dispatch({
							controller: 'Main',
							action: 'index',
							historyUrl: 'Main/index'
						});
					}		
				});
			}
		};
		
		
    infoButtonC = {
        iconMask: true,
        iconCls: 'info',
        handler: function(){
				//display overlay with page tutorial
				if (!this.popup) {
					this.popup = new Ext.Panel({
						floating: true,
						modal: true,
						centered: true,
						width: 350,
						height: 510,
						styleHtmlContent: true,
						html: '<p>Here you can create a new card sort survey for others to take.<br/><br/>Add a name, password, description, card, or category to your card sort by tapping on the corresponding text box.<br/><br/>To add the cards and categories to the lists, tap the &quot;+&quot; button after filling in the text box.<br/><br/>You can also enable or disable whether you would like to track demographics from the users by sliding the demographics button.<br/><br/>Green = ON<br/><br/>Gray   = OFF<br/><br/>When finished, tap the &quot;Submit&quot; button located in the upper-right corner.</p>',
						dockedItems: [{
							dock: 'top',
							xtype: 'toolbar',
							title: 'Create Survey Info'
						}]
					});
				}
				this.popup.show('pop');
			}
		};
		
		//titlebarC (instaniate new toolbar to allow acces to title to change dynamically)
		titlebarC = new Ext.Toolbar({
			id: 'createViewTitlebar',
			title: 'Create New Survey',
			dock:'top',
			items: [backButtonC, {xtype: 'spacer'}, infoButtonC, submitButtonC ]
		
		});
	//end title bar buttons
	//*****************************************************************************
	
		//generate new share code and compare with exisiting share codes to avoid duplicates
    function getShareCodeArray()
    {
			Ext.util.JSONP.request({
				url: "http://alexbehlen.com/webservice.php",
				params: {method: 'getSurveyCodes'},
				callbackKey: "callback",
                callback: function(result) { 
				
                    //generate new share code
					var shareCodeTemp = Math.floor(Math.random()*99999);
					
					//test if unique share code
					for(var i=0; i<result.table.length; i++)
                    {	
						if(result.table[i].row.SURVEY_CODE == shareCodeTemp)
						{
							//generate new share code if duplicate is found
							shareCodeTemp = Math.floor(Math.random()*99999);
						}
					}
					shareCodeC = shareCodeTemp;
					shareCodeField.setValue(shareCodeC);
                }
			});
		};
	
	
	//***************************************************************************
	//Card and Category Components
		
		addCategoryButtonC = {
				xtype: 'button',
				//ui: 'confirm',
				cls: 'plusButton',
				//text: 'Add Category',
				//width: 200,
				handler: function(){
					if(addCategoryField.getValue() != '')
					{
						//limit number of categories to six
						if(categoryNumberC < 6)
						{
                            //increment categoryNumber and add name to an array
							categoryNumberC ++;
							categoryArrayC.push(addCategoryField.getValue());
							
                            //create new category with taphold listener for delete function
							var category = 'category' + cardNumberC;
							category = new Ext.Panel({ items: [{
								height: 75,
								id:'category' + categoryNumberC,
								html: addCategoryField.getValue(),
								cls:'createCategory',}],
								//add category value name to array
								listeners: { 
									body: {taphold: function() {
										Ext.Msg.confirm('Delete Category', 'Would you like to delete?', function(button){
												if(button == 'yes')
												{	//delete category from array
													for(var i=0; i<categoryArrayC.length; i++){
														if(categoryArrayC[i] == category.body.dom.textContent){;
															categoryArrayC.splice(i,1);
														}												
													};
													category.destroy();
												}
										});
									}
									}
								}
									
							});	
							categoryPanelc.add(category);
							addCategoryField.reset();
							categoryPanelc.doLayout();
						}
						else
						{
							Ext.Msg.alert('Maximum number of categories created', 'Maximum number of categories created');
						}
					}				
				}	
		};
		
		//add cards
		addCardButtonC = {
				xtype: 'button',
				cls: 'plusButton',
				handler: function(){
					//add card if filed is not empty
					if(addCardField.getValue() != ''){
                    //increment cardNumber and add name to an array
					cardNumberC ++;
					cardArrayC.push(addCardField.getValue());
					//create new card with taphold listener for delete function
					var card = 'card' + cardNumberC;
						card   = new Ext.Panel({ items: [{
							id:'card1' + cardNumberC,
							height: 75,
							html: addCardField.getValue(),
							cls:'createCard',}],
							//double click delete listener
							listeners: { 
								body: {taphold: function() {
									Ext.Msg.confirm('Delete Card', 'Would you like to delete?', function(button){
										if(button == 'yes')
										{	//delete card from array
											for(var i=0; i<cardArrayC.length; i++){
												if(cardArrayC[i] == card.body.dom.textContent){
                                                    cardArrayC.splice(i,1);
												}												
											};
											card.destroy();
										}
									});
								
									}
								}
							}
						});
					
						cardPanelScroll.add(card);
						addCardField.reset();
						cardPanelScroll.doLayout();
					}			
				}	
		};
		
		addCardField = new Ext.form.Text({
			placeHolder: 'Enter card name',
            autoCapitalize: true,
			width: 227,
		});
		
		addCategoryField = new Ext.form.Text({
			placeHolder: 'Enter category name',
            autoCapitalize: true,
			width: 227,
		});
		
		//scrollable card panel
		cardPanelScroll = new Ext.Panel({
			height: 615,
			scroll: {
				direction: 'vertical',
				updateBoundaryOnTouchStart: true,
				revert: false,
				bounces: false,
            }
		});
		
        //cardPanelFields contains add card button and add card text field
        cardPanelFields = new Ext.Panel({
			cls:'newCardTextBox',
            dock: 'left',	
			layout: {type: 'hbox'},
			dockedItems: [{html:'Add Cards'}],
			items:[addCardField,  addCardButtonC]

		});
		
		cardPanelc = new Ext.Panel({
			dock: 'left',
            cls: 'createCards',	
			items:[cardPanelFields, cardPanelScroll]
        });
		
        //categoryPanelFields contains add category button and add category text field
		categoryPanelFields = new Ext.Panel({
            cls:'newCatTextBox',
			dock: 'right',	
			layout: {type: 'hbox'},
			dockedItems: [{html:'Add Categories'}],
			items:[addCategoryField,  addCategoryButtonC]
		});
		
		categoryPanelc = new Ext.Panel({
			cls: 'createCategories',
            dock: 'right',
			items:[categoryPanelFields]
		});
		
		addPanel = {
			xtype: 'panel',
			layout: 'hbox',
			dock: 'right',
			cls: 'addPanel',
			items:[categoryPanelc, cardPanelc]
		};
	//End card and category components
	//*******************************************************
	
	
    
	//*******************************************************
	//Begin Text field components
    
		nameField = new Ext.form.Text({
			name: 'name',
			label: 'Name',
			autoCapitalize: true,
        });
		
		//password and email fiels will be implimented in next version
		//intended to be used for an edit survey page and email notifications of recieved surveys
		/*
		passwordField = new Ext.form.Text({
			name: 'password',
			label: 'Password',
		});
		
		emailField = new Ext.form.Text({
			xtype: 'emailfield',
			name: 'email',
			label: 'Email'
		});
		*/
		
		descriptionField = new Ext.form.TextArea({
			name: 'description',
			label: 'Description',
			placeholder: 'Enter description for card sort survey',
			labelWidth: '35%',
			maxRows: 16,
			minRows: 15,
			height: 200,
			width: 350,
		});
		
		//demographicsToggle to set if survey demographics are enabled
		demographicsToggle = new Ext.form.Toggle({
			xtype: 'togglefield',
			name: 'demoToggle',
			label: 'Demographics',
            value: 1,
			labelWidth: '35%'
		});
		
		//display generataed share code
		shareCodeField = new Ext.form.Text({
			name: 'shareCode',
			label: 'Share Code',
            cls: 'shareCodeField',
			value: '',
			disabled: true
		});
		
        //ICON lower left
        iconContainerC = {
            xtype: 'container',
            html: '<img src="img/icon.png" class="icon-img" alt="icon to fill whitespace" />'
         }

		fieldHeaderC = new Ext.Panel({
			cls: 'fieldHeaderC',
			items: [{html: 'Survey Information'}]
		});
	
		//set up form fields
		fieldPanelC = {
			xtype: 'fieldset',
			id: 'namePasswordFieldSet',
			cls: 'textFields',
			defaults: {
				xtype: 'textfield',
				labelAlign: 'left',
				labelWidth: '35%',
                useClearIcon: true,
				width: 340
			},
			items: [nameField, /* passwordField, emailField, */ descriptionField, demographicsToggle, shareCodeField],
		};
		
		fieldContainer = new Ext.Container({
			cls: 'fieldPanel',
			items: [fieldHeaderC, fieldPanelC, iconContainerC]	
		});
		
		mainContainerC = new Ext.Container({
			layout: {type: 'hbox'},
			dock: 'top',
			items: [fieldContainer, addPanel],
		});
		

	//*****************************************************************
		Ext.apply(this, {
			dockedItems:[titlebarC, mainContainerC ],
		});
		
		CardSort.views.SortView.superclass.initComponent.call(this);
		
		//load share codes from web service
		getShareCodeArray()
	},
	
});
Ext.reg('CreateView', CardSort.views.CreateView);
