import PropertyEditor from '../PropertyEditor';


export default class Checkbox extends PropertyEditor{

    constructor(){
        super({
            'isLiveEdit': true
        });

        var self = this;

        this.config.onCreateEditor = function($editor, widget, property){
            var $input = $('<input type="checkbox" />');
            $input.on('change', function(){
                widget.application.updateWidgetData(widget, property.name, $input.is(':checked'));
            });

            $editor.data('veol-get-value', function(){
                return $input.is(':checked');
            });

            var value = widget.data[property.name];

            if(value){
                $input.prop('checked', !!value);
            }

            widget.addEventListener('dataEdited', function(propertyName, value){
                if(propertyName == property.name){
                    $input.prop('checked', !!value);
                }
            });

            $editor.append($input);
        }

    }
}
