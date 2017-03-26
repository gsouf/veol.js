import WidgetDefinition from "../../WidgetDefinition";

export default WidgetDefinition.create({
    isContainer: true,
    preview: {
        onCreateContainer: function($element){
            $element.addClass('veol-row');
        }
    },

    title: 'Column Group',

    faIconName: 'columns',

    types: ['column-container'],
    childrenWhitelist: ['column']
});
