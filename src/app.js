const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const express = require('express')
const hbs = require('hbs')
const app = express()

const path = require('path')

//Define paths for Express config 
const publicDirectoryPath = path.join(__dirname,'../public')
const viewsPath = path.join(__dirname,'../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')
//Setup static directory to serve
app.use(express.static(publicDirectoryPath))

//Setup handlebars engine and views location
app.set('view engine','hbs')
app.set('views',viewsPath)

hbs.registerPartials(partialsPath)

app.get('',(req,res)=>{
    res.render('index',{
        name : 'Andrew Mead',
        title : 'Weather App'
    })
})


app.get('/help',(req,res)=>{
    res.render('help',{
        title : 'Help',
        helpText : 'This is some helpfull page',
        name : 'Andrew Mead'
    })
})

app.get('/about',(req,res)=>{
    res.render('about',{
        title : 'About me',
        name : 'Andrew Mead'
    })
})

app.get('/weather',(req,res)=>{
   if(!req.query.address){
    return res.send({
        error : 'You must provide an address !'
    })
   }
    geocode(req.query.address,(error,{latitude,longitude,location}={})=>{
        if(error){
            return res.send({
                error : error
            })
        }
        forecast(latitude,longitude,(error,data)=>{
            if(error){
                return res.send({
                    error : error
                })
            }
            res.send({
                address : req.query.address,
                forecast : data,
                location : location
            })
        })
    })

})

app.get('/product',(req,res)=>{
   
    if(!req.query.search){
       return res.send({
            error : 'You must provide a search term'
        })
    }
    res.send({
       products : []
    })
})

app.get('/help/*',(req,res)=>{
    res.render('404',{
        title:'404',
        errorMessage : 'Help article not found',
        name : 'Andrew Mead'
    })
})

app.get('*',(req,res)=>{
    res.render('404',{
        title : '404 page',
        errorMessage : 'page not found',
        name : 'Andrew Mead'
    })
})


app.listen(3000,()=>{
    console.log('Server is up on port 3000')
})