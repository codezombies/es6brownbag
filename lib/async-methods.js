let asyncOp0 = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(['ASYNC000'])
      //            reject(new Error('ERROR - ASYNC000'))
    }, 1500)
  })
};
let asyncOp1 = (result) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([...result, 'ASYNC001'])
                 // reject(new Error('ERROR - ASYNC001'))
    }, 1500)
  })
};
let asyncOp2 = (result) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([...result, 'ASYNC002'])
      //            reject(new Error('ERROR - ASYNC002:' + result))
    }, 1500)
  })
};