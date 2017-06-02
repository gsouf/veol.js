class Viewport {

    constructor(application){
        this.application = application;
        this.$root = $('<div class="veol-viewport"/>');

        this.$mainPannel = $('<div class="veol-vp-main"/>');
        this.$mainPannel.appendTo(this.$root);

        this.$leftPannel = $('<div class="veol-vp-left veol-vp-toolbox-container"/>');
        this.$leftPannel.prependTo(this.$root);

        this.$rightPannel = $('<div class="veol-vp-right veol-vp-toolbox-container"/>');
        this.$rightPannel.appendTo(this.$root);
    }

    setMainComponent(component){
        component.getComponentRoot().appendTo(this.$mainPannel);
    }

    appendLeftToolbox(component){
        component.getComponentRoot().appendTo(this.$leftPannel);
        this.showLeftPannel()
    }

    appendRightToolbox(component){
        component.getComponentRoot().appendTo(this.$rightPannel);
        this.showRightPannel();
    }

    hideRightPannel(){
        this.$rightPannel.removeClass('veol-show');
    }

    showRightPannel(){
        this.$rightPannel.addClass('veol-show');
    }

    hideLeftPannel(){
        this.$leftPannel.removeClass('veol-show');
    }

    showLeftPannel(){
        this.$leftPannel.addClass('veol-show');
    }

    appendTo(element){
        $(element).append(this.$root);
    }

}

export default Viewport;
