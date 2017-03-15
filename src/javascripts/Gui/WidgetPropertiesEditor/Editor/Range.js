import SimpleInput from './SimpleInput';


class Range extends SimpleInput{

    getInput($editor, widget, property) {
        var min = property.min || 0;
        var max = property.max || min + 100;
        var step = property.step || 1;

        return $(`<input type="range" min="${min}" max="${max}" step="${step}" />`);
    }

    drawEditor($editor, $input, widget, property){

        var $count = $('<span class="veol-range-preview"></span>');

        $count.html($input.val());

        $editor.addClass('veol-combined-range');

        $editor.append($count);
        $editor.append($input);

        widget.addEventListener('dataEdited', function(propertyName, value){
            if(propertyName == property.name){
                $count.html(value);
            }
        });

    }
}


export default Range;
