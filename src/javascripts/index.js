import PageMaker from './PageMaker';
import WidgetDefinition from './WidgetDefinition';
import utils from "./utils"
import {titleDetails} from "./utils"

// Gui
import Tree from './Gui/Tree'
import Preview from './Gui/Preview'
import WidgetPropertiesEditor from './Gui/WidgetPropertiesEditor'
import WidgetCreator from './Gui/WidgetCreator'
import Viewport from './Gui/Viewport'
import ToolboxBar from './Gui/ToolboxBar'

// Toolbax action
import SimpleButton from './Gui/ToolboxAction/SimpleButton'
import PreviewDeviceSwitch from './Gui/ToolboxAction/PreviewDeviceSwitch'

import Error from './Error'

// Editor
import PropertyEditor from './Gui/WidgetPropertiesEditor/PropertyEditor'
import EditorSimpleInput from './Gui/WidgetPropertiesEditor/Editor/SimpleInput'

var Veol = {
    PageMaker,
    WidgetDefinition,

    Gui: {
        Tree,
        Preview,
        WidgetPropertiesEditor,
        WidgetCreator,
        Viewport,
        ToolboxBar,
        ToolboxAction: {
            SimpleButton,
            PreviewDeviceSwitch
        }
    },

    PropertyEditor,

    utils,
    titleDetails,

    Error

};

Veol.propertyEditor.simpleInput = EditorSimpleInput;

export default Veol;
