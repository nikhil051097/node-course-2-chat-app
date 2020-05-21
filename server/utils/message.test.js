const expect = require('chai').expect;

const { generateMessage } = require('./message');

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
