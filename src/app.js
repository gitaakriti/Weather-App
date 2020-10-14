const path = require('path')
const express = require('express')
const hbs =  require('hbs')
const geocode=require('./utils/geocode')
const forecast=require('./utils/forecast')
const app = express()

const port = process.env.PORT || 3000

//define paths for express config
const viewPath=path.join(__dirname,'../templates/views')
const partialsPath=path.join(__dirname,'../templates/partials')

//handlebarsetups
app.set('view engine','hbs')
app.set('views',viewPath)
hbs.registerPartials(partialsPath)

app.use(express.static(path.join(__dirname,'../public')))

app.get('',(req,res)=>{
    res.render('index',{
        title:'weather app',
        name:"andrew mead"
    })
})

app.get('/about',(req,res)=>{
    res.render('about',{
        title:'About',
        name:'Aakriti'
    })
})

app.get('/weather',(req,res)=>{
    if(!req.query.address){
        return res.send({
            error:"ERROR!!!"
        })
    }
    geocode(req.query.address,(error,{latitude,longitude,location}={})=>{
        if(error){
            return res.send({error})
        }
        forecast(latitude,longitude,(error,forecastData)=>{
            if(error){
                return res.send({error})
            }
            res.send({
                forecast:forecastData,
                location,
                address:req.query.address

            })
        })
    })

})


app.get('/about/*',(req,res)=>{
    res.render('404',{
        title:"generic 404",
        name:"by end",
        errorMessage:"not foundd"
    })

})
app.get('*',(req,res)=>{
    res.render('404',{
        title:'Error Page',
        name:'By ANd',
        errorMessage:"Page Not Found"
    })
})

app.listen(port,()=>{
    console.log('Server is up port'+port)
})