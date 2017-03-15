import Veol from 'src';






describe("PageMaker blacklist and whitelist", () => {

    const foo = Veol.WidgetDefinition.fastInstance({
        types: ['foo']
    });
    const bar = Veol.WidgetDefinition.fastInstance({
        types: ['bar']
    });
    const foobar = Veol.WidgetDefinition.fastInstance({
        types: ['foo', 'bar']
    });


    describe('for children', () => {
        it("no blacklist or whitelist", () => {
            var pageMaker = new Veol.PageMaker();
            pageMaker.addWidgetDefinition('fooWidget', foo);
            pageMaker.addWidgetDefinition('barWidget', bar);
            pageMaker.addWidgetDefinition('foobarWidget', foobar);
            var widget = pageMaker.parseData({"widgetName": "fooWidget"});
            expect(foo.allowedAsChild(widget)).toBe(true);
        });

        it("empty child blacklist and whitelist", () => {
            var testingWidget = Veol.WidgetDefinition.fastInstance({
                childrenBlacklist: [],
                childrenWhitelist: []
            });
            expect(testingWidget.allowedAsChild(foo)).toBe(true);
            expect(testingWidget.allowedAsChild(bar)).toBe(true);
            expect(testingWidget.allowedAsChild(foobar)).toBe(true);
        });

        it("childrenBlacklist", () => {
            var testingWidget = Veol.WidgetDefinition.fastInstance({
                childrenBlacklist: ['foo']
            });
            expect(testingWidget.allowedAsChild(foo)).toBe(false);
            expect(testingWidget.allowedAsChild(bar)).toBe(true);
            expect(testingWidget.allowedAsChild(foobar)).toBe(false);

            testingWidget = Veol.WidgetDefinition.fastInstance({
                childrenBlacklist: ['bar']
            });
            expect(testingWidget.allowedAsChild(foo)).toBe(true);
            expect(testingWidget.allowedAsChild(bar)).toBe(false);
            expect(testingWidget.allowedAsChild(foobar)).toBe(false);

            testingWidget = Veol.WidgetDefinition.fastInstance({
                childrenBlacklist: ['foo', 'bar']
            });
            expect(testingWidget.allowedAsChild(foo)).toBe(false);
            expect(testingWidget.allowedAsChild(bar)).toBe(false);
            expect(testingWidget.allowedAsChild(foobar)).toBe(false);

            testingWidget = Veol.WidgetDefinition.fastInstance({
                childrenBlacklist: ['baz', 'qux']
            });
            expect(testingWidget.allowedAsChild(foo)).toBe(true);
            expect(testingWidget.allowedAsChild(bar)).toBe(true);
            expect(testingWidget.allowedAsChild(foobar)).toBe(true);


        });

        it("childrenWhitelist", () => {
            var testingWidget = Veol.WidgetDefinition.fastInstance({
                childrenWhitelist: ['foo']
            });
            expect(testingWidget.allowedAsChild(foo)).toBe(true);
            expect(testingWidget.allowedAsChild(bar)).toBe(false);
            expect(testingWidget.allowedAsChild(foobar)).toBe(true);

            testingWidget = Veol.WidgetDefinition.fastInstance({
                childrenWhitelist: ['bar']
            });
            expect(testingWidget.allowedAsChild(foo)).toBe(false);
            expect(testingWidget.allowedAsChild(bar)).toBe(true);
            expect(testingWidget.allowedAsChild(foobar)).toBe(true);

            testingWidget = Veol.WidgetDefinition.fastInstance({
                childrenWhitelist: ['foo', 'bar']
            });
            expect(testingWidget.allowedAsChild(foo)).toBe(true);
            expect(testingWidget.allowedAsChild(bar)).toBe(true);
            expect(testingWidget.allowedAsChild(foobar)).toBe(true);

            testingWidget = Veol.WidgetDefinition.fastInstance({
                childrenWhitelist: ['baz', 'qux']
            });
            expect(testingWidget.allowedAsChild(foo)).toBe(false);
            expect(testingWidget.allowedAsChild(bar)).toBe(false);
            expect(testingWidget.allowedAsChild(foobar)).toBe(false);
        });

        it("children whitelist and blacklist", () => {
            var testingWidget = Veol.WidgetDefinition.fastInstance({
                childrenBlacklist: ['foo'],
                childrenWhitelist: ['foo']
            });
            expect(testingWidget.allowedAsChild(foo)).toBe(false);
            expect(testingWidget.allowedAsChild(bar)).toBe(false);
            expect(testingWidget.allowedAsChild(foobar)).toBe(false);

            testingWidget = Veol.WidgetDefinition.fastInstance({
                childrenBlacklist: ['foo'],
                childrenWhitelist: ['bar']
            });
            expect(testingWidget.allowedAsChild(foo)).toBe(false);
            expect(testingWidget.allowedAsChild(bar)).toBe(true);
            expect(testingWidget.allowedAsChild(foobar)).toBe(false);

            testingWidget = Veol.WidgetDefinition.fastInstance({
                childrenBlacklist: ['foo'],
                childrenWhitelist: ['foo', 'bar']
            });
            expect(testingWidget.allowedAsChild(foo)).toBe(false);
            expect(testingWidget.allowedAsChild(bar)).toBe(true);
            expect(testingWidget.allowedAsChild(foobar)).toBe(false);

            testingWidget = Veol.WidgetDefinition.fastInstance({
                childrenBlacklist: ['foo'],
                childrenWhitelist: ['baz', 'qux']
            });
            expect(testingWidget.allowedAsChild(foo)).toBe(false);
            expect(testingWidget.allowedAsChild(bar)).toBe(false);
            expect(testingWidget.allowedAsChild(foobar)).toBe(false);
        });


    });


    describe('for parents', () => {
        it("no blacklist or whitelist", () => {
            var pageMaker = new Veol.PageMaker();
            pageMaker.addWidgetDefinition('fooWidget', foo);
            pageMaker.addWidgetDefinition('barWidget', bar);
            pageMaker.addWidgetDefinition('foobarWidget', foobar);
            var widget = pageMaker.parseData({"widgetName": "fooWidget"});
            expect(foo.allowedAsParent(widget)).toBe(true);
        });

        it("empty child blacklist and whitelist", () => {
            var testingWidget = Veol.WidgetDefinition.fastInstance({
                parentBlacklist: [],
                parentWhitelist: []
            });
            expect(testingWidget.allowedAsParent(foo)).toBe(true);
            expect(testingWidget.allowedAsParent(bar)).toBe(true);
            expect(testingWidget.allowedAsParent(foobar)).toBe(true);
        });

        it("parentBlacklist", () => {
            var testingWidget = Veol.WidgetDefinition.fastInstance({
                parentBlacklist: ['foo']
            });
            expect(testingWidget.allowedAsParent(foo)).toBe(false);
            expect(testingWidget.allowedAsParent(bar)).toBe(true);
            expect(testingWidget.allowedAsParent(foobar)).toBe(false);

            testingWidget = Veol.WidgetDefinition.fastInstance({
                parentBlacklist: ['bar']
            });
            expect(testingWidget.allowedAsParent(foo)).toBe(true);
            expect(testingWidget.allowedAsParent(bar)).toBe(false);
            expect(testingWidget.allowedAsParent(foobar)).toBe(false);

            testingWidget = Veol.WidgetDefinition.fastInstance({
                parentBlacklist: ['foo', 'bar']
            });
            expect(testingWidget.allowedAsParent(foo)).toBe(false);
            expect(testingWidget.allowedAsParent(bar)).toBe(false);
            expect(testingWidget.allowedAsParent(foobar)).toBe(false);

            testingWidget = Veol.WidgetDefinition.fastInstance({
                parentBlacklist: ['baz', 'qux']
            });
            expect(testingWidget.allowedAsParent(foo)).toBe(true);
            expect(testingWidget.allowedAsParent(bar)).toBe(true);
            expect(testingWidget.allowedAsParent(foobar)).toBe(true);


        });

        it("parentWhitelist", () => {
            var testingWidget = Veol.WidgetDefinition.fastInstance({
                parentWhitelist: ['foo']
            });
            expect(testingWidget.allowedAsParent(foo)).toBe(true);
            expect(testingWidget.allowedAsParent(bar)).toBe(false);
            expect(testingWidget.allowedAsParent(foobar)).toBe(true);

            testingWidget = Veol.WidgetDefinition.fastInstance({
                parentWhitelist: ['bar']
            });
            expect(testingWidget.allowedAsParent(foo)).toBe(false);
            expect(testingWidget.allowedAsParent(bar)).toBe(true);
            expect(testingWidget.allowedAsParent(foobar)).toBe(true);

            testingWidget = Veol.WidgetDefinition.fastInstance({
                parentWhitelist: ['foo', 'bar']
            });
            expect(testingWidget.allowedAsParent(foo)).toBe(true);
            expect(testingWidget.allowedAsParent(bar)).toBe(true);
            expect(testingWidget.allowedAsParent(foobar)).toBe(true);

            testingWidget = Veol.WidgetDefinition.fastInstance({
                parentWhitelist: ['baz', 'qux']
            });
            expect(testingWidget.allowedAsParent(foo)).toBe(false);
            expect(testingWidget.allowedAsParent(bar)).toBe(false);
            expect(testingWidget.allowedAsParent(foobar)).toBe(false);
        });

        it("children whitelist and blacklist", () => {
            var testingWidget = Veol.WidgetDefinition.fastInstance({
                parentBlacklist: ['foo'],
                parentWhitelist: ['foo']
            });
            expect(testingWidget.allowedAsParent(foo)).toBe(false);
            expect(testingWidget.allowedAsParent(bar)).toBe(false);
            expect(testingWidget.allowedAsParent(foobar)).toBe(false);

            testingWidget = Veol.WidgetDefinition.fastInstance({
                parentBlacklist: ['foo'],
                parentWhitelist: ['bar']
            });
            expect(testingWidget.allowedAsParent(foo)).toBe(false);
            expect(testingWidget.allowedAsParent(bar)).toBe(true);
            expect(testingWidget.allowedAsParent(foobar)).toBe(false);

            testingWidget = Veol.WidgetDefinition.fastInstance({
                parentBlacklist: ['foo'],
                parentWhitelist: ['foo', 'bar']
            });
            expect(testingWidget.allowedAsParent(foo)).toBe(false);
            expect(testingWidget.allowedAsParent(bar)).toBe(true);
            expect(testingWidget.allowedAsParent(foobar)).toBe(false);

            testingWidget = Veol.WidgetDefinition.fastInstance({
                parentBlacklist: ['foo'],
                parentWhitelist: ['baz', 'qux']
            });
            expect(testingWidget.allowedAsParent(foo)).toBe(false);
            expect(testingWidget.allowedAsParent(bar)).toBe(false);
            expect(testingWidget.allowedAsParent(foobar)).toBe(false);
        });


    });


});
