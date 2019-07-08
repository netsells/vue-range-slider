import { mount } from '@vue/test-utils';

import RangeSlider from '@/index';

describe('RangeSlider', () => {
    it('exists', () => {
        expect(RangeSlider).toBeTruthy();
    });

    describe('when mounted', () => {
        let wrapper;

        beforeEach(() => {
            wrapper = mount(RangeSlider, {
                propsData: {
                    min: 5,
                    max: 15,
                },
            });
        });

        it('has the correct default props', () => {
            expect(wrapper.props().value).toEqual([]);
            expect(wrapper.props().step).toEqual(1);
            expect(wrapper.props().padding).toEqual('12px');
        });

        describe('valueFraction', () => {
            beforeEach(() => {
                wrapper.setProps({
                    value: [5, 10, 15],
                });
            });

            it('returns the normalised values', () => {
                expect(wrapper.vm.valueFraction).toEqual([
                    0,
                    0.5,
                    1,
                 ]);
            });
        });

        describe('roundToNearest', () => {
            it('returns to the nearest 1 when step is 1', () => {
                expect(wrapper.vm.step).toEqual(1);
                expect(wrapper.vm.roundToNearest(10)).toEqual(10);
                expect(wrapper.vm.roundToNearest(0.5)).toEqual(1);
                expect(wrapper.vm.roundToNearest(2.4)).toEqual(2);
            });

            it('returns to the nearest 0.5 when step is 0.5', () => {
                wrapper.setProps({
                    step: 0.5,
                });

                expect(wrapper.vm.roundToNearest(10)).toEqual(10);
                expect(wrapper.vm.roundToNearest(0.5)).toEqual(0.5);
                expect(wrapper.vm.roundToNearest(2.4)).toEqual(2.5);
                expect(wrapper.vm.roundToNearest(56.9)).toEqual(57);
            });
        });

        describe('getEnforcedRange', () => {
            it('returns a value if its in range', () => {
                expect(wrapper.vm.getEnforcedRange(12)).toEqual(12);
            });

            it('returns min if value is below the range', () => {
                expect(wrapper.vm.getEnforcedRange(1)).toEqual(5);
            });

            it('returns max if value is above the range', () => {
                expect(wrapper.vm.getEnforcedRange(20)).toEqual(15);
            });
        });

        describe('getValueFromFraction', () => {
            it('returns a value based on a fraction', () => {
                expect(wrapper.vm.getValueFromFraction(0.5)).toEqual(10);
            });

            it('returns min if fraction is below 0', () => {
                expect(wrapper.vm.getValueFromFraction(-1)).toEqual(5);
            });

            it('returns max if fraction is above 0', () => {
                expect(wrapper.vm.getValueFromFraction(1.1)).toEqual(15);
            });
        });

        describe('getPositionFraction', () => {
            it('returns a fraction for a value', () => {
                expect(wrapper.vm.getPositionFraction(10)).toEqual(0.5);
            });
        });

        describe('getPosition', () => {
            it('gets a percentage position for a handle based on the value', () => {
                expect(wrapper.vm.getPosition(5)).toEqual('0%');
                expect(wrapper.vm.getPosition(10)).toEqual('50%');
                expect(wrapper.vm.getPosition(15)).toEqual('100%');
            });
        });
    });
});
