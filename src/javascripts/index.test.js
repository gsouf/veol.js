import Veol from './index'
import Column from './Test/Widgets/column'
import Columns from './Test/Widgets/columns'

Veol.Test = {
    Widgets: {
        Column,
        Columns
    },

    jasmineMatchers: {
        // To test veol exceptions in jasmine
        toThrowVeolType: function () {
            return {
                compare: function (actual, expected) {

                    try {
                        actual();
                        return {
                            pass: false,
                            message: 'No exception was thrown'
                        }
                    } catch(e) {
                        let pass = expected == e.errorType;
                        let message;

                        if(!pass){
                            message = 'Did not throw an exception of type "' + expected + '", error: ' + e;
                        } else {
                            message = 'Exception of type "' + expected + '" was thrown correctly';
                        }

                        return {
                            pass,
                            message
                        }
                    }
                }
            };
        }
    }
};

export default Veol;
