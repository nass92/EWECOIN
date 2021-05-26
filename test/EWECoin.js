const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('EWECOIN Token', function () {
  let EWECOIN, ewecoin, dev, owner, alice, bob, charlie, dan, eve
  const NAME = 'EWECOIN'
  const SYMBOL = 'EWE'
  const INITIAL_SUPPLY = ethers.utils.parseEther('8000000000')

  beforeEach(async function () {
    ;[dev, owner, alice, bob, charlie, dan, eve] = await ethers.getSigners()
    EWECOIN = await ethers.getContractFactory('EWECOIN')
    ewecoin = await EWECOIN.connect(dev).deploy(owner.address, INITIAL_SUPPLY)
    await ewecoin.deployed()
    /*
    Il faudra transférer des tokens à nos utilisateurs de tests lorsque la fonction transfer sera implementé
    await ewecoin
      .connect(owner)
      .transfer(alice.address, ethers.utils.parseEther('100000000'))
      */
  })

  describe('Deployement', function () {
    it('Has name EWECOIN', async function () {
      expect(await ewecoin.name()).to.equal(NAME)
    })
    it('Has symbol EWE', async function () {
      expect(await ewecoin.symbol()).to.equal(SYMBOL)
    })
    it('mints initial Supply to owner', async function () {
      let ewecoin = await EWECOIN.connect(dev).deploy(
        owner.address,
        INITIAL_SUPPLY
      )
      expect(await ewecoin.balanceOf(owner.address)).to.equal(INITIAL_SUPPLY)
    })

    it('emits event Transfer when mint initial supply to owner at deployement', async function () {
      /*
        On peut tester si un event a été emit depuis une transaction particulière.
        Le problème c'est qu'une transaction de déploiement ne nous retourne pas la transaction
        mais l'instance du smart contract déployé.
        Pour récupérer la transaction qui déployé le smart contract il faut utilisé un l'attribut
        ".deployTransaction" sur l'instance du smart contract
      */
      let receipt = await ewecoin.deployTransaction.wait()
      let txHash = receipt.transactionHash
      await expect(txHash)
        .to.emit(ewecoin, 'Transfer')
        .withArgs(ethers.constants.AddressZero, owner.address, INITIAL_SUPPLY)
    })
  })

  describe('Allowance system', function () {
    // Tester le système d'allowance ici
    let allowance

    beforeEach(async function () {
      allowance = await ewecoin.connect(owner).approve(bob.address, INITIAL_SUPPLY)
    })

    it('Emit an Approved event', async function () {
      expect(allowance).to.emit(ewecoin, 'Approval').withArgs(owner.address, bob.address, INITIAL_SUPPLY)
    })

  })


  describe('Token transfers', function () {
    let transaction
    beforeEach(async function () {
      // INITIAL_SUPPLY => Owner to charlie
      transaction = await ewecoin.connect(owner).transfer(charlie.address, INITIAL_SUPPLY)
    })

   it('Decrease the sender balance ', async function () {
      expect(await ewecoin.balanceOf(owner.address)).to.equal(0)
    })

    it('Increase the recipient balance', async function () {
      expect(await ewecoin.balanceOf(charlie.address)).to.equal(INITIAL_SUPPLY)
    })

    it('transfers tokens from sender to receipient', async function () {
      expect(transaction).to.emit(ewecoin, 'Transfer').withArgs(owner.address, charlie.address, INITIAL_SUPPLY)
    })


    it('transferFrom tokens from sender to receipient', async function () {
      expect(transaction).to.emit(ewecoin, 'Transfer').withArgs(owner.address, charlie.address, INITIAL_SUPPLY)
    })

    it('emits event Transfer when transfer token', async function () {
      expect(transaction).to.emit(ewecoin, 'Transfer').withArgs(owner.address, charlie.address, INITIAL_SUPPLY)
    })

    it('Revert if balance is insuffisiant', async function () {
      await expect(ewecoin.connect(owner).transfer(charlie.address, INITIAL_SUPPLY)).to.be.revertedWith("Ewecoin: Insuffisiant balance.")
    })

  })
})
