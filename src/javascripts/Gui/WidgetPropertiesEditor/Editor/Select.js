import SimpleInput from './SimpleInput';


class Select extends SimpleInput{


    getInput($editor, widget, property) {


        var $select = $('<select />');

        if(property.multiple){
            $select.prop('multiple', true);
        }

        for(var i= 0; i < property.options.length; i++){
            var opt = property.options[i];
            var optType = typeof opt;

            if (optType == 'string' || optType == 'number') {
                $select.append(`<option value="${opt}" >${opt}</option>`);
            } else {
                $select.append(`<option value="${opt.value}" >${opt.label}</option>`);
            }

        }

        return $select;

    }
}

export default Select;
