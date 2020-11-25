import { component } from '../index';

describe('.component', () => {
    it('should create it properly', () => {
        const comp = component('Counter', '<div l-text="this.count"></div>');
        expect(comp).toEqual({
            name: "Counter",
            template: '<div l-text="this.count"></div>'
        })
    })
});