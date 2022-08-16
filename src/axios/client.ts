import axios, { Method, AxiosPromise, AxiosRequestConfig, AxiosResponse } from "axios";
import JsonBigInt from "json-bigint"
import router from "../router";
import store from "../store";
import { StorageString } from "../utils/helper";
import utils from "../utils/utils";

interface DelayResolver {
  (value: AxiosResponse | PromiseLike<AxiosResponse>): void;
}
interface DelayRejector {
  (reason?: string): void;
}

const tokenStorage = new StorageString('_t');

const Authorization = "Authorization";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_HOST + "/v1",
});

const fontStyle = {
  request: 'color:orange;font-size:10px;',
  response: 'color:blue;font-size:10px;'
}

axiosInstance.interceptors.request.use((config) => {
  console.log(`%c${(new Date()).toLocaleString()} [${config.method}]%o`, fontStyle.request, config.url, config.method == "get" ? config.params : config.data);
  return config;
}, (err) => {
  return Promise.reject(err)
})

axiosInstance.interceptors.response.use((resp) => {
  console.log(`%c${(new Date()).toLocaleString()} [${resp.config.method}(${resp.status})]%o`, fontStyle.response, resp.config.url, resp.data)
  return resp;
}, async (err) => {
  console.error(err)
  if (err.response && err.response.status == 401) {
    console.log("登录失效")
    const config = err.config as AxiosRequestConfig;
    // 如果是因为没有携带 Authorization 的话，重新登录
    if (!config.headers?.[Authorization]) {
      console.log("自动尝试重新登录")
      let succ = await client.loginWithToken();
      if (succ) {
        console.log("尝试恢复请求...")
        return await axiosInstance({ ...config });
      } else {
        console.log("登录失败")
      }
    } else {
      // window.location.href = '/login'
      utils.showTopTips("请先登录")
      router.push('/login');
    }
  }
  return Promise.reject(err)
})

// 转换big int
axiosInstance.defaults.transformResponse = [data => {
  if (data) {
    try {
      return JsonBigInt.parse(data)
    } catch (e) {
      console.error(e)
      return data
    }
  }
  return data
}]

type ClientConfig = AxiosRequestConfig & ClientAdditionConfig;

interface ClientAdditionConfig {
  /** 错误码映射，如果为字符串则自动弹出提示，如果为函数，则执行 */
  code?: ClientConfigCodeMap
  /** 成功回调，返回值不包括 code 的情况才会触发 */
  onSuccess?: RespCallback
  /** 失败回调，try-catch 捕获代码块抛出的错误 */
  onFailed?: (e: any) => void
  /** 完成回调，不管成功与失败都会执行 */
  onCompleted?: () => void
  /** 是否让错误也通过 */
  ignoreError?: boolean
}

type ClientConfigCodeMap = { [code: number]: CodeValue }
type CodeValue = string | RespCallback;
type RespCallback = (arg: AxiosResponse) => void;

class Client {
  isLoging: boolean = false;
  /**
   * 发送命令
   * @param method http方法
   * @param model 模块
   * @param func 函数
   * @param config axios配置
   * @returns 
   */
  async send(method: Method, model: string, func: string, config?: ClientConfig): Promise<AxiosResponse<any, any>> {
    if (this.isLoging) {
      console.log('Waiting for Login', model, func);
      return this.getWaitingPromise(method, model, func, config);
    }
    // 错误码处理
    const code_map: ClientConfigCodeMap = {};
    if (config?.code) {
      Object.assign(code_map, config?.code);
      delete config!.code;
    }
    // 回调
    const onSuccess = config?.onSuccess;
    const onFailed = config?.onFailed;
    const onCompleted = config?.onCompleted;
    const ignoreError = config?.ignoreError;

    // 删除字段
    onSuccess && (delete config.onSuccess);
    onFailed && (delete config.onFailed);
    onCompleted && (delete config.onCompleted);
    ignoreError !== void 0 && (delete config!.ignoreError);

    try {
      const resp = await axiosInstance({
        ...config,
        method: method,
        url: `/${model}/${func}`,
      });
      let code = resp.data.code;
      // 错误码处理
      if (typeof code === 'number') {
        if (code in code_map) {
          let item = code_map[code];
          if (typeof item === "string") {
            utils.showTopTips(item);
          } else if (typeof item === 'function') {
            try {
              item(resp);
            } catch (e) {
              console.error(e);
            }
          }
        }
      } else {
        onSuccess?.(resp);
      }
      return resp;
    } catch (e) {
      if (onFailed) {
        onFailed!(e);
      }
      if (ignoreError) {
        return {
          status: 0,
          statusText: 'ignore',
          data: {},
        } as AxiosResponse;
      }
      throw e
    } finally {
      onCompleted?.();
    }
  }
  post(model: string, func: string, config?: ClientConfig) {
    return this.send("POST", model, func, config);
  }
  get(model: string, func: string, config?: ClientConfig) {
    return this.send("GET", model, func, config);
  }
  put(model: string, func: string, config?: ClientConfig) {
    return this.send("PUT", model, func, config);
  }
  delete(model: string, func: string, config?: ClientConfig) {
    return this.send("DELETE", model, func, config);
  }
  /**
   * @returns 是否登录
   */
  isLogined(): boolean {
    return axiosInstance.defaults.headers.common[Authorization] != null;
  }
  /**
   * 账号密码登录
   * @param nick 账号
   * @param pwd 密码
   * @returns 
   */
  loginWithAccount(nick: string, pwd: string): Promise<boolean> {
    return this.wrapLoginCall(() => this.post('user', 'login', {
      data: { nick, pwd },
      headers: {
        [Authorization]: "Bearer 123"
      },
      code: {
        201: '请输入密码',
        202: '密码错误',
        203: '用户不存在',
      }
    }));
  }

  /**
   * token登录
   * @returns 
   */
  async loginWithToken(): Promise<boolean> {
    const token = tokenStorage.get();
    if (token != null) {
      console.log('缓存登录')
      const result = await this.wrapLoginCall(() => this.get('user', 'token_refresh', {
        headers: {
          [Authorization]: token
        }
      }));
      if (!result) {
        tokenStorage.remove()
      }
      return result
    }
    return false;
  }
  /**
   * 退出登录
   */
  logout(): void {
    delete axiosInstance.defaults.headers.common[Authorization] // 移除缓存
    tokenStorage.remove() // 移除存储
    store.commit('logout') // 清空登录数据
    router.push('/login') // 跳转到登录页
    window.location.reload() // 重新加载
  }

  /** axios 只读实例 */
  get axiosInstance() { return axiosInstance }

  /** 登录时的请求等待队列 */
  private waitingQueue: [DelayResolver, DelayRejector, Method, string, string, (ClientConfig | undefined)?][] = [];
  private getWaitingPromise(method: Method, model: string, func: string, config: ClientConfig | undefined): AxiosPromise<any> {
    return new Promise<AxiosResponse>((resolve, reject) => {
      this.waitingQueue.push([resolve, reject, method, model, func, config]);
    })
  }

  /**
   * 登录的包装方法
   * @param acitonCall 登录的实际调用
   * @returns 
   */
  private async wrapLoginCall(acitonCall: () => AxiosPromise): Promise<boolean> {
    let resp: AxiosResponse;
    /// 登录
    try {
      const request = acitonCall();
      this.isLoging = true
      resp = await request;
      this.isLoging = false
      let token = resp.data["token"];
      let user = resp.data["user"];
      if (!token || !user) {
        throw Error("Login Response Error");
      }
      let result: boolean
      if (typeof token !== 'string') {
        console.error("Setting token failed!", token);
        result = false;
      } else {
        axiosInstance.defaults.headers.common[Authorization] = token;
        tokenStorage.set(token);
        console.log("登录成功");
        result = true;
      }

      store.commit('changeUser', user);

      // 登录成功，所有待请求的直接申请
      let total = this.waitingQueue.length;
      while (this.waitingQueue.length) {
        let len = this.waitingQueue.length;
        let data = this.waitingQueue.shift()!;
        let [resolve, _, method, model, func, config] = data;
        console.log(`处理延迟任务(${len}/${total}):`, model, func, config);
        try {
          const resp = await this.send(method, model, func, config);
          resolve(resp);
        } catch (e) {
          console.error(e);
        }
      }
      if (router.currentRoute.value.name == "login") {
        router.push("/")
      }

      return result;
    } catch (e) {
      console.error(e)
      // 登录失败 全部请求失败 reject
      while (this.waitingQueue.length) {
        let data = this.waitingQueue.shift()!;
        let [_, reject] = data;
        reject("Login Failed");
      }
      return false
    } finally {
      this.isLoging = false
    }
  }
}

const client = new Client();
export default client;

(window as any).client = client;