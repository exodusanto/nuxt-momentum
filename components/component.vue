<template>
  <div :class="{
    [$style.componentBackground]: true,
    [$style.componentBackgroundDarkmode]: optionsList.darkMode,
  }">
    <prototyping-options
      :props.sync="propsData"
      :slots.sync="slotsList"
      :options.sync="optionsList"
      :propsPresets="propsPresets"
      v-bind="$attrs"
      @update:preset="v => currentPreset = v"
      @update:fullpageMode="setFullpage"
      @update:darkMode="setDarkmode"/>
    <div :class="{
      [$style.componentProto]: true,
      [$style.componentProtoFullpage]: optionsList.fullpageMode,
    }">
      <component
        :is="componentParam"
        v-bind="propsData"
        ref="component">
        <span
          v-if="optionsList.defaultSlotRaw"
          v-html="slotsList.defaultSlot"/>
        <template v-else>
          {{ slotsList.defaultSlot }}
        </template>
      </component>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import Atoms from '~/components/Atoms';
import Molecules from '~/components/Molecules';
import Organisms from '~/components/Organisms';
import PrototypingOptions from './options.vue';
import { loadNamespace } from '../utils';
import Cookie from 'js-cookie';
import CamelCase from 'lodash/camelCase';
import UpperFirst from 'lodash/upperFirst';

const { forEach } = Array.prototype;
const { hasOwnProperty: has}  = Object.prototype;

loadNamespace('atoms', Atoms);
loadNamespace('molecules', Molecules);
loadNamespace('organisms', Organisms);

export default {
  components: {
    PrototypingOptions,
    ...Atoms,
    ...Molecules,
    ...Organisms,
  },
  inheritAttribues: false,
  props: {
    propsSpecs: {
      type: Object,
      default: () => {
        return {}
      }
    },
    momentumPath: {
      type: String,
      default: '/momentum'
    }
  },
  data(){
    return {
      propsData: {},
      propsPresets: {},
      slotsList: {
        defaultSlot: 'Default text',
      },
      optionsList: {
        fullpageMode: false,
        darkMode: false,
        defaultSlotRaw: false,
      },
      currentPreset: 'default',

    }
  },
  watch: {
    currentPreset: {
      callback: 'onCurrentPresetChange'
    }
  },
  computed: {
    componentParam() {
      return this.$route.params.component;
    },
  },
  beforeMount() {
    const fullpage = Cookie.get('prototyping:fullpage');
    const darkmode = Cookie.get('prototyping:darkmode');

    this.optionsList.fullpageMode = fullpage === 'true';
    this.optionsList.darkMode = darkmode === 'true';
  },
  mounted() {
    // Wait async component load
    this.waitComponentLoad();
  },
  methods: {
    onCurrentPresetChange() {
      const component = this.$refs.component;
      const { $options } = component;
      const { props, _componentTag } = $options;
      const name = UpperFirst(CamelCase(
        _componentTag.replace(/(^atoms-)|(^molecules-)|(^organisms-)/, ''),
      ));
      const availableProps = this.propsSpecs[name][this.currentPreset];

      const oldProps = {};
      forEach.call(Object.keys(this.propsData), (prop) => oldProps[prop] = undefined);

      this.propsData = {
        ...oldProps,
        ...availableProps,
      };
    },
    waitComponentLoad() {
      const component = this.$refs.component;
      if (typeof component === 'undefined') {
        setTimeout(() => {
          this.waitComponentLoad();
        }, 2);
        return;
      }

      this.loadComponentProp(component);
    },
    loadComponentProp(component) {
      if (component instanceof Vue) {
        const { $options } = component;
        const { props, _componentTag }  = $options;
        const name = UpperFirst(CamelCase(
          _componentTag.replace(/(^atoms-)|(^molecules-)|(^organisms-)/, ''),
        ));

        const hasPropsSpec = has.call(this.propsSpecs, name)
          && has.call(this.propsSpecs[name], 'default');
        const hasDefaultSpec = hasPropsSpec
          && Object.keys(this.propsSpecs[name].default).length > 0;

        if (hasPropsSpec) {
          this.propsPresets = this.propsSpecs[name];
        }


        forEach.call(Object.keys(props || {}), (prop) => {
          const hasPropInDefault = hasDefaultSpec
            && has.call(this.propsSpecs[name].default, prop);

          if (hasPropInDefault) {
            this.$set(this.propsData, prop, this.propsSpecs[name].default[prop]);
          } else if (props[prop].type.name === 'Array') {
            this.$set(this.propsData, prop, []);
          } else {
            this.$set(this.propsData, prop, undefined);
          }
        });
      }
    },
    setFullpage(value) {
      this.optionsList.fullpageMode = value;
      Cookie.set('prototyping:fullpage', value, { expires: 7 });
    },
    setDarkmode(value) {
      this.optionsList.darkMode = value;
      Cookie.set('prototyping:darkmode', value, { expires: 7 });
    }
  }
}
</script>

<style lang="scss" module>
.componentBackground {

  &:before,
  &:after{
    content: '';
    display: table;
    clear: both;
  }

  background-color: #fafafa;

  &.componentBackgrounDarkmode{
    background-color: #000000;

    .componentProto {
      border-color: #fafafa;
    }
  }
}

.componentProto{
  min-height: calc(100vh - 40px);
  width: calc(100% - 40px);
  margin: 20px;
  border: 3px dashed #000000;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  background-clip: content-box;
  transition: all .3s ease, border-width 1ms ease;

  &.componentProtoFullpage{
    min-height: 100vh;
    width: 100%;
    margin: 0;
    border-color: transparent;
    border-width: 0;
    padding: 0;
    align-items: flex-start;
  }
}
</style>
