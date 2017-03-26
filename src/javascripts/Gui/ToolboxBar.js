class ToolboxBar{

    constructor(){
        this.$root = $('<div class="veol-toolbox-header"><ul></ul></div>');
    }

    append(element){
        let typeofElement = typeof  element;

        let $element;

        if(typeofElement === 'string'){
            switch (element){
                case '->':
                    $element = $('<li class="veol-fill"></li>');
                    break;
                case '|':
                    $element = $('<li class="veol-divider"></li>');
                    break;
                default:
                    $element = $(`<li class="veol-text">${element}</li>`);
                    break;
            }
        } else if(typeofElement === 'object') {
            $element = element.$root;
        }

        this.$root.children('ul').append($element);

    }

}

export default ToolboxBar;
