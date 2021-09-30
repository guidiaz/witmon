<template>
  <div class="container">
    <img
      src="@/assets/witty-creatures-logo.svg"
      alt="Witty creatures logo"
      class="logo"
    />
    <input v-model="value" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Egg ID">
    <Button color="black" @click="claimEgg">
      Submit
    </Button>
    <p v-if="egg.errors.claim" class="error">{{ egg.errors.claim }}</p>
  </div>
</template>

<script>
import { useEggStore } from '@/stores/egg'

export default {
  setup () {
    const egg = useEggStore()
    const value = ''
    return { egg, value }
  },
  methods: {
    claimEgg() {
      console.log(this.value)
      this.egg.claim({ key: this.value })
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  margin: 0 auto;
  padding: 16px;
  max-width: 500px;
  row-gap: 18px;
  display: grid;
  grid-template-rows: repeat(2, max-content);
  justify-items: center;
  align-content: center;
  text-align: center;
  .logo {
    width: 300px;
  }
}
</style>
