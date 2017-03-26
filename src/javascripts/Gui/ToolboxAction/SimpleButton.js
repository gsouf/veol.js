class SimpleButton {
    constructor(text, action){

        this.$root = $(`<li class="veol-action-btn"/>`);
        this.$button = $(`<button class="veol-button">${text}</button>`);
        this.$button.appendTo(this.$root);

        this.$button.click(function(){
            action();
        });

    }

    setButtonType(type){
        this.$button.addClass('veol-button-' + type);
    }

}

export default SimpleButton;
