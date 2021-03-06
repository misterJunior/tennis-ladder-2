import { createUsers, flushAll } from './specHelper'


async function endOfThread(){
  return new Promise((resolve, reject) => {
    setTimeout(resolve, 1)
  })
}


describe('single user, modifying the state, firing a single change event : ', () => {

  async function singleUserAndSpy(){
    const users = await createUsers(1)
    const user = users[0]
    const spy = jasmine.createSpy('spy')
    user.on('change', spy)
    return [user, spy]
  }

  it('sets a primitive string property on a map', async (done) => {
    const [user, spy] = await singleUserAndSpy()
    user.name = 'Henry'
    expect(user.name).toEqual('Henry')
    await endOfThread()
    expect(spy.calls.count()).toEqual(1)
    done()
  })

  it('sets a primitive number property on a map', async (done) => {
    const [user, spy] = await singleUserAndSpy()
    user.child = 4
    expect(user.child).toEqual(4)
    await endOfThread()
    expect(spy.calls.count()).toEqual(1)
    done()
  })

  it('sets a map property on a map', async (done) => {
    const [user, spy] = await singleUserAndSpy()
    user.child = {}
    expect(user.child).toEqual({})
    await endOfThread()
    expect(spy.calls.count()).toEqual(1)
    done()
  })

  it('sets an array property on a map', async (done) => {
    const [user, spy] = await singleUserAndSpy()
    user.child = []
    expect(user.child).toEqual([])
    await endOfThread()
    expect(spy.calls.count()).toEqual(1)
    done()
  })

  it('sets a populated map property on a map', async (done) => {
    const [user, spy] = await singleUserAndSpy()
    user.child = {a:1}
    expect(user.child).toEqual( {a:1} )
    await endOfThread()
    // because of timing issues, sometimes two events will be fired
    // This is an area for possible future improvement, to try and make
    // it always fire once
    expect([2, 1].includes(spy.calls.count())).toBe(true)
    done()
  })

  it('sets a populated list property on a map', async (done) => {
    const [user, spy] = await singleUserAndSpy()
    user.child = [1, 2, 5, 42, 8]
    expect(user.child).toEqual( [1, 2, 5, 42, 8])
    await endOfThread()
    expect(spy.calls.count()).toEqual(1)
    done()
  })

  it('sets a deeper structure on a map', async (done) => {
    const [user, spy] = await singleUserAndSpy()
    user.child = { x : { y : 1}}
    expect(user.child).toEqual( { x : { y : 1}} )
    await endOfThread()
    expect([2, 1].includes(spy.calls.count())).toBe(true)
    done()
  })

  it('increments a value', async (done) => {
    const [user, spy] = await singleUserAndSpy()
    user.child = { x : 1}
    user.child.x++
    expect(user.child.x).toEqual( 2 )
    await endOfThread()
    expect(spy.calls.count()).toEqual(1)
    done()
  })

  it('list.push', async (done) => {
    const [user, spy] = await singleUserAndSpy()
    user.child = []
    user.child.push('apple')
    expect(user.child).toEqual( ['apple'] )
    await endOfThread()
    expect([2, 1].includes(spy.calls.count())).toBe(true)
    done()
  })

  it('list.pop', async (done) => {
    const [user, spy] = await singleUserAndSpy()
    user.child = [1,2,3]
    user.child.pop()
    expect(user.child).toEqual( [1,2] )
    await endOfThread()
    expect(spy.calls.count()).toEqual(1)
    done()
  })

  it('list.shift', async (done) => {
    const [user, spy] = await singleUserAndSpy()
    user.child = [1,2,3]
    user.child.shift()
    expect(user.child).toEqual( [2,3] )
    await endOfThread()
    expect(spy.calls.count()).toEqual(1)
    done()
  })

  it('list.unshift', async (done) => {
    const [user, spy] = await singleUserAndSpy()
    user.child = [1,2,3]
    user.child.unshift(19)
    expect(user.child).toEqual( [19, 1, 2,3] )
    await endOfThread()
    expect([2, 1].includes(spy.calls.count())).toBe(true)
    done()
  })

  it('push a type on a list', async (done) => {
    const [user, spy] = await singleUserAndSpy()
    user.child = []
    user.child.push({v : 1})
    expect(user.child).toEqual( [{ v : 1}] )
    await endOfThread()
    //expect(spy.calls.count()).toEqual(1)
    done()
  })

})



describe('two users, modifying the state and synchronising : ', () => {

  async function twoUsersAndSpys(){
    const users = await createUsers(2)
    const user1 = users[0]
    const user2 = users[1]
    const spy1 = jasmine.createSpy('spy1')
    const spy2 = jasmine.createSpy('spy2')
    user1.on('change', spy1)
    user2.on('change', spy2)
    return [user1, spy1, user2, spy2]
  }

  it('sets a primitive string property on a map', async (done) => {
    const [user1, spy1, user2, spy2] = await twoUsersAndSpys()
    user1.name = 'Henry'
    await flushAll()
    expect(user2.name).toEqual('Henry')
    done()
  })

    it('sets a primitive number property on a map', async (done) => {
    const [user1, spy1, user2, spy2] = await twoUsersAndSpys()
    user1.child = 4
    await flushAll()
    expect(user2.child).toEqual(4)
    //expect(spy.calls.count()).toEqual(1)
    done()
  })

  it('sets a map property on a map', async (done) => {
    const [user1, spy1, user2, spy2] = await twoUsersAndSpys()
    user1.child = {}
    await flushAll()
    expect(user2.child).toEqual({})
    //expect(spy.calls.count()).toEqual(1)
    done()
  })

  it('sets an array property on a map', async (done) => {
    const [user1, spy1, user2, spy2] = await twoUsersAndSpys()
    user1.child = []
    await flushAll()
    expect(user2.child).toEqual([])
    //expect(spy.calls.count()).toEqual(1)
    done()
  })

  it('sets a populated map property on a map', async (done) => {
    const [user1, spy1, user2, spy2] = await twoUsersAndSpys()
    user1.child = {a:1}
    await flushAll()
    expect(user2.child).toEqual( {a:1} )
    //expect(spy.calls.count()).toEqual(1)
    done()
  })

  it('sets a populated list property on a map', async (done) => {
    const [user1, spy1, user2, spy2] = await twoUsersAndSpys()
    user1.child = [1, 2, 5, 42, 8]
    await flushAll()
    expect(user2.child).toEqual( [1, 2, 5, 42, 8])
    //expect(spy.calls.count()).toEqual(1)
    done()
  })

  it('sets a deeper structure on a map', async (done) => {
    const [user1, spy1, user2, spy2] = await twoUsersAndSpys()
    user1.child = { x : { y : 1}}
    await flushAll()
    expect(user2.child).toEqual( { x : { y : 1}} )
    //expect(spy.calls.count()).toEqual(1)
    done()
  })

  it('increments a value', async (done) => {
    const [user1, spy1, user2, spy2] = await twoUsersAndSpys()
    user1.child = { x : 4}
    await flushAll()
    user1.child.x++
    await flushAll()
    expect(user2.child.x).toEqual( 5 )
    //expect(spy.calls.count()).toEqual(1)
    done()
  })

  it('list.push', async (done) => {
    const [user1, spy1, user2, spy2] = await twoUsersAndSpys()
    user1.child = []
    user1.child.push('apple')
    await flushAll()
    expect(user2.child).toEqual( ['apple'] )
    //expect(spy.calls.count()).toEqual(1)
    done()
  })

  it('list.pop', async (done) => {
    const [user1, spy1, user2, spy2] = await twoUsersAndSpys()
    user1.child = [1,2,3]
    user1.child.pop()
    await flushAll()
    expect(user2.child).toEqual( [1,2] )
    //expect(spy.calls.count()).toEqual(1)
    done()
  })

  it('list.shift', async (done) => {
    const [user1, spy1, user2, spy2] = await twoUsersAndSpys()
    user1.child = [1,2,3]
    user1.child.shift()
    await flushAll()
    expect(user2.child).toEqual( [2,3] )
    //expect(spy.calls.count()).toEqual(1)
    done()
  })

  it('list.unshift', async (done) => {
    const [user1, spy1, user2, spy2] = await twoUsersAndSpys()
    user1.child = [1,2,3]
    user1.child.unshift(19)
    await flushAll()
    expect(user2.child).toEqual( [19, 1, 2,3] )
    //expect(spy.calls.count()).toEqual(1)
    done()
  })

  it('push a type on a list', async (done) => {
    const [user1, spy1, user2, spy2] = await twoUsersAndSpys()
    user1.child = []
    user1.child.push({v : 1})
    await flushAll()
    expect(user2.child).toEqual( [{ v : 1}] )
    done()
  })



})