let asyncOp0 = () => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, 1500, ['ASYNC00'])
    // setTimeout(reject, 1500, new Error('ASYNC00'))
  })
};
let asyncOp1 = (result) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, 1500, [...result, 'ASYNC001'])
    // setTimeout(reject, 1500, new Error('ASYNC01'))
  })
};
let asyncOp2 = (result) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, 1500, [...result, 'ASYNC002'])
    // setTimeout(reject, 1500, new Error('ASYNC02'))
  })
};