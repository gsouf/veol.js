import WidgetDefinition from "../../WidgetDefinition";

export default WidgetDefinition.create({
    isContainer: true,

    title: 'Column',

    preview: {
        onDataChange: function($outer, $preview, widget){

            var size = widget.data.size;

            if(!size){
                size = 12;
            }


            var classes = $outer.attr("class").split(' ');
            $.each(classes, function(i, c) {
                if (c.indexOf("veol-col-") == 0) {
                    $outer.removeClass(c);
                }
            });

            $outer.addClass(`veol-col-sm-${size}`);

            if(widget.data['size-md']){
                $outer.addClass(`veol-col-md-${widget.data['size-md']}`);
            }
            if(widget.data['size-lg']){
                $outer.addClass(`veol-col-lg-${widget.data['size-lg']}`);
            }
            if(widget.data['size-xl']){
                $outer.addClass(`veol-col-xl-${widget.data['size-xl']}`);
            }

        }
    },

    getDescription: function(widget){
        var size = widget.data.size;
        var title = '';

        if(size){
            title += size;
        }

        if(widget.data['size-md']){
            title += ` m:${widget.data['size-md']}`;
        }
        if(widget.data['size-lg']){
            title += ` l:${widget.data['size-lg']}`;
        }
        if(widget.data['size-xl']){
            title += ` xl:${widget.data['size-xl']}`;
        }

        return title;
    },

    properties: [
        {
            name: 'size',
            label: 'Largeur',
            editor: 'range',
            tooltip: 'Largeur pour mobile et +',

            min: 1,
            max: 12,
            step: 1
        },
        {
            name: 'size-md',
            label: 'Largeur Tablette',
            editor: 'range',
            tooltip: 'Largeur pour tablettes et +',
            nullable: true,
            defaultValue: null,
            defaultIfNull: 6,

            min: 1,
            max: 12,
            step: 1
        },
        {
            name: 'size-lg',
            label: 'Largeur Desktop',
            editor: 'range',
            tooltip: 'Largeur pour ordinateur et +',
            nullable: true,
            defaultValue: null,
            defaultIfNull: 6,

            min: 1,
            max: 12,
            step: 1
        },
        {
            name: 'size-xl',
            label: 'Largeur GD Desktop',
            editor: 'range',
            tooltip: 'Largeur pour ordinateur avec très grand écran',
            nullable: true,
            defaultValue: null,
            defaultIfNull: 6,

            min: 1,
            max: 12,
            step: 1
        }
    ],

    types: ['column'],
    parentWhitelist: ['column-container']
});
