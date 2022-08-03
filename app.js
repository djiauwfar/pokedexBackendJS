require('dotenv').config()

const capitalizeFirstLetter = require('./helper')

const express = require('express')
const cors = require('cors')
const axios = require('axios')

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use('/', express.urlencoded({
  extended: false
}))

app.get('/', async (req, res) => {
  res.status(200).json({
    message: 'Hello, welcome to my POKEDEX API - Kawah Edukasi'
  })
})

app.get('/pokemon', async (req, res) => {
  try {
    const { data: apiResponse } = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=1000')
    const dataPokemon = apiResponse.results
    let result = []

    for (let i = 0; i < dataPokemon.length; i++) {
      result.push({
        name: capitalizeFirstLetter(dataPokemon[i].name),
        pictureFront: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i+1}.png`,
        pictureBack: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${i+1}.png`
      })      
    }

    res.status(200).json({
      result
    })
  } catch (error) {
    res.status(500).json({
      message: 'You just got error 500 (INTERNAL SERVER ERROR)'
    })
  }
})

app.get('/pokemon/:id', async (req, res) => {
  try {
    const { data: apiResponse } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${req.params.id}`)

    const result = {
      name: capitalizeFirstLetter(apiResponse.forms[0].name),
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${req.params.id}.png`,
      abilities: apiResponse.abilities.map((el) => capitalizeFirstLetter(el.ability.name)),
      types: apiResponse.types.map((el) => capitalizeFirstLetter(el.type.name)),
      stats: apiResponse.stats.map((el) => {
        return {
          name: el.stat.name.toUpperCase(),
          value: el['base_stat'],
        }
      })
    }

    res.status(200).json({
      result
    })
  } catch (error) {
    res.status(400).json({
      message: 'You just got error 400 (NOT FOUND)'
    })
  }
})

app.listen(port, () => {
  console.log(`This app is listening on ${port}`);
})