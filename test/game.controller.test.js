const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server.js')

chai.should()
chai.use(chaiHttp)

const endpointToTest = '/api/games'

describe('Games API POST', () => {
    it('Should add a game to the games list', (done) => {
 
        chai.request(server)
            .post(endpointToTest)
            .send({
                'name': 'somename',
                'producer': 'someproducer',
                'year': 2020,
                'type': 'sometype'
            })
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('object')
                const result = res.body
                result.should.have.property('message').equals('somename succesvol toegevoegd')
                done()
        })
    })

    it('should throw an error when no data is sent', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
            })
            .end((err, res) => {
                res.should.have.status(500)
                res.body.should.be.a('object')
                const result = res.body
                result.should.have.property('error').that.is.an('object')
                const error = result.error
                error.should.have.property('message').equals('Naam is ongeldig')
                error.should.have.property('code').equals(500)
                error.should.have.property('date')
                done()
            })
    })

    it('should throw an error when year is invalid', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
                'name': 'somename',
                'producer': 'someproducer',
                'year': 3333,
                'type': 'sometype'
            })
            .end((err, res) => {
                res.should.have.status(500)
                res.body.should.be.a('object')
                const result = res.body
                result.should.have.property('error').that.is.an('object')
                const error = result.error
                error.should.have.property('message').equals('Jaar is ongeldig')
                error.should.have.property('code').equals(500)
                error.should.have.property('date')
                done()
            })
    })

    it('should throw an error when name is invalid', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
                'name': '',
                'producer': 'someproducer',
                'year': 2002,
                'type': 'sometype'
            })
            .end((err, res) => {
                res.should.have.status(500)
                res.body.should.be.a('object')
                const result = res.body
                result.should.have.property('error').that.is.an('object')
                const error = result.error
                error.should.have.property('message').equals('Naam is ongeldig')
                error.should.have.property('code').equals(500)
                error.should.have.property('date')
                done()
            })
    })
    
    it('should throw an error when producer is invalid', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
                'name': 'dsadsasadsa',
                'producer': '',
                'year': 2002,
                'type': 'sometype'
            })
            .end((err, res) => {
                res.should.have.status(500)
                res.body.should.be.a('object')
                const result = res.body
                result.should.have.property('error').that.is.an('object')
                const error = result.error
                error.should.have.property('message').equals('Producer is ongeldig')
                error.should.have.property('code').equals(500)
                error.should.have.property('date')
                done()
            })
    })

    it('should throw an error when type is invalid', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
                'name': 'dsadsasadsa',
                'producer': 'dsasda',
                'year': 2002,
                'type': ''
            })
            .end((err, res) => {
                res.should.have.status(500)
                res.body.should.be.a('object')
                const result = res.body
                result.should.have.property('error').that.is.an('object')
                const error = result.error
                error.should.have.property('message').equals('Type is ongeldig')
                error.should.have.property('code').equals(500)
                error.should.have.property('date')
                done()
            })
    })
})

describe('Games API GET', () => {
    it('should return an array of Games', (done) => {
        chai.request(server)
            .get(endpointToTest)
            .send()
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('array')

                const response = res.body
                
                response.forEach(element => {
                    element.should.have.property('name')
                    element.should.have.property('producer')
                    element.should.have.property('year')
                    element.should.have.property('type')
                });
                done()
            })
    })
    it('should return a single game', (done) => {
        chai.request(server)
            .get(endpointToTest+'/1')
            .send()
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('object')

                const response = res.body
                response.should.have.property('name').equals('Call of Duty: Black Ops 4')
                response.should.have.property('producer').equals('Treyarch')
                response.should.have.property('year').equals(2018)
                response.should.have.property('type').equals('FPS')
                done()
            })
    })

})

describe('Games API PUT', () => {
    it('should return a succes when game has been updated', (done) => {
        chai.request(server)
            .put(endpointToTest+"/1")
            .send({
                'name': 'somename',
                'producer': 'someproducer',
                'year': 2002,
                'type': 'sometype'
            })
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('object')

                const response = res.body

                response.should.have.property('message').equals('somename succesvol geüpdate')
                done()
            })
    })
})

describe('Games API DELETE', () => {
    it('should return a succes when game has been updated', (done) => {
        chai.request(server)
            .delete(endpointToTest + "/1")
            .send()
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('object')

                const response = res.body

                response.should.have.property('message').equals('game succesvol verwijderd')
                done()
            })
    })

})