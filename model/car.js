import mongoose, { Schema } from "mongoose"

const carSchema = mongoose.Schema(
  {
    carName: {
      type: String,
      required: true,
    },
    carImage: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    tags: {
      type: [String],
      lowercase: true,
    },
    location: {
      type: {
        type: String,
      },
      coordinates: [],
    },
  },
  { timestamps: true }
)

carSchema.index({ location: "2dsphere" })

export default mongoose.model("Car", carSchema)
