import PageMaker from './PageMaker';
import WidgetDefinition from './WidgetDefinition';
import utils from "./utils"
import {titleDetails} from "./utils"
import Tree from './Gui/Tree'
import Preview from './Gui/Preview'
import WidgetPropertiesEditor from './Gui/WidgetPropertiesEditor'
import WidgetCreator from './Gui/WidgetCreator'

var Veol = {
    PageMaker,
    WidgetDefinition,

    Gui: {
        Tree,
        Preview,
        WidgetPropertiesEditor,
        WidgetCreator
    },
    utils,
    titleDetails

};

export default Veol;
