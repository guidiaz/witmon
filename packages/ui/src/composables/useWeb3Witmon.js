import { onMounted, ref } from 'vue'
import Web3 from 'web3/dist/web3.min.js'

import { useEggStore } from '@/stores/egg'
import jsonInterface from '../WitmonERC721.json'
import { CONTRACT_ADDRESS, NETWORK } from '../constants'

async function requestAccounts (web3) {
  return await web3.givenProvider.request({ method: 'eth_requestAccounts' })
}

function createErrorMessage (message) {
  return {
    response: {
      data: {
        message
      }
    }
  }
}

const errorNetworkMessage = `Your web3 provider should be connected to the ${NETWORK} network`
const errorCreatureDataMessage = `There was an error getting the Witty Creature data`
const errorMintMessage = `There was an error minting your NFT.`
const errorPreviewMessage = `There was an error showing the preview of your NFT.`

export function useWeb3Witmon () {
  let web3
  const egg = useEggStore()
  const isProviderConnected = ref(false)
  const mintedCreatureAddress = ref('')
  const creaturePreview = ref('')

  async function enableProvider () {
    const accounts = await requestAccounts(web3)
    if (accounts[0]) {
      isProviderConnected.value = true
    }
  }

  async function openEgg () {
    if ((await web3.eth.net.getNetworkType()) !== NETWORK) {
      return egg.setError('network', createErrorMessage(errorNetworkMessage))
    } else {
      try {
        const contract = new web3.eth.Contract(
          jsonInterface.abi,
          CONTRACT_ADDRESS
        )
        const from = (await requestAccounts(web3))[0]
        const previewArgs = await egg.getContractArgs(from)
        const preview = await contract.methods
          .previewCreatureImage(...previewArgs.values())
          .call()
        if (preview) {
          egg.savePreview(preview)
        }
      } catch (err) {
        console.error(err)
        egg.setError('preview', createErrorMessage(errorPreviewMessage))
      }
    }
  }

  onMounted(() => {
    if (window.ethereum) {
      web3 = new Web3(window.ethereum || 'ws://localhost:8545')
      if (egg.hasBorn) {
        enableProvider()
      }
    }
  })

  async function getCreatureData () {
    if ((await web3.eth.net.getNetworkType()) !== NETWORK) {
      return egg.setError('network', createErrorMessage(errorNetworkMessage))
    } else {
      try {
        const contract = new web3.eth.Contract(
          jsonInterface.abi,
          CONTRACT_ADDRESS
        )
        const from = (await requestAccounts(web3))[0]
        const creatureData = await contract.methods
          .getCreatureData(egg.index)
          .call()
        if (creatureData) {
          return creatureData
        }
      } catch (err) {
        console.error(err)
        egg.setError(
          'creatureData',
          createErrorMessage(errorCreatureDataMessage)
        )
      }
    }
  }

  async function mint () {
    if ((await web3.eth.net.getNetworkType()) !== NETWORK) {
      return egg.setError('network', createErrorMessage(errorNetworkMessage))
    } else {
      const contract = new web3.eth.Contract(
        jsonInterface.abi,
        CONTRACT_ADDRESS
      )
      const from = (await requestAccounts(web3))[0]
      const mintArgs = await egg.getContractArgs(from)
      contract.methods
        .mintCreature(...mintArgs.values())
        .send({ from })
        .on('error', error => {
          egg.setError('mint', createErrorMessage(errorMintMessage))
          console.error(error)
        })
        .on('transactionHash', function (transactionHash) {
          egg.saveMintInfo({ transactionHash })
        })
        .on('confirmation', (confirmationNumber, receipt) => {
          egg.saveMintInfo(receipt)
          const data = getCreatureData()
          egg.setCreatureData(data)
        })
        .then(newContractInstance => {
          console.log('newContractInstance', newContractInstance)

          const witmon = newContractInstance.events.NewCreature.returnValues
          console.log('Witmon minted: ', witmon)
        })
    }
  }

  return {
    mint,
    mintedCreatureAddress,
    isProviderConnected,
    creaturePreview,
    enableProvider,
    openEgg,
    getCreatureData
  }
}
