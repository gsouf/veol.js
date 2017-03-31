import SimpleInput from './SimpleInput';


export default class Color extends SimpleInput{

    getInput() {
        return $('<input type="color" />');
    }
}
