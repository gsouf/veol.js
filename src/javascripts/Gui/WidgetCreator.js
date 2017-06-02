import utils from '../utils';
import WidgetCreatorFieldEditor from './WidgetCreatorFieldEditor'

function createWidgetButton(widgetName, widgetDef){

    var widgetTitle;

    if (widgetDef.config.title) {
        widgetTitle = widgetDef.config.title;
    } else {
        widgetTitle = widgetName;
    }

    var iconClass = utils.getWidgetIconClass(widgetDef);
    if(!iconClass){
        iconClass = 'fa fa-lg fa-question-circle-o';
    }
    var icon = `<i class="${iconClass}"></i>`;


    var $widgetButton = $(
        `<div class="veol-button veol-button-large veol-button-widget" title="${widgetTitle}" veol-widget-name="${widgetName}">
            <div class="veol-icon">${icon}</div>
            <div class="veol-widget-name">${widgetTitle}</div>
        </div>`
    );


    return $widgetButton;

}

class WidgetCreator{

    constructor(application){

        this.application = application;

        this.$root = $(`
          <div class="veol-modal veol-widget-creator">
            <div class="veol-modal-background"></div>
            <div class="veol-modal-display-area">
                <div class="veol-modal-header">
                    <div class="veol-modal-title">Ajouter un Widget</div>
                </div>
                <div class="veol-modal-content">
                    <ul class="veol-creator-widgetlist"></ul>
                </div>
                <div class="veol-modal-footer">
                    <div veol-close class="veol-button veol-button-cancel">Annuler</div>
                    <div class="veol-button veol-button-validate">Valider</div>
                </div>
            </div>
          </div>
        `);

        this.$root.hide();

        this.$widgetList = this.$root.find('.veol-creator-widgetlist');


        let self = this;

        utils.bindModal(this.$root, function(){
            self.$root.hide();
        });

        $('body').append(this.$root);

        this.$root.find('.veol-button-validate').click(function(){
            if($(this).attr('disabled')){
                return;
            }

            self.close();

            let widgetDefName = self.$root.find('.veol-button-widget.veol-selected').attr('veol-widget-name');
            let parent = $(this).data('veol-parent');


            let fieldsEditor = new WidgetCreatorFieldEditor(application, widgetDefName);
            fieldsEditor.create(parent, function(newWidget){
                parent.children.push(newWidget);

                self.application.dispatchEvent('widgetAdded', [newWidget]);

                self.application.unselectAllWidgets();
                self.application.selectWidget(newWidget);
            });

        });

    }

    createForParent(parentWidget){

        if(!parentWidget){
            parentWidget = this.application.data;
        }

        var parentWidgetDef = parentWidget.widgetDefinition;
        var allWidgetDef = this.application.pageMaker.widgets;

        var availableWidgetDef = [];

        for(var i in allWidgetDef){
            if(parentWidgetDef.allowedAsChild(allWidgetDef[i]) && allWidgetDef[i].allowedAsParent(parentWidgetDef)){
                availableWidgetDef[i] = allWidgetDef[i];
            }
        }


        this.$widgetList.empty();

        for(var i  in availableWidgetDef){
            var $item = createWidgetButton(i, availableWidgetDef[i]);
            this.$widgetList.append($item);
        }

        var self = this;

        this.$root.find('.veol-button-validate').attr('disabled', true);
        this.$root.find('.veol-button-validate').data('veol-parent', parentWidget);
        this.$root.find('.veol-button-validate').html('Selectionnez un widget');

        this.$widgetList.find('.veol-button-widget').click(function(){
            self.$widgetList.find('.veol-selected').removeClass('veol-selected');
            $(this).addClass('veol-selected');

            self.$root.find('.veol-button-validate').removeAttr('disabled', true);
            self.$root.find('.veol-button-validate').html('Ajouter le widget');
        });

        if(this.$widgetList.length == 1){
            this.$widgetList.children().first().trigger('click');
        }

        this.$root.show();
    }

    close(){
        this.$root.hide();
    }

}

export default WidgetCreator;
