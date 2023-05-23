# Butler Database Architecture

Butler 使用 DynamoDB 来存储数据，主要 Table 如下：

## app

```json
{
  "id": {
    "S": "小程序的 appId"
  },
  "secret": {
    "S": "小程序的 appSecret"
  }
}
```

## user

```json
{
  "openid": {
    "S": "小程序用户的 openid"
  },
  "nickname": {
    "S": "用户的昵称，支持自定义"
  },
  "tokenCode": {
    "S": "用户的 token，系统生成，访问小程序的唯一凭证"
  },
  "tokenExpires": {
    "N": "token 的有效期，用户登录 24 小时后过期"
  },
  "joinCode": {
    "S": "邀请码，只能由账本管理员生成，并在成功邀请账本协管员后销毁"
  },
  "withUser": {
    "S": "账本管理员的 openid，有此属性者为账本协管员"
  }
}
```

## transaction

```json
{
  "id": {
    "S": "交易的 id，系统生成"
  },
  "direction": {
    "N": "交易类型：1 收入，2 支出，3 转账"
  },
  "dateYear": {
    "N": "交易日期的年"
  },
  "dateMonth": {
    "N": "交易日期的月"
  },
  "dateDay": {
    "N": "交易日期的日"
  },
  "summary": {
    "S": "摘要"
  },
  "amount": {
    "N": "金额"
  },
  "account": {
    "S": "账户，可维护"
  },
  "category": {
    "S": "分类，可维护"
  },
  "ledger": {
    "S": "账本，使用账本管理员的 openid"
  },
  "createUser": {
    "S": "交易记录的创建用户，系统填写"
  },
  "createDate": {
    "N": "交易记录的创建时间，系统填写"
  },
  "isDeleted": {
    "BOOL": "是否已删除，在小程序中对交易记录进行的删除都是软删除"
  },
  "deleteUser": {
    "S": "交易记录的删除用户，系统填写"
  },
  "deleteDate": {
    "N": "交易记录的删除时间，系统填写"
  },
  "originalId": {
    "S": "原始 id，修改交易记录时，会创建新的交易记录，并记录旧交易记录的 id，同时对旧的交易记录进行软删除"
  }
}
```

## account

```json
{
  "id": {
    "S": "账户的 id，系统生成"
  },
  "label": {
    "S": "显示的文本"
  },
  "currency": {
    "S": "币种"
  },
  "amount": {
    "N": "账户余额"
  },
  "order": {
    "N": "排序优先级，数字越大排序越靠前"
  },
  "createUser": {
    "S": "账户的创建用户，系统填写"
  },
  "createDate": {
    "N": "账户的创建时间，系统填写"
  },
  "isDeleted": {
    "BOOL": "是否已删除"
  },
  "updateLog": {
    "S": "账户的更新记录，系统填写"
  }
}
```

## category

```json
{
  "id": {
    "S": "分类的 id，系统生成"
  },
  "direction": {
    "N": "交易类型：1 收入，2 支出，3 转账"
  },
  "label": {
    "S": "显示的文本"
  },
  "order": {
    "N": "排序优先级，数字越大排序越靠前"
  },
  "createUser": {
    "S": "分类的创建用户，系统填写"
  },
  "createDate": {
    "N": "分类的创建时间，系统填写"
  },
  "isDeleted": {
    "BOOL": "是否已删除"
  },
  "updateLog": {
    "S": "分类的更新记录，系统填写"
  }
}
```