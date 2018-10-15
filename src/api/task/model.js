import mongoose, { Schema } from 'mongoose'

const taskSchema = new Schema({
  project: {
    type: Schema.ObjectId,
    ref: 'Project'
  },
  description: {
    type: String,
    required: true
  },
  username: {
    type: String,
    validate: {
      validator: function validator (v) {
        return (v.startsWith('@') && v.length > 1)
      },
      message: props => `${props.value} not starts with '@'!`
    },
    required: true
  },
  dueTime: {
    type: String,
    validate: {
      validator: function validator (v) {
        try {
          const year = new Date().getFullYear()
          const value = new Date(`${year}/${v}`).getDate()
          if (isNaN(value)) {
            return false
          }
          return true
        } catch (error) {
          return false
        }
      },
      message: props => `${props.value} is not a valid due time!`
    },
    required: true
  },
  dueTimeDate: {
    type: Date
  },
  checked: {
    type: Boolean
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

taskSchema.methods = {
  dueTimeStatus () {
    try {
      const year = new Date().getFullYear()
      const date = new Date(`${year}/${this.dueTime}`).getDate()
      if (isNaN(date)) {
        return ''
      }
      if (date === new Date().getDate()) {
        return 'today'
      }
      if (date === new Date().getDate() - 1) {
        return 'yesterday'
      }
      if (date === new Date().getDate() + 1) {
        return 'tomorrow'
      }
      return this.dueTime
    } catch (error) {
      return error
    }
  },
  statusTask () {
    try {
      if (this.checked) {
        return 'completed'
      }
      const year = new Date().getFullYear()
      const date = new Date(`${year}/${this.dueTime}`).getTime()
      if (isNaN(date)) {
        return ''
      }
      const td = new Date()
      if (date >= new Date(td.getFullYear(), td.getMonth(), td.getDate()).getTime()) {
        return 'in-time'
      } else {
        return 'late'
      }
    } catch (error) {
      return error
    }
  },
  view (full) {
    const view = {
      id: this.id,
      description: this.description,
      username: this.username,
      dueTime: this.dueTime,
      dueTimeDate: this.dueTimeDate,
      checked: this.checked,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      project: this.project,
      dueTimeStatus: this.dueTimeStatus(),
      statusTask: this.statusTask()
    }

    return full ? {
      ...view
    } : view
  }
}

const model = mongoose.model('Task', taskSchema)

export const schema = model.schema
export default model
