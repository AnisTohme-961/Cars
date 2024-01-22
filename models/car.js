import mongoose, { Schema } from "mongoose"

const geoSchema = mongoose.Schema({
  type: {
    type: String,
    default: "Point",
  },
  coordinates: {
    type: [Number],
    index: "2dsphere",
  },
})

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
      required: false,
      default: null,
    },
    geometry: geoSchema,
  },
  { timestamps: true }
)

// console.log(geoSchema.index({ coordinates: '2dsphere' }, (err) => { // Checking if 2dsphere index is created or not
//   if (err) {
//     console.error('Error creating 2dsphere index:', err);
//   }else {
//     console.log('2dsphere index created')
//   }
// }));

export default mongoose.model("Car", carSchema)
