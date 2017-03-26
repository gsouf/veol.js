class PreviewDeviceSwitch {

    constructor(preview){
        this.preview = preview;

        this.$root = $(
        `<li class="veol-list-inline">
            <div class="veol-label">Device:</div>
            <div class="veol-list-choices">
                <ul>
                    <li class="device-button veol-active" data-device="small">
                        <i class="fa fa-mobile fa-fw"></i>
                    </li>
                    <li class="device-button" data-device="medium">
                        <i class="fa fa-tablet fa-fw"></i>
                    </li>
                    <li class="device-button" data-device="large">
                        <i class="fa fa-laptop fa-fw"></i>
                    </li>
                    <li class="device-button" data-device="xlarge">
                        <i class="fa fa-desktop fa-fw"></i>
                    </li>
                </ul>
            </div>
        </li>`
        );

        var self = this;

        this.$root.find('.device-button').click(function(){
            var device = $(this).attr('data-device');
            preview.setDevice(device);
        });



        preview.addEventListener('deviceChanged', function(newDevice, oldDevice){
            // Update the active button on device change
            self.$root.find('.device-button.veol-active').removeClass('veol-active');
            self.$root.find(`.device-button[data-device=${newDevice}]`).addClass('veol-active');
        });

    }
}


export default PreviewDeviceSwitch;
