import SimpleInput from './SimpleInput';


class TextArea extends SimpleInput{

    getInput($editor, widget, property) {
        return $('<textarea/>');
    }

    isLiveEdit(){
        return false;
    }

}

export default TextArea;
