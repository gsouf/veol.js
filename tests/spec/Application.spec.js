import Veol from '../../src/javascripts/index.test';

describe("Application", () => {

    beforeEach(function () {
        jasmine.addMatchers(Veol.Test.jasmineMatchers);
    });

    it("construct", () => {
        let pageMaker = new Veol.PageMaker();

        let data = {
            'widgetName': 'widget-list'
        };

        let app = pageMaker.createApplication(data);

        expect(app.originalData).toBe(data);

    });

    it('throws exception on bad data', () => {
        let pageMaker = new Veol.PageMaker();
        expect(function(){
            pageMaker.createApplication(null);
        }).toThrowVeolType(Veol.Error.ERR_INVALID_DATA);

        expect(function(){
            pageMaker.createApplication({});
        }).toThrowVeolType(Veol.Error.ERR_INVALID_DATA);

        expect(function(){
            pageMaker.createApplication({foo: 'bar'});
        }).toThrowVeolType(Veol.Error.ERR_INVALID_DATA);
    });

});
