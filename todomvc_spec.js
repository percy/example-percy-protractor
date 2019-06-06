const httpServer = require('http-server')
const { percySnapshot } = require("@percy/protractor")

describe('TodoMVC', function() {
  const PORT = 8000
  const TEST_URL = `http://localhost:${PORT}`
  let server

  beforeAll(function() {
    // Start a local server to serve our Angular Todo app.
    server = httpServer.createServer()
    server.listen(PORT)
  })

  afterAll(function() {
    // Shutdown our http server.
    server.close()
  })

  afterEach(async function() {
    // Clear local storage between tests so that we always start with a clean slate.
    await browser.executeScript('window.localStorage.clear()')
  })

  it('Loads the app', async function() {
    await browser.get(TEST_URL)
    expect(await element(by.css('section.todoapp')).isPresent()).toBe(true)
    await percySnapshot("Home page")
  })

  it('Accepts a new todo', async function() {
    await browser.get(TEST_URL)
    await element(by.css('.new-todo')).sendKeys('New fancy todo', protractor.Key.ENTER)

    const todos = await element.all(by.css('.todo-list li'))
    expect(todos.length).toBe(1)

    await percySnapshot("New todo", { widths: [768, 992, 1200] })
  })

  it('Lets you check off a a todo', async function() {
    await browser.get(TEST_URL)
    await element(by.css('.new-todo')).sendKeys('A thing to accomplish', protractor.Key.ENTER)

    let itemsLeftText = await element(by.css('.todo-count')).getText()
    await expect(itemsLeftText).toBe('1 item left')

    await element(by.css('input.toggle')).click()

    itemsLeftText = await element(by.css('.todo-count')).getText()
    await expect(itemsLeftText).toBe('0 items left')

    await percySnapshot("Checked-off todo", { widths: [300] })
  })
})
