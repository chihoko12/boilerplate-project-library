/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let validId;
let invalidId;

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {

      test('Test POST /api/books with title', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({ title: 'Test Book Title' })
        .end(function(err,res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response should be an object');
          assert.property(res.body, 'title', 'Response should contain title');
          assert.property(res.body, '_id', 'Response should contain _id');
          done();
        });

      });

      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({})
        .end(function(err,res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'missing required field title');
          done();
        })
      });

    });


    suite('GET /api/books => array of books', function(){

      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .end(function(err,res) {
          assert.equal(res.status,200);
          assert.isArray(res.body, 'response should be an array');

          if (res.body.length > 0) {
            validId = res.body[0]._id;
          } else {
            validId = null;
          }
          done();
        });
      });
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
     //let invalidId = validId.replace(/^.{2}/g, 'aa');
      invalidId = '123123123';
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .get('/api/books/' + invalidId)
        .end(function(err,res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'no book exists');
          done();
        });
      });

      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .get('/api/books/' + validId)
        .end(function(err,res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response should be an object');
          assert.property(res.body, 'title', 'Response should contain title');
          assert.property(res.body, '_id', 'Response should contain _id');
          done();
        });
      });

    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){

      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post('/api/books/' + validId)
          .send({ comment: 'Test comment' })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.property(res.body, 'comments', 'Response should contain comments');
            assert.isArray(res.body.comments, 'commnents should be an array');
            assert.include(res.body.comments, 'Test comment', 'comments should include test comment');
            done();
          });
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
          .post('/api/books/' + validId)
          .send({})
          .end(function(err,res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "missing required field comment");
            done();
          });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
          .post('/api/books/' + invalidId)
          .send({ comment: 'Test comment' })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "no book exists");
            done();
          });
      });

    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
          .delete('/api/books/' + validId)
          .end(function(err,res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'delete successful', 'Response should contain delete confitmation message');
          });
        done();
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server)
          .delete('/api/books/' + invalidId)
          .end(function(err,res) {
            assert.equal(res.status,200);
            assert.equal(res.body.error, 'no book exists');
            done();
          });
      });

    });

  });

});
