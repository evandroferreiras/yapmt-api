import mongoose, { Schema } from 'mongoose'

const projectSchema = new Schema({
  title: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

projectSchema.methods = {
  view (full) {
    const view = {
      id: this.id,
      title: this.title,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
    } : view
  }
}

const model = mongoose.model('Project', projectSchema)

export const schema = model.schema
export default model
