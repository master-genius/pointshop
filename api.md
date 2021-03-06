## API文档

----

**所有接口都在域名：https://api.modelese.cn/ 下。所有接口遵循RESTFul模式，所有提交数据的格式都按照JSON文本提交。消息头content-type统一设置为text/plain，注意不需要设置成application/json，程序会自动解析处理。**

### 测试用户信息


| id | openid | role | token |
| ---- | ---- | ---- | ---- |
| test_101 | test_101_wx | user | test101a20200228 |
| test_102 | test_102_wx | user | test102a20200228 |
| test_admin | test_admin_wx | user | testadmina20200228 |



### 权限

依靠微信的用户体系，这要求依据微信公众号的OpenID作为用户唯一标识，当用户通过微信打开页面时，会进行微信授权的过程。所有的接口操作都要在此基础上完成，相当于在请求时，中间件经过这一层会话验证处理。

**所有接口都要在url上携带token参数**

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

所有处理过程都需要在会话token检测通过的情况下进行，而页面跳转和接口调用都需要token，这要求两种模式都要满足，在接口来说，只需要获取到token时，通过fetch调用接口携带token即可，而对于页面来说，在微信菜单中跳转的链接是固定的，具体的会话处理逻辑如下图示。

### 会话处理逻辑

![](images/积分系统会话处理逻辑.png)

### 核心功能和所需接口

![](images/api-design.jpg)


### 积分管理接口

**获取垃圾一级分类信息**

```
请求：GET
接口：/trash/class
返回值：
{
    "status" : "OK",
    "data" : [
        {"id" : "...", "tname" : "..."},
        {"id" : "...", "tname" : "..."}
    ]
}
```

**获取垃圾分类信息**

```
请求：GET
接口：/trash/class/:id
:id是参数，要替换为具体的分类id，比如/trash/class/yi-la-guan
返回值：
{
    "status" : "OK",
    "data" : [
        {
            "id" : "...",
            "tname" : "...", //子分类名称
            "cash" : "",   //1积分对应金额
            "weight" : "" //1积分对应称重
        },
        {
            "id" : "...",
            "tname" : "...",
            "cash" : "",
            "weight" : ""
        }
    ]
}
```

**提交垃圾收取信息并获取积分验证码**

```
请求：POST
接口：/user/point

提交数据格式：JSON文本
content-type设置为text/plain

数据字段:

{
    "trash_weight" : "",
    "trash_type" : ""
}

正确返回值：
{
    "status" : "OK",
    "data" : "1234945"
}

错误返回值示例：
{
    "status" : "EFAILD"
    "errmsg" : "请求失败"
}

在获取到验证码以后，只有20分钟的有效期。

```

**获取用户的积分记录总数**

```
请求：GET
路径：/user/point-count

返回值：

{
    "status" : "OK",
    "data" : 10
}

```

**获取用户当前积分等基本信息**

```
请求：GET
路径：/user/info

返回值：
{
    "status" : "OK",
    "data" : {
        "points" : 100,
        "wxinfo" : {
            //微信授权获取的信息
        }
    }
}
```

**获取积分记录**

```
请求：GET
路径：/user/point
URL参数：offset表示偏移量，表示从第几个记录开始，year是四位数字表示年份，默认为当前年份。
URL参数都不是必须的，offset默认为0。每次返回20条数据。要做分页处理需要使用获取积分记录总数配合。

返回值：
{
    "status" : "OK",
    "data" : [
        {
            "id" : "",
            "point_type" : "",
            "points" : "",
            "trash_weight" : ""
        }
    ]
}

```


----


### 用户商品和订单接口


#### 获取商品总数

```
GET /user/goods-count

返回值：
{
    "status" : "OK",
    "data" : TOTAL_GOODS
}

```


#### 获取商品信息


```
GET /user/goods/:id

返回值

{
    id : ID, // 商品ID
    goods_name : "GOODS_NAME", //商品名称
    points : "POINTS", //需要的积分
    goods_image : "GOODS_IMAGES", //商品图片
    detail : "DETAIL", //相信信息
    storage : "STORAGE" //库存
}

```

#### 获取商品列表

```
GET /user/goods

URL参数：page指定页数，默认为1

返回值
{
    status : "OK",
    data : [
        {
            id: "",
            goods_name : "",
            goods_image : "",
            points : ""
        }
        ...
    ]
}

每次返回20条数据。
```

#### 创建订单

```
POST /user/order

要提交的数据：
    body中提交JSON文本
    {
        "goods_id" : "GOODS_ID",
        "number" : 1
    }

header部分，content-type设置为text/plain


返回值

{
    status : "OK",
    data : "ORDER_ID"    
}

```

#### 获取订单总数

```
GET /user/order-count

返回值
{
    status : "OK",
    data : "TOTAL-ORDER"
}

```

#### 获取订单列表

```
GET /user/order

URL参数支持page来指定页数

返回值
{
    status : "OK",
    data : [
        {
            id : "ID",
            order_time : "ORDER_TIME", 
            order_status : "ORDER_STATUS", //订单状态 0：未完成；1：已完成；2：取消
            goods_id : "GOODS_ID",
            points : "POINTS",
            number : "NUMBER"
        }
        ...
    ]
}

每次返回20条

```


#### 获取订单信息

```
GET /user/order/:id

返回值

{
    status : "OK",
    data : {
        id : "ID",
        order_time : "ORDER_TIME", 
        order_status : "ORDER_STATUS", //订单状态 0：未完成；1：已完成；2：取消
        goods_id : "GOODS_ID",
        points : "POINTS",
        number : "NUMBER",
        goods_name : "",
        goods_image : ""
    }
}


```

#### 取消订单

```
PUT /user/order/:id
要提交的数据：
body携带JSON文本
{
    "action" : "cancel"
}

返回值：
{
    status : "OK",
    data : "success"
}

```
