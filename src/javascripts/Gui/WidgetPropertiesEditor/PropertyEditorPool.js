import TextField from './Editor/TextField'
import TextArea from './Editor/TextArea'
import Select from './Editor/Select'
import Range from './Editor/Range'
import Checkbox from './Editor/Checkbox'
import Color from './Editor/Color'


function loadDefaults(pool){
    pool.addEditor(['textField', 'textfield'], new TextField());
    pool.addEditor(['text', 'textArea'], new TextArea());
    pool.addEditor(['select'], new Select());
    pool.addEditor(['range'], new Range());
    pool.addEditor(['checkbox'], new Checkbox());
    pool.addEditor(['color'], new Color());
}

class PropertyEditorPool{

    constructor(config){

        config = config || config;

        this.editors = [];

        if(config.loadDefaults){
            loadDefaults(this);
        }
    }

    addEditor(names, editor){
        this.editors.push({
            names: names,
            editor: editor
        });
    }

    findEditor(name){
        for(var i = 0; i<this.editors.length; i++){
            if(this.editors[i].names.indexOf(name) > -1){
                return this.editors[i].editor;
            }
        }
        return null;
    }

}

export default PropertyEditorPool;
