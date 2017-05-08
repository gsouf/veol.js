var insertWidgetAt = function(insertWidget, at, inParent){

    if(insertWidget.parent) {
        var indexInBaseParent = insertWidget.parent.children.indexOf(insertWidget);
        insertWidget.parent.children.splice(indexInBaseParent, 1);

        // If inserted in the same parent we might need to correct the index
        if(inParent === insertWidget.parent && at >= indexInBaseParent){
            at--;
        }
    }

    inParent.children.splice(at, 0, insertWidget);

    insertWidget.parent = inParent;
};


var arrayContainsOneOf = function(testArray, dataArray) {
    for(let i = 0; i < dataArray.length; i++){
        if(testArray.indexOf(dataArray[i]) >= 0){
            return true;
        }
    }
    return false;
};

function createEvent(){
    var stopped = false;
    var Event = {
        stop: function(){
            stopped = true;
        },

        isStopped: function(){
            return stopped;
        }
    };

    return Event;
}

var titleDetails = function(title){
    return `<span class='veol-title-details'>${title}</span>`;
};

export {titleDetails};

export default {

    /**
     * Extends the prototype of the given object to be observable (and compatible with RxJS)
     * @param target
     * @param directBind by default observablemethods re added on the prototype but it's possible to add them
     * directly as object properties by passing this param to true
     */
    makeObservable: function (target, directBind){

        var realTarget;
        if(directBind){
            realTarget = target;
        } else {
            realTarget = target.prototype;
        }

        realTarget.addEventListener = function(name, callback){
            var eventTarget = directBind ? realTarget : this;

            if (!eventTarget.hasOwnProperty('__veol_callbacks')) {
                eventTarget.__veol_callbacks = {};
            }

            if(!eventTarget.__veol_callbacks.hasOwnProperty(name)) {
                eventTarget.__veol_callbacks[name] = [];
            }

            eventTarget.__veol_callbacks[name].push(callback);
        };

        realTarget.removeEventListener = function(name, callback){
            var eventTarget = directBind ? realTarget : this;

            if(eventTarget.hasOwnProperty('__veol_callbacks') && eventTarget.__veol_callbacks.hasOwnProperty(name)){
                for(var i = eventTarget.__veol_callbacks[name].length - 1; i >= 0; i--) {
                    if (eventTarget.__veol_callbacks[name][i] === callback) {
                        eventTarget.__veol_callbacks[name].splice(i, 1);
                    }
                }
            }
        };

        realTarget.dispatchEvent = function(name, properties){
            var eventTarget = directBind ? realTarget : this;

            var event = createEvent();

            if(eventTarget.hasOwnProperty('__veol_callbacks') && eventTarget.__veol_callbacks.hasOwnProperty(name)){
                for(var i = 0; i < eventTarget.__veol_callbacks[name].length; i++) {
                    eventTarget.__veol_callbacks[name][i].apply(event, properties);
                    if(event.isStopped()){
                        break;
                    }
                }
            }
        }



    },

    insertWidgetBefore: function (beforeWidget, insertWidget){
        let parent = beforeWidget.parent;
        if(!parent){
            throw 'target widget has no parent';
        }
        if(!parent.children){
            throw 'target widget has invalid parent (no children registered)';
        }

        var index = parent.children.indexOf(beforeWidget);
        if(index === -1){
            throw 'target widget has invalid parent (widget not found in parent)';
        }

        insertWidgetAt(insertWidget, index, parent);
    },

    insertWidgetAfter: function (afterWidget, insertWidget){
        let parent = afterWidget.parent;
        if(!parent){
            throw 'target widget has no parent';
        }
        if(!parent.children){
            throw 'target widget has invalid parent (no children registered)';
        }

        var index = parent.children.indexOf(afterWidget) + 1;
        if(index === -1){
            throw 'target widget has invalid parent (widget not found in parent)';
        }

        insertWidgetAt(insertWidget, index, parent);
    },

    appendWidget: function(parent, insertWidget){
        if(!parent.children){
            throw 'target widget has invalid parent (no children registered)';
        }
        insertWidgetAt(insertWidget, parent.children.length, parent)
    },

    insertWidgetAt: insertWidgetAt,


    domIndexOf(child, parent) {
        return Array.prototype.indexOf.call(
            parent.children,
            child
        )
    },

    arrayContainsOneOf,

    whitelistBlacklistChecker(whiteList, blackList, items){
        items = items || [];
        // If is in blacklist
        if(blackList && blackList.length > 0 && arrayContainsOneOf(blackList, items)){
            return false;
        }
        // If not in whitelist
        return !(whiteList && whiteList.length > 0)  || arrayContainsOneOf(whiteList, items)
    },

    /**
     * Get the editor for the given property using the given editor pool
     * @param property
     * @param editorPool
     * @returns {*}
     */
    getPropertyEditor: function(property, editorPool){

        var editorName = property.editor || 'textfield';

        if (typeof editorName == 'string') {
            var editor = editorPool.findEditor(editorName);
            if(!editor){
                throw `Unknown editor ${editorName}`
            }
            return editor;
        } else {
            return editorName;
        }
    },

    /**
     * Bind a modal to be responsive to use interaction (close buttons)
     * @param $modal
     * @param closeHandler
     */
    bindModal: function($modal, closeHandler){

        $modal.find('[veol-close]').click(function(){
            closeHandler();
        });

    },


    getWidgetIconClass: function(widgetDef){

        if(widgetDef.config.faIconName){
            return `fa fa-${widgetDef.config.faIconName}`;

        }
        return false;
    }

};
