export const state = () => ({
  wpt: 0
})

export const mutations = {
  increment (state) {
    state.wpt += 10;
  }
}