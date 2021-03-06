class PropertyEditor{

    constructor(config){
        this.config = config || {};
    }


    createEditor(widget, property){
        var $editor = $('<div class="veol-widget-editor-group"/>')

        if(this.config.onCreateEditor){
            this.config.onCreateEditor($editor, widget, property);
        }

        return $editor;
    }

    isLiveEdit(){
        return this.config.isLiveEdit === true;
    }

    hasEditionHandler(){
        return !!this.config.editionHandler;
    }

    afterDraw($editor, widget, property){
        // To be implemented by children that need logic after element is drawn
    }

    getValue($editor) {
        var valueGetter = $editor.data('veol-get-value');
        if(! typeof valueGetter == 'function'){
            throw 'Editor did not implement get value';
        }
        return valueGetter();
    }

}

export default PropertyEditor;
