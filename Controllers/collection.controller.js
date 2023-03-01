import { Collection } from '../models/collection.schema'
import asyncHandler from '../services/asynchandler'
import CustomError from '../utils/customError'

export const createCollection = asyncHandler(async (req, res) => {
    const {name} = req.body

    if(!name) {
        throw new CustomError("Collection name is required", 400)
    }
    const collection = await Collection.create({
        name
    })
    res.status(200).json({
        success: true,
        message: "Collection created successfully",
        collection
    })
})

export const updateCollection = asyncHandler(async (req, res) => {
    const {id: collectionId} = req.params
    const {name} = req.body
    if(!name) {
        throw new CustomError("Collection name is required", 400)
    }
    let updatedCollection = await Collection.findByIdAndUpdate(
        collectionId,
        {
            name,
        },
        {
            new: true,
            runValidators: true
        }
    )
    if(!updatedCollection) {
        throw new CustomError("Collection not found", 400)
    }
    res.status(200).json({
        success: true,
        message: " Collection updated Successfully",
        updatedCollection
    })
})

export const deleteCollection = asyncHandler(async (req, res) => {
    const {id: collectionId} = req.params
    const collection = await Collection.findByIdAnddelete(collectionId)
    
    if(!collection){
        throw new CustomError("Collection not found", 400)
    }
    collection.remove()
    res.status(200).json({
        success: true,
        message: " Collection deleted Successfully",
        // collection
    })
})

export const getAllCollections = asyncHandler(async (req, res) => {
    const collections = await Collection.find()
    if(!collections) {
        throw new CustomError("Collections not found", 400)
    }
    res.status(200).json({
        success: true,
        message: " Collection retrieved Successfully",
        collections
    })
})