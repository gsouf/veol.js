class Component{
    constructor(){
        this.$root = $('<div class="veol-component"></div>');
    }

    getComponentRoot(){
        return this.$root;
    }
}


export default Component;
