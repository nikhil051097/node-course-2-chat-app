const expect = require('chai').expect;

const { generateMessage, generateLocationMessage } = require('./message');

describe('generateMessage', ()=>{
    it('should generate correct message', ()=>{
        const from = 'nik';
        const text = 'hello';

        const message = generateMessage(from, text);
        expect(message).include({
            from, text
        })

        expect(message.createdAt).to.be.a('number');
        
        

    })
});

describe('generateLocationMessage', ()=>{
    it('should generate correct loction url', ()=>{
        const from = "Nik";
        const latitude = 1;
        const longitude = 1;

        const message = generateLocationMessage(from, latitude, longitude);

        expect(message.createdAt).to.be.a('number');
        expect(message.url).equal('https://www.google.com/maps?q=1,1');
    })
});
