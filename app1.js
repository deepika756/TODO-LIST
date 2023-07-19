var express=require('express')
var sql=require('mysql2')
var bp=require('body-parser')
var encodedata=bp.urlencoded({extended:false})

var app=express()
var client=sql.createConnection({
    host:'localhost',
    user:'root',
    password:'Elurideepika@1',
    database:'sravya'
})
app.set('view engine','ejs')

app.get('/home',function(req,res){
    res.render('pages/hp')
})

app.get('/about',function(req,res){
    res.render('pages/about')
})

app.get('/register',function(req,res){
    res.render('pages/register')
})
app.post('/register',encodedata,function(req,res){
    var name1=req.body.name;
    var email=req.body.email;
    var ge=req.body.ge;
    var phno=req.body.phno;
    var pwd=req.body.pwd;
    console.log(name1,email,ge,phno,pwd)
    var sql="INSERT INTO stu_todo(name,email,gender,phno,pwd) VALUES('"+name1+"','"+email+"','"+ge+"','"+phno+"','"+pwd+"')"
    client.connect(function(err){
        if(err) throw err;
    client.query(sql,function(err,result){
        if(err){
            throw err;
        }
        else{
            var sql1="create table "+name1+" (id mediumint(25) auto_increment,todo varchar(255),status mediumint(25),time varchar(255) ,date varchar(255),primary key(id) )"
            client.query(sql1,function(err,data){
                if(err) throw err
                console.log('table created')
            })
            res.render('pages/hp')
        }
    })
})
})

app.get('/login',function(req,res){
    res.render('pages/login')
})
app.post('/login',encodedata,function(req,res){
    var email=req.body.email;
    var pwd=req.body.pwd;
    client.connect(function(err){
        if(err) throw err;
        else{
            var sql1="select * from stu_todo"
            client.query(sql1,function(err,data){
                if(err) throw err;
                var flag=0;
                for(let x of data){
                    if(x['email']==email && x['pwd']==pwd){
                        console.log(email,pwd)
                        flag=1;
                    }
                }
                if(flag==1){
                    var sql2="select name,email from stu_todo where email='"+email+"'"
                    client.query(sql2,function(err,result){
                        if(err) throw err
                        for(let x of result){
                            global.n=x['name']
                            global.e=x['email']
                        }
                    })
                    res.redirect('/user')
                }
                else{
                    res.redirect('/home')
                }
            })
        }
    })
})

app.get('/user',function(req,res){
    var sql="select * from "+n+""
    console.log(n)
    client.connect(function(err){
        if(err) throw err
        client.query(sql,function(err,data){
            console.log(data)
            if(err) throw err
            else{
                res.render('pages/display1',{title:'todo list',action:'list',sampleData:data})
            }
        })
    })
})

app.get('/add',function(req,res){
    res.render('pages/display1',{title:'insert data',action:'add'})
})
app.post('/add',encodedata,function(req,res){
    var todo=req.body.todo;
    var date_obj= new Date()
    var hr=date_obj.getHours().toString()
    var min=date_obj.getMinutes().toString()
    var sec=date_obj.getSeconds().toString()
    var day=date_obj.getDate()
    var mon=date_obj.getMonth()+1
    var year=date_obj.getFullYear()
    var time=hr+":"+min+":"+sec
    var date=day+"/"+mon+"/"+year
    console.log(hr,min,sec,time,date)
    var sql="insert into "+n+"(todo,status,time,date) values('"+todo+"','"+0+"','"+time+"','"+date+"')"    
    client.connect(function(err){
        if(err) throw err;
        else{
            client.query(sql,function(err,data){
                console.log(todo)
                if(err) throw err
                else{
                    res.redirect('/user')
                }
            })
        }
    })
})

app.get('/delete/:id',function(req,res){
    var id=req.params.id
    console.log(id)
    var sql="delete from "+n+" where id='"+id+"'"
    client.query(sql,function(err,data){
        if(err) throw err
        else{
            res.redirect('/user')
        }
    })
})

app.get('/done/:id',function(req,res){
    var id=req.params.id
    console.log(id)
    var sql="update "+n+" set status="+1+" where id='"+id+"'"
    client.query(sql,function(err,data){
        if(err) throw err
        else{
            res.redirect('/user')
        }
    })
})

app.get('/profile',function(req,res){
    var sql="select * from stu_todo where email='"+e+"'"
    client.connect(function(err){
        if(err) throw err
        client.query(sql,function(err,data){
            console.log(data)
            if(err) throw err
            else{
                res.render('pages/display1',{title:'my profile',action:'profile',sampleData:data})
            }
        })
    })
})

app.get('/update',function(req,res){
    res.render('pages/profile')
})
app.post('/update',encodedata,function(req,res){
    var name=req.body.name
    var email=req.body.email
    var ge=req.body.ge
    var phno=req.body.phno
    var pwd=req.body.pwd
    var sql1="update stu_todo set gender='"+ge+"',phno='"+phno+"',pwd='"+pwd+"' where email='"+e+"'"
    client.query(sql1,function(err,result){
        console.log(name,email,ge,phno,pwd)
        if(err) throw err;
        else{
            res.redirect('/user')
        }
    })
})

app.get('/logout',function(req,res){
    res.redirect('/home')
})
app.get('/d-info',function(req,res){
    res.render('pages/cards')
})
app.get('/display1',function(req,res){
    res.redirect('/user')
})
app.get('/work',function(req,res){
    res.redirect('/user')
})
app.listen(3000)