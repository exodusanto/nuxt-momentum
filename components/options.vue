<template>
  <div :class="{
    [$style.content]: true,
    [$style.contentOpened]: opened,
  }">
    <div
      :class="$style.more"
      @click="toggleOptions">
      <i/>
    </div>
    <router-link
      :class="$style.returnToList"
      :to="momentumPath"/>
    <transition name="accordion">
      <div
        :class="$style.options"
        v-if="opened">
        <div :class="$style.col">
          <div :class="$style.divider">Props</div>
          <div
            :class="$style.preset"
            v-if="Object.keys(propsPresets).length > 0">
            <label for="prop-preset">Load preset </label>
            <select
              id="prop-preset"
              @change="$emit('update:preset', $event.target.value)">
              <option
                v-for="(options, key) in propsPresets"
                :key="key"
                :value="key">{{ key | capitalize }}</option>
            </select>
          </div>
          <div
            v-for="(prop, key) in props"
            :class="$style.input"
            :key="key">
            <label :for="key">{{ key | capitalize }}</label>
            <input
              :id="key"
              :value="valueStringify(prop)"
              @input="updateProps($event, key)">
          </div>
        </div>
        <div :class="$style.col">
          <div :class="$style.divider">Options</div>
          <div
            :class="$style.option"
            v-for="(option, key) in options"
            :key="key">
            <input
              :id="`momentum-options-${key}`"
              type="checkbox"
              :checked="option"
              @change="$emit(`update:${key}`, $event.target.checked)"/>
            <label :for="`momentum-options-${key}`">{{ key | capitalize }}</label>
          </div>
          <div :class="$style.divider">Slots</div>
          <div
            :class="$style.input"
            v-for="(slot, key) in slots"
            :key="key">
            <textarea
              :value="slot"
              @input="updateSlot($event, key)"></textarea>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  props: {
    props: Object,
    slots: Object,
    options: Object,
    propsPresets: {
      type: Object,
      default: () => {},
    },
    momentumPath: {
      type: String,
      default: '/momentum'
    }
  },
  filters: {
    capitalize(value) {
      if (!value) { return ''; }
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
  },
  data() {
    return {
      opened: false
    }
  },
  methods: {
    toggleOptions() {
      this.opened = !this.opened;
    },
    updateOption({ target }, key) {
      this.$emit('update:options', {
        ...this.options,
        [key]: target.checked,
      });
    },
    updateSlot({ target }, key) {
      this.$emit('update:slots', {
        ...this.slots,
        [key]: target.value,
      });
    },
    updateProps({ target }, key) {
      const { value } = target;
      let escaped;

      try {
        escaped = JSON.parse(value);
        escaped = escaped.replace(/([^\\])(")/g, '$1\\"');
      } catch (e) {
        // None
      }

      const isInvalid = (typeof value !== 'undefined' && value !== '') && typeof escaped === 'undefined';
      if (!isInvalid) {
        this.$emit('update:props', {
          ...this.props,
          [key]: escaped,
        });
      }

    },
    valueStringify(value) {
      let v;

      const stringify = (val) => JSON.stringify(val).replace(/([\\]")/g, '"');

      switch (typeof value) {
        case 'object':
          v = stringify(value);
          break;
        case 'string':
          v = stringify(value);
          break;
        default:
          v = value;
          break;
      }

      return v;
    }
  }
}

</script>

<style lang="scss" module>
.content {
  :global {
    .accordion-enter-active,
    .accordion-leave-active {
      transition: transform 0.2s ease;
    }
    .accordion-enter,
    .accordion-leave-to {
      transform: translateY(100%);
    }
  }

  &.contentOpened{
    .more {
      > i {
        background: transparent;
        transition: background .1ms .2s ease;

        &:before,
        &:after{
          transition: top .2s 0s ease,
            width .2s .2s ease,
            height 1ms .2s ease,
            transform 1ms .2s ease;

          top: 1px;
          height: 2px;
          width: 20px;
        }

        &:before {
          transform: translate3d(-50%, 0, 0) rotate(-45deg);
        }

        &:after {
          transform: translate3d(-50%, 0, 0) rotate(45deg);
        }
      }
    }
  }
}

.more {
  background: #41b883;
  position: fixed;
  right: 10px;
  bottom: 10px;
  padding: 10px;
  height: 40px;
  width: 40px;
  border-radius: 50%;
  box-shadow: 0 12px 24px rgba(#000000, .35);
  z-index: 9991;
  cursor: pointer;

  > i {
    position: absolute;
    height: 4px;
    width: 4px;
    border-radius: 4px;
    top: 50%;
    left: 50%;
    margin-top: -2px;
    margin-left: -2px;
    background: #35495e;
    transition: background .1ms .2s ease;

    &:before,
    &:after{
      content: '';
      position: absolute;
      height: 100%;
      width: 100%;
      left: 50%;
      transform: translate3d(-50%, 0, 0);
      border-radius: 4px;
      background: #35495e;
      transform-origin: center;
      transition: top .2s .2s ease,
        width .2s 0s ease,
        height .1ms .2s ease,
        transform 1ms .2s ease;
    }

    &:before{
      top: -8px;
    }

    &:after{
      top: 8px;
    }
  }
}

.returnToList {
  background: #41b883;
  position: fixed;
  left: 10px;
  bottom: 10px;
  padding: 10px;
  height: 40px;
  width: 40px;
  border-radius: 50%;
  box-shadow: 0 12px 24px rgba(#000000, .35);
  z-index: 9991;
  cursor: pointer;

  &:before,
  &:after{
    content: '';
    position: absolute;
    height: 2px;
    width: 10px;
    border-radius: 4px;
    left: 50%;
    top: 50%;
    transform: translate3d(-50%, -50%, 0);
    border-radius: 4px;
    background: #35495e;
    transform-origin: left center;
  }

  &:before{
    transform: translate3d(-50%, -50%, 0) rotate(-45deg);
  }

  &:after{
    transform: translate3d(-50%, -50%, 0) rotate(45deg);
  }
}

.options {
  position: fixed;
  bottom: 0;
  left: 0;
  margin: 0;
  padding: 15px 25px;
  width: 100%;
  background: #fff;
  border-top: 4px solid #41b883;
  max-height: 600px;
  overflow: auto;
  box-shadow: 0 12px 24px rgba(#000000, .35);
  display: flex;
  z-index: 9990;
}

.col {
  width: 50%;
}

.divider {
  display: block;
  margin: 35px 0 10px;
  font-weight: 600;
  text-transform: uppercase;

  &:first-child {
    margin-top: 0;
  }
}

.option {
  display: inline-block;
  margin-top: 10px;

  & + & {
    margin-left: 15px;
  }

  label {
    color: #000000;
    margin-left: 10px;
    font-weight: 600;
    cursor: pointer;
  }
}

.input {
  display: block;

  label {
    display: block;
    font-size: 14px;
    margin-bottom: 5px;
    font-weight: 600;
  }

  & + & {
    margin-top: 10px;
  }
}

.preset{
  margin: 15px 0;

  label {
    display: block;
    font-size: 14px;
    margin-bottom: 5px;
    font-weight: 600;
  }
}
</style>
