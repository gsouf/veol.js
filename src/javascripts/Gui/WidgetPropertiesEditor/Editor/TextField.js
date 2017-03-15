import SimpleInput from './SimpleInput';


class TextField extends SimpleInput{

    getInput() {
        return $('<input type="text" />');
    }
}


export default TextField;
