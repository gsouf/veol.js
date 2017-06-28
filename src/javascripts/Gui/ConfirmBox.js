import utils from '../utils';

class ConfirmBox{

    constructor(application){
        this.application = application;


        this.$root = $(`
          <div class="veol-modal">
            <div class="veol-modal-background"></div>
            <div class="veol-modal-display-area veol-controls">
                <div class="veol-modal-header">
                    <div class="veol-modal-title">Confirmer</div>
                    <div veol-close><i class="fa fa-times fa-fw"></i></div>
                </div>
                <div class="veol-modal-content"></div>
                <div class="veol-modal-footer">
                    <div class="veol-button veol-button-validate">Oui</div>
                    <div class="veol-button veol-button-cancel">Non</div>
                </div>
            </div>         
          </div>
        `);

        this.$root.hide();

        this.$modalContent = this.$root.find('.veol-modal-content');


        var self = this;

        utils.bindModal(this.$root, function(){
            self.close();
        });

        $('body').append(this.$root);

        this.$root.find('.veol-button-validate').click(function(){
            self.close();

            if(self._yes){
                self._yes();
            }
        });

        this.$root.find('.veol-button-cancel').click(function(){
            self.close();

            if(self._no){
                self._no();
            }
        });

    }

    ask(message, yesHandler, noHandler){
        this._yes = yesHandler;
        this._no = noHandler;

        this.$modalContent.html(message);

        this.$root.show();
    }

    close(){
        this.$root.hide();
    }

}

export default ConfirmBox;
