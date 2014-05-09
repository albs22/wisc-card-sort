Ext.regApplication({
    name: 'CardSort',
	defaultUrl: 'Main/index',
    launch: function()
    {
       this.viewport = new CardSort.views.Viewport();
	   
    }
});


/* ************************************************************
*	Wisc Card Sort
	Developed by: Alex Behlen, Austin Kolodziej, Greg Hagen
    
    **Documentaion**
    
    Wisc card sort is a allows users to create a simple card standalone card sort, create a card sort survey for distribution, take create survey, and view the results of surveys taken
    
    Sort Page allows user to create a card sort with customizable categories and create customizeable cards. 
    
    The take page allows users to enter a survey code generated from the create survey page and perform a card sort with predifined cards and categories. The user may enter demographic information if they wish and the results of the sort will be captured.

    The info button icon image data is encoded into the css file from the sass stylesheet

	**Library Modifications**
	************************************
        **sencha-touch.css**
            css-debug/sencha-touch.css modifed lines 312 - 314. 313 commented out to allow dragging outside of scrollable container
       
       **sencha-touch-debug-w-comment.js**
           added try catch to 28839 to catch error when recreating draggable listners
            lines 24178 - 24179 modified to fix sencha touch draggable revert bug http://www.sencha.com/forum/showthread.php?142369-Draggable-revert-false-prevents-intersections-working
            lines 24747 - 24753 commented out to removed to allow cards to be redragged once dropped
            line 24761 allows cards to revert after being dropped multiple times
            line 24713 -24714 modified to pevent cls from being removed after drop
            line 24592 changed to true to always are droppable monitoring

       **Caution** Be careful when working with any draggable and droppable listeners. The sencha touch library has
            been modifed and there may be unexpected results.
            
         
     **Know Issues and Bugs**
     ************************************
        When the take page is re-entered the dropzones under previous categories are do not work. If the next survey has more categories
                has more categories the extra categories will work
        Two cards can be dropped into the same dropzone
               
                  
                        
            
    **TODO**
    ************************************
        Improve MVC Structure
        Create global webserviceURL variable
        
        
        
Copyright (c) 2011 UW System
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files of Wisc Card Sort, to work in the Software, including without limitation the rights to use, copy, modify, merge, and to permit persons to whom the Software is furnished to do so. Unauthorized usage: to publish, distribute, or sublicense. All the above is subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 


*/