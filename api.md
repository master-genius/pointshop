## API文档

----

所有接口都在域名：https://api.modelese.cn/ 下。所有接口遵循RESTFul模式，所有提交数据的格式都按照JSON文本提交。消息头content-type统一设置为text/plain，注意不需要设置成application/json，程序会自动解析处理。

### 权限

依靠微信的用户体系，这要求依据微信公众号的OpenID作为用户唯一标识，当用户通过微信打开页面时，会进行微信授权的过程。所有的接口操作都要在此基础上完成，相当于在请求时，中间件经过这一层会话验证处理。

### 接口返回值

返回值为JSON格式，其中status字段肯定存在，status为'OK'，表示执行成功，否则表示失败，同时会有errmsg描述错误信息。

**成功返回值**

```
{
    "status": "OK",
    "data" : DATA
}
```

**失败返回值示例**

```
{
    "status" : "EFAILED",
    "errmsg" : "set point failed"
}
```

<br>

### 积分管理接口

**设置积分**

```
PUT /user/point

提交JSON格式数据：
{
    "point" : 123,
    "type"  : "add"
}

type字段的值可以是add、reduce、set。add表示增加，set表示直接更新，reduce表示减少。

```

### 查询积分

```
GET /user/point



```