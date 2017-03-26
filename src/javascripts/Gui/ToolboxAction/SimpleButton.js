class SimpleButton {
    constructor(text, action){

        this.$root = $(`<li class="veol-action-btn"/>`);
        this.$button = $(`<button class="veol-button">${text}</button>`);
        this.$button.appendTo(this.$root);

        var self = this;

        this.$button.click(function(e){
            action.call(self,[]);
        });

    }

    setButtonType(type){
        this.$button.addClass('veol-button-' + type);
    }

    setText(text){
        this.$button.html(text);
    }

    hide(){
        this.$root.addClass('veol-hide');
    }

    show(){
        this.$root.removeClass('veol-hide');
    }

}

export default SimpleButton;
