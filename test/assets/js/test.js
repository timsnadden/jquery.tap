(function($, mocha) {
    'use strict';

    mocha.setup({ ignoreLeaks: true, ui: 'bdd' });

    var spy = sinon.spy();

    var touchA = '#touchA';
    var touchB = '#touchB';

    var $body = $(document.body);
    var $touchA = $(touchA);
    var $touchB = $(touchB);

    afterEach(function() {
        $body.off('tap');
        $touchA.off('tap');
        $touchB.off('tap');
        $body
            .trigger('touchend')
            .trigger('mouseup');

        spy.reset();
    });

    describe('Manual Triggers', function() {

        describe('Direct Callback Bindings', function() {

            it('will trigger tap event if tap is manually triggered on same element', function() {
                $touchA
                    .on('tap', spy)
                    .trigger('tap');

                expect(spy.callCount).to.be(1);
            });

            it('will trigger tap event if tap is manually triggered on child element', function() {
                $touchA.on('tap', spy);
                $touchB.trigger('tap');

                expect(spy.callCount).to.be(1);
            });

            it('will trigger namespaced tap event if namespaced tap is manually triggered on same element', function() {
                $touchA
                    .on('tap.tap1', spy)
                    .on('tap.tap2', spy)
                    .trigger('tap.tap2');

                expect(spy.callCount).to.be(1);
            });

            it('will trigger namespaced tap event if non-namespaced tap is manually triggered on same element', function() {
                $touchA
                    .on('tap.tap1', spy)
                    .on('tap.tap2', spy)
                    .trigger('tap');

                expect(spy.callCount).to.be(2);
            });

            it('will not trigger tap event if click is manually triggered on same element', function() {
                $touchA
                    .on('tap', spy)
                    .trigger('click');

                expect(spy.callCount).to.be(0);
            });

            it('will not trigger tap event if click is manually triggered on child element', function() {
                $touchA.on('tap', spy);
                $touchB.trigger('click');

                expect(spy.callCount).to.be(0);
            });

            it('will bubble tap event when triggered', function() {
                $body.on('tap', spy);
                $touchA.on('tap', spy);
                $touchB.trigger('tap');

                expect(spy.callCount).to.be(2);
            });
        });

        describe('Delegate Callback Bindings', function() {

            it('will trigger tap event if tap is manually triggered on target selector', function() {
                $body.on('tap', touchA, spy);
                $touchA.trigger('tap');

                expect(spy.callCount).to.be(1);
            });

            it('will trigger tap event if tap is manually triggered on child of target selector', function() {
                $body.on('tap', touchA, spy);
                $touchB.trigger('tap');

                expect(spy.callCount).to.be(1);
            });

            it('will trigger namespaced tap event if namespaced tap is manually triggered on target selector', function() {
                $body
                    .on('tap.tap1', touchA, spy)
                    .on('tap.tap2', touchA, spy);
                $touchA.trigger('tap.tap2');

                expect(spy.callCount).to.be(1);
            });

            it('will trigger namespaced taps if non-namespaced tap is manually triggered on target selector', function() {
                $body
                    .on('tap.tap1', touchA, spy)
                    .on('tap.tap2', touchA, spy);
                $touchA.trigger('tap');

                expect(spy.callCount).to.be(2);
            });

            it('will not trigger tap event if click is manually triggered on target selector', function() {
                $body
                    .on('tap.tap1', touchA, spy)
                    .on('tap.tap2', touchA, spy);
                $touchA.trigger('click');

                expect(spy.callCount).to.be(0);
            });

            it('will not trigger tap event if click is manually triggered on child of target selector', function() {
                $body
                    .on('tap.tap1', touchA, spy)
                    .on('tap.tap2', touchA, spy);
                $touchB.trigger('click');

                expect(spy.callCount).to.be(0);
            });

            it('will bubble tap event when triggered', function() {
                $body
                    .on('tap', touchA, spy)
                    .on('tap', touchB, spy);
                $touchB.trigger('tap');

                expect(spy.callCount).to.be(2);
            });
        });

    });

    describe('Touch Events', function() {

        describe('Direct Callback Bindings', function() {

            it('will trigger tap event after touchstart, and touchend are triggered', function() {
                $touchA
                    .on('tap', spy)
                    .simulate('touchstart')
                    .simulate('touchend');

                expect(spy.callCount).to.be(1);
            });

            it('will trigger if moved 10px between touchstart and touchend', function() {
                $touchA
                    .on('tap', spy)
                    .simulate('touchstart')
                    .simulate('touchend', { clientX: 10, clientY: 10 });

                expect(spy.callCount).to.be(1);
            });

            it('will trigger if 300ms elapse between touchstart and touchend', function(done) {
                $touchA
                    .on('tap', spy)
                    .simulate('touchstart');

                setTimeout(function() {
                    $touchA.simulate('touchend');
                    try {
                        expect(spy.callCount).to.be(1);
                        done();
                    } catch(e) {
                        done(e);
                    }
                }, 300);
            });

            it('will not trigger if 1000ms elapse between touchstart and touchend', function(done) {
                $touchA
                    .on('tap', spy)
                    .simulate('touchstart');

                setTimeout(function() {
                    $touchA.simulate('touchend');
                    try {
                        expect(spy.callCount).to.be(0);
                        done();
                    } catch(e) {
                        done(e);
                    }
                }, 1000);
            });

            it('will trigger tap event on parent element when triggered on child', function() {
                $body.on('tap', spy);
                $touchA
                    .simulate('touchstart')
                    .simulate('touchend');

                expect(spy.callCount).to.be(1);
            });

            it('will trigger tap event 2x on parent element when triggered on child', function() {
                $body.on('tap', spy);
                $touchA
                    .on('tap', spy)
                    .simulate('touchstart')
                    .simulate('touchend');

                expect(spy.callCount).to.be(2);
            });

            it('will not trigger if more than one touch', function() {
                $body.on('tap', spy);
                $touchA
                    .on('tap', spy)
                    .simulate('touchstart')
                    .simulate('touchstart', {}, 2)
                    .simulate('touchend', {}, 1)
                    .simulate('touchend');

                expect(spy.callCount).to.be(0);
            });

            it('will bubble tap event after touchstart and touchend', function() {
                $body.on('tap', spy);
                $touchA.on('tap', spy);
                $touchB
                    .simulate('touchstart')
                    .simulate('touchend');

                expect(spy.callCount).to.be(2);
            });

        });

        describe('Delegate Callback Bindings', function() {

            it('will trigger tap event after touchstart and touchend in less than 300ms', function() {
                $body.on('tap', touchA, spy);
                $touchA
                    .simulate('touchstart')
                    .simulate('touchend');

                expect(spy.callCount).to.be(1);
            });

            it('will trigger if moved more than 10px between touchstart and touchend', function() {
                $body.on('tap', touchA, spy);
                $touchA
                    .simulate('touchstart')
                    .simulate('touchend', { clientX: 10, clientY: 10 });

                expect(spy.callCount).to.be(1);
            });

            it('will trigger if 300ms elapse between touchstart and touchend', function(done) {
                $body.on('tap', touchA, spy);
                $touchA.simulate('touchstart');

                setTimeout(function() {
                    $touchA.simulate('touchend');
                    try {
                        expect(spy.callCount).to.be(1);
                        done();
                    } catch(e) {
                        done(e);
                    }
                }, 300);
            });

            it('will not trigger if 1000ms elapse between touchstart and touchend', function(done) {
                $body.on('tap', touchA, spy);
                $touchA.simulate('touchstart');

                setTimeout(function() {
                    $touchA.simulate('touchend');
                    try {
                        expect(spy.callCount).to.be(0);
                        done();
                    } catch(e) {
                        done(e);
                    }
                }, 1000);
            });

            it('will trigger tap event on parent element when triggered on child', function() {
                $body.on('tap', touchA, spy);
                $touchB
                    .simulate('touchstart')
                    .simulate('touchend');

                expect(spy.callCount).to.be(1);
            });

            it('will trigger tap event 2x on parent element when triggered on child', function() {
                $body.on('tap', touchA, spy);
                $touchB
                    .on('tap', spy)
                    .simulate('touchstart')
                    .simulate('touchend');

                expect(spy.callCount).to.be(2);
            });

            it('will bubble tap event after touchstart and touchend', function() {
                $body.on('tap', touchA, spy);
                $touchA.on('tap',touchB,  spy);
                $touchB
                    .simulate('touchstart')
                    .simulate('touchend');

                expect(spy.callCount).to.be(2);
            });

        });

    });

    describe('Mouse Events', function() {

        describe('Direct Callback Bindings', function() {

            it('will trigger tap event after mousedown, and mouseup are triggered', function() {
                $touchA
                    .on('tap', spy)
                    .simulate('mousedown')
                    .simulate('mouseup');

                expect(spy.callCount).to.be(1);
            });

            it('will trigger if moved 10px between mousedown and mouseup', function() {
                $touchA
                    .on('tap', spy)
                    .simulate('mousedown')
                    .simulate('mouseup', { clientX: 10, clientY: 10 });

                expect(spy.callCount).to.be(1);
            });

            it('will not trigger if moved 500px between mousedown and mouseup', function() {
                $touchA
                    .on('tap', spy)
                    .simulate('mousedown')
                    .simulate('mouseup', { clientX: 500, clientY: 100 });

                expect(spy.callCount).to.be(0);
            });

            it('will trigger if 300ms elapse between mousedown and mouseup', function(done) {
                $touchA
                    .on('tap', spy)
                    .simulate('mousedown');

                setTimeout(function() {
                    $touchA.simulate('mouseup');
                    try {
                        expect(spy.callCount).to.be(1);
                        done();
                    } catch(e) {
                        done(e);
                    }
                }, 300);
            });

            it('will not trigger if 1000ms elapse between mousedown and mouseup', function(done) {
                $touchA
                    .on('tap', spy)
                    .simulate('mousedown');

                setTimeout(function() {
                    $touchA.simulate('mouseup');
                    try {
                        expect(spy.callCount).to.be(0);
                        done();
                    } catch(e) {
                        done(e);
                    }
                }, 1000);
            });

            it('will trigger tap event on parent element when triggered on child', function() {
                $body.on('tap', spy);
                $touchA
                    .simulate('mousedown')
                    .simulate('mouseup');

                expect(spy.callCount).to.be(1);
            });

            it('will trigger tap event 2x on parent element when triggered on child', function() {
                $body.on('tap', spy);
                $touchA
                    .on('tap', spy)
                    .simulate('mousedown')
                    .simulate('mouseup');

                expect(spy.callCount).to.be(2);
            });

            it('will bubble tap event after mousedown and mouseup', function() {
                $body.on('tap', spy);
                $touchA.on('tap', spy);
                $touchB
                    .simulate('mousedown')
                    .simulate('mouseup');

                expect(spy.callCount).to.be(2);
            });

        });

        describe('Delegate Callback Bindings', function() {

            it('will trigger tap event after mousedown and mouseup in less than 300ms', function() {
                $body.on('tap', touchA, spy);
                $touchA
                    .simulate('mousedown')
                    .simulate('mouseup');

                expect(spy.callCount).to.be(1);
            });

            it('will trigger if moved more than 10px between mousedown and mouseup', function() {
                $body.on('tap', touchA, spy);
                $touchA
                    .simulate('mousedown')
                    .simulate('mouseup', { clientX: 10, clientY: 10 });

                expect(spy.callCount).to.be(1);
            });

            it('will trigger if 300ms elapse between mousedown and mouseup', function(done) {
                $body.on('tap', touchA, spy);
                $touchA.simulate('mousedown');

                setTimeout(function() {
                    $touchA.simulate('mouseup');
                    try {
                        expect(spy.callCount).to.be(1);
                        done();
                    } catch(e) {
                        done(e);
                    }
                }, 300);
            });

            it('will not trigger if 1000ms elapse between mousedown and mouseup', function(done) {
                $body.on('tap', touchA, spy);
                $touchA.simulate('mousedown');

                setTimeout(function() {
                    $touchA.simulate('mouseup');
                    try {
                        expect(spy.callCount).to.be(0);
                        done();
                    } catch(e) {
                        done(e);
                    }
                }, 1000);
            });

            it('will trigger tap event on parent element when triggered on child', function() {
                $body.on('tap', touchA, spy);
                $touchB
                    .simulate('mousedown')
                    .simulate('mouseup');

                expect(spy.callCount).to.be(1);
            });

            it('will trigger tap event 2x on parent element when triggered on child', function() {
                $body.on('tap', touchA, spy);
                $touchB
                    .on('tap', spy)
                    .simulate('mousedown')
                    .simulate('mouseup');

                expect(spy.callCount).to.be(2);
            });

            it('will bubble tap event after mousedown and mouseup', function() {
                $body.on('tap', touchA, spy);
                $touchA.on('tap',touchB,  spy);
                $touchB
                    .simulate('mousedown')
                    .simulate('mouseup');

                expect(spy.callCount).to.be(2);
            });

        });

    });

    describe('Touch/Mouse Detection', function() {

        it('will ignore mouse events if touchstart fires first', function() {
            $touchA
                .on('tap', spy)
                .simulate('touchstart')
                .simulate('mousedown')
                .simulate('mouseup')
                .simulate('touchend');

            expect(spy.callCount).to.be(1);
        });

        it('will ignore touch events if mousedown fires first', function() {
            $touchA
                .on('tap', spy)
                .simulate('mousedown')
                .simulate('touchstart')
                .simulate('touchend')
                .simulate('mouseup');

            expect(spy.callCount).to.be(1);
        });

    });

    $(document).ready(function() {
        setTimeout(function() {
            mocha.run();
        }, 1000);
    });

}(jQuery, mocha));