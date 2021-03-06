import PropertyEditor from '../PropertyEditor';


class SimpleInput extends PropertyEditor{

    constructor(){
        super({
            'isLiveEdit': true
        });

        var self = this;

        this.config.onCreateEditor = function($editor, widget, property){
            var $input = self.getInput($editor, widget, property);
            $input.on('input', function(){
                widget.application.updateWidgetData(
                    widget,
                    property.name,
                    $input.val(),
                    {editor: self} // Track edition source to dont update itself on change (se dataEdited bellow)
                );
            });

            $editor.data('veol-get-value', function(){
                return $input.val();
            });

            var value = widget.data[property.name];

            if(value){
                $input.val(value);
            }

            widget.addEventListener('dataEdited', function(propertyName, value){

                if(propertyName == property.name){
                    // Dont update on self edit (see updateWidgetData above)
                    if(!this.data.editor || this.data.editor !== self){
                        $input.val(value);
                    }
                }
            });


            self.drawEditor($editor, $input, widget, property);
        }

    }

    drawEditor($editor, $input, widget, property){
        $editor.append($input, widget, property);
    }

    getInput($editor, widget, property){
        throw 'This method is abstract and should be overriden by extending class';
    }
}


export default SimpleInput;
