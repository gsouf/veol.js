import Veol from 'src';

describe("utils", () => {
    it("can insert and move widgets", () => {
        var data = {
            widgetName: 'widget-list',
            children: [
                {widgetName: 'slider'},
                {widgetName: 'slider'}
            ]
        };


        var pageMaker = new Veol.PageMaker();

        var titleWidget = Veol.WidgetDefinition.fastInstance({});
        var sliderWidget = Veol.WidgetDefinition.fastInstance({});

        pageMaker.addWidgetDefinition("slider", sliderWidget);
        pageMaker.addWidgetDefinition("title", titleWidget);

        var application = pageMaker.createApplication(data);
        var processedData = application.data;

        var widget = pageMaker.parseData({ 'widgetName': 'title' }, application);

        Veol.utils.insertWidgetBefore(processedData.children[1], widget);

        expect(widget.parent).toEqual(processedData);
        expect(processedData.children[1]).toEqual(widget);
        expect(JSON.stringify(application.save())).toEqual(JSON.stringify({
            widgetName: 'widget-list',
            children: [
                {widgetName: 'slider'},
                {widgetName: 'title'},
                {widgetName: 'slider'}
            ]
        }));


        Veol.utils.insertWidgetBefore(processedData.children[0], widget);

        expect(widget.parent).toEqual(processedData);
        expect(processedData.children[0]).toBe(widget);
        expect(JSON.stringify(application.save())).toEqual(JSON.stringify({
            widgetName: 'widget-list',
            children: [
                {widgetName: 'title'},
                {widgetName: 'slider'},
                {widgetName: 'slider'}
            ]
        }));

        Veol.utils.appendWidget(processedData, widget);
        expect(widget.parent).toEqual(processedData);
        expect(processedData.children[2]).toBe(widget);
        expect(JSON.stringify(application.save())).toEqual(JSON.stringify({
            widgetName: 'widget-list',
            children: [
                {widgetName: 'slider'},
                {widgetName: 'slider'},
                {widgetName: 'title'}
            ]
        }));

    });


    it("arrayContainsOneOf", () => {
        expect(Veol.utils.arrayContainsOneOf([], [])).toBe(false);
        expect(Veol.utils.arrayContainsOneOf([], ['foo'])).toBe(false);
        expect(Veol.utils.arrayContainsOneOf(['foo'], [])).toBe(false);
        expect(Veol.utils.arrayContainsOneOf(['foo'], ['foo'])).toBe(true);
        expect(Veol.utils.arrayContainsOneOf(['foo'], ['foo', 'bar'])).toBe(true);
        expect(Veol.utils.arrayContainsOneOf(['foo', 'bar'], ['foo'])).toBe(true);
        expect(Veol.utils.arrayContainsOneOf(['bar'], ['foo'])).toBe(false);
    });
});
