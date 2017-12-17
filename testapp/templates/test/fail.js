import chai, { expect } from 'chai';
chai.use(require('chai-as-promised'));

describe('Failing test', () => {
	it('should fail', () => {
		expect(false).to.be.true;
	});
});
