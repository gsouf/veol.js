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
        this.$leftPannel.addClass('veol-show');
    }

    appendRightToolbox(component){
        component.getComponentRoot().appendTo(this.$rightPannel);
        this.$rightPannel.addClass('veol-show');
    }


    appendTo(element){
        $(element).append(this.$root);
    }

}

export default Viewport;
