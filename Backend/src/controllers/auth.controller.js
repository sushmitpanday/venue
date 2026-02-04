const usermodel = require('../database/models/user.model')
const ownermodel=require('../database/models/owner.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


async function register(req, res) {
    
        const { fullname, email, Password } = req.body

        if (!fullname || !email || !Password) {
            return res.status(400).json({ message: 'fullname, email and password are required' })
        }

        const existing = await usermodel.findOne({ email })
        if (existing) return res.status(400).json({ message: 'User already exists' })

        const hashed = await bcrypt.hash(Password, 10)

        const user = new usermodel({ fullname, email, Password: hashed })

        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY)
        res.cookie('token', token, { httpOnly: true })

        res.status(201).json({ message: 'User registered successfully',
            user: { id: user._id, fullname: user.fullname, email: user.email }
         })
    }

async function login(req, res) {
   
        const { email, Password } = req.body
        if (!email || !Password) return res.status(400).json({ message: 'email and password are required' })

        const user = await usermodel.findOne({ email })
        if (!user) return res.status(400).json({ message: 'Invalid credentials' })

        const match = await bcrypt.compare(Password, user.Password)

        if (!match) return res.status(400).json({ message: 'Invalid credentials' })

       
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY)

        res.cookie('token', token)
        return res.status(200).json({ message: 'Login successful', token,
            user: { id: user._id, fullname: user.fullname, email: user.email }
         })


}

async function logout(req, res) {
    res.clearCookie('token')
    return res.status(200).json({ message: 'Logout successful' })
}

async function ownerragister(req,res) {
    
    const { fullname, email, Password } = req.body

    if (!fullname || !email || !Password) {
        return res.status(400).json({ message: 'fullname, email and password are required' })
    }

    const existing = await ownermodel.findOne({ email })
    if (existing) return res.status(400).json({ message: 'User already exists' })

    const hashed = await bcrypt.hash(Password, 10)

    const owner = new ownermodel({ fullname, email, Password: hashed }) 
    await owner.save();

    const token = jwt.sign({ id: owner._id }, process.env.SECRET_KEY)
    res.cookie('token', token, { httpOnly: true })

    res.status(201).json({ message: 'Owner registered successfully',
        user: { id: owner._id, fullname: owner.fullname, email: owner.email }
    })

}

 async function ownerlogin(req,res) {
        const { email, Password } = req.body
        if (!email || !Password) return res.status(400).json({ message: 'email and password are required' })

        const owner = await ownermodel.findOne({ email })
        if (!owner) return res.status(400).json({ message: 'Invalid credentials' })

        const match = await bcrypt.compare(Password, owner.Password)
        if (!match) return res.status(400).json({ message: 'Invalid credentials' })

       
        const token = jwt.sign({ id: owner._id }, process.env.SECRET_KEY)
        res.cookie('token', token)
        return res.status(200).json({ message: 'Login successful', token,
            user: { id: owner._id, fullname: owner.fullname, email: owner.email }
         })
    }

async function ownerlogout(req,res) {
    res.clearCookie('token')
    return res.status(200).json({ message: 'Owner Logout successful' })
}

module.exports = { register, login, logout, ownerragister, ownerlogin,ownerlogout }
   
