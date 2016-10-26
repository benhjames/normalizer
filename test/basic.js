var mocha   = require("mocha");
var should  = require("should");
var norm = require("../index");

describe('Normalizer', function(){
  var startTime;

  before(function(done){
    norm.loadData(function(){
      startTime = new Date();
      done();
    });
  });

  after(function(done) {
    console.log('Test duration: ' + (new Date() - startTime) + 'ms');
    done();
  })

  describe('Should clean input', function() {

    it("should replace subsitutes", function() {
      norm.clean("Nov 1st I weighed 90 kgs. total").should.eql("November 1st I weighed 90 kilograms total");
      norm.clean("I shared it on FB w/ friends, ie: you").should.eql("I shared it on Facebook with friends, for example : you");
    });

    it("should expand contractions", function() {
      norm.clean("I'm on the yelow zebra").should.eql("I am on the yellow zebra");
      norm.clean("I'll listen to y'all").should.eql("I will listen to you all");
      norm.clean("do n't make it right").should.eql("do not make it right");
      norm.clean("it's all good").should.eql("it is all good");
    });

    it("should swap british / canadian words", function() {
      norm.clean("armour axe coloured gold").should.eql("armor ax colored gold");
    });

    it("should fix spelling", function() {
      norm.clean("are we sceduled thrsday for teh restraunt").should.eql("are we scheduled Thursday for the restaurant");
    });

    it("should expand txt speak", function() {
      norm.clean("n").should.eql("~no");
      norm.clean("lol").should.eql("~emolaugh");
      norm.clean("haha").should.eql("~emolaugh");
      norm.clean(":)").should.eql("~emohappy");
    });

    it("should clean this", function() {
      norm.clean("Well , I could not help it, could I").should.eql("I could not help it, could I")
    });

    it("should not remove +", function() {
      norm.clean("3+4=7").should.eql("3+4=7");
    });

    it("should remove extra spaces", function() {
      norm.clean("this    is     spaced     out").should.eql("this is spaced out");
    });

    it("should remove punct", function() {
      norm.clean("why do i care?").should.eql("why do I care");
    });

    it("Fix numbers", function() {
      norm.clean("how much is 1,000.00").should.eql("how much is 1000.00");
    });

    it("Spell Fix 2 word combo", function() {
      norm.clean("hwo do you").should.eql("how do you");
      norm.clean("hwo is you").should.eql("who is you");
    });

    it("Fix ASCII characters", function() {
      norm.clean("What’s up").should.eql("what is up");
      norm.clean("What's up").should.eql("what is up");
      norm.clean("I said “shut up”").should.eql('I said "shut up"');
      norm.clean("œ").should.eql('');
    });
  });

  describe('Matching', function() {
    // <it_is>
    describe('<xxx>', function() {
      it('should match start and end', function() {
        norm.clean('it is').should.eql("~yes");
      });

      it('should not match start', function() {
        norm.clean('it is abc').should.eql("it is abc");
      });

      it('should not match end', function() {
        norm.clean('abc it is').should.eql('abc it is');
      });

      it('should not match middle', function() {
        norm.clean('abc it is abc').should.eql('abc it is abc');
      });
    });

    // <ew
    describe('<xxx', function() {
      it('should match start and end', function() {
        norm.clean('ew').should.eql("~emodisgust");
      });

      it('should match start', function() {
        norm.clean('ew abc').should.eql("~emodisgust abc");
      });

      it('should not match end', function() {
        norm.clean('abc ew').should.eql("abc ew");
      });

      it('should not match middle', function() {
        norm.clean('abc ew abc').should.eql("abc ew abc");
      });
    });

    // have_to_go>
    describe('xxx>', function() {
      it('should match start and end', function() {
        norm.clean('have to go').should.eql("~emogoodbye");
      });

      it('should not match start', function() {
        norm.clean('have to go abc').should.eql("have to go abc");
      });

      it('should match end', function() {
        norm.clean('abc have to go').should.eql("abc ~emogoodbye")
      });

      it('should not match middle', function() {
        norm.clean('abc have to go abc').should.eql("abc have to go abc")
      });
    });

    // okay
    describe('xxx', function() {
      it('should match start and end', function() {
        norm.clean('okay').should.eql("~yes");
      });

      it('should match start', function() {
        norm.clean('okay abc').should.eql("~yes abc");
      });

      it('should match end', function() {
        norm.clean('abc okay').should.eql("abc ~yes");
      });

      it('should match middle', function() {
        norm.clean('abc okay abc').should.eql("abc ~yes abc");
      });
    })


  });
});
