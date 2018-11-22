const httpServer = require('http-server')


const fs = require('fs')
const agentJsFile = fs.readFileSync(require.resolve('@percy/agent/dist/public/percy-agent.js')).toString()
const percySnapshot = function(name, options = {}) {
  browser.executeScript(agentJsFile)
  browser.executeScript('(new PercyAgent()).snapshot(\'protractor snapshot\')')
}

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

  afterEach(function() {
    // Clear local storage between tests so that we always start with a clean slate.
    browser.executeScript('window.localStorage.clear()')
  })

  it('Loads the app', function() {
    browser.get(TEST_URL)
    expect(element(by.css('section.todoapp')).isPresent()).toBe(true)
    percySnapshot("test snapshot from protractor")
  })

  it('Accepts a new todo', function() {
    browser.get(TEST_URL)
    element(by.css('.new-todo')).sendKeys('New fancy todo', protractor.Key.ENTER)

    element.all(by.css('.todo-list li')).then(function(todos) {
      expect(todos.length).toBe(1)
    })
  })

  it('Lets you check off a a todo', function() {
    browser.get(TEST_URL)
    element(by.css('.new-todo')).sendKeys('A thing to accomplish', protractor.Key.ENTER)

    let itemsLeftText = element(by.css('.todo-count')).getText()
    expect(itemsLeftText).toBe('1 item left')

    element(by.css('input.toggle')).click()

    itemsLeftText = element(by.css('.todo-count')).getText()
    expect(itemsLeftText).toBe('0 items left')
  })
})
