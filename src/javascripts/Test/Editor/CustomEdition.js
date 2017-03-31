import PropertyEditor from '../../Gui/WidgetPropertiesEditor/PropertyEditor'

export default class CustomEdition extends PropertyEditor{

    constructor(){
        super();

        this.config.editionHandler = function(widget, property){
            alert('Custom Edition');
        };
    }

}
