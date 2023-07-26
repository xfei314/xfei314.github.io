import srcAxios from "axios";
const instance = srcAxios.create({
  baseURL: "",
  timeout: 3000,
  headers: {},
});
// instance.defaults.headers.common["Authorization"] = AUTH_TOKEN;
instance.defaults.headers.post["Content-Type"] = "application/json";
export function setToken(token) {
  instance.defaults.headers.common["Authorization"] = token;
}
// 消息
const interceptorsRequest = [];
const interceptorsResponse = [];
export function addInterceptorsRequest(fn1, fn2) {
  interceptorsRequest.push([fn1, fn2]);
}
export function addInterceptorsResponse(fn1, fn2) {
  interceptorsResponse.push([fn1, fn2]);
}
// 请求队列中的 id index
let reqIdIndex = new Date().getTime();
function getReqId() {
  reqIdIndex++;
  return `r-${reqIdIndex}`;
}
let sendReqCount = 0; // 当前发请求 数量
const REQ_MAX = 5;
const reqList = []; // 待发送请求
const reqMap = {}; // 发送中的请求的数据

// 创建请求队列的数据
function createReq(args) {
  const req = {
    id: getReqId(),
    args,
    state: 0,
  };
  return req;
}

// 发送请求
async function send() {
  // 最大值
  if (sendReqCount >= REQ_MAX) {
    console.log(`send sendReqCount[${sendReqCount}] >= REQ_MAX[${REQ_MAX}]`);
    return;
  }
  // 取出第一个请求
  let reqId = reqList.shift();
  if (reqId === undefined) {
    // console.log("send reqId is undefined");
    return;
  }
  const req = reqMap[reqId];
  if (!req) {
    console.log("send req is empty");
    return;
  }
  sendReqCount++;
  req.state = 1; // 发送中
  send();

  let error = null;
  // 发送请求
  console.log("send args", req.args);
  const res = await instance(req.args).catch(err => {
    error = err;
  });
  req.state = 2; // 发送完成
  sendReqCount--;
  if (error) {
    // 请求失败
    req.cb({ state: false, data: error });
  } else {
    // 请求成功
    req.cb({ state: true, data: res });
  }
  delete reqMap[req.id];
  // 当前请求执行完成后 在调用一次 send
  send();
}

function request(args) {
  return new Promise((resolve, reject) => {
    const config = {};
    interceptorsRequest.forEach(fns => {
      Object.assign(config, fns[0](args));
    });
    const req = {
      ...createReq(config),
      cb: ({ state, data }) => {
        if (state) {
          console.log("res", data);
          // 请求成功
          interceptorsResponse.forEach(fns => {
            const fnResData = fns[0](data);
            if (fnResData) data = fnResData;
          });
          resolve(data);
        } else {
          console.error("data error ", data);
          // 请求error 是真请求失败了，还是 没有发送请求
          interceptorsResponse.forEach(fns => {
            Object.assign(data, fns[1](data));
          });
          reject(data);
        }
      },
    };
    reqMap[req.id] = req;
    reqList.push(req.id);
    send();
  });
}

export default request;
