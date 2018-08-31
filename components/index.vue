<template>
  <div>
    <h1 :class="$style.title">Momentum pattern-lab</h1>
    <div :class="$style.componentList">
      <div :class="$style.componentGroup">
        <h4 :class="$style.groupTitle">Atoms</h4>
        <ul :class="$style.list">
          <router-link
            v-for="component in atomsComponents"
            :key="component.url"
            :class="$style.item"
            tag="li"
            :to="`/momentum/${component.url}`">
            {{ component.name }}
          </router-link>
        </ul>
      </div>
      <div :class="$style.componentGroup">
        <h4 :class="$style.groupTitle">Molecues</h4>
        <ul :class="$style.list">
          <router-link
            v-for="component in moleculesComponents"
            :key="component.url"
            :class="$style.item"
            tag="li"
            :to="`/momentum/${component.url}`">
            {{ component.name }}
          </router-link>
        </ul>
      </div>
      <div :class="$style.componentGroup">
        <h4 :class="$style.groupTitle">Organisms</h4>
        <ul :class="$style.list">
          <router-link
            v-for="component in organismsComponents"
            :key="component.url"
            :class="$style.item"
            tag="li"
            :to="`${momentumPath}/${component.url}`">
            {{ component.name }}
          </router-link>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { MomentumIndexMixin, loadNamespace } from '~/momentum';
import Atoms from '~/components/Atoms';
import Molecules from '~/components/Molecules';
import Organisms from '~/components/Organisms';

loadNamespace('atoms', Atoms);
loadNamespace('molecules', Molecules);
loadNamespace('organisms', Organisms);

export default {
  components: {
    ...Atoms,
    ...Molecules,
    ...Organisms,
  },
  mixins: [MomentumIndexMixin],
  props: {
    momentumPath: {
      type: String,
      default: '/momentum'
    }
  }
}
</script>

<style lang="scss" module>
.title {
  position: absolute;
  left: 50%;
  top: 15px;
  font-size: 15px;
  text-transform: uppercase;
  text-align: center;
  background: #fff;
  color: #202020;
  padding: 5px 10px;
  border-radius: 5px;
  transform: translateX(-50%);
  z-index: 9990;
  box-shadow: 0 12px 24px rgba(#000000, .35);
}

.componentList{
  min-height: calc(100vh - 60px);
  width: calc(100% - 40px);
  margin: 40px 20px 0;
  padding: 20px 20px 0;
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
  box-sizing: border-box;
}

.componentGroup{
  flex: 1 1 auto;
  min-height: 100%;
  padding: 0 25px;
  border-top: 1px solid #ccc;
  background: #ffffff;

  &:nth-child(2){
    background: #fafafa;
  }

  &:nth-child(3){
    background: #f5f5f5;
  }

  & + & {
    border-left: 1px solid #ccc;
  }
}

.groupTitle{
  margin: 25px 0 35px;
  font-size: 25px;
}

.list {
  padding: 0;
  margin: 0;
}

.item {
  display: block;
  cursor: pointer;

  & + & {
    margin-top: 5px;
  }

  &:hover {
    color: red;
    text-decoration: underline;
  }
}
</style>
