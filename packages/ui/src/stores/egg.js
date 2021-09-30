import { defineStore } from 'pinia'
import { WittyCreaturesApi } from '@/api'

export const useEggStore = defineStore('egg', {
  state: () => {
    return {
      api: new WittyCreaturesApi(),
      id: null,
      score: null,
      rarityIndex: null,
      timeToBirth: null,
      incubatedTimeLeft: null,
      incubator: null,
      incubatingTimeLeft: null,
      incubated: null,
      errors: {
        claim: null,
      }
    }
  },
  // getters: {
  //   claimError: (state) => state.errors.claim,
  // },
  actions: {
    async claim({ key }) {
      const request = await this.api.claim({ key })
      if (request.token) {
        await this.saveClaimInfo(request)
        console.log(this.$router)
        this.$router.push('/my-egg')
      } else if (request.error) {
        console.log(request.error.response.data.message)
        this.errors['claim'] = request.error.response.data.message
      }
    },
    saveClaimInfo(info) {
      this.id = info.id
      localStorage.setItem('token', info.token)
    },
    getToken() {
      const token = localStorage.getItem('token')
      console.log('token', token)
      return token
    },
    async getEggInfo() {
      const token = this.getToken()
      const request = await this.api.getEggInfo({ token })
      if (request.token) {
        await this.saveToken(request.token)
        console.log(this.$router)
        this.$router.push('/my-egg')
      } else if (request.error) {
        console.log(request.error.response.data.message)
        this.errors['claim'] = request.error.response.data.message
      }
    }
  }
})
