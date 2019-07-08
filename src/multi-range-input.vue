<template>
    <div class="multi-range-input">
        <global-events
            target="document"

            @mouseleave="stopPanning"
            @mouseup="stopPanning"
            @mousemove="handlePanning"
            @touchend="stopPanning"
            @touchcancel="stopPanning"
            @touchmove="handlePanning"
        />

        <div
            ref="container"
            :style="{ padding: `${ padding } 0` }"
            class="multi-range-input-container"
        >
            <slot
                :value="value"
                :value-fraction="valueFraction"
                name="line"
            >
                <div class="multi-range-input-line" />
            </slot>

            <div
                v-for="(v, index) in value"
                :key="[v, index].join('-')"
                :style="{ left: getPosition(v) }"
                class="multi-range-input-position"
                @mousedown.prevent="startPanning(index)"
                @touchstart.prevent="startPanning(index)"
            >
                <slot :value="v" :index="index" name="handle">
                    <div class="multi-range-input-handle" />
                </slot>
            </div>
        </div>
    </div>
</template>

<script>
    import GlobalEvents from 'vue-global-events';

    export default {
        name: 'multi-range-input',

        components: {
            GlobalEvents,
        },

        props: {
            min: {
                type: Number,
                required: true,
            },

            max: {
                type: Number,
                required: true,
            },

            value: {
                type: Array,
                default() {
                    return [];
                },
            },

            padding: {
                type: String,
                default: '12px',
            },

            step: {
                type: Number,
                default: 1,
            },
        },

        data() {
            return {
                mousedown: false,
                dragIndex: null,
            };
        },

        computed: {
            rangeWidth: {
                cache: false,

                get() {
                    return this.$refs.container
                        ? this.$refs.container.getBoundingClientRect().width
                        : 0;
                },
            },

            /**
             * Get values as a percentage
             *
             * @returns {Array<String>}
             */
            valueFraction() {
                return this.value.map(this.getPositionFraction);
            },
        },

        methods: {
            /**
             * Round a value to the nearest step
             *
             * @param {Number} value
             *
             * @returns {Number}
             */
            roundToNearest(value) {
                const over = 1 / this.step;

                return Math.round(value * over) / over;
            },

            /**
             * Get a value limited to the min/max values
             *
             * @param {Number} value
             *
             * @returns {Number}
             */
            getEnforcedRange(value) {
                return Math.max(
                    this.min,
                    Math.min(
                        this.max,
                        value
                    )
                );
            },

            /**
             * Get a value from a fraction
             *
             * @param {Number} fraction
             *
             * @returns {Number}
             */
            getValueFromFraction(fraction) {
                return this.getEnforcedRange((fraction * (this.max - this.min)) + this.min);
            },

            /**
             * Get a fraction from a value
             *
             * @param {Number} value
             *
             * @returns {Number}
             */
            getPositionFraction(value) {
                return (value - this.min) / (this.max - this.min);
            },

            /**
             * Get a percentage position from a value
             *
             * @param {Number} value
             *
             * @returns {String}
             */
            getPosition(value) {
                return `${ this.getPositionFraction(value) * 100 }%`;
            },

            /**
             * Get a mouse/touch position from an event
             *
             * @param {Event} event
             *
             * @returns {Number}
             */
            getTouchPosition(event) {
                return event.clientX || event.touches[0].clientX;
            },

            /**
             * Start panning
             *
             * @param {Number} index
             */
            startPanning(index) {
                this.mousedown = true;
                this.dragIndex = index;
            },

            /**
             * Handle panning
             *
             * @param {Event} event
             */
            handlePanning(event) {
                if (!this.mousedown) {
                    return;
                }

                event.preventDefault();

                const mouseX = this.getTouchPosition(event);
                const containerX = this.$refs.container.getBoundingClientRect().left;
                const absolutePosition = mouseX - containerX;
                const fractionPosition = absolutePosition / this.rangeWidth;
                const valuePosition = this.getValueFromFraction(fractionPosition);

                let value = [...this.value];
                value[this.dragIndex] = valuePosition;
                value = value.sort((a, b) => a - b);
                this.dragIndex = value.indexOf(valuePosition);

                this.$emit('input', value.map(this.roundToNearest));
            },

            /**
             * Stop handling panning
             *
             * @param {Event} event
             */
            stopPanning(event) {
                if (!this.mousedown) {
                    return;
                }

                event.preventDefault();

                this.mousedown = false;
            },
        },
    };
</script>

<style lang="scss" scoped>
    .multi-range-input {
        .multi-range-input-container {
            position: relative;

            .multi-range-input-line {
                height: 3px;
                background: #666666;
            }

            .multi-range-input-position {
                position: absolute;
                transform: translate(-50%, -50%);
                top: 50%;

                .multi-range-input-handle {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: #aaaaaa;
                    cursor: pointer;
                }
            }
        }
    }
</style>
