[![npm version](https://badge.fury.io/js/%40netsells%2Fvue-range-slider.svg)](https://badge.fury.io/js/%40netsells%2Fvue-range-slider)
[![Build Status](https://travis-ci.com/netsells/vue-range-slider.svg?branch=master)](https://travis-ci.com/netsells/vue-range-slider)
[![codecov](https://codecov.io/gh/netsells/vue-range-slider/branch/master/graph/badge.svg)](https://codecov.io/gh/netsells/vue-range-slider)

# Vue Range Slider

A flexible, reactive, SSR supporting and styleable range input.

## Installation
```
yarn add @netsells/vue-range-slider
```

```javascript
import RangeSlider from '@netsells/vue-range-slider';

export default {
    components: {
        RangeSlider,
    },
};
```

## Props

### min

The minimum value, required

### max

The maximum value, required

### value

The array of ranges, defaults to an empty array. Supports `v-model`

### padding

Padding to use above and below the slider line, defaults to `12px`

### step

Step for the range (nearest number to round to), defaults to `1`

## Slots

The component uses scoped slots to allow styles to easily be applied. All slots
are optional and the component will fall back onto basic styles.

### line

Slot for rendering the line which the slide handles move across. Is passed 2
props: `value` and `valueFraction`.

The `valueFraction` is the `value` array with each number converted to a
normalised fraction between 0 and 1, representing the value between `min` and
`max`.

### handle

Slot for rendering a handle of the slider. Is passed 2 props: `value` and
`index`. The `value` prop is the number for this handle only, the `index` prop
is the index of this value in the array.

## Example

```html
    <range-slider
        :min="0"
        :max="10"
        :step="0.1"
        v-model="value"
    >
        <template v-slot:line="{ valueFraction }">
            <div class="range-line">
                <div
                    v-if="valueFraction"
                    :style="{
                        left: `${ 100 * valueFraction[0] }%`,
                        right: `${ 100 * (1 - valueFraction[1]) }%`,
                    }"
                    class="range-line-highlight"
                />
            </div>
        </template>

        <template v-slot:handle="{ value, index }">
            <div class="range-handle">
                <div class="range-handle-grab" />

                <div class="range-handle-tooltip">
                    {{ value }}
                </div>
            </div>
        </template>
    </range-slider>
```
