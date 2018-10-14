import { Task } from '.'

let task

beforeEach(async () => {
  task = await Task.create({ description: 'test', username: '@test', dueTime: '01/01', checked: true })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = task.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(task.id)
    expect(view.description).toBe(task.description)
    expect(view.username).toBe(task.username)
    expect(view.dueTime).toBe(task.dueTime)
    expect(view.checked).toBe(task.checked)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = task.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(task.id)
    expect(view.description).toBe(task.description)
    expect(view.username).toBe(task.username)
    expect(view.dueTime).toBe(task.dueTime)
    expect(view.checked).toBe(task.checked)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
