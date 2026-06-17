/** @param {import('@domount/shuttle/store').Store} store */
export function create{{Feature}}Service(store) {
  return {
    async list() {
      return store.listJson("{{featureKebab}}");
    },
  };
}
