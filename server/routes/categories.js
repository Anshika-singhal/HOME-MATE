//module.exports=Router;
const express=require('express');
const router=express.Router();
const Category =require('../models/category');


//categorry api building

router.post('/v1/admin/categories', async (req, res) => {
    let { name } = req.body;
    if (typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ message: 'Category name is required and must be a valid string.' });
    }
    name=name.toLowerCase().trim();
    name = name.replace(/\s+/g, ' ');

    const isValidName = /^[a-zA-Z0-9 ]+$/.test(name);

    if (!isValidName) {
        return res.status(400).json({ message: 'Invalid category name! Only alphanumeric characters are allowed, with one spaces and no  special symbols.' });
    }

    try {
        const category = new Category({ name });
        await category.save();
        res.status(201).json({ message: "Category created successfully!" });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: "Category already exists" });
        }
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.get('/v1/categories',async(req,res)=>{
    try{
        const categories=await Category.find();
        res.status(200).json(categories);


    }catch(err){
        res.status(500).json({message:"server error", error:err.message})
    }
});

router.delete('/v1/categories',async(req,res)=>{
    try{
        const result=await Category.deleteMany({});
        res.status(200).json(result);


    }catch(err){
        res.status(500).json({message:"server error", error:err.message})
    }
});

router.get('/v1/categories/:id',async(req,res)=>{
    const {id}=req.params;
    try{
        const getting=await Category.findById(id);
        if(!getting){
            return res.status(404).json({message:"Category not found!!"});
        }
        res.status(200).json(getting);

    }catch(err){
        res.status(500).json({message:"server error", error:err.message})
    }
});

router.delete('/v1/categories/:id',async(req,res)=>{
    const {id}=req.params;
    try{
        const match=await Category.findByIdAndDelete(id);
        if(!match){
            return res.status(404).json({message:"Category not found!!"});
        }
        res.status(200).json({
            message:"Category Deleted Successfully!!!",
            data: match
        });

    }catch(err){
        res.status(500).json({message:"server error", error:err.message})
    }
});

//----------------------------------------------------------------------------------------------------------------------------------------------------------

router.post('/v1/categories/:id/items', async (req, res) => {
    const { name, description, instructions, frequency } = req.body;
    const serviceDate = new Date(req.body.serviceDate); // Convert to Date

    // Validate the serviceDate
    if (isNaN(serviceDate.getTime())) {
        return res.status(400).json({ message: "Invalid service date format" });
    }

    const { id } = req.params;

    try {
        const category = await Category.findById(id);
        if (!category) {
            return res.status(400).json({ message: "Category not found!!" });
        }

        const newItem = { name, description, instructions, workFinish: false, frequency, serviceDate };
        category.items.push(newItem);
        await category.save();

        res.status(201).json({ message: "Item Added Successfully!!!!" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});


router.put('/v1/categories/:categoryId/items/:itemId',async(req,res)=>{
    const {categoryId,itemId}=req.params;
    try{
        const category=await Category.findById(categoryId);
        if(!category){
            return res.status(404).json({message:"Category not found!!"});
        }
        const item=category.items.id(itemId);
        if(!item){
            return res.status(404).json({message:"Item not found"});
        }
        item.workFinish=!item.workFinish;
        await category.save();
        res.status(200).json({message:"Item updated successfully!",item});
    }
    catch(error){
        res.status(500).json({message:"server error", error:err.message})
    }
});

router.get('/v1/categories/:id/items',async(req,res)=>{
    const {id}=req.params;
    try{
        const getting=await Category.findById(id);
        if(!getting){
            return res.status(404).json({message:"Category not found!!"});
        }
        res.status(200).json({message:"Category found successfully",getting});


    }catch(err){
        res.status(500).json({message:"server error", error:err.message})
    }
});

router.get('/v1/categories/:categoryId/item/:itemId',async(req,res)=>{
    const {categoryId,itemId}=req.params;
    try{
        const Getting=await Category.findById(categoryId);
        if(!Getting){
            return res.status(404).json({message:"Category not found!!"});
        }
        const item=Getting.items.id(itemId);
        if(!item){
            res.status(404).json({message:"Item not found in this category!!!"});
        }
        res.status(200).json({message:"Item found successfully",item});


    }catch(err){
        res.status(500).json({message:"server error", error:err.message})
    }
});

router.delete('/v1/categories/:id/items',async(req,res)=>{
    const {id}=req.params;
    try{
        const deleting=await Category.findById(id);
        if(!deleting){
            return res.status(404).json({message:"Category not found!!"});
        }
        deleting.items=[];
        await deleting.save();
        res.status(200).json({message:"All items in the category are deleted successfully"});


    }catch(err){
        res.status(500).json({message:"server error", error:err.message})
    }
});

router.delete('/v1/categories/:categoryId/item/:itemId',async(req,res)=>{
    const {categoryId,itemId}=req.params;
    try{
        const Deleting=await Category.findById(categoryId);
        if(!Deleting){
            return res.status(404).json({message:"Category not found!!"});
        }
        const itemIndex = Deleting.items.findIndex(item => item._id.toString() === itemId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item not found in this category!" });
        }
        Deleting.items.splice(itemIndex, 1);

        await Deleting.save();

        res.status(200).json({message:"Item deleted successfully"});


    }catch(err){
        res.status(500).json({message:"server error", error:err.message})
    }
});

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

router.post('/v1/categories/:categoryId/items/:itemId',async(req,res)=>{
    const {lastServiced} = req.body;
    const{categoryId,itemId}=req.params;

    try{
        const category=await Category.findById(categoryId);
        if(!category){
            res.status(400).json({message:"Category not found!!"});
        }
        const item=await category.items.id(itemId);
        if(!item){
            res.status(404).json({message:"Item not found in this category!!!"});
        }

        // Update the existing item's maintenance data
        const ItemMaintenance = { lastCleaningDate, lastCleanedBy, cleaningFrequency };

        // Push the new maintenance data to the item's ItemMaintainance array
        item.ItemMaintainance.push(ItemMaintenance);

        console.log('Item before saving:', item); // Verify the changes

        await category.save(); // Save the updated category with the modified item
        
        res.status(201).json({message:"Item Maintainance Added Successfully!!!!"});
    }catch(err){
        res.status(500).json({message:"server error", error:err.message})
    }
});
module.exports=router;