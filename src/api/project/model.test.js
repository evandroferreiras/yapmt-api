import { Project } from '.'

let project

beforeEach(async () => {
  project = await Project.create({ title: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = project.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(project.id)
    expect(view.title).toBe(project.title)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = project.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(project.id)
    expect(view.title).toBe(project.title)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
