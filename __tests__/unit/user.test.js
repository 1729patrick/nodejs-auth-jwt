const bcrypt = require('bcryptjs')

const { User } = require('../../src/app/models')
const truncate = require('../utils/truncate')

describe('User', ()=>{
    beforeEach(async ()=> {
        await truncate()
    })


    it('should encrypt user password', async () => {
        const user = await User.create({name: "patrick", email: "p@b.com", password: "patrick123"})

        const compareHash = await bcrypt.compare('patrick123', user.password_hash)

        expect(compareHash).toBe(true)
    })
})