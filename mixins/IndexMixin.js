export default {
  computed: {
    components() {
      return this.$options.components;
    },
    atomsComponents() {
      return this.filterGroupComponents('atoms');
    },
    moleculesComponents() {
      return this.filterGroupComponents('molecules');
    },
    organismsComponents() {
      return this.filterGroupComponents('organisms');
    },
  },
  methods: {
    filterGroupComponents(namespace) {
      return Object.keys(this.components || {}).filter((key) => {
        return key.indexOf(namespace) === 0;
      }).map((component) => {
        return {
          url: component,
          name: component.replace(`${namespace}-`, '')
            .replace(/^\w/, (c) => c.toUpperCase()),
        };
      });
    }
  }
}
