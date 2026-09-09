import express from 'express';
import pg from 'pg';
const app=express(), PORT=process.env.PORT||10000, PASS=process.env.ADMIN_PASSWORD||'admin12345';
app.use(express.json({limit:'2mb'}));app.use(express.static('public'));
const products=[
{id:1,name:'Royal Silk Saree',category:'Saree',price:2450,oldPrice:2950,rating:4.9,reviews:126,stock:18,image:'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85'},
{id:2,name:'Pearl Churi Set',category:'Sharee Churi Three Pic',price:1350,oldPrice:1650,rating:4.8,reviews:84,stock:25,image:'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=85'},
{id:3,name:'Noor Jewelry Set',category:'Juwellary',price:1890,oldPrice:2290,rating:4.9,reviews:91,stock:14,image:'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85'},
{id:4,name:'Luxe Cat-Eye Sunglass',category:'Sunglass',price:790,oldPrice:990,rating:4.7,reviews:63,stock:31,image:'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85'},
{id:5,name:'Aarohi Festive Saree',category:'Saree',price:3150,oldPrice:3690,rating:5,reviews:47,stock:11,image:'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=900&q=85'},
{id:6,name:'Blush Crystal Churi',category:'Sharee Churi Three Pic',price:1120,oldPrice:1390,rating:4.8,reviews:52,stock:20,image:'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=900&q=85'}];
const reviews=[
{id:1,name:'Tayeba Rahman',rating:5,text:'Saree-ta exactly picture-er moto. Packaging o khub premium chilo.',product:'Royal Silk Saree'},
{id:2,name:'Mim Akter',rating:5,text:'Jewelry set ta onek elegant. Quality dekhe honestly impressed!',product:'Noor Jewelry Set'},
{id:3,name:'Nusrat Jahan',rating:5,text:'Delivery fast, product beautiful, customer support-o friendly.',product:'Aarohi Festive Saree'},
{id:4,name:'Sadia Islam',rating:4.8,text:'Sunglass ta stylish and comfortable. Definitely recommended.',product:'Luxe Cat-Eye Sunglass'},
{id:5,name:'Jannat Sultana',rating:5,text:'Churi set-er finishing khub sundor. Gift hisebeo perfect.',product:'Pearl Churi Set'}];
const orders=[];const settings={whatsapp:'01342542022',facebook:'#',instagram:'#',tiktok:'#',youtube:'#'};
let pool=null;if(process.env.DATABASE_URL) pool=new pg.Pool({connectionString:process.env.DATABASE_URL,ssl:{rejectUnauthorized:false}});
const auth=r=>r.headers['x-admin-password']===PASS;
app.get('/api/products',(_,r)=>r.json(products));app.get('/api/reviews',(_,r)=>r.json(reviews));app.get('/api/settings',(_,r)=>r.json(settings));
app.post('/api/reviews',(q,r)=>{const {name,rating,text,product}=q.body;if(!name||!text)return r.status(400).json({error:'Required'});const x={id:Date.now(),name,rating:Number(rating||5),text,product:product||'',verified:false};reviews.unshift(x);r.json(x)});
app.post('/api/orders',(q,r)=>{const {customer,items,total}=q.body;if(!customer?.name||!customer?.phone||!customer?.address||!items?.length)return r.status(400).json({error:'Required'});const no='SV'+Date.now().toString().slice(-9);orders.unshift({orderNo:no,customer,items,total,status:'Pending',createdAt:new Date().toISOString()});r.json({orderNo:no,status:'Pending'})});
app.get('/api/orders/:no',(q,r)=>{const o=orders.find(x=>x.orderNo===q.params.no);o?r.json(o):r.status(404).json({error:'Order not found'})});
app.post('/api/admin/login',(q,r)=>q.body.password===PASS?r.json({ok:true}):r.status(401).json({ok:false}));
app.get('/api/admin/orders',(q,r)=>auth(q)?r.json(orders):r.status(401).json({error:'Unauthorized'}));
app.patch('/api/admin/orders/:no',(q,r)=>{if(!auth(q))return r.status(401).json({error:'Unauthorized'});const o=orders.find(x=>x.orderNo===q.params.no);if(!o)return r.status(404).json({error:'Not found'});o.status=q.body.status;r.json(o)});
app.delete('/api/products/:id',(q,r)=>auth(q)?r.json({ok:true}):r.status(401).json({error:'Unauthorized'}));
app.put('/api/settings',(q,r)=>{if(!auth(q))return r.status(401).json({error:'Unauthorized'});Object.assign(settings,q.body);r.json(settings)});
app.use((_,r)=>r.sendFile(process.cwd()+'/public/index.html'));app.listen(PORT,()=>console.log('Sraboni Style Corner running on '+PORT));
