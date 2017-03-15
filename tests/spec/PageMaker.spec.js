import Veol from '../../src/javascripts/index.test';

describe("PageMaker", () => {
    it("Add and find widget", () => {
        var pageMaker = new Veol.PageMaker();

        var foo = Veol.WidgetDefinition.fastInstance({});
        pageMaker.addWidgetDefinition('foo', foo);
        expect(pageMaker.findWidgetDefinition('foo')).toBe(foo);

        expect(() => {pageMaker.findWidgetDefinition('bar')}).toThrow('No widget named bar was found');

        var bar = Veol.WidgetDefinition.fastInstance({});
        pageMaker.addWidgetDefinition('bar', bar);
        expect(pageMaker.findWidgetDefinition('bar')).toBe(bar);

        pageMaker.addWidgetDefinition('foo2', foo);
        expect(pageMaker.findWidgetDefinition('foo')).toBe(foo);
        expect(pageMaker.findWidgetDefinition('foo2')).toBe(foo);
    });

    it("Parse and save data", () => {
        var pageMaker = new Veol.PageMaker();

        pageMaker.addWidgetDefinition('column', new Veol.Test.Widgets.Column());
        pageMaker.addWidgetDefinition('columns', new Veol.Test.Widgets.Columns());

        var data = {
            widgetName: 'widget-list',
            children: [
                {
                    widgetName: 'title',
                },
                {
                    widgetName: 'columns',
                    children: [
                        {
                            widgetName: 'column',
                            children: [
                                {
                                    widgetName: 'slider'
                                }
                            ],
                            data:{
                                size: 5
                            }
                        },
                        {
                            widgetName: 'column',
                            children: [
                                {
                                    widgetName: 'title'
                                }
                            ],
                            data:{
                                size: 7
                            }
                        }
                    ]
                }
            ]
        };

        var backupData = JSON.stringify(data);

        var titleWidget = Veol.WidgetDefinition.fastInstance({});
        var sliderWidget = Veol.WidgetDefinition.fastInstance({});

        pageMaker.addWidgetDefinition("slider", sliderWidget);
        pageMaker.addWidgetDefinition("title", titleWidget);

        var parsedData = pageMaker.parseData(data);

        // Check that parse data didnt alterate the initial data
        expect(JSON.stringify(data)).toBe(backupData);

        // Make some checks on parsed data
        expect(parsedData.children[0].widgetName).toBe('title');
        expect(parsedData.children[0].data).toEqual({});
        expect(parsedData.children[0].widgetDefinition).toBe(titleWidget);

        expect(parsedData.children[1].widgetDefinition).toBe(pageMaker.findWidgetDefinition('columns'));
        expect(parsedData.children[1].children[0].widgetDefinition).toBe(pageMaker.findWidgetDefinition('column'));
        expect(parsedData.children[1].children[0].data).toEqual({size: 5});
        expect(parsedData.children[1].children[0].children[0].widgetName).toBe('slider');
        expect(parsedData.children[1].children[0].children[0].widgetDefinition).toBe(sliderWidget);
        expect(parsedData.children[1].children[1].children[0].widgetName).toBe('title');


        // save function should export a minimal output of the structure as specified in the data variant above
        // that means that data and children keys should only be exported is they are meaningful
        // The goal is to ake the data as small as possible for storing purpose
        expect(JSON.stringify(parsedData.helper.save())).toEqual(backupData);
    });



    it("creates application", () => {
        var pageMaker = new Veol.PageMaker();

        var data = {
            widgetName: 'widget-list',
            children: []
        };

        var application = pageMaker.createApplication(data);
        expect(application.constructor.name).toEqual('Application');
        expect(application.pageMaker).toEqual(pageMaker);
        expect(application.originalData).toEqual(data);
    });
});
