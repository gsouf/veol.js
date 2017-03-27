import utils from "../utils"
import {titleDetails} from "../utils";
import WidgetCreator from './WidgetCreator'
import Component from './Component'

function setTreeNodeTitle($child, widget){
    var title;

    if(widget.widgetDefinition.config.title) {
        title = widget.widgetDefinition.config.title;
    }else {
        title = widget.widgetName;
    }



    if(widget.widgetDefinition.config.getDescription){
        let details = widget.widgetDefinition.config.getDescription(widget);
        if(typeof details === 'string'){
            title += ' ' + titleDetails(details);
        }
    }
    $child.find(">.veol-title .veol-title-text").empty().append(title);
}


/**
 *
 * @param {Tree} tree
 * @param {Object} widget
 * @param {WidgetDefinition} [widget.widgetDefinition]
 * @param {JQuery} $parent
 */
function drawWidget(tree, widget, $parent){
    var widgetDef = widget.widgetDefinition;
    var isContainer = widgetDef.isContainer();
    var $child = $(`<li class="veol-tree-node" data-wid="${widget.wid}"/>`);

    $child.appendTo($parent);

    // Associate widget with the dom element
    $child.data('widget-instance', widget);

    // Title area
    var $title = $(`<div draggable="true" class="veol-title"></div>`);
    $child.append($title);


    // Set Title value
    $title.append(`<span class="veol-title-text"></span>`);
    setTreeNodeTitle($child, widget);


    // Select the widget on click
    $title.click(function(evt){
        if(!evt.ctrlKey){
            tree.application.unselectAllWidgets(widget);
        }
        tree.application.selectWidget(widget);
    });

    if (isContainer) {

        // Folder icon
        var $folder = $(`<div class="veol-folder"></div>`);
        $title.prepend($folder);
        $folder.click(function(){
            $child.toggleClass('open')
        });

        // Add icon
        var $addIcon = $(`<div class="veol-add"></div>`);
        $title.append($addIcon);
        $addIcon.click(function(){
            tree.widgetCreator.createForParent(widget);
        });

        // Container classes
        $child.addClass('is-container open');

        // Children
        var $subParent = $(`<ul class="veol-children"/>`);
        $subParent.appendTo($child);
        for(var i = 0; i < widget.children.length; i++){
            drawWidget(tree, widget.children[i], $subParent);
        }
    }

    // delete icon
    var $delete = $(`<div class="veol-menu-delete"></div>`);
    $title.append($delete);
    $delete.click(function(){

        var message = 'Supprimer le widget ?';

        if(widget.widgetDefinition.isContainer()){

            message += '<br/>' + 'Les sous widgets seront également supprimés';
        }

        tree.application.yesNo.ask(message, function(){
            tree.application.deleteWidget(widget);
        });
    });



    // Add the title fill area
    $title.prepend('<div class="veol-tree-fill"></div>');


    var removeDndClasses = function($element){
        var $parent = $element.parent('.veol-tree-node');

        $parent.removeClass('veol-drag-over');
        $parent.removeClass('veol-can-drop-next');
        $parent.removeClass('veol-can-drop-inside');
        $parent.removeClass('veol-will-drop-before');
        $parent.removeClass('veol-will-drop-after');
        $parent.removeClass('veol-will-drop-inside');
    };


    // Drag drop events
    $title.on('dragstart', function(e){
        tree.$dragging = $child;
        $child.addClass('veol-dragging');

        // Has drag helps to know that the tree has a currently dragging element
        // And allows to apply "cursor-event: none" (from css) to prevent dragenter on child element of title
        tree.$root.addClass('veol-tree-has-drag');

    });
    $title.on('dragend', function(e){
        tree.$dragging = null;
        $(this).parent('.veol-tree-node').removeClass('veol-dragging');
        tree.$root.removeClass('veol-tree-has-drag');
    });

    $title.on('dragenter', function(e){

        // Make sure that the data comes from the same tree
        if(!tree.isDragging()){
            return;
        }

        // Check that element is not dropped on a child
        var $draggedParent = $title.closest('.veol-dragging');
        if($draggedParent.length !== 0){
            return;
        }

        var canBeDroppedNext = false;
        var canBeDroppedInside = false;

        // Check if it can be dropped before or after the element
        var droppedWidget = tree.getDraggedWidget();
        if(
            widget.parent.widgetDefinition.allowedAsChild(droppedWidget)
            && droppedWidget.widgetDefinition.allowedAsParent(widget.parent)
        ) {
            canBeDroppedNext = true;
            $title.parent('.veol-tree-node').addClass('veol-can-drop-next');
        }

        // Check if it can be dropped inside the element
        if(
            isContainer
            && widget.widgetDefinition.allowedAsChild(droppedWidget)
            && droppedWidget.widgetDefinition.allowedAsParent(widget)
        ) {
            canBeDroppedInside = true;
            $title.parent('.veol-tree-node').addClass('veol-can-drop-inside');
        }

        if(canBeDroppedInside || canBeDroppedNext){
            $title.parent('.veol-tree-node').addClass('veol-drag-over');
        }

    });

    $title.on('dragleave', function(e){
        removeDndClasses($title);
    });

    $title.on('dragover', function(e){
        // In drag enter we already were told if the drop is possible and where it is possible
        // Now we will determine how we drop the element (before, after, inside) depending on the mouse position
        // on the target
        if($child.hasClass('veol-drag-over')) {
            var childOffset= $child.offset();
            var mouseYInChild = e.clientY - childOffset.top;
            var mouseYInPercent = mouseYInChild * 100 / $title.outerHeight();

            $title.parent('.veol-tree-node').removeClass('veol-will-drop-before');
            $title.parent('.veol-tree-node').removeClass('veol-will-drop-after');
            $title.parent('.veol-tree-node').removeClass('veol-will-drop-inside');


            if (
                // This first condition checks if the element is droppable inside by either being in the middle
                // or having drop inside as the only one option
                $child.hasClass('veol-can-drop-inside')
                && (
                    (mouseYInPercent > 30 && mouseYInPercent < 70) || !$child.hasClass('veol-can-drop-next')
                )
            ) {
                $child.addClass('veol-will-drop-inside');
            } else {
                // If mouse is in the upper half part of the element we drop be fore
                if (mouseYInPercent <= 50) {
                    $child.addClass('veol-will-drop-before');
                } else if (isContainer && widget.children.length > 0) {
                    if ($child.hasClass('veol-can-drop-inside')) {
                        $child.addClass('veol-will-drop-inside');
                    } else {
                        $child.addClass('veol-will-drop-before');
                    }
                } else {
                    $child.addClass('veol-will-drop-after');
                }
            }

            e.preventDefault();
        }
    });

    $title.on('drop', function(e){
        e.preventDefault();
        // Make sure that the element was marked as an acceptable target (from drag enter)
        if($child.hasClass('veol-drag-over')){
            var droppedWidget = tree.getDraggedWidget();
            if(droppedWidget && droppedWidget !== widget){
                var operationType = null;
                if($child.hasClass('veol-will-drop-before')){
                    utils.insertWidgetBefore(widget, droppedWidget);
                    operationType = 'before';
                } else if ($child.hasClass('veol-will-drop-after')) {
                    utils.insertWidgetAfter(widget, droppedWidget);
                    operationType = 'after';
                } else if ($child.hasClass('veol-will-drop-inside')) {
                    utils.appendWidget(widget, droppedWidget);
                    operationType = 'inside';
                }

                if(operationType){
                    tree.application.dispatchEvent('widgetMoved', [droppedWidget, widget, operationType]);
                }
            }
            removeDndClasses($(this));


        }
    });

}

function bindApplication(application, self){

    application.addEventListener('widgetMoved', function(movedWidget, target, operationType){
        var $target = self.$root.find(`[data-wid=${target.wid}]`);
        var $moved = self.$root.find(`[data-wid=${movedWidget.wid}]`);
        switch(operationType){
            case 'inside':
                $moved.appendTo($target.find('.veol-children').first());
                break;
            case 'after':
                $moved.insertAfter($target);
                break;
            case 'before':
                $moved.insertBefore($target);
                break;
            default:
                console.error(`unknown operation type ${operationType}`)
        }
    });

    application.addEventListener('widgetDeleted', function(widget){
        self.$root.find(`[data-wid=${widget.wid}]`).remove();
    });


    application.addEventListener('widgetSelected', function(widget){
        self.$root.find(`[data-wid=${widget.wid}]`).addClass('veol-widget-selected');
    });

    application.addEventListener('unselectAllWidgets', function(){
        self.$root.find('.veol-widget-selected').removeClass('veol-widget-selected');
    });

    application.addEventListener('widgetDataEdited', function(widget, property, value){
        setTreeNodeTitle(self.$root.find(`[data-wid=${widget.wid}]`), widget);
    });

    application.addEventListener('widgetAdded', function(widget){
        var parentId = widget.parent.wid;

        var $into;

        // if the parent is the first parent (root of the data) then we add it to the $screen directly
        // because the root element is not included in the preview
        if(parentId == application.data.wid){
            $into = self.$root.find(`.veol-root`);
        } else {
            $into = self.$root.find(`[data-wid=${parentId}]`).find('.veol-children').first();
            console.log($into);
        }

        drawWidget(self, widget, $into);
    });
}

class Tree extends Component{

    constructor(application){
        super();
        this.$root.addClass('veol-tree veol-toolbox');
        this.$dragging = null;
        this.application = application;

        this.$header = $(
            `<div class="veol-toolbox-header" >
                <ul>
                    <li class="veol-title">Widgets</li>
                    <li class="veol-fill"></li>
                </ul>
            </div>`
        );

        this.$root.append(this.$header);
        this.widgetCreator = new WidgetCreator(application); // TODO make it available from config


        var self = this;

        // Add widget action
        var $addWidget = $(`<li class="veol-action" veol-action="add-widget" title="Ajouter un widget"><i class="fa fa-plus fa-fw"></i></li>`);
        this.$header.find('>ul').append($addWidget);
        $addWidget.click(function(){
            self.widgetCreator.createForParent();
        });



        this.draw();
        bindApplication(application, this);
    }


    draw(){

        this.$root.find('.veol-root').remove();

        var $parent = $(`<ul class="veol-root veol-children"/>`);
        $parent.appendTo(this.$root);

        var data = this.application.data;

        for(var i = 0; i < data.children.length; i++){
            drawWidget(this, data.children[i], $parent);
        }
    }

    isDragging() {
        return this.$dragging !== null;
    }

    getDraggedElement(){
        return this.$dragging;
    }

    getDraggedWidget(){
        return this.$dragging.data('widget-instance');
    }

}

export default Tree;
