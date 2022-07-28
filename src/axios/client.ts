import axios, { Method, AxiosPromise, AxiosRequestConfig, AxiosResponse } from "axios";
import JsonBigInt from "json-bigint"
import router from "../pageRouter";
import store from "../store";
import LocalStorageController from "../utils/helper";
import utils from "../utils/utils";

interface DelayResolver {
  (value: AxiosResponse | PromiseLike<AxiosResponse>): void;
}
interface DelayRejector {
  (reason?: string): void;
}

const tokenStorage = new LocalStorageController<string>({
  key: '_t',
  serializer: (value) => value.toString(),
  deserializer: (raw) => raw,
});

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

const saveToken = (token: string): boolean => {
  if (typeof token !== 'string') {
    console.error("Setting token failed!", token);
    return false;
  }
  axiosInstance.defaults.headers.common[Authorization] = token;
  tokenStorage.set(token);
  console.log("登录成功");
  return true;
}


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
  send(method: Method, model: string, func: string, config?: AxiosRequestConfig<any>): AxiosPromise<any> {
    if (this.isLoging) {
      console.log('Waiting for Login', model, func);
      return this.getWaitingPromise(method, model, func, config);
    }
    return axiosInstance({
      ...config,
      method: method,
      url: `/${model}/${func}`,
    });
  }
  post(model: string, func: string, config?: AxiosRequestConfig<any>) {
    return this.send("POST", model, func, config);
  }
  get(model: string, func: string, config?: AxiosRequestConfig<any>) {
    return this.send("GET", model, func, config);
  }
  put(model: string, func: string, config?: AxiosRequestConfig<any>) {
    return this.send("PUT", model, func, config);
  }
  delete(model: string, func: string, config?: AxiosRequestConfig<any>) {
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
  /** 登录时的请求等待队列 */
  private waitingQueue: [DelayResolver, DelayRejector, Method, string, string, (AxiosRequestConfig<any> | undefined)?][] = [];
  private getWaitingPromise(method: Method, model: string, func: string, config: AxiosRequestConfig<any> | undefined): AxiosPromise<any> {
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
      let result = saveToken(token);
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