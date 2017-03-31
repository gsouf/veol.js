import utils from '../utils';

class SingleFieldEditor{

    constructor(widget, property){

        this.widget = widget;
        this.property = property;

        var label = property.label || property.name;

        this.$root = $(`
          <div class="veol-modal">
            <div class="veol-modal-background"></div>
            <div class="veol-modal-display-area veol-controls">
                <div class="veol-modal-header">
                    <div class="veol-modal-title">Edition du champs ${label}</div>
                </div>
                <div class="veol-modal-content"></div>
                <div class="veol-modal-footer">
                    <div class="veol-button veol-button-validate">Valider</div>
                    <div veol-close class="veol-button veol-button-cancel">Annuler</div>
                </div>
            </div>         
          </div>
        `);

        this.$root.hide();

        this.$modalContent = this.$root.find('.veol-modal-content');

        var editor = utils.getPropertyEditor(property, widget.application.pageMaker.editorPool);
        var $editor = editor.createEditor(widget, property);

        this.$modalContent.append($editor);

        var self = this;

        utils.bindModal(this.$root, function(){
            self.$root.hide();
            self.cancel();
        });

        $('body').append(this.$root);

        this.$root.find('.veol-button-validate').click(function(){
            self.close();
            if(!editor.isLiveEdit()){
                editor.getValue($editor);
            }
        });

    }

    show(){
        this.backupData = this.widget.data[this.property.name];
        this.$root.show();
    }

    close(){
        this.$root.hide();
    }

    cancel(){
        if(this.hasOwnProperty('backupData')){
            this.widget.application.updateWidgetData(this.widget, this.property.name, this.backupData);
            delete this.backupData;
        }


    }

}

export default SingleFieldEditor;
